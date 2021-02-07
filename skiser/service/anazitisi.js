////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: anazitisi');

Service.anazitisi = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Το service "anazitisi" δέχεται κριτήρια αναζήτησης παικτών και αφού εντοπίσει
// τους ζητούμενους παίκτες στην database, τους επιστρέφει στον αιτούντα client
// με τη μορφή array από "Anazitisi" objects.
//
// Να σημειωθεί ότι η αναζήτηση ΔΕΝ δέχεται κριτήριο κατάστασης παικτών, ήτοι
// ALL, ONLINE και AVAILABLE. Πράγματι, οι αναζητήσεις σε ONLINE και AVAILABLE
// παίκτες γίνονται απευθείας στον client, επομένως το παρόν service αφορά σε
// αναζητήσεις παικτών ανεξαρτήτως κατάστασης.
//
// Τα κριτήρια που περνάμε στο παρόν service είναι:
//
//	pattern	Είναι αλφαριθητικό και χρησιμοποιείται στον έλεγχο login name
//		και ονόματος παίκτη.
//
//	sxesi	Είναι αριθμητικό και εφόσον είναι διάφορο του μηδενός φιλτράρει
//		μόνο τους φίλους του αιτούντος παίκτη.

Service.anazitisi.anazitisi = function(nodereq) {
	var pattern, sxesi, query;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('pattern', true)) return;
	if (nodereq.denPerastike('sxesi', true)) return;
	if (nodereq.denPerastike('max', true)) return;

	pattern = nodereq.url.pattern;
	sxesi = parseInt(nodereq.url.sxesi);

	if ((!pattern) && (!sxesi))
	return nodereq.error('Δεν δόθηκαν επαρκή κριτήρια');

	query = 'SELECT `login`, `onoma` FROM `pektis` WHERE 1';

	if (pattern) {
		if (pattern.match(/^\^/))
		pattern = pattern.replace(/^\^/, '');

		else
		pattern = '%' + pattern;

		if (pattern.match(/\$$/))
		pattern = pattern.replace(/\$$/, '');

		else
		pattern = pattern + '%';

		// pattern = ('%' + pattern + '%').json();

		pattern = pattern.json();
		query += ' AND ((`login` LIKE ' + pattern + ') OR (`onoma` LIKE ' + pattern + '))';
	}

	if (sxesi)
	query += " AND (`login` IN (SELECT `sxetizomenos` FROM `sxesi` WHERE `pektis` LIKE " +
		nodereq.loginGet().json() + " AND `sxesi` LIKE 'ΦΙΛΟΣ'))";

	query += ' ORDER BY `login` DESC';

	if (!sxesi)
	query += ' LIMIT ' + nodereq.url.max;

	DB.connection().query(query, function(conn, rows) {
		var i;

		conn.free();
		for (i = 0; i < rows.length; i++) {
			nodereq.write('{login:' + rows[i].login.json() + ',onoma:' + rows[i].onoma.json() + '},');
		}
		nodereq.end();
	});
};
