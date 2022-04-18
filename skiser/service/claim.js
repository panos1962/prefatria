////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: claim');

Service.claim = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.claim.protasi = function(nodereq) {
	var data;

	if (nodereq.isvoli()) return;

	data = {
		nodereq: nodereq,
	};

	data.trapezi = nodereq.trapeziGet();
	if (!data.trapezi) return nodereq.error('ακαθόριστο τραπέζι');
	if (data.trapezi.partidaFasiGet() !== 'ΠΑΙΧΝΙΔΙ') return  nodereq.error('Τραπέζι εκτός φάσης');
	if (!data.trapezi.trapeziKlidoma('claim.protasi')) return  nodereq.error('Το τραπέζι είναι κλειδωμένο');
	data.trapeziKodikos = data.trapezi.trapeziKodikosGet();

	data.dianomi = data.trapezi.trapeziTelefteaDianomi();
	if (!data.dianomi) return Service.dilosi.apotixia(data, 'ακαθόριστη διανομή');
	data.dianomiKodikos = data.dianomi.dianomiKodikosGet();

	data.pektis = data.trapezi.partidaEpomenosGet();
	if (data.pektis != data.trapezi.partidaTzogadorosGet()) return  Service.claim.apotixia('Παίκτης εκτός φάσης');

	// Επιτρέπουμε claim μόνον τη στιγμή που ο τζογαδόρος έχει
	// σειρά να παίξει το πρώτο φύλλο μιας καινούριας μπάζας.

	if (!data.trapezi.hasOwnProperty('bazaFila')) return Service.claim.apotixia('Ακαθόριστα φύλλα μπάζας');
	if (data.trapezi.bazaFila.length) return Service.claim.apotixia('Μπάζα εκτός φάσης');

	DB.connection().transaction(function(conn) {
		data.conn = conn;
		Service.claim.protasi2(data);
	});
};

Service.claim.protasi2 = function(data) {
	data.kinisiClaim = new Kinisi({
		idos: 'EG',
		data: {
			trapezi: data.trapeziKodikos,
			dianomi: data.dianomiKodikos,
			pektis: data.pektis,
			idos: 'CLAIM',
			data: data.trapezi.partidaFilaGet(data.pektis).xartosia2string(),
		},
	});

	query = 'INSERT INTO `energia` (`dianomi`, `pektis`, `idos`, `data`) VALUES (' +
		data.dianomiKodikos + ', ' + data.pektis + ', ' + data.kinisiClaim.data.idos.json() + ', ' +
		data.kinisiClaim.data.data.json() + ')';
	data.conn.query(query, function(conn, res) {
		if (conn.affectedRows != 1)
		return Service.claim.apotixia(data, 'Απέτυχε η ένταξη του αιτήματος claim στην database');

		data.conn.commit();
		delete data.conn;

		data.nodereq.end();
		delete data.nodereq;

		data.kinisiClaim.data.kodikos = res.insertId;
		Server.skiniko.
		processKinisi(data.kinisiClaim).
		kinisiAdd(data.kinisiClaim);
		Server.skiniko.kinisiAdd();
		data.trapezi.trapeziXeklidoma();
	});
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.claim.apantisi = function(nodereq) {
	var data;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('apodoxi', true)) return;

	data = {
		nodereq: nodereq,
		apodoxi: nodereq.url.apodoxi,
	};

	data.trapezi = nodereq.trapeziGet();
	if (!data.trapezi) return nodereq.error('ακαθόριστο τραπέζι');
	if (data.trapezi.partidaFasiGet() !== 'CLAIM') return  nodereq.error('Τραπέζι εκτός φάσης');
	if (!data.trapezi.trapeziKlidoma('claim.apantisi')) return  nodereq.error('Το τραπέζι είναι κλειδωμένο');
	data.trapeziKodikos = data.trapezi.trapeziKodikosGet();

	data.dianomi = data.trapezi.trapeziTelefteaDianomi();
	if (!data.dianomi) return Service.dilosi.apotixia(data, 'ακαθόριστη διανομή');
	data.dianomiKodikos = data.dianomi.dianomiKodikosGet();

	data.pektis = data.trapezi.partidaEpomenosGet();
	if (data.pektis == data.trapezi.partidaTzogadorosGet()) Service.claim.apotixia('Τζογαδόρος');
	if (data.trapezi.sdilosi[data.pektis].simetoxiIsPaso()) Service.claim.apotixia('Παίκτης εκτός φάσης');
	if (!data.trapezi.hasOwnProperty('claim')) Service.claim.apotixia('Δεν βρέθηκε δομή claim στο τραπέζι');

	DB.connection().transaction(function(conn) {
		data.conn = conn;
		if (data.apodoxi === 'ΝΑΙ') Service.claim.apantisi2(data);
		else Service.claim.apantisi3(data);
	});
};

Service.claim.apantisi2 = function(data) {
	var query;

	data.kinisiParetisi = new Kinisi({
		idos: 'EG',
		data: {
			trapezi: data.trapeziKodikos,
			dianomi: data.dianomiKodikos,
			pektis: data.pektis,
			idos: 'ΠΑΡΑΙΤΗΣΗ',
			data: data.apodoxi,
		},
	});

	query = 'INSERT INTO `energia` (`dianomi`, `pektis`, `idos`, `data`) VALUES (' +
		data.dianomiKodikos + ', ' + data.pektis + ', ' + data.kinisiParetisi.data.idos.json() + ', ' +
		data.kinisiParetisi.data.data.json() + ')';
	data.conn.query(query, function(conn, res) {
		if (conn.affectedRows != 1)
		return Service.claim.apotixia(data, 'Απέτυχε η ένταξη απάντησης σε αίτημα claim στην database');

		data.energiaParetisiKodikos = res.insertId;
		data.kinisiParetisi.data.kodikos = data.energiaParetisiKodikos;

		Server.skiniko.
		processKinisi(data.kinisiParetisi);
		switch (data.trapezi.partidaFasiGet()) {
		case 'ΠΛΗΡΩΜΗ':
			Service.claim.pliromi(data);
			break;
		default:
			data.conn.commit();
			delete data.conn;

			data.trapezi.trapeziXeklidoma();
			data.nodereq.end();

			Server.skiniko.
			kinisiAdd(data.kinisiParetisi);
			break;
		}
	});
};

Service.claim.apantisi3 = function(data) {
	var energiaArray, i, query;

	energiaArray = data.dianomi.energiaArray;
	for (i = 0; i < energiaArray.length; i++) {
		if (energiaArray[i].energiaIdosGet() === 'CLAIM')
		break;
	}

	if (i >= energiaArray.length)
	return Service.claim.apotixia(data, 'Δεν βρέθηκε ενέργεια claim');

	query = 'DELETE FROM `energia` WHERE `dianomi` = ' + data.dianomiKodikos +
		' AND `kodikos` >= ' + energiaArray[i].energiaKodikosGet();
	data.conn.query(query, function(conn, res) {
		if (conn.affectedRows < 1)
		return Service.claim.apotixia(data, 'Απέτυχε η διαγραφή ενεργειών από την database');

		data.energiaCount = i;
		Service.claim.apantisi4(data);
	});
};

Service.claim.apantisi4 = function(data) {
	var kinisiReject;

	data.conn.commit();
	delete data.conn;

	data.nodereq.end();
	delete data.nodereq;

	kinisiReject = new Kinisi({
		idos: 'RC',	// reject claim
		data: {
			trapezi: data.trapeziKodikos,
			dianomi: data.dianomiKodikos,
			ecount: data.energiaCount,
		},
	});

	Server.skiniko.
	processKinisi(kinisiReject).
	kinisiAdd(kinisiReject);
	data.trapezi.trapeziXeklidoma();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.claim.pliromi = function(data) {
	var query;

	query = data.dianomi.queryPliromi();
	data.conn.query(query, function(conn, res) {
		if (conn.affectedRows == 1) 
		return Service.claim.pliromi2(data);

		data.conn.rollback();
		delete data.conn;

		data.dianomi.dianomiEnergiaDelete(data.energiaParetisiKodikos);
		data.dianomi.energiaArray.pop();
		data.trapezi.partidaReplay();
		Service.claim.apotixia(data, 'Απέτυχε η ενημέρωση πληρωμής διανομής στην database');
	});
};

Service.claim.pliromi2 = function(data) {
	var kinisiPliromi;

	data.conn.commit();
	delete data.conn;

	kinisiPliromi = data.dianomi.kinisiPliromi();
	Server.skiniko.
	processKinisi(kinisiPliromi).
	kinisiAdd(data.kinisiParetisi, false).
	kinisiAdd(kinisiPliromi);
	data.trapezi.trapeziXeklidoma();
	data.nodereq.end();

	Service.trapezi.dianomiSeLigo(data.trapezi);
	Server.apodosiEnimerosi(data.trapezi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.claim.apotixia = function(data, msg) {
	if (data.conn) data.conn.rollback();
	if (data.trapezi) data.trapezi.trapeziXeklidoma();
	if (data.nodereq) data.nodereq.error(msg);
};
