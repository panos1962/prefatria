////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Το παρόν περιέχει γενικές δομές και μεθόδους που αφορούν τόσο στον server
// όσο και στους clients, αλλά είναι εξειδικευμένες στoν «Πρεφαδόρο». Όλα τα
// σχετικά εντάσσονται στο singleton "Prefadoros".

Prefadoros = {
	// Η property "thesiMax" δείχνει τον μέγιστο αριθμό θέσης στο τραπέζι.
	// Μπορεί να φαίνεται υπερβολικό, αλλά βολεύει σε αλλαγή παιχνιδιού.

	thesiMax: 3,

	// Χρησιμοποιούμε το associative array "thesiValid" για να διατρέχουμε
	// τις θέσεις του τραπεζιού (η σειρά δεν είναι εγγυημένη από τη γλώσσα).

	thesiValid: {},

	// Η μέθοδος "isThesi" δέχεται ένα όρισμα και ελέγχει αν το όρισμα αυτό
	// είναι δεκτό ως θέση τραπεζιού.

	isThesi: function(thesi) {
		return Prefadoros.thesiValid[thesi];
	},

	// Η μέθοδος "oxiThesi" δέχεται ένα όρισμα και ελέγχει αν το όρισμα αυτό
	// δεν είναι δεκτό ως θέση τραπεζιού.

	oxiThesi: function(thesi) {
		return !Prefadoros.isThesi(thesi);
	},

	// Οι παράμετροι στη λίστα "peparamAorati" δεν κοινοποιούνται παρά μόνο
	// μέσω συγεκριμένων αιτημάτων.

	peparamAorati: {
	},

	peparamIsAorati: function(param) {
		return Prefadoros.peparamAorati[param];
	},

	// Οι παράμετροι στη λίστα "peparamProsopiki" αφορούν μόνο τον παίκτη τής
	// παραμέτρου και κοινοποιούνται μόνο στον συγκεκριμένο παίκτη.

	peparamProsopiki: {
		'ΠΑΡΑΣΚΗΝΙΟ': true,
	},

	peparamIsProsopiki: function(param) {
		return Prefadoros.peparamProsopiki[param];
	},

	// Οι παράμετροι στη λίστα "peparamKrifi" αφορούν τον παίκτη τής παραμέτρου
	// και κοινοποιούνται μόνο στον συγκεκριμένο παίκτη και σε βαθμοφόρους από
	// διαχειριστές και άνω.

	peparamKrifi: {
		'ΑΞΙΩΜΑ': true,
		'DEVELOPER': true,
		'ΑΝΕΡΓΟΣ': true,
		'ΕΠΙΔΟΤΗΣΗ': true,
	},

	peparamIsKrifi: function(param) {
		return Prefadoros.peparamKrifi[param];
	},

	peparamOxiKrifi: function(param) {
		return !Prefadoros.peparamIsKrifi(param);
	},

	// Οι παράμετροι στη λίστα "peparamAnergos" κοινοποιούνται μεταξύ των
	// ανέργων.

	peparamAnergos: {
		'ΑΝΕΡΓΟΣ': true,
		'ΕΠΙΔΟΤΗΣΗ': true,
	},

	peparamIsAnergos: function(param) {
		return Prefadoros.peparamAnergos[param];
	},

	// Ακολουθεί λίστα με τις default τιμές των παραμέτρων παίκτη.

	peparamDefault: {
		'ΑΞΙΩΜΑ': 'ΘΑΜΩΝΑΣ',
		'ΚΑΤΑΣΤΑΣΗ': 'ΔΙΑΘΕΣΙΜΟΣ',
		'ΠΛΑΤΗ': 'ΜΠΛΕ',
		'ΠΑΡΑΣΚΗΝΙΟ': 'standard.png',
		'BLOCKIMAGE': 'ΟΧΙ',
		'MOVIETIME': 'ΜΕΤΡΟΝΟΜΟΣ',
		'MOVIESCALE': '1000',
		'ΑΣΟΙ': 'ΝΑΙ',
		'ΠΑΣΟ': 'ΟΧΙ',
		'ΤΕΛΕΙΩΜΑ': 'ΚΑΝΟΝΙΚΟ',
		'DEVELOPER': 'ΟΧΙ',
		'ΑΝΕΡΓΟΣ': 'ΟΧΙ',
		'ΕΠΙΔΟΤΗΣΗ': 'ΟΧΙ',
		'ΒΑΘΜΟΛΟΓΙΑ': '0.00#0',
	},
};

Prefadoros.thesiWalk = function(callback) {
	var thesi;

	for (thesi = 1; thesi <= Prefadoros.thesiMax; thesi++) callback(thesi);
	return Prefadoros;
}

// Έχουν καθοριστεί οι πίνακες αντιστοίχισης ονομασίας διαφόρων χαρακτηριστικών
// σε οικονομικότερες ονομασίες. Με βάση αυτούς τους πίνακες θα δημιουργήσω τώρα
// τους αντίστροφους πίνακες.

Prefadoros.thesiWalk(function(thesi) {
	Prefadoros.thesiValid[thesi] = parseInt(thesi);
});

// Η μέθοδος "epomeniThesi" εφαρμόζεται πάνω στη θέση κάποιου παίκτη και
// επιστρέφει την επόμενη θέση.

Number.prototype.epomeniThesi = function() {
	var thesi = this.valueOf();

	if (Prefadoros.oxiThesi(thesi)) return null;

	if (++thesi > Prefadoros.thesiMax) thesi = 1;
	return thesi;
};

String.prototype.epomeniThesi = function() {
	return parseInt(this.valueOf()).epomeniThesi();
};

// Η μέθοδος "isDexia" εφαρμόζεται πάνω στη θέση κάποιου παίκτη και επιστρέφει
// true αν η θέση αυτή βρίσκεται δεξιά από τη θέση που περνάμε ως παράμετρο.

Number.prototype.isDexia = function(thesi) {
	return this == thesi.epomeniThesi();
};

// Η μέθοδος "isAristera" εφαρμόζεται πάνω στη θέση κάποιου παίκτη και επιστρέφει
// true αν η θέση αυτή βρίσκεται αριστερά από τη θέση που περνάμε ως παράμετρο.

Number.prototype.isAristera = function(thesi) {
	return this.epomeniThesi() == thesi;
};

String.prototype.epomenoXroma = function() {
	switch (this.valueOf()) {
	case 'S': return 'C';
	case 'C': return 'D';
	case 'D': return 'H';
	case 'H': return 'N';
	}

	return undefined;
};

String.prototype.isTheatis = function() {
	return(this.valueOf() === 'ΘΕΑΤΗΣ');
}

String.prototype.isPektis = function() {
	return(this.valueOf() === 'ΠΑΙΚΤΗΣ');
}

String.prototype.oxiPektis = function() {
	return !this.isPektis();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Prefadoros.xromaTaxi = {
	S:	1,
	D:	2,
	C:	3,
	H:	4,
};

Prefadoros.xromaXroma = {
	S:	'B',
	C:	'B',
	D:	'R',
	H:	'R',
};

Prefadoros.axiaTaxi = {
	7:	1,
	8:	2,
	9:	3,
	T:	4,
	J:	5,
	Q:	6,
	K:	7,
	A:	8,
};

Prefadoros.xromaAxia = {
	S:	2,
	C:	3,
	D:	4,
	H:	5,
	N:	6,
};

Prefadoros.xromaLektiko = {
	S:	'ΜΠΑΣΤΟΥΝΙΑ',
	C:	'ΣΠΑΘΙΑ',
	D:	'ΚΑΡΑ',
	H:	'ΚΟΥΠΕΣ',
	N:	'ΑΧΡΟΑ',
};

String.prototype.axiaTaxiGet = function() {
	return Prefadoros.axiaTaxi[this.valueOf()];
};

String.prototype.xromaAxiaGet = function() {
	return Prefadoros.xromaAxia[this.valueOf()];
};

String.prototype.xromaLektiko = function() {
	return Prefadoros.xromaLektiko[this.valueOf()];
};

Prefadoros.filoKatheto = 'V';
Prefadoros.filoOrizontio = 'H';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η κλάση "Filo" παριστά φύλλα της τράπουλας. Ως παραμέτρους μπορούμε
// να περάσουμε το χρώμα και την αξία του φύλλου, π.χ.
//
//	f = new Filo('D', '9');
//
// Μπορούμε, ακόμη, να περάσουμε το χρώμα και την αξία του φύλλο ως ένα
// ενιαίο string, π.χ.
//
//	f = new Filo('D9');

Filo = function() {
	var xroma = '', axia = '';

	switch (arguments.length) {
	case 0:
		break;
	case 1:
		if (typeof arguments[0] === 'string') {
			xroma = arguments[0].substr(0, 1);
			axia = arguments[0].substr(1, 1);
		}
		break;
	default:
		if (typeof arguments[0] === 'string') xroma = arguments[0];
		if (typeof arguments[1] === 'string') axia = arguments[1];
		break;
	}

	this.filoXromaSet(xroma);
	this.filoAxiaSet(axia);
};

Filo.prototype.filoXromaSet = function(xroma) {
	this.xroma = xroma;
	return this;
};

Filo.prototype.filoXromaGet = function() {
	return this.xroma;
};

Filo.prototype.filoAxiaSet = function(axia) {
	this.axia = axia;
	return this;
};

Filo.prototype.filoAxiaGet = function() {
	return this.axia;
};

Filo.prototype.filoAxiaTaxiGet = function() {
	return this.axia.axiaTaxiGet();
};

Filo.prototype.filo2string = function() {
	return this.filoXromaGet() + this.filoAxiaGet();
};

String.prototype.string2filo = function() {
	return new Filo(this.valueOf());
};

Filo.prototype.filoIsFilo = function(filo) {
	var xroma = this.filoXromaGet(), axia = this.filoAxiaGet();
	return((filo.filoXromaGet() == xroma) && (filo.filoAxiaGet() == axia));
};

Filo.prototype.filoOxiFilo = function(filo) {
	return !this.filoIsFilo(filo);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Xartosia = function(fila) {
	this.fila = fila ? fila : [];
};

Xartosia.prototype.xartosiaFilaSet = function(fila) {
	this.fila = fila;
	return this;
};

Xartosia.prototype.xartosiaFilaGet = function() {
	return this.fila;
};

Xartosia.prototype.xartosiaFiloPush = function(filo) {
	this.fila.push(filo);
	return this;
};

Xartosia.prototype.xartosiaFiloSet = function(i, filo) {
	this.fila[i] = filo;
	return this;
};

Xartosia.prototype.xartosiaFiloGet = function(i) {
	return this.fila[i];
};

Xartosia.prototype.xartosiaMikos = function() {
	return this.fila.length;
};

Xartosia.prototype.xartosiaEnalagiFila = function(n, m) {
	var len, filo;

	n = parseInt(n);
	if (n < 0) return this;

	m = parseInt(m);
	if (m < 0) return this;

	if (n === m) return this;
	len = this.xartosiaMikos();
	if (n >= len) return this;
	if (m >= len) return this;

	filo = this.xartosiaFiloGet(n);
	this.xartosiaFiloSet(n, this.xartosiaFiloGet(m));
	this.xartosiaFiloSet(m, filo);

	return this;
};

Xartosia.prototype.xartosiaXartosia = function(apo, cnt) {
	return new Xartosia(this.fila.slice(apo, apo + cnt));
}

Xartosia.prototype.xartosiaWalk = function(callback) {
	Globals.awalk(this.fila, callback);
	return this;
};

Xartosia.prototype.xartosia2string = function() {
	var s = '';

	this.xartosiaWalk(function(i, filo) {
		s += filo.filo2string();
	});

	return s;
};

String.prototype.string2xartosia = function() {
	var x, l, i;

	x = new Xartosia();
	l = this.length;

	for (i = 0; i < l; i += 2) {
		x.xartosiaFiloPush(new Filo(this.substr(i, 2)));
	}

	return x;
};

Xartosia.prototype.xartosiaTaxinomisi = function() {
	return this.xartosiaFilaSet(this.xartosiaFilaGet().sort(function(f1, f2) {
		var
		v1 = Prefadoros.xromaTaxi[f1.filoXromaGet()],
		v2 = Prefadoros.xromaTaxi[f2.filoXromaGet()];

		if (v1 < v2) return -1;
		if (v1 > v2) return 1;

		v1 = f1.filoAxiaTaxiGet();
		v2 = f2.filoAxiaTaxiGet();

		if (v1 < v2) return -1;
		if (v1 > v2) return 1;
		return 0;
	}));
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Trapoula = function() {
	var xroma, axia;

	this.xartosia = new Xartosia();
	for (xroma in Prefadoros.xromaTaxi) {
		for (axia in Prefadoros.axiaTaxi) {
			this.xartosia.xartosiaFiloPush(new Filo(xroma, axia));
		}
	}
};

Trapoula.prototype.trapoulaXartosiaGet = function(apo, cnt) {
	return arguments.length == 2 ? this.xartosia.xartosiaXartosia(apo, cnt) : this.xartosia;
};

Trapoula.prototype.trapoulaAnakatema = function() {
	var n = 1000, xartosia = this.trapoulaXartosiaGet(), l, i, j, f;

	l = xartosia.xartosiaMikos() - 1;
	while (n-- > 0) {
		i = Globals.random(0, l);
		j = Globals.random(0, l);
		if (i == j) continue;

		f = xartosia.xartosiaFiloGet(i);
		xartosia.xartosiaFiloSet(i, xartosia.xartosiaFiloGet(j));
		xartosia.xartosiaFiloSet(j, f);
	}

	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Dilosi = function(props) {
	var s;

	if (typeof props !== 'string') {
		Globals.initObject(this, props);
		return this;
	}

	switch (props.valueOf()) {
	case 'DPS':
		this.paso = true;
		return this;
	case 'DTG':
		this.tagrafo = true;
		return this;
	}

	delete this.exo;
	delete this.asoi;
	delete this.solo;

	s = props.substr(0, 1);
	switch (s) {
	case '=':
		this.exo = true;
		break;
	case 'A':
		this.asoi = true;
		break;
	case 'S':
		this.solo = true;
		break;
	}

	this.xroma = props.substr(1, 1);
	this.bazes = props.substr(2, 1);
	this.bazes = this.bazes === 'T' ? 10 : parseInt(this.bazes);
};

Dilosi.prototype.dilosiXromaSet = function(xroma) {
	this.xroma = xroma;
	return this;
};

Dilosi.prototype.dilosiXromaGet = function() {
	return this.xroma;
};

Dilosi.prototype.dilosiBazesSet = function(bazes) {
	this.bazes = bazes;
	return this;
};

Dilosi.prototype.dilosiBazesGet = function() {
	return this.bazes;
};

Dilosi.prototype.dilosiPasoSet = function() {
	this.paso = true;
	return this;
};

Dilosi.prototype.dilosiIsPaso = function() {
	return this.paso;
};

Dilosi.prototype.dilosiOxiPaso = function() {
	return !this.dilosiIsPaso();
};

Dilosi.prototype.dilosiTagrafoSet = function() {
	this.tagrafo = true;
	return this;
};

Dilosi.prototype.dilosiIsTagrafo = function() {
	return this.tagrafo;
};

Dilosi.prototype.dilosiOxiTagrafo = function() {
	return !this.dilosiIsTagrafo();
};

Dilosi.prototype.dilosiExoSet = function(nai) {
	if (nai === undefined) nai = true;
	if (nai) this.exo = true;
	else delete this.exo;
	return this;
};

Dilosi.prototype.dilosiIsExo = function() {
	return this.exo;
};

Dilosi.prototype.dilosiOxiExo = function() {
	return !this.dilosiIsExo();
};

Dilosi.prototype.dilosiAsoiSet = function(nai) {
	if (nai === undefined) nai = true;
	if (nai) this.asoi = true;
	else delete this.asoi;
	return this;
};

Dilosi.prototype.dilosiIsAsoi = function() {
	return this.asoi;
};

Dilosi.prototype.dilosiOxiAsoi = function() {
	return !this.dilosiIsAsoi();
};

Dilosi.prototype.dilosiSoloSet = function(nai) {
	if (nai === undefined) nai = true;
	if (nai) this.solo = true;
	else delete this.solo;
	return this;
};

Dilosi.prototype.dilosiIsSolo = function() {
	return this.solo;
};

Dilosi.prototype.dilosiOxiSolo = function() {
	return !this.dilosiIsSolo();
};

Dilosi.prototype.dilosiIsAxroa = function() {
	return(this.dilosiXromaGet() === 'N');
};

Dilosi.prototype.dilosiOxiAxroa = function() {
	return !this.dilosiIsAxroa();
};

String.prototype.string2dilosi = function() {
	return new Dilosi(this.valueOf());
};

// Η μέθοδος "dilosi2string" είναι σημαντική, καθώς μετατρέπει κάποια δήλωση
// αγοράς σε string της μορφής "ISB", όπου:
//
//	I	"D" σημαίνει απλή δήλωση, "=" σημαίνει «έχω», "S" σημαίνει
//		σολάρισμα και "A" σημαίνει τους άσους.
//
//	X	Είναι το χρώμα, ήτοι "S" μπαστούνια, "C" σπαθιά, "D" καρά,
//		"H" κούπες και "N" άχροα.
//
//	B	Οι μπάζες, ήτοι 6, 7, 8, 9 και "T" για τις 10 μπάζες.
//
// Υπάρχουν και κάποιες ειδικές δηλώσεις που δεν εμπίπτουν στην ανωτέρω λογική
// και αυτές είναι:
//
//	DTG	Σημαίνει «άμα μείνουν»
//
//	DPS	Σημαίνει «πάσο»

Dilosi.prototype.dilosi2string = function() {
	var s;

	if (this.dilosiIsPaso()) return 'DPS';
	if (this.dilosiIsTagrafo()) return 'DTG';

	if (this.dilosiIsSolo()) s = 'S';
	else if (this.dilosiIsExo()) s = '=';
	else if (this.dilosiIsAsoi()) s = 'A';
	else s = 'D';

 	s += this.xroma;
	s += (this.bazes > 9 ? 'T' : this.bazes);

	return s;
};

Dilosi.prototype.dilosiLektiko = function() {
	if (this.dilosiIsPaso()) return 'ΠΑΣΟ';
	if (this.dilosiIsTagrafo()) return 'Άμα μείνουν';
	return (this.dilosiIsExo() ? 'Έχω ' : '') + this.dilosiBazesGet() + ' ' + this.dilosiXromaGet().xromaLektiko();
};

Dilosi.prototype.dilosiAxiaAgoras = function() {
	var bazes, axia;

	axia = this.dilosiXromaGet().xromaAxiaGet();
	if (!axia) return null;

	bazes = this.dilosiBazesGet();
	if (bazes < 6) return null;
	if (bazes === 6) return axia;
	if (bazes === 10) return 10;
	if (bazes > 10) return null;
	return(this.dilosiOxiAxroa() ? bazes : bazes + 1);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

String.prototype.simetoxiIsPaso = function() {
	return(this.valueOf() === 'ΠΑΣΟ');
};

String.prototype.simetoxiOxiPaso = function() {
	return !this.simetoxiIsPaso();
};

String.prototype.simetoxiIsPezo = function() {
	return(this.valueOf() === 'ΠΑΙΖΩ');
};

String.prototype.simetoxiIsMazi = function() {
	return(this.valueOf() === 'ΜΑΖΙ');
};

String.prototype.simetoxiIsVoithao = function() {
	return(this.valueOf() === 'ΒΟΗΘΑΩ');
};

String.prototype.simetoxiIsMonos = function() {
	return(this.valueOf() === 'ΜΟΝΟΣ');
};
