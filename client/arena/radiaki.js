// Στο παρόν module υπάρχουν δομές, functions και μέθοδοι που αφορούν στο
// ραδιοφωνάκι. Το ραδιοφωνάκι ενεργοποιείται με πλήκτρο του control panel
// το οποίο εμφανίζει/αποκρύπτει panel επιλογής ιντερνετικού ραδιοφωνικού
// σταθμού.

// Η κλάση "radiofono" περιγράφει ραδιοφωικούς σταθμούς. Κάθε σταθμός έχει
// τα properties "perigrafi" και "link" που είναι μια περιγραφή του σταθμού
// και το σχετικό url.

Radiofono = function(props) {
	Globals.initObject(this, props);
};

Radiofono.prototype.radiofonoPerigrafiGet = function() {
	return this.perigrafi;
};

Radiofono.prototype.radiofonoLinkGet = function() {
	return this.link;
};

// Η μέθοδος "radiofonoListaAppend" προσθέτει DOM element στη λίστα σταθμών.
// Το DOM element προστίθεται ως property στον ίδιο τον ραδιοφωνικό σταθμό.

Radiofono.prototype.radiofonoListaAppend = function() {
	if (this.DOM)
	this.DOM.remove();

	Arena.radiaki.DOM.
	append(this.DOM = $('<div>').addClass('radiofono').
	data('radiofono', this).
	html(this.radiofonoPerigrafiGet()));

	return this;
};

// Η μέθοδος "radiofonoEpilogi" καλείται όταν κάνουμε κλικ στο DOM element
// του σταθμού στο panel συντονισμού.

Radiofono.prototype.radiofonoEpilogi = function() {
	if (!this.DOM)
	return this;

	this.DOM.addClass('radiofonoTrexon');
	Arena.radiaki.win = window.open(this.radiofonoLinkGet(), 'radiaki');

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Το singleton "radiaki" χρησμοποιείται ως name space για δομές και
// functions που αφορούν στο πάνελ επιλογής, το οποίο ενίοτε καλούμε
// και πάνελ συντονισμού.

Arena.radiaki = {};

// Το array "lista" περιλαμβάνει τις επιλογές ραδιοφωνικών σταθμών που
// προτείνονται ως πλήκτρα στο πάνελ συντονισμού.

Arena.radiaki.lista = [
	new Radiofono({
		perigrafi: 'KOSMOS',
		link: 'http://webradio.ert.gr/kosmos/',
	}),

	new Radiofono({
		perigrafi: 'Akous.gr (ρεμπέτικο)',
		link: 'http://www.akous.gr/player/palko/',
	}),

	new Radiofono({
		perigrafi: 'Ερωτόκριτος FM 87.9',
		link: 'http://www.easyradio.gr/erotokritos',
	}),

	new Radiofono({
		perigrafi: 'Oratos',
		link: 'http://myradiostream.com/oratos',
	}),

	new Radiofono({
		perigrafi: 'Radio Swiss Classic',
		link: 'http://www.radioswissclassic.ch/en/webplayer',
	}),

	new Radiofono({
		perigrafi: 'Τρίτο Πρόγραμμα',
		link: 'http://webradio.ert.gr/trito/',
	}),
];

// Η function "panelAnikto" επιστρέφει true εφόσον ο χρήστης έχει ανοικτό το
// πάνελ συντονισμού.

Arena.radiaki.panelAnikto = function() {
	if (!Arena.radiaki.DOM)
	return false;

	return(Arena.radiaki.DOM.css('display') !== 'none');
};

// Η function "setup" καλείται κατά το στήσιμο της αρένας και δημιουργεί το panel
// συντονισμού ως ενιαίο div DOM element, το οποίο και εφοπλίζει με mouse event
// listeners.

Arena.radiaki.setup = function() {
	Client.ofelimoDOM.
	append(Arena.radiaki.DOM = $('<div>').attr('id', 'radiaki').
	siromeno({
		top: '104px',
		left: '624px',
	}).
	on('mouseenter', '.radiofono', function(e) {
		$(this).addClass('radiofonoCandi');
	}).
	on('mouseleave', '.radiofono', function(e) {
		$(this).removeClass('radiofonoCandi');
	}).
	on('click', '.radiofono', function(e) {
		var radiofono;

		Arena.inputRefocus(e);

		// Ακυρώνουμε τυχόν ήδη επιλεγμένο ραδιοφωνικό σταθμό.

		$('.radiofonoTrexon').
		removeClass('radiofonoTrexon');

		// Προσπελαύνουμε το σταθμό που αφορά στο πλήκτρο που
		// κάναμε κλικ.

		radiofono = $(this).data('radiofono');
		if (radiofono) return radiofono.radiofonoEpilogi();

		// Δεν βρέθηκε συσχετισμένο ραδιόφωνο, επομένως πρόκειται
		// για το το πλήκτρο διακοπής της ραδιοφωνικής μετάδοσης.

		if (Arena.radiaki.win)
		Arena.radiaki.win.close();

		delete Arena.radiaki.win;

		// Σε περίπτωση διακοπής κλείνουμε και το πάνελ συντονισμού,
		// καθώς ο χρήστης δεν το χρειάζεται πια.

		Arena.cpanel.
		bpanelButtonGet('radiaki').
		pbuttonGetDOM('radiaki').
		trigger('click');
	}).append(Client.klisimo(function(e) {
		Arena.cpanel.
		bpanelButtonGet('radiaki').
		pbuttonGetDOM('radiaki').
		trigger('click');
	})));

	// Δημιουργούμε τα πλήκτρα επιλογής στο πάνελ συντονισμού.

	Globals.awalk(Arena.radiaki.lista, function(i, radiofono) {
		radiofono.radiofonoListaAppend();
	});

	// Στο τέλος προσθέτουμε πλήκτρο διακοπής της ραδιοφωνικής μετάδοσης.

	Arena.radiaki.DOM.
	append($('<div>').addClass('radiofono radiofonoOff').
	html('&mdash;&nbsp;Off&nbsp;&mdash;'));

	return Arena;
};
