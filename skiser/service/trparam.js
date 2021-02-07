////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: trparam');

Service.trparam = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.trparam.set = function(nodereq) {
	var sinedria, trapezi, param, timi, conn, query;

	if (nodereq.isvoli())
	return;

	if (nodereq.oxiTrapezi())
	return;

	if (nodereq.denPerastike('param', true))
	return;

	if (nodereq.denPerastike('timi', true))
	return;

	sinedria = nodereq.sinedriaGet();

	if (sinedria.sinedriaOxiPektis())
	return nodereq.error('Δεν είστε παίκτης στο τραπέζι');

	trapezi = nodereq.trapeziGet();
	param = nodereq.url.param;
	timi = nodereq.url.timi;

	switch (param) {
	case 'ΑΣΟΙ':
	case 'ΠΑΣΟ':
	case 'ΤΕΛΕΙΩΜΑ':
	case 'ΦΙΛΙΚΗ':
		if (trapezi.trapeziIsDianomi())
		return nodereq.error('Το παιχνίδι έχει ήδη ξεκινήσει');
	}

	conn = DB.connection();
	query = 'REPLACE INTO `trparam` (`trapezi`, `param`, `timi`) VALUES ' +
		'(' + trapezi.kodikos + ', ' + param.json() + ', ' + timi.json() + ')';
	conn.query(query, function(conn, res) {
		conn.free();
		if (conn.affectedRows < 1)
		return nodereq.error('Απέτυχε η αλλαγή παραμέτρου τραπεζιού');

		nodereq.end();
		Service.trparam.set2(nodereq, trapezi);
	});
};

Service.trparam.set2 = function(nodereq, trapezi) {
	var kinisi, post;

	kinisi = new Kinisi({
		idos: 'TS',
		data: {
			pektis: nodereq.loginGet(),
			trapezi: trapezi.kodikos,
			param: nodereq.url.param,
			timi: nodereq.url.timi,
		},
	});

	if (nodereq.url.apodoxi)
	kinisi.data.apodoxi = 1;

	Server.skiniko.
	processKinisi(kinisi).
	kinisiAdd(kinisi);

	post = Service.trparam['post' + nodereq.url.param];

	if (typeof post === 'function')
	post(kinisi.data);
};

// Στην περίπτωση που το τραπέζι γίνεται πριβέ θα πρέπει να αποβληθούν όλοι
// οι θεατές που δεν έχουν πρόσκληση.

Service.trparam.postΠΡΙΒΕ = function(data) {
	var skiniko, trapezi, apovoli;

	// Αν το τραπέζι γίνεται δημόσιο δεν προβαίνουμε σε περαιτέρω
	// ενέργειες.

	if (data.timi.isOxi()) return;

	skiniko = Server.skiniko;
	trapezi = skiniko.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return;

	// Θα μαζέψουμε σε λίστα τους θεατές του τραπεζιού που δεν έχουν
	// πρόσκληση με σκοπό να τους αποβάλουμε από το τραπέζι.

	apovoli = {};
	skiniko.skinikoSinedriaWalk(function() {
		var pektis;

		if (this.sinedriaOxiTrapezi(data.trapezi)) return;
		if (this.sinedriaOxiTheatis()) return;

		pektis = this.sinedriaPektisGet();
		if (trapezi.trapeziIsProsklisi(pektis)) return;

		apovoli[pektis] = true;
	});

	// Εκκινούμε τη διαδικασία αποβολής.

	Service.trparam.exoTheatis(apovoli);

};

// Η διαδικασία αποβολής λειτουργεί αλυσιδωτά αποβάλλοντας κάθε φορά τον πρώτο
// παίκτη που υπάρχει στη λίστα, διαγράφοντάς τον από τη λίστα και εκτελώντας
// αναδρομή στην υπόλοιπη λίστα μέχρι η λίστα να εξαντληθεί.

Service.trparam.exoTheatis = function(apovoli) {
	var conn, login, query;

	for (login in apovoli) {
		delete apovoli[login];

		conn = DB.connection();
		query = 'UPDATE `sinedria` SET `trapezi` = NULL, `thesi` = NULL, `simetoxi` = NULL ' +
			'WHERE `pektis` = ' + login.json();
		conn.query(query, function(conn, res) {
			var kinisi;

			conn.free();

			// Αν κάτι δεν πήγε καλά, αφήνω τον θεατή στο κλειδωμένο
			// τραπέζι ώστε οι κλειδοκράτορες να γνωρίζουν ότι αυτός
			// παραμένει.

			if (conn.affectedRows < 1)
			return;

			// Αλλιώς προβαίνουμε σε δημιουργία κίνησης εξόδου του
			// συγκεκριμένου παίκτη από το τραπέζι.

			kinisi = new Kinisi({
				idos: 'RT',
				data: {
					pektis: login,
				},
			});

			Server.skiniko.
			processKinisi(kinisi).
			kinisiAdd(kinisi);
		});

		// Έχουμε τελειώσει με τον πρώτο παίκτη της λίστας και καλούμε
		// αναδρομικά με την υπόλοιπη λίστα.

		Service.trparam.exoTheatis(apovoli);
		return;
	}
};
