Arena.partida.bazaRefreshDOM = function(prev) {
	var pios, fila, nikitis, i, iseht, epomenos;

	if (Arena.ego.oxiTrapezi()) {
		$('.tsoxaBazaFilo').remove();
		$('.tsoxaVelosFilo').remove();
		return Arena.partida;
	}

	if (prev === undefined) {
		pios = Arena.ego.trapezi.bazaPios;
		fila = Arena.ego.trapezi.bazaFila;
	}
	else {
		pios = Arena.ego.trapezi.azabPios;
		fila = Arena.ego.trapezi.azabFila;
	}

	epomenos = Arena.ego.trapezi.partidaEpomenosGet();
	nikitis = Arena.ego.trapezi.partidaBazaPios(prev);
	$('.tsoxaBazaFilo').finish().remove();
	$('.tsoxaVelosFilo').remove();
	for (i = 0; i < pios.length; i++) {
		iseht = Arena.ego.thesiMap(pios[i]);
		Arena.partida.tsoxaDOM.
		append($('<img>').addClass('tsoxaBazaFilo').attr({
			id: 'tsoxaBazaFilo' + iseht,
			src: 'ikona/trapoula/' + fila[i].filoXromaGet() + fila[i].filoAxiaGet() + '.png',
		})).
		append($('<img>').addClass('tsoxaVelosFilo').attr({
			id: 'tsoxaVelosFilo' + iseht,
			src: 'ikona/baza/' + (epomenos === pios[i] ? 'pare' : 'dose') + iseht + '.png',
		}).css('opacity', pios[i] == nikitis ? 1.0 : 0.5));
	}

	return Arena.partida;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Στα arrays που ακολουθούν κρατάμε τα στοιχεία της τελευταίας μπάζας
// που παίχτηκε στην τσόχα μας. Συνήθως η τελευταία μπάζα εμφανίζεται
// με βάση τα σχετικά στοιχεία που υπάρχουν στην παρτίδα, αλλά αυτά
// μηδενίζονται κατά την επαναδιανομή και έτσι δεν μπορούμε να δούμε
// την τελευταία μπάζα της τελευταίας διανομής μετά την επαναδιανομή.

Arena.partida.azabPios = [];
Arena.partida.azabFila = [];

Arena.partida.azabRefreshDOM = function() {
	Arena.partida.azabDOM.empty().
	css('display', Arena.partida.flags.azab ? 'block' : 'none');

	if (Arena.ego.oxiTrapezi())
	return Arena.partida;

	if (Arena.partida.flags.skarta)
	Arena.partida.azabRefreshSkartaDOM();

	else
	Arena.partida.azabRefreshBazaDOM();

	return Arena.partida;
};

Arena.partida.azabRefreshSkartaDOM = function() {
	var tzogadoros, skarta;

	Arena.partida.azabDOM.empty().attr('title', 'Σκάρτα');

	if (Arena.ego.trapezi.trapeziOxiDianomi()) {
		Arena.partida.flags.azab = false;
		Arena.partida.flags.skarta = false;
		return Arena.partida;
	}

	tzogadoros = Arena.ego.trapezi.partidaTzogadorosGet();
	if (!tzogadoros) return Arena.partida;

	if (Arena.ego.isPektis() && Arena.ego.oxiThesi(tzogadoros))
	return Arena.partida;

	skarta = Arena.ego.trapezi.partidaSkartaGet();
	if (!skarta) return Arena.partida;

	skarta.xartosiaWalk(function(i, filo) {
		Arena.partida.azabDOM.
		append($('<img>').addClass('tsoxaAzabTzogos').attr({
			id: 'tsoxaAzabTzogos' + i,
			src: 'ikona/trapoula/' + filo.filoXromaGet() + filo.filoAxiaGet() + '.png',
		}));
	});

	Arena.partida.azabDOM.
	append($('<div>').addClass('tsoxaAzabInfo').text('Σκάρτα'));

	return Arena.partida;
};

Arena.partida.azabRefreshBazaDOM = function() {
	var pios, fila, torini, i, iseht;

	Arena.partida.azabDOM.empty().attr('title', 'Τελευταία μπάζα');

	if (Arena.ego.trapezi.trapeziOxiDianomi()) {
		Arena.partida.flags.azab = false;
		Arena.partida.flags.skarta = false;
		return Arena.partida;
	}

	pios = Arena.ego.trapezi.azabPios;
	if (pios.length) {
		fila = Arena.ego.trapezi.azabFila;
		Arena.partida.azabPios = [];
		Arena.partida.azabFila = [];
		torini = true;
	}
	else {
		pios = Arena.partida.azabPios;
		fila = Arena.partida.azabFila;
		torini = false;
	}

	// Αν δεν υπάρχει κρατημένη κάποια προηγούμενη μπάζα, τότε
	// επιχειρούμε να δείξουμε τα σκάρτα.

	if (pios.length <= 0) {
		Arena.partida.azabRefreshSkartaDOM();
		return Arena.partida;
	}

	for (i = 0; i < pios.length; i++) {
		if (torini) {
			Arena.partida.azabPios.push(pios[i]);
			Arena.partida.azabFila.push(fila[i]);
		}

		iseht = Arena.ego.thesiMap(pios[i]);
		Arena.partida.azabDOM.
		append($('<img>').addClass('tsoxaAzabFilo').attr({
			id: 'tsoxaAzabFilo' + iseht,
			src: 'ikona/trapoula/' + fila[i].filoXromaGet() + fila[i].filoAxiaGet() + '.png',
		}));
	}

	return Arena.partida;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.partida.claimRefreshDOM = function() {
	var filaDom;

	$('#tsoxaClaimXartosia').remove();
	if (Arena.ego.oxiTrapezi()) return Arena.partida;

	switch (Arena.ego.trapezi.partidaFasiGet()) {
	case 'CLAIM':
		break;
	default:
		return Arena.partida;
	}

	filaDom = Arena.ego.trapezi.claimFila.xartosiaDOM(1);
	Arena.partida.tsoxaDOM.append($('<div>').attr('id', 'tsoxaClaimXartosia').
	append($('<div>').attr('id', 'tsoxaClaimMessage').text('Δεν δίνω άλλη μπάζα!')).
	append(filaDom));
	return Arena.partida;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Για λόγους που δεν είναι της παρούσης, μας ενδιαφέρει ανά πάσα στιγμή
// να γνωρίζουμε αν υπάρχουν φύλλα σε κίνηση. Τα φύλλα κινούνται από τη
// χαρτωσιά του παίκτη προς το κέντρο του τραπεζιού. Για να γνωρίζουμε
// αν έχουμε φύλλα σε κίνηση και ποια είναι αυτά χρησιμοποιούμε κατ'
// αρχάς μια γενικότερη υποδομή, το singleton object "filoSeKinisi" στο
// οποίο υπάρχουν ως attributes τόσο η λίστα με τα φύλλα που βρίσκονται
// σε κίνηση, όσο και διάφορες functions χειρισμού και ελέγχου της λίστας
// αυτής.


Arena.filoSeKinisi = {};

// Η function "reset" «μηδενίζει» τη λίστα των φύλλων σε κίνηση.

Arena.filoSeKinisi.reset = function() {
	var i;

	// Πρώτα επιταχύνω την κίνηση όλων των φύλλων που βρίσκονται
	// σε κίνηση τελειώνοντας άμεσα την όποια πορεία έχει κάθε
	// ένα από αυτά τα φύλλα.

	for (i in Arena.filoSeKinisi.list)
	Arena.filoSeKinisi.list[i].finish();

	// Κατόπιν «μηδενίζω» τη λίστα φύλλων σε κίνηση, καθώς αυτή
	// τη στιγμή δεν υπάρχουν πια καταγεγραμμένα φύλλα σε κίνηση.

	Arena.filoSeKinisi.list = {};

	return Arena.filoSeKinisi;
};

// Η function "exists" ελέγχει αν υπάρχει έστω και ένα φύλλο σε κίνηση
// και αν ναι, τότε επιστρέφει true, αλλιώς επιστρέφει false.

Arena.filoSeKinisi.exists = function() {
	var i;

	for (i in Arena.filoSeKinisi.list)
	return true;

	return false;
};

// Η function "push" εισάγει στη λίστα φύλλων σε κίνηση ένα νέο φύλλο που
// μόλις έχει τεθεί σε τροχιά. Ως παράμετρο δέχεται την jQuery λίστα που
// χρησιμοποιήθηκε κατά την εκκίνηση του σχετικού animation και «περιβάλλει»
// το συγκεκριμένο φύλλο.

Arena.filoSeKinisi.push = function(jql) {
	// Ως δείκτη στη λίστα θέτουμε το ίδιο το φύλλο που έχει μόλις
	// έχει τεθεί σε κίνηση, ενώ ως τιμή δίνουμε την ίδια την jQuery
	// λίστα που «περιβάλλει» το φύλλο και χρησιμοποιήθηκε για την
	// εκκίνηση του σχετικού animation.

	Arena.filoSeKinisi.list[jql.get(0)] = jql;

	return Arena.filoSeKinisi;
};

// Η function "pop" καλείται κατά το τελείωμα της κίνησης ενός φύλλου και
// σκοπό έχει την αφαίρεση από τη λίστα φύλλων σε κίνηση του συγκεκριμένου
// φύλλου που μόλις έχει φτάσει στον προορισμό του. Ως παράμετρο δέχεται
// το ίδιο το κινούμενο φύλλο ως μέλος της jQuery λίστας που το περιβάλλει
// και είχε χρησιμοποιηθεί στην εκκίνηση του σχετικού animation.

Arena.filoSeKinisi.pop = function(domel) {
	if (!Arena.filoSeKinisi.list.hasOwnProperty(domel))
	return Arena.filoSeKinisi;

	// Υπάρχει περίπτωση η function να έχει κληθεί και κατά τη διάρκεια
	// της κίνησης του φύλλου. Σ' αυτή την περίπτωση τερματίζουμε αμέσως
	// την κίνηση.

	Arena.filoSeKinisi.list[domel].finish();

	// Αφαιρούμε το συγκεκριμένο στοιχείο από τη λίστα φύλλων σε κίνηση.

	delete Arena.filoSeKinisi.list[domel];

	return Arena.filoSeKinisi;
};

// Αρχικοποιούμε τη λίστα φύλλων σε κίνηση άπαξ κατά την εκκίνηση του
// προγράμματος.

Arena.filoSeKinisi.reset();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.partida.kinisiFilo = function(opts) {
	var css = {width: '88px'}, tsoxaPos, filoPos, olif, delay;

	switch (Arena.ego.thesiMap(opts.pektis)) {
	case 3:
		css.top = 220;
		css.left = 200;
		break;
	case 2:
		css.top = 200;
		css.left = 260;
		break;
	default:
		css.top = 240;
		css.left = 230;
		break;
	}

	tsoxaPos = Arena.partida.tsoxaDOM.offset();
	filoPos = opts.filoDOM.offset();

	olif = opts.filoDOM.clone().addClass('tsoxaBazaFiloProxiro').appendTo(Arena.partida.tsoxaDOM).css({
		position: 'absolute',
		top: (filoPos.top - tsoxaPos.top - 3) + 'px',
		left: (filoPos.left - tsoxaPos.left - 3) + 'px',
		marginLeft: 0,
		zIndex: 1,
	});

	css.top = css.top + 'px';
	css.left = css.left + 'px';

	opts.filoDOM.css('visibility', 'hidden');
	delay = Arena.partida.taxititaDelayGet();

	Arena.filoSeKinisi.push(olif);

	olif.
	removeClass('tsoxaXartosiaFiloOmioxromo').
	finish().animate(css, delay, function() {
		// Η κίνηση του φύλλου έχει τερματιστεί, επομένως πρέπει
		// να αφαιρέσω το συγκεκριμένο φύλλο από τη λίστα φύλλων
		// σε κίνηση.

		Arena.filoSeKinisi.pop(this);

		if (opts.callback)
		opts.callback();
	});

	return Arena.partida;
};

Arena.partida.kinisiBaza = function() {
	var pios, iseht, css = {width: 0}, bazaDom, delay;

	if (Arena.ego.oxiTrapezi())
	return Arena.partida;

	if (!Arena.ego.trapezi.bazaFila)
	return Arena.partida;

	if (Arena.ego.trapezi.bazaFila.length)
	return Arena.partida;

	pios = Arena.ego.trapezi.partidaBazaPios(true);
	iseht = Arena.ego.thesiMap(pios);

	switch (iseht) {
	case 3:
		css.left = '100px';
		css.top = '140px';
		break;
	case 2:
		css.left = '400px';
		css.top = '140px';
		break;
	default:
		css.left = '130px';
		css.top = '420px';
		break;
	}

	Arena.partida.
	bazaRefreshDOM(true).
	azabRefreshDOM();

	bazaDom = $('#tsoxaPektisBazes' + iseht).find('.tsoxaPektisBazesBaza');
	bazaDom = (iseht === 2 ? bazaDom.first() : bazaDom.last());
	bazaDom.data('src', bazaDom.attr('src')).
	attr('src', 'ikona/endixi/baza.gif');
	$('.tsoxaVelosFilo').delay(400).fadeOut();

	delay = Arena.partida.taxititaDelayGet();

	$('.tsoxaBazaFilo').finish().delay(600).animate(css, delay, 'easeInSine', function() {
		$(this).remove();
		bazaDom.attr('src', bazaDom.data('src'));
	});

	return Arena.partida;
};

// Το πρόγραμμα παρέχει 5 ταχύτητες που αφορούν στην κίνηση των φύλλων.
// Οι ταχύτητα κίνησης των φύλλων αλλάζει με πλήκτρο από το control panel
// και κυμαίνεται από 1 (πολύ αργά) μέχρι 6 (πάρα πολύ γρήγορα), με μέση
// (default) ταχύτητα το 3.

Arena.partida.taxititaLista = {
	1: { delay: 650, title: 'Grave' },
	2: { delay: 500, title: 'Andante' },
	3: { delay: 350, title: 'Allegro' },
	4: { delay: 250, title: 'Vivace' },
	5: { delay: 200, title: 'Presto' },
	6: { delay: 50, title: 'Prestissimo' },
};

Arena.partida.taxititaDelayGet = function() {
	try {
		return Arena.partida.taxititaLista[Client.session.taxitita].delay;
	} catch (e) {
		Client.session.taxitita = 3;
		return Arena.partida.taxititaLista[3].delay;
	}
};

Arena.partida.taxititaTitlosGet = function() {
	try {
		return Arena.partida.taxititaLista[Client.session.taxitita].title;
	} catch (e) {
		Client.session.taxitita = 3;
		return Arena.partida.taxititaLista[3].title;
	}
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.partida.xipnitiriStadioList = [
	{ t: 10000, s: 'kanarini.ogg' },
	{ t: 10000, s: 'clocktickslow.ogg' },
	{ t: 10000, s: 'treno.ogg' },
	{ t: 10000, s: 'kabanaki.ogg' },
	{ t: 10000, s: 'sfirixtra.ogg' },
	{ t: 10000, s: 'korna/kanoniki3.ogg' },
	{ t: 10000, s: 'korna/dalika.ogg' },
];

delete Arena.partida.xipnitiriTimer;

Arena.partida.xipnitiriOplismos = function() {
	if (Debug.flagGet('xipnitiriOff'))
	return Arena.partida;

	Arena.partida.
	xipnitiriAfoplismos().
	xipnitiriTimerSet(0);
};

Arena.partida.xipnitiriTimerSet = function(stadio) {
	if (stadio >= Arena.partida.xipnitiriStadioList.length) {
		delete Arena.partida.xipnitiriTimer;
		return Arena.partida;
	}

	Arena.partida.xipnitiriTimer = setTimeout(function() {
		// Πρώτα δίνουμε οπτικό σήμα. Το ξυπνητήρι αναβοσβήνει
		// σε φόντο με έντονο χρωματισμό.

		Arena.prosklisi.panel.xipnitiriButton.pbuttonGetDOM().
		css('backgroundColor', '#00FFFF').
		finish().
		animate({
			backgroundColor: 'transparent',
		}, 1000, 'easeInOutBounce', function() {
			$(this).css('backgroundColor', '');
		});

		// Ακολουθεί ηχητικό σήμα εφόσον ο χρήστης δεν το έχει
		// φιμώσει. Το ηχητικό σήμα υλοποιείται μέσω audio DOM
		// element το οποίο μετά τη λήξη του θα διαγραφεί καθώς
		// έτσι λειτουργεί η μέθοδος "sound.play". Φροντίζουμε,
		// ωστόσο, να εντάξουμε το συγκεκριμένο DOM element ως
		// τέκνο συγκεκριμένου στοιχείου που έχουμε δημιουργήσει
		// ακριβώς γι' αυτό το σκοπό. Θα μπορούσαμε να αφήνουμε
		// ελεύθερο το στοιχείο του ήχου χωρίς να το εντάσσουμε
		// κάπου στο DOM, αλλά με την ένταξη των στοιχεών ήχου
		// στο DOM μας παρέχεται η δυνατότητα άμεσης διακοπής
		// κατά τη σίγαση της αφύπνισης.

		if (Arena.flags.alarmClock)
		Client.sound.play(Arena.partida.xipnitiriStadioList[stadio].s).
		appendTo(Arena.xipnitiriDOM);

		// Δρομολογούμε το επόμενο σήμα.

		Arena.partida.xipnitiriTimerSet(stadio + 1);
	}, Arena.partida.xipnitiriStadioList[stadio].t);

	return Arena.partida;
};

Arena.partida.xipnitiriAfoplismos = function() {
	if (!Arena.partida.xipnitiriTimer)
	return Arena.partida;

	clearTimeout(Arena.partida.xipnitiriTimer);
	delete Arena.partida.xipnitiriTimer;
	return Arena.partida;
};
