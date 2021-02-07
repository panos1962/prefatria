////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: arvila');

Service.arvila = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.arvila.apostoli = function(nodereq) {
	var trapezi, sinedria, pektis, pros, apo, conn, query;

	if (nodereq.isvoli())
	return;

	if (nodereq.oxiTrapezi())
	return;

	if (nodereq.denPerastike('pros', true))
	return;

	trapezi = nodereq.trapeziGet();

	// Δεν επιτρέπεται αποκλεισμός παίκτη του τραπεζιού.

	if (trapezi.trapeziIsPektis(nodereq.url.pros))
	return nodereq.error('arvilaPektis');

	// Ελέγχουμε αν ο παίκτης έχει ήδη αποκλειστεί από το τραπέζι.

	if (trapezi.trapeziIsArvila(nodereq.url.pros))
	return nodereq.error('arvilaExists');

	// Δικαίωμα αποκλεισμού έχουν μόνο οι παίκτες του τραπεζιού και
	// οι αξιωματούχοι από επόπτες και πάνω.

	sinedria = nodereq.sinedriaGet();
	pektis = nodereq.pektisGet();

	if (!Service.arvila.dikeoma(sinedria, pektis))
	return nodereq.error('Δεν έχετε δικαίωμα αποκλεισμού παίκτη από το τραπέζι');

	// Δεν επιτρέπεται αποκλεισμός ανώτερου αξιωματούχου.

	pros = Server.skiniko.skinikoPektisGet(nodereq.url.pros);

	if (!pros)
	return nodereq.error('pektisNotFound');

	if (pros.pektisIsEpoptis())
	return nodereq.error('arvilaNotAllowed');

	// Έχουμε προβεί σε όλους τους απαραίτητους ελέγχους και προχωρούμε
	// στην καταχώρηση του αποκλεισμού στην database.

	apo = nodereq.loginGet();
	trapezi = trapezi.trapeziKodikosGet();

	conn = DB.connection();
	query = 'REPLACE INTO `arvila` (`trapezi`, `apo`, `pros`) VALUES (' +
		trapezi + ', ' + apo.json() + ', ' + nodereq.url.pros.json() + ')';
	conn.query(query, function(conn, res) {
		conn.free();
		if (conn.affectedRows < 1)
		return nodereq.error('Απέτυχε η καταχώρηση του αποκλεισμού');

		Service.arvila.apostoli2(nodereq, trapezi);
	});
};

// Η function "dikeoma" ελέγχει αν ο παίκτης που αιτείται τον αποκλεισμό
// έχει αυτό το δικαίωμα. Δικαίωμα αποκλεισμού έχουν μόνο οι παίκτες του
// τραπεζιού και οι ανώτεροι αξιωματούχοι από επόπτες και πάνω.

Service.arvila.dikeoma = function(sinedria, pektis) {
	if (sinedria.sinedriaIsPektis())
	return true;

	if (pektis.pektisIsEpoptis())
	return true;

	return false;
};

Service.arvila.apostoli2 = function(nodereq, trapezi) {
	var kinisi;

	nodereq.end();

	kinisi = new Kinisi({
		idos: 'AV',
		data: {
			trapezi: trapezi,
			apo: nodereq.login,
			pros: nodereq.url.pros,
		},
	});

	Server.skiniko.
	processKinisi(kinisi).
	kinisiAdd(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.arvila.arsi = function(nodereq) {
	var trapezi, data, conn, query;

	if (nodereq.isvoli())
	return;

	if (nodereq.oxiTrapezi())
	return;

	if (nodereq.denPerastike('pros', true))
	return;

	trapezi = nodereq.trapeziGet();

	if (!trapezi.trapeziArvilaGet(nodereq.url.pros))
	return nodereq.error('arvilaNotFound');

	data = {
		nodereq: nodereq,
		trapezi: trapezi.trapeziKodikosGet(),
		pros: nodereq.url.pros,
	};

	conn = DB.connection();
	query = 'DELETE FROM `arvila` WHERE (`trapezi` = ' + data.trapezi +
		') AND (`pros` = ' + data.pros.json() + ')';
	conn.query(query, function(conn, res) {
		conn.free();
		if (conn.affectedRows != 1)
		return nodereq.error('Απέτυχε η διαγραφή του αποκλεισμού');

		Service.arvila.diagrafi2(data);
	});
};

Service.arvila.diagrafi2 = function(data) {
	var kinisi;

	data.nodereq.end();
	kinisi = new Kinisi({
		idos: 'DV',
		data: {
			trapezi: data.trapezi,
			pros: data.pros,
		},
	});

	Server.skiniko.
	processKinisi(kinisi).
	kinisiAdd(kinisi);
};
