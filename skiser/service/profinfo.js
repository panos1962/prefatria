////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: profinfo');

Service.profinfo = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.profinfo.get = function(nodereq) {
	var login, slogin, pektis;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('pektis', true)) return;

	login = nodereq.url.pektis;
	slogin = login.json();
	pektis = Server.skiniko.skinikoPektisGet(login);

	// Υπάρχει περίπτωση ο παίκτης για τον οποίον ζητούνται πληροφορίες προφίλ
	// να μην είναι ενταγμένος στο σκηνικό, είτε επειδή δεν ενετάχθη ποτέ, είτε
	// επειδή αποκαθηλώθηκε κάποια στιγμή. Σ' αυτήν την περίπτωση θα φορτώσουμε
	// μια πρόχειρη εκδοχή του παίκτη στο σκηνικό όπου θα υπάρχει μόνο το login
	// name του, προκειμένου σ' αυτήν την πρόχειρη εκδοχή του παίκτη να «κρεμάσουμε»
	// τις πληροφορίες προφίλ, καθώς αυτές μπορεί να διορθωθούν από τον αιτούντα
	// και θα πρέπει να υπάρχουν στο σκηνικό.

	if (!pektis)
	Server.skiniko.skinikoPektisSet(pektis = new Pektis({
		login: login,
	}));

	Service.profinfo.get2(nodereq, login, slogin, pektis);
};

Service.profinfo.get2 = function(nodereq, login, slogin, pektis) {
	var query;

	// Υπάρχουν κάποιες παράμετροι του παίκτη που ανασύρονται απευθείας από την
	// database και αποστέλλονται στον αιτούντα client, κάθε φορά που κάποιος
	// client αιτείται πληροφορίες προφίλ παίκτη.

	nodereq.write('peparam:{');
	query = 'SELECT ' + Peparam.projection + ' FROM `peparam` WHERE `pektis` = ' + slogin;
	DB.connection().query(query, function(conn, rows) {
		conn.free();
		Globals.awalk(rows, function(i, row) {
			switch (row['param']) {
			case 'ΒΑΘΜΟΛΟΓΙΑ':
				nodereq.write(row['param'].json() + ':' + row['timi'].json() + ',');
				break;
			}
		});

		nodereq.write('},');
		Service.profinfo.get3(nodereq, login, slogin, pektis);
	});
};

Service.profinfo.get3 = function(nodereq, login, slogin, pektis) {
	var query;

	// Αν οι πληροφορίες προφίλ υπάρχουν ήδη στον παίκτη, τότε τις επιστρέφουμε
	// άμεσα στον αιτούντα.

	if (pektis.profinfo)
	return Service.profinfo.get4(nodereq, login, pektis);

	// Οι πληροφορίες προφίλ δεν υπάρχουν για τον εν λόγω παίκτη, προφανώς επειδή
	// ανεβάσαμε μόλις μια πρόχειρη εκδοχή του στο σκηνικό. Θα πρέπει, λοιπόν, να
	// ανεβάσουμε τις πληροφορίες προφίλ από την database.

	console.log(login + ': ζητήθηκαν πληροφορίες προφίλ από την database');
	pektis.profinfo = {};

	query = 'SELECT ' + Profinfo.projection + ' FROM `profinfo` WHERE `pektis` = ' + slogin;
	DB.connection().query(query, function(conn, rows) {
		conn.free();
		Globals.awalk(rows, function(i, row) {
			pektis.profinfo[row['sxoliastis']] = row['kimeno'];
		});

		Service.profinfo.get4(nodereq, login, pektis);
	});
};

Service.profinfo.get4 = function(nodereq, login, pektis) {
	var paraliptis;

	nodereq.write('profinfo: {\n');
	if (!pektis.profinfo)
	return nodereq.end('}');

	paraliptis = nodereq.loginGet();
	Globals.walk(pektis.profinfo, function(sxoliastis, kimeno) {
		if ((sxoliastis != login) && (sxoliastis != paraliptis))
		return;

		kimeno = kimeno.json(false).replace(/\n/g, '\\n');
		nodereq.write(sxoliastis.json() + ':' + kimeno + ',');
	});
	nodereq.end('}');
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.profinfo.put = function(nodereq) {
	var login, pektis, sxoliastis, kimeno, query;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('pektis', true)) return;
	if (nodereq.denPerastike('kimeno', true)) return;

	login = nodereq.url.pektis;
	pektis = Server.skiniko.skinikoPektisGet(login);
	if (!pektis) return nodereq.error('Δεν βρέθηκε ο παίκτης στο σκηνικό');

	if (!pektis.hasOwnProperty('profinfo'))
	return nodereq.error('Δεν βρέθηκαν πληροφορίες προφίλ στο σκηνικό');

	sxoliastis = nodereq.loginGet();
	kimeno = nodereq.url.kimeno.trim();
	query = 'REPLACE INTO `profinfo` (`pektis`, `sxoliastis`, `kimeno`) VALUES (' +
		login.json() + ', ' + sxoliastis.json() + ', ' + kimeno.json(false) + ')';
	DB.connection().query(query, function(conn, rows) {
		var kinisi;

		conn.free();
		if (conn.affectedRows < 1)
		return nodereq.error('Απέτυχε η καταχώρηση του προφίλ στην database');

		nodereq.end();

		// Επιτελούμε απευθείας την αλλαγή στο σηνικό του skiser και δεν
		// το κάνουμε μέσω κινήσεως εξ αιτίας της ιδιαιτερότητας που υπάρχει
		// λόγω της ιδιωτικότητας της πληροφορίας.

		pektis.pektisProfinfoSet(sxoliastis, kimeno);

		// Αν ο σχολιαστής δεν είναι ο ίδιος ο παίκτης, τότε η πληροφορία
		// είναι απόρρητη και αφορά μόνο τον ίδιο τον σχολιαστή, ο οποίος
		// ωστόσο έχει ήδη την πληροφορία στα χέρια του καθώς την έχει
		// συντάξει ο ίδιος, επομένως δεν χρειάζεται να κοινοποιήσουμε
		// κάτι σε κάποιον από τους clients.

		if (login != sxoliastis) return;

		// Ο σχολιαστής είναι ο ίδιος ο παίκτης, επομένως πρόκειται για το
		// προφίλ που συντάσσει ο ίδιος ο παίκτης για τον εαυτό του και αυτό
		// το προφίλ πρέπει να δημοσιοποιηθεί.

		kinisi = new Kinisi({
			idos: 'PI',
			data: {
				pektis: login,
				sxoliastis: sxoliastis,
				kimeno: kimeno,
			}
		});

		// Όπως προείπαμε, η ενημέρωση της πληροφορίας προφίλ στο σκηνικό τού
		// skiser έχει ήδη γίνει, επομένως το μόνο που έχουμε να κάνουμε είναι
		// να κοινοποιήσουμε την πληροφορία στους clients. Απλώς θα πρέπει να
		// αποφύγουμε να κοινοποιήσουμε την πληροφορία στον ίδιο τον συντάκτη
		// και αυτό το πετυχαίνουμε μέσω της μεθόδου αδιαφορίας.

		Server.skiniko.
		kinisiAdd(kinisi);
	});
};
