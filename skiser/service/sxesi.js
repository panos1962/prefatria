////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: sxesi');

Service.sxesi = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.sxesi.sxesi = function(nodereq) {
	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('pektis', true)) return;

	DB.connection().transaction(function(conn) {
		Service.sxesi.sxesi1(nodereq, conn);
	});
};

Service.sxesi.sxesi1 = function(nodereq, conn) {
	var pektis, sxesi, query;

	sxesi = nodereq.url.sxesi;
	pektis = nodereq.url.pektis;
	query = sxesi ?
		'REPLACE INTO `sxesi` (`pektis`, `sxetizomenos`, `sxesi`, `pote`) VALUES (' +
			nodereq.login.json() + ', ' + pektis.json() + ', ' + sxesi.json() + ', NOW())'
	:
		'DELETE FROM `sxesi` WHERE `pektis` = ' + nodereq.login.json() + ' AND `sxetizomenos` = ' + pektis.json()
	;
	conn.query(query, function(conn, res) {
		if (conn.affectedRows > 0)
		return Service.sxesi.sxesi2(nodereq, conn, pektis, sxesi);

		conn.rollback();
		nodereq.error('Απέτυχε ο συσχετισμός');
	});
};

Service.sxesi.sxesi2 = function(nodereq, conn, pektis, sxesi) {
	conn.commit()
	nodereq.end();
	nodereq.pektis.pektisSxesiSet(pektis, sxesi);
};
