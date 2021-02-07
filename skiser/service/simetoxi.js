////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: simetoxi');

Service.simetoxi = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.simetoxi.dilosi = function(nodereq) {
	var data;

	if (nodereq.isvoli())
	return;

	if (nodereq.denPerastike('thesi', true))
	return;

	if (nodereq.denPerastike('dilosi', true))
	return;

	if (Prefadoros.oxiThesi(nodereq.url.thesi))
	return nodereq.error('ακαθόριστη θέση δηλούντος');

	nodereq.url.thesi = parseInt(nodereq.url.thesi);

	switch (nodereq.url.dilosi) {
	case 'ΠΑΙΖΩ':
	case 'ΠΑΣΟ':
	case 'ΜΟΝΟΣ':
	case 'ΜΑΖΙ':
		break;
	default:
		return nodereq.error('ακαθόριστη δήλωση συμμετοχής');
	}

	data = {
		nodereq: nodereq,
	};

	data.trapezi = nodereq.trapeziGet();

	if (!data.trapezi)
	return Service.simetoxi.apotixia(data, 'ακαθόριστο τραπέζι');

	if (!data.trapezi.trapeziKlidoma('simetoxi.dilosi'))
	return  Service.simetoxi.apotixia(data, 'Το τραπέζι είναι κλειδωμένο');

	if (data.trapezi.partidaFasiGet() !== 'ΣΥΜΜΕΤΟΧΗ')
	return  Service.simetoxi.apotixia(data, 'Τραπέζι εκτός φάσης');

	if (Debug.flagGet('epomenosCheck') && (data.trapezi.partidaEpomenosGet() !== nodereq.url.thesi))
	return  Service.simetoxi.apotixia(data, 'Παίκτης εκτός φάσης');

	data.dianomi = data.trapezi.trapeziTelefteaDianomi();

	if (!data.dianomi)
	return Service.simetoxi.apotixia(data, 'ακαθόριστη διανομή');

	data.trapeziKodikos = data.trapezi.trapeziKodikosGet();
	data.dianomiKodikos = data.dianomi.dianomiKodikosGet();

	DB.connection().transaction(function(conn) {
		data.conn = conn;
		Service.simetoxi.dilosi2(data);
	});
};

Service.simetoxi.dilosi2 = function(data) {
	data.kinisiSimetoxi = new Kinisi({
		idos: 'EG',
		data: {
			trapezi: data.trapeziKodikos,
			dianomi: data.dianomiKodikos,
			pektis: data.trapezi.partidaEpomenosGet(),
			idos: 'ΣΥΜΜΕΤΟΧΗ',
			data: data.nodereq.url.dilosi,
		},
	});

	query = 'INSERT INTO `energia` (`dianomi`, `pektis`, `idos`, `data`) VALUES (' +
		data.kinisiSimetoxi.data.dianomi + ', ' + data.kinisiSimetoxi.data.pektis + ', ' +
		data.kinisiSimetoxi.data.idos.json() + ', ' + data.kinisiSimetoxi.data.data.json() + ')';
	data.conn.query(query, function(conn, res) {
		if (conn.affectedRows != 1)
		return Service.simetoxi.apotixia(data, 'Απέτυχε η ένταξη της δήλωσης συμμετοχής στην database');

		data.energiaSimetoxiKodikos = res.insertId;
		data.kinisiSimetoxi.data.kodikos = data.energiaSimetoxiKodikos;
		Server.skiniko.
		processKinisi(data.kinisiSimetoxi);

		if (data.trapezi.partidaFasiGet() === 'ΠΛΗΡΩΜΗ')
		return Service.simetoxi.dilosi3(data);

		data.conn.commit();
		data.nodereq.end();

		Server.skiniko.
		kinisiAdd(data.kinisiSimetoxi);
		data.trapezi.trapeziXeklidoma();
	});
};

Service.simetoxi.dilosi3 = function(data) {
	var query;

	query = data.dianomi.queryPliromi();
	data.conn.query(query, function(conn, res) {
		var kinisiPliromi;

		if (conn.affectedRows != 1)
		return Service.simetoxi.dilosi4(data);

		data.conn.commit();
		data.nodereq.end();

		kinisiPliromi = data.dianomi.kinisiPliromi();
		Server.skiniko.
		processKinisi(kinisiPliromi).
		kinisiAdd(data.kinisiSimetoxi, false).
		kinisiAdd(kinisiPliromi);

		data.trapezi.trapeziXeklidoma();
		Service.trapezi.dianomiSeLigo(data.trapezi, 3000);
	});
};

Service.simetoxi.dilosi4 = function(data) {
	data.conn.rollback();

	data.dianomi.dianomiEnergiaDelete(data.energiaSimetoxiKodikos);
	data.dianomi.energiaArray.pop();

	data.trapezi.
	partidaReplay().
	trapeziXeklidoma();

	data.nodereq.error('Απέτυχε η πληρωμή της διανομής στην database');
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.simetoxi.apotixia = function(data, msg) {
	if (data.conn) data.conn.rollback();
	if (data.trapezi) data.trapezi.trapeziXeklidoma();
	data.nodereq.error(msg);
};
