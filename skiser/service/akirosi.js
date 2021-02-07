////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: akirosi');

Service.akirosi = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.akirosi.start = function(nodereq) {
	var data, energiaArray, energia, idos;

	if (nodereq.isvoli()) return;

	data = {
		nodereq: nodereq,
	};

	data.trapezi = nodereq.trapeziGet();
	if (!data.trapezi)
	return nodereq.error('ακαθόριστο τραπέζι');

	if (!data.trapezi.trapeziKlidoma('akirosi.start'))
	return  nodereq.error('Το τραπέζι είναι κλειδωμένο');

	data.pektis = nodereq.sinedriaGet().sinedriaThesiGet();
	if (!data.pektis) {
		data.trapezi.trapeziXeklidoma();
		return nodereq.error('Ακαθόριστη θέση παίκτη');
	}

	if (data.trapezi.partidaOxiFasiInteractive())
	return Service.akirosi.apotixia(data, 'Τραπέζι εκτός φάσης');

	data.dianomi = data.trapezi.trapeziTelefteaDianomi();
	if (!data.dianomi)
	return Service.akirosi.apotixia(data, 'Ακαθόριστη διανομή');

	if (!data.dianomi.hasOwnProperty('energiaArray'))
	return Service.akirosi.stop2(data, 'Δεν υπάρχουν ενέργειες στη διανομή');

	energiaArray = data.dianomi.energiaArray;
	if (energiaArray.length < 2)
	return Service.akirosi.stop2(data, 'Δεν υπάρχουν ενέργειες προς διαγραφή');

	// Εκκινούμε την ακύρωση ενεργειών ακυρώνοντας την τελευταία ενέργεια.
	// Ωστόσο, υπάρχει περίπτωση η ενέργεια που ακυρώνουμε να επισύρει και
	// επιπλέον ακυρώσεις.

	data.ecount = energiaArray.length - 1;
	while (true) {
		energia = energiaArray[data.ecount];
		data.energiaKodikos = energia.energiaKodikosGet();
		if (!data.energiaKodikos)
		return Service.akirosi.apotixia(data, 'Ακαθόριστη ενέργεια προς διαγραφή');

		idos = energia.energiaIdosGet();
		if (idos === 'ΤΖΟΓΟΣ') {
			data.ecount--;
			continue;
		}

		break;
	}

	data.dianomiKodikos = data.dianomi.dianomiKodikosGet();
	DB.connection().transaction(function(conn) {
		data.conn = conn;
		Service.akirosi.start2(data);
	});
};

Service.akirosi.start2 = function(data) {
	var query = 'INSERT INTO `akirosi` (`kodikos`, `dianomi`, `pektis`, `akirotis`, `idos`, ' +
		'`data`, `pote`) SELECT `kodikos`, `dianomi`, `pektis`, ' + data.pektis +
		', `idos`, `data`, `pote` FROM `energia` WHERE `dianomi` = ' + data.dianomiKodikos +
		' AND `kodikos` >= ' + data.energiaKodikos;
	data.conn.query(query, function(conn, res) {
		if (conn.affectedRows < 1)
		return Service.akirosi.apotixia(data, 'Αποτυχία καταχώρησης ακύρωσης στην database');

		data.plithos = conn.affectedRows;
		Service.akirosi.start3(data);
	});
};

Service.akirosi.start3 = function(data) {
	var query = 'DELETE FROM `energia` WHERE `dianomi` = ' + data.dianomiKodikos +
		' AND `kodikos` >= ' + data.energiaKodikos;
	data.conn.query(query, function(conn, res) {
		if (conn.affectedRows != data.plithos)
		return Service.akirosi.apotixia(data, 'Αποτυχία διαγραφής ενέργειας από την database');

		Service.akirosi.start4(data);
	});
};

Service.akirosi.start4 = function(data) {
	var kinisi;

	data.conn.commit();
	delete data.conn;
	data.nodereq.end();

	kinisi = new Kinisi({
		idos: 'AK',
		data: {
			trapezi: data.trapezi.trapeziKodikosGet(),
			pektis: data.nodereq.loginGet(),
			ecount: data.ecount,
		},
	});

	Server.skiniko.
	processKinisi(kinisi).
	kinisiAdd(kinisi);
	data.trapezi.trapeziXeklidoma();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.akirosi.stop = function(nodereq) {
	var data;

	if (nodereq.isvoli()) return;

	data = {
		nodereq: nodereq,
	};

	data.trapezi = nodereq.trapeziGet();
	if (!data.trapezi)
	return nodereq.error('ακαθόριστο τραπέζι');

	if (!data.trapezi.trapeziKlidoma('akirosi.stop'))
	return nodereq.error('Το τραπέζι είναι κλειδωμένο');

	Service.akirosi.stop2(data);
};

Service.akirosi.stop2 = function(data, msg) {
	var kinisi = new Kinisi({
		idos: 'AK',
		data: {
			trapezi: data.trapezi.trapeziKodikosGet(),
		},
	});

	Server.skiniko.
	processKinisi(kinisi).
	kinisiAdd(kinisi);
	data.nodereq.end(msg);
	data.trapezi.trapeziXeklidoma();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.akirosi.apotixia = function(data, msg) {
	if (data.conn)
	data.conn.rollback();

	if (data.trapezi)
	data.trapezi.trapeziXeklidoma();

	data.nodereq.error(msg);
};
