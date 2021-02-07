////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: dilosi');

Service.dilosi = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.dilosi.dilosi = function(nodereq) {
	var data;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('thesi', true)) return;
	if (nodereq.denPerastike('dilosi', true)) return;

	if (Prefadoros.oxiThesi(nodereq.url.thesi)) return nodereq.error('ακαθόριστη θέση δηλούντος');
	nodereq.url.thesi = parseInt(nodereq.url.thesi);

	data = {
		nodereq: nodereq,
	};

	data.trapezi = nodereq.trapeziGet();
	if (!data.trapezi)
	return Service.dilosi.apotixia(data, 'ακαθόριστο τραπέζι');

	if (!data.trapezi.trapeziKlidoma('dilosi.dilosi'))
	return  Service.dilosi.apotixia(data, 'Το τραπέζι είναι κλειδωμένο');

	if (data.trapezi.partidaFasiGet() !== 'ΔΗΛΩΣΗ')
	return  Service.dilosi.apotixia(data, 'Τραπέζι εκτός φάσης');

	if (Debug.flagGet('epomenosCheck') && (data.trapezi.partidaEpomenosGet() !== nodereq.url.thesi))
	return  Service.dilosi.apotixia(data, 'Παίκτης εκτός φάσης');

	data.dianomi = data.trapezi.trapeziTelefteaDianomi();

	if (!data.dianomi)
	return Service.dilosi.apotixia(data, 'ακαθόριστη διανομή');

	data.trapeziKodikos = data.trapezi.trapeziKodikosGet();
	data.dianomiKodikos = data.dianomi.dianomiKodikosGet();

	DB.connection().transaction(function(conn) {
		data.conn = conn;
		Service.dilosi.dilosi2(data);
	});
};

Service.dilosi.dilosi2 = function(data) {
	data.kinisiDilosi = new Kinisi({
		idos: 'EG',
		data: {
			trapezi: data.trapeziKodikos,
			dianomi: data.dianomiKodikos,
			pektis: data.trapezi.partidaEpomenosGet(),
			idos: 'ΔΗΛΩΣΗ',
			data: data.nodereq.url.dilosi,
		},
	});

	query = 'INSERT INTO `energia` (`dianomi`, `pektis`, `idos`, `data`) VALUES (' +
		data.kinisiDilosi.data.dianomi + ', ' + data.kinisiDilosi.data.pektis + ', ' +
		data.kinisiDilosi.data.idos.json() + ', ' + data.kinisiDilosi.data.data.json() + ')';
	data.conn.query(query, function(conn, res) {
		if (conn.affectedRows != 1)
		return Service.dilosi.apotixia(data, 'Απέτυχε η ένταξη της δήλωσης στην database');

		data.kinisiDilosi.data.kodikos = res.insertId;
		Server.skiniko.
		processKinisi(data.kinisiDilosi).
		kinisiAdd(data.kinisiDilosi, false);

		data.conn.commit(function() {
			data.conn.free();
			delete data.conn;

			switch (data.trapezi.partidaFasiGet()) {
			case 'ΔΙΑΝΟΜΗ':
				Service.dilosi.flop(data);
				break;
			case 'ΑΛΛΑΓΗ':
				Service.dilosi.alagi(data);
				break;
			default:
				data.nodereq.end();
				Server.skiniko.kinisiAdd();
				data.trapezi.trapeziXeklidoma();
				break;
			}
		});
	});
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.dilosi.flop = function(data) {
	var kinisiFlop, conn, query;

	kinisiFlop = new Kinisi({
		idos: 'EG',
		data: {
			trapezi: data.trapeziKodikos,
			dianomi: data.dianomiKodikos,
			pektis: data.trapezi.partidaDealerGet(),
			idos: 'FLOP',
			data: data.trapezi.partidaTzogosGet().xartosia2string(),
		},
	});

	conn = DB.connection();
	query = 'INSERT INTO `energia` (`dianomi`, `pektis`, `idos`, `data`) VALUES (' +
		kinisiFlop.data.dianomi + ', ' + kinisiFlop.data.pektis + ', ' +
		kinisiFlop.data.idos.json() + ', ' + kinisiFlop.data.data.json() + ')';
	conn.query(query, function(conn, res) {
		conn.free();

		if (conn.affectedRows == 1) {
			kinisiFlop.data.kodikos = res.insertId;
			Server.skiniko.
			processKinisi(kinisiFlop).
			kinisiAdd(kinisiFlop, false);
		}

		data.trapezi.trapeziXeklidoma();
		data.nodereq.end();
		Server.skiniko.kinisiAdd();

		Service.trapezi.dianomiSeLigo(data.trapezi, 2000);
	});
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.dilosi.alagi = function(data) {
	var kinisiTzogos, conn, query;

	kinisiTzogos = new Kinisi({
		idos: 'EG',
		data: {
			trapezi: data.trapeziKodikos,
			dianomi: data.dianomiKodikos,
			pektis: data.trapezi.partidaTzogadorosGet(),
			idos: 'ΤΖΟΓΟΣ',
			data: data.trapezi.partidaTzogosGet().xartosia2string(),
		},
	});

	conn = DB.connection();
	query = 'INSERT INTO `energia` (`dianomi`, `pektis`, `idos`, `data`) VALUES (' +
		kinisiTzogos.data.dianomi + ', ' + kinisiTzogos.data.pektis + ', ' +
		kinisiTzogos.data.idos.json() + ', ' + kinisiTzogos.data.data.json() + ')';
	conn.query(query, function(conn, res) {
		conn.free();
		if (conn.affectedRows == 1) {
			kinisiTzogos.data.kodikos = res.insertId;
			Server.skiniko.
			processKinisi(kinisiTzogos).
			kinisiAdd(kinisiTzogos, false);
		}

		data.trapezi.trapeziXeklidoma();
		data.nodereq.end();
		Server.skiniko.kinisiAdd();
	});
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.dilosi.apotixia = function(data, msg) {
	if (data.conn) data.conn.rollback();
	if (data.trapezi) data.trapezi.trapeziXeklidoma();
	data.nodereq.error(msg);
};
