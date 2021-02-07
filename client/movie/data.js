// Η function "paralaviData" καλείται κατά την επιστροφή των αποτελεσμάτων,
// και σκοπό έχει τη διαχείριση των αποτελεσμάτων αυτών.

Movie.paralaviData = function(data) {
	if (!data) {
		Client.fyi.epano('<div class="aristera">Δεν βρέθηκαν δεδομένα</div>');
		return Movie;
	}

	try {
		Movie.trapeziProcess(data.evalAsfales());
	} catch (e) {
		console.error(data);
		Client.fyi.epano('Επεστράφησαν ακαθόριστα δεδομένα.', 0);
		Client.fyi.ekato('Δοκιμάστε πάλι και αν το πρόβλημα επιμένει ειδοποιήστε τον προγραμματιστή.', 0);
	}

	return Movie;
};

Movie.trapeziProcess = function(trapeziEco) {
	var prop, ts;

	// Δημιουργούμε αντίγραφο του προς επεξεργασία στοιχείου στο οποίο
	// εμπεριέχονται τα πραγματικά properties του σχετικού τραπεζιού
	// έναντι των οικονομικών τοιαύτων.

	Movie.trapezi = new Trapezi();

	for (prop in Movie.trapeziEcoMap)
	Movie.trapezi[Movie.trapeziEcoMap[prop]] = trapeziEco[prop];

	for (prop in trapeziEco.t)
	Movie.trapezi.trparam[prop] = trapeziEco.t[prop];

	Globals.awalk(Movie.trapezi.dianomiArray, function(i, dianomi) {
		dianomi = Movie.dianomiProcess(dianomi);
		Movie.trapezi.trapeziDianomiSet(dianomi);
		Movie.trapezi.dianomiArray[i] = dianomi;
	});

	ts = parseInt(Movie.trapezi.stisimo);
	if (ts) Movie.trapezi.stisimo = ts + Client.timeDif;

	ts = parseInt(Movie.trapezi.arxio);
	if (ts) Movie.trapezi.arxio = ts + Client.timeDif;
};

// Τα αποτελέσματα παραλαμβάνονται σε «οικονομική» μορφή, δηλαδή
// τα ονόματα των properties του τραπεζιού είναι συντομογραφικά.
// Η λίστα "trapeziEcoMap" αντιστοιχεί τα οικονομικά ονόματα τών
// properties τού τραπεζιού στα πραγαμτικά τους ονόματα.

Movie.trapeziEcoMap = {
	k: 'kodikos',
	s: 'stisimo',
	p1: 'pektis1',
	p2: 'pektis2',
	p3: 'pektis3',
	a: 'arxio',
	d: 'dianomiArray',
};

// Η function "dianomiProcess" διαχειρίζεται κάθε ένα από τα στοιχεία της
// λίστας διανομών που επεστράφησαν από τον server.

Movie.dianomiProcess = function(dianomiEco) {
	var dianomi, prop, ts;

	// Δημιουργούμε αντίγραφο του προς επεξεργασία στοιχείου στο οποίο
	// εμπεριέχονται τα πραγματικά properties της σχετικής διανομής
	// έναντι των οικονομικών τοιαύτων.

	dianomi = new Dianomi();
	for (prop in Movie.dianomiEcoMap) {
		dianomi[Movie.dianomiEcoMap[prop]] = dianomiEco[prop];
	}

	// Χρειάζεται φιξάρισμα του κωδικού, καθώς αλλιώς εκλαμβάνεται ως
	// string.
 
	dianomi.kodikos = parseInt(dianomi.kodikos);
	dianomi.dealer = parseInt(dianomi.dealer);

	ts = parseInt(dianomi.enarxi);
	if (ts) dianomi.enarxi = ts + Client.timeDif;

	// Σε περίπτωση που ζητάμε και τις ακυρωμένες ενέργειες, θα πρέπει να
	// ταξινομήσουμε ως προς κωδικό ενέργειας ώστε οι ενέργειες, ακυρωμένες
	// και μη, να ταξινομηθούν με τη σειρά που έγιναν.

	if (Movie.akirosi)
	dianomiEco['e'].sort(function(e1, e2) {
		var k1 = parseInt(e1.k);
		var k2 = parseInt(e2.k);

		if (k1 < k2)
		return -1;

		if (k1 > k2)
		return 1;

		return 0;
	});

	return dianomi.processEnergiaList(dianomiEco['e']);
};

// Τα αποτελέσματα παραλαμβάνονται σε «οικονομική» μορφή, δηλαδή
// τα ονόματα των properties της διανομής είναι συντομογραφικά.
// Η λίστα "dianomiEcoMap" αντιστοιχεί τα οικονομικά ονόματα τών
// properties τής διανομής στα πραγματικά τους ονόματα.

Movie.dianomiEcoMap = {
	k: 'kodikos',
	d: 'dealer',
	s: 'enarxi',
	k1: 'kasa1',
	m1: 'metrita1',
	k2: 'kasa2',
	m2: 'metrita2',
	k3: 'kasa3',
	m3: 'metrita3',
};

Dianomi.prototype.processEnergiaList = function(elist) {
	var dianomi = this;

	Globals.awalk(elist, function(i, energiaEco) {
		var energia;

		energia = Movie.energiaProcess(energiaEco);
		dianomi.dianomiEnergiaSet(energia);
		dianomi.energiaArray[i] = energia;
	});

	return this;
};

// Η function "energiaProcess" διαχειρίζεται κάθε ένα από τα στοιχεία της
// λίστας ενεργειών που επεστράφησαν από τον server.

Movie.energiaProcess = function(energiaEco) {
	var energia, prop, ts;

	// Δημιουργούμε αντίγραφο του προς επεξεργασία στοιχείου στο οποίο
	// εμπεριέχονται τα πραγματικά properties της σχετικής ενέργειας
	// έναντι των οικονομικών τοιαύτων.

	energia = new Energia();
	for (prop in Movie.energiaEcoMap) {
		if (energiaEco.hasOwnProperty(prop))
		energia[Movie.energiaEcoMap[prop]] = energiaEco[prop];
	}

	ts = parseInt(energia.pote);
	if (ts) energia.pote = ts + Client.timeDif;

	return energia;
};

// Τα αποτελέσματα παραλαμβάνονται σε «οικονομική» μορφή, δηλαδή
// τα ονόματα των properties της ενέργειας είναι συντομογραφικά.
// Η λίστα "energiaEcoMap" αντιστοιχεί τα οικονομικά ονόματα τών
// properties τής ενέργειας στα πραγαμτικά τους ονόματα.

Movie.energiaEcoMap = {
	k: 'kodikos',
	p: 'pektis',
	a: 'akirotis',
	t: 'pote',
	i: 'idos',
	d: 'data',
};
