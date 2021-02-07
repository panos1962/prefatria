Arena.kitapi = {};

Arena.kitapi.setup = function() {
	Arena.kitapi.iconDOM = $('<img>').attr({
		id: 'tsoxaKitapiIcon',
		src: 'ikona/panel/kitapi.png',
		title: 'Κιτάπι',
	}).
	on('click', function(e) {
		Arena.inputRefocus(e);

		if (Arena.kitapi.isKlisto())
		return Arena.kitapi.anigma(e);

		if (Arena.kitapi.isBlur())
		return Arena.kitapi.focus();

		Arena.kitapi.blur(e);
	}).appendTo(Arena.partida.tsoxaDOM);

	return Arena;
};

Arena.kitapi.isAnikto = function() {
	return Arena.kitapi.win;
};

Arena.kitapi.isKlisto = function() {
	return !Arena.kitapi.isAnikto();
};

// Η function "isBlur" ελέγχει αν το κιτάπι είναι blured, δηλαδή αν το σχετικό
// παράθυρο είναι στο background. Αυτό ελέγχεται από την παράμετρο "blurTS" που
// δείχνει το timestamp της στιγμής που το παράθυρο έχασε το focus. Ο λόγος αυτής
// της περιπλοκής είναι ο εξής: Ας υποθέσουμε ότι το κιτάπι βρίσκεται στο προσκήνιο
// και ο χρήστης κάνει κλικ στο σχετικό εικονίδιο προκειμένου να το ενατοποθετήσει
// στο παρασκήνιο. Με το κλικ στο εικονίδιο γίνεται focus το παράθυρο της παρτίδας
// οπότε το κιτάπι καθίσταται ήδη unfocus και έτσι έχουμε πρόβλημα.

Arena.kitapi.isBlur = function() {
	if (!Arena.kitapi.blurTS)
	return false;

	return(Globals.torams() - Arena.kitapi.blurTS > 200);
};

Arena.kitapi.anigma = function(e) {
	if (!Arena.kitapi.position) {
		Arena.kitapi.position = Arena.kitapi.iconDOM.screenPosition();
		Arena.kitapi.position.top = 100;
		Arena.kitapi.position.left += 100;
		Arena.kitapi.position.height = 710;
		Arena.kitapi.position.width = 590;
	}

	Arena.kitapi.win = window.open('kitapi/index.php', '_blank',
		'height=' + Arena.kitapi.position.height + ',width=' + Arena.kitapi.position.width +
		',scrollbars=1,' +
		'top=' + Arena.kitapi.position.top + ',left=' + Arena.kitapi.position.left);

	$(Arena.kitapi.win).
	on('blur', function() {
		Arena.kitapi.blurTS = Globals.torams();
		Arena.inputRefocus();
		Arena.kitapi.entonoIcon();
	}).
	on('focus', function() {
		delete Arena.kitapi.blurTS;
		Arena.kitapi.axnoIcon();
	});

	return Arena;
};

Arena.kitapi.focus = function() {
	try {
		Arena.kitapi.win.Kitapi.paraskinioSet();
		Arena.kitapi.win.focus();
	} catch (e) {}

	return Arena;
};

Arena.kitapi.blur = function(e) {
	Arena.inputRefocus(e);
	self.focus();
	return Arena;
};

Arena.kitapi.klisimo = function() {
	var kitapi;

	kitapi = Arena.kitapi.win;
	if (kitapi) {
		try {
			if (kitapi.screenLeft) Arena.kitapi.position.left = kitapi.screenLeft;
			else if (kitapi.screenX) Arena.kitapi.position.left = kitapi.screenX;

			if (kitapi.screenTop) Arena.kitapi.position.top = kitapi.screenTop;
			else if (kitapi.screenY) Arena.kitapi.position.top = kitapi.screenY;
			kitapi.close();
		} catch (e) {}
	}

	delete Arena.kitapi.win;
	delete Arena.kitapi.blurTS;
	Arena.kitapi.entonoIcon();

	return Arena;
};

Arena.kitapi.refresh = function() {
	var Kitapi;

	if (Arena.kitapi.isKlisto())
	return Arena;

	Kitapi = Arena.kitapi.win.Kitapi;
	try {
		Kitapi.refreshDOM();
	} catch (e) {}

	return Arena;
};

Arena.kitapi.pliromiPush = function(pliromi) {
	if (Arena.kitapi.isKlisto())
	return Arena;

	try {
		Arena.kitapi.win.Kitapi.pliromiPush(pliromi);
		Arena.kitapi.win.Kitapi.isozigioRefreshDOM();
	} catch (e) {}

	return Arena;
};

Arena.kitapi.entonoIcon = function() {
	Arena.kitapi.iconDOM.removeClass('tsoxaKitapiIconAxno');
	return Arena;
};

Arena.kitapi.axnoIcon = function() {
	Arena.kitapi.iconDOM.addClass('tsoxaKitapiIconAxno');
	return Arena;
};
