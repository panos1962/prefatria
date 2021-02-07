/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ER -- Πρόβλημα
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	error		Περιγραφή του προβλήματος.

Skiniko.prototype.processKinisiAnteER = function(data) {
	if (Arena.ego.oxiTrapezi(data.trapezi))
	return this;

	data.error = data.error.
	replace(/#B/g, '<span class="entona ble">').
	replace(/#b/g, '</span>');

	Client.fyi.epano(data.error, 10000);
	Client.sound.play('notice.ogg');

	return this;
};

// SN -- Νέα συνεδρία
//
// Δεδομένα
//
//	sinedria	Είναι αντικείμενο που περιέχει τα στοιχεία της προς
//			ένταξιν συνεδρίας.

Skiniko.prototype.processKinisiAnteSN = function(data) {
	var sinedria;

	sinedria = this.skinikoSinedriaGet(data.sinedria.pektis);
	if (!sinedria) return this;

	// Αποσύρουμε τυχόν DOM elements της συνεδρίας από τις περιοχές των νεοφερμένων,
	// των περιφερομένων και των θεατών καφενείου και τσόχας.

	sinedria.
	sinedriaDetachNiofertosDOM().
	sinedriaDetachRebelosDOM().
	sinedriaDetachTheatisDOM();

	return this;
};

Skiniko.prototype.processKinisiPostSN = function(data) {
	var sinedria, thesi;

	sinedria = this.skinikoSinedriaGet(data.sinedria.pektis);
	if (!sinedria) return this;

	if (Arena.ego.isFilos(data.sinedria.pektis))
	Arena.ixosFilos();

	sinedria.sinedriaCreateDOM();
	this.pektisEntopismosDOM(data.sinedria.pektis);
	Arena.anazitisi.pektisCheck(data.sinedria.pektis, sinedria);
	Arena.anazitisi.pektisRefreshDOM();

	if (Arena.ego.oxiTrapezi())
	return this;

	// Ο παίκτης μόλις έχει εισέλθει στο καφενείο, επομένως η μόνη περίπτωση
	// να επηρεάζει την τσόχα μας είναι να κατέχει θέση παίκτη σ' αυτήν.

	thesi = Arena.ego.trapezi.trapeziThesiPekti(data.sinedria.pektis);
	if (!thesi) return this;

	// Διαπιστώσαμε ότι ο νεοεισερχόμενος παίκτης κατέχει θέση παίκτη στην
	// τσόχα μας.

	Arena.partida.pektisRefreshDOM(thesi);
	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// NS -- Διαγραφή συνεδρίας
//
// Δεδομένα
//
//	login		Είναι το login name του παίκτη τής προς διαγραφήν συνεδρίας.

Skiniko.prototype.processKinisiAnteNS = function(data) {
	var sinedria;

	sinedria = this.skinikoSinedriaGet(data.login);
	if (!sinedria) return this;

	sinedria.
	sinedriaDetachNiofertosDOM().
	sinedriaDetachRebelosDOM().
	sinedriaDetachTheatisDOM();

	return this;
};

Skiniko.prototype.processKinisiPostNS = function(data) {
	var thesi;

	this.pektisEntopismosDOM(data.login);
	Arena.anazitisi.pektisCheck(data.login, null);
	Arena.anazitisi.pektisRefreshDOM();

	if (Arena.ego.oxiTrapezi())
	return this;

	// Ελέγχω αν ο εξελθών παίκτης κατέχει θέση παίκτη στην
	// τσόχα μας.

	thesi = Arena.ego.trapezi.trapeziThesiPekti(data.login);
	if (!thesi) return this;

	// Ο εξελθών παίκτης κατέχει θέση παίκτη στην τσόχα μας.

	Arena.partida.pektisRefreshDOM(thesi);
	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SL -- Χαιρετισμός / Ανανέωση συνεδρίας
//
// Δεδομένα
//
//	login		Είναι το login name του παίκτη που εισέρχεται στο καφενείο.

Skiniko.prototype.processKinisiPostSL = function(data) {
	var sinedria, thesi, jql;

	sinedria = this.skinikoSinedriaGet(data.login);
	if (!sinedria) return this;

	// Θα μαζέψουμε όλα τα κουτάκια του παίκτη.

	jql = $();

	// Ξεκινάμε με τυχόν εμφάνιση του παίκτη στους περιφερόμενους.

	if (sinedria.hasOwnProperty('rebelosDOM'))
	jql = jql.add(sinedria.rebelosDOM);

	// Συνεχίζουμε με όλες τις εμφανίσεις του παίκτη ως παίκτη σε
	// διάφορα τραπέζια του καφενείου.

	this.skinikoThesiWalk(function(thesi) {
		if (this.trapeziPektisGet(thesi) == data.login)
		jql = jql.add(this.thesiDOM[thesi]);
	});

	// Συνεχίζουμε με τυχόν εμφανίσεις του παίκτη ως θεατή σε τραπέζια
	// του καφενείου.

	if (sinedria.hasOwnProperty('theatisDOM'))
	jql = jql.add(sinedria.theatisDOM);

	// Συνεχίζουμε με τυχόν εμφανίσεις του παίκτη ως νεοφερμένου στην
	// περιοχή της παρτίδας.

	if (sinedria.hasOwnProperty('niofertosDOM'))
	jql = jql.add(sinedria.niofertosDOM);

	// Συνεχίζουμε με τυχόν εμφανίσεις του παίκτη ως παίκτη στην τσόχα,
	// στην περιοχή της παρτίδας.

	if (Arena.ego.isTrapezi()) {
		thesi = Arena.ego.trapezi.trapeziThesiPekti(data.login);
		if (thesi) jql = jql.add(Arena.partida['pektis' + thesi + 'DOM'].find('.tsoxaPektisMain'));
	}

	// Συνεχίζουμε με τυχόν εμφανίσεις του παίκτη ως θεατή στην τσόχα,
	// στην περιοχή της παρτίδας.

	if (sinedria.hasOwnProperty('tsoxaTheatisDOM'))
	jql = jql.add(sinedria.tsoxaTheatisDOM);

	// Σε όλα τα κουτάκια που αφορούν τον παίκτη εφαρμόζουμε μέθοδο που
	// θα κάνει εμφανή την ανανέωση της συνεδρίας του παίκτη.

	jql.sinedriaSalute();
	return this;
};

// Η jQuery μέθοδος "salute" εφαρμόζεται σε κουτάκια παίκτη και σκοπό έχει να κάνει
// εμφανή την ανανέωση της συνεδρίας αλλάζοντας για λίγο το χρώμα του border.

jQuery.fn.sinedriaSalute = function() {
	return this.each(function() {
		var borderColor;

		borderColor = $(this).css('borderColor');
		if (!borderColor) return;

		$(this).finish().css('borderColor', '#FF9900').animate({
			borderColor: borderColor,
		}, 1000, function() {
			// Πρέπει να αφαιρεθεί το border color, αλλιώς επικρατεί λόγω
			// στιλ και δεν φαίνονται τυχόν επόμενες αλλαγές από κλάσεις.

			$(this).css('borderColor', '');
		});
	});
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// TR -- Νέο τραπέζι
//
// Δεδομένα
//
//	trapezi		Τα στοιχεία του τραπεζιού (object).
//
// Επιπρόσθετα δεδομένα
//
//	trapeziPrin	Προηγούμενο τραπέζι παίκτη (object).

Skiniko.prototype.processKinisiAnteTR = function(data) {
	var sinedria;

	sinedria = this.skinikoSinedriaGet(data.trapezi.pektis1);
	if (!sinedria) return this;

	sinedria.
	sinedriaDetachRebelosDOM().
	sinedriaDetachTheatisDOM();

	// Παράγουμε ήχο μόνο στην περίπτωση που το τραπέζι δημιουργήθηκε
	// από άλλον παίκτη και όχι από εμάς, καθώς όταν είμαστε εμείς που
	// δημιουργούμε το τραπέζι παραλαμβάνουμε και πρόσκληση η οποία θα
	// δημιουργήσει παρόμοιο ηχητικό σήμα.

	if (data.trapezi.pektis1.oxiEgo())
	Client.sound.pop();

	data.trapeziPrin = this.skinikoTrapeziGet(sinedria.sinedriaTrapeziGet());
	return this;
};

Skiniko.prototype.processKinisiPostTR = function(data) {
	var trapezi, pektis, thesi;

	if (data.trapeziPrin) {
		data.trapeziPrin.
		trapeziSimetoxiRefreshDOM().
		trapeziDataRefreshDOM();
	}

	trapezi = this.skinikoTrapeziGet(data.trapezi.kodikos);
	if (!trapezi) return this;

	trapezi.trapeziCreateDOM();
	pektis = data.trapezi.pektis1;
	this.pektisEntopismosDOM(pektis);
	Arena.anazitisi.pektisCheck(pektis);
	Arena.anazitisi.pektisRefreshDOM();

	if (pektis.isEgo()) {
		Arena.
		panelRefresh().
		//kafenioScrollTop().
		kitapi.klisimo();

		if (Arena.ego.isTrapezi())
		Arena.partida.refreshDOM();
		return this;
	}

	if (Arena.ego.oxiTrapezi())
	return this;

	// Αν ο δημιουργός μετείχε ως θεατής στην τσόχα μας, έχουν γίνει
	// ήδη όλες οι απαραίτητες ενέργειες στο ante. Μας ενδιαφέρει
	// μόνο η περίπτωση κατά την οποία συμμετέχει ως παίκτης στην
	// τσόχα μας.

	thesi = Arena.ego.trapezi.trapeziThesiPekti(pektis);
	if (thesi) Arena.partida.pektisDataRefreshDOM(thesi);

	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ET -- Επιλογή τραπεζιού
//
// Δεδομένα
//
//	pektis		Login name παίκτη.
//	trapezi		Κωδικός τραπεζιού.
//
// Επιπρόσθετα δεδομένα
//
//	trapeziPrin	Προηγούμενο τραπέζι παίκτη (object).
//	thesiPektiPrin	Θέση του παίκτη στο προηγούμενο τραπέζι εφόσον ήταν παίκτης.
//	telefteos	Λίστα καθημένων στο τραπέζι επιλογής.

Skiniko.prototype.processKinisiAnteET = function(data) {
	var sinedria;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria) return this;

	sinedria.
	sinedriaDetachRebelosDOM().
	sinedriaDetachTheatisDOM();

	data.trapeziPrin = this.skinikoTrapeziGet(sinedria.sinedriaTrapeziGet());
	if (data.trapeziPrin) data.thesiPektiPrin = data.trapeziPrin.trapeziThesiPekti(data.pektis);

	return this;
};

Skiniko.prototype.processKinisiPostET = function(data) {
	var sinedria, trapezi, thesi;

	Arena.partida.tzogosDOM.removeData('faneros');

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria) return this;

	Arena.anazitisi.pektisCheck(data.pektis, sinedria);

	// Ενημερώνουμε το χρώμα του τραπεζιού αποχώρησης στο καφενείο,
	// επανεμφανίζουμε την πινακίδα και αν ο παίκτης συμμετείχε ως
	// παίκτης, επανεμφανίζουμε τη θέση την οποία κατείχε.

	if (data.trapeziPrin) {
		if (data.pektis.isEgo()) {
			data.trapeziPrin.
			trapeziSimetoxiRefreshDOM().
			trapeziDataRefreshDOM();
		}

		if (data.thesiPrin) {
			data.trapeziPrin.trapeziThesiRefresDOM(data.thesiPrin);
		}
	}

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) {
		Arena.rebelosDOM.prepend(sinedria.rebelosDOM);
		Arena.anazitisi.pektisRefreshDOM();
		if (data.pektis.isEgo()) Arena.kitapi.klisimo();
		return this;
	}

	// Από τη στιγμή που ο παίκτης έχει επιλέξει τραπέζι, θα πρέπει
	// η θέση του στο τραπέζι να είναι καθορισμένη, είτε συμμετέχει
	// ως παίκτης, είτε παρακολουθεί ως θεατής.

	thesi = sinedria.sinedriaThesiGet();
	if (!thesi) return this;

	// Ενημερώνουμε το χρώμα του τραπεζιού στο καφενείο ανάλογα με το
	// αν ο παίκτης συμμετέχει ως παίκτης, ή παρακολουθεί ως θεατής και
	// επανεμφανίζουμε την πινακίδα ώστε να είναι εμφανές το τρέχον
	// τραπέζι του παίκτη.

	if (data.pektis.isEgo()) {
		trapezi.
		trapeziSimetoxiRefreshDOM().
		trapeziDataRefreshDOM();
		Arena.kitapi.refresh();
	}

	// Αν ο παίκτης παρακολουθεί πλέον ως θεατής σε κάποιο τραπέζι, πρέπει
	// να τον εντάξουμε στο μπλοκ των θεατών, αλλιώς συμμετέχει ως παίκτης
	// και πρέπει να επαναδιαμορφώσουμε τη συγκεκριμένη θέση.

	if (sinedria.sinedriaIsTheatis()) trapezi.theatisDOM.prepend(sinedria.theatisDOM);
	else trapezi.trapeziThesiRefreshDOM(thesi);
	Arena.anazitisi.pektisRefreshDOM();

	// Αν ο χρήστης δεν είναι σε κάποιο τραπέζι δεν χρειάζεται να
	// κάνουμε καμιά περαιτέρω ενέργεια, το DOM του καφενείου έχει
	// ήδη ενημερωθεί.

	if (Arena.ego.oxiTrapezi())
	return this;

	// Αν ο παίκτης που επιλέγει τραπέζι ήταν πριν στο τραπέζι μας
	// ίσως χρειαστεί να αλλάξουμε κάτι στο τραπέζι.

	if (data.trapeziPrin && Arena.ego.isTrapezi(data.trapeziPrin)) {
		// Αν ο παίκτης που επιλέγει τραπέζι ήταν παίκτης στο
		// τραπέζι μας, τότε πρέπει να επανασχεδιάσουμε την
		// περιοχή της συγκεκριμένης θέσης. Αν δεν μετείχε ως
		// παίκτης αλλά ως θεατής, δεν χρειάζονται περαιτέρω
		// ενέργειες.

		if (data.thesiPektiPrin) {
			Arena.partida.pektisRefreshDOM(data.thesiPektiPrin);
			Arena.anazitisi.pektisRefreshDOM();
			Client.sound.blioup();
		}
	}

	// Αν ο παίκτης δεν έχει επιλέξει το δικό μας τραπέζι δεν χρειάζεται
	// να κάνουμε καμία επιπλέον ενέργεια.

	if (Arena.ego.oxiTrapezi(trapezi))
	return this;

	Arena.panelRefresh();

	// Ο παίκτης έχει επιλέξει το δικό μας τραπέζι. Ελέγχουμε πρώτα την
	// περίπτωση να είμαστε εμείς ο παίκτης που επιλέγει τραπέζι.

	if (data.pektis.isEgo()) {
		Arena.partida.refreshDOM(true);
		Arena.anazitisi.pektisRefreshDOM();
		Arena.partidaModeSet();
		return this;
	}

	// Αν ο παίκτης που επιλέγει τραπέζι τοποθετήθηκε ως θεατής στο δικό μας
	// τραπέζι, τότε πρέπει να τον εμφανίσουμε στους θεατές.

	if (sinedria.sinedriaIsTheatis()) {
		Arena.ixosTheatis();
		Arena.partida.theatisPushDOM(sinedria);
		Arena.anazitisi.pektisRefreshDOM();
		return this;
	}

	// Φαίνεται ότι ο παίκτης που επέλεξε τραπέζι τοποθετήθηκε ως παίκτης στο
	// δικό μας τραπέζι.

	Arena.partida.pektisRefreshDOM(thesi);
	Arena.anazitisi.pektisRefreshDOM();
	Arena.kitapi.refresh();
	if (data.telefteos && (!data.telefteos[thesi]))
	Client.sound.doorbell();

	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// RT -- Έξοδος από τραπέζι
//
// Δεδομένα
//
//	pektis		Login name παίκτη.
//
// Επιπρόσθετα δεδομένα
//
//	trapezi		Το τραπέζι (object).
//	thesi		Θέση παίκτη εφόσον παίκτης.

Skiniko.prototype.processKinisiAnteRT = function(data) {
	var sinedria, trapezi;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria) return this;

	sinedria.
	sinedriaDetachRebelosDOM().
	sinedriaDetachTheatisDOM();

	trapezi = sinedria.sinedriaTrapeziGet();
	if (!trapezi) return this;

	trapezi = this.skinikoTrapeziGet(trapezi);
	if (!trapezi) return this;

	data.trapezi = trapezi;
	if (sinedria.sinedriaSimetoxiGet().isPektis())
	data.thesi = sinedria.sinedriaThesiGet();

	return this;
};

Skiniko.prototype.processKinisiPostRT = function(data) {
	var sinedria, trapezi;

	// Αν η έξοδος από το τραπέζι μάς οδηγεί σε άλλο τραπέζι, τότε
	// παραμένουμε στην ίδια ομάδα εργαλείων του control panel, αλλιώς
	// εμφανίζουμε τη βασική ομάδα εργαλείων. Σε κάθε περίπτωση το
	// control panel πρέπει να επαναδιαμορφωθεί.

	if (data.pektis.isEgo())
	Arena.panelRefresh(Arena.ego.isTrapezi() ? null : 1);

	sinedria = this.skinikoSinedriaGet(data.pektis);
	Arena.anazitisi.pektisCheck(data.pektis, sinedria);
	Arena.anazitisi.pektisRefreshDOM();
	if (!sinedria) return this;

	// Επαναδιαμορφώνουμε κάποια στοιχεία του τραπεζιού από το οποίο
	// έγινε έξοδος.

	if (data.trapezi) {
		data.trapezi.
		trapeziSimetoxiRefreshDOM().
		trapeziDataRefreshDOM();

		if (data.thesi) {
			data.trapezi.
			trapeziThesiRefreshDOM(data.thesi);
			if (Arena.ego.isTrapezi(data.trapezi)) {
				Arena.partida.pektisRefreshDOM(data.thesi);
				if (data.pektis.oxiEgo()) Client.sound.blioup();

				// Ο παίκτης δημιούργησε κενή θέση στο τραπέζι,
				// επομένως μπορεί να πρέπει να εμφανιστεί το
				// πλήκτρο παίκτης/θεατής.

				Arena.cpanel.bpanelButtonGet('pektisTheatis').
				pbuttonDisplay();
			}
		}
	}

	// Ελέγχουμε τυχόν νέο τραπέζι στο οποίο τοποθετήθηκε ο παίκτης.

	trapezi = this.skinikoTrapeziGet(sinedria.sinedriaTrapeziGet());
	if (!trapezi) {
		Arena.rebelosDOM.prepend(sinedria.rebelosDOM);
		if (data.pektis.isEgo()) {
			Arena.kitapi.klisimo();
			Arena.partida.refreshDOM();
			Arena.kafenioModeSet();
			Arena.kafenioScrollTop();
		}
		Arena.anazitisi.pektisRefreshDOM();
		return this;
	}

	trapezi.
	trapeziDataRefreshDOM().
	trapeziThesiRefreshDOM(sinedria.sinedriaThesiGet());
	Arena.anazitisi.pektisRefreshDOM();

	if (Arena.ego.isTrapezi(data.trapezi))
	Arena.panelRefresh();

	if (data.pektis.oxiEgo())
	return this;

	Arena.kitapi.refresh();
	this.pektisTrapeziScroll(true);
	Arena.partidaModeSet();
	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// DL -- Πρόσκληση
//
// Δεδομένα
//
//	kodikos		Κωδικός πρόσκλησης.
//
// Πρόσθετα δεδομένα
//
//	pros		Login name προσκεκλημένου.
//	trapezi		Κωδικός τραπεζιού.

Skiniko.prototype.processKinisiAnteDL = function(data) {
	var prosklisi;

	prosklisi = this.skinikoProsklisiGet(data.kodikos);
	if (!prosklisi) return this;

	data.pros = prosklisi.prosklisiProsGet();
	data.trapezi = this.skinikoTrapeziGet(prosklisi.prosklisiTrapeziGet());
	prosklisi.prosklisiDeleteDOM();
	return this;
};

Skiniko.prototype.processKinisiPostDL = function(data) {
	Arena.panelRefresh();

	if (!data.pros) return this;
	if (!data.trapezi) return this;

	data.trapezi.trapeziDataRefreshDOM();
	if (data.pros.oxiEgo()) return this;
	if (Arena.ego.oxiTrapezi(data.trapezi)) return this;

	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// PL -- Πρόσκληση
//
// Δεδομένα
//
//	kodikos		Κωδικός πρόσκλησης.
//	trapezi		Κωδικός τραπεζιού.
//	apo		Login name αποσοτολέα.
//	pros		Login name παραλήπτη.

// Εντοπίζουμε τυχόν προηγούμενη παρόμοια πρόσκληση, δηλαδή πρόσκληση από τον
// ίδιο αποστολέα, προς τον ίδιο παραλήπτη και για το ίδιο τραπέζι. Αν βρεθεί
// τέτοια πρόσκληση τη διαγράφουμε.

Skiniko.prototype.processKinisiAntePL = function(data) {
	var kodikos, prosklisi;

	for (kodikos in this.prosklisi) {
		prosklisi = this.skinikoProsklisiGet(kodikos);
		if (prosklisi.prosklisiTrapeziGet() != data.trapezi) continue;
		if (prosklisi.prosklisiApoGet() != data.apo) continue;
		if (prosklisi.prosklisiProsGet() != data.pros) continue;

		// Η ανά χείρας πρόσκληση είναι παρόμοια με την εισερχόμενη,
		// επομένως τη διαγράφουμε από το DOM.

		prosklisi.prosklisiGetDOM().remove();
	}

	return this;
};

// Η νέα πρόσκληση έχει ενταχθεί στο σκηνικό και το μόνο που μένει είναι να
// την εμφανίσουμε εντάσσοντάς την στο DOM.

Skiniko.prototype.processKinisiPostPL = function(data) {
	var prosklisi, apo, trapezi;

	prosklisi = this.skinikoProsklisiGet(data.kodikos);
	if (!prosklisi) return this;

	apo = prosklisi.prosklisiApoGet();
	if (apo.isEgo()) Client.sound.klak();
	else if (Arena.ego.isFilos(apo)) Client.sound.sfirigma();
	else Client.sound.fiouit();

	Arena.panelRefresh();
	prosklisi.prosklisiCreateDOM();

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	trapezi.trapeziDataRefreshDOM();
	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// AL -- Αποδοχή πρόσκλησης
//
// Δεδομένα
//
//	pektis		Login name προσκεκλημένου.
//	trapezi		Κωδικός τραπεζιού.
//	thesi		Θέση παίκτη/θεατή.
//	simetoxi	Παίκτης ή θεατής.
//
// Επιπρόσθετα δεδομένα
//
//	trapeziPrin	Προηγούμενο τραπέζι παίκτη.
//	oxiPektisPrin	Δείχνει αν πριν τη αποδοχή δεν ήταν παίκτης.
//	telefteos	Λίστα καθημένων πριν την αποδοχή.

Skiniko.prototype.processKinisiAnteAL = function(data) {
	var sinedria, trapezi;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria) return this;

	sinedria.
	sinedriaDetachRebelosDOM().
	sinedriaDetachTheatisDOM();

	data.trapeziPrin = this.skinikoTrapeziGet(sinedria.sinedriaTrapeziGet());
	data.oxiPektisPrin = sinedria.sinedriaOxiPektis();

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	data.telefteos = {};
	trapezi.trapeziThesiWalk(function(thesi) {
		data.telefteos[thesi] = trapezi.trapeziPektisGet(thesi);
	});

	return this;
};

Skiniko.prototype.processKinisiPostAL = function(data) {
	var sinedria, panelOmada;

	this.processKinisiPostET(data);

	// Υπάρχει περίπτωση ο παίκτης που απεδέχθη την πρόσκληση να κατέστη
	// παίκτης στο τραπέζι που είμαστε θεατές και με την κίνησή του αυτή
	// να μην έχει μείνει άλλη κενή θέση στο τραπέζι, επομένως θα πρέπει
	// ενδεχομένως να αποκρυβεί το πλήκτρο παίκτης/θεατής.

	if (Arena.ego.isTrapezi(data.trapezi))
	Arena.cpanel.bpanelButtonGet('pektisTheatis').pbuttonDisplay();

	if (data.pektis.oxiEgo())
	return this;

	// Αν ο παίκτης που αποδέχεται την πρόσκληση δεν ήταν πριν παίκτης στο
	// ίδιο ή σε άλλο τραπέζι, ενώ μετά την αποδοχή έχει καταστεί παίκτης,
	// τότε επαναφέρουμε το control panel στη βασική ομάδα εργαλείων.

	if (data.oxiPektisPrin) {
		sinedria = this.skinikoSinedriaGet(data.pektis);
		if (!sinedria) return this;
		panelOmada = sinedria.sinedriaIsPektis() ? 1 : Arena.cpanel.bpanelOmadaGet();
	}

	// Ξανασχηματίζουμε τώρα το control panel καθώς ο παίκτης που απεδέχθη
	// την πρόσκληση μπορεί να άλλαξε ρόλο, οπότε κάποια πλήκτρα θα πρέπει
	// να ενεργοποιηθούν και κάποια άλλα να ενεργοποιηθούν.

	Arena.panelRefresh(panelOmada);
	this.pektisTrapeziScroll(true);

	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// PT -- Από παίκτης θεατής
//
// Δεδομένα
//
//	pektis		Login name παίκτη.
//	trapezi		Κωδικός τραπεζιού.
//	thesi		Θέση θέασης.

Skiniko.prototype.processKinisiPostPT = function(data) {
	var sinedria, trapezi;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria) return this;

	trapezi = sinedria.sinedriaTrapeziGet();
	if (!trapezi) return this;

	trapezi = this.skinikoTrapeziGet(trapezi);
	if (!trapezi) return this;

	sinedria.
	sinedriaDetachRebelosDOM().
	sinedriaDetachTheatisDOM();

	trapezi.
	trapeziThesiRefreshDOM().
	trapeziSimetoxiRefreshDOM();
	trapezi.theatisDOM.prepend(sinedria.theatisDOM);

	Arena.panelRefresh();
	Arena.anazitisi.pektisCheck(data.pektis, sinedria);
	Arena.anazitisi.pektisRefreshDOM();

	if (Arena.ego.oxiTrapezi(trapezi))
	return this;

	Client.sound.blioup();

	// Εάν είμαστε εμείς που κάνουμε την αλλαγή, τότε επαναδιαμορφώνουμε
	// εκ νέου το DOM της παρτίδας.

	if (data.pektis.isEgo()) {
		Arena.partida.refreshDOM();
		return this;
	}

	Arena.partida.
	pektisRefreshDOM(data.thesi).
	theatisPushDOM(sinedria);

	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// PS -- Παράμετρος παίκτη
//
// Δεδομένα
//
//	pektis		Login name παίκτη.
//	param		Ονομασία παραμέτρου.
//	timi		Τιμή παραμέτρου.

Skiniko.prototype.processKinisiPostPS = function(data) {
	var pektis, proc;

	pektis = this.skinikoPektisGet(data.pektis);
	if (!pektis) return this;

	proc = 'kinisiPostPeparamSet' + data.param;
	if (typeof this[proc] === 'function')
	this[proc](data, pektis);

	return this;
};

Skiniko.prototype.kinisiPostPeparamSetΚΑΤΑΣΤΑΣΗ = function(data, pektis) {
	var jql, sinedria, thesi;

	jql = $();
	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (sinedria) {
		if (sinedria.hasOwnProperty('rebelosDOM')) jql = jql.add(sinedria.rebelosDOM);
		if (sinedria.hasOwnProperty('theatisDOM')) jql = jql.add(sinedria.theatisDOM);
		if (sinedria.hasOwnProperty('niofertosDOM')) jql = jql.add(sinedria.niofertosDOM);
		if (sinedria.hasOwnProperty('tsoxaTheatisDOM')) jql = jql.add(sinedria.tsoxaTheatisDOM);
	}

	this.skinikoThesiWalk(function(thesi) {
		if (this.trapeziPektisGet(thesi) == data.pektis)
		jql = jql.add(this.thesiDOM[thesi]);
	});

	// Αν είμαστε σε κάποιο τραπέζι και ο παίκτης που αλλάζει κατάσταση
	// συμμετέχει ως παίκτης σ' αυτό το τραπέζι, τότε πρέπει να δείξουμε
	// την νέα κατάσταση στην περιοχή τού συγκεκριμένου παίκτη.

	if (Arena.ego.isTrapezi()) {
		thesi = Arena.ego.trapezi.trapeziThesiPekti(data.pektis);
		if (thesi)
		jql = jql.add(Arena.partida['pektis' + Arena.ego.thesiMap(thesi) + 'DOM'].find('.tsoxaPektisMain'));
	}

	// Εφόσον ο παίκτης είναι απασχολημένος, ενημερώνουμε τα χαρακατηριστικά
	// σε όλα τα DOM elements που πρέπει ο παίκτης να φαίνεται απασχολημένος.

	if (pektis.pektisIsApasxolimenos())
	jql.addClass('apasxolimenos');

	// Αλλιώς ο παίκτης κατέστη διαθέσιμος και αφαιρούμε τα χαρακτηριστικά
	// απασχόλησης από τα DOM elements που αφορούν το παίκτη.

	else
	jql.removeClass('apasxolimenos');

	// Αν η αλλαγή κατάστασης δεν αφορά κάποιον άλλον παίκτη, έχουμε τελειώσει.

	if (data.pektis.oxiEgo())
	return;

	// Η αλλαγή κατάστασης αφορά σε μένα, επομένως πρέπει να ενημερώσουμε
	// τα σχετικά πλήκτρα του βασικού control panel.

	Arena.cpanel.diathesimosButton.pbuttonDisplay();
	Arena.cpanel.apasxolimenosButton.pbuttonDisplay();

	// Ενημερώνουμε τα σχετικά πλήκτρα του control panel προσκλήσεων.

	Arena.prosklisi.panel.diathesimosButton.pbuttonDisplay();
	Arena.prosklisi.panel.apasxolimenosButton.pbuttonDisplay();

	return this;
};

Skiniko.prototype.kinisiPostPeparamSetΕΠΙΔΟΤΗΣΗ = function(data, pektis) {
	var jql, sinedria, thesi;

	jql = $();
	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (sinedria) {
		if (sinedria.hasOwnProperty('rebelosDOM')) jql = jql.add(sinedria.rebelosDOM);
		if (sinedria.hasOwnProperty('theatisDOM')) jql = jql.add(sinedria.theatisDOM);
		if (sinedria.hasOwnProperty('niofertosDOM')) jql = jql.add(sinedria.niofertosDOM);
		if (sinedria.hasOwnProperty('tsoxaTheatisDOM')) jql = jql.add(sinedria.tsoxaTheatisDOM);
	}

	this.skinikoThesiWalk(function(thesi) {
		if (this.trapeziPektisGet(thesi) == data.pektis)
		jql = jql.add(this.thesiDOM[thesi]);
	});

	jql.pektisDiakritikaDOM(pektis);

	if (data.pektis.isEgo()) {
		Arena.cpanel.bpanelButtonGet('epidotisiOn').pbuttonDisplay();
		Arena.cpanel.bpanelButtonGet('epidotisiOff').pbuttonDisplay();
	}

	if (Arena.ego.oxiTrapezi())
	return this;

	// Εφόσον είμαι εγώ που αλλάζω καθεστώς επιδότησης και συμμετέχω ως παίκτης
	// στο τραπέζι, πρέπει να ενημερώσω τη σχετική υπενθύμιση στο επάνω μέρος
	// τής τσόχας.

	if (Arena.ego.isPektis())
	Arena.partida.dataPanoRefreshDOM();

	thesi = Arena.ego.trapezi.trapeziThesiPekti(data.pektis);
	if (thesi) Arena.partida.pektisRefreshDOM(thesi);

	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// TS -- Παράμετρος τραπεζιού
//
// Δεδομένα
//
//	pektis		Login name παίκτη.
//	trapezi		Κωδικός τραπεζιού.
//	param		Ονομασία παραμέτρου.
//	timi		Τιμή παραμέτρου.

Skiniko.prototype.processKinisiPostTS = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	trapezi.trapeziRefreshDOM();
	switch (data.param) {
	case 'ΑΟΡΑΤΟ':
		if (trapezi.trapeziIsOrato())
		trapezi.trapeziGetDOM().finish().fadeIn();

		else
		trapezi.trapeziGetDOM().finish().fadeOut();
		break;
	}
	Arena.panelRefresh();

	if (Arena.ego.oxiTrapezi(data.trapezi))
	return this;

	Arena.partida.refreshDOM();

	switch (data.param) {
	case 'ΚΑΣΑ':
		Arena.kitapi.refresh();
		Client.sound.blioup();
		break;
	case 'ΠΡΙΒΕ':
		trapezi.trapeziDataRefreshDOM();
		Client.sound.tic();
		break;
	case 'ΑΟΡΑΤΟ':
		Client.sound.play(trapezi.trapeziIsOrato() ? 'pop.ogg' : 'top.ogg');
		break;
	default:
		Client.sound.tic();
		break;
	}

	Arena.partida.markAlagiPios(trapezi, data);
	return this;
};

Arena.partida.markAlagiIcon = {
	'ΚΑΣΑ':			'kasa.png',
	'ΑΣΟΙ,ΟΧΙ':		'asoiOff.png',
	'ΑΣΟΙ':			'asoiOn.png',
	'ΠΑΣΟ,ΟΧΙ':		'pasoOff.png',
	'ΠΑΣΟ':			'pasoOn.png',
	'ΤΕΛΕΙΩΜΑ,ΑΝΙΣΟΡΡΟΠΟ':	'postel/anisoropo.png',
	'ΤΕΛΕΙΩΜΑ,ΔΙΚΑΙΟ':	'postel/dikeo.png',
	'ΤΕΛΕΙΩΜΑ':		'postel/kanoniko.png',
	'ΠΡΙΒΕ,ΟΧΙ':		'dimosio.png',
	'ΠΡΙΒΕ':		'prive.png',
	'ΑΟΡΑΤΟ,ΟΧΙ':		'orato.png',
	'ΑΟΡΑΤΟ':		'aorato.png',
	'ΦΙΛΙΚΗ,ΟΧΙ':		'agonistiki.png',
	'ΦΙΛΙΚΗ':		'filiki.png',
	'ΤΟΥΡΝΟΥΑ':		'tournoua.png',
	'ΑΝΟΙΚΤΟ,ΟΧΙ':		'klisto.png',
	'ΑΝΟΙΚΤΟ':		'anikto.png',
	'ΙΔΙΟΚΤΗΤΟ,ΟΧΙ':	'elefthero.png',
	'ΙΔΙΟΚΤΗΤΟ':		'idioktito.png',
	'ΔΙΑΤΑΞΗ':		'diataxi.png',
	'ΡΟΛΟΙ':		'roloi.png',
	'ΑΠΟΔΟΧΗ,ΝΑΙ':		'apodoxi.png',
	'ΑΠΟΔΟΧΗ,ΟΧΙ':		'ixodopa.png',
};

// Η function "markAlagiPios" δέχεται το τραπέζι (object) και τα δεδομένα κίνησης
// (list) και κάνει εμφανές το ποιος παίκτης προκάλεσε την αλλαγή κάποιας παραμέτρου
// του τραπεζιού, π.χ. αλλαγή κάσας, αλλαγή καθεστώτος άσων κλπ.
//
// Στην παράμετρο των δεδομένων της αλλαγής (data) ελέγχονται τα εξής στοιχεία:
//
//	thesi		Η θέση του παίκτη που προκάλεσε την αλλαγή.
//	pektis		Το login name του παίκτη που προκάλεσε την αλλαγή.
//	param		Η ονομασία της παραμέτρου που τίθεται, π.χ. "ΑΣΟΙ"
//	timi		Η τιμή της παραμέτρου, π.χ. "ΝΑΙ"
//
// Αν η θέση είναι συμπληρωμένη η παράμετρος "pektis" αγνοείται, αλλιώς υπολογίζεται
// η θέση του παίκτη από το login name του παίκτη.
// Επίσης, σε κάποιες περιπτώσεις δεν πρόκειται ακριβώς για αλλαγή παραμέτρου, αλλά
// για κάποια άλλη σημαντική αλλαγή που εφαρμόζεται στο τραπέζι, π.χ. αλλαγή διάταξης,
// αποδοχή όρων κλπ. Σ' αυτές τις περιπτώσεις περνάμε ως τρίτη παράμετρο μια κωδική
// ονομασία της αλλαγής, όπως "ΔΙΑΤΑΞΗ", "ΡΟΛΟΙ", "ΑΠΟΔΟΧΗ,ΝΑΙ", "ΑΠΟΔΟΧΗ,ΟΧΙ" κλπ.

Arena.partida.markAlagiPios = function(trapezi, data, param) {
	var thesi, idx, icon, iseht, tdom, dom;

	thesi = parseInt(data.thesi);
	if (!thesi) thesi = trapezi.trapeziThesiPekti(data.pektis);
	if (!thesi) return;

	if (param === undefined) param = data.param;
	idx = param + ',' + data.timi;
	icon = Arena.partida.markAlagiIcon[idx];
	if (!icon) icon = Arena.partida.markAlagiIcon[param];
	if (!icon) return;

	iseht = Arena.ego.thesiMap(thesi);
	tdom = Arena.partida['pektisMain' + iseht + 'DOM'];
	tdom.find('.tsoxaPektisOptionIcon').remove();
	tdom.
	append(dom = $('<img>').addClass('tsoxaPektisOptionIcon').attr('src', 'ikona/panel/' + icon));
	dom.finish().delay(2000).fadeOut(600, function() {
		$(this).remove();
	});

	trapezi.tsoxaDOM.find('.trapeziPektisOptionIcon').remove();
	trapezi.tsoxaDOM.
	append(dom = $('<img>').addClass('trapeziPektisOptionIcon trapeziPektisOptionIcon' + thesi).
	attr('src', 'ikona/panel/' + icon));
	dom.finish().delay(2000).fadeOut(600, function() {
		$(this).remove();
	});
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// DX -- Αλλαγή διάταξης παικτών
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	pektis		Login name του παίκτη που κάνει την αλλαγή.
//	h1		Θέση παίκτη.
//	p1		Παίκτης για τη θέση h1.
//	h2		Θέση παίκτη.
//	p2		Παίκτης για τη θέση h2.

Skiniko.prototype.processKinisiPostDX = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	trapezi.trapeziThesiRefreshDOM();
	Arena.panelRefresh();
	if (Arena.ego.oxiTrapezi(data.trapezi)) return this;

	Arena.partida.trapeziRefreshDOM();
	Client.sound.tic();
	Arena.partida.markAlagiPios(trapezi, data, 'ΔΙΑΤΑΞΗ');

	if (Arena.kitapi.isAnikto())
	Arena.kitapi.win.Kitapi.pektisRefreshDOM();

	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// RL -- Κυκλική εναλλαγή παικτών
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	pektis		Login name του παίκτη που κάνει την αλλαγή.
//	p1		Παίκτης για τη θέση 1.
//	a1		Αποδοχή για τη θέση 1.
//	p2		Παίκτης για τη θέση 2.
//	a2		Αποδοχή για τη θέση 2.
//	p3		Παίκτης για τη θέση 3.
//	a3		Αποδοχή για τη θέση 3.

Skiniko.prototype.processKinisiPostRL = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	trapezi.trapeziThesiRefreshDOM();
	Arena.panelRefresh();
	if (Arena.ego.oxiTrapezi(data.trapezi)) return this;

	Arena.partida.trapeziRefreshDOM();
	Client.sound.tic();
	Arena.partida.markAlagiPios(trapezi, data, 'ΡΟΛΟΙ');

	if (Arena.kitapi.isAnikto())
	Arena.kitapi.win.Kitapi.pektisRefreshDOM();

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// TT -- Αλλαγή θέσης θέασης
//
// Δεδομένα
//
//	pektis		Login name θεατή.
//	thesi		Νέα θέση θέασης.

Skiniko.prototype.processKinisiPostTT = function(data) {
	if (Arena.ego.oxiTrapezi()) return this;
	if (data.pektis.oxiEgo()) return this;

	Arena.partida.trapeziRefreshDOM();
	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SZ -- Σχόλιο συζήτησης
//
// Δεδομένα
//
//	kodikos		Κωδικός αριθμός σχολίου.
//	pektis		Login name παίκτη που κάνει το σχόλιο.
//	trapezi		Κωδικός τραπεζιού συζήτησης.
//	sxolio		Το σχόλιο αυτό καθαυτό.

Skiniko.prototype.processKinisiPostSZ = function(data) {
	var sizitisi, pektis;

	// Τα σχόλια συζήτησης που αφορούν στο τραπέζι μεταφέρονται με τα
	// δεδομένα παρτίδας και όχι μέσω κινήσεων.

	if (data.hasOwnProperty('trapezi')) {
		console.error('παρουσιάστηκαν μεταβολές τύπου "SZ" που αφορούν στην παρτίδα');
		return this;
	}

	sizitisi = this.skinikoSizitisiGet(data.kodikos);
	if (!sizitisi) return this;

	pektis = sizitisi.sizitisiPektisGet();
	if (pektis.isEgo()) Arena.sizitisi.proepiskopisiClearDOM();
	else Arena.sizitisi.moliviTelos(pektis);

	sizitisi.sizitisiCreateDOM();
	Arena.sizitisi.scrollKato();
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// AX -- Αποδοχή/Επαναδιαπραγμάτευση όρων
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	thesi		Θέση παίκτη που εκτελεί την ενέργεια.
//	apodoxi		ΝΑΙ = Αποδοχή, ΟΧΙ = Επαναδιαπραγμάτευση.

Skiniko.prototype.processKinisiPostAX = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	trapezi.trapeziThesiRefreshDOM();
	Arena.panelRefresh();
	if (Arena.ego.oxiTrapezi(data.trapezi)) return this;

	Arena.partida.refreshDOM();
	Client.sound.tic();
	Arena.partida.markAlagiPios(trapezi, data, 'ΑΠΟΔΟΧΗ,' + data.apodoxi);

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// RC -- Reject claim
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	dianomi		Κωδικός διανομής.
//	ecount		Πλήθος ενεργειών πριν το claim.

Skiniko.prototype.processKinisiPostRC = function(data) {
	if (Arena.ego.oxiTrapezi()) return this;

	Arena.partida.trapeziRefreshDOM();
	Arena.panelRefresh();
	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// EG -- Ενέργεια
//
// Δεδομένα
//
//	kodikos		Κωδικός ενέργειας.
//	trapezi		Κωδικός τραπεζιού.
//	dianomi		Κωδικός διανομής.
//	pektis		Θέση ενεργούντος παίκτη.
//	data		Data ενέργειας.
//
// Οι ενέργειες μεταφέρονται με τα δεδομένα τσόχας και όχι μέσω κινήσεων,
// επομένως οποιαδήποτε εμφάνιση τέτοιου είδους μεταβολής σηματοδοτεί
// προγραμματιστικό σφάλμα.

Skiniko.prototype.processKinisiPostEG = function(data) {
	console.error('παρουσιάστηκαν μεταβολές τύπου "EG"');
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// PD -- Πληρωμή διανομής
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	dianomi		Κωδικός διανομής.
//	kasa1		Ποσό κάσας παίκτη θέσης 1.
//	metrita1	Μετρητά παίκτη θέσης 1.
//	kasa2		Ποσό κάσας παίκτη θέσης 2.
//	metrita2	Μετρητά παίκτη θέσης 2.
//	kasa3		Ποσό κάσας παίκτη θέσης 3.
//	metrita3	Μετρητά παίκτη θέσης 3.
//
// Επιπρόσθετα δεδομένα
//
//	kasaPrin	Υπόλοιπο κάσας πριν την πληρωμή.

Skiniko.prototype.processKinisiAntePD = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	data.kasaPrin = trapezi.trapeziIpolipoGet();
	return this;
}

Skiniko.prototype.processKinisiPostPD = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	trapezi.trapeziDataRefreshDOM();
	if (Arena.ego.oxiTrapezi(data.trapezi))
	return this;

	// Η φάση πληρωμής τίθεται ΚΑΙ κατά την παραλαβή ενεργειών που
	// επισύρουν πληρωμή, π.χ. τελευταία μπάζα, ηθελημένο σόλο κλπ.

	trapezi.
	partidaFasiSet('ΠΛΗΡΩΜΗ').
	telefteaPliromiSet(data);
	Arena.cpanel.bpanelButtonGet('akirosi').pbuttonDisplay();

	Arena.partida.
	ipolipoRefreshDOM().
	pliromiRefreshDOM().
	pektisKapikiaRefreshDOM();

	Arena.kitapi.pliromiPush(data);

	if ((data.kasaPrin > 0) && (trapezi.trapeziIpolipoGet() <= 0))
	Client.sound.applause();

	$('.tsoxaPektisPliromi').finish().fadeIn(100);

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// DN -- Νέα διανομή
//
// Δεδομένα
//
//	kodikos		Κωδικός διανομής.
//	trapezi		Κωδικός τραπεζιού.
//	dealer		Θέση dealer.

Skiniko.prototype.processKinisiPostDN = function(data) {
	$('.tsoxaPektisPliromi').finish().fadeOut(600);
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// AK -- Ακύρωση κινήσεων
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//
// Προαιρετικά
//
//	pektis		Login name του παίκτη
//	ecount		Πλήθος ενεργειών που απομένουν.

Skiniko.prototype.processKinisiPostAK = function(data) {
	if (Arena.ego.oxiTrapezi()) return this;

	if (data.hasOwnProperty('ecount')) Arena.partida.trapeziRefreshDOM();
	else Arena.partida.dataKatoRefreshDOM();

	Arena.panelRefresh();
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// KN -- Κόρνα
//
// Δεδομένα
//
//	pektis		Login name του παίκτη.
//	trapezi		Κωδικός τραπεζιού.

Skiniko.prototype.processKinisiPostKN = function(data) {
	var trapezi, sizitisi;

	// Αν δεν εμπλεκόμαστε στο τραπέζι στο οποίο ήχησε η κόρνα, τότε κακώς
	// λάβαμε τη συγκεκριμένη κίνηση εκτός και αν κατέχουμε θέση παίκτη στο
	// τραπέζι και αλητεύουμε σε άλλο τραπέζι, πράγμα πολύ πιθανό. Σ' αυτή
	// την περίπτωση θα πάρουμε ηχητικό σήμα και σχετικό μήνυμα όπου κι αν
	// βρισκόμαστε.

	if (Arena.ego.oxiTrapezi(data.trapezi)) {
		trapezi = Arena.skiniko.skinikoTrapeziGet(data.trapezi);
		if (!trapezi) return this;
		if (!trapezi.trapeziThesiPekti(Client.session.pektis)) return this;
		Arena.kornaPlay();
		Client.fyi.ekato('Ο παίκτης <span class="entona ble">' + data.pektis +
			'</span> αδημονεί και κορνάρει από το τραπέζι <span class="entona ble">' +
			data.trapezi + '</span>');
		return this;
	}

	// Εμπλεκόμαστε στο τραπέζι είτε ως παίκτες είτε ως θεατές. Η κόρνα θα εμφανιστεί
	// στο χώρο συζήτησης και θα ηχήσει στον υπολογιστή μας.

	sizitisi = new Sizitisi({
		pektis: data.pektis,
		trapezi: data.trapezi,
		sxolio: 'KN',
	});

	sizitisi.sizitisiCreateDOM();
	Arena.sizitisi.scrollKato();

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// MV -- Μολύβι έναρξη.
//
// Δεδομένα
//
//	pektis		Login name του παίκτη.
//	trapezi		Κωδικός τραπεζιού.
//	kafenio		Δείχνει αν το μολύβι αφορά στο καφενείο.

Skiniko.prototype.processKinisiPostMV = function(data) {
	var sizitisi;

	sizitisi = new Sizitisi({
		pektis: data.pektis,
		sxolio: data.kafenio ? 'MVK' : 'MVT',
	});

	// Αν το μολύβι έχει εκκινήσει από το καφενείο, τότε θα πρέπει
	// να φανεί στη συζήτηση του καφενείου.

	if (data.kafenio) {
		sizitisi.sxolio = 'MVK';

		// Αν βρισκόμαστε σε mode παρτίδας και βρισκόμαστε στο
		// ίδιο τραπέζι με τον παίκτη που εκκίνησε το μολύβι,
		// τότε προτιμούμε την εμφάνιση του μολυβιού στη συζήτηση
		// του τραπεζιού.

		if (Arena.partidaMode() && Arena.ego.isTrapezi(data.trapezi))
		sizitisi.trapezi = data.trapezi;
	}

	// Αλλιώς το μολύβι έχει ξεκινήσει σε mode τραπεζιού. Σ' αυτή την
	// περίπτωση θα εμφανίσουμε μολύβι παρτίδας ση συζήτηση της παρτίδας
	// εφόσον βρσικόμαστε στο ίδιο τραπέζι.

	else if (Arena.ego.isTrapezi(data.trapezi)) {
		sizitisi.trapezi = data.trapezi;
		sizitisi.sxolio = 'MVT';
	}

	// Το μολύβι είναι μολύβι παρτίδας και έχει εκκινήσει σε άλλο τραπέζι
	// από αυτό που βρισκόμαστε τώρα, επομένως δεν χρειάζεται να κάνουμε
	// καμια περαιτέρω ενέργεια.

	else
	return this;

	sizitisi.sizitisiCreateDOM();
	Arena.sizitisi.scrollKato();

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// VM -- Μολύβι τέλος.
//
// Δεδομένα
//
//	pektis		Login name του παίκτη.
//	trapezi		Κωδικός τραπεζιού.

Skiniko.prototype.processKinisiPostVM = function(data) {
	Arena.sizitisi.moliviTelos(data.pektis);
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// AV -- Αποκλεισμός παίκτη από τραπέζι
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	apo		Login name παίκτη/επόπτη που θέτει τον αποκλεισμό.
//	pros		Login name αποκλειομένου.

Skiniko.prototype.processKinisiPostAV = function(data) {
	var trapezi, sizitisi, sinedria;

	Arena.panelRefresh();

	trapezi = this.skinikoTrapeziGet(data.trapezi);

	if (trapezi)
	trapezi.trapeziRefreshDOM();

	if (Arena.ego.oxiTrapezi(data.trapezi))
	return this;

	if (data.pros != Client.session.pektis) {
		sizitisi = new Sizitisi({
			pektis: data.pros,
			trapezi: data.trapezi,
			sxolio: '^E1:4^Με απέβαλαν από το τραπέζι!',
		});

		sizitisi.sizitisiCreateDOM();
		Arena.sizitisi.scrollKato();
		return this;
	}

	sinedria = this.skinikoSinedriaGet(data.pros);

	if (!sinedria)
	return this;

	if (sinedria.sinedriaOxiTrapezi(trapezi))
	return this;

	Arena.cpanel.exodosButton.pbuttonGetDOM().trigger('click');
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// DV -- Άρση αποκλεισμού παίκτη από τραπέζι
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	pros		Login name αποκλεισμένου.

Skiniko.prototype.processKinisiPostDV = function(data) {
	var trapezi, sizitisi;

	Arena.panelRefresh();

	trapezi = this.skinikoTrapeziGet(data.trapezi);

	if (trapezi)
	trapezi.trapeziRefreshDOM();

	if (Arena.ego.oxiTrapezi(data.trapezi))
	return this;

	sizitisi = new Sizitisi({
		pektis: data.pros,
		trapezi: data.trapezi,
		sxolio: '^E1:10^Είμαι πάλι ευπρόσδεκτος στο τραπέζι σας!',
	});

	sizitisi.sizitisiCreateDOM();
	Arena.sizitisi.scrollKato();

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// AT -- Αρχειοθέτηση τραπεζιού.
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//
// Επιπρόσθετα δεδομένα
//
//	sinedria	Λίστα συνεδριών που εμπλέκονται με το τραπέζι.

Skiniko.prototype.processKinisiAnteAT = function(data) {
	var trapezi, dom;

	// Μαζεύουμε τις συνεδρίες που εμπλέκονται με το προς αρχειοθέτηση
	// τραπέζι στη λίστα "data.sinedria".

	data.sinedria = {};
	this.skinikoSinedriaWalk(function() {
		if (this.sinedriaIsTrapezi(data.trapezi))
		data.sinedria[this.sinedriaPektisGet()] = true;
	});

	// Προχωρούμε στον εντοπισμό του DOM element του τραπεζιού
	// στο καφενείο.

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	dom = trapezi.trapeziGetDOM();
	if (dom) dom.remove();

	// Διαγράφουμε τα DOM elements των σχολίων συζήτησης του
	// τραπεζιού.

	trapezi.trapeziSizitisiWalk(function() {
		var dom;

		dom = this.sizitisiGetDOM();
		if (dom) dom.remove();
	});

	// Διαγράφουμε τα DOM elements των προσκλήσεων που αφορούν
	// στο συγκεκριμένο τραπέζι.

	this.skinikoProsklisiWalk(function() {
		var dom;

		if (this.prosklisiOxiTrapezi(data.trapezi))
		return;

		dom = this.prosklisiGetDOM();
		if (dom) dom.remove();
	});

	return this;
};

Skiniko.prototype.processKinisiPostAT = function(data) {
	var skiniko = this, oxiEgo;

	// Η flag "oxiEgo" δείχνει αν εμείς είμαστε άσχετοι με το
	// εν λόγω τραπέζι.

	oxiEgo = true;

	// Διατρέχουμε τις συνεδρίες που εμπλέκονταν με το τραπέζι και
	// ελέγχουμε τα νέα στοιχεία θέσης.

	Globals.walk(data.sinedria, function(pektis) {
		var sinedria;

		sinedria = skiniko.skinikoSinedriaGet(pektis);
		if (!sinedria) return;

		sinedria.
		sinedriaDetachRebelosDOM().
		sinedriaDetachTheatisDOM();

		Arena.anazitisi.pektisCheck(pektis, sinedria);

		// Αν είμαστε εμείς που εμπλεκόμαστε με το συγκεκριμένο τραπέζι,
		// θέτουμε τη σχετική flag.

		if (sinedria.sinedriaIsEgo())
		oxiEgo = false;

		// Αν ο παίκτης έχει συμπληρωμένο τραπέζι μετά την αρχειοθέτηση
		// του τραπεζιού, σημαίνει ότι κατά τον επανεντοπισμό του βρέθηκε
		// να είναι παίκτης σε άλλο τραπέζι, οπότε δεν προβαίνουμε σε
		// περαιτέρω ενέργειες.

		if (sinedria.sinedriaTrapeziGet())
		return;

		// Ο παίκτης είναι περιφερόμενος, επομένως πρέπει να εμφανιστεί
		// στην περιοχή των περιφερομένων.

		Arena.rebelosDOM.prepend(sinedria.rebelosDOM);
	});

	Arena.anazitisi.pektisRefreshDOM();

	// Αν δεν εμπλεκόμαστε με το τραπέζι που αρχειοθετήθηκε, τότε δεν προβαίνουμε
	// σε περαιτέρω ενέργειες.

	if (oxiEgo)
	return;

	// Εμπλεκόμασταν, μάλλον ως θεατές, στο τραπέζι που αρχειοθετήθηκε, επομένως
	// είναι καλό να ξανασχηματίσουμε το control panel.

	Arena.panelRefresh();

	// Αν μετά την αρχειοθέτηση του τραπεζιού βρεθήκαμε σε άλλο τραπέζι, πρέπει
	// να ξανασχηματίσουμε την παρτίδα και να κάνουμε τις σχετικές αλλαγές στο
	// καφενείο.

	if (Arena.ego.isTrapezi()) {
		Arena.partida.refreshDOM();
		Arena.ego.trapezi.trapeziDataRefreshDOM();
		this.pektisTrapeziScroll(true);
	}

	// Αλλιώς, μετά την αρχειοθέτηση βρεθήκαμε περιφερόμενοι, οπότε είναι καλό
	// να γυρίσουμε σε mode καφενείου.

	else
	Arena.kafenioModeSet();

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ZS -- Διαγραφή σχολίου συζήτησης
//
// Διαγραφή τελευταίου σχολίου συζήτησης τραπεζιού.
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού στο οποίο διεξάγεται η συζήτηση.
//			Αν δεν έχει καθοριστεί τραπέζι, τότε πρόκειται για
//			καθαρισμό της δημόσιας συζήτησης.
//	sxolio		Κωδικός αριθμός σχολίου προς διαγραφή. Αν δεν έχει
//			καθοριστεί σημαίνει μαζική διαγραφή.
//	pektis		Login name του παίκτη που διαγράφει το σχόλιο.
//
// Επιπρόσθετα δεδομένα
//
//	dom		DOM element σχολίου, ή ομάδας σχολίων προς διαγραφή.

Skiniko.prototype.processKinisiAnteZS = function(data) {
	var trapezi, sxolio;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	if (!data.sxolio) {
		data.dom = $();
		trapezi.trapeziSizitisiWalk(function() {
			var dom;

			dom = this.sizitisiGetDOM();
			if (!dom) return;

			data.dom = data.dom.add(dom);
		});

		return this;
	}

	sxolio = trapezi.trapeziSizitisiGet(data.sxolio);
	if (!sxolio) return this;

	data.dom = sxolio.sizitisiGetDOM();
	return this;
};

Skiniko.prototype.processKinisiPostZS = function(data) {
	var fyi, sxolio, dom, domLast;

	if (!data.trapezi) {
		Arena.sizitisi.kafenioDOM.empty();
		Client.fyi.epano('Έγινε εκκαθάριση της δημόσιας συζήτησης');
		return this;
	}

	if (!data.dom)
	return this;

	data.dom.remove();

	if (Arena.ego.oxiTrapezi(data.trapezi))
	return this;

	// Βρισκόμαστε στο τραπέζι στο οποίο έγινε διαγραφή σχολίων.
	// Οι κόρνες, τα μολύβια κλπ δεν γράφονται στην database και
	// ως εκ τούτου δεν έχουν κωδικό και δεν υφίστανται στη λίστα
	// σχολίων του τραπεζιού. Αυτό έχει ως παρενέργεια την μη
	// διαγραφή αυτών των σχολίων από τη συζήτηση του τραπεζιού.

	fyi = 'Ο παίκτης <span class="entona ble">' + data.pektis + '</span> διέγραψε ';
	if (!data.sxolio) {
		Arena.sizitisi.trapeziDOM.empty();
		Client.fyi.epano(fyi + 'τη συζήτηση');
		return this;
	}

	Client.fyi.epano(fyi + ' κάποιο σχόλιο');

	sxolio = Arena.ego.trapezi.trapeziSizitisiLast();
	sxolio = Arena.ego.trapezi.trapeziSizitisiGet(sxolio);

	// Αν δεν έχει απομείνει άλλο σχόλιο στη λίστα σχολίων της συζήτησης
	// του τραπεζιού, τότε καθαρίζουμε το χώρο συζήτησης από τυχόν άλλου
	// είδους σχόλια (κόρνες, μολύβια κλπ).

	if (!sxolio) {
		Arena.sizitisi.trapeziDOM.empty();
		return this;
	}

	dom = sxolio.sizitisiGetDOM();
	if (!dom) return this;

	dom = dom[0];
	while (true) {
		domLast = Arena.sizitisi.trapeziDOM.find('.sizitisi').last();
		if (!domLast) break;

		if (domLast[0] === dom)
		break;

		domLast.remove();
	}

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ZP -- Φύλλα τζόγου προηγούμενης διανομής
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	fila		Φύλλα τζόγου προηγούμενης διανομής.

Skiniko.prototype.processKinisiPostZP = function(data) {
	Arena.partida.tzogosDOM.removeData('faneros');

	if (Arena.ego.oxiTrapezi(data.trapezi))
	return this;

	Arena.ego.trapezi.tzogosPrev = data.fila.string2xartosia();
	Arena.partida.
	tzogosRefreshDOM().
	azabRefreshDOM();

	return this;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ML -- Έλευση μηνύματος αλληλογραφίας
//
// Δεδομένα
//
//	paraliptis	Login name παραλήπτη
//	id		Κωδικός μηνύματος

Skiniko.prototype.processKinisiPostML = function(data) {
	var mwin, mlist, minima;

	if (Arena.minima.endixiDOM) {
		Arena.minima.endixiDOM.finish().
		removeClass('minimaEndixiLow').
		css('display', 'none').
		fadeIn({
			duration: 500,
			easing: 'easeInElastic',
		}).
		html('&nbsp;!&nbsp;').attr('title', 'Παραλάβατε μήνυμα με κωδικό αριθμό ' + data.kodikos);
		Client.fyi.pano('<div class="aristera">Έχετε μήνυμα από τον παίκτη ' +
			'<span class="entona ble">' + data.apostoleas + '</span></div>', 8000);
	}

	if (Arena.minima.isKlisto()) {
		Client.sound.psit();
		return this;
	}

	mwin = Arena.minima.win;
	mwin.Client.sound.plop();

	mlist = mwin.Minima.lista;
	if (!mlist) return this;

	minima = mlist[data.kodikos];
	if (minima) return this;

	new mwin.Minima(data).
	minimaPoteAdd(Client.timeDif).
	minimaPushLista().
	minimaPushDOM(true).
	minimaEndixiNeo();
	return this;
}
