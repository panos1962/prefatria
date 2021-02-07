////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: peparam');

Service.peparam = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.peparam.set = function(nodereq) {
	var pektis, conn, query;

	if (nodereq.isvoli())
	return;

	if (nodereq.denPerastike('param', true))
	return;

	if (nodereq.denPerastike('timi', true))
	return;

	pektis = nodereq.pektisGet();

	if (!pektis)
	return nodereq.error('ακαθόριστος παίκτης κατά την αλλαγή παραμέτρου');

	switch (nodereq.url.param) {
	case 'ΚΑΤΑΣΤΑΣΗ':
	case 'ΤΡΑΠΟΥΛΑ':
	case 'ΕΠΙΔΟΤΗΣΗ':
	case 'SOUNDFILOS':
	case 'SOUNDTHEATIS':
		break;
	default:
		return nodereq.error(nodereq.url.param + ': απαγορευμένη παράμετρος');
	}

	switch (nodereq.url.param) {
	case 'ΕΠΙΔΟΤΗΣΗ':
		if (pektis.pektisIsErgazomenos())
		return nodereq.error('Δεν δικαιούστε επιδότηση');
	}

	conn = DB.connection();
	query = 'REPLACE INTO `peparam` (`pektis`, `param`, `timi`) VALUES (' +
		nodereq.loginGet().json() + ', ' + nodereq.url.param.json() + ', ' +
		nodereq.url.timi.json() + ')';
	conn.query(query, function(conn, res) {
		conn.free();
		if (conn.affectedRows < 1)
		return nodereq.error('Απέτυχε η αλλαγή παραμέτρου παίκτη');

		Service.peparam.set2(nodereq);
	});
};

Service.peparam.set2 = function(nodereq) {
	var kinisi;

	nodereq.end();
	kinisi = new Kinisi({
		idos: 'PS',
		data: {
			pektis: nodereq.loginGet(),
			param: nodereq.url.param,
			timi: nodereq.url.timi,
		},
	});

	Server.skiniko.
	processKinisi(kinisi).
	kinisiAdd(kinisi);
};
