////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: dilosi');

Service.peximo = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.peximo.peximo = function(nodereq) {
	var data, validation;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('pektis', true)) return;
	if (nodereq.denPerastike('filo', true)) return;
	if (nodereq.denPerastike('vld', true)) return;

	// Ελέγχουμε και μετατρέπουμε σε ακέραιο τη θέση του παίκτη
	// που παίζει το φύλλο.

	if (Prefadoros.oxiThesi(nodereq.url.pektis))
	return nodereq.error('ακαθόριστη θέση παίκτη');
	nodereq.url.pektis = parseInt(nodereq.url.pektis);

	data = {
		nodereq: nodereq,
		login: nodereq.loginGet(),
	};

	data.trapezi = nodereq.trapeziGet();
	if (!data.trapezi)
	return Service.peximo.apotixia(data, 'ακαθόριστο τραπέζι');

	if (!data.trapezi.trapeziKlidoma('peximo.peximo'))
	return  Service.peximo.apotixia(data, 'Το τραπέζι είναι κλειδωμένο');

	if (data.trapezi.partidaFasiGet() !== 'ΠΑΙΧΝΙΔΙ')
	return  Service.peximo.apotixia(data, 'Τραπέζι εκτός φάσης');

	if (Debug.flagGet('epomenosCheck') && (data.trapezi.partidaEpomenosGet() !== nodereq.url.pektis))
	return  Service.peximo.apotixia(data, 'Παίκτης εκτός φάσης');

	data.dianomi = data.trapezi.trapeziTelefteaDianomi();
	if (!data.dianomi) return Service.peximo.apotixia(data, 'ακαθόριστη διανομή');

	validation = data.trapezi.validationPeximoFiloData();
	if (nodereq.url.vld != validation) {
		data.trapezi.trapeziXeklidoma();
		console.error(data.login + ': παίχτηκε λάθος φύλλο');
		Service.feredata.freskaReset(nodereq.loginGet());
		return nodereq.end('lathosFilo');
	}

	data.trapeziKodikos = data.trapezi.trapeziKodikosGet();
	data.dianomiKodikos = data.dianomi.dianomiKodikosGet();

	DB.connection().transaction(function(conn) {
		data.conn = conn;
		Service.peximo.peximo2(data);
	});
};

Service.peximo.peximo2 = function(data) {
	var query;

	data.kinisiPeximo = new Kinisi({
		idos: 'EG',
		data: {
			trapezi: data.trapeziKodikos,
			dianomi: data.dianomiKodikos,
			pektis: data.nodereq.url.pektis,
			idos: 'ΦΥΛΛΟ',
			data: data.nodereq.url.filo,
		},
	});

	query = 'INSERT INTO `energia` (`dianomi`, `pektis`, `idos`, `data`) VALUES (' +
		data.kinisiPeximo.data.dianomi + ', ' + data.kinisiPeximo.data.pektis + ', ' +
		data.kinisiPeximo.data.idos.json() + ', ' + data.kinisiPeximo.data.data.json() + ')';
	data.conn.query(query, function(conn, res) {
		if (conn.affectedRows != 1)
		return Service.peximo.apotixia(data, 'Απέτυχε η ένταξη παιξίματος φύλλου στην database');


		data.energiaFiloKodikos = res.insertId;
		data.kinisiPeximo.data.kodikos = data.energiaFiloKodikos;
		Server.skiniko.processKinisi(data.kinisiPeximo);

		switch (data.trapezi.partidaFasiGet()) {
		case 'ΠΛΗΡΩΜΗ':
			Service.peximo.pliromi(data);
			break;
		default:
			data.conn.commit();
			delete data.conn;

			data.trapezi.trapeziXeklidoma();
			data.nodereq.end();

			Server.skiniko.
			kinisiAdd(data.kinisiPeximo);
			break;
		}
	});
};

Service.peximo.pliromi = function(data) {
	var query;

	query = data.dianomi.queryPliromi();
	data.conn.query(query, function(conn, res) {
		if (conn.affectedRows == 1) 
		return Service.peximo.pliromi2(data);

		data.conn.rollback();
		delete data.conn;

		data.dianomi.dianomiEnergiaDelete(data.energiaFiloKodikos);
		data.dianomi.energiaArray.pop();
		data.trapezi.partidaReplay();
		Service.peximo.apotixia(data, 'Απέτυχε η ενημέρωση πληρωμής διανομής στην database');
	});
};

Service.peximo.pliromi2 = function(data) {
	var dianomi, kinisiPliromi;

	dianomi = data.dianomi;
	data.conn.commit();
	delete data.conn;

	kinisiPliromi = data.dianomi.kinisiPliromi();
	Server.skiniko.
	processKinisi(kinisiPliromi).
	kinisiAdd(data.kinisiPeximo, false).
	kinisiAdd(kinisiPliromi);
	data.trapezi.trapeziXeklidoma();
	data.nodereq.end();

	Service.trapezi.dianomiSeLigo(data.trapezi);
	Apodosi.databaseUpdate(data.trapezi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.peximo.apotixia = function(data, msg) {
	if (data.conn) data.conn.rollback();
	if (data.trapezi) data.trapezi.trapeziXeklidoma();
	data.nodereq.error(msg);
};
