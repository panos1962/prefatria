////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: minima');

Service.minima = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.minima.send = function(nodereq) {
	var paraliptis, apostoleas, kimeno, query;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('pektis', true)) return;
	if (nodereq.denPerastike('kimeno', true)) return;

	apostoleas = nodereq.loginGet();
	paraliptis = nodereq.url.pektis;
	kimeno = nodereq.url.kimeno;

	query = 'INSERT INTO `minima` (`apostoleas`, `paraliptis`, `kimeno`) VALUES (' +
		apostoleas.json() + ', ' + paraliptis.json() + ', ' + kimeno.json(false) + ')';
	DB.connection().query(query, function(conn, rows) {
		var minimaId, kinisi;

		conn.free();
		if (conn.affectedRows != 1)
		return nodereq.error('Απέτυχε η αποστολή του μηνύματος');

		minimaId = conn.insertId;
		nodereq.end(minimaId);

		kinisi = new Kinisi({
			idos: 'ML',
			data: {
				kodikos: minimaId,
				apostoleas: apostoleas,
				paraliptis: paraliptis,
				kimeno: kimeno,
				pote: Globals.tora(),
				status: 'ΑΔΙΑΒΑΣΤΟ',
			}
		});

		Server.skiniko.
		kinisiAdd(kinisi);
	});
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.minima.diagrafi = function(nodereq) {
	var login, query;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('minima', true)) return;

	login = nodereq.loginGet().toLowerCase();

	query = 'SELECT `apostoleas`, `paraliptis`, `status` ' +
		'FROM `minima` WHERE `kodikos` = ' + nodereq.url.minima;
	DB.connection().query(query, function(conn, rows) {
		conn.free();
		if (rows.length != 1)
		return nodereq.error('Δεν βρέθηκε το μήνυμα');

		// Ο παραλήπτης του μηνύματος έχει πάντοτε δικαίωμα διαγραφής.

		if (rows[0].paraliptis.toLowerCase() == login)
		return Service.minima.diagrafi2(nodereq);

		// Ο μόνος που έχει δικαίωμα διαγραφής πέραν του αποστολέως
		// είναι ο συντάκτης του μηνύματος, και αυτός μόνον υπό
		// προϋποθέσεις.

		if (rows[0].apostoleas.toLowerCase() != login)
		return nodereq.error('Δεν έχετε πρόσβαση');

		// Ο αποστολέας επιχειρεί να διαγράψει το μήνυμα, επομένως
		// θα πρέπει να ελεγχθεί τυχόν κράτηση του μηνύματος από
		// τον παραλήπτη.

		if (rows[0].status == 'ΚΡΑΤΗΜΕΝΟ')
		return nodereq.error('Το μήμυμα έχει κρατηθεί από τον παραλήπτη');

		Service.minima.diagrafi2(nodereq);
	});
};

Service.minima.diagrafi2 = function(nodereq) {
	var query;

	query = 'DELETE FROM `minima` WHERE `kodikos` = ' + nodereq.url.minima;
	DB.connection().query(query, function(conn, rows) {
		conn.free();
		if (conn.affectedRows != 1)
		return nodereq.error('Απέτυχε η διαγραφή του μηνύματος');

		nodereq.end();
	});
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.minima.katastasi = function(nodereq) {
	var login, query;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('minima', true)) return;
	if (nodereq.denPerastike('katastasi', true)) return;

	login = nodereq.loginGet();

	query = 'SELECT `apostoleas`, `paraliptis`, `status` FROM `minima` ' +
		'WHERE `kodikos` = ' + nodereq.url.minima;
	DB.connection().query(query, function(conn, rows) {
		conn.free();
		if (rows.length != 1)
		return nodereq.error('Δεν βρέθηκε το μήνυμα');

		if (rows[0].paraliptis != login)
		return nodereq.error('Δεν είστε παραλήπτης του μηνύματος');

		if (rows[0].paraliptis != login)
		return nodereq.error('Δεν έχετε πρόσβαση');

		Service.minima.katastasi2(nodereq);
	});
};

Service.minima.katastasi2 = function(nodereq) {
	var query;

	katastasi = nodereq.url.katastasi;
	query = 'UPDATE `minima` SET `status` = ' + katastasi.json() +
		' WHERE `kodikos` = ' + nodereq.url.minima;
	DB.connection().query(query, function(conn, rows) {
		conn.free();
		if (conn.affectedRows != 1)
		return nodereq.error('Απέτυχε η αλλαγή κατάστασης του μηνύματος');

		nodereq.end(katastasi);
	});
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.minima.feredata = function(nodereq) {
	var login, pektis, last, query;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('last', true)) return;
	login = nodereq.loginGet();
	pektis = nodereq.pektisGet();
	last = parseInt(nodereq.url.last);
	if (isNaN(last)) nodereq.error('ακαθόριστος κωδικός τελευταίου ληφθέντος μηνύματος');

	query = 'SELECT `kodikos`, `apostoleas`, `paraliptis`, `kimeno`, ' +
		'UNIX_TIMESTAMP(`pote`) AS `pote`, `status` FROM `minima` ' +
		'WHERE (`kodikos` > ' + last + ') AND ((`apostoleas` LIKE ' + login.json() +
		') OR (`paraliptis` LIKE ' + login.json() + ')) ORDER BY `kodikos`';
	DB.connection().query(query, function(conn, rows) {
		var i;

		conn.free();
		for (i = 0; i < rows.length; i++) {
			if ((rows[i].paraliptis != login) && (rows[i].status === 'ΚΡΑΤΗΜΕΝΟ'))
			continue;

			if (pektis.pektisIsApoklismenos(rows[i].apostoleas))
			continue;

			nodereq.write('\t' + JSON.stringify(rows[i]) + ',\n');
		}
		nodereq.end();
	});
};
