////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: pektis');

Service.pektis = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.pektis.fetch = function(nodereq) {
	var pektis, query;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('login', true)) return;

	pektis = Server.skiniko.skinikoPektisGet(nodereq.url.login);
	if (pektis) return nodereq.end(pektis.pektisFeredata());

	query = 'SELECT * FROM `pektis` WHERE `login` LIKE ' + nodereq.url.login.json();
	DB.connection().query(query, function(conn, rows) {
		conn.free();
		if (rows.length != 1)
		return nodereq.error('Δεν βρέθηκε ο παίκτης στην database');

		pektis = new Pektis(rows[0]);
		Server.skiniko.skinikoPektisSet(pektis);
		nodereq.end(pektis.pektisFeredata());

	});
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Αν κάποιος παίκτης δεν έχει σχετική συνεδρία, ή δεν έχει προσπελαστεί
// για περισσότερες 12 ώρες, τον βγάζουμε εκτός σκηνικού.

Service.pektis.timeout = 12 * 60 * 60;

Service.pektis.check = function() {
	var trapezi, tora;

	// Μαζεύουμε όλους τους παίκτες που εμφανίζονται σε ενεργά τραπέζια, καθώς
	// αυτούς τους παίκτες θα πρέπει να τους έχουμε πρόχειρους στο σκηνικό.

	trapezi = {};
	Server.skiniko.skinikoTrapeziWalk(function() {
		var thesi, pektis;

		for (thesi = 1; thesi <= Prefadoros.thesiMax; thesi++) {
			pektis = this.trapeziPektisGet(thesi);
			if (pektis) trapezi[pektis] = true;
		}
	});

	tora = Globals.tora();
	Server.skiniko.skinikoPektisWalk(function() {
		var poll, login;

		// Αν ο παίκτης υπάρχει ως παίκτης σε ενεργό τραπέζι δεν τον
		// αποκαθηλώνουμε από το σκηνικό.

		login = this.pektisLoginGet();
		if (trapezi.hasOwnProperty(login))
		return;

		// Υπενθυμίζουμε ότι το poll timestamp του παίκτη ΔΕΝ είναι
		// η χρονική στιγμή κατά την οποία ο παίκτης είχε επαφή μέσω
		// κάποιας συνεδρίας του, αλλά η χρονική στιγμή κατά την οποία
		// προσπελάστηκε τελευταία φορά ο παίκτης στο σκηνικό.

		poll = this.pektisPollGet();
		if (tora - poll < Service.pektis.timeout)
		return;

		// Ο παίκτης δεν φαίνεται να έχει προσπελαστεί το τελευταίο
		// διάστημα, επομένως είναι υποψήφιος για αποκαθήλωση. Πριν
		// προχωρήσουμε στο επόμενο βήμα, ελέγχουμε αν υπάρχει στο
		// σκηνικό συνεδρία για τον εν λόγω παίκτη.

		if (Server.skiniko.skinikoSinedriaGet(login))
		return;

		Globals.consoleLog(login + ': αποκαθήλωση παίκτη');
		Server.skiniko.skinikoPektisDelete(login);
	});
};
