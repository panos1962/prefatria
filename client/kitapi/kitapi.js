Kitapi = {
	// Η λίστα "maxKasaLen" δείχνει το μέγιστο πλήθος εγγραφών
	// κάσας που χωράνε καθ' ύψος στην περιοχή κάθε παίκτη και
	// είναι δεικτοδοτημένη με τη θέση του παίκτη.

	maxKasaLen: {
		1: 9,
		2: 16,
		3: 16,
	},

	// Η λίστα "maxKasaStiles" δείχνει το μέγιστο πλήθος στηλών
	// εγγραφών κάσας που χωράνε γενικώς στην περιοχή κάθε παίκτη
	// και είναι δεικτοδοτημένη με τη θέση του παίκτη.

	maxKasaStiles: {
		1: 6,
		2: 2,	// χωράνε και τρεις στήλες, αλλά δεν είναι καλό,
		3: 2,	// γιατί δεν ξεχωρίζουν κάσες και καπίκια.
	},

	// Η λίστα "maxKasaCount" δείχνει το μέγιστο πλήθος εγγραφών κάσας
	// για κάθε παίκτη και είναι δεικτοδοτημένη με τη θέση του παίκτη.
	// Οι τιμές της λίστας υπολογίζονται αργότερα και προκύπουν, προφανώς,
	// από τα στοιχεία των λιστών "maxKasaLen" και "maxKasaStiles".


	maxKasaCount: {},

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////@

	// Η λίστα "maxKapikiaLen" δείχνει το μέγιστο πλήθος εγγραφών
	// καπικιών που χωράνε καθ' ύψος στην περιοχή κάθε παίκτη και
	// είναι δεικτοδοτημένη με τη θέση του παίκτη.

	maxKapikiaLen: {
		1: 12,
		2: 18,
		3: 18,
	},

	// Η λίστα "maxKapikiaStiles" δείχνει το μέγιστο πλήθος στηλών
	// εγγραφών καπικιών που χωράνε γενικώς στην περιοχή κάθε παίκτη
	// και είναι δεικτοδοτημένη με τη θέση του παίκτη.

	maxKapikiaStiles: {
		1: 4,
		2: 2,
		3: 2,
	},

	// Η λίστα "maxKapikiaCount" δείχνει το μέγιστο πλήθος εγγραφών καπικιών
	// για κάθε παίκτη και είναι δεικτοδοτημένη με τη θέση του παίκτη.
	// Οι τιμές της λίστας υπολογίζονται αργότερα και προκύπουν, προφανώς,
	// από τα στοιχεία των λιστών "maxKapikiaLen" και "maxKapikiaStiles".


	maxKapikiaCount: {},

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////@

	// Η λίστα "onomaDOM" περιέχει τα DOM elements των ονομάτων των
	// παικτών και είναι δεικοτοδοτημένη με τη θέση του παίκτη.

	onomaDOM: {},

	// Η λίστα "kasaAreaDOM" περιέχει τα DOM elements των περιοχών
	// κάσας για κάθε παίκτη και είναι δεικτοδοτημένη με τη θέση
	// του παίκτη.

	kasaAreaDOM: {},

	// Η λίστα "kasaDOM" περιέχει τα DOM elements των τελευταίων
	// εγγραφών κάσας για κάθε παίκτη και είναι δεικτοδοτημένη
	// με τη θέση του παίκτη.

	kasaDOM: {},

	// Η λίστα "kapikiaAreaDOM" δείχνει τα DOM elements των περιοχών
	// ανταλλαγής καπικιών μεταξύ των παικτών και δεικτοδοτείται ως
	// εξής:
	//
	//	13	Ανταλλαγές καπικιών στην περιοχή του παίκτη 1 με τον
	//		τον παίκτη 3 (κάτω αριστερά).
	//
	//	12	Ανταλλαγές καπικιών στην περιοχή του παίκτη 1 με τον
	//		τον παίκτη 2 (κάτω δεξιά).
	//
	//	21	Ανταλλαγές καπικιών στην περιοχή του παίκτη 2 με τον
	//		τον παίκτη 1 (πάνω δεξιά).
	//
	//	23	Ανταλλαγές καπικιών στην περιοχή του παίκτη 2 με τον
	//		τον παίκτη 3 (κέντρο δεξιά).
	//
	//	32	Ανταλλαγές καπικιών στην περιοχή του παίκτη 3 με τον
	//		τον παίκτη 2 (κέντρο αριστερά).
	//
	//	31	Ανταλλαγές καπικιών στην περιοχή του παίκτη 3 με τον
	//		τον παίκτη 1 (πάνω αριστερά).

	kapikiaAreaDOM: {},

	// Η λίστα "kapikiaAnadpoda" δείχνει ποιες από τις παραπάνω περιοχές
	// συναλλαγής καπικιών γράφονται ανάποδα. Πιο συγκεκριμένα, οι περιοχές
	// συναλλαγής καπικιών επάνω δεξιά (παίκτης 1 προς παίκτης 2) και επάνω
	// αριστερά (παίκτης 1 προς παίκτης 2) γράφονται ανάποδα, δηλαδή τα καπίκια
	// προστίθενται στο επάνω μέρος της λίστας και κατά το κόντεμα αποκόπτονται
	// τα κάτω στοιχεία της λίστας.

	kapikiaAnapoda: {
		21: true,
		31: true,
	},

	// Η λίστα "kapikiaDOM" δείχνει τα DOM elements των τελευταίων
	// συναλλαγών καπικιών μεταξύ οποιουδήποτε ζεύγους παικτών. Η λίστα
	// δεικτοδοτείται όπως και η λίστα των αντίστοιχων περιοχών στις
	// οποίες καταγράφονται οι εν λόγω συναλλαγές, απλώς φροντίζουμε
	// ώστε τα δυο στοιχεία που αφορούν στη συναλλαγή δυο συγκεκριμένων
	// παικτών να είναι ίδια και να δείχνουν το DOM element της τελευταίας
	// μεταξύ τους συναλλαγής, π.χ. το στοιχείο 13 πρέπει να είναι το ίδιο
	// με το στοιχείο 31, και το στοιχείο 23 πρέπει να δείχνει το ίδιο
	// DOM element με το στοιχείο 32.

	kapikiaDOM: {},

	// Η λίστα "kasa" περιέχει την τρέχουσα κάσα κάθε παίκτη και είναι
	// δεικτοδοτημένη με τη θέση του παίκτη.

	kasa: {},

	// Η λίστα "kapikia" περιέχει την τρέχουσα συναλλαγή καπικιών κάθε
	// παίκτη με τους άλλους δύο. Η λίστα δεικτοδοτείται με σύνθετο
	// δείκτη που αποτελείται από τις θέσεις των συναλλασσομένων.

	kapikia: {},

	// Το array "paraskinio" περιέχει όλα τα αρχεία εικόνας που βρίσκονται
	// στο directory "ikona/kitapi" και χρησιμοποιούνται ως παρασκήνιο για
	// το κιτάπι. Το παρασκήνιο επιλέγεται τυχαία με κάθε επαναφόρτωση του
	// κιταπιού, ή όταν κάνουμε focus στο κιτάπι.

	paraskinio: [],

	// Η παράμετρος "isozigioKasa" περιέχει το συνολικό υπόλοιπο που έχει
	// απομείνει στην κάσα.

	isozigioKasa: 0,

	// Η λίστα "isozigioMetrita" περιέχει τα καπίκια που έδωσε ή πήρε συνολικά
	// ο κάθε παίκτης και είναι δεικτοδοτημένη με τη θέση του παίκτη.

	isozigioMetrita: {},

	// Η λίστα "isozigioDOM" δείχνει τα DOM elements ισοζυγίου για κάθε παίκτη
	// και είναι δεικτοδοτημένη με τη θέση του παίκτη.

	isozigioDOM: {},
};

$(document).ready(function() {
	// Χρειαζόμαστε πρόσβαση στη βασική σελίδα του «Πρεφαδόρου», από
	// την οποία εκκίνησε το κιτάπι. Σ' αυτή τη σελίδα υπάρχει global
	// μεταβλητή "Arena" και ουσιαστικά αυτήν χρειαζόμαστε.
	// Αν δεν υπάρχει γονική σελίδα, ή η μεταβλητή "Arena" δεν βρεθεί
	// στη γονική σελίδα, τότε θεωρούμε ότι το κιτάπι έχει εκκινήσει
	// ανεξάρτητα σε δική του σελίδα.

	Arena = (window.opener && window.opener.Arena ? window.opener.Arena : null);

	Kitapi.
	paraskinioSet().
	perioxiSetup().
	stresarisma().
	refreshDOM();
//Kitapi.fullData();
});

Kitapi.unload = function() {
	if (Kitapi.unloaded) return;
	Kitapi.unloaded = true;

	if (Kitapi.isArena())
	Arena.kitapi.klisimo();
};

$(window).on('beforeunload', function() {
	Kitapi.unload();
});

$(window).on('unload', function() {
	Kitapi.unload();
});

// Όλα τα παρασκήνια στις σελίδες του «Πρεφαδόρου» τίθενται με βάση
// την επιλογή του χρήστη, αλλά ειδικά το κιτάπι έχει δικό του.

Kitapi.paraskinioSet = function() {
	Client.bodyDOM.css({
		backgroundImage: "url('../ikona/kitapi/" +
		Kitapi.paraskinio[Globals.random(0, Kitapi.paraskinio.length - 1)] + "')",
	});

	return Kitapi;
};

Kitapi.isArena = function() {
	return Arena;
};

Kitapi.oxiArena = function() {
	return !Kitapi.isArena();
};

// Η function "sinalagiWalk" διατρέχει τις συναλλαγές μεταξύ των παικτών
// καλεί callback function για κάθε συναλλαγή, με παράμετρο το συνδυασμό
// των θέσεων των συναλλασσομένων παικτών.

Kitapi.sinalagiWalk = function(callback) {
	Prefadoros.thesiWalk(function(apo) {
		Prefadoros.thesiWalk(function(pros) {
			if (pros !== apo) callback(apo + '' + pros);
		});
	});

	return Kitapi;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Kitapi.perioxiSetup = function() {
	Kitapi.trapeziDOM = $('<div>').attr('id', 'kitapiTrapezi').prependTo(Client.ofelimoDOM);
	Prefadoros.thesiWalk(function(thesi) {
		var perioxiDom, dataDom, onomaDom, daraveriDom, daraveriKD,
			kasaDom, isozigioDom, kl, kr, dom, h;

		// Δημιουργούμε DOM elements για τις τρεις περιοχές του κιταπιού.
		// Αυτές είναι πλέον προσβάσιμες μέσω των μεταβλητών:
		//
		//	Kitapi.perioxi1DOM	(Νότος)
		//	Kitapi.perioxi2DOM	(Ανατολή)
		//	Kitapi.perioxi3DOM	(Δύση)

		perioxiDom = $('#kitapiPerioxi' + thesi);

		// Στο επάνω μέρος κάθε περιοχής υπάρχει περιοχή, επονομαζόμενη
		// "data" στην οποία εμφανίζεται το όνομα του αντίστοιχου παίκτη.
		//
		// Τα DOM elements των ονομάτων των παικτών είναι προσβάσιμα μέσω
		// των μεταβλητών:
		//
		//	Kitapi.onoma1DOM	(Νότος)
		//	Kitapi.onoma2DOM	(Ανατολή)
		//	Kitapi.onoma3DOM	(Δύση)

		dataDom = $('<div>').addClass('kitapiPektisData').
		append(onomaDom = $('<div>').addClass('kitapiPektisOnoma').
		html(Kitapi.onomasiaThesis[thesi]));
		Kitapi.onomaDOM[thesi] = onomaDom;

		if (thesi === 3) {
			kl = 31;
			kr = 32;
		}
		else if (thesi === 2) {
			kl = 23;
			kr = 21;
		}
		else {
			kl = 13;
			kr = 12;
		}

		daraveriDom = $('<table>').css('width', '100%').
		append($('<td>').attr('id', 'kitapiDaraveri' + kl).addClass('kitapiDaraveri').
		append(Kitapi.kapikiaAreaDOM[kl] = $('<div>').
		addClass('kitapiStiliKapikia kitapiStiliKapikia' + kl))).
		append(kasaDom = $('<td>').css({
			textAlign: 'center',
		})).
		append(daraveriKD = $('<td>').attr('id', 'kitapiDaraveri' + kr).addClass('kitapiDaraveri').
		append(Kitapi.kapikiaAreaDOM[kr] = $('<div>').
		addClass('kitapiStiliKapikia kitapiStiliKapikia' + kr)));

		if (thesi === 1) {
			kasaDom.
			append(dataDom);
		}
		else {
			perioxiDom.append(dataDom);
		}

		// Σε κάθε περιοχή υπάρχει υποπεριοχή που αφορά στην κάσα του
		// αντίστοιχου παίκτη.

		dom = $('<div>').
		addClass('kitapiStiliKasa').
		appendTo(kasaDom);

		// Στην Ανατολή και στη Δύση η λωρίδα των data που περιέχει το
		// όνομα του παίκτη, εκτείνεται από άκρου εις άκρον καλύπτοντας
		// όλο το πλάτος της περιοχής του αντίστοιχου παίκτη, επομένως
		// το διαθέσιμο ύψος της περιοχής γραφής κάσας και καπικιών θα
		// πρέπει να μειωθεί.

		if (thesi !== 1) {
			h = perioxiDom.outerHeight();
			h -= dataDom.outerHeight();
			dom.css('height', h + 'px');
		}

		isozigioDom = $('<div>').addClass('kitapiIsozigio');
		if (thesi === 1) isozigioDom.css('right', '150px');

		perioxiDom.
		append(daraveriDom).
		append(isozigioDom);

		Kitapi.kasaAreaDOM[thesi] = dom;
		Kitapi.isozigioDOM[thesi] = isozigioDom;
	});

	return Kitapi;
};

Kitapi.onomasiaThesis = {
	1: 'ΝΟΤΟΣ',
	2: 'ΑΝΑΤΟΛΗ',
	3: 'ΔΥΣΗ',
};

// Αρχικά υπήρχε η σκέψη σε μη παρτίδα να αναγράφονται οι συμβολικές
// ονομασίες θέσης των παικτών, αλλά το μετάνιωσα.

Prefadoros.thesiWalk(function(thesi) {
	Kitapi.onomasiaThesis[thesi] = '&nbsp;';
});

Kitapi.onomaGet = function(thesi) {
	var pektis;

	if (Kitapi.oxiArena())
	return Kitapi.onomasiaThesis[thesi];

	if (Arena.ego.oxiTrapezi())
	return Kitapi.onomasiaThesis[thesi];

	pektis = Arena.ego.trapezi.trapeziPektisGet(thesi);
	if (!pektis) pektis = Arena.ego.trapezi.trapeziTelefteosGet(thesi);
	return pektis ? pektis : '&nbsp;';
}

// Με την function "stresarisma" εισάγουμε μέγιστο πλήθος εγγραφών κάσας
// για τον Νότο και τη Δύση, ώστε να διορθωθούν οι διαστάσεις του παραθύρου
// και να αποφύγουμε κατά το δυνατόν τα scrollbars.

Kitapi.stresarisma = function() {
	Kitapi.
	fullData().
	resize().
	clearDOM();

	// Έχουμε φέρει το μέγεθος του κιταπιού στα επιθυμητά πλαίσια. Τώρα
	// μειώνουμε κατά μια θέση το μήκος των επιμέρους στηλών, οπότε έχουμε
	// περισσότερη σιγουριά, και αμέσως μετά υπολογίζουμε το μέγιστο πλήθος
	// στοιχείων για κάθε στήλη. Υπενθυμίζουμε ότι μόλις υπερβούμε το μέγιστο
	// πλήθος στοιχείων σε κάποια στήλη, κονταίνουμε τη στήλη και τοποθετούμε
	// κάθετα αποσιωπητικά στην αρχή της στήλης.

	Prefadoros.thesiWalk(function(thesi) {
		Kitapi.maxKasaLen[thesi]--;
		Kitapi.maxKasaCount[thesi] = Kitapi.maxKasaStiles[thesi] * Kitapi.maxKasaLen[thesi];

		Kitapi.maxKapikiaLen[thesi]--;
		Kitapi.maxKapikiaCount[thesi] = Kitapi.maxKapikiaStiles[thesi] * Kitapi.maxKapikiaLen[thesi];
	});

	return Kitapi;
};

// Η function "fullData" γεμίζει το κιτάπι με εικονικά δεδομένα τόσο στις περιοχές
// γραφής των κασών, όσο και στις περιοχές γραφής των καπικιών. Η συνήθης χρήση της
// function είναι η αναπροσαρμογή του μεγέθους του παραθύρου ώστε να χωρά άνετα
// τα δεδομένα.

Kitapi.fullData = function() {
	Prefadoros.thesiWalk(function(thesi) {
		var p1, p2, i, j;

		switch (thesi) {
		case 1:
			p1 = 2;
			p2 = 3;
			break;
		case 2:
			p1 = 1;
			p2 = 3;
			break;
		case 3:
			p1 = 1;
			p2 = 2;
			break;
		}

		for (i = 0; i < Kitapi.maxKasaStiles[thesi]; i++) {
			for (j = 1; j <= Kitapi.maxKasaLen[thesi]; j++) {
				Kitapi.kasaPush(thesi, j);
			}
		}

		for (i = 0; i < Kitapi.maxKapikiaStiles[thesi]; i++) {
			for (j = 1; j <= Kitapi.maxKapikiaLen[thesi]; j++) {
				Kitapi.kapikiaPush(thesi, p1, j);
				Kitapi.kapikiaPush(thesi, p2, j);
			}
		}
	});

	return Kitapi;
};

// Η function "resize" καλείται συνήθως μετά το «γέμισμα» του κιταπιού με εικονικά
// δεδομένα και σκοπό έχει την αναδιαμόρφωση των διαστάσεων του παραθύρου ώστε να
// χωρά άνετα όλα τα δεδομένα.

Kitapi.resize = function() {
	var dh, dw;

	dh = ($(document.body).height() - $(window).outerHeight()) || $(document).height() - $(window).height();
	if (dh <= 0) return Kitapi;
	if (dh > 200) return Kitapi;

	dw = parseInt(dh * 0.86);
	window.resizeBy(dw, dh);
	if (!Arena) return Kitapi;

	Arena.kitapi.position.width += dw;
	Arena.kitapi.position.height += dh;

	return Kitapi;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Η function "pliromiPush" δέχεται ένα record πληρωμής διανομής και επιτελεί
// τις σχετικές αλλαγές στο κιτάπι. Το record πληρωμής διανομής πρέπει να έχει
// τα παρακάτω στοιχεία:
//
//	kasa1		Είναι τα καπίκια που σηκώνει (θετικό), ή καταθέτει (αρνητικό)
//			στη κάσα ο παίκτης στη θέση 1, αν π.χ. είναι 30 σημαίνει ότι
//			ο παίκτης 1 σηκώνει από την κάσα 30 καπίκια, ενώ αν είναι -30,
//			σημαίνει ότι ο παίκτης 1 καταθέτει στην κάσα 30 καπίκια.
//
//	metrita1	Είναι καπίκια που δίνει (αρνητικό), ή παίρνει (θετικό) ο παίκτης
//			στη θέση 1 από τους άλλους παίκτες, αν π.χ. είναι -35 σημαίνει
//			ότι ο παίκτης 1 δίνει στους παίκτες 2 και 3 συνολικά 35 καπίκια,
//			ενώ αν είναι 96, σημαίνεί ότι ο παίκτης 1 παίρνει από τους παίκτες
//			2 και 3 συνολικά 96 καπίκια.
//
//	kasa2		Παρόμοιο με το "kasa1" αλλά για τον παίκτη 2.
//
//	metrita2	Παρόμοιο με το "metrita2" αλλά για τον παίκτη 2.
//
//	kasa3		Παρόμοιο με το "kasa1" αλλά για τον παίκτη 3.
//
//	metrita3	Παρόμοιο με το "metrita3" αλλά για τον παίκτη 3.

Kitapi.pliromiPush = function(data) {
	var pliromi, mideniki, asak = {}, aikipak = {}, kasaIdos;

	// Αρχικά θεωρούμε ότι η πληρωμή παρουσιάζει μηδενικά ποσά πληρωμής.
	// Αυτή η υπόθεση ενδεχομένως να αλλάξει κατά τον έλεγχο των ποσών
	// πληρωμής.

	mideniki = true;

	// Δημιουργούμε αντίγραφο με τα στοιχεία της πληρωμής, καθώς είναι πολύ
	// πιθανόν να πειράξουμε τα δεδομένα και δεν θέλουμε να αλλοιώσουμε τα
	// αρχικά δεδομένα.

	pliromi = {
		kasa: {},
		metrita: {},
	};

	Prefadoros.thesiWalk(function(thesi) {
		pliromi.kasa[thesi] = parseInt(data['kasa' + thesi]);
		pliromi.metrita[thesi] = parseInt(data['metrita' + thesi]);

		Kitapi.isozigioKasa -= pliromi.kasa[thesi];
		Kitapi.isozigioMetrita[thesi] += pliromi.kasa[thesi] + pliromi.metrita[thesi];

		// Ελέγχουμε αν υπάρχουν μη μηδενικά ποσά στην πληρωμή.

		if (pliromi.kasa[thesi]) mideniki = false;
		else if (pliromi.metrita[thesi]) mideniki = false;
	});

	// Αν η πληρωμή πράγματι περιείχε μόνο μηδενικά ποσά πληρωμής, τότε δεν
	// προχωρούμε σε καμία περαιτέρω ενέργεια.

	if (mideniki)
	return Kitapi;

	// Η πληρωμή περιλαμβάνει μη μηδενικά ποσά πληρωμής, επομένως τα ποσά στο
	// κιτάπι θα αλλάξουν. Ακυρώνουμε τυχόν έντονη εμφάνιση των ποσών που άλλαξαν
	// ή προσετέθησαν στην προηγούμενη πληρωμή, καθώς θα πρέπει πλέον να τονίσουμε
	// τα ΝΕΑ ποσά που θα αλλάξουν ή θα προστεθούν από την ανά χείρας πληρωμή.

	$('.kitapiEmfanesPoso').removeClass('kitapiEmfanesPoso');

	if (Kitapi.pliromiKasaLathos(data, pliromi))
	return Kitapi;

	if (Kitapi.pliromiKapikiaLathos(data, pliromi))
	return Kitapi;

	// Στη λίστα "asak" κρατάμε τα ποσά της κάσας για κάθε θέση ΠΡΙΝ την επεξεργασία
	// της ανά χείρας πληρωμής.

	Prefadoros.thesiWalk(function(thesi) {
		asak[thesi] = Kitapi.kasa[thesi];
	});

	// Στη λίστα "aikipak" κρατάμε τα δούναι και λαβείν καπικιών μεταξύ των παικτών
	// ΠΡΙΝ την επεξεργασία της πληρωμής, π.χ. το "aikipak[23]" δείχνει τα καπίκια
	// που δίνει ο παίκτης 2 στον παίκτη 3 πριν την επεξεργασία της ανά χείρας
	// πληρωμής.

	Kitapi.sinalagiWalk(function(apoPros) {
		aikipak[apoPros] = Kitapi.kapikia[apoPros];
	});

	kasaIdos = Kitapi.pliromiKasaFix(pliromi);
	Prefadoros.thesiWalk(function(thesi) {
		if (Kitapi.kasa[thesi] !== asak[thesi])
		Kitapi.kasaPush(thesi, Math.floor(Kitapi.kasa[thesi] / 10), kasaIdos[thesi]);
	});

	Kitapi.pliromiKapikiaPios(pliromi.metrita);
	Kitapi.sinalagiWalk(function(apoPros) {
		if (Kitapi.kapikia[apoPros] === aikipak[apoPros]) return;
		if (Kitapi.kapikia[apoPros] > 0) return;
		Kitapi.kapikiaPush(apoPros.substr(0, 1), apoPros.substr(1, 1), -Kitapi.kapikia[apoPros]);
	});

	return Kitapi;
};

Kitapi.pliromiKasaLathos = function(data, pliromi) {
	var kasaSin, kasaPlin;

	// Μπορεί να υπάρχει μια το πολύ θετική κάσα και αυτή παρουσιάζεται
	// στην περίπτωση που έχει γίνει αγορά και ο τζογαδόρος έχει βγάλει
	// την αγορά.

	kasaSin = 0;
	kasaPlin = 0;

	Prefadoros.thesiWalk(function(thesi) {
		if (pliromi.kasa[thesi] > 0) kasaSin++;
		if (pliromi.kasa[thesi] < 0) kasaPlin++;
	});

	if ((kasaSin === 1) && kasaPlin) {
		console.error('Παρουσιάστηκαν αρνητικές κάσες', data);
		return true;
	}

	if (kasaSin > 1) {
		console.error('Παρουσιάστηκαν περισσότερες από μια θετικές κάσες', data);
		return true;
	}

	if ((kasaSin === 1) && kasaPlin) {
		console.error('Περισσότερες από μια θετικές κάσες', data);
		return true;
	}

	return false;
};

Kitapi.pliromiKapikiaLathos = function(data, pliromi) {
	var metrita;

	// Το αλγεβρικό σύνολο των μετρητών πρέπει να είναι μηδέν. Θέτουμε,
	// λοιπόν, αρχικά το σύνολο των μετρητών σε μηδέν.

	metrita = 0;

	Prefadoros.thesiWalk(function(thesi) {
		metrita += pliromi.metrita[thesi];
	});

	if (metrita) {
		console.error('Λανθασμένα μετρητά πληρωμής', data);
		return true;
	}

	return false;
};

// Η function "pliromiKasaFix" ελέγχει ποιες κάσες δεν επαρκούν ώστε να
// μειώσουμε από τις άλλες και να ανταλλάξουμε τα ανάλογα καπίκια (γλείψιμο).

Kitapi.pliromiKasaFix = function(pliromi) {
	var idos = {};

	Prefadoros.thesiWalk(function(thesi) {
		var kasa, alos1, alos2;

		// Η μεταβλητή "kasa" περιέχει το ποσό της κάσας του παίκτη
		// στην ανά χείρας θέση. Αυτό το ποσό ενδεχομένως να υποστεί
		// αλλοιώσεις.

		kasa = pliromi.kasa[thesi];
		if (!kasa) return;

		// Αν η δοσοληψία του παίκτη με την κάσα είναι αρνητική, τότε
		// το ποσό ΚΑΤΑΤΙΘΕΤΑΙ στην κάσα (μέσα αγορά, ή πάσο πάσο),
		// επομένως δεν έχουμε πρόβλημα.

		if (kasa < 0) {
			Kitapi.kasa[thesi] -= kasa;
			idos[thesi] = 'ΑΥΞΗΣΗ';
			return;
		}

		// Το ποσό είναι θετικό, επομένως πρόκειται για ποσό που «σηκώνει»
		// ο παίκτης από την κάσα. Αν υπάρχει θετικό ποσό κάσας πρόκειται
		// για τον τζογαδόρο και δεν θα υπάρξει άλλο ποσό κάσας.

		kasesDone = true;

		// Αν το ποσό της κάσας του παίκτη επαρκεί, μειώνουμε τη δική του
		// κάσα και έχουμε τελειώσει.

		if (kasa <= Kitapi.kasa[thesi]) {
			Kitapi.kasa[thesi] -= kasa;
			return;
		}

		// Εκμεταλλευόμαστε το όποιο υπόλοιπο κάσας έχει ο ανά χείρας παίκτης.

		if (Kitapi.kasa[thesi] > 0) {
			kasa -= Kitapi.kasa[thesi];
			Kitapi.kasa[thesi] = 0;
		}

		// Εντοπίζουμε τις άλλες δυο κάσες και θέτουμε τη μεγαλύτερη
		// από τις δυο στο "alos1" και την άλλη στο "alos2".

		switch (thesi) {
		case 1:
			if (Kitapi.kasa[2] > Kitapi.kasa[3]) {
				alos1 = 2;
				alos2 = 3;
			}
			else {
				alos1 = 3;
				alos2 = 2;
			}
			break;
		case 2:
			if (Kitapi.kasa[1] > Kitapi.kasa[3]) {
				alos1 = 1;
				alos2 = 3;
			}
			else {
				alos1 = 3;
				alos2 = 1;
			}
			break;
		case 3:
			if (Kitapi.kasa[1] > Kitapi.kasa[2]) {
				alos1 = 1;
				alos2 = 2;
			}
			else {
				alos1 = 2;
				alos2 = 1;
			}
			break;
		}

		// Αν η μεγαλύτερη από τις άλλες δυο κάσες δεν έχει υπόλοιπο
		// τότε δεν γίνεται τίποτα και μειώνω από την κάσα του παίκτη.

		if (Kitapi.kasa[alos1] <= 0) {
			Kitapi.kasa[thesi] -= kasa;
			return;
		}

		// Η μεγαλύτερη από τις άλλες δύο κάσες σίγουρα θα υποστεί
		// μείωση.

		idos[alos1] = 'ΓΛΕΙΨΙΜΟ';

		// Αν η μεγαλύτερη από τις άλλες δυο κάσες επαρκεί, τότε κάνω
		// τη μείωση από αυτή την κάσα και δίνω καπίκια.

		if (kasa <= Kitapi.kasa[alos1]) {
			pliromi.metrita[thesi] += kasa;
			pliromi.metrita[alos1] -= kasa;
			Kitapi.kasa[alos1] -= kasa;
			return;
		}

		// Η μεγαλύτερη από τις άλλες δυο κάσες δεν επαρκεί αλλά έχει
		// κάποιο ποσό, το οποίο και εκμεταλλεύομαι.

		pliromi.metrita[thesi] += Kitapi.kasa[alos1];
		pliromi.metrita[alos1] -= Kitapi.kasa[alos1];
		kasa -= Kitapi.kasa[alos1];
		Kitapi.kasa[alos1] = 0;
		if (kasa <= 0) return;

		// Μετά το «γλείψιμο» από την μεγαλύτερη κάσα έχει απομείνει κάποιο
		// υπόλοιπο και ελέγχουμε αν υπάρχει υπόλοιπο στην τρίτη κάσα. Αν δεν
		// υπάρχει υπόλοιπο, μειώνουμε από την κάσα του παίκτη.

		if (Kitapi.kasa[alos2] <= 0) {
			Kitapi.kasa[thesi] -= kasa;
			return;
		}

		idos[alos2] = 'ΓΛΕΙΨΙΜΟ';

		if (kasa <= Kitapi.kasa[alos2]) {
			pliromi.metrita[thesi] += kasa;
			pliromi.metrita[alos2] -= kasa;
			Kitapi.kasa[alos2] -= kasa;
			return;
		}

		pliromi.metrita[thesi] += Kitapi.kasa[alos2];
		pliromi.metrita[alos2] -= Kitapi.kasa[alos2];
		kasa -= Kitapi.kasa[alos2];
		Kitapi.kasa[alos2] = 0;
		if (kasa <= 0) return;

		Kitapi.kasa[thesi] -= kasa;
	});

	return idos;
};

Kitapi.pliromiKapikiaPios = function(metrita) {
	var alos1, alos2, kapikia = {}, i;

	// Εντοπίζουμε τα πρώτα θετικά καπίκια και με βάση αυτή την
	// εγγραφή ανασυνθέτουμε τις συναλλαγές μεταξύ των παικτών.

	for (thesi = 1; thesi <= Prefadoros.thesiMax; thesi++) {
		if (metrita[thesi] <= 0) continue;

		switch (thesi) {
		case 1:
			alos1 = 2;
			alos2 = 3;
			break;
		case 2:
			alos1 = 1;
			alos2 = 3;
			break;
		case 3:
			alos1 = 1;
			alos2 = 2;
			break;
		}

		if (metrita[alos1] > 0) {
			kapikia[alos2 + '' + thesi] = metrita[thesi];
			kapikia[alos2 + '' + alos1] = metrita[alos1];

			kapikia[thesi + '' + alos2] = -metrita[thesi];
			kapikia[alos1 + '' + alos2] = -metrita[alos1];
			break;
		}

		if (metrita[alos2] > 0) {
			kapikia[alos1 + '' + thesi] = metrita[thesi];
			kapikia[alos1 + '' + alos2] = metrita[alos2];

			kapikia[thesi + '' + alos1] = -metrita[thesi];
			kapikia[alos2 + '' + alos1] = -metrita[alos2];
			break;
		}

		if (metrita[alos1] === 0) {
			kapikia[alos2 + '' + thesi] = metrita[thesi];
			kapikia[thesi + '' + alos2] = -metrita[thesi];
			break;
		}

		if (metrita[alos2] === 0) {
			kapikia[alos1 + '' + thesi] = metrita[thesi];
			kapikia[thesi + '' + alos1] = -metrita[thesi];
			break;
		}

		kapikia[alos1 + '' + thesi] = -metrita[alos1];
		kapikia[alos2 + '' + thesi] = -metrita[alos2];

		kapikia[thesi + '' + alos1] = metrita[alos1];
		kapikia[thesi + '' + alos2] = metrita[alos2];
		break;
	}

	for (i in kapikia) {
		Kitapi.kapikia[i] += kapikia[i];
	}
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Η function "kasaPush" προσθέτει νέα εγγραφή κάσας στην περιοχή γραφής κάσας
// συγκεκριμένου παίκτη του οποίου τη θέση περνάμε ως πρώτη παράμετρο. Το ποσό
// της κάσας της νέας εγγραφής, ή οτιδήποτε άλλο θέλουμε να εμφανιστεί στη θέση
// της κάσας (π.χ. σημαιάκι τέλους), περνιέται ως δεύτερη παράμετρος. Μπορούμε
// να περάσουμε και τρίτη παράμετρο που δείχνει αν η νέα εγγραφή αφορά σε αύξηση
// της κάσας από μέσα αγορά του εν λόγω παίκτη, ή σε μείωση από «γλείψιμο», δηλαδή
// από αγορά άλλου παίκτη του οποίου η κάσα δεν επαρκεί για να πληρωθεί η αγορά.

Kitapi.kasaPush = function(thesi, kasa, idos) {
	var kasaStiliDom, count, stiles, xorane, platos, kasaDom;

	// Πρώτα ελέγχουμε αν οι εγγραφές κάσας του συγκεκριμένου παίκτης έχουν ήδη
	// φτάσει στο μέγιστο επιτρεπτό πλήθος εγγραφών κάσας για τη συγκεκριμένη
	// θέση.

	kasaStiliDom = Kitapi.kasaAreaDOM[thesi];

	// Αν έχουμε φτάσει στο μέγιστο πλήθος εγγραφών κάσας της συγκεκριμένης
	// περιοχής, προβαίνουμε σε «κόντεμα» αφαιρώντας τις παλαιότερες εγγραφές.

	count = kasaStiliDom.children('.kitapiKasa').length;
	if (count >= Kitapi.maxKasaCount[thesi])
	count = Kitapi.kasaKontema(thesi);
	count++;

	// Υπολογίζουμε τα χαρακτηριστικά (πλάτος, στήλες κλπ) της συγκεκριμένης
	// περιοχής γραφής κασών, με βάση το τρέχον πλήθος των εγγραφών κάσας
	// της συγκεκριμένης περιοχής (μαζί με την νέα εγγραφή).

	xorane = Kitapi.maxKasaLen[thesi];
	stiles = Math.floor(count / xorane);
	if ((stiles * xorane) < count) stiles++;
	platos = (38 * stiles) + 'px';
	stiles += '';

	kasaStiliDom.css({
		width: platos,
		'column-count': stiles,
		'-moz-column-count': stiles,
		'-webkit-column-count': stiles,
	});

	// Αλλάζουμε κάποια χαρακτηριστικά του DOM element της τελευταίας εγγραφής
	// κάσας της συγκεκριμένης περιοχής, εφόσον, βεβαίως, υπάρχει παλαιότερη
	// τέτοια εγγραφή στη συγκεκριμένη περιοχή.

	kasaDom = Kitapi.kasaDOM[thesi];
	if (kasaDom) kasaDom.addClass('kitapiEmfanesPoso kitapiKasaDiagrafi');

	// Δημιουργούμε DOM element για την νέα εγγραφή που θα προστεθεί στη
	// συγκεκριμένη περιοχή γραφής κασών.

	kasaDom = $('<div>').addClass('kitapiKasa kitapiEmfanesPoso').
	//html(kasa ? kasa : '&#9872;');	// σημαιάκι (δεν φαίνεται)
	html(kasa ? kasa : '&#10004;');		// τσεκ
	switch (idos) {
	case 'ΑΥΞΗΣΗ':
		kasaDom.addClass('kitapiKasaMesa');
		break;
	case 'ΓΛΕΙΨΙΜΟ':
		kasaDom.addClass('kitapiKasaGlipsimo');
		break;
	}

	// Προσθέτουμε το DOM element της νέας εγγραφής στη συγκεκριμένη περιοχή
	// γραφής κασών και κρατάμε το DOM element ως τελευταίο DOM element κάσας
	// της συγκεκριμένης περιοχής. 

	kasaStiliDom.append(kasaDom);
	Kitapi.kasaDOM[thesi] = kasaDom;

	return Kitapi;
};

// Η function "kasaKontema" κονταίνει τη λίστα κασών συγκεκριμένης θέσης
// και επιστρέφει το νέο πλήθος της λίστας.

Kitapi.kasaKontema = function(thesi) {
	var jql, count, del, i;

	jql = Kitapi.kasaAreaDOM[thesi].children('.kitapiKasa');
	count = jql.length;

	del = 1;
	if (count <= del) return count;

	del = 1;
	for (i = 0; i < del; i++) {
		$(jql.get(i)).remove();
	}

	$(jql.get(i)).removeClass().addClass('kitapiKasa').html('&#8942;');
	return count - del;
};

// Η function "kapikiaPush" προσθέτει εγγραφή καπικιών στη περιοχή συναλλαγής
// καπικιών δύο παικτών των οποίων οι θέσεις δίνονται ως πρώτη και δεύτερη
// παράμετρος. Τρίτη παράμετρος είναι τα καπίκια, ή οτιδήποτε άλλο θέλουμε
// να προσθέσουμε στη συγκεκριμένη περιοχή. Η σειρά των παικτών έχει σημασία·
// πρώτος είναι ο παίκτης στην περιοχή του οποίου θα προστεθεί η νέα εγγραφή
// και δεύτερος είναι ο παίκτης με τον οποίον γίνεται η εν λόγω συναλλαγή.

Kitapi.kapikiaPush = function(apo, pros, kapikia) {
	var apoPros, prosApo, kapikiaStiliDom, anapoda, count, stiles, xorane, platos, kapikiaDom;

	// Δεν υφίσταται συναλλαγή καπικιών παίκτη με τον εαυτό του.

	if (apo === pros)
	return Kitapi;

	// Υπολογίζουμε τους σύνθετους δείκτες περιοχών συναλλαγής για τους ανά
	// χείρας παίκτες, π.χ. για τους παίκτες 1 και 3 θα έχουμε τους δείκτες
	// 13 και 31, καθώς και οι δύο περιοχές ενδεχομένως να επηρεαστούν.

	apoPros = apo + '' + pros;
	prosApo = pros + '' + apo;

	// Εμφανίζουμε ως διαγραμμένη τυχόν παλαιότερη εγγραφή καπικιών για την
	// κύρια περιοχή.

	kapikiaDom = Kitapi.kapikiaDOM[apoPros];
	if (kapikiaDom) kapikiaDom.addClass('kitapiKapikiaDiagrafi kitapiEmfanesPoso');
	delete Kitapi.kapikiaDOM[apoPros];

	// Εμφανίζουμε ως διαγραμμένη τυχόν παλαιότερη εγγραφή καπικιών για την
	// δευτερεύουσα περιοχή.

	kapikiaDom = Kitapi.kapikiaDOM[prosApo];
	if (kapikiaDom) kapikiaDom.addClass('kitapiKapikiaDiagrafi kitapiEmfanesPoso');
	delete Kitapi.kapikiaDOM[prosApo];

	// Αν τα καπίκια που πρέπει να προστεθούν είναι μηδενικά, δεν τα εμφανίζουμε
	// και ως εκ τούτου δεν δημιουργούμε νέα εγγραφή, επομένως δεν προβαίνουμε σε
	// καμία περαιτέρω ενέργεια.

	if (!kapikia)
	return Kitapi;

	// Θα προστεθεί νέα εγγραφή, επομένως πρέπει να ελέγξουμε το πλήθος των εγγραφών
	// στην κύρια περιοχή. Με τη δευτερεύουσα περιοχή έχουμε τελειώσει.

	kapikiaStiliDom = Kitapi.kapikiaAreaDOM[apoPros];

	// Σε δύο περιοχές γράφουμε ανάποδα, δηλαδή από κάτω προς τα πάνω. Πράγματι,
	// πρόκειται για τις περιοχές 12 (πάνω δεξιά) και 13 (πάνω αριστερά).

	anapoda = Kitapi.kapikiaAnapoda.hasOwnProperty(apoPros);

	// Ελέγχουμε το πλήθος των εγγραφών στην περιοχή στην οποία προτιθέμεθα να
	// προσθέσουμε την νέα εγγραφή καπικιών. Αν το πλήθος των εγγραφών καπικιών
	// στη συγκεκριμένη περιοχή έχει ήδη φτάσει το μέγιστο επιτρεπτό πλήθος για
	// τη συγκεκριμένη περιοχή, προβαίνουμε σε «κόντεμα» αυτής της περιοχής.

	count = kapikiaStiliDom.children('.kitapiKapikia').length;
	if (count >= Kitapi.maxKapikiaCount[apo])
	count = Kitapi.kapikiaKontema(apo, pros, anapoda);
	count++;

	// Υπολογίζουμε και εφαρμόζουμε τα στιλιστικά χαρακτηριστικά (πλάτος, στήλες κλπ)
	// της συγκεκριμένης περιοχής γραφής καπικιών με βάση το πλήθος των εγγραφών
	// συνυπολογιζομένης και της νέας εγγραφής.

	xorane = Kitapi.maxKapikiaLen[apo];
	stiles = Math.floor(count / xorane);
	if ((stiles * xorane) < count) stiles++;
	platos = (36 * stiles) + 'px';
	stiles += '';

	kapikiaStiliDom.css({
		width: platos,
		'column-count': stiles,
		'-moz-column-count': stiles,
		'-webkit-column-count': stiles,
	});

	// Δημιουργούμε DOM element για τη νέα εγγραφή καπικιών και την προσθέτουμε
	// στην επίμαχη περιοχή είτε από πάνω, είτε από κάτω ανάλογα με την περιοχή,
	// και κρατάμε το νεοεισαχθέν DOM element για την εν λόγω περιοχή.

	kapikiaDom = $('<div>').addClass('kitapiKapikia kitapiEmfanesPoso').text(kapikia);
	if (anapoda) kapikiaStiliDom.prepend(kapikiaDom);
	else kapikiaStiliDom.append(kapikiaDom);

	Kitapi.kapikiaDOM[apoPros] = kapikiaDom;
	return Kitapi;
};

// Η function "kasaKontema" κονταίνει τη λίστα κασών συγκεκριμένου
// ζεύγους παικτών και επιστρέφει το νέο πλήθος της λίστας.

Kitapi.kapikiaKontema = function(apo, pros, anapoda) {
	var jql, count, del, i;

	jql = Kitapi.kapikiaAreaDOM[apo + '' + pros].children('.kitapiKapikia');
	count = jql.length;
	del = 1;

	if (count <= del) return count;

	if (anapoda) {
		for (i = del - 1; i >= 0; i--) {
			$(jql.get(i)).remove();
		}
	}
	else {
		for (i = 0; i < del; i++) {
			$(jql.get(i)).remove();
		}
	}

	$(jql.get(i)).removeClass('kitapiKapikiaDiagrafi').html('&#8942;');
	return count - del;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Kitapi.clearDOM = function() {
	Kitapi.trapeziDOM.empty();
	Kitapi.kasaAreaDOM[1].empty();
	Kitapi.kapikiaAreaDOM[13].empty();
	Kitapi.kapikiaAreaDOM[12].empty();

	Kitapi.kasaAreaDOM[2].empty();
	Kitapi.kapikiaAreaDOM[21].empty();
	Kitapi.kapikiaAreaDOM[23].empty();

	Kitapi.kasaAreaDOM[3].empty();
	Kitapi.kapikiaAreaDOM[31].empty();
	Kitapi.kapikiaAreaDOM[32].empty();

	Kitapi.kasa = {};
	Kitapi.kasaDOM = {};

	Kitapi.kapikia = {};
	Kitapi.kapikiaDOM = {};

	return Kitapi;
};

Kitapi.refreshDOM = function() {
	var trapezi, kasa;

	Kitapi.clearDOM();

	if (Kitapi.oxiArena()) return Kitapi;
	if (Arena.ego.oxiTrapezi()) return Kitapi;

	trapezi = Arena.ego.trapezi;
	Kitapi.trapeziDOM.text(Arena.ego.trapezi.trapeziKodikosGet() % 10000);

	kasa = trapezi.trapeziKasaGet();
	Kitapi.isozigioKasa = kasa * 30;

	Prefadoros.thesiWalk(function(thesi) {
		Kitapi.onomaDOM[thesi].html(Kitapi.onomaGet(thesi));
		Kitapi.kasaPush(thesi, kasa);
		Kitapi.kasa[thesi] = kasa * 10;
		Kitapi.isozigioMetrita[thesi] = -Kitapi.kasa[thesi];
	});

	Kitapi.sinalagiWalk(function(apoPros) {
		Kitapi.kapikia[apoPros] = 0;
	});

	trapezi.trapeziDianomiWalk(function(dianomi) {
		Kitapi.pliromiPush(this);
	}, 1);

	Kitapi.isozigioRefreshDOM();
	return Kitapi;
};

// Η function "isozigioRefreshDOM" μοιράζει τις κάσες, ενημερώνει τα κέρδη
// και τις ζημίες των παικτών και εμφανίζει τα αποτελέσματα στο επάνω δεξιά
// μέρος της περιοχής κάθε παίκτη.

Kitapi.isozigioRefreshDOM = function() {
	var kasa, isozigio = {};

	kasa = Math.floor(Kitapi.isozigioKasa / 3.0);
	Prefadoros.thesiWalk(function(thesi) {
		isozigio[thesi] = Kitapi.isozigioMetrita[thesi] + kasa;
	});

	// Είναι πιθανόν να υπάρχουν μικροσφάλματα λόγω της στρογγυλοποίησης,
	// επομένως ισοσκελίζουμε ώστε να έχουμε μηδενικό αλγεβρικό άθροισμα.

	isozigio[1] = -isozigio[3] - isozigio[2];

	Prefadoros.thesiWalk(function(thesi) {
		Kitapi.isozigioDOM[thesi].removeClass().addClass('kitapiIsozigio');
		if (isozigio[thesi] < 0)
		Kitapi.isozigioDOM[thesi].addClass('kitapiIsozigioMion').text(isozigio[thesi]);

		else if(isozigio[thesi] > 0)
		Kitapi.isozigioDOM[thesi].addClass('kitapiIsozigioSin').text('+' + isozigio[thesi]);

		else
		Kitapi.isozigioDOM[thesi].empty();
	});

	return Kitapi;
};

Kitapi.pektisRefreshDOM = function() {
	Prefadoros.thesiWalk(function(thesi) {
		Kitapi.onomaDOM[thesi].html(Kitapi.onomaGet(thesi));
	});

	return Kitapi;
};
