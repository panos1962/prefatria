////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: sinedria');

Service.sinedria = {};
Debug.flagSet('passwordCheck');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.sinedria.checkin = function(nodereq) {
	var conn, query, kodikos;

	if (nodereq.anonimo()) return;
	if (nodereq.denPerastike('kodikos')) return nodereq.error('Δεν περάστηκε κωδικός');
	kodikos = Crypto.createHash('sha1').update(nodereq.url.kodikos).digest('hex');

	conn = DB.connection();
	query = 'SELECT ' + Pektis.projection + ' FROM `pektis` WHERE `login` LIKE ' + nodereq.login.json();
	if (Debug.flagGet('passwordCheck')) query += ' AND `kodikos` LIKE BINARY ' + kodikos.json();
	conn.query(query, function(conn, rows) {
		var pektis;

		if (rows.length != 1) {
			conn.free();
			nodereq.error('Access denied');
			return;
		}

		// Ακόμη και αν ο παίκτης υπάρχει ήδη στο σκηνικό, θα προχωρήσουμε
		// σε ανανέωση των στοιχείων του παίκτη.

		pektis = new Pektis(rows[0]);

		// Εντοπίζουμε τυχόν φωτογραφία του παίκτη και εντάσσουμε το όνομα του
		// σχετικού image file μαζί με τον χρόνο τελευταίας τροποποίησης, ως
		// properties του παίκτη.

		pektis.pektisSeekPhoto(function() {
			Service.sinedria.peparam(nodereq, conn, pektis);
		});
	});
};

Service.sinedria.peparam = function(nodereq, conn, pektis) {
	var query;

	query = 'SELECT ' + Peparam.projection + ' FROM `peparam` WHERE `pektis` = ' + pektis.pektisLoginGet().json();
	conn.query(query, function(conn, rows) {
		Globals.awalk(rows, function(i, peparam) {
			pektis.pektisPeparamSet(new Peparam(peparam));
		});

		Service.sinedria.profinfo(nodereq, conn, pektis);
	});
};

Service.sinedria.profinfo = function(nodereq, conn, pektis) {
	var query;

	pektis.profinfo = {};
	query = 'SELECT ' + Profinfo.projection + ' FROM `profinfo` WHERE `pektis` = ' + pektis.pektisLoginGet().json();
	conn.query(query, function(conn, rows) {
		Globals.awalk(rows, function(i, profinfo) {
			pektis.pektisProfinfoSet(profinfo['sxoliastis'], profinfo['kimeno']);
		});

		Service.sinedria.sxesi(nodereq, conn, pektis);
	});
};

Service.sinedria.sxesi = function(nodereq, conn, pektis) {
	var query, login = pektis.pektisLoginGet(), photoSrc;

	query = 'SELECT ' + Sxesi.projection + ' FROM `sxesi` WHERE `pektis` = ' + login.json();
	conn.query(query, function(conn, rows) {
		var kinisi;

		Globals.awalk(rows, function(i, sxesi) {
			pektis.pektisSxesiSet(sxesi.sxetizomenos, sxesi.sxesi);
		});

		kinisi = new Kinisi('PK');
		kinisi.data = {
			login: pektis.pektisLoginGet(),
			onoma: pektis.pektisOnomaGet(),
			peparam: pektis.peparam,
			sxesi: pektis.sxesi,
			profinfo: pektis.profinfo,
		};

		photoSrc = pektis.pektisPhotoSrcGet();
		if (photoSrc) kinisi.data.photoSrc = photoSrc;

		Globals.consoleLog(login + ': ' + (Server.skiniko.skinikoPektisGet(login) ?
			'ανανεώθηκαν τα στοιχεία του παίκτη' : 'ενετάχθη παίκτης') + ' στο σκηνικό');
		Server.skiniko.
		processKinisi(kinisi);

		// Οι πληροφορίες προφίλ δεν θα αποσταλούν στους clients,
		// για λόγους οικονομίας και ιδιωτικότητας. Αυτός ήταν
		// και ο λόγος που σπάσαμε τη διαδικασία σε δύο κομμάτια.

		delete kinisi.data.profinfo;
		Server.skiniko.
		kinisiAdd(kinisi);

		conn.transaction(function(conn) {
			Service.sinedria.checkin2(nodereq, conn, pektis);
		});
	});
};

Service.sinedria.checkin2 = function(nodereq, conn, pektis) {
	var query, spektis = pektis.login.json();

	query = 'INSERT INTO `istoriko` (`pektis`, `ip`, `isodos`, `exodos`) ' +
		'SELECT `pektis`, `ip`, `isodos`, NOW() FROM `sinedria` WHERE `pektis` = ' + spektis;
	conn.query(query, function(conn) {
		if (!conn.affectedRows) return Service.sinedria.checkin3(nodereq, conn, pektis);
		query = 'DELETE FROM `sinedria` WHERE `pektis` = ' + spektis;
		conn.query(query, function(conn) {
			if (conn.affectedRows) return Service.sinedria.checkin3(nodereq, conn, pektis);
			conn.rollback();
			nodereq.error('Απέτυχε η αρχειοθέτηση προηγούμενης συνεδρίας');
		});
	});
};

Service.sinedria.checkin3 = function(nodereq, conn, pektis) {
	var skiniko = Server.skiniko, sinedria, prev, query, tora = Globals.torams();

	sinedria = new Sinedria({
		pektis: pektis.login,
		klidi: nodereq.klidi,
		ip: nodereq.ip,
		isodos: tora,
		poll: tora,
		feredataPoll: tora,
	});

	prev = skiniko.skinikoSinedriaGet(pektis.login);
	if (prev) {
		prev.sinedriaEntopismos();
		if (prev.sinedriaTrapeziGet()) {
			sinedria.sinedriaTrapeziSet(prev.sinedriaTrapeziGet());
			sinedria.sinedriaThesiSet(prev.sinedriaThesiGet());
			sinedria.sinedriaSimetoxiSet(prev.sinedriaSimetoxiGet());
		}
	}
	if (sinedria.sinedriaIsRebelos()) sinedria.sinedriaEntopismos(skiniko);

	query = 'INSERT INTO `sinedria` (`pektis`, `klidi`, `ip`, `isodos`, `trapezi`, `thesi`, `simetoxi`) VALUES (' +
		sinedria.pektis.json() + ',' + sinedria.klidi.json() + ',' + sinedria.ip.json() + ', NOW(), ' +
		(sinedria.trapezi ? sinedria.trapezi + ', ' + sinedria.thesi + ', ' + sinedria.simetoxi.json() :
		'NULL, NULL, NULL') + ')';
	conn.query(query, function(conn) {
		var kinisi;

		if (!conn.affectedRows) {
			conn.rollback();
			return nodereq.error('Απέτυχε η δημιουργία νέας συνεδρίας');
		}

		conn.commit();

		// Αν υπάρχει ήδη συνεδρία στο σκηνικό για τον ίδιο παίκτη, τότε φροντίζουμε
		// να κλείσουμε τυχόν ανοικτό κανάλι ενημέρωσης feredata.

		if (prev) prev.feredataExodos();

		// Διαγράφουμε το log σκηνικών ανανεώσεων για τον συγκεκριμένο παίκτη. Αυτό
		// το log κρατάει τις χρονικές στιγμές κατά τις οποίες ζητήθηκαν πλήρεις
		// ανανεώσεις σκηνικών δεδομένων από τον παίκτη.

		delete Service.feredata.freskaLog[pektis.login];

		// Δημιουργούμε κίνηση νέας συνεδρίας και εμπλουτίζουμε με τα απαραίτητα
		// δεδομένα.

		kinisi = new Kinisi('SN');
		kinisi.data.sinedria = sinedria;

		skiniko.

		// Εφαρμόζουμε την κίνηση νέας συνεδρίας στο σκηνικό του skiser.

		processKinisi(kinisi);

		// Αφαιρούμε ευαίσθητα δεδομένα.

		delete sinedria.klidi;

		skiniko.

		// Κοινοποιούμε την κίνηση στους υπάρχοντες clients. Εμείς δεν έχουμε
		// ακόμη ανοικτό κανάλι ενημέρωσης, επομένως δεν θα έχουμε ενημέρωση
		// ότι πραγματοποιήσαμε είσοδο.

		kinisiAdd(kinisi);

		// Κλείνουμε το αίτημα εισόδου προκειμένου να προχωρήσει ο client στην
		// ενημέρωση των cookies εισόδου και κατόπιν στην κεντρική σελίδα της
		// εφαρμογής.

		nodereq.end();
	});
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Service.sinedria.exodos = function(nodereq) {
	if (nodereq.nosinedria())
	return;

	nodereq.end();
	nodereq.sinedria.feredataExodos();
	Server.skiniko.skinikoSinedriaDelete(nodereq.loginGet());

	DB.connection().transaction(function(conn) {
		Service.sinedria.exodos2(nodereq, conn);
	});
};

Service.sinedria.exodos2 = function(nodereq, conn) {
	var query, spektis = nodereq.login.json();

	query = 'INSERT INTO `istoriko` (`pektis`, `ip`, `isodos`, `exodos`) ' +
		'SELECT `pektis`, `ip`, `isodos`, NOW() FROM `sinedria` WHERE `pektis` = ' + spektis;
	conn.query(query, function(conn) {
		if (conn.affectedRows)
		return Service.sinedria.exodos3(nodereq, conn, spektis);

		conn.free();
		Service.sinedria.exodos4(nodereq);
	});
};

Service.sinedria.exodos3 = function(nodereq, conn, spektis) {
	var query;

	query = 'DELETE FROM `sinedria` WHERE `pektis` = ' + spektis;
	conn.query(query, function(conn) {
		if (conn.affectedRows) conn.commit();
		else conn.rollback();

		Service.sinedria.exodos4(nodereq);
	});
};

Service.sinedria.exodos4 = function(nodereq) {
	var skiniko = nodereq.skinikoGet(), kinisi;

	kinisi = new Kinisi({
		idos: 'NS',
		data: {
			login: nodereq.loginGet(),
		}
	});

	skiniko.
	processKinisi(kinisi).
	kinisiAdd(kinisi);
	Globals.consoleLog(kinisi.data.login + ': bye');
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Service.sinedria.pektisTheatis = function(nodereq) {
	if (nodereq.isvoli()) return;
	if (nodereq.oxiTrapezi()) return;

	if (nodereq.sinedria.sinedriaIsPektis())
	Service.sinedria.pektisTheatisTheatis(nodereq);

	else
	Service.sinedria.pektisTheatisPektis(nodereq);
};

Service.sinedria.pektisTheatisTheatis = function(nodereq) {
	var thesi;

	thesi = nodereq.trapezi.trapeziThesiPekti(nodereq.login);
	if (!thesi) return nodereq.error('Απροσδιόριστη θέση παίκτη στο τραπέζι');

	return DB.connection().transaction(function(conn) {
		Service.sinedria.pektisTheatisTheatis2(nodereq, conn, thesi);
	});
};

Service.sinedria.pektisTheatisTheatis2 = function(nodereq, conn, thesi) {
	var query;

	query = 'UPDATE `trapezi` SET `pektis' + thesi + '` = NULL WHERE `kodikos` = ' +
		nodereq.trapezi.trapeziKodikosGet();
	conn.query(query, function(conn, res) {
		if (conn.affectedRows === 1)
		return Service.sinedria.pektisTheatisTheatis3(nodereq, conn, thesi);

		conn.rollback();
		return nodereq.error('Απέτυχε η ενημέρωση του τραπεζιού');
	});
};

Service.sinedria.pektisTheatisTheatis3 = function(nodereq, conn, thesi) {
	var query;

	query = "UPDATE `sinedria` SET `simetoxi` = 'ΠΑΙΚΤΗΣ' WHERE `pektis` = " + nodereq.login.json();
	conn.query(query, function(conn, res) {
		if (conn.affectedRows === 1)
		return Service.sinedria.pektisTheatisTheatis4(nodereq, conn, thesi);

		conn.rollback();
		return nodereq.error('Απέτυχε η ενημέρωση της συνεδρίας');
	});
};

Service.sinedria.pektisTheatisTheatis4 = function(nodereq, conn, thesi) {
	var kinisi;

	conn.commit();

	kinisi = new Kinisi({
		idos: 'PT',
		data: {
			pektis: nodereq.login,
			trapezi: nodereq.trapezi.trapeziKodikosGet(),
			thesi: thesi,
		},
	});
	Server.skiniko.processKinisi(kinisi).kinisiAdd(kinisi);

	nodereq.end();
};

Service.sinedria.pektisTheatisPektis = function(nodereq) {
	var trapezi, thesi;

	trapezi = nodereq.trapezi;

	// Πρώτα ελέγχουμε αν ο παίκτης είναι ήδη παίκτης στο τραπέζι.

	thesi = trapezi.trapeziThesiPekti(nodereq.login);
	if (thesi) return nodereq.error('Είστε ήδη παίκτης στο τραπέζι');

	if (trapezi.trapeziIsArvila(nodereq.login))
	return nodereq.error('Έχετε αποκλειστεί από αυτό το τραπέζι');

	// Ως υποψήφια θέση επιλέγουμε πρώτα τυχόν προηγούμενη θέση του
	// παίκτη στο τραπέζι. Αν αυτή η θέση δεν είναι κενή, τότε επιλέγουμε
	// την πρώτη κενή θέση.

	thesi = trapezi.trapeziSimetoxiGet(nodereq.login);
	if ((!thesi) || trapezi.trapeziOxiKeniThesi(thesi)) thesi = trapezi.trapeziKeniThesi();
	if (!thesi) return nodereq.error('Δεν υπάρχει κενή θέση στο τραπέζι');

	if (trapezi.trapeziOxiProsklisi(nodereq.login))
	return nodereq.error('Δεν βρέθηκε πρόσκληση');

	if (trapezi.parisaktosPektis(nodereq.login, thesi))
	return nodereq.error('Η παρτίδα έχει τελειώσει!');

	return DB.connection().transaction(function(conn) {
		Service.prosklisi.apodoxiPektis(nodereq, conn, trapezi.trapeziKodikosGet(), thesi);
	});
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Το service "salute" εκτελείται κατά το φόρτωμα της σελίδας και πριν στηθεί το
// σκηνικό στον  client. Κύριος στόχος της υπηρεσίας είναι να κλείσει τυχόν υπάρχον
// feredata κανάλι για την αιτούσα συνεδρία και δευτερευόντως να κάνει γνωστή την
// άφιξη νέου client στον ορίζοντα, μπορεί όμως να πρόκειται και για επαναφόρτωση
// υπάρχοντος client.

Service.sinedria.salute = function(nodereq) {
	if (nodereq.isvoli()) return;

	Globals.consoleLog(nodereq.sinedria.pektis + ': salute');
	nodereq.sinedria.feredataClose();
	Server.skiniko.kinisiAdd(new Kinisi({
		idos: 'SL',
		data: {
			login: nodereq.sinedria.pektis,
		},
	}));

	nodereq.end();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.sinedria.tsoxaSalute = function(nodereq) {
	var trapezi, sizitisiFloter, kinisi, oxiNeotera;

	if (nodereq.isvoli()) return;
	trapezi = nodereq.trapeziGet();
	if (!trapezi) return nodereq.error('Ακαθόριστο τραπέζι');
	if (nodereq.denPerastike('sizitisi', true)) return;
	nodereq.end();

	kinisi = new Kinisi({
		idos: 'XL',
		data: {
			pektis: nodereq.sinedria.pektis,
			trapezi: trapezi.trapeziKodikosGet(),
			sizitisi: {},
		},
	});
	Globals.consoleLog(nodereq.sinedria.pektis + ': tsoxaSalute (' + kinisi.data.trapezi + ')');

	oxiNeotera = true;
	sizitisiFloter = parseInt(nodereq.url.sizitisi);
	trapezi.trapeziSizitisiWalk(function(sizitisi) {
		var kodikos;

		kodikos = this.sizitisiKodikosGet();
		if (kodikos <= sizitisiFloter) return;

		kinisi.data.sizitisi[kodikos] = this;
		oxiNeotera = false;
	});
	if (oxiNeotera) delete kinisi.data.sizitisi;

	Server.skiniko.kinisiAdd(kinisi);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Service.sinedria.thesiTheasis = function(nodereq) {
	if (nodereq.isvoli()) return;
	if (nodereq.oxiTrapezi()) return;
	if (nodereq.denPerastike('thesi')) return nodereq.error('Δεν περάστηκε θέση θέασης');
	if (nodereq.sinedria.sinedriaOxiTheatis()) return nodereq.error('Δεν είστε θεατής στο τραπέζι');
	if (nodereq.sinedria.sinedriaThesiGet() == nodereq.url.thesi) return nodereq.end();

	Service.sinedria.thesiTheasis2(nodereq);
};

Service.sinedria.thesiTheasis2 = function(nodereq) {
	var query, conn;

	query = 'UPDATE `sinedria` SET `thesi` = ' + nodereq.url.thesi +
		' WHERE `pektis` = ' + nodereq.loginGet().json();
	conn = DB.connection();
	conn.query(query, function(conn, res) {
		conn.free();
		if (conn.affectedRows === 1)
		return Service.sinedria.thesiTheasis3(nodereq);

		nodereq.error('Απέτυχε η αλλαγή θέσης θέασης');
	});
};

Service.sinedria.thesiTheasis3 = function(nodereq) {
	var kinisi;

	nodereq.end();
	kinisi = new Kinisi({
		idos: 'TT',
		data: {
			pektis: nodereq.login,
			thesi: nodereq.url.thesi,
		},
	});
	Server.skiniko.processKinisi(kinisi).kinisiAdd(kinisi);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Service.sinedria.check = function() {
	var tora = Globals.tora(), arxio = {};

	if (Debug.flagGet('sinedriaCheck'))
	Globals.consoleLog('Περίπολος: sinedria.check');

	Server.skiniko.skinikoSinedriaWalk(function() {
		var pektis;

		if (this.sinedriaSeXrisi(tora))
		return;

		pektis = this.sinedriaPektisGet();
		Globals.consoleLog(pektis + ': ανενεργή συνεδρία');

		this.feredataClose();

		// Κρατάμε στη λίστα "arxio" τις συνεδρίες που κλείνουν λόγω
		// μεγάλου χρόνου αδράνειας.

		delete this.skiniko;
		arxio[pektis] = new Sinedria(this);

		kinisi = new Kinisi({
			idos: 'NS',
			data: {
				login: pektis,
			}
		});
		Server.skiniko.processKinisi(kinisi).kinisiAdd(kinisi, false);
	}).kinisiAdd();

	// Αρχειοθετούμε στην database τις συνεδρίες που έκλεισαν λόγω μεγάλου
	// χρόνου αδράνειας.

	Service.sinedria.arxiothetisi(arxio);
};

// Η μέθοδος "sinedriaSeXrisi" ελέγχει αν η συνεδρία διατηρεί επαφή με τον server
// και αν ο παίκτης της συνεδρίας εκτελεί κάποιες κινήσεις ή απλώς έχει ξεχαστεί
// στον «Πρεφαδόρο».

Sinedria.prototype.sinedriaSeXrisi = function(tora) {
	var pektis;

	if (tora === undefined)
	tora = Globals.tora();

	pektis = this.sinedriaPektisGet();

	// Ελέγχουμε πρώτα την περίπτωση η συνεδρία να έχει χάσει την επαφή της με
	// τον server χωρίς ο παίκτης να έχει κάνει προηγουμένως ρητή έξοδο από το
	// πρόγραμμα. Ελέγχουμε, λοιπόν, αν δεν υπάρχει πρόσφατο αίτημα feredata.

	if (tora - this.feredataPollGet() > Peripolos.sinedriaTimeout) {
		Globals.consoleError(pektis + ': feredataPoll:',
			tora - this.feredataPollGet(), '>', Peripolos.sinedriaTimeout);
		return false;
	}

	// Διαπιστώσαμε ότι η συνεδρία έχει υποβάλει προσφάτως αίτημα feredata. Στην
	// περίπτωση αυτή πρέπει να ελέγξουμε αν η συνεδρία κάνει άλλες κινήσεις ή
	// απλώς βρίσκεται σε επαφή με τον server.

	if (tora - this.sinedriaPollGet() > Peripolos.inactiveTimeout) {
		Globals.consoleError(pektis + ': sinedriaPoll:',
			tora - this.sinedriaPollGet(), '>', Peripolos.inactiveTimeout);
		return false;
	}

	return true;
};

Service.sinedria.arxiothetisi = function(lista) {
	var pektis, sinedria;

	for (pektis in lista) {
		sinedria = lista[pektis];
		delete lista[pektis];

		// Αν βρούμε συνεδρία για τον παίκτη του οποίου επιχειρούμε
		// αρχειοθέτηση συνεδρίας, τότε σημαίνει ότι ξαναμπήκε πρόσφατα
		// και θα έχει γίνει αρχειοθέτηση μέσω της διαδικασίας εισόδου.

		if (Server.skiniko.skinikoSinedriaGet(pektis))
		return Service.sinedria.arxiothetisi(lista);

		DB.connection().transaction(function(conn) {
			Service.sinedria.arxiothetisi2(pektis, sinedria, lista, conn);
		});

		return;
	}
};

Service.sinedria.arxiothetisi2 = function(pektis, sinedria, lista, conn) {
	var query = 'INSERT INTO `istoriko` (`pektis`, `ip`, `isodos`, `exodos`) VALUES (' + pektis.json() + ', ' +
		sinedria.sinedriaIpGet().json() + ', FROM_UNIXTIME(' + sinedria.sinedriaIsodosGet() + '), NOW())';
	conn.query(query, function(conn, res) {
		if (conn.affectedRows == 1)
		return Service.sinedria.arxiothetisi3(pektis, lista, conn);

		conn.rollback(function(conn) {
			conn.free();
			Service.sinedria.arxiothetisi(lista);
		});

		Globals.consoleError(pektis + ': απέτυχε η αρχειοθέτηση της συνεδρίας');
	});
};

Service.sinedria.arxiothetisi3 = function(pektis, lista, conn) {
	var query = 'DELETE FROM `sinedria` WHERE `pektis` LIKE ' + pektis.json();
	conn.query(query, function(conn, res) {
		if (conn.affectedRows == 1)
		conn.commit(function(conn) {
			conn.free();
			Service.sinedria.arxiothetisi(lista);
		});

		else
		conn.rollback(function(conn) {
			conn.free();
			Globals.consoleError(pektis + ': απέτυχε η διαγραφή παλαιάς συνεδρίας');
			Service.sinedria.arxiothetisi(lista);
		});
	});
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Το service "apovoli" χρησιμοποιείται από τους επόπτες για την αποβολή
// ενοχλητικών παικτών από το καφενείο. Για να αποβάλουμε κάποιον παίκτη
// μπαίνουμε στο προφίλ του και κάνουμε κλικ στο εικονίδιο αποβολής.

Service.sinedria.apovoli = function(nodereq) {
	var skiniko, pektis, sinedria, kinisi, arxio;

	if (nodereq.isvoli())
	return;

	if (nodereq.denPerastike('pektis', true))
	return;

	if (nodereq.pektis.pektisOxiDiaxiristis())
	return nodereq.error('Δεν υπάρχει δικαίωμα αποβολής παίκτη');

	skiniko = nodereq.skinikoGet();
	pektis = nodereq.url.pektis;

	if (pektis == nodereq.login)
	return nodereq.error('Αποβολή του αποβάλλοντος');

	nodereq.end();

	sinedria = skiniko.skinikoSinedriaGet(pektis);

	if (!sinedria)
	return;

	sinedria.feredataClose();

	delete sinedria.skiniko;

	kinisi = new Kinisi({
		idos: 'NS',
		data: {
			login: pektis,
		}
	});

	skiniko.
	processKinisi(kinisi).
	kinisiAdd(kinisi);

	arxio = {};
	arxio[pektis] = sinedria;
	Service.sinedria.arxiothetisi(arxio);

	Globals.consoleLog(pektis + ': απεβλήθη από ' + nodereq.sinedria.pektis);
};
