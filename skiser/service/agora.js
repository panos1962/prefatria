////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: agora');

Service.agora = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.agora.agora = function(nodereq) {
	var data = {
		nodereq: nodereq,
	};

	if (nodereq.isvoli()) return;

	if (nodereq.denPerastike('tzogadoros', true)) return;
	if (Prefadoros.oxiThesi(nodereq.url.tzogadoros)) return nodereq.error('ακαθόριστη θέση τζογαδόρου');
	data.tzogadoros = parseInt(nodereq.url.tzogadoros);

	if (nodereq.denPerastike('agora', true)) return;
	data.agora = new Dilosi(nodereq.url.agora);
	if (data.agora.dilosiOxiSolo() && nodereq.denPerastike('skarta', true)) return;

	data.trapezi = nodereq.trapeziGet();
	if (!data.trapezi)
	return nodereq.error('ακαθόριστο τραπέζι');

	if (!data.trapezi.trapeziKlidoma('agora.agora'))
	return  Service.agora.apotixia(data, 'Το τραπέζι είναι κλειδωμένο');

	if (data.trapezi.partidaFasiGet() !== 'ΑΛΛΑΓΗ')
	return  Service.agora.apotixia(data, 'Τραπέζι εκτός φάσης');

	if (Debug.flagGet('agoraEpomenosCheck') &&
	(data.trapezi.partidaEpomenosGet() !== data.trapezi.partidaTzogadorosGet()))
	return  Service.agora.apotixia(data, 'Παίκτης εκτός φάσης');

	if (data.tzogadoros !== data.trapezi.partidaTzogadorosGet())
	return  Service.agora.apotixia(data, 'Ασυμφωνία θέσης τζογαδόρου');

	data.dianomi = data.trapezi.trapeziTelefteaDianomi();
	if (!data.dianomi) return Service.agora.apotixia(data, 'ακαθόριστη διανομή');

	data.trapeziKodikos = data.trapezi.trapeziKodikosGet();
	data.dianomiKodikos = data.dianomi.dianomiKodikosGet();

	DB.connection().transaction(function(conn) {
		data.conn = conn;
		if (data.agora.dilosiIsSolo()) return Service.agora.solo(data);
		Service.agora.agora2(data);
	});
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.agora.agora2 = function(data) {
	data.kinisiAgora = new Kinisi({
		idos: 'EG',
		data: {
			trapezi: data.trapeziKodikos,
			dianomi: data.dianomiKodikos,
			pektis: data.tzogadoros,
			idos: 'ΑΓΟΡΑ',
			data: data.nodereq.url.agora + data.nodereq.url.skarta,
		},
	});

	query = 'INSERT INTO `energia` (`dianomi`, `pektis`, `idos`, `data`) VALUES (' +
		data.kinisiAgora.data.dianomi + ', ' + data.kinisiAgora.data.pektis + ', ' +
		data.kinisiAgora.data.idos.json() + ', ' + data.kinisiAgora.data.data.json() + ')';
	data.conn.query(query, function(conn, res) {
		if (conn.affectedRows != 1)
		return Service.dilosi.apotixia(data, 'Απέτυχε η ένταξη της δήλωσης στην database');

		data.kinisiAgora.data.kodikos = res.insertId;
		Service.agora.agora3(data);
	});
};

Service.agora.agora3 = function(data) {
	data.conn.commit();
	data.nodereq.end();

	Server.skiniko.
	processKinisi(data.kinisiAgora).
	kinisiAdd(data.kinisiAgora);
	data.trapezi.trapeziXeklidoma();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.agora.solo = function(data) {
	data.kinisiSolo = new Kinisi({
		idos: 'EG',
		data: {
			trapezi: data.trapeziKodikos,
			dianomi: data.dianomiKodikos,
			pektis: data.tzogadoros,
			idos: 'ΣΟΛΟ',
			data: data.nodereq.url.agora,
		},
	});

	query = 'INSERT INTO `energia` (`dianomi`, `pektis`, `idos`, `data`) VALUES (' +
		data.kinisiSolo.data.dianomi + ', ' + data.kinisiSolo.data.pektis + ', ' +
		data.kinisiSolo.data.idos.json() + ', ' + data.kinisiSolo.data.data.json() + ')';
	data.conn.query(query, function(conn, res) {
		if (conn.affectedRows != 1)
		return Service.dilosi.apotixia(data, 'Απέτυχε η ένταξη της σολαρίας στην database');

		data.kinisiSolo.data.kodikos = res.insertId;
		Service.agora.solo2(data);
	});
};

Service.agora.solo2 = function(data) {
	Server.skiniko.
	processKinisi(data.kinisiSolo).
	kinisiAdd(data.kinisiSolo, false);

	query = data.dianomi.queryPliromi();
	data.conn.query(query, function(conn, res) {
		if (conn.affectedRows != 1)
		return Service.dilosi.apotixia(data, 'Απέτυχε η ενημέρωση πληρωμής σολαρίας στην database');

		Service.agora.solo3(data);
	});
};

Service.agora.solo3 = function(data) {
	var kinisiPliromi;

	data.conn.commit();
	data.nodereq.end();

	kinisiPliromi = data.dianomi.kinisiPliromi();
	Server.skiniko.
	processKinisi(kinisiPliromi).
	kinisiAdd(kinisiPliromi);
	data.trapezi.trapeziXeklidoma();

	Service.trapezi.dianomiSeLigo(data.trapezi, 3000);
	Server.apodosiEnimerosi(data.trapezi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.agora.apotixia = function(data, msg) {
	if (data.conn) data.conn.rollback();
	if (data.trapezi) data.trapezi.trapeziXeklidoma();
	data.nodereq.error(msg);
};
