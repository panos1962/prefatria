Arena.partida = {
	// Το property "pektisPhotoOpacity" δείχνει την default opacity των
	// φωτογραφιών προφίλ παίκτη.

	pektisPhotoOpacity: 0.1,
};

Arena.partida.flags = {
	// Η flag "amolimeni" δείχνει αν το DOM element της παρτίδας είναι
	// χειραφετημένο ή αγκυρωμένο σε σταθερή θέση. Πρόκειται για ακέραιο
	// που παίρνει τις παρακάτω τιμές:
	//
	//	0	Σταθερό, συμμορφωμένο με το γενικότερο πλαίσιο.
	//
	//	1	Χειραφετημένο, συρόμενο.
	//
	//	2	Χειραφετημένο, σταθεροποιημένο.
	//
	// Η τιμή της flag αλλάζει με πλήκτρα από το control panel.

	amolimeni: 0,

	// Η flag "niofertosView" δείχνει αν θα εμφανίζονται οι νεοφερμένοι στην
	// παρτίδα του χρήστη. Πρόκειται για στενή λωρίδα πάνω από την τσόχα στην
	// οποία εμφανίζονται οι νεοφερμένοι, δηλαδή οι παίκτες που εισέρχονται
	// στο καφενείο. Η αλλαγή της τιμής της flag γίνεται με πλήκτρο στο πάνελ
	// προσκλήσεων.

	niofertosView: true,

	// Η flag "fanera23" δείχνει αν τα φύλλα Ανατολής και Δύσης είναι ανοικτά.
	// Τα φύλλα Ανατολής και Δύσης μπορούν δεν μπορούν να είναι ανοικτά όταν
	// συμμετέχουμε ως παίκτες σε κάποια παρτίδα, αλλά οι θεατές έχουν αυτή
	// τη δυνατότητα. Η αλλαγή της τιμής της flag γίνεται με πλήκτρο (βατραχάκι)
	// στο control panel.

	fanera23: false,

	// Η flag "azab" δείχνει αν η προηγούμενη μπάζα που παίχτηκε είναι εμφανής
	// η κρυμμένη. Η αλλαγή της τιμής της flag γίνεται με κατάλληλο πλήκτρο στο
	// control panel.

	azab: false,

	// Η flag "skarta" δείχνει αν στη θέση που εμφανίζεται η προηγούμενη μπάζα
	// εμφανίζονται τα σκάρτα αντί της τελευταίας μπάζας. Αυτό επιτυγχάνεται
	// με κλικ στην περιοχή εμφάνισης της τελευταίας μπάζας.

	skarta: false,
};

Arena.partida.niofertosView = function() {
	return Arena.partida.flags.niofertosView;
};

Arena.partida.isFanera23 = function() {
	return Arena.partida.flags.fanera23;
};

Arena.partida.oxiFanera23 = function() {
	return !Arena.partida.isFanera23();
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.partida.setup = function() {
	Arena.partida.niofertosDOM = $('<div>').attr({
		id: 'niofertos',
		title: 'Περιοχή νεοφερμένων',
	}).appendTo(Arena.partidaDOM);

	Arena.partida.tsoxaDOM = $('<div>').attr('id', 'tsoxa').appendTo(Arena.partidaDOM);


	Arena.partida.thesiWalk(function(thesi) {
		var pektisDOM, filaDOM;

		pektisDOM = Arena.partida['pektis' + thesi + 'DOM'] = $('<div>').attr('id', 'tsoxaPektis' + thesi).
		addClass('tsoxaPektis').appendTo(Arena.partida.tsoxaDOM);

		filaDOM = Arena.partida['fila' + thesi + 'DOM'] = $('<div>').attr('id', 'tsoxaFila' + thesi).
		addClass('tsoxaFila').appendTo(Arena.partida.tsoxaDOM);

		Arena.partida['pliromi' + thesi + 'DOM'] = $('<div>').attr('id', 'tsoxaPektisPliromi' + thesi).
		addClass('tsoxaPektisPliromi').appendTo(Arena.partida.tsoxaDOM);

		if (thesi === 1) return;

		pektisDOM.on('mouseleave', function(e) {
			e.stopPropagation();
			if (Debug.flagGet('striptiz')) return;
			filaDOM.css('visibility', Arena.partida.isFanera23() ? 'visible' : 'hidden');
		});

		filaDOM.on('mouseenter', function(e) {
			e.stopPropagation();
			if (Debug.flagGet('striptiz')) return;
			filaDOM.css('visibility', 'hidden');
		});
	});

	Arena.partida.tsoxaDOM.
	append(Arena.partida.dataPanoDOM = $('<div>').attr('id', 'tsoxaDataPano').addClass('tsoxaData')).
	append(Arena.partida.dataKatoDOM = $('<div>').attr('id', 'tsoxaDataKato').addClass('tsoxaData')).
	append(Arena.partida.tzogosDOM = $('<div>').attr('id', 'tsoxaTzogos')).
	append(Arena.partida.azabDOM = $('<div>').addClass('tsoxaAzab')).
	append(Arena.partida.filaPrevDOM = $('<div>').attr({
		id: 'tsoxaFilaPrev',
		title: 'Προηγούμενη χαρτωσιά',
	})).
	append(Arena.partida.enimerosiDOM = $('<div>').attr('id', 'tsoxaEnimerosi')).
	append(Arena.partida.dilosiPanelDOM = $('<div>').attr('id', 'tsoxaDilosiPanel')).
	append(Arena.partida.agoraPanelDOM = $('<div>').attr('id', 'tsoxaAgoraPanel')).
	append(Arena.partida.dialogosDOM = $('<div>').attr('id', 'tsoxaDialogos').addClass('dialogos'));

	Arena.partida.theatisDOM = $('<div>').attr('id', 'theatis').appendTo(Arena.partida.tsoxaDOM);
	Arena.partida.optionsDOM = $('<div>').attr('id', 'tsoxaOptions').appendTo(Arena.partidaDOM);
	Arena.partida.soloEndixiDOM = null;
	Arena.kitapi.setup();
	Arena.partida.setupPliromi();
	Arena.partida.setupTzogos();
	Arena.partida.setupAzab();
	Arena.partida.setupPhoto();
	Arena.partida.setupGiorti();

	return Arena;
};

Arena.partida.setupGiorti = function() {
	var tora, minas, mera, img, ixos, imgDOM;

	tora = new Date();
	minas = tora.getMonth() + 1;
	mera = tora.getDate();
	img = undefined;
	ixos = undefined;

	switch (minas) {
	case 12:
		img = 'ikona/giorti/xmas.gif';
		ixos = Funchat.server + 'xmas.mp3';
		break;
	case 1:
		if (mera > 15)
		return;

		img = 'ikona/giorti/neoEtos.gif';
		ixos = Funchat.server + 'xmas.mp3';
		break;
	default:
		return;
	}

	if (img === undefined)
	return Arena;

	Arena.partidaDOM.
	append(imgDOM = $('<img>').attr({
		id: 'tsoxaGiortiIcon',
		src: img,
	}));

	if (ixos === undefined)
	return Arena;

	imgDOM.
	append($('<audio>').attr({
		src: ixos,
	})).
	css('cursor', 'crosshair').
	attr('title', 'Play music').
	on('click', function(e) {
		var ixos, pezi;

		e.stopPropagation();

		ixos = $(this).children('audio');

		if (!ixos)
		return;

		ixos = ixos.get(0);

		if (!ixos)
		return;

		pezi = $(this).data('pezi');

		if (pezi) {
			ixos.pause();
			ixos.currentTime = 0;
			$(this).
			removeData('pezi').
			attr('title', 'Play music').
			css('cursor', 'crosshair');
		}

		else {
			ixos.play();
			$(this).
			data('pezi', true).
			attr('title', 'Stop music').
			css('cursor', 'not-allowed');
		}
	});

	return Arena;
};

Arena.partida.setupPhoto = function() {
	// Όταν περνάμε τον δείκτη του ποντικιού πάνω από την περιοχή
	// εμφάνισης φάσης παρτίδας (κάτω αριστερά), αλλάζουμε το opacity
	// των φωτογραφιών προφίλ όλων των παικτών. Αν οι φωτογραφίες
	// είναι διαυγείς, τις κάνουμε αχνές και τούμπαλιν. Με κλικ στην
	// ίδια περιοχή έχουμε αντιστροφή της διαδικασίας.

	$(document).
	on('mouseenter', '.tsoxaPartidaInfo', function() {
		$('.tsoxaPektisPhoto').finish().
		fadeTo(50, Arena.partida.pektisPhotoOpacity === 1 ? 0.1 : 1);
		Client.fyi.kato('Κλικ για <span class="entona ' + (Arena.partida.pektisPhotoOpacity === 1 ?
			'kokino">απόκρυψη' : 'prasino">εμφάνιση') + '</span> φωτογραφιών προφίλ', 0);
	}).
	on('mouseleave', '.tsoxaPartidaInfo', function() {
		$('.tsoxaPektisPhoto').finish().fadeTo(200, Arena.partida.pektisPhotoOpacity);
		Client.fyi.kato();
	}).
	on('click', '.tsoxaPartidaInfo', function() {
		Arena.partida.pektisPhotoOpacity = (Arena.partida.pektisPhotoOpacity === 1 ? 0.1 : 1);
		$('.tsoxaPektisPhoto').finish().fadeTo(50, Arena.partida.pektisPhotoOpacity);
		Client.fyi.kato();
	});

	return Arena;
};

Arena.partida.setupTzogos = function() {
	Arena.partida.tzogosDOM.
	attr('title', 'Τζόγος').
	on('click', function(e) {
		if (!Arena.ego.trapezi.tzogosPrev)
		return;

		$(this).data('faneros', !$(this).data('faneros'));
		Arena.partida.tzogosRefreshDOM();
	}).
	on('mouseenter', function() {
		Arena.partida.azabDOM.addClass('tsoxaAzabEmfanis');
	}).
	on('mouseleave', function() {
		Arena.partida.azabDOM.removeClass('tsoxaAzabEmfanis');
	});

	return Arena;
};

// Με την function "setupAzab" θέτουμε mouse event listeners για την περιοχή
// εμφάνισης της τελευταίας μπάζας.

Arena.partida.setupAzab = function() {
	Arena.partida.azabDOM.

	// Οταν περνάμε τον δείκτη του ποντικιού πάνω από την περιοχή εμφάνισης
	// της τελευταίας μπάζας, τότε αυτή η περιοχή γίνεται διαυγής.

	on('mouseenter', function() {
		Arena.partida.azabDOM.addClass('tsoxaAzabEmfanis');
	}).

	// Όταν αποσύρουμε τον δείκτη του ποντικιού από την περιοχή εμφάνισης της
	// τελευταίας μπάζας, τότε αυτή η περιοχή γίνεται αχνή.

	on('mouseleave', function() {
		Arena.partida.azabDOM.removeClass('tsoxaAzabEmfanis');
	}).

	// Κάνοντας κλικ επάνω στην περιοχή εμφάνισης της τελευταίας μπάζας, αλλάζουμε
	// το περιεχόμενο της περιοχής αυτής. Πράγματι, σ' αυτήν την περιοχή εμφανίζεται
	// by default η τελευταία μπάζα, εφόσον η διανομή βρίσκεται σε φάση παιχνιδιού,
	// αλλιώς εμφανίζονται τα φύλλα του τζόγου της προηγούμενης διανομής. Ο τζογαδόρος,
	// όμως, μπορεί να κάνει κλικ και να εμφανίσει τα σκάρτα στην ίδια περιοχή.

	on('click', function(e) {
		var tzogadoros;

		Arena.inputRefocus(e);

		if (Arena.ego.oxiTrapezi())
		return;

		if (Arena.ego.isPektis()) {
			tzogadoros = Arena.ego.trapezi.partidaTzogadorosGet();
			if (!tzogadoros) return;
			if (Arena.ego.oxiThesi(tzogadoros)) return;
		}

		Arena.partida.flags.skarta = !Arena.partida.flags.skarta;
		Arena.partida.azabRefreshDOM();
	});

	return Arena;
};

Arena.partida.setupPliromi = function() {
	Arena.partida.pliromiIconDOM = $('<img>').attr({
		id: 'tsoxaPliromiIcon',
		src: 'ikona/panel/kapikia.png',
		title: 'Καπίκια τελευταίας πληρωμής',
	}).
	on('mouseenter', function(e) {
		$('.tsoxaPektisPliromi').finish().fadeIn(100);
	}).
	on('mouseleave', function(e) {
		$('.tsoxaPektisPliromi').finish().fadeOut(200);
	}).
	on('click', function(e) {
		Arena.inputRefocus(e);
		Arena.kitapi.iconDOM.trigger('click');
	}).
	appendTo(Arena.partida.tsoxaDOM);

	return Arena;
};

// Η function "refreshDOM" επαναδιαμορφώνει τα βασικά DOM elements της παρτίδας,
// ήτοι την τσόχα και τους θεατές. Αν επιθυμούμε επαναδιαμόρφωση και της συζήτησης
// της συγκεκριμένης παρτίδας, τότε περνάμε σχετική παράμετρο.

Arena.partida.refreshDOM = function(opts) {
	if (opts === undefined) opts = {};
	else if (opts === true) opts = {
		sizitisi: true,
	};

	Arena.partida.
	trapeziRefreshDOM().
	theatisRefreshDOM();

	if (opts.sizitisi)
	Arena.partida.sizitisiRefreshDOM();

	return Arena.partida;
};

Arena.partida.dialogosClearDOM = function() {
	Arena.partida.dialogosDOM.css('display', '').empty();
	return Arena.partida;
};

Arena.partida.soloEndixiClearDOM = function() {
	if (!Arena.partida.soloEndixiDOM)
	return Arena.partida;

	Arena.partida.soloEndixiDOM.remove();
	Arena.partida.soloEndixiDOM = null;
	return Arena.partida;
};

Arena.partida.trapeziRefreshDOM = function() {
	Arena.partida.
	dialogosClearDOM().
	soloEndixiClearDOM().
	peximoTheasiRefreshDOM().
	dataPanoRefreshDOM().
	dataKatoRefreshDOM().
	pliromiRefreshDOM().
	enimerosiRefreshDOM().
	pektisRefreshDOM().
	dixeKripseFila().
	filaRefreshDOM().
	tzogosRefreshDOM().
	bazaRefreshDOM().
	azabRefreshDOM().
	claimRefreshDOM().
	efoplismos();
	return Arena.partida;
};

Arena.partida.peximoTheasiRefreshDOM = function() {
	Arena.partida.tsoxaDOM.
	removeClass('tsoxaPeximo tsoxaTheasi');

	if (Arena.ego.isTheatis()) {
		Arena.partida.tsoxaDOM.addClass('tsoxaTheasi').
		children('#tsoxaPektis3,#tsoxaPektis2').
		attr('title', 'Κλικ για αλλαγή θέσης θέασης').
		css('cursor', 'crosshair');
	}
	else {
		Arena.partida.tsoxaDOM.
		addClass('tsoxaPeximo').
		children('.tsoxaPektis').
		attr('title', '').
		css('cursor', 'auto');
	}

	return Arena.partida;
};

// Η function "dixeKripseFila" εμφανίζει η αποκρύπτει τα φύλλα Ανατολής και Δύσης
// ανάλογα με την τιμή της σχετικής flag.

Arena.partida.dixeKripseFila = function() {
	var visibility;

	visibility = (Arena.partida.filaFanera23() ? 'visible' : 'hidden');
	Arena.partida['fila3DOM'].css('visibility', visibility);
	Arena.partida['fila2DOM'].css('visibility', visibility);
	return Arena.partida;
};

Arena.partida.filaFanera23 = function() {
	if (Arena.partida.oxiFanera23()) return false;
	if (Arena.ego.isAnergos()) return true;
	if (Debug.flagGet('striptiz')) return true;
	return Arena.ego.oxiPektis();
};

Arena.partida.theatisRefreshDOM = function() {
	Arena.partida.theatisDOM.children().detach();
	Arena.skiniko.skinikoSinedriaWalk(function() {
		if (this.sinedriaOxiTheatis())
		return;

		if (this.sinedriaOxiTrapezi(Arena.ego.trapeziKodikos))
		return;

		Arena.partida.theatisPushDOM(this);
	}, 1);
	return Arena.partida;
};

// Για λόγους που δεν γνωρίζω, η σκίαση των θεατών στην τσόχα «ακυρώνεται» δεξιά
// λόγω του scroll overflow. Για να το παρακάμψω χρησιμοποιώ φαρδύτερο κέλυφος.

Arena.partida.theatisPushDOM = function(sinedria) {
	Arena.partida.theatisDOM.prepend($('<div>').addClass('tsoxaTheatisKelifos').append(sinedria.tsoxaTheatisDOM));
	return Arena.partida;
}

Arena.partida.sizitisiRefreshDOM = function() {
	Arena.sizitisi.trapeziDOM.empty();
	if (Arena.ego.oxiTrapezi())
	return Arena.partida;

	Arena.ego.trapezi.trapeziSizitisiWalk(function() {
		this.sizitisiCreateDOM();
	}, 1);

	if (Arena.sizitisi.oxiPagomeni()) {
		Arena.sizitisi.areaDOM.scrollKato({
			repeatAfter: 200,
		});
	}

	return Arena.partida;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.partida.dataPanoClearDOM = function() {
	Arena.partida.ipolipoClearDOM();
	Arena.partida.dataPanoDOM.empty();
	Arena.partida.optionsDOM.empty();
	return Arena.partida;
};

Arena.partida.dataPanoRefreshDOM = function() {
	var dianomiDOM, ipolipoDOM, x;

	Arena.partida.dataPanoClearDOM();
	if (Arena.ego.oxiTrapezi()) return Arena.partida;

	Arena.partida.dataPanoDOM.
	append($('<div>').attr('id', 'tsoxaPartidaData').
	append($('<div>').attr('id', 'tsoxaKodikos').addClass('sinefo').
	attr('title', 'Κωδικός τραπεζιού').text(Arena.ego.trapezi.trapeziKodikosGet())).
	append(dianomiDOM = $('<div>').attr('id', 'tsoxaDianomi')).
	append(kasaDOM = $('<div>').attr('id', 'tsoxaKasa')).
	append(ipolipoDOM = $('<div>').attr('id', 'tsoxaIpolipo')));

	if (Arena.ego.trapezi.trapeziIsIdioktito())
	Arena.partida.optionsDOM.append($('<img>').addClass('tsoxaOption').attr({
		src: 'ikona/panel/' + (Arena.ego.isThesi(1) ? 'elefthero.png' : 'idioktito.png'),
		title: 'Ιδιόκτητο τραπέζι',
	}));

	if (Arena.ego.trapezi.trapeziIsAorato())
	Arena.partida.optionsDOM.append($('<img>').addClass('tsoxaOption').attr({
		src: 'ikona/panel/aorato.png',
		title: 'Αόρατο τραπέζι',
	}));

	if (Arena.ego.trapezi.trapeziIsPrive()) {
		Arena.partida.tsoxaDOM.addClass('priveTrapezi');
		Arena.partida.optionsDOM.append($('<img>').addClass('tsoxaOption').attr({
			src: 'ikona/panel/prive.png',
			title: 'Πριβέ τραπέζι',
		}));
	}
	else {
		Arena.partida.tsoxaDOM.removeClass('priveTrapezi');
	}

	if (Arena.ego.trapezi.trapeziIsKlisto())
	Arena.partida.optionsDOM.append($('<img>').addClass('tsoxaOption').attr({
		src: 'ikona/panel/klisto.png',
		title: 'Κλειστό τραπέζι',
	}));

	if (Arena.ego.trapezi.trapeziIsFiliki())
	Arena.partida.optionsDOM.append($('<img>').addClass('tsoxaOption').attr({
		src: 'ikona/panel/filiki.png',
		title: 'Εκπαιδευτική/Φιλική παρτίδα',
	}));

	if (Arena.ego.trapezi.trapeziTeliomaAnisoropo())
	Arena.partida.optionsDOM.append($('<img>').addClass('tsoxaOption').attr({
		src: 'ikona/panel/postel/anisoropo.png',
		title: 'Ανισόρροπη πληρωμή τελευταίας αγοράς',
	}));

	else if (Arena.ego.trapezi.trapeziTeliomaDikeo())
	Arena.partida.optionsDOM.append($('<img>').addClass('tsoxaOption').attr({
		src: 'ikona/panel/postel/dikeo.png',
		title: 'Δίκαιη πληρωμή τελευταίας αγοράς',
	}));

	if (Arena.ego.trapezi.trapeziOxiAsoi())
	Arena.partida.optionsDOM.append($('<img>').addClass('tsoxaOption').attr({
		src: 'ikona/panel/asoiOn.png',
		title: 'Δεν παίζονται οι άσοι',
	}));

	if (Arena.ego.trapezi.trapeziIsPaso())
	Arena.partida.optionsDOM.append($('<img>').addClass('tsoxaOption').attr({
		src: 'ikona/panel/pasoOn.png',
		title: 'Παίζεται το πάσο',
	}));

	if (Arena.ego.isEpidotisi() && Arena.ego.isPektis())
	Arena.partida.optionsDOM.append($('<img>').addClass('tsoxaOption').attr({
		src: 'ikona/panel/epidotisiOff.png',
		title: 'Επιδοτούμενος',
	}));

	if (Arena.ego.trapezi.trapeziIsTournoua())
	Arena.partida.optionsDOM.append($('<img>').addClass('tsoxaOption').attr({
		src: 'ikona/panel/tournoua.png',
		title: 'Παρτίδα τουρνουά',
	}));

	x = Arena.ego.trapezi.trapeziEpetiakiGet();
	if (x)
	Arena.partida.optionsDOM.append($('<img>').addClass('tsoxaOption').attr({
		src: 'ikona/panel/epetiakiOn.png',
		title: x,
	}));

	Arena.partida.
	dianomiRefreshDOM(dianomiDOM).
	kasaRefreshDOM(kasaDOM).
	ipolipoRefreshDOM(ipolipoDOM);
	return Arena.partida;
};

Arena.partida.dataKatoClearDOM = function() {
	Arena.partida.dataKatoDOM.empty();
	return Arena.partida;
};

Arena.partida.dataKatoRefreshDOM = function() {
	var akirosi;

	Arena.partida.dataKatoClearDOM();
	if (Arena.ego.oxiTrapezi()) return Arena.partida;

	Arena.partida.dataKatoDOM.
	append($('<div>').addClass('tsoxaPartidaInfo').
	append($('<div>').addClass('tsoxaPartidaInfoFasi').
	text(Arena.ego.trapezi.partidaFasiGet())));

	akirosi = Arena.ego.trapezi.trapeziAkirosiGet();
	if (!akirosi) return Arena.partida;

	Arena.partida.dataKatoDOM.append($('<div>').addClass('tsoxaPartidaInfoAkirosi').
		html('Ο παίκτης <div class="tsoxaPartidaInfoAkirosiLogin">' +
			akirosi + '</div> ακυρώνει κινήσεις&hellip;'));
	return Arena.partida;
};

Arena.partida.dianomiRefreshDOM = function(dom) {
	var dianomi;

	if (dom === undefined) dom = $('#tsoxaDianomi');

	dianomi = Arena.ego.trapezi.trapeziTelefteaDianomi();
	if (!dianomi) {
		dom.css('display', 'none');
		return Arena.partida;
	}

	dom.css('display', 'inline-block');
	dom.addClass('sinefo').attr('title', 'Κωδικός τρέχουσας διανομής').text(dianomi.dianomiKodikosGet());
	return Arena.partida;
};

Arena.partida.kasaRefreshDOM = function(dom) {
	var kasa;

	if (!Arena.ego.trapezi) return Arena.partida;

	if (dom === undefined) dom = $('#tsoxaKasa');

	kasa = Arena.ego.trapezi.trapeziKasaGet();
	if (!kasa) kasa = 0;
	else kasa *= 3;
	dom.addClass('sinefo').attr('title', 'Αρχική κάσα').text(kasa);
	return Arena.partida;
};

Arena.partida.ipolipoClearDOM = function() {
	Arena.partida.tsoxaDOM.find('.tsoxaTelosIcon').remove();
	return Arena.partida;
};

Arena.partida.ipolipoRefreshDOM = function(dom) {
	var ipolipo;

	Arena.partida.ipolipoClearDOM();
	if (!Arena.ego.trapezi) return Arena.partida;

	if (dom === undefined) dom = $('#tsoxaIpolipo');

	ipolipo = Arena.ego.trapezi.trapeziIpolipoGet();
	dom.addClass('sinefo').attr('title', 'Τρέχον υπόλοιπο κάσας').text(ipolipo / 10);
	if (ipolipo <= 0) {
		dom.addClass('tsoxaIpolipoMion');
		Arena.partida.tsoxaDOM.append($('<img>').addClass('tsoxaTelosIcon').attr({
			src: 'ikona/endixi/telos.png',
			title: 'Η κάσα έχει τελειώσει',
		}));
	}
	else {
		if (ipolipo < 300) dom.addClass('tsoxaIpolipoLigo');
		else dom.removeClass('tsoxaIpolipoLigo');
	}

	return Arena.partida;
};

Arena.partida.pliromiRefreshDOM = function() {
	var kapikia;

	$('.tsoxaPektisPliromi').empty();

	if (Arena.ego.oxiTrapezi()) {
		Arena.partida.pliromiIconDOM.css('display', 'none');
		return Arena.partida;
	}

	Arena.partida.pliromiIconDOM.css('display', 'block');
	if (!Arena.ego.trapezi.telefteaPliromi)
	Arena.ego.trapezi.telefteaPliromiSet();

	kapikia = Arena.ego.trapezi.telefteaPliromi;
	Arena.ego.trapezi.trapeziThesiWalk(function(thesi) {
		var iseht, pliromiDom, posoDom;

		if (kapikia[thesi] === 0) return;

		// Εντοπίζουμε το DOM element εμφάνισης πληρωμής για την
		// ανά χείρας θέση.

		iseht = Arena.ego.thesiMap(thesi);
		pliromiDom = Arena.partida['pliromi' + iseht + 'DOM'];
		pliromiDom.empty();

		// Δημιουργούμε το DOM element του ποσού που αντιστοιχεί στην
		// ανά χείρας θέση.

		posoDom = $('<div>').removeClass('tsoxaPektisPliromiPosoSin tsoxaPektisPliromiPosoMion').
		text(kapikia[thesi]).addClass('tsoxaPektisPliromiPoso').
		addClass(kapikia[thesi] > 0 ? 'tsoxaPektisPliromiPosoSin' : 'tsoxaPektisPliromiPosoMion');

		pliromiDom.append(posoDom);
	});

	return Arena.partida;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.partida.thesiWalk = function(callback) {
	Prefadoros.thesiWalk(callback);
	return Arena.partida;
};

Arena.partida.pektisClearDOM = function(thesi) {
	if (thesi === undefined) return Arena.partida.thesiWalk(function(thesi) {
		Arena.partida.pektisClearDOM(thesi);
	});

	iseht = Arena.ego.thesiMap(thesi);
	Arena.partida['pektis' + iseht + 'DOM'].empty();
	return Arena.partida;
};

Arena.partida.pektisRefreshDOM = function(thesi) {
	var login, pektis, iseht, dom, domMain, domOnoma, domKapikia, domAgora, domDilosi, domBazes;

	if (thesi === undefined) return Arena.partida.thesiWalk(function(thesi) {
		Arena.partida.pektisRefreshDOM(thesi);
	});

	Arena.partida.pektisClearDOM(thesi);
	if (Arena.ego.oxiTrapezi())
	return Arena.partida;

	login = Arena.ego.trapezi.trapeziPektisGet(thesi);
	pektis = Arena.skiniko.skinikoPektisGet(login);

	iseht = Arena.ego.thesiMap(thesi);
	dom = Arena.partida['pektis' + iseht + 'DOM'].
	append(domMain = Arena.partida['pektisMain' + iseht + 'DOM'] = $('<div>').
		attr('id', 'tsoxaPektisMain' + iseht).addClass('tsoxaPektisMain').
	append(Arena.partida['pektisOptions' + iseht + 'DOM'] = $('<div>').addClass('tsoxaPektisOptions')).
	append(domOnoma = $('<div>').addClass('tsoxaPektisOnoma')).
	append(domKapikia = $('<div>').addClass('tsoxaPektisKapikia')).
	append(domAgora = $('<div>').addClass('tsoxaPektisAgora'))).
	append(domDilosi = $('<div>').attr('id', 'tsoxaPektisDilosi' + iseht).addClass('tsoxaPektisDilosi')).
	append(domBazes = $('<div>').attr('id', 'tsoxaPektisBazes' + iseht).addClass('tsoxaPektisBazes'));

	if (Arena.ego.isTheatis())
	domMain.addClass('tsoxaPektisMainTheasi');

	Arena.partida['pektisMain' + iseht + 'DOM'] = domMain;
	Arena.partida['pektisOnoma' + iseht + 'DOM'] = domOnoma;
	Arena.partida['pektisKapikia' + iseht + 'DOM'] = domKapikia;
	Arena.partida['pektisAgora' + iseht + 'DOM'] = domAgora;
	Arena.partida['pektisDilosi' + iseht + 'DOM'] = domDilosi;
	Arena.partida['pektisBazes' + iseht + 'DOM'] = domBazes;

	Arena.partida.
	pektisPhotoRefreshDOM(thesi, iseht, domMain).
	pektisDataRefreshDOM(thesi, iseht, domMain, domOnoma).
	pektisKapikiaRefreshDOM(thesi, iseht, domKapikia).
	pektisAgoraRefreshDOM(thesi, iseht, domAgora).
	pektisDilosiRefreshDOM(thesi, iseht, domDilosi).
	pektisBazesRefreshDOM(thesi, iseht, domBazes).
	pektisAnamoniRefreshDOM(thesi, iseht, domMain);

	if (Arena.partida.isDealer(thesi)) domMain.append($('<img>').
	addClass('tsoxaPektisIcon').attr({
		src: 'ikona/endixi/dealer.png',
		title: 'Μοιράζει φύλλα',
	}));

	if (Arena.partida.isProtos(thesi)) domMain.append($('<img>').
	addClass('tsoxaPektisIcon').attr({
		src: 'ikona/endixi/protos.png',
		title: 'Πρώτος παίκτης μετά τον παίκτη που μοίρασε',
	}));

	if (Arena.ego.trapezi.partidaIsClaim(thesi)) domMain.append($('<img>').
	addClass('tsoxaPektisIcon tsoxaPektisIconClaim').attr({
		src: 'ikona/panel/claim.png',
		title: 'Παραιτήθηκε από τις υπόλοιπες μπάζες',
	}));

	if (Arena.partida.isEpomenos(thesi))
	domMain.addClass('tsoxaPektisEpomenos');

	switch (Arena.ego.trapezi.partidaFasiGet()) {
	case 'ΠΑΙΧΝΙΔΙ':
	case 'CLAIM':
	case 'ΠΛΗΡΩΜΗ':
		if (Arena.ego.trapezi.sdilosi[thesi]) {
			if (Arena.ego.trapezi.sdilosi[thesi].simetoxiIsPaso())
			domMain.addClass('apoxi');

			else if (Arena.ego.trapezi.sdilosi[thesi].simetoxiIsMazi())
			domMain.append($('<img>').
			addClass('tsoxaPektisIcon tsoxaPektisIconMazi').attr({
				src: Client.server + 'ikona/endixi/mazi.png',
				title: 'Πήρε τον συμπαίκτη να παίξουν μαζί',
			}));
		}
		break;
	}

	domMain.
	on('mouseenter', function(e) {
		e.stopPropagation();
		Arena.partida.thesiCandi = thesi;
		if (pektis) pektis.pektisFyiInfo();
		$(this).children('.tsoxaPektisPhoto').finish().animate({
			opacity: Arena.partida.pektisPhotoOpacity === 1 ? 0.1 : 1,
		}, 50);
	}).
	on('mouseleave', function(e) {
		e.stopPropagation();
		delete Arena.partida.thesiCandi;
		if (pektis) Client.fyi.pano();
		$(this).children('.tsoxaPektisPhoto').finish().animate({
			opacity: Arena.partida.pektisPhotoOpacity,
		}, 200);
	});

	// Αλλαγή θέσης θέασης.

	dom.off('click');

	if (Arena.ego.isTheatis())
	dom.on('click', function(e) {
		Arena.inputRefocus(e);
		if (Arena.ego.isThesi(thesi)) return;

		Client.fyi.pano('Αλλαγή θέσης θέασης. Παρακαλώ περιμένετε…');
		Client.skiserService('thesiTheasis', 'thesi=' + thesi).
		done(function(rsp) {
			Client.fyi.pano();
		}).
		fail(function(err) {
			Client.skiserFail(err);
		});
	});

	return Arena.partida;
};

// Η function "pektisDataRefreshDOM" δέχεται ως παράμετρο τη θέση κάποιου παίκτη
// στο τραπέζι και ενημερώνει τα DOM elements που αφορούν στα στοιχεία και στην
// κατάσταση του παίκτη. Αν δεν καθορίσουμε θέση, τότε η function καλείται και
// για τους τρεις παίκτες του τραπεζιού.

Arena.partida.pektisDataRefreshDOM = function(thesi, iseht, domMain, domOnoma) {
	var login, sinedria, pektis;

	if (Arena.ego.oxiTrapezi())
	return Arena.partida;

	if (thesi === undefined) return Arena.partida.thesiWalk(function(thesi) {
		Arena.partida.pektisDataRefreshDOM(thesi);
	});

	if (iseht === undefined) iseht = Arena.ego.thesiMap(thesi);
	if (domMain === undefined) domMain = Arena.partida['pektisMain' + iseht + 'DOM'];
	if (domOnoma === undefined) domOnoma = Arena.partida['pektisOnoma' + iseht + 'DOM'];

	domMain.removeClass('apodoxi xapodoxi offline fevgatos apasxolimenos anazitisiAttract');
	domOnoma.removeClass('fantasma sxesiFilos sxesiApoklismenos');

	domMain.addClass(Arena.ego.trapezi.trapeziIsApodoxi(thesi) ? 'apodoxi' : 'xapodoxi');
	domMain.children('.tsoxaProfinfoIcon').remove();

	login = Arena.ego.trapezi.trapeziPektisGet(thesi);

	if (Arena.anazitisi.patternMatch(login))
	domMain.addClass('anazitisiAttract');

	if (!login) {
		domMain.addClass('fevgatos');
		login = Arena.ego.trapezi.trapeziTelefteosGet(thesi);
		if (login) domOnoma.addClass('fantasma').html(login);
		return Arena.partida;
	}

	sinedria = Arena.skiniko.skinikoSinedriaGet(login);
	if (!sinedria) domMain.addClass('offline');

	domOnoma.html(login);
	if (Arena.ego.isFilos(login)) domOnoma.addClass('sxesiFilos');
	else if (Arena.ego.isApoklismenos(login)) domOnoma.addClass('sxesiApoklismenos');

	pektis = Arena.skiniko.skinikoPektisGet(login);
	if (!pektis) return Arena.partida;

	Arena.partida.profinfoIconRefreshDOM(login, domMain);

	if (pektis.pektisIsApasxolimenos())
	domMain.addClass('apasxolimenos');

	return Arena.partida;
};

Arena.partida.profinfoIconRefreshDOM = function(login, dom) {
	var pektis, ikonidio, titlos, emfanes, profinfoDom;

	dom.children('.tsoxaProfinfoIcon').remove();
	pektis = Arena.skiniko.skinikoPektisGet(login);

	if (!pektis)
	return Arena.partida;

	ikonidio = 'ikona/axioma/thamonas.png';
	titlos = null;

	emfanes = false;
	if (Arena.ego.emfaniDiakritika()) {
		if (pektis.pektisIsEpidotisi()) {
			ikonidio = 'ikona/panel/epidotisiOff.png';
			titlos = 'Επιδοτούμενος';
			emfanes = true;
		}

		else {
			switch (titlos = pektis.pektisAxiomaGet()) {
			case 'ΠΡΟΕΔΡΟΣ':
				ikonidio = 'ikona/axioma/proedros.png';
				break;
			case 'ADMINISTRATOR':
				ikonidio = 'ikona/axioma/administrator.png';
				break;
			case 'ΔΙΑΧΕΙΡΙΣΤΗΣ':
				ikonidio = 'ikona/axioma/diaxiristis.png';
				break;
			case 'ΕΠΟΠΤΗΣ':
				ikonidio = 'ikona/axioma/epoptis.png';
				break;
			case 'VIP':
				ikonidio = 'ikona/axioma/vip.png';
				break;
			}
		}
	}

	if (titlos) titlos += ' (κλικ για πληροφορίες προφίλ)';
	else titlos = 'Πληροφορίες προφίλ';

	profinfoDom = $('<img>').addClass('tsoxaProfinfoIcon').attr({
		src: ikonidio,
		title: titlos,
	}).
	on('mouseenter', function() {
		if ($(this).data('emfanes')) return;
		$(this).finish().fadeTo(100, 1.0);
	}).
	on('mouseleave', function() {
		if ($(this).data('emfanes')) return;
		$(this).finish().fadeTo(100, 0.01);
	}).
	on('click', function(e) {
		pektis.pektisFormaPopupDOM(e);
	});

	if (emfanes)
	profinfoDom.css('opacity', 1).data('emfanes', true);

	dom.append(profinfoDom);
	return Arena.partida;
};

Arena.partida.pektisPhotoRefreshDOM = function(thesi, iseht, domMain) {
	var login, pektis, photoSrc;

	if (Arena.ego.oxiTrapezi())
	return Arena.partida;

	if (thesi === undefined) return Arena.partida.thesiWalk(function(thesi) {
		Arena.partida.pektisPhotoRefreshDOM(thesi);
	});

	if (iseht === undefined) iseht = Arena.ego.thesiMap(thesi);
	if (domMain === undefined) domMain = Arena.partida['pektisMain' + iseht + 'DOM'];

	domMain.children('.tsoxaPektisPhoto').remove();

	login = Arena.ego.trapezi.trapeziPektisGet(thesi);
	if (!login) return Arena.partida;

	pektis = Arena.skiniko.skinikoPektisGet(login);
	if (!pektis) return Arena.partida;

	photoSrc = pektis.pektisPhotoSrcGet();
	if (!photoSrc) return Arena.partida;

	domMain.append($('<img>').
	addClass('tsoxaPektisPhoto').
	css('opacity', thesi == Arena.partida.thesiCandi ? 1 : Arena.partida.pektisPhotoOpacity).
	attr('src', 'photo/' + photoSrc));

	return Arena.partida;
};

Arena.partida.pektisKapikiaRefreshDOM = function(thesi, iseht, dom) {
	var kapikia, klasi;

	if (thesi === undefined) return Arena.partida.thesiWalk(function(thesi) {
		Arena.partida.pektisKapikiaRefreshDOM(thesi);
	});

	if (Arena.ego.oxiTrapezi()) return Arena.partida;
	if (iseht === undefined) iseht = Arena.ego.thesiMap(thesi);
	if (dom === undefined) dom = Arena.partida['pektisKapikia' + iseht + 'DOM'];

	kapikia = Arena.ego.trapezi.partidaKapikiaGet(thesi);
	if (!kapikia) {
		dom.empty();
		return Arena.partida;
	}

	klasi = 'tsoxaPektisKapikiaPoso';
	if (kapikia < 0) klasi += ' tsoxaPektisKapikiaPosoMion';
	dom.
	append('καπίκια').
	append($('<div>').addClass(klasi).text(Arena.ego.trapezi.partidaKapikiaGet(thesi)));
	return Arena.partida;
};

Arena.partida.pektisAgoraRefreshDOM = function(thesi, iseht, dom) {
	var dlist, agora, tzogadoros, dilosi;

	if (Arena.ego.oxiTrapezi()) return Arena.partida;
	dlist = Arena.ego.trapezi.adilosi;

	if (iseht === undefined) iseht = Arena.ego.thesiMap(thesi);
	if (dom === undefined) dom = Arena.partida['pektisAgora' + iseht + 'DOM'];
	dom.empty().removeClass('tsoxaPektisAgoraTzogadoros tsoxaPektisAgoraTzogadorosCandi');

	// Αν δεν έχει γίνει δήλωση κατά τη φάση της αγοράς από τον συγκεκριμένο παίκτη
	// δεν πρέπει να εμφανίσουμε κάτι στην περιοχή της δήλωσης αγοράς.

	if (!dlist.hasOwnProperty(thesi)) return Arena.partida;

	// Θα ελέγξουμε τώρα αν έχει γίνει αγορά στο τραπέζι και αν ο συγκεκριμένος παίκτης
	// είναι ο τζογαδόρος. Σ' αυτή την περίπτωση θα εμφανίσουμε την αγορά του.

	tzogadoros = Arena.ego.trapezi.partidaTzogadorosGet();
	agora = Arena.ego.trapezi.partidaAgoraGet();
	if (agora && (thesi === tzogadoros)) dilosi = agora;

	// Αλλιώς θα εμφανίσουμε την τελευταία δήλωση που είχε κάνει κατά τη φάση της
	// αγοράς.

	else dilosi = dlist[thesi];

	dom.append(dilosi.dilosiDOM().addClass('tsoxaPektisAgoraDilosi'));
	switch (Arena.ego.trapezi.partidaFasiGet()) {
	case 'ΔΗΛΩΣΗ':
		if (thesi != tzogadoros) return Arena.partida;
		dom.addClass('tsoxaPektisAgoraTzogadorosCandi');
		break;
	case 'ΑΛΛΑΓΗ':
		if (thesi != tzogadoros) return Arena.partida;
		dom.addClass('tsoxaPektisAgoraTzogadoros').
		append($('<img>').addClass('tsoxaPektisIcon').attr({
			id: 'tsoxaPektisAgoraTzogos',
			src: 'ikona/endixi/tzogos.png',
			title: 'Αλλαγή φύλλων',
		}));
		break;
	default:
		if (thesi == tzogadoros) dom.addClass('tsoxaPektisAgoraTzogadoros');
		else if (Arena.ego.trapezi.partidaBazaCountGet() > 0) dom.addClass('tsoxaPektisAgoraAminomenos');
		break;
	}

	return Arena.partida;
};

Arena.partida.pektisDilosiRefreshDOM = function(thesi, iseht, dom) {
	var trapezi = Arena.ego.trapezi, paso, dilosi, dilosiDom;

	if (!trapezi)
	return Arena.partida;

	if (iseht === undefined)
	iseht = Arena.ego.thesiMap(thesi);

	if (dom === undefined)
	dom = Arena.partida['pektisDilosi' + iseht + 'DOM'];

	dom.
	empty().
	removeClass('tsoxaPektisDilosiPaso tsoxaPektisDilosiAgora ' +
		'tsoxaPektisSimetoxiPaso tsoxaPektisSimetoxiPezo ' +
		'tsoxaPektisSimetoxiMazi tsoxaPektisSimetoxiMonos');

	switch (trapezi.partidaFasiGet()) {
	// Αν είμαστε σε φάση αλλαγής δείχνουμε τα ίδια στοιχεία με αυτά που
	// δείχνουμε στις δηλώσεις εκτός από τον τζογαδόρο όπου δεν υπάρχει
	// λόγος να δείξουμε την τελευταία αγορά που του προτάθηκε, καθώς
	// έχει ήδη κερδίσει την αγορά και σκέφτεται με αφετηρία την
	// τελευταία του δήλωση.
	case 'ΑΛΛΑΓΗ':
		// Αν πρόκειται για τον τζογαδόρο δεν δείχνουμε κάτι.

		if (thesi === trapezi.partidaTzogadorosGet())
		return Arena.partida;

		// Δεν πρόκειται για τον τζογαδόρο, επομένως δείχνουμε
		// ό,τι και στη φάση των δηλώσεων, δηλαδή είτε "ΠΑΣΟ"
		// εφόσον ο παίκτης δήλωσε πάσο, είτε την αγορά που
		// προτείνεται αυτή τη στιγμή στον παίκτη.

	case 'ΔΗΛΩΣΗ':
		paso = trapezi.apaso;
		if (paso.hasOwnProperty(thesi)) {
			dom.addClass('tsoxaPektisDilosiPaso').text('ΠΑΣΟ');
			break;
		}

		if ((trapezi.tagrafo == thesi) && (trapezi.partidaTzogadorosGet() != thesi)) {
			dom.addClass('tsoxaPektisDilosiPaso').html('&mdash;');
			break;
		}

		if (thesi !== trapezi.partidaEpomenosGet())
		return Arena.partida;

		if (!trapezi.anext)
		return Arena.partida;

		if (Arena.ego.isPektis() && Arena.ego.isThesi(thesi))
		return Arena.partida;

		dilosi = trapezi.anext;
		if (dilosi.dilosiIsTagrafo() && (trapezi.apasoCount == 2)) dilosi = new Dilosi('DS6');
		dom.append(dilosiDom = dilosi.dilosiDOM()).addClass('tsoxaPektisDilosiAgora').
		attr({title: 'Σκέφτεται "' + dilosi.dilosiLektiko() + '"'});
		dilosiDom.addClass('tsoxaDilosiProtasi');
		break;
	case 'ΣΥΜΜΕΤΟΧΗ':
	case 'ΠΑΙΧΝΙΔΙ':
		if (trapezi.partidaBazaCountGet() > 0) {
			dom.css('display', 'none');
			return Arena.partida;
		}

		if (thesi === trapezi.partidaTzogadorosGet())
		return Arena.partida;

		dilosi = trapezi.sdilosi;
		if (!dilosi[thesi]) return Arena.partida;

		if (dilosi[thesi].simetoxiIsPaso()) dom.addClass('tsoxaPektisSimetoxiPaso').text('ΠΑΣΟ');
		else if (dilosi[thesi].simetoxiIsPezo()) dom.addClass('tsoxaPektisSimetoxiPezo').text('ΠΑΙΖΩ');
		else if (dilosi[thesi].simetoxiIsMazi()) dom.addClass('tsoxaPektisSimetoxiMazi').text('ΜΑΖΙ');
		else if (dilosi[thesi].simetoxiIsVoithao()) dom.addClass('tsoxaPektisSimetoxiPezo').text('ΒΟΗΘΑΩ');
		else if (dilosi[thesi].simetoxiIsMonos()) dom.addClass('tsoxaPektisSimetoxiMonos').text('ΜΟΝΟΣ');
		break;
	}

	dom.append($('<img>').attr('src', 'ikona/misc/skiaRB.png').addClass('tsoxaPektisDilosiSkia'));
	return Arena.partida;
};

Arena.partida.pektisBazesRefreshDOM = function(thesi, iseht, dom) {
	var trapezi = Arena.ego.trapezi, bazes, plati;

	if (!trapezi) return Arena.partida;
	if (iseht === undefined) iseht = Arena.ego.thesiMap(thesi);
	if (dom === undefined) dom = Arena.partida['pektisBazes' + iseht + 'DOM'];

	dom.empty();
	switch (trapezi.partidaFasiGet()) {
	case 'ΠΑΙΧΝΙΔΙ':
	case 'CLAIM':
	case 'ΠΛΗΡΩΜΗ':
		bazes = trapezi.partidaBazesGet(thesi);
		if (isNaN(bazes)) return Arena.partida;
		if (bazes < 1) return Arena.partida;

		dom.css('display', 'block');
		do {
			plati = (Math.floor((bazes - 1) / 3) % 2) ? Arena.ego.plati : Arena.ego.italp;
			dom.prepend($('<img>').addClass('tsoxaPektisBazesBaza').
			attr('src', 'ikona/trapoula/' + plati + 'L.png'));
		} while (--bazes > 0);
		break;
	}

	return Arena.partida;
};

Arena.partida.pektisAnamoniRefreshDOM = function(thesi, iseht, domMain) {
	var trapezi = Arena.ego.trapezi;

	if (!trapezi) return Arena.partida;
	if (iseht === undefined) iseht = Arena.ego.thesiMap(thesi);
	if (domMain === undefined) domMain = Arena.partida['pektisMain' + iseht + 'DOM'];

	domMain.find('.tsoxaEndixiAnamoni').remove();
	switch (trapezi.partidaFasiGet()) {
	case 'ΔΙΑΝΟΜΗ':
		if (thesi != trapezi.partidaDealerGet()) return Arena.partida;
		domMain.append(endixi = $('<img>').addClass('tsoxaEndixiAnamoni').attr({
			src: 'ikona/working/default.gif',
			title: 'Ο παίκτης μοιράζει φύλλα',
		}));
		break;
	case 'ΔΗΛΩΣΗ':
		if (thesi != trapezi.partidaEpomenosGet()) return Arena.partida;
		domMain.append(endixi = $('<img>').addClass('tsoxaEndixiAnamoni').attr({
			src: Arena.partida.pektisAnamoniIkona(thesi),
			title: 'Σκέφτεται την επόμενη δήλωση αγοράς',
		}));
		break;
	case 'ΑΛΛΑΓΗ':
		if (thesi != trapezi.partidaEpomenosGet()) return Arena.partida;
		domMain.append(endixi = $('<img>').addClass('tsoxaEndixiAnamoni').attr({
			src: Arena.partida.pektisAnamoniIkona(thesi),
			title: 'Σκέφτεται αλλαγή και δήλωση αγοράς',
		}));
		break;
	case 'ΣΥΜΜΕΤΟΧΗ':
		if (thesi != trapezi.partidaEpomenosGet()) return Arena.partida;
		domMain.append(endixi = $('<img>').addClass('tsoxaEndixiAnamoni').attr({
			src: Arena.partida.pektisAnamoniIkona(thesi, 'endixi/erotimatiko.gif'),
			title: 'Σκέφτεται αν θα διεκδικήσει τις μπάζες του',
		}));
		break;
	case 'ΠΑΙΧΝΙΔΙ':
		if (thesi != trapezi.partidaEpomenosGet()) return Arena.partida;
		domMain.append(endixi = $('<img>').addClass('tsoxaEndixiAnamoni').attr({
			src: Arena.partida.pektisAnamoniIkona(thesi, 'endixi/balitsa.gif'),
			title: 'Σκέφτεται ποιο φύλλο θα παίξει',
		}));
		break;
	}

	return Arena.partida;
};

Arena.partida.pektisAnamoniIkona = function(thesi, img) {
	if (img === undefined) img = 'working/rologaki.gif';
	return 'ikona/' + ((Arena.ego.isPektis() && Arena.ego.isThesi(thesi)) ? 'endixi/rollStar.gif' : img);
};

Arena.partida.filaClearDOM = function(thesi) {
	if (thesi === undefined)
	return Arena.partida.thesiWalk(function(thesi) {
		Arena.partida.filaClearDOM(thesi);
	});

	iseht = Arena.ego.thesiMap(thesi);
	$('.tsoxaXartosiaFilo' + iseht).remove();
	Arena.partida['fila' + iseht + 'DOM'].empty();
	return Arena.partida;
};

Arena.partida.filaRefreshDOM = function(thesi) {
	var fila, iseht, dom;

	if (thesi === undefined) {
		Arena.partida.thesiWalk(function(thesi) {
			Arena.partida.filaRefreshDOM(thesi);
		});

		$('.tsoxaBazaFiloProxiro').remove();
		delete Arena.partida.klikFilo;

		return Arena.partida;
	}

	Arena.partida.filaClearDOM(thesi);

	if (Arena.ego.oxiTrapezi())
	return Arena.partida;

	fila = Arena.ego.trapezi.partidaFilaGet(thesi);

	if (!fila)
	return Arena.partida;

	iseht = Arena.ego.thesiMap(thesi);
	dom = Arena.partida['fila' + iseht + 'DOM'];
	dom.append(fila.xartosiaTaxinomisi().xartosiaDOM(iseht, Arena.ego.klistaFila()));

	return Arena.partida;
};

Arena.partida.tzogosRefreshDOM = function() {
	var dom, fila;

	dom = Arena.partida.tzogosDOM.css('display', 'none').empty();

	if (Arena.ego.oxiTrapezi())
	return Arena.partida;

	fila = Arena.partida.tzogosDOM.data('faneros') ?
		Arena.ego.trapezi.tzogosPrev : Arena.ego.trapezi.partidaTzogosGet();

	if (!fila)
	Arena.ego.trapezi.partidaTzogosGet();

	if (!fila)
	return Arena.partida;

	fila = fila.xartosiaFilaGet();

	dom.
	append(fila[0].filoDOM().addClass('tsoxaTzogosFilo tsoxaTzogosFiloLeft')).
	append(fila[1].filoDOM().addClass('tsoxaTzogosFilo tsoxaTzogosFiloRight'));

	switch (Arena.ego.trapezi.partidaFasiGet()) {
	case 'ΔΙΑΝΟΜΗ':
	case 'ΔΗΛΩΣΗ':
		dom.css('display', 'block');
		break;
	}

	return Arena.partida;
};

// Η function "peristrofiDOM" καλείται κατά τη χειραφεσία της τσόχας, όπου
// η τσόχα ανεξαρτοποιείται και μπορεί να μετακινηθεί σε οποιοδήποτε μέρος
// της σελίδας. Σκοπός της function είνα, ακριβώς, να κάνει σαφές αυτό το
// γεγονός περιστεφοντας λίγες φορές την τσοχα δεξιά-αριστερά.

Arena.partida.peristrofiDOM = function(rotationCount) {
	var rotation;

	if (rotationCount === undefined) rotationCount = 1;

	if (rotationCount > 4) {
		Arena.partida.tsoxaDOM.css({
			'transform': '',
			'-ms-transform': '',
			'-webkit-transform': '',
		});
		return Arena.partida;
	}

	rotation = (rotationCount % 2 ? '2deg' : '-2deg');
	Arena.partida.tsoxaDOM.css({
		'transform': 'rotate(' + rotation + ')',
		'-ms-transform': 'rotate(' + rotation + ')',
		'-webkit-transform': 'rotate(' + rotation + ')',
	});
	setTimeout(function() {
		Arena.partida.peristrofiDOM(rotationCount + 1);
	}, 60);

	return Arena.partida;
};

Arena.partida.akirosiKiniseon = function() {
	if (Arena.ego.oxiTrapezi()) return false;
	return Arena.ego.trapezi.trapeziAkirosiGet();
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.partida.isDealer = function(thesi) {
	if (Arena.ego.oxiTrapezi()) return false;
	return(Arena.ego.trapezi.partidaDealerGet() === thesi);
};

Arena.partida.isProtos = function(thesi) {
	if (Arena.ego.oxiTrapezi()) return false;
	return(Arena.ego.trapezi.partidaProtosGet() === thesi);
};

Arena.partida.isEpomenos = function(thesi) {
	if (Arena.ego.oxiTrapezi()) return false;
	return(Arena.ego.trapezi.partidaEpomenosGet() === thesi);
};

Arena.partida.oxiEpomenos = function(thesi) {
	return !Arena.partida.isEpomenos(thesi);
};
