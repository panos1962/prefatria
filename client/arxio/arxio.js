// ΣΕΑΠ -- Σελίδα Επισκόπησης Αρχειοθετημένων Παρτίδων
// ===================================================
//
// Το παρόν οδηγεί τη σελίδα επισκόπησης αρχειοθετημένων παρτίδων ΣΕΑΠ. Ο χρήστης
// μπορεί να καθορίσει κριτήρια επιλογής σχετικά με τους συμμετέχοντες και το χρόνο
// έναρξης της παρτίδας.
//
// Όσον αφορά στους συμμετέχοντες έχουμε τις εξής επιλογές:
//
//	[κενό]		Αν αφήσουμε το πεδίο κενό, τότε επιλέγονται παρτίδες ασχέτως
//			των συμμετεχόντως σε αυτές.
//
//	panos		Επιλέγονται παρτίδες στις οποίες συμμετέχει ο παίκτης "panos"
//
//	panos,maria	Επιλέγονται παρτίδες στις οποίες συμμετέχει ο παίκτης "panos",
//			ή ο παίκτης "kolios", ή και οι δύο.
//
//	panos+kolios	Επιλέγονται παρτίδες στις οποίες συμμετέχουν ΚΑΙ ο παίκτης
//			"panos" ΚΑΙ ο παίκτης "kolios".
//
// Στο κριτήριο ονόματος παίκτη μπορούν να «παίξουν» και μεταχαρακτήρες (%_).
//
// Τα κριτήρια επιλογής χρόνου έναρξης είναι απλώς οι ημερομηνίες αρχής και τέλους του
// διαστήματος επιλογής. Αν λείπει κάποιο, ή και τα δύο από αυτά τα κριτήρια το πρόγραμμα
// συμπεριφέρεται λογικά.
//
// Όσον αφορά στον κωδικό παρτίδας έχουμε τις εξής επιλογές:
//
//	[κενό]		Αν αφήσουμε το πεδίο κενό, τότε επιλέγονται παρτίδες με βάση
//			τα υπόλοιπα κριτήρια αναζήτησης.
//
//	NNNNNN		Επιλέγεται η παρτίδα με κωδικό NNNNNN.
//
//	NNNNNN-MMMMMM	Επιλέγονται οι παρτίδες με κωδικούς από NNNNNN έως και MMMMMM.
//
//	<NNNNNN		Επιλέγονται οι παρτίδες με κωδικούς μικρότερους από NNNNNN.
//
//	-NNNNNN		Επιλέγονται οι παρτίδες με κωδικούς από NNNNNN και κάτω.
//
//	>NNNNNN		Επιλέγονται οι παρτίδες με κωδικούς μεγαλύτερους από NNNNNN.
//
//	NNNNNN-		Επιλέγονται οι παρτίδες με κωδικούς από NNNNNN και άνω.
//
// Τα αποτελέσματα εμφανίζονται ταξινομημένα κατά κωδικό παρτίδας και αποστέλλονται σε
// σε ομάδες των 10 παρτίδων. Ο χρήστης μπορεί να ζητήσει την επόμενη ομάδα με το
// πλήκτρο "Περισσότερα…".

$(document).ready(function() {
	Client.
	tabPektis().
	tabKlisimo();
	Arxio.setup();

	// Κατά την ανάπτυξη του προγράμματος βολεύει καλύτερα
	// να έχουμε αυτόματα κάποιο selected set.

	if (Debug.flagGet('development')) {
		$('input').val('');
		Arxio.goButtonDOM.trigger('click');
	}

	// Ελέγχουμε αν έχουμε ανοίξει την ΣΕΑΠ από τη βασική
	// σελίδα της εφαρμογής, ή αυτόνομα.

	Arena = null;
	if (!window.opener)
	return;

	// Εφόσον η σελίδα δεν έχει ανοίξει αυτόνομα, ελέγχουμε
	// το global αντικείμενο "Arena" το οποίο υποδηλώνει τη
	// βασική σελίδα της εφαρμογής ως σημείο εκκίνησης της
	// ΣΕΑΠ.

	Arena = window.opener.Arena;
	if (!Arena)
	return;

	// Η ΣΕΑΠ εκκίνησε από τη βασική σελίδα της εφαρμογής.
	// Προς το παρόν δεν χρειάζεται να κάνουμε κάποια ενέργεια
	// στη βασική σελίδα.
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arxio = {
	// Η property "limit" δείχνει πόσες παρτίδες αποστέλλονται από τον server
	// σε κάθε αποστολή.

	limit: 10,

	// Η property "skip" δείχνει πόσες ομάδες παρτίδων έχουμε ήδη παραλάβει
	// κάθε φορά που ζητάμε την επόμενη ομάδα αποτελεσμάτων για την τρέχουσα
	// αναζήτηση.

	skip: 0,
};

Arxio.unload = function() {
	Arxio.movie.klisimo();

	if (!Arena) return;
	if (!Arena.arxio) return;
	if (!Arena.arxio.win) return;

	Arena.arxio.win.close();
	Arena.arxio.win = null;
};

$(window).
on('beforeunload', function() {
	Arxio.unload();
}).
on('unload', function() {
	Arxio.unload();
});

Arxio.setup = function() {
	var h;

	// Για τη διευκόλυνσή μας στην ανάπτυξη των προγραμμάτων, μπορούμε να
	// μειώσουμε το μέγεθος των ομάδων αποτελεσμάτων που αποστέλλονται από
	// τον server.

	if (Debug.flagGet('arxioLimit'))
	Arxio.limit = parseInt(Debug.flagGet('arxioLimit'));

	Client.ofelimoDOM.
	append(Arxio.kritiriaDOM = $('<div>').attr('id', 'kritiria')).
	append(Arxio.apotelesmataDOM = $('<div>').attr('id', 'apotelesmata'));

	Arxio.kritiriaSetup();
	h = Client.ofelimoDOM.innerHeight();
	h -= Arxio.kritiriaDOM.outerHeight(true) + 20;
	Arxio.apotelesmataDOM.css('height', h + 'px');

	// Στήνουμε κάποιους keyborad/mouse event listeners που αφορούν σε
	// ολόκληρη τη σελίδα.

	$(document).

	// Με το πάτημα του πλήκτρου Escape κάνουμε reset στη ΣΕΑΠ.

	on('keyup', function(e) {
		switch (e.which) {
		case 27:
			Arxio.resetButtonDOM.trigger('click');
			break;
		}
	}).

	// Οι παρτίδες που εμφανίζονται στη ΣΕΑΠ είναι κάπως αχνές, αλλά γίνονται
	// διαυγείς μόλις ο χρήστης περάσει από πάνω τους το ποντίκι. Αυτό γίνεται
	// μέσω CSS, αλλά παρόμοια τακτική ακολουθούμε και για τα καπίκια του κάθε
	// παίκτη· αυτό γίνεται προγραμματιστικά.

	on('mouseenter', '.trapezi', function(e) {
		Client.fyi.pano('');
		$(this).find('.arxioKapikia').addClass('arxioKapikiaTrexon');
		$(this).find('.trapeziPektis').addClass('pektisOnomaTrexon');
	}).
	on('mouseleave', '.trapezi', function(e) {
		$('.arxioKapikiaTrexon').removeClass('arxioKapikiaTrexon');
		$('.pektisOnomaTrexon').removeClass('pektisOnomaTrexon');
	}).

	// Οι διανομές που εμφανίζονται στη ΣΕΑΠ είναι κάπως αχνές, αλλά γίνονται
	// διαυγείς μόλις ο χρήστης περάσει από πάνω τους το ποντίκι. Αυτό γίνεται
	// μέσω CSS, αλλά παρόμοια τακτική ακολουθούμε και για τις αγορές που
	// έγιναν ενδεχομένως στη διανομή· αυτό γίνεται προγραμματιστικά.

	on('mouseenter', '.dianomi', function(e) {
		$(this).find('.agoraBazes').addClass('agoraBazesTrexon');
		$(this).find('.dianomiPektisOnoma').addClass('dianomiPektisOnomaTrapezi');
	}).
	on('mouseleave', '.dianomi', function(e) {
		$('.agoraBazesTrexon').removeClass('agoraBazesTrexon');
		$(this).find('.dianomiPektisOnoma').removeClass('dianomiPektisOnomaTrapezi');
	}).

	on('mouseenter', '.dianomiPektis', function(e) {
		$(this).find('.dianomiPektisOnoma').addClass('pektisOnomaTrexon');
	}).
	on('mouseleave', '.dianomiPektis', function(e) {
		$(this).find('.dianomiPektisOnoma').removeClass('pektisOnomaTrexon');
	});

	// Η function "setupPost" έχει δημιουργηθεί από το "index.php" της ΣΕΑΠ
	// και αφορά στην επώνυμη χρήση, στα κριτήρια που δόθηκαν στο URL και σε
	// σε ενδεχόμενη αυτόματη αναζήτηση.

	Arxio.setupPost();

	return Arxio;
};

// Η function "kritiriaSetup" στήνει το επάνω μέρος της ΣΕΑΠ όπου υπάρχουν τα κριτήρια
// αναζήτησης και τα διάφορα πλήκτρα που αφορούν στους χειρισμούς αναζήτησης. Αν και
// δεν είναι απαραίτητο, όλα τα παραπάνω τα εντάσσουμε σε HTML form προκειμένου να
// καρπωθούμε τα οφέλη της φόρμας (submit, reset κλπ).

Arxio.kritiriaSetup = function() {
	Arxio.kritiriaDOM.
	append($('<form>').

	// Το πρώτο κριτήριο αναζήτησης αφορά στο login name του παίκτη σύμφωνα με τους
	// κανόνες που αναφέραμε παραπάνω.

	append($('<span>').addClass('formaPrompt').text('Παίκτης')).
	append(Arxio.pektisInputDOM = $('<input>').addClass('formaPedio').css('width', '60px')).

	// Ακολουθεί η αρχή του χρονικού διαστήματος που μας ενδιαφέρει. Αν δεν καθοριστεί
	// ημερομηνία αρχής, τότε δεν τίθεται κάτω χρονικό όριο. Η ημερομηνία αυτή αφορά
	// στο τέλος της παρτίδας και όχι στο στήσιμο.

	append($('<span>').addClass('formaPrompt').text('Από')).
	append(Arxio.apoInputDOM = Client.inputDate()).

	// Το επόμενο κριτήριο αναζήτησης αφορά στο τέλος του χρονικού διαστήματος που μας
	// ενδιαφέρει. Αν δεν καθοριστεί ημερομηνία τέλους, τότε δεν τίθεται άνω χρονικό
	// όριο.

	append($('<span>').addClass('formaPrompt').text('Έως')).
	append(Arxio.eosInputDOM = Client.inputDate()).

	// Ακολουθεί κριτήριο αναζήτησης που αφορά στον κωδικό τραπεζιού, σύμφωνα με τους
	// κανόνες που αναφέραμε παραπάνω.

	append($('<span>').addClass('formaPrompt').text('Παρτίδα')).
	append(Arxio.partidaInputDOM = $('<input>').addClass('formaPedio').css('width', '70px').
	on('keyup', function(e) {
		switch (e.which) {
		case 13:
			break;
		default:
			$(this).removeClass('inputLathos');
			break;
		}
	})).

	// Το πλήκτρο "Go!!!" εκκινεί την αναζήτηση στον server. Το καθιστούμε submit
	// button προκειμένου να μπορεί ο χρήστης να εκκινήσει την αναζήτηση πατώντας
	// Enter.

	append(Arxio.goButtonDOM = $('<button>').
	text('Go!!!').
	attr('type', 'submit').
	addClass('formaButton').
	on('click', function(e) {
		Arxio.
		apotelesmataClear().
		skipReset().
		zitaData();
		return false;
	})).

	// Το πλήκτρο "Reset" καθαρίζει τα αποτελέσματα που υπάρχουν ήδη στη ΣΕΑΠ και
	// επαναφέρει τα κριτήρια αναζήτησης στις αρχικές τους τιμές. Ο χρήστης μπορεί
	// να κάνει reset και με άλλον τρόπο, πατώντας το πλήκτρο Escape.

	append(Arxio.resetButtonDOM = $('<button>').
	text('Reset').
	attr('type', 'reset').
	addClass('formaButton').
	on('click', function(e) {
		Arxio.anazitisiReset();
		return false;
	})).

	// Το πλήκτρο "Clear" καθαρίζει τα αποτελέσματα που υπάρχουν ήδη στη ΣΕΑΠ και
	// διαγράφει τα κριτήρια αναζήτησης.

	append(Arxio.resetButtonDOM = $('<button>').
	text('Clear').
	addClass('formaButton').
	on('click', function(e) {
		Arxio.anazitisiReset(true);
		return false;
	})).

	// Το πλήκτρο "Περισσότερα…" ζητά από τον server την επόμενη ομάδα αποτελεσμάτων
	// για την τρέχουσα αναζήτηση.

	append(Arxio.moreButtonDOM = $('<button>').
	text('Περισσότερα…').
	addClass('formaButton').
	on('click', function(e) {
		Arxio.skip += Arxio.limit;
		Arxio.zitaData();
		return false;
	})));

	return Arxio;
};

// Η function "zitaData" αποστέλλει query αναζήτησης παρτίδων στον server και διαχειρίζεται
// την απάντηση, η οποία περιέχει τα στοιχεία των επιλεγμένων παρτίδων.

Arxio.zitaData = function() {
	if (!Arxio.processKritiria())
	return;

	Client.fyi.pano('Αναζήτηση παρτίδων. Παρακαλώ περιμένετε…');
	Client.ajaxService('arxio/epilogi.php',
		'pektis=' + Arxio.pektisInputDOM.val().uri(),
		'apo=' + Arxio.apoInputDOM.data('timestamp'), 'eos=' + Arxio.eosInputDOM.data('timestamp'),
		'partida=' + Arxio.partidaInputDOM.val().uri(), 'limit=' + Arxio.limit,
		'skip=' + Arxio.skip).
	done(function(rsp) {
		Client.fyi.pano();
		Arxio.paralaviData(rsp);
	}).
	fail(function(err) {
		Client.ajaxFail('Παρουσιάστηκε σφάλμα κατά την αναζήτηση παρτίδων');
	});
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "anaziisiReset" προετοιμάζει την ΣΕΑΠ για αναζήτηση παρτίδων.
// Αρχικά θέτει κριτήρια αναζήτησης στα διάφορα input πεδία είτε από τυχόν
// επώνυμη χρήση, είτε από τα κριτήρια που δόθηκαν στο URL. Κατόπιν μηδενίζει
// το skip, καθαρίζει το χώρο των αποτελεσμάτων και εστιάζει στο πεδίο του
// παίκτη.
//
// Αν δοθεί true παράμετρος "clear", τότε τα input πεδία καθαρίζουν τελείως,
// αλλιώς τίθενται στις τιμές που προκύπτουν είτε από τυχόν επώνυμη χρήση,
// είτε από τυχόν κριτήρια που δόθηκαν στο URL.

Arxio.anazitisiReset = function(clear) {
	Arxio.
	kritiriaReset(clear).
	skipReset().
	apotelesmataClear().
	pektisFocus();

	return Arxio;
};

// Η function "kritiriaReset" θέτει τιμές στα πεδία της αναζήτησης με βάση
// είτε την επώνυμη χρήση, είτε τα κριτήρια που δόθηκαν στο URL. Αν δοθεί
// παράμετρος "clear", τότε έχουμε πλήρη καθαρισμό των πεδίων.

Arxio.kritiriaReset = function(clear) {
	if (clear)
	$('input').each(function() {
		$(this).val('');
	});

	else
	$('input').each(function() {
		$(this).val($(this).data('url'));
	});

	return Arxio;
};

// Η property "skip" δείχνει το πλήθος των αποτελεσμάτων που πρέπει να αγνοηθούν
// από τον server και χρησιμοποιείται για την αναζήτηση και παραλαβή των παρτίδων
// σε ομάδες.

Arxio.skipReset = function() {
	Arxio.skip = 0;
	Arxio.moreButtonDOM.prop('disabled', true);
	return Arxio;
};

Arxio.apotelesmataClear = function() {
	Arxio.apotelesmataDOM.empty();
	return Arxio;
};

Arxio.pektisFocus = function() {
	Arxio.pektisInputDOM.focus();
	return Arxio;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "paralaviData" καλείται κατά την επιστροφή των αποτελεσμάτων,
// και σκοπό έχει τη διαχείριση των αποτελεσμάτων αυτών.

Arxio.paralaviData = function(data) {
	var tlist;

	try {
		tlist = ('[' + data + ']').evalAsfales();
	} catch (e) {
		console.error(data);
		Client.fyi.epano('Επεστράφησαν ακαθόριστα δεδομένα');
		Client.sound.beep();
		return Arxio;
	}

	Arxio.moreButtonDOM.prop('disabled', tlist.length < Arxio.limit);
	Globals.awalk(tlist, Arxio.trapeziProcess);

	if ((Arxio.skip === 0) && (tlist.length === 1))
	$('.trapeziData').trigger('click');

	return Arxio;
};

// Τα αποτελέσματα παραλαμβάνονται σε «οικονομική» μορφή, δηλαδή
// τα ονόματα των properties του τραπεζιού είναι συντομογραφικά.
// Η λίστα "trapeziEcoMap" αντιστοιχεί τα οικονομικά ονόματα τών
// properties τού τραπεζιού στα πραγαμτικά τους ονόματα.

Arxio.trapeziEcoMap = {
	k: 'kodikos',
	s: 'stisimo',
	p1: 'pektis1',
	p2: 'pektis2',
	p3: 'pektis3',
	a: 'arxio',
	d: 'dianomiArray',
};

// Η function "trapeziProcess" διαχειρίζεται κάθε ένα από τα στοιχεία της
// λίστας τραπεζιών που επεστράφησαν από τον server.

Arxio.trapeziProcess = function(i, trapeziEco) {
	var trapezi, prop, ts;

	// Δημιουργούμε αντίγραφο του προς επεξεργασία στοιχείου στο οποίο
	// εμπεριέχονται τα πραγματικά properties του σχετικού τραπεζιού
	// έναντι των οικονομικών τοιαύτων.

	trapezi = new Trapezi();

	for (prop in Arxio.trapeziEcoMap)
	trapezi[Arxio.trapeziEcoMap[prop]] = trapeziEco[prop];

	// Μεταφέρουμε με το χέρι τις παραμέτρους του τραπεζιού.

	for (prop in trapeziEco.t)
	trapezi.trparam[prop] = trapeziEco.t[prop];

	Globals.awalk(trapezi.dianomiArray, function(i, dianomi) {
		dianomi = Arxio.dianomiProcess(dianomi);
		trapezi.dianomiArray[i] = dianomi;
		trapezi.trapeziDianomiSet(dianomi);
	});

	ts = parseInt(trapezi.stisimo);
	if (ts) trapezi.stisimo = ts + Client.timeDif;

	ts = parseInt(trapezi.arxio);
	if (ts) trapezi.arxio = ts + Client.timeDif;

	// Δημιουργούμε το τραπέζι ως αντικείμενο και προβαίνουμε στην
	// επεξεργασία και στην παρουσίαση αυτού του τραπεζιού.

	trapezi.
	trapeziArxioKapikia().
	trapeziArxioDisplay();

	return Arxio;
};

// Τα αποτελέσματα παραλαμβάνονται σε «οικονομική» μορφή, δηλαδή
// τα ονόματα των properties της ενέργειας είναι συντομογραφικά.
// Η λίστα "energiaEcoMap" αντιστοιχεί τα οικονομικά ονόματα τών
// properties τής ενέργειας στα πραγαμτικά τους ονόματα.

Arxio.energiaEcoMap = {
	k: 'kodikos',
	p: 'pektis',
	t: 'pote',
	i: 'idos',
	d: 'data',
};

// Η function "energiaProcess" διαχειρίζεται κάθε ένα από τα στοιχεία της
// λίστας ενεργειών που επεστράφησαν από τον server.

Arxio.energiaProcess = function(energiaEco) {
	var energia, prop, ts;

	// Δημιουργούμε αντίγραφο του προς επεξεργασία στοιχείου στο οποίο
	// εμπεριέχονται τα πραγματικά properties της σχετικής ενέργειας
	// έναντι των οικονομικών τοιαύτων.

	energia = new Energia();
	for (prop in Arxio.energiaEcoMap) {
		energia[Arxio.energiaEcoMap[prop]] = energiaEco[prop];
	}

	ts = parseInt(energia.pote);
	if (ts) energia.pote = ts + Client.timeDif;

	return energia;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Τα αποτελέσματα παραλαμβάνονται σε «οικονομική» μορφή, δηλαδή
// τα ονόματα των properties της διανομής είναι συντομογραφικά.
// Η λίστα "dianomiEcoMap" αντιστοιχεί τα οικονομικά ονόματα τών
// properties τής διανομής στα πραγαμτικά τους ονόματα.

Arxio.dianomiEcoMap = {
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

// Η function "dianomiProcess" διαχειρίζεται κάθε ένα από τα στοιχεία της
// λίστας διανομών που επεστράφησαν από τον server.

Arxio.dianomiProcess = function(dianomiEco) {
	var dianomi, prop, ts;

	// Δημιουργούμε αντίγραφο του προς επεξεργασία στοιχείου στο οποίο
	// εμπεριέχονται τα πραγματικά properties της σχετικής διανομής
	// έναντι των οικονομικών τοιαύτων.

	dianomi = {};

	for (prop in Arxio.dianomiEcoMap)
	dianomi[Arxio.dianomiEcoMap[prop]] = dianomiEco[prop];

	ts = parseInt(dianomi.enarxi);

	if (ts)
	dianomi.enarxi = ts + Client.timeDif;

	return new Dianomi(dianomi).processEnergiaList(dianomiEco['e']);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arxio.processKritiria = function() {
	if (!Arxio.pektisCheck())
	return false;

	if (!Arxio.imerominiaCheck(Arxio.apoInputDOM))
	return false;

	if (!Arxio.imerominiaCheck(Arxio.eosInputDOM))
	return false;

	if (!Arxio.partidaCheck())
	return false;

	return true;
};

Arxio.pektisCheck = function() {
	var pektis;

	pektis = Arxio.pektisInputDOM.val();
	pektis = pektis ? pektis.trim() : '';
	Arxio.pektisInputDOM.val(pektis);

	return true;
};

Arxio.imerominiaCheck = function(input) {
	var val, dmy;

	input.removeClass('inputLathos').data('timestamp', 0);

	val = input.val();
	val = val ? val.trim() : '';
	input.val(val);
	if (val === '')
	return true;

	dmy = val.split(/[^0-9]/);
	if (dmy.length !== 3) {
		Client.sound.beep();
		Client.fyi.epano('Λανθασμένη ημερομηνία αρχής');
		input.addClass('inputLathos').focus();
		return false;
	}

	input.data('timestamp', parseInt(new Date(dmy[2], dmy[1] - 1, dmy[0]).getTime() / 1000));
	return true;
};

Arxio.partidaCheck = function() {
	var partida;

	partida = Arxio.partidaInputDOM.val();
	partida = partida ? partida.trim() : '';
	Arxio.partidaInputDOM.val(partida);
	if (partida === '')
	return true;

	if (partida.match(/^[0-9]+$/))
	return true;

	if (partida.match(/^([0-9]+)-([0-9]+)$/))
	return true;

	if (partida.match(/^[<>]([0-9]+)$/))
	return true;

	if (partida.match(/^-([0-9]+)$/))
	return true;

	if (partida.match(/^([0-9]+)-$/))
	return true;

	Client.sound.beep();
	Client.fyi.epano('Λανθασμένο κριτήριο κωδικού παρτίδας');
	Arxio.partidaInputDOM.addClass('inputLathos').focus();
	return false;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Trapezi.prototype.trapeziArxioKapikia = function() {
	var trapezi = this, kasa;

	kasa = this.trapeziKasaGet();
	this.trapeziThesiWalk(function(thesi) {
		this['kapikia' + thesi] = -kasa * 10;
	});

	kasa *= 30;
	this.trapeziDianomiWalk(function() {
		var dianomi = this;

		// Παράλληλα με το συνολικό ισοζύγιο, υπολογίζω και καταχωρώ
		// το ισοζύγιο σε κάθε διανομή. Τα στοιχεία του ισοζυγίου
		// καταχωρούνται σε λίστα δεικτοδοτημένη με τη θέση του παίκτη.

		this.isozigio = {};
		Prefadoros.thesiWalk(function(thesi) {
			dianomi.isozigio[thesi] = 0;
		});

		Prefadoros.thesiWalk(function(thesi) {
			var k, m, k3;

			k = dianomi.dianomiKasaGet(thesi);
			m = dianomi.dianomiMetritaGet(thesi);
			trapezi['kapikia' + thesi] += k + m;

			// Προχωρούμε στον υπολογισμό του ισοζυγίου διανομής
			// προσθέτοντας αρχικά τα μετρητά στην αντίστοιχη θέση.

			dianomi.isozigio[thesi] += m;

			// Αν η συναλλαγή κάσας στην ανά χείρας θέση είναι μηδενική,
			// δεν προχωρουμε σε περαιτέρω ενέργειες.

			if (!k)
			return;

			// Αφαιρούμε τα καπίκια συναλλαγής με την κάσα στη
			// συνολική κάσα του τραπεζιού.

			kasa -= k;

			// Αφαιρούμε από όλους τους παίκτες το ένα τρίτο της συναλλαγής
			// με την κάσα.

			k3 = parseInt(k / 3);
			Prefadoros.thesiWalk(function(thesi) {
				dianomi.isozigio[thesi] -= k3;
			});

			// Προσθέτουμε τα καπίκια της συναλλαγής με την κάσα στην
			// ανά χείρας θέση, οπότε έχουμε συνολική μεταβολή στο
			// ισοζύγιο της θέσης αυτής κατά τα δύο τρίτα.

			dianomi.isozigio[thesi] += k;
		});

		// Επανυπολογίζουμε το ισοζύγιο διανομής για τον τρίτο παίκτη με
		// βάση το ισοζύγιο των άλλων δύο παικτών.

		this.isozigio[3] = 0 - this.isozigio[1] - this.isozigio[2];
	});

	this.ipolipo = kasa;
	kasa = Math.floor(kasa / 3);

	this['kapikia1'] += kasa;
	this['kapikia2'] += kasa;

	// Επανυπολογίζουμε το ισοζύγιο τραπεζιού για τον τρίτο παίκτη με βάση το
	// ισοζύγιο των άλλων δύο παικτών.

	this['kapikia3'] = 0 - this['kapikia1'] - this['kapikia2'];

	return this;
};

Trapezi.prototype.trapeziArxioDisplay = function() {
	var trapezi = this, kodikos;

	if (this.DOM)
	this.DOM.emtpy();

	else
	Arxio.apotelesmataDOM.append(this.DOM = $('<div>').addClass('trapezi'));

	this.trapeziArxioOptions();

	kodikos = this.trapeziKodikosGet();
	this.DOM.
	data('trapezi', kodikos).
	append($('<div>').addClass('trapeziData').
	attr('title', 'Άνοιγμα διανομών').
	append($('<div>').addClass('trapeziDataContent').
	append($('<div>').addClass('trapeziDataKodikos').
	attr('title', 'Κωδικός τραπεζιού').text(kodikos)).
	append($('<div>').addClass('trapeziDataIpolipo').
	attr('title', 'Υπόλοιπο κάσας').text(this.ipolipo))).
	on('click', function(e) {
		if (trapezi.isAplomenesDianomes())
		trapezi.mazemaDianomon();

		else
		trapezi.aplomaDianomon();

		if (Arxio.movie.isAnikto())
		Arxio.movie.trapeziSet(trapezi);
	}));

	Prefadoros.thesiWalk(function(thesi) {
		var pektis, dom, kapikia, kapikiaKlasi;

		pektis = trapezi.trapeziPektisGet(thesi);
		if (!pektis) pektis = '';
		trapezi.DOM.append(dom = $('<div>').addClass('trapeziPektis').
		append($('<div>').addClass('pektisOnoma').text(pektis)));

		kapikia = parseInt(trapezi['kapikia' + thesi]);
		if (isNaN(kapikia)) kapikia = 0;
		if (!kapikia) kapikia = '&#8203;';

		kapikiaKlasi = 'arxioKapikia';
		if (kapikia < 0) kapikiaKlasi += ' arxioKapikiaMion';

		dom.append($('<div>').addClass(kapikiaKlasi).html(kapikia));
	});

	// Ακολουθούν τα της ημερομηνίας/ώρας αρχειοθέτησης της παρτίδας.

	arxio = trapezi.trapeziArxioGet();

	if (arxio)
	this.DOM.append($('<div>').addClass('trapeziArxio').
	text(Globals.poteOra(trapezi.trapeziStisimoGet())));

	else
	this.DOM.append($('<div>').addClass('trapeziArxio plagia').
	text('Σε εξέλιξη…'));

	return this;
};

Trapezi.prototype.trapeziArxioOptions = function() {
	this.DOM.
	append(this.optsDOM = $('<div>').addClass('trapeziOpts'));

	if (this.trapeziIsPaso()) this.trapeziOptionIcon('Παίζεται το πάσο', 'pasoOn.png');
	if (this.trapeziOxiAsoi()) this.trapeziOptionIcon('Δεν παίζονται οι άσοι', 'asoiOn.png');
	if (this.trapeziTeliomaAnisoropo())
	this.trapeziOptionIcon('Ανισόρροπη πληρωμή τελευταίας αγοράς', 'postel/anisoropo.png');
	else if (this.trapeziTeliomaDikeo())
	this.trapeziOptionIcon('Δίκαιη πληρωμή τελευταίας αγοράς', 'postel/dikeo.png');
	if (this.trapeziIsFiliki()) this.trapeziOptionIcon('Εκπαιδευτική/Φιλική παρτίδα', 'filiki.png');
	if (this.trapeziIsTournoua()) this.trapeziOptionIcon('Τουρνουά', 'tournoua.png');
	if (this.trapeziIsKlisto()) this.trapeziOptionIcon('Κλειστό τραπέζι', 'klisto.png');
	if (this.trapeziIsPrive()) this.trapeziOptionIcon('Πριβέ τραπέζι', 'prive.png');
	if (this.trapeziIsIdioktito()) this.trapeziOptionIcon('Ιδιόκτητο τραπέζι',
		this.trapeziThesiPekti(Client.session.pektis) === 1 ? 'elefthero.png' : 'idioktito.png');
	return this;
};

Trapezi.prototype.trapeziOptionIcon = function(desc, img) {
	this.optsDOM.append($('<img>').addClass('trapeziOption').attr({
		title: desc,
		src: '../ikona/panel/' + img,
	}));
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Όταν κάνουμε κλικ στον κωδικό τραπεζιού, εμφανίζονται οι διανομές της παρτίδας.
// Αυτό γίνεται μέσω της μεθόδου "aplomaDianomon" του τραπεζιού.

Trapezi.prototype.aplomaDianomon = function() {
	var trapezi = this;

	if (!this.dianomiArray.length) {
		Client.fyi.epano('Δεν έχουν παιχτεί διανομές στη συγκεκριμένη παρτίδα!');
		return this;
	}

	Client.fyi.pano();
	Globals.awalk(this.dianomiArray, function(i, dianomi) {
		dianomi.arxioDianomiDisplay(trapezi);
	});

	this.DOM.
	append($('<div>').addClass('dianomiKlisimo').
	append($('<img>').addClass('dianomiKlisimoIcon').
	attr('src', '../ikona/misc/mazemaPano.png')).
	attr('title', 'Μάζεμα διανομών').
	on('click', function(e) {
		trapezi.mazemaDianomon();
	})).
	find('.trapeziData').attr('title', 'Μάζεμα διανομών');

	this.dianomesAplomenesSet(true);
	return this;
}

// Με την μέθοδο "mazemaDianomon" κάνουμε το αντίθετο, δηλαδή αποκρύπτουμε τις διανομές
// της παρτίδας. Για την ακρίβεια, δεν αποκρύπτουμε απλώς τα σχετικά DOM elements, αλλά
// τα διαγράφουμε από το DOM.

Trapezi.prototype.mazemaDianomon = function() {
	this.DOM.find('.dianomi,.dianomiKlisimo').remove();
	this.DOM.find('.trapeziData').attr('title', 'Άνοιγμα διανομών');
	this.dianomesAplomenesSet(false);
	return this;
}

Trapezi.prototype.dianomesAplomenesSet = function(aplomenes) {
	if (aplomenes === undefined)
	aplomenes = true;

	this.dianomesAplomenes = aplomenes;
	return this;
};

Trapezi.prototype.isAplomenesDianomes = function() {
	return this.dianomesAplomenes;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Dianomi.prototype.processEnergiaList = function(elist) {
	var dianomi = this;

	Globals.awalk(elist, function(i, energiaEco) {
		var energia;

		energia = Arxio.energiaProcess(energiaEco);
		dianomi.dianomiEnergiaSet(energia);
		dianomi.energiaArray[i] = energia;
	});

	return this;
};

// Η μέθοδος "arxioDianomiDisplay" εμφανίζει τα στοιχεία της διανομής, ήτοι
// την αγορά, τις συμμετοχές, τις μπάζες των αμυνομένων και τα καπίκια που
// κέρδισε ή ζημιώθηκε ο κάθε παίκτης στη συγκεκριμένη διανομή. Ως παράμετρο
// περνάμε το τραπέζι.

Dianomi.prototype.arxioDianomiDisplay = function(trapezi) {
	var dianomi = this, kodikos, tzogadoros;

	// Αποσπούμε τον κωδικό διανομής και κάνουμε replay την παρτίδα μέχρι
	// ΚΑΙ την ανά χείρας διανομή.

	kodikos = this.dianomiKodikosGet();
	trapezi.partidaReplay({eoske: kodikos});

	// Προσαρτούμε στο DOM element του τραπεζιού το DOM element της ανά
	// χείρας διανομής. Ξεκινάμε το «γέμισμα» του συγκεκριμένου DOM
	// element με την ταυτότητα της διανομής.

	trapezi.DOM.
	append(this.DOM = $('<div>').addClass('dianomi').
	append($('<div>').addClass('dianomiData').
	append($('<div>').addClass('dianomiDataContent').
	append($('<div>').addClass('dianomiKodikos').text(kodikos))).
	on('click', function(e) {
		// Αν κάνουμε κλικ στον κωδικό διανομής, ενεργοποιούμε
		// τη σελίδα αναψηλάφησης με την ανά χείρας διανομή.

		Arxio.movie.trapezi = trapezi;
		Arxio.movie.dianomiSet(dianomi);
	})));

	// Δημιουργούμε τα DOM elements για κάθε παίκτη.

	this.pektisDOM = {};
	Prefadoros.thesiWalk(function(thesi) {
		dianomi.DOM.
		append(dianomi.pektisDOM[thesi] = $('<div>').addClass('trapeziPektis dianomiPektis'));
	});

	// Εμφανίζουμε ενδεικτικό εικονίδιο στον dealer της διανομής.

	this.pektisDOM[dianomi.dianomiDealerGet()].
	append($('<img>').addClass('dealerIcon').attr({
		src: '../ikona/endixi/dealer.png',
		title: 'Dealer',
	}));

	// Ακολουθούν τα υπόλοιπα στοιχεία της διανομής που αφορούν στην αγορά,
	// στις συμμετοχές, στις μπάζες κλπ.

	tzogadoros = trapezi.partidaTzogadorosGet();
	Prefadoros.thesiWalk(function(thesi) {
		// Εφόσον υπάρχει τζογαδόρος, εμφανίζουμε στην περιοχή του
		// την αγορά.

		if (thesi === tzogadoros)
		dianomi.
		arxioAgoraDisplay(thesi, trapezi);

		// Στους υπόλοιπους παίκτες εμφανίζουμε τα σχετικά με τη
		// συμμετοχή τους στην άμυνα και τις μπάζες που έκαναν.

		else
		dianomi.
		arxioSimetoxiDisplay(thesi, trapezi).
		arxioBazesDisplay(thesi, trapezi);

		dianomi.

		// Εμφανίζουμε τα καπίκια που κέρδισε ή ζημιώθηκε ο κάθε
		// παίκτης.

		arxioKapikiaDisplay(thesi).

		// Εμφανίζουμε το login name του παίκτη με πολύ χαμηλή opacity.

		arxioOnomaDisplay(thesi, trapezi);
	});

	// Ακολουθούν τα σχετικά με το «μέσα» τζογαδόρου ή αμυνομένων.

	this.arxioMesaDisplay(trapezi);

	// Ακολουθούν τα του χρόνου τέλους της διανομής.

	this.arxioEnarxiDisplay();

	return this;
};

Dianomi.prototype.arxioAgoraDisplay = function(thesi, trapezi) {
	var agora, dom;

	agora = trapezi.partidaAgoraGet();
	if (!agora)
	return this;

	dom = $('<div>').addClass('agora').
	attr('title', 'Αγορά: ' + agora.dilosiLektiko());
	dom.append($('<div>').addClass('agoraBazes').text(agora.dilosiBazesGet()));
	dom.append($('<img>').addClass('agoraXroma').
	attr('src', '../ikona/trapoula/xroma' + agora.dilosiXromaGet() + '.png'));

	if (agora.dilosiIsAsoi())
	dom.
	append($('<div>').addClass('tsoxaDilosiAsoi').
	append($('<img>').addClass('tsoxaDilosiAsoiIcon').
	attr('src', '../ikona/panel/asoiOn.png')));

	this.pektisDOM[thesi].
	attr('title', 'Αγοραστής').
	append(dom);

	return this;
};

Dianomi.prototype.arxioSimetoxiDisplay = function(thesi, trapezi) {
	if (!trapezi.sdilosi)
	return this;

	if (!trapezi.sdilosi[thesi])
	return this;

	if (trapezi.sdilosi[thesi].simetoxiIsMazi())
	this.pektisDOM[thesi].append($('<img>').addClass('simetoxiIcon').
	attr('src', '../ikona/endixi/mazi.png')).
	attr('title', 'Πάμε μαζί!');

	else if (trapezi.sdilosi[thesi].simetoxiIsPaso())
	this.pektisDOM[thesi].addClass('apoxi').attr('title', 'Αποχή');

	else if (trapezi.sdilosi[thesi].simetoxiIsVoithao())
	this.pektisDOM[thesi].append($('<img>').addClass('simetoxiIcon')).
	attr('title', 'Βοηθητικός');

	return this;
};

Arxio.bazaPlati = [
	'B', 'B', 'B',
	'R', 'R', 'R',
	'B', 'B', 'B',
	'R',
];

Dianomi.prototype.arxioBazesDisplay = function(thesi, trapezi) {
	var bazes, dom;

	bazes = trapezi.partidaBazesGet(thesi);
	if (!bazes)
	return this;

	dom = $('<div>').addClass('bazes').attr('title', 'Μπάζες');
	while (bazes-- > 0) {
		dom.prepend($('<img>').addClass('bazaIcon').
		attr('src', '../ikona/trapoula/' + Arxio.bazaPlati[bazes] + 'L.png'));
	}

	this.pektisDOM[thesi].
	append(dom);

	return this;
};

Dianomi.prototype.arxioKapikiaDisplay = function(thesi) {
	var kapikia, klasi;

	kapikia = this.isozigio[thesi];
	if (!kapikia)
	return this;

	klasi = 'arxioKapikia';
	if (kapikia < 0)
	klasi += ' arxioKapikiaMion';

	this.pektisDOM[thesi].
	append($('<div>').addClass(klasi).html(kapikia));

	return this;
};

Dianomi.prototype.arxioOnomaDisplay = function(thesi, trapezi) {
	var pektis;

	pektis = trapezi.trapeziPektisGet(thesi);
	if (!pektis)
	return this;

	this.pektisDOM[thesi].
	append($('<div>').addClass('pektisOnoma dianomiPektisOnoma').text(pektis));

	return this;
};

Dianomi.prototype.arxioMesaDisplay = function(trapezi) {
	var agora, tzogadoros, agoraBazes, dif, protos, defteros,
		protosPrepi, defterosPrepi, protosBazes, defterosBazes;

	agora = trapezi.partidaAgoraGet();
	if (!agora)
	return this;

	tzogadoros = trapezi.partidaTzogadorosGet();
	if (!tzogadoros)
	return this;

	// θα ελέγξουμε πρώτα τις δηλώσεις συμμετοχής των αμυνομένων. Αν δεν
	// υπάρχουν δηλώσεις, δεν προχωρούμε σε περαιτέρω ενέργειες.

	if (!trapezi.sdilosi)
	return this;

	// Εντοπίζουμε τις θέσεις των αμυνομένων παικτών. Ονομάζουμε «πρώτο»
	// τον αμυνόμενο που παίζει μετά τον τζογαδόρο και «δεύτερο» τον έτερο
	// αμυνόμενο. Ο πρώτος έχει λίγο περισσότερες υποχρεώσεις από τον δεύτερο,
	// αν όμως πει πάσο, ο επόμενος αμυνόμενος καθίσταται πρώτος.

	protos = tzogadoros.epomeniThesi();
	if (!trapezi.sdilosi[protos])
	return this;

	defteros = protos.epomeniThesi();
	if (!trapezi.sdilosi[defteros])
	return this;

	// Αν και οι δύο αμυνόμενοι απείχαν, τότε δεν μπαίνει θέμα
	// μέσα για κανέναν.

	if (trapezi.sdilosi[protos].simetoxiIsPaso() &&
	trapezi.sdilosi[defteros].simetoxiIsPaso())
	return this;

	// Ένας τουλάχιστον αμυνόμενος συμμετείχε στην εκτέλεση του συμβολαίου,
	// επομένως προχωρούμε στην καταμέτρηση των μπαζών.

	agoraBazes = agora.dilosiBazesGet();
	dif = agoraBazes - trapezi.partidaBazesGet(tzogadoros);

	// Αν ο τζογαδόρος πήρε ακριβώς τις μπάζες του, τότε δεν μπαίνει θέμα
	// μέσα αγοράς ούτε για τον τζογαδόρο, ούτε για τους αμυνομένους.

	if (dif === 0)
	return this;

	// Αν ο τζογαδόρος μπήκε μια μέσα εφαρμόζουμε τον κατάλληλο χρωματισμό
	// και επιστρέφουμε καθώς οι αμυνόμενοι δεν μπορούν να είναι μέσα.

	if (dif === 1) {
		this.pektisDOM[tzogadoros].addClass('mesaMia');
		return this;
	}

	// Αν ο τζογαδόρος μπήκε σόλο μέσα εφαρμόζουμε τον κατάλληλο χρωματισμό
	// και επιστρέφουμε καθώς οι αμυνόμενοι δεν μπορούν να είναι μέσα.

	if (dif > 1) {
		this.pektisDOM[tzogadoros].addClass('mesaSolo');
		return this;
	}

	// Υπολογίζουμε τις μπάζες που αναλογούν στους δύο αμυνομένους.

	switch (agoraBazes) {
	case 6:
		protosPrepi = 2;
		defterosPrepi = 2;
		break;
	case 7:
		protosPrepi = 2;
		defterosPrepi = 1;
		break;
	case 8:
		protosPrepi = 1;
		defterosPrepi = 1;
		break;
	case 9:
		protosPrepi = 1;
		defterosPrepi = 0;
		break;
	default:
		return this;
	}

	if (trapezi.sdilosi[protos].simetoxiIsPaso()) {
		this.arxioAminomenosMesaDisplay(defteros, protosPrepi, trapezi.partidaBazesGet(defteros));
		return this;
	}

	if (trapezi.sdilosi[defteros].simetoxiIsPaso()) {
		this.arxioAminomenosMesaDisplay(protos, protosPrepi, trapezi.partidaBazesGet(protos));
		return this;
	}

	if (trapezi.sdilosi[protos].simetoxiIsMazi()) {
		this.arxioAminomenosMesaDisplay(protos, protosPrepi + defterosPrepi,
			trapezi.partidaBazesGet(protos) + trapezi.partidaBazesGet(defteros));
		return this;
	}

	if (trapezi.sdilosi[defteros].simetoxiIsMazi()) {
		this.arxioAminomenosMesaDisplay(defteros, protosPrepi + defterosPrepi,
			trapezi.partidaBazesGet(protos) + trapezi.partidaBazesGet(defteros));
		return this;
	}

	// Φτάσαμε στην περίπτωση όπου έχουν παίξει και οι δύο αμυνόμενοι.
	// Ελέγχουμε τυχόν πλεόνασμα στις μπάζες καθενός αμυνομένου και
	// εφόσον υπάρχει το μεταφέρουμε στον έτερο αμυνόμενο, προκειμένου
	// να απλοποιήσουμε τους ελέγχους.

	protosBazes = trapezi.partidaBazesGet(protos);
	defterosBazes = trapezi.partidaBazesGet(defteros);

	dif = protosBazes - protosPrepi;
	if (dif > 0) {
		protosBazes -= dif;
		defterosBazes += dif;
	}

	dif = defterosBazes - defterosPrepi;
	if (dif > 0) {
		defterosBazes -= dif;
		protosBazes += dif;
	}

	this.arxioAminomenosMesaDisplay(protos, protosPrepi, protosBazes);
	this.arxioAminomenosMesaDisplay(defteros, defterosPrepi, defterosBazes);

	return this;
};

Dianomi.prototype.arxioAminomenosMesaDisplay = function(thesi, prepi, bazes) {
	var dif = prepi - bazes;

	if (dif === 0)
	return this;

	if (dif === 1)
	this.pektisDOM[thesi].addClass('mesaMia');

	else if (dif > 1)
	this.pektisDOM[thesi].addClass('mesaSolo');

	return this;
};

Dianomi.prototype.arxioEnarxiDisplay = function() {
	var enarxi = this.dianomiEnarxiGet();

	if (enarxi)
	this.DOM.append($('<div>').addClass('trapeziArxio').text(Globals.poteOra(enarxi)));

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arxio.movie = {
	win: null,
};

Arxio.movie.dianomiSet = function(dianomi) {
	var movie, dianomiKodikos, url, top, left;

	dianomiKodikos = dianomi.dianomiKodikosGet();

	// Αν η σελίδα αναψηλάφησης παρτίδας (ΣΑΠ) είναι ανοικτή, επιχειρούμε
	// να αλλάξουμε την τρέχουσα διανομή στη ΣΑΠ.

	if (Arxio.movie.isAnikto()) {
		movie = Arxio.movie.win.Movie;
		movie.trapezi = Arxio.movie.trapezi;
		movie.dianomiURL = dianomiKodikos;
		movie.displayTrapezi();
	}

	// Η σελίδα αναψηλάφησης παρτίδας δεν φαίνεται να είναι ανοικτή, επομένως
	// την ανοίγουμε τώρα.

	else {

		top = window.screenY + 100;
		left = window.screenX + 200;
		url = '../movie?dianomi=' + dianomiKodikos;
		Arxio.movie.win = window.open(url, 'movie', 'height=800,width=1200,top=' + top + ',left=' + left);
	}

	Arxio.movie.win.focus();
};

Arxio.movie.trapeziSet = function(trapezi) {
	var movie;

	// Αν η σελίδα αναψηλάφησης παρτίδας (ΣΑΠ) είναι ανοικτή, επιχειρούμε
	// να αλλάξουμε το εκεί τρέχον τραπέζι.

	if (Arxio.movie.isAnikto()) {
		movie = Arxio.movie.win.Movie;
		movie.trapezi = trapezi;
		movie.displayTrapezi();
	}
};

Arxio.movie.klisimo = function() {
	if (!Arxio.movie.win)
	return Arxio;

	Arxio.movie.win.close();
	Arxio.movie.win = null;

	return Arxio;
};

Arxio.movie.isAnikto = function() {
	if (Arxio.movie.win)
	return true;

	return false;
};

Arxio.movie.isKlisto = function() {
	return !Arxio.movie.isAnikto();
};
