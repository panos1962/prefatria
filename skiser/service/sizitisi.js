////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: sizitisi');

Service.sizitisi = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.sizitisi.kafenio = function(nodereq) {
	var conn, query, pektis;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('sxolio', true)) return;

	pektis = nodereq.pektisGet();

	if (!pektis)
	return nodereq.error('ακαθόριστος παίκτης κατά τον έλεγχο πρόσβασης στη δημόσια συζήτηση');

	/*

	Τελικά αφήνω για όλους (Δεκέμβριος 2018)
	Αλλά επειδή πάλι έγινε κώλος, το ξανακύρωσα (Ιανουάριος 2019)

	*/

	if (pektis.pektisOxiAdministrator())
	return;

	conn = DB.connection();
	query = 'INSERT INTO `sizitisi` (`pektis`, `sxolio`) VALUES (' + nodereq.login.json() +
		', ' + nodereq.url.sxolio.json() + ')';
	conn.query(query, function(conn, res) {
		conn.free();
		if (conn.affectedRows != 1)
		return nodereq.error('Απέτυχε η καταχώρηση δημόσιου σχολίου');

		Service.sizitisi.klisimo(nodereq, res.insertId);
	});
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.sizitisi.partida = function(nodereq) {
	var trapezi, conn, query;

	if (nodereq.isvoli()) return;
	if (nodereq.oxiTrapezi()) return;
	if (nodereq.denPerastike('sxolio', true)) return;

	trapezi = nodereq.trapeziGet().trapeziKodikosGet();
	conn = DB.connection();
	query = 'INSERT INTO `sizitisi` (`trapezi`, `pektis`, `sxolio`) VALUES (' +
		trapezi + ', ' + nodereq.login.json() + ', ' + nodereq.url.sxolio.json() + ')';
	conn.query(query, function(conn, res) {
		conn.free();
		if (conn.affectedRows != 1)
		return nodereq.error('Απέτυχε η καταχώρηση σχολίου');

		Service.sizitisi.klisimo(nodereq, res.insertId, trapezi);
	});
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.sizitisi.klisimo = function(nodereq, kodikos, trapezi) {
	var kinisi;

	nodereq.end();

	kinisi = new Kinisi('SZ');
	kinisi.data = {
		kodikos: kodikos,
		pektis: nodereq.login,
		sxolio: nodereq.url.sxolio,
	};

	if (trapezi) kinisi.data.trapezi = trapezi;

	Server.skiniko.
	processKinisi(kinisi).
	kinisiAdd(kinisi);

	// Καλό είναι να διαγράψουμε και τυχόν εγγραφές που
	// ίσως έχουν κρατηθεί για το μολύβι κατά την έναρξη
	// γραφής του σχολίου.

	delete Service.sizitisi.moliviTrapezi[nodereq.login];
	delete Service.sizitisi.moliviKafenio[nodereq.login];
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Το service "filaPrev" εντάσσει στη συζήτηση του τραπεζιού σχόλιο στο
// οποίο φαίνονται τα φύλλα της προηγούμενης διανομής για τη θέση του
// αιτούντος παίκτη.

Service.sizitisi.filaPrev = function(nodereq) {
	var trapezi, sinedria, thesi;

	if (nodereq.isvoli()) return;
	if (nodereq.oxiTrapezi()) return;

	sinedria = nodereq.sinedriaGet();
	if (sinedria.sinedriaOxiPektis())
	return nodereq.error('Δεν είστε παίκτης στο τραπέζι');

	trapezi = nodereq.trapeziGet();
	thesi = sinedria.sinedriaThesiGet();
	try {
		fila = trapezi.filaPrev[thesi];
		if (fila.length < 20) throw 0;
	} catch (e) {
		return nodereq.error('Δεν υπάρχουν φύλλα προηγούμενης διανομής');
	}

	nodereq.end(fila);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.sizitisi.mikosMax = 100;
Service.sizitisi.mikosMin = 50;

Service.sizitisi.kontema = function() {
	var skiniko = Server.skiniko, sizitisi, count, i, conn, query;

	Service.sizitisi.kontemaTrapezi();

	sizitisi = [];
	skiniko.skinikoSizitisiWalk(function() {
		sizitisi.push(this.sizitisiKodikosGet());
	}, 1);

	if (sizitisi.length < Service.sizitisi.mikosMax)
	return;

	count = sizitisi.length - Service.sizitisi.mikosMin;
	for (i = 0; i < count; i++) {
		skiniko.skinikoSizitisiDelete(sizitisi[i]);
	}

	console.log('Κόντεμα δημόσιας συζήτησης κατά ' + count);
	conn = DB.connection();
	query = 'DELETE FROM `sizitisi` WHERE `trapezi` IS NULL AND `kodikos` < ' + sizitisi[i];
	conn.query(query, function(conn, res) {
		conn.free();
		if (conn.affectedRows >= count)
		return;

		console.error('Απέτυχε το κόντεμα της δημόσιας συζήτησης');
	});
};

Service.sizitisi.kontemaTrapezi = function(trapezi) {
	var skiniko = Server.skiniko, sizitisi, count, i, trapeziKodikos, conn, query;

	if (!trapezi) return skiniko.skinikoTrapeziWalk(function() {
		Service.sizitisi.kontemaTrapezi(this);
	});

	trapeziKodikos = trapezi.trapeziKodikosGet();

	sizitisi = [];
	trapezi.trapeziSizitisiWalk(function() {
		sizitisi.push(this.sizitisiKodikosGet());
	}, 1);

	if (sizitisi.length < Service.sizitisi.mikosMax)
	return;

	count = sizitisi.length - Service.sizitisi.mikosMin;
	for (i = 0; i < count; i++) {
		trapezi.trapeziSizitisiDelete(sizitisi[i]);
	}

	console.log('Κόντεμα συζήτησης τραπεζιού ' + trapeziKodikos + ' κατά ' + count);
	conn = DB.connection();
	query = 'DELETE FROM `sizitisi` WHERE `trapezi` = ' + trapeziKodikos + ' AND `kodikos` < ' + sizitisi[i];
	conn.query(query, function(conn, res) {
		conn.free();
		if (conn.affectedRows >= count)
		return;

		console.error('Απέτυχε το κόντεμα της συζήτησης για το τραπέζι ' + trapeziKodikos);
	});
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Στη λίστα "moliviTrapezi" κρατάμε τον κωδικό τραπεζιού για κάθε παίκτη
// που προκαλεί εκκίνηση μολυβιού. Το τραπέζι αυτό θα το χρειαστούμε πάλι
// κατά το «καθάρισμα» του μολυβιού.

Service.sizitisi.moliviTrapezi = {};

// Στη λίστα "moliviKafenio" κρατάμε μια εγγραφή για κάθε παίκτη που προκαλεί
// εκκίνηση μολυβιού στο καφενείο.

Service.sizitisi.moliviKafenio = {};

Service.sizitisi.moliviEkinisi = function(nodereq) {
	var pektis, trapezi, kafenio, kinisi;

	if (nodereq.isvoli()) return;
	nodereq.end();

	pektis = nodereq.loginGet();
	trapezi = nodereq.trapeziGet();
	kafenio = nodereq.perastike('kafenio');

	kinisi = new Kinisi('MV');
	kinisi.data = {
		pektis: pektis,
	};

	if (trapezi) {
		Service.sizitisi.moliviTrapezi[pektis] = trapezi;
		kinisi.data.trapezi = trapezi.trapeziKodikosGet();
	}

	if (kafenio) {
		Service.sizitisi.moliviKafenio[pektis] = true;
		kinisi.data.kafenio = 1;
	}

	Server.skiniko.
	kinisiAdd(kinisi);
};

Service.sizitisi.moliviAkirosi = function(nodereq) {
	var pektis, trapezi, kafenio, kinisi;

	if (nodereq.isvoli()) return;
	nodereq.end();

	pektis = nodereq.loginGet();

	trapezi = Service.sizitisi.moliviTrapezi[pektis];
	delete Service.sizitisi.moliviTrapezi[pektis];

	kafenio = Service.sizitisi.moliviKafenio[pektis];
	delete Service.sizitisi.moliviKafenio[pektis];

	if ((!trapezi) && (!kafenio))
	return;

	kinisi = new Kinisi('VM');
	kinisi.data = {
		pektis: pektis,
	}

	if (trapezi)
	kinisi.data.trapezi = trapezi.trapeziKodikosGet();

	if (kafenio)
	kinisi.data.kafenio = 1;

	Server.skiniko.
	kinisiAdd(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.sizitisi.diagrafi = function(nodereq) {
	var trapezi, sxolio, kritirio, conn, query;

	if (nodereq.isvoli()) return;

	trapezi = nodereq.trapeziGet();
	if (!trapezi) return nodereq.error('Δεν επιτρέπεται διαγραφή στη δημόσια συζήτηση');

	if (nodereq.oxiPektis()) return;

	sxolio = parseInt(nodereq.url.sxolio);

	if (!sxolio)
	kritirio = '`trapezi` = ' + trapezi.trapeziKodikosGet();

	else if (parseInt(sxolio) != sxolio)
	return nodereq.error('Λανθασμένος κωδικός σχολίου');

	else
	kritirio = '`kodikos` = ' + sxolio;

	conn = DB.connection();
	query = 'DELETE FROM `sizitisi` WHERE ' + kritirio;
	conn.query(query, function(conn, res) {
		var kinisi;

		conn.free();
		if (sxolio && (conn.affectedRows < 1))
		return nodereq.end();	// δεν πρέπει να επιστρέψουμε μήνυμα λάθους

		kinisi = new Kinisi({
			idos: 'ZS',
			data: {
				trapezi: trapezi.trapeziKodikosGet(),
				pektis: nodereq.loginGet(),
			},
		});

		if (sxolio)
		kinisi.data.sxolio = sxolio;

		nodereq.end();
		Server.skiniko.
		processKinisi(kinisi).
		kinisiAdd(kinisi);
	});
};

Service.sizitisi.clearKafenio = function(nodereq) {
	var pektis, conn, query;

	if (nodereq.isvoli()) return;
	if (nodereq.pektisGet().pektisOxiEpoptis())
	return nodereq.error('Δεν έχετε δικαίωμα διαγραφής της δημόσιας συζήτησης');

	pektis = nodereq.loginGet();
	console.log('Εκκαθάριση δημόσιας συζήτησης από τον χρήστη "' + pektis + '"');
	conn = DB.connection();
	query = 'DELETE FROM `sizitisi` WHERE `trapezi` IS NULL';
	conn.query(query, function(conn, res) {
		var kinisi;

		conn.free();
		if (conn.affectedRows < 1)
		return nodereq.error('Δεν έγινε καθαρισμός δημόσιας συζήτησης');

		kinisi = new Kinisi({
			idos: 'ZS',
			data: {
				pektis: pektis,
			},
		});

		nodereq.end();
		Server.skiniko.
		processKinisi(kinisi).
		kinisiAdd(kinisi);
	});
};
