////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: trapezi');

Service.trapezi = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.trapezi.miaPrefa = function(nodereq) {
	if (nodereq.isvoli())
	return;

	if (Service.trapezi.ipervasi(nodereq))
	return;

	DB.connection().transaction(function(conn) {
		Service.trapezi.miaPrefa1(nodereq, conn);
	});
};

Service.trapezi.miaPrefa1 = function(nodereq, conn) {
	var query = 'INSERT INTO `trapezi` (`pektis1`, `poll`) VALUES (' + nodereq.login.json() + ', NOW())';
	conn.query(query, function(conn, res) {
		if (conn.affectedRows == 1)
		return Service.trapezi.miaPrefa2(nodereq, conn, res.insertId);

		conn.rollback();
		nodereq.error('Απέτυχε η δημιουργία τραπεζιού');
	});
};

Service.trapezi.miaPrefa2 = function(nodereq, conn, trapezi) {
	var query;

	query = "UPDATE `sinedria` SET `trapezi` = " + trapezi + ", `thesi` = 1, " +
		"`simetoxi` = 'ΠΑΙΚΤΗΣ' WHERE `pektis` LIKE " + nodereq.login.json();
	conn.query(query, function(conn, res) {
		if (conn.affectedRows > 0)
		return Service.trapezi.miaPrefa3(nodereq, conn, trapezi);

		conn.rollback();
		nodereq.error('Απέτυχε η ενημέρωση της συνεδρίας');
	});
};

Service.trapezi.miaPrefa3 = function(nodereq, conn, trapezi) {
	var query = 'REPLACE INTO `prosklisi` (`trapezi`, `apo`, `pros`) VALUES (' +
		trapezi + ', ' + nodereq.login.json() + ', ' + nodereq.login.json() + ')';
	conn.query(query, function(conn, res) {
		if (conn.affectedRows > 0)
		return Service.trapezi.miaPrefa4(nodereq, conn, trapezi, res.insertId);

		conn.rollback();
		nodereq.error('Απέτυχε η δημιουργία πρόσκλησης');
	});
};

Service.trapezi.miaPrefa4 = function(nodereq, conn, trapezi, prosklisi) {
	var kinisi;

	conn.commit();
	nodereq.end();

	kinisi = new Kinisi('TR');
	kinisi.data.trapezi = {
		kodikos: trapezi,
		pektis1: nodereq.login,
	};

	Server.skiniko.
	processKinisi(kinisi).
	kinisiAdd(kinisi, false);

	kinisi = new Kinisi('PL');
	kinisi.data = {
		kodikos: prosklisi,
		trapezi: trapezi,
		apo: nodereq.login,
		pros: nodereq.login,
	};

	Server.skiniko.
	processKinisi(kinisi).
	kinisiAdd(kinisi);

	Service.trapezi.katagrafi[nodereq.login] = Globals.tora();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.trapezi.epilogi = function(nodereq) {
	var skiniko, trapezi;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('trapezi', true)) return;

	skiniko = Server.skiniko;
	trapezi = skiniko.skinikoTrapeziGet(nodereq.url.trapezi);

	if (!trapezi)
	return nodereq.error('Δεν βρέθηκε το τραπέζι επιλογής');

	if (trapezi.trapeziIsArvila(nodereq.login))
	return nodereq.error('Έχετε αποκλειστεί από αυτό το τραπέζι');

	nodereq.end();

	kinisi = new Kinisi({
		idos: 'ET',
		data: {
			trapezi: trapezi.kodikos,
			pektis: nodereq.login,
		},
	});

	skiniko.
	processKinisi(kinisi).
	idioIpCheck(nodereq.login).
	kinisiAdd(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Ακολουθεί υπηρεσία εξόδου παίκτη/θεατή από το τραπέζι.

Service.trapezi.exodos = function(nodereq) {
	var trapeziKodikos, trapezi, thesi;

	if (nodereq.isvoli()) return;

	trapeziKodikos = nodereq.sinedria.sinedriaTrapeziGet();
	if (!trapeziKodikos) return nodereq.end('Ακαθόριστο τραπέζι');

	trapezi = Server.skiniko.skinikoTrapeziGet(trapeziKodikos);
	if (!trapezi) return nodereq.end('Δεν βρέθηκε το τραπέζι στο σκηνικό');

	// Ελέγχουμε αν ο παίκτης συμμετέχει ως παίκτης στο τραπέζι από το οποίο εξέρχεται.
	// Σ' αυτή την περίπτωση θα πρέπει να κρατήσουμε στοιχεία τελευταίου καθημένου και
	// τελευταίας συμμετοχής.

	thesi = trapezi.trapeziThesiPekti(nodereq.login);
	if (thesi) DB.connection().transaction(function(conn) {
		Service.trapezi.exodosPektis(nodereq, conn, trapeziKodikos, thesi);
	});

	// Αλλιώς ο παίκτης συμμετέχει ως θεατής, οπότε η διαδικασία είναι μάλλον
	// απλούστερη.

	else Service.trapezi.exodosTheatis(nodereq);
};

//--------------------------------------------------------------------------------------------------------------------------@

// Πρώτο βήμα κατά την έξοδο του παίκτη από το τραπέζι στο οποίο συμμετέχει ως παίκτης
// είναι η ενημέρωση του σχετικού πεδίου στο συγκεκριμένο τραπέζι.

Service.trapezi.exodosPektis = function(nodereq, conn, trapezi, thesi) {
	var query;

	query = 'UPDATE `trapezi` SET `pektis' + thesi + '` = NULL WHERE `kodikos` = ' + trapezi;
	conn.query(query, function(conn, res) {
		if (conn.affectedRows < 1) {
			conn.rollback();
			return nodereq.error('Απέτυχε η έξοδος παίκτη από το τραπέζι');
		}

		Service.trapezi.exodosPektis2(nodereq, conn, trapezi, thesi);
	});
};

// Κατόπιν ενημερώνουμε τον πίνακα τελευταίου καθημένου με τα στοιχεία θέσης
// του εξερχόμενου παίκτη. Με άλλα λόγια καταγράφουμε ότι στο συγκεκριμένο
// τραπέζι, στη συγκεκριμένη θέση καθόταν ο συγκεκριμένος παίκτης.

Service.trapezi.exodosPektis2 = function(nodereq, conn, trapezi, thesi) {
	var query;

	query = 'REPLACE INTO `telefteos` (`trapezi`, `thesi`, `pektis`) VALUES (' +
		trapezi + ', ' + thesi + ', ' + nodereq.login.json() + ')';
	conn.query(query, function(conn, res) {
		if (conn.affectedRows < 1) {
			conn.rollback();
			return nodereq.error('Απέτυχε η ενημέρωση τελευταίου παίκτη');
		}

		Service.trapezi.exodosPektis3(nodereq, conn, trapezi, thesi);
	});
};

// Κατόπιν ενημερώνουμε τον πίνακα συμμετοχών όπου καταγράφουμε ότι στο συγκεκριμένο
// τραπέζι, ο συγκεκριμένος παίκτης κάθησε τελευταία φορά στη συγκεκριμένη θέση.

Service.trapezi.exodosPektis3 = function(nodereq, conn, trapezi, thesi) {
	var query;

	query = 'REPLACE INTO `simetoxi` (`trapezi`, `pektis`, `thesi`) VALUES (' +
		trapezi + ', ' + nodereq.login.json() + ', ' + thesi + ')';
	conn.query(query, function(conn, res) {
		if (conn.affectedRows < 1) {
			conn.rollback();
			return nodereq.error('Απέτυχε η ενημέρωση συμμετοχής');
		}

		conn.commit();
		Service.trapezi.exodos2(nodereq);
	});
};

//--------------------------------------------------------------------------------------------------------------------------@

// Κατά την έξοδο του θεατή από το τραπέζι, απλώς ενημερώνουμε τη σχετική συνεδρία
// καθαρίζοντας τα στοιχεία θέσης. Αυτό δεν το κάναμε στην περίπτωση της εξόδου
// του παίκτη από το τραπέζι, καθώς η κένωση τη συγκεκριμένης θέσης αρκεί για τη
// διόρθωση τυχόν λανθασμένων στοιχείων θέσης συνεδρίας κατά την επανεκκίνηση
// του skiser.

Service.trapezi.exodosTheatis = function(nodereq) {
	var query, conn;

	query = 'UPDATE `sinedria` SET `trapezi` = NULL, `thesi` = NULL, `simetoxi` = NULL ' +
		'WHERE `pektis` = ' + nodereq.login.json();
	conn = DB.connection();
	conn.query(query, function(conn, res) {
		conn.free();
		if (conn.affectedRows < 1)
		return nodereq.error('Απέτυχε η ενημέρωση της σνεδρίας');

		Service.trapezi.exodos2(nodereq);
	});
};

//--------------------------------------------------------------------------------------------------------------------------@

// Ακολουθεί το τελευταίο βήμα εξόδου παίκτη/θεατή από το τραπέζι. Πρόκειται
// για τη δημιουργία της σχετικής κίνησης, την επεξεργασία της στο σκηνικό
// του skiser και την τοποθέτησή της στο transaction log προκειμένου να
// ενημερωθούν και οι clients.

Service.trapezi.exodos2 = function(nodereq) {
	var kinisi;

	nodereq.end();

	kinisi = new Kinisi({
		idos: 'RT',
		data: {
			pektis: nodereq.login,
		},
	});

	Server.skiniko.
	processKinisi(kinisi).
	kinisiAdd(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.trapezi.diataxi = function(nodereq) {
	var trapezi;

	if (nodereq.isvoli()) return;
	if (nodereq.oxiTrapezi()) return;

	trapezi = nodereq.trapeziGet();

	if (trapezi.trapeziIsDianomi())
	return nodereq.error('Υπάρχει διανομή');

	switch (trapezi.trapeziThesiPekti(nodereq.loginGet())) {
	case 1: return Service.trapezi.diataxi2(nodereq, trapezi, 2, 3);
	case 2: return Service.trapezi.diataxi2(nodereq, trapezi, 1, 3);
	case 3: return Service.trapezi.diataxi2(nodereq, trapezi, 1, 2);
	}

	return nodereq.error('Δεν είστε παίκτης στο τραπέζι');
};

Service.trapezi.diataxi2 = function(nodereq, trapezi, h1, h2) {
	var p1, p2, kodikos, query, conn;

	p1 = trapezi.trapeziPektisGet(h1);
	p2 = trapezi.trapeziPektisGet(h2);
	kodikos = trapezi.trapeziKodikosGet();

	query = 'UPDATE `trapezi` SET `pektis' + h1 + '` = ' + (p2 ? p2.json() : 'NULL') +
		', `pektis' + h2 + '` = ' + (p1 ? p1.json() : 'NULL') + ' WHERE `kodikos` = ' + kodikos;
	conn = DB.connection();
	conn.query(query, function(conn, res) {
		conn.free();
		if (conn.affectedRows != 1)
		return nodereq.error('Δεν άλλαξε η διάταξη των παικτών');

		Service.trapezi.diataxi3(nodereq, kodikos, h1, p2, h2, p1);
	});
};

Service.trapezi.diataxi3 = function(nodereq, kodikos, h1, p1, h2, p2) {
	var kinisi;

	nodereq.end();
	kinisi = new Kinisi('DX');
	kinisi.data = {
		trapezi: kodikos,
		pektis: nodereq.loginGet(),
		h1: h1,
		p1: p1,
		h2: h2,
		p2: p2,
	};

	Server.skiniko.
	processKinisi(kinisi).
	kinisiAdd(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.trapezi.roloi = function(nodereq) {
	var trapezi, p1, a1, p2, a2, p3, a3, kodikos, query, conn;

	if (nodereq.isvoli())
	return;

	if (nodereq.sinedria.sinedriaOxiPektis()) {
		nodereq.url.thesi = nodereq.sinedria.sinedriaThesiGet();

		// Παρατηρήθηκε κάποια στιγμή το φαινόμενο η θέση να
		// είναι ακαθόριστη, οπότε γίνεται έλεγχος.

		if (!nodereq.url.thesi)
		return;

		nodereq.url.thesi = nodereq.url.thesi.epomeniThesi();
		Service.sinedria.thesiTheasis2(nodereq);
		return;
	}

	trapezi = nodereq.trapeziGet();

	if (trapezi.trapeziIsDianomi())
	return nodereq.error('Υπάρχει διανομή');

	if (trapezi.trapeziIsIdioktito())
	return nodereq.end('Το τραπέζι είναι ιδιόκτητο');

	p1 = trapezi.trapeziPektisGet(1);
	a1 = trapezi.trapeziApodoxiGet(1);

	p2 = trapezi.trapeziPektisGet(2);
	a2 = trapezi.trapeziApodoxiGet(2);

	p3 = trapezi.trapeziPektisGet(3);
	a3 = trapezi.trapeziApodoxiGet(3);

	kodikos = trapezi.trapeziKodikosGet();

	query = 'UPDATE `trapezi` SET ' +
		'`pektis1` = ' + (p3 ? p3.json() : 'NULL') + ', `apodoxi1` = ' + a3.json() + ', ' +
		'`pektis2` = ' + (p1 ? p1.json() : 'NULL') + ', `apodoxi2` = ' + a1.json() + ', ' +
		'`pektis3` = ' + (p2 ? p2.json() : 'NULL') + ', `apodoxi3` = ' + a2.json() + ' ' +
		'WHERE `kodikos` = ' + kodikos;
	conn = DB.connection();
	conn.query(query, function(conn, res) {
		conn.free();
		if (conn.affectedRows != 1)
		return nodereq.error('Δεν άλλαξε η διάταξη των παικτών');

		Service.trapezi.roloi2(nodereq, kodikos, p3, a3, p1, a1, p2, a2);
	});
};

Service.trapezi.roloi2 = function(nodereq, kodikos, p1, a1, p2, a2, p3, a3) {
	var kinisi;

	nodereq.end();
	kinisi = new Kinisi('RL');
	kinisi.data = {
		trapezi: kodikos,
		pektis: nodereq.loginGet(),
		p1: p1,
		a1: a1,
		p2: p2,
		a2: a2,
		p3: p3,
		a3: a3,
	};

	Server.skiniko.
	processKinisi(kinisi).
	kinisiAdd(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.trapezi.apodoxi = function(nodereq) {
	var trapezi, thesi, apodoxi, ixodopa;

	if (nodereq.isvoli()) return;
	if (nodereq.oxiPektis()) return;

	trapezi = nodereq.trapeziGet();
	if (!trapezi.trapeziKlidoma('trapezi.apodoxi'))
	return nodereq.error('Το τραπέζι είναι κλειδωμένο');

	thesi = trapezi.trapeziThesiPekti(nodereq.login);
	if (!thesi) {
		trapezi.trapeziXeklidoma();
		nodereq.error('Δεν είστε παίκτης στο τραπέζι');
		return;
	}

	if ((!Debug.flagGet('rithmisiPanta')) && trapezi.trapeziIsDianomi()) {
		trapezi.trapeziXeklidoma();
		nodereq.error('Υπάρχει διανομή');
		return;
	}

	apodoxi = trapezi.trapeziIsApodoxi(thesi);
	ixodopa = apodoxi ? 'ΟΧΙ' : 'ΝΑΙ';

	query = 'UPDATE `trapezi` SET `apodoxi' + thesi + '` = ' + ixodopa.json() +
		' WHERE `kodikos` = ' + trapezi.trapeziKodikosGet();
	conn = DB.connection();
	conn.query(query, function(conn, res) {
		conn.free();
		if (conn.affectedRows == 1)
		return Service.trapezi.apodoxi2(nodereq, trapezi, thesi, ixodopa);

		trapezi.trapeziXeklidoma();
		nodereq.error('Δεν άλλαξε κάτι στο τραπέζι');
	});
};

Service.trapezi.apodoxi2 = function(nodereq, trapezi, thesi, apodoxi) {
	var kinisi;

	nodereq.end();

	kinisi = new Kinisi('AX');
	kinisi.data = {
		trapezi: trapezi.trapeziKodikosGet(),
		thesi: thesi,
		apodoxi: apodoxi,
	};

	Server.skiniko.
	processKinisi(kinisi).
	kinisiAdd(kinisi);

	if (trapezi.trapeziApodoxiCount() < 3)
	return trapezi.trapeziXeklidoma();

	/*
	if (trapezi.trapeziIsDianomi())
	return trapezi.trapeziXeklidoma();
	*/

	Service.trapezi.dianomi(trapezi);
};

Service.trapezi.dianomi = function(trapezi, fail) {
	DB.connection().transaction(function(conn) {
		trapezi.trapeziNeaDianomi(conn, function(conn, dianomi, energia) {
			conn.commit();
			Server.skiniko.
			processKinisi(dianomi).
			processKinisi(energia).
			kinisiAdd(dianomi, false).
			kinisiAdd(energia);
			this.trapeziXeklidoma();
		}, fail);
	});
};

Service.trapezi.dianomiSeLigo = function(trapezi, delay) {
	var tzogos, kinisi;

	// Αν υφίσταται τζόγος τρέχουσας διανομής, τον στέλνουμε με τα δεδομένα
	// της νέας διανομής ώστε να μπορούν να τον δουν οι παίκτες.

	tzogos = trapezi.partidaTzogosGet();
	if (tzogos && (tzogos.xartosiaMikos() === 2)) {
		kinisi = new Kinisi({
			idos: 'ZP',
			data: {
				trapezi: trapezi.trapeziKodikosGet(),
				fila: tzogos.xartosia2string(),
			},
		});
		Server.skiniko.
		kinisiAdd(kinisi);
	}

	// Πρόκειται να μοιραστεί νέα διανομή. Έχουμε κρατημένα τα φύλλα της
	// τρέχουσας διανομής (όπως αυτά διαμορφώθηκαν μετά τη φάση της αγοράς)
	// στη λίστα "filaSave", οπότε τα αντιγράφουμε στη λίστα "filaPrev" από
	// την οποία αντλούνται για επίδειξη.

	trapezi.trapeziFilaPrevSet();

	if (delay === undefined)
	delay = 3000;

	setTimeout(function() {
		Service.trapezi.dianomi(trapezi);
	}, delay);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Το service "dianomiTora" δρομολογείται από τους παίκτες σε περιπτώσεις κατά
// τις οποίες η παρτίδα «κολλάει», προκειμένου να γίνει μια νέα διανομή. Τέτοια
// «κολλήματα» παρουσιάζονται συνήθως κατά το skiser reset, όπου οι παρτίδες στις
// οποίες έχει δρομολογηθεί νέα διανομή μπορεί να βρεθούν μετά το skjiser restart
// σε κάποια ενδιάμεση φάση χωρίς να υπάρχει δρομολογημένη διανομή. Σε τέτοιες
// περιπτώςσεις, λοιπόν, οι παίκτες μπορούν να δρομολογήσουν νέα διανομή.

Service.trapezi.dianomiTora = function(nodereq) {
	var trapezi, sinedria, pektis;

	if (nodereq.isvoli())
	return;

	trapezi = nodereq.trapeziGet();
	if (!trapezi)
	return nodereq.error('ακαθόριστο τραπέζι');

	sinedria = nodereq.sinedriaGet();
	if (sinedria.sinedriaOxiPektis())
	return  nodereq.error("Δεν είστε παίκτης σ' αυτό το τραπέζι");

	if (!trapezi.trapeziKlidoma('trapezi.dianomiTora'))
	return  nodereq.error('Το τραπέζι είναι κλειδωμένο');

	if (trapezi.partidaIsFasiInteractive()) {
		trapezi.trapeziXeklidoma();
		return nodereq.error('Η παρτίδα δεν βρίσκεται σε φάση διανομής');
	}

	DB.connection().transaction(function(conn) {
		trapezi.trapeziNeaDianomi(conn,

		function(conn, dianomi, energia) {
			conn.commit();
			nodereq.end();

			Server.skiniko.
			processKinisi(dianomi).
			processKinisi(energia).
			kinisiAdd(dianomi, false).
			kinisiAdd(energia);

			this.trapeziXeklidoma();
		},

		function() {
			this.trapeziXeklidoma();
			nodereq.error('Απέτυχε η διανομή');
		});
	});
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.trapezi.klidomaCheck = function(nodereq, trapezi, thesi, apodoxi) {
	var tora = Globals.torams();

	Server.skiniko.skinikoTrapeziWalk(function() {
		var klidoma = this.trapeziKlidomaGet();
		if (!klidoma) return;
		if (tora - klidoma < 3000) return;

		this.trapeziXeklidoma();
		Globals.consoleLog(this.trapeziKodikosGet() + ': ξεκλείδωμα τραπεζιού');
	});
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Από καιρού εις καιρόν και μέσω των διαδικασιών περιπόλου ελέγχονται τα τραπέζια
// προκειμένου κάποια από αυτά να αρχειοθετηθούν. Δεν κλειδώνουμε τα τραπέζια καθώς
// κάτι τέτοιο δημιουργεί περιπλοκές.

Service.trapezi.check = function() {
	var tora, arxio, arxio2;

	tora = Globals.tora();
	if (Debug.flagGet('trapeziCheck'))
	Globals.consoleLog('Περίπολος: trapezi.check: (' + Service.trapezi.kenoTimeout +
		', ' + Service.trapezi.oxiKenoTimeout + ')');

	// Κρατάμε στη λίστα "arxio" τα τραπέζια που αρχειοθετούνται
	// λόγω μεγάλου χρόνου αδράνειας.

	arxio = {};

	Server.skiniko.skinikoTrapeziWalk(function() {
		var trapezi;

		if (this.trapeziSeXrisi(tora))
		return;

		trapezi = this.trapeziKodikosGet();
		Globals.consoleLog(trapezi + ': ανενεργό τραπέζι');
		arxio[trapezi] = true;
	});

	// Αρχειοθετούμε στην database τα τραπέζια που έκλεισαν λόγω
	// μεγάλου χρόνου αδράνειας. Παράλληλα δημιουργούμε δεύτερη
	// λίστα με τα τραπέζια που αρχειοθετούνται επιτυχώς στην
	// database.

	arxio2 = {};
	Service.trapezi.arxiothetisi(arxio, arxio2);
};

Service.trapezi.kenoTimeout = 1 * 60;
Service.trapezi.oxiKenoTimeout = 3 * 60;

// Η μέθοδος "trapeziSeXrisi" ελέγχει αν οι παίκτες του τραπεζιού έχουν αποχωρήσει
// από το τραπέζι και το τραπέζι έχει μείνει χωρίς online επισκέπτες για μεγάλο
// χρονικό διάστημα.

Trapezi.prototype.trapeziSeXrisi = function(tora) {
	var timeout, thesi, pektis;

	// Ελέγχουμε κατ' αρχάς αν υπάρχει παίκτης στο τραπέζι που δεν έχει
	// αποχωρήσει ακόμη, προκειμένου να αποφασίσουμε το χρόνο που το
	// τραπέζι θα θεωρηθεί ανενεργό. Αν υπάρχει έστω και ένας παίκτης
	// στο τραπέζι δίνουμε περισσότερο χρόνο.

	timeout = Service.trapezi.kenoTimeout;

	for (thesi = 1; thesi <= Prefadoros.thesiMax; thesi++) {
		if (!this.trapeziPektisGet(thesi))
		continue;

		// Εφόσον υπάρχει παίκτης ξεχασμένος στο τραπέζι αυξάνουμε
		// το χρόνο αδράνειας.

		timeout = Service.trapezi.oxiKenoTimeout;
		break;
	}

	if (tora === undefined)
	tora = Globals.tora();

	if (tora - this.trapeziPollGet() < timeout)
	return true;

	// Το poll timestamp του τραπεζιού δείχνει ότι το τραπέζι είναι
	// ανανεργό. Ωστόσο, υπάρχει περίπτωση κάποιος από τους παίκτες
	// του τραπεζιού να παρακολουθεί, ή να παίζει σε άλλο τραπέζι.
	// Σενάριο: Ανοίγω τραπέζι, προσκαλώ δύο φίλους και μέχρι να
	// έρθουν αυτοί παρακολουθώ σε κάποιο άλλο τραπέζι. Σ' αυτή την
	// περίπτωση τα pollings που κάνω ενημερώνουν το poll timestamp
	// στο τραπέζι που παρακολουθώ και έτσι το κυρίως τραπέζι μου
	// θα φανεί ανενεργό και θα δρομολογηθεί προς αρχειοθέτηση,
	// πράγμα που δεν είναι σωστό.

	for (thesi = 1; thesi <= Prefadoros.thesiMax; thesi++) {
		pektis = this.trapeziPektisGet(thesi);
		if (!pektis) continue;

		// Αν οποιοσδήποτε παίκτης του τραπεζιού έχει ενεργή
		// συνεδρία, τότε το τραπέζι θεωρείται ενεργό.

		if (Server.skiniko.skinikoSinedriaGet(pektis))
		return true;
	}

	// Είναι πια η ώρα το τραπέζι να θεωρηθεί ανενεργό.

	return false;
};

// Η function "arxiothesisi" δέχεται μια λίστα τραπεζιών και επιχειρεί να τα
// αρχειοθετήσει στην database, δηλαδή να ενημερώσει το timestamp αρχειοθέτησης
// σε καθένα από αυτά τα τραπέζια. Ως δεύτερη παράμετρο περνάμε μια αρχικά κενή
// λίστα και εισάγουμε σ' αυτήν τη λίστα τα τραπέζια τα οποία αρχειοθετήθηκαν
// επιτυχώς στην database, προκειμένου αμέσως μετά να ενημερώσουμε τους clients
// ότι αυτά τα τραπέζια έχουν αρχειοθετηθεί.

Service.trapezi.arxiothetisi = function(lista, lista2) {
	var trapezi;

	// Η αρχειοθέτηση των τραπεζιών γίνεται αλυσιδωτά ώστε να αποφύγουμε
	// τη δημιουργία πολλών database connections. Αρχειοθετούμε, δηλαδή,
	// το πρώτο τραπέζι της λίστας και διακόπτουμε τη διαδικασία, καθώς
	// κατά το τέλος της διαδικασίας αρχειοθέτησης επανεκκινούμε αναδρομικά
	// τη διαδικασία.

	for (trapezi in lista) {
		delete lista[trapezi];
		Service.trapezi.arxiothetisiTrapezi(trapezi, lista, lista2);
		return;
	}

	// Η λίστα έχει εξαντληθεί και εκκινούμε τις διαδικασίες κλεισίματος
	// της αρχειοθέτησης τραπεζιών.

	Service.trapezi.arxiothetisiTelos(lista2);
};

Service.trapezi.arxiothetisiTrapezi = function(trapeziKodikos, lista, lista2) {
	var trapezi, conn, query;

	trapezi = Server.skiniko.skinikoTrapeziGet(trapeziKodikos);
	if (!trapezi) return;

	conn = DB.connection();
	query = 'UPDATE `trapezi` SET `arxio` = NOW()';

	// Επιχειρούμε να «πληρώσουμε» τις κενές θέσεις του τραπεζιού
	// με τα ονόματα των παικτών που κάθισαν τελευταίοι σ' αυτές.

	trapezi.trapeziThesiWalk(function(thesi) {
		var pektis;

		pektis = this.trapeziPektisGet(thesi);
		if (pektis) return;

		pektis = this.trapeziTelefteosGet(thesi);
		if (!pektis) return;

		query += ', `pektis' + thesi + '` = ' + pektis.json();
	});

	query += ' WHERE `kodikos` = ' + trapeziKodikos;

	conn.query(query, function(conn, res) {
		if (conn.affectedRows != 1) {
			conn.free();
			Globals.consoleError(trapeziKodikos + ': απέτυχε η αρχειοθέτηση του τραπεζιού');
			Service.trapezi.arxiothetisi(lista, lista2);
			return;
		}

		// Το τραπέζι έχει αρχειοθετηθεί επιτυχώς. Ακολουθούν οι διαγραφές
		// προσκλήσεων, συζήτησης κλπ του τραπεζιού. Κανονικά θα έπρεπε να
		// γίνουν όλα αυτά στα πλαίσια κάποιας ενιαίας transaction, αλλά
		// δεν πειράζει και να αποτύχουν οι διαγραφές, οπότε αποφεύγουμε
		// τη διαδικασία λογικής transaction.

		lista2[trapeziKodikos] = true;
		Service.trapezi.diagrafiProsklisi(conn, trapeziKodikos, lista, lista2);
	});
};

Service.trapezi.diagrafiProsklisi = function(conn, trapezi, lista, lista2) {
	var query;

	query = 'DELETE FROM `prosklisi` WHERE `trapezi` = ' + trapezi;
	conn.query(query, function(conn) {
		Service.trapezi.diagrafiArvila(conn, trapezi, lista, lista2);
	});
};

Service.trapezi.diagrafiArvila = function(conn, trapezi, lista, lista2) {
	var query;

	query = 'DELETE FROM `arvila` WHERE `trapezi` = ' + trapezi;
	conn.query(query, function(conn) {
		Service.trapezi.diagrafiSizitisi(conn, trapezi, lista, lista2);
	});
};

Service.trapezi.diagrafiSizitisi = function(conn, trapezi, lista, lista2) {
	var query;

	query = 'DELETE FROM `sizitisi` WHERE `trapezi` = ' + trapezi;
	conn.query(query, function(conn) {
		Service.trapezi.diagrafiSimetoxi(conn, trapezi, lista, lista2);
	});
};

Service.trapezi.diagrafiSimetoxi = function(conn, trapezi, lista, lista2) {
	var query;

	query = 'DELETE FROM `simetoxi` WHERE `trapezi` = ' + trapezi;
	conn.query(query, function(conn) {
		Service.trapezi.diagrafiTelefteos(conn, trapezi, lista, lista2);
	});
};

Service.trapezi.diagrafiTelefteos = function(conn, trapezi, lista, lista2) {
	var query;

	query = 'DELETE FROM `telefteos` WHERE `trapezi` = ' + trapezi;
	conn.query(query, function(conn) {
		conn.free();
		Service.trapezi.arxiothetisi(lista, lista2);
	});
};

// Η function "arxiothetisiTelos" δέχεται μια λίστα τραπεζιών τα οποία έχουν
// αρχειοθετηθεί σε έναν κύκλο αρχειοθέτησης. Σκοπός της function είναι να
// δημιουργήσει κινήσεις αρχειοθέτησης τραπεζιού (AT) και να ενημερώσει το
// σκηνικό του server. Κατόπιν στέλνει τις κινήσεις στους clients.

Service.trapezi.arxiothetisiTelos = function(lista) {
	var trapezi, kinisi;

	kinisi = undefined;
	for (trapezi in lista) {
		kinisi = new Kinisi({
			idos: 'AT',
			data: {
				trapezi: trapezi,
			}
		});

		Server.skiniko.
		processKinisi(kinisi).
		kinisiAdd(kinisi, false);
	}

	if (kinisi)
	Server.skiniko.kinisiAdd();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η λίστα "katagrafi" δεικτοδοτείται με το login name του παίκτη
// και δείχνει το timestamp της τελευταίας δημιουργίας κάθε παίκτη.

Service.trapezi.katagrafi = {};

// Η σταθερά "katagrafiMin" δείχνει τον ελάχιστο χρόνο (σε seconds)
// στον οποίο ο χρήστης επιτρέπεται να δημιουργήσει νέο τραπέζι.

Service.trapezi.katagrafiMin = 300;

// Η λίστα καταγραφής πρέπει να εκκαθαρίζεται από καιρού εις καιρόν.
// Η εκκαθάριση περιλαμβάνει διαγραφή των εγγραφών που δεν παίζουν
// ρόλο στον έλεγχο.
//
// Παράλληλα, εκτυπώνουμε μια λίστα όλων των καταγραφών προκειμένου
// να έχουμε μια ιδέα της κίνησης όσον αφορά στη δημιουργία τραπεζιών.

setInterval(function() {
	var tora, login;

	Globals.consoleLog('Εκκαθάριση μητρώου δημιουργίας τραπεζιών');
	tora = Globals.tora();
	for (login in Service.trapezi.katagrafi) {
		console.log('\t' + login);
		if (tora - Service.trapezi.katagrafi[login] >= Service.trapezi.katagrafiMin)
		delete Service.trapezi.katagrafi[login];
	}
}, 3333000);

Service.trapezi.ipervasi = function(nodereq) {
	var pektis, login, ts;

	pektis = nodereq.pektisGet();

	if (!pektis)
	return nodereq.error('ακαθόριστος παίκτης κατά τον έλεγχο υπέρβασης δημιουργίας παρτίδας');

	if (pektis.pektisIsDiaxiristis())
	return false;

	login = nodereq.loginGet();

	if (!login)
	return nodereq.error('ακαθόριστος χρήστης κατά τον έλεγχο υπέρβασης δημιουργίας παρτίδας');

	ts = Service.trapezi.katagrafi[login];

	if (!ts)
	return false;

	if (Globals.tora() - ts < Service.trapezi.katagrafiMin)
	return nodereq.error('Δημιουργήσατε πρόσφατα κάποιο τραπέζι');
};
