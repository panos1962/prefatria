Arena.partida.enimerosiClearDOM = function() {
	Arena.partida.enimerosiDOM.
	removeClass().
	empty();
	return Arena.partida;
};

Arena.partida.enimerosiRefreshDOM = function() {
	var fasi, proc;

	Arena.partida.enimerosiClearDOM();
	fasi = Arena.ego.oxiTrapezi() ? '' : Arena.ego.trapezi.partidaFasiGet();
	proc = 'enimerosi' + fasi;
	if (typeof Arena.partida[proc] !== 'function')
	return Arena.partida;

	Arena.partida.enimerosiDOM.css({
		display: 'block',
	}).addClass('tsoxaEnimerosi' + fasi);
	Arena.partida[proc]();
	return Arena.partida;
};

Arena.partida.enimerosiFillDOM = function(kimeno, icon, iconWidth) {
	var img;

	if (icon) {
		img = $('<img>').attr('src', 'ikona/' + icon).addClass('tsoxaEnimerosiIcon');
		if (iconWidth) img.css('width', iconWidth + 'px');
		Arena.partida.enimerosiDOM.append(img);
	}

	Arena.partida.enimerosiDOM.append($('<div>').text(kimeno));
	return Arena.partida;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.partida.enimerosi = function() {
	Arena.partida.enimerosiDOM.
	append($('<p>').text("Βρίσκεστε στη βασική σελίδα του «Πρεφαδόρου». Πρόκειται για ιστότοπο " +
		"που επιχειρεί να προσομοιάσει ένα διαδικτυακό καφενείο της πρέφας.")).
	append($('<p>').text("Μπορείτε να δημιουργήσετε ένα τραπέζι και να καλέσετε τους φίλους σας " +
		"για να παίξετε μια παρτίδα πρέφα, ή να αποδεχτείτε κάποια πρόσκληση προκειμένου " +
		"να παίξετε σε κάποιο άλλο τραπέζι.")).
	append($('<p>').text("Μπορείτε, ακόμη, να παρακολουθήσετε τις παρτίδες που εξελίσσονται " +
		"σε άλλα τραπέζια του καφενείου, κάνοντας κλικ στον κωδικό οποιουδήποτε τραπεζιού " +
		"από το χώρο του καφενείου."));
	return Arena.partida;
};

Arena.partida.enimerosiΔΙΑΝΟΜΗ = function() {
	var thesi, kimeno;

	thesi = Arena.ego.thesiMap(Arena.ego.trapezi.partidaDealerGet());
	if (thesi == 1) {
		kimeno = Arena.ego.isPektis() ?
			'Μοιράζετε φύλλα.'
		:
			'Ο παίκτης που παρακολουθείτε μοιράζει φύλλα.';
	}
	else {
		kimeno = 'Ο παίκτης ';
		switch (thesi) {
		case 2:
			kimeno += 'δεξιά';
			break;
		default:
			kimeno += 'αριστερά';
			break;
		}

		kimeno += ' ';
		kimeno += Arena.ego.isPektis() ?  'σας' : 'από τον παίκτη που παρακολουθείτε';
		kimeno += ' μοιράζει φύλλα.';
	}
	kimeno += ' Παρακαλώ περιμένετε…';

	Arena.partida.enimerosiFillDOM(kimeno, 'working/bares.gif', 70);
	return Arena.partida;
};

Arena.partida.enimerosiΔΗΛΩΣΗ = function() {
	var thesi, kimeno, ikona = 'working/venetia.gif', ikonaWidth = 70;

	thesi = Arena.ego.thesiMap(Arena.ego.trapezi.partidaEpomenosGet());
	switch (thesi) {
	case 1:
		if (Arena.ego.isPektis()) {
			Arena.partida.enimerosiDOM.addClass('tsoxaEnimerosiΔΗΛΩΣΗactive');
			ikona = 'endixi/nevrikos.gif';
			ikonaWidth = 40;
			kimeno = 'Πλειοδοτήστε προκειμένου να κερδίσετε την αγορά, αλλιώς πείτε πάσο. ' +
				'Οι συμπαίκτες σας περιμένουν…'
		}
		else {
			kimeno = 'Ο παίκτης που παρακολουθείτε σκέφτεται αν θα πλειοδοτήσει ' +
				'στην αγορά. Παρακαλώ περιμένετε…';
		}
		break;
	default:
		kimeno = 'Ο παίκτης ' + (thesi == 2 ? 'δεξιά' : 'αριστερά') + ' ' +
			(Arena.ego.isPektis() ?  'σας' : 'από τον παίκτη που παρακολουθείτε') +
			' σκέφτεται αν θα πλειοδοτήσει στην αγορά. Παρακαλώ περιμένετε…';
		break;
	}

	Arena.partida.enimerosiFillDOM(kimeno, ikona, ikonaWidth);
	return Arena.partida;
};

Arena.partida.enimerosiΑΛΛΑΓΗ = function() {
	var thesi, kimeno, img = 'working/koutakia.gif', imgWidth = null;

	thesi = Arena.ego.thesiMap(Arena.ego.trapezi.partidaEpomenosGet());
	if (thesi == 1) {
		if (Arena.ego.isPektis()) {
			Arena.partida.enimerosiDOM.addClass('tsoxaEnimerosiΑΛΛΑΓΗactive');
			kimeno = 'Αλλάξτε δύο φύλλα και δηλώστε την αγορά σας, ή γράψτε τα σόλο ' +
				'στην ελάχιστη δυνατή αγορά. Οι συμπαίκτες σας περιμένουν…';
			img = 'endixi/nevrikos.gif';
			imgWidth = 40;
		}
		else {
			kimeno = 'Ο παίκτης που παρακολουθείτε αλλάζει φύλλα. Παρακαλώ περιμένετε την αγορά του…';
		}
	}
	else {
		kimeno = 'Ο παίκτης ';
		switch (thesi) {
		case 2:
			kimeno += 'δεξιά';
			break;
		default:
			kimeno += 'αριστερά';
			break;
		}

		kimeno += ' ';
		kimeno += Arena.ego.isPektis() ?  'σας' : 'από τον παίκτη που παρακολουθείτε';
		kimeno += ' αλλάζει φύλλα. Παρακαλώ περιμένετε την αγορά του…';
	}

	Arena.partida.enimerosiFillDOM(kimeno, img, imgWidth);
	return Arena.partida;
};

Arena.partida.enimerosiΣΥΜΜΕΤΟΧΗ = function() {
	var thesi, kimeno, ikona = 'working/atom.gif', ikonaWidth = 30;

	thesi = Arena.ego.thesiMap(Arena.ego.trapezi.partidaEpomenosGet());
	switch (thesi) {
	case 1:
		if (Arena.ego.isPektis()) {
			Arena.partida.enimerosiDOM.addClass('tsoxaEnimerosiΣΥΜΜΕΤΟΧΗactive');
			kimeno = 'Αποφασίστε αν θα διεκδικήσετε τις μπάζες που σας αναλογούν. ' +
				'Οι συμπαίκτες σας περιμένουν…'
			ikona = 'endixi/nevrikos.gif';
			ikonaWidth = 40;
		}
		else {
			kimeno = 'Ο παίκτης που παρακολουθείτε σκέφτεται αν θα διεκδικήσει ' +
				'τις μπάζες που του αναλογούν. Παρακαλώ περιμένετε…';
		}
		break;
	default:
		kimeno = 'Ο παίκτης ' + (thesi == 2 ? 'δεξιά' : 'αριστερά') + ' ' +
			(Arena.ego.isPektis() ?  'σας' : 'από τον παίκτη που παρακολουθείτε') +
			' σκέφτεται αν θα διεκδικήσει τις μπάζες που του αναλογούν. Παρακαλώ περιμένετε…';
		break;
	}

	Arena.partida.enimerosiFillDOM(kimeno, ikona, ikonaWidth);
	return Arena.partida;
};

Arena.partida.enimerosiΠΑΙΧΝΙΔΙ = function() {
	Arena.partida.enimerosiDOM.css('display', 'none');
	if (Arena.ego.oxiPektis())
	return Arena.partida;

	if (Arena.partida.oxiEpomenos(Arena.ego.thesiGet()))
	return Arena.partida;

	if (Arena.partida.akirosiKiniseon())
	return Arena.partida;

	Arena.partida.enimerosiDOM.
	css('display', 'block').
	text('Παίξτε ένα φύλλο…')

	return Arena.partida;
};

Arena.partida.enimerosiΠΛΗΡΩΜΗ = function() {
	Arena.partida.enimerosiFillDOM('Γίνεται πληρωμή. Παρακαλώ περιμένετε…', 'endixi/pliromi.gif');
	return Arena.partida;
};
