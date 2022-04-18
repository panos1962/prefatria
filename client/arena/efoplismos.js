/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Η function "efoplismos" αρματώνει την τσόχα με event listeners και χειρισμούς
// που μπορούν να κάνουν οι παίκτες σε κάθε ιδιαίτερη τη φάση του παιχνιδιού.
// Εκτός, όμως, από το αρμάτωμα κάνουμε και άλλες εξειδικευμένες εργασίες που
// αφορούν στην εμφάνιση ή μη κάποιων στοιχείων της τσόχας κλπ.

Arena.partida.efoplismos = function() {
	var efoplismos;

	// Εκκινούμε τη διαδικασία ακυρώνοντας τυχόν υπάρχοντα οπλισμό της τσόχας.

	Arena.partida.afoplismos();

	if (Arena.ego.oxiTrapezi())
	return Arena.partida;

	if (Arena.ego.oxiPektis())
	return Arena.partida;

	// Το «αρμάτωμα» της τσόχας με χειρισμούς και event listeners δεν
	// το επιχειρούμε με το χέρι, αλλά με ιδιαίτερες functions που
	// αφορούν στην τρέχουσα φάση του παιχνδιού.

	efoplismos = 'efoplismos' + Arena.ego.trapezi.partidaFasiGet();

	if (typeof Arena.ego.trapezi[efoplismos] !== 'function')
	return Arena.partida;

	Arena.ego.trapezi[efoplismos]();
	return Arena.partida;
};

// Η function "afoplismos" ακυρώνει event listeners της τσόχας η οποία με
// αυτόν τον τρόπο καθίσταται ακίνδυνη και ανενεργή.

Arena.partida.afoplismos = function() {
	Arena.partida.dilosiPanelDOM.css('display', 'none').empty();
	Arena.partida.agoraPanelDOM.css('display', 'none').empty();
	Arena.partida.xipnitiriAfoplismos();

	return Arena.partida;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@
//
// Κατά τη φάση της πλειοδοσίας για την αγορά ισχύουν τα εξής:
//
// Ο παίκτης που έχει σειρά να μιλήσει βλέπει πάνελ δηλώσεων με τις δηλώσεις
// που έχουν σειρά να δηλωθούν.

Trapezi.prototype.efoplismosΔΗΛΩΣΗ = function() {
	var basi, thesi, klikDilosi = false;

	thesi = this.partidaEpomenosGet();

	if (Debug.flagGet('epomenosCheck') && Arena.ego.oxiThesi(thesi))
	return this;

	Arena.partida.dilosiPanelDOM.empty().
	append(basi = $('<div>').attr('id', 'tsoxaDilosiPanelBasi'));

	if (this.anext && (this.apasoCount < 2))
	basi.append($('<div>').addClass('tsoxaButton').
	attr('id', this.anext.dilosiIsTagrafo() ? 'katoButton' : 'panoButton').data('dilosi', this.anext));

	if (!this.alast)
	basi.append($('<div>').addClass('tsoxaButton').
	attr('id', 'panoButton').data('dilosi', new Dilosi('DS6')));

	basi.append($('<div>').addClass('tsoxaButton').
	attr('id', 'escapeButton').data('dilosi', new Dilosi('DPS')));

	basi.find('.tsoxaButton').each(function() {
		$(this).append($(this).data('dilosi').dilosiDOM());
	});

	Arena.partida.xipnitiriOplismos();
	Arena.partida.dilosiPanelDOM.find('.tsoxaButton').addClass('tsoxaDilosiButton').
	off('mouseenter').on('mouseenter', function(e) {
		e.stopPropagation();

		if (klikDilosi)
		return;

		$(this).addClass('tsoxaButtonOplismeno');
	}).
	off('mouseleave').on('mouseleave', function(e) {
		e.stopPropagation();

		if (klikDilosi)
		return;

		$(this).removeClass('tsoxaButtonOplismeno');
	}).
	off('mousedown').on('mousedown', function(e) {
		Arena.inputRefocus(e);
	}).
	off('click').on('click', function(e) {
		Arena.inputRefocus(e);
		Arena.partida.xipnitiriAfoplismos();
		if (Arena.partida.akirosiKiniseon()) return;
		if (klikDilosi) return;

		klikDilosi = true;
		Arena.partida.enimerosiDOM.css('display', 'none');
		Client.skiserService('dilosi',
			'thesi=' + thesi,
			'dilosi=' + $(this).data('dilosi').dilosi2string()).
		fail(function(err) {
			Client.skiserFail(err);
			Arena.partida.enimerosiDOM.css('display', 'block');
			klikDilosi = false;
		});
	});

	Arena.partida.dilosiPanelDOM.css('display', 'block');
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@
//
// Κατά τη φάση της αλλαγής φύλλων από τον τζογαδόρο ισχύουν τα εξής:
//
// Ο τζογαδόρος έχει παραλάβει τα φύλλα του τζόγου και έχει μπροστά του 12 φύλλα.
// Από αυτά πρέπει να επιλέξει τα δύο σκάρτα και να δηλώσει την τελική αγορά του.
// Κατ' εξαίρεσιν μπορεί να τα «γράψει σόλο» στην ελάχιστη δυνατή αγορά, εφόσον
// κρίνει ότι δεν αξίζει τον κόπο να παιχτεί η οποιαδήποτε αγορά. Επίσης, μπορεί
// να επιλέξει τους άσους στην αγορά, εφόσον, φυσικά, τους έχει.
//
// Τα παραπάνω λειτουργούν ως εξής:
//
// Ο τζογαδόρος επιλέγει την τελική αγορά του από το πάνελ το οποίο ονομάζουμε
// «πάνελ των αγορών». Αυτό το πάνελ εμφανίζεται μόνον όταν ο τζογαδόρος έχει ήδη
// επιλέξει ακριβώς δύο φύλλα για αλλαγή (σκάρτα). Στο πάνελ των αγορών ο τζογαδόρος
// μπορεί να επιλέξει μόνον αγορές που είναι τουλάχιστον της δυναμικότητας της
// τελευταίας του δήλωσης κατά τη φάση της πλειοδοσίας της αγοράς.
//
// Η επιλογή «ΣΟΛΟ» είναι επιλέξιμη σε οποιαδήποτε φάση της διαδικασίας, όπως και
// οι άσοι.
//
// Πριν την τελική αποφώνηση της αγοράς γίνεται έλεγχος και τελική ερώτηση στον
// τζογαδόρο.

Trapezi.prototype.efoplismosΑΛΛΑΓΗ = function() {
	var tzogadoros, iseht;

	tzogadoros = this.partidaEpomenosGet();
	iseht = Arena.ego.thesiMap(tzogadoros);
	Arena.partida['pektisAgora' + iseht + 'DOM'].
	append($('<img>').attr({
		id: 'tsoxaPektisAgoraTzogosDixe',
		src: 'ikona/endixi/asteraki.gif',
	}).
	addClass('tsoxaPektisIcon').delay(2000).finish().animate({
		width: 0,
		top: '4px',
		left: '10px',
	}, 1000, function() {
		$(this).remove();
	}));

	if (Debug.flagGet('epomenosCheck') && Arena.ego.oxiThesi(tzogadoros))
	return this;

	Trapezi.
	efoplismosAlagiPanel(this).
	efoplismosAlagiPanelArmatoma(this).
	efoplismosAlagiXartosia(this);
	Arena.partida.agoraPanelDOM.css('display', 'block');
	Client.sound.bikebell();
	return this;
};

// Η function "efoplismosAlagiPanel" δημιουργεί το πάνελ των αγορών. Το πάνελ περιλαμβάνει
// πλήκτρα για όλες τις επιτρεπτές αγορές, πλήκτρο για σολαρία και πλήκτρο για τη δήλωση
// των άσων (εφόσον υπάρχουν άσοι). Οι αγορές παραμένουν αόρατες όσο ο τζογαδόρος δεν έχει
// επιλέξει ακριβώς δύο φύλλα προς αλλαγή (σκάρτα).

Trapezi.efoplismosAlagiPanel = function(trapezi) {
	var minAgora, minXroma, minBazes, bazes, xroma = [ 'S', 'C', 'D', 'H', 'N' ], i, dilosi,
		panelDom = Arena.partida.agoraPanelDOM, domGrami, domButton;

	minAgora = trapezi.alast.dilosiIsTagrafo() ? new Dilosi('DS6') : new Dilosi(trapezi.alast).dilosiExoSet(false);
	minXroma = Prefadoros.xromaAxia[minAgora.dilosiXromaGet()];
	minBazes = minAgora.dilosiBazesGet();

	panelDom.removeData().empty();
	for (bazes = 6; bazes <= 10; bazes++) {
		panelDom.append(domGrami = $('<div>').addClass('tsoxaAgoraGrami'));
		for (i = 0; i < xroma.length; i++) {
			dilosi = new Dilosi().dilosiXromaSet(xroma[i]).dilosiBazesSet(bazes);
			domGrami.append(domButton = $('<div>').addClass('tsoxaButton').
			data('dilosi', dilosi).append(dilosi.dilosiDOM('Agora')));

			if (bazes < minBazes) continue;
			if ((bazes == minBazes) && (Prefadoros.xromaAxia[xroma[i]] < minXroma)) continue;
			domButton.addClass('tsoxaAgoraButtonEpitrepto');
		}
		domButton.addClass('tsoxaAgoraButtonAxroa');
	}

	Trapezi.
	efoplismosAlagiPanelSolo(panelDom, minAgora).
	efoplismosAlagiPanelAsoi(trapezi, panelDom);

	return Trapezi;
}

// Η function "efoplismosAlagiPanelSolo" δημιουργεί το πλήκτρο της σολαρίας με το
// οποίο ο τζογαδόρος επιλέγει να γράψει σόλο την ελάχιστη δυνατή αγορά.

Trapezi.efoplismosAlagiPanelSolo = function(panelDom, minAgora) {
	panelDom.append($('<div>').addClass('tsoxaButton tsoxaAgoraButtonEpitrepto').
	attr('id', 'tsoxaAgoraButtonSolo').data('dilosi', new Dilosi(minAgora).dilosiSoloSet()).
	append($('<div>').attr({
		id: 'tsoxaAgoraDilosiSolo',
		title: 'Βάλτε σόλο μέσα την ελάχιστη δυνατή αγορά',
	}).text('ΣΟΛΟ')));

	return Trapezi;
};

// Η function "efoplismosAlagiPanelAsoi" δημιουργεί το πλήκτρο δήλωσης/απόκρυψης των
// άσων -εφόσον υπάρχουν οι τέσσερις άσοι στα φύλλα του τζογαδόρου και εφόσον στο
// τραπέζι παίζονται οι άσοι.

Trapezi.efoplismosAlagiPanelAsoi = function(trapezi, panelDom) {
	var asoi, asoiDir = 'ikona/panel/';

	if (trapezi.trapeziOxiAsoi()) return Trapezi;

	asoi = 0;
	trapezi.fila[trapezi.partidaTzogadorosGet()].xartosiaWalk(function(i, filo) {
		if (filo.filoAxiaGet() === 'A') asoi++;
	});
	if (asoi < 4) return Trapezi;

	panelDom.data('asoi', true).append($('<img>').attr({
		id: 'tsoxaAgoraAsoiIcon',
		src: asoiDir + 'asoiOn.png',
		title: 'Δηλώστε/αποκρύψτε τους άσους',
	}).
	on('mousedown', function(e) {
		Arena.inputRefocus(e);
	}).
	on('click', function(e) {
		var dialogos;

		Arena.inputRefocus(e);
		if (Arena.partida.akirosiKiniseon()) return;

		if (panelDom.data('asoi')) {
			panelDom.data('asoi', false);
			$(this).attr('src', asoiDir + 'asoiOff.png');
		}
		else {
			panelDom.data('asoi', true);
			$(this).attr('src', asoiDir + 'asoiOn.png');
		}

		// Στο tag "dialogos" του πάνελ των αγορών έχουμε κρατήσει το πλήκτρο
		// που ενεργοποίησε τον διάλογο επιβεβεβαίωσης της αγοράς, οπότε μετά
		// από αλλαγή στο καθεστώς των άσων ξανακάνουμε κλικ στην ίδια αγορά.

		dialogos = panelDom.data('dialogos');
		if (dialogos) dialogos.trigger('click');
	}));

	return Trapezi;
};

// Η function "efoplismosAlagiPanelArmatoma" εξοπλίζει όλα τα πλήκτρα επιτρεπτών αγορών,
// συμπεριλαμβανομένης και της σολαρίας, με διαδικασία επιλογής αγοράς. Η διαδικασία
// επιλογής αγοράς μας περνάει σε παράθυρο διαλόγου όπου προτείνεται η αγορά και
// ο τζογαδόρος επιλέγει αν θα τη δημοσιοποιήσει ή όχι.

Trapezi.efoplismosAlagiPanelArmatoma = function(trapezi) {
	var panelDom = Arena.partida.agoraPanelDOM;

	panelDom.find('.tsoxaButton').addClass('tsoxaAgoraButton');
	panelDom.find('.tsoxaAgoraButtonEpitrepto').
	off('mouseenter').on('mouseenter', function(e) {
		e.stopPropagation();
		$(this).addClass('tsoxaButtonOplismeno');
	}).
	off('mouseleave').on('mouseleave', function(e) {
		e.stopPropagation();
		$(this).removeClass('tsoxaButtonOplismeno');
	}).
	off('mousedown').on('mousedown', function(e) {
		Arena.inputRefocus(e);
	}).
	off('click').on('click', function(e) {
		Arena.inputRefocus(e);
		if (Arena.partida.akirosiKiniseon()) return;
		Trapezi.efoplismosAlagiPanelEpilogiAgoras(trapezi, $(this));
	});

	return Trapezi;
};

// Η function "efoplismosAlagiPanelEplilogiAgoras" παρουσιάζει παράθυρο διαλόγου στο
// οποίο προτείνεται η αγορά και ο τζογαδόρος έχει τη δυνατότητα να τη δημοσιοποιήσει
// ή όχι. Όσο το παράθυρο επιβεβαίωσης της αγοράς είναι ανοικτό, το πάνελ των αγορών
// παραμένει ενεργό και ο τζογαδόρος μπορεί να αλλάξει την αγορά του ή το καθεστώς
// των άσων.

Trapezi.efoplismosAlagiPanelEpilogiAgoras = function(trapezi, agoraButton) {
	var agora, dialogosDOM = Arena.partida.dialogosDOM, panelDom = Arena.partida.agoraPanelDOM;

	// Κρατάμε στο tag "dialogos" στο πάνελ των αγορών το πλήκτρο με το οποίο
	// επιλέξαμε την αγορά.

	panelDom.data('dialogos', agoraButton);

	// Αποσπούμε την αγορά του πλήκτρου που πατήθηκε και προχωρούμε στην κατασκευή
	// του παραθύρου διαλόγου επιβεβαίωσης της αγοράς.

	agora = new Dilosi(agoraButton.data('dilosi'));
	dialogosDOM.empty().addClass('tsoxaAgoraDialogos');
	if (agora.dilosiIsSolo()) {
		dialogosDOM.append($('<div>').text('Προτίθεστε να μπείτε σόλο'));
	}
	else {
		if (panelDom.data('asoi')) agora.dilosiAsoiSet();
		dialogosDOM.append($('<div>').text('Προτίθεστε να αγοράσετε'));
	}

	dialogosDOM.
	append($('<div>').attr('id', 'tsoxaAgoraDialogosAgora').append(agora.dilosiDOM())).
	append($('<div>').
	append($('<div>').addClass('dialogosButton').text('ΝΑΙ').
	on('click', function(e) {
		Arena.inputRefocus(e);
		if (Arena.partida.akirosiKiniseon()) return;
		Trapezi.efoplismosAlagiEpiveveosiNai(trapezi, agora);
	})).
	append($('<div>').addClass('dialogosButton').text('ΟΧΙ').
	on('click', function(e) {
		Arena.inputRefocus(e);
		if (Arena.partida.akirosiKiniseon()) return;
		Trapezi.efoplismosAlagiEpiveveosiOxi();
	})));

	if (agora.dilosiIsSolo()) dialogosDOM.addClass('dialogosWarning');
	else dialogosDOM.removeClass('dialogosWarning');
	dialogosDOM.css('display', 'block');
};

// Η function "efoplismosAlagiEpiveveosiNai" καλείται κατά το κλικ στο πλήκτρο "ΝΑΙ"
// της τελικής επιβεβαίωσης της αγοράς από το παράθυρο επιβεβαίωσης αγοράς.

Trapezi.efoplismosAlagiEpiveveosiNai = function(trapezi, agora) {
	var panelDom = Arena.partida.agoraPanelDOM, params, skartaCount;

	if (panelDom.data('agoraExelixi')) return;
	panelDom.data('agoraExelixi', true);

	if (panelDom.data('asoi')) agora.dilosiAsoiSet();
	else agora.dilosiAsoiSet(false);

	params = 'tzogadoros=' + trapezi.partidaTzogadorosGet()+ '&agora=' + agora.dilosi2string();
	if (agora.dilosiOxiSolo()) {
		params += '&skarta=';
		skartaCount = 0;
		$('.tsoxaXartosiaFilo').each(function() {
			var filo;

			if (!$(this).data('skarto')) return;

			filo = $(this).data('filo');
			if (!filo) return;

			skartaCount++;
			params += filo.filo2string();
		});

		if (skartaCount !== 2) {
			Client.fyi.epano('Κάτι δεν πήγε καλά με την αγορά');
			return;
		}
	}

	panelDom.css('display', 'none');
	Arena.partida.dialogosDOM.css('display', 'none');

	Client.skiserService('agora', params).
	fail(function(err) {
		Client.skiserFail(err);
		panelDom.css('display', 'block').removeData('agoraExelixi');
		Arena.partida.dialogosDOM.css('display', 'block');
	});
};

// Η function "efoplismosAlagiEpiveveosiOxi" καλείται όταν ο τζογαδόρος ακυρώσει την
// αγορά κάνοντας κλικ στο πλήκτρο "ΟΧΙ" του παραθύρου επιβεβαίωσης της αγοράς.

Trapezi.efoplismosAlagiEpiveveosiOxi = function() {
	Arena.partida.dialogosDOM.css('display', 'none');
	Arena.partida.agoraPanelDOM.removeData('dialogos');
};

// Η function "efoplismosAlagiXartosia" αρματώνει τα φύλλα του τζογαδόρου με διαδικασίες
// που αφορούν στην επιλογή των φύλλων προς αλλαγή (σκάρτα). Όσο ο τζογαδόρος έχει
// επιλεγμένα ακριβώς δύο φύλλα προς αλλαγή, εμφανίζεται το πάνελ των αγορών, αλλιώς
// το πάνελ παραμένει κρυφό.

Trapezi.efoplismosAlagiXartosia = function(trapezi) {
	var tzogadoros, iseht, panelDom = Arena.partida.agoraPanelDOM, panoCount = 0;

	tzogadoros = trapezi.partidaTzogadorosGet();
	$('.tsoxaXartosiaFilo').removeData('skarto');
/*
	trapezi.fila[tzogadoros].xartosiaWalk(function(i, filo) {
		delete filo.skarto;
	});
*/

	iseht = Arena.ego.thesiMap(tzogadoros);
	if (iseht == 1) {
		pano = '46px';
		kato = '30px';
	}
	else {
		pano = '14px';
		kato = '26px';
	}

	Arena.partida['fila' + iseht + 'DOM'].
	find('.tsoxaXartosiaFilo').css('cursor', 'pointer').
	off('mouseenter').on('mouseenter', function(e) {
		var filoDom = $(this);

		e.stopPropagation();

		if (panelDom.data('dialogos'))
		return;

		filoDom.addClass('tsoxaFiloEpilogi');

		if (filoDom.data('skarto'))
		return;

		filoDom.stop().animate({bottom: pano}, 'fast');
	}).
	off('mouseleave').on('mouseleave', function(e) {
		var filoDom = $(this);

		e.stopPropagation();

		if (panelDom.data('dialogos'))
		return;

		filoDom.removeClass('tsoxaFiloEpilogi');

		if (filoDom.data('skarto'))
		return;

		if (filoDom.data('kato'))
		filoDom.removeData('kato');

		else
		filoDom.stop().animate({bottom: kato}, 'fast');
	}).
	off('mousedown').on('mousedown', function(e) {
		Arena.inputRefocus(e);
	}).
	off('click').on('click', function(e) {
		var filoDom = $(this);

		Arena.inputRefocus(e);
		if (Arena.partida.akirosiKiniseon()) return;
		if (panelDom.data('dialogos')) return;

		if (filoDom.data('skarto')) {
			filoDom.removeData('skarto');
			filoDom.css('bottom', kato).data('kato', true);
			panoCount--;
		}
		else {
			if (filoDom.data('kato')) filoDom.css('bottom', pano);
			filoDom.data('skarto', true);
			panoCount++;
		}

		if (panoCount === 2) {
			Arena.partida.enimerosiDOM.css('display', 'none');
			panelDom.find('.tsoxaAgoraGrami').css('display', 'inline-block');
		}
		else {
			panelDom.find('.tsoxaAgoraGrami').css('display', 'none');
			Arena.partida.enimerosiDOM.css('display', 'block');
		}
	});

	return Trapezi;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Trapezi.prototype.efoplismosΣΥΜΜΕΤΟΧΗ = function() {
	var basi, pektis, simpektis, dilosi, klikDilosi = false;

	pektis = this.partidaEpomenosGet();
	if (Debug.flagGet('epomenosCheck') && Arena.ego.oxiThesi(pektis)) return this;

	simpektis = pektis.epomeniThesi();
	if (simpektis == this.partidaTzogadorosGet()) simpektis = simpektis.epomeniThesi();

	dilosi = this.sdilosi;

	Arena.partida.dilosiPanelDOM.empty().
	append(basi = $('<div>').attr('id', 'tsoxaDilosiPanelBasi'));

	if (!dilosi[simpektis]) basi.
	append($('<div>').addClass('tsoxaButton').attr('id', 'panoButton').data('dilosi', 'ΠΑΙΖΩ')).
	append($('<div>').addClass('tsoxaButton').attr('id', 'escapeButton').data('dilosi', 'ΠΑΣΟ'));

	else if (dilosi[simpektis].simetoxiIsPaso()) {
		if (dilosi[pektis]) basi.
		append($('<div>').addClass('tsoxaButton').attr('id', 'escapeButton').data('dilosi', 'ΜΟΝΟΣ')).
		append($('<div>').addClass('tsoxaButton').attr('id', 'katoButton').data('dilosi', 'ΜΑΖΙ'));

		else basi.
		append($('<div>').addClass('tsoxaButton').attr('id', 'panoButton').data('dilosi', 'ΠΑΙΖΩ')).
		append($('<div>').addClass('tsoxaButton').attr('id', 'katoButton').data('dilosi', 'ΜΑΖΙ')).
		append($('<div>').addClass('tsoxaButton').attr('id', 'escapeButton').data('dilosi', 'ΠΑΣΟ'));
	}

	else if (dilosi[pektis]) basi.
	append($('<div>').addClass('tsoxaButton').attr('id', 'katoButton').data('dilosi', 'ΜΑΖΙ')).
	append($('<div>').addClass('tsoxaButton').attr('id', 'escapeButton').data('dilosi', 'ΠΑΣΟ'));

	else basi.
	append($('<div>').addClass('tsoxaButton').attr('id', 'panoButton').data('dilosi', 'ΠΑΙΖΩ')).
	append($('<div>').addClass('tsoxaButton').attr('id', 'escapeButton').data('dilosi', 'ΠΑΣΟ'));

	basi.find('.tsoxaButton').each(function() {
		$(this).append($(this).data('dilosi'));
	});

	Arena.partida.xipnitiriOplismos();
	Arena.partida.dilosiPanelDOM.find('.tsoxaButton').addClass('tsoxaDilosiButton').
	off('mouseenter').on('mouseenter', function(e) {
		e.stopPropagation();

		if (klikDilosi)
		return;

		$(this).addClass('tsoxaButtonOplismeno');
	}).
	off('mouseleave').on('mouseleave', function(e) {
		e.stopPropagation();

		if (klikDilosi)
		return;

		$(this).removeClass('tsoxaButtonOplismeno');
	}).
	off('mousedown').on('mousedown', function(e) {
		Arena.inputRefocus(e);
	}).
	off('click').on('click', function(e) {
		Arena.inputRefocus(e);
		Arena.partida.xipnitiriAfoplismos();
		if (Arena.partida.akirosiKiniseon()) return;
		if (klikDilosi) return;

		klikDilosi = true;
		Arena.partida.enimerosiDOM.css('display', 'none');
		Client.skiserService('simetoxi',
			'thesi=' + pektis,
			'dilosi=' + $(this).data('dilosi')).
		fail(function(err) {
			Client.skiserFail(err);
			Arena.partida.enimerosiDOM.css('display', 'block');
			klikDilosi = false;
		});
	});

	Arena.partida.dilosiPanelDOM.css('display', 'block');
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Trapezi.prototype.efoplismosΠΑΙΧΝΙΔΙ = function() {
	var trapezi = this, pektis, iseht, over, pano, kato;

	Arena.cpanel.claimButtonDOM.data('akiro', true).css('opacity', 0.3);
	pektis = this.partidaEpomenosGet();
	if (Debug.flagGet('epomenosCheck') && Arena.ego.oxiThesi(pektis)) return this;

	// Εάν ο παίκτης είναι τζογαδόρος και παίζει το πρώτο φύλλο
	// της μπάζας, πρέπει να δώσουμε δυνατότητα claim.

	this.efoplismosPexnidiClaim(pektis);

	// Θέτουμε ηχητική ειδοποίηση καθυστέρησης στον παίκτη που έχει
	// σειρά να κάνει την επόμενη ενέργεια.

	Arena.partida.xipnitiriOplismos();

	iseht = Arena.ego.thesiMap(pektis);
	if (iseht === 1) {
		over = '40px';
		pano = '+=10px';
		kato = '-=10px';
	}
	else {
		over = '18px';
		pano = '-=8px';
		kato = '+=8px';
	}

	// Η παράμετρος "over" δείχνει πόσο θα ανασηκωθούν τα φύλλα που μπορούν
	// να παιχτούν. Αυτό, προφανώς, δεν έχει νόημα όταν έχει μείνει ένα μόνο
	// φύλλο, ή όταν τα φύλλα είναι κλειστά για τους θεατές.

	if ((this.partidaBazaCountGet() > 8) || Arena.ego.klistaFila())
	over = null;

	this.efoplismosPexnidiFila(iseht, over).each(function() {
		var filoDom, delay = 100;

		filoDom = $(this);
		if (!filoDom.data('ok')) return;

		filoDom.
		on('mouseenter', function(e) {
			e.stopPropagation();
			e.preventDefault();

			// Η flag "klikFilo" τίθεται όταν ο παίκτης κάνει κλικ σε
			// κάποιο φύλλο προκειμένου να παίξει το συγκεκριμένο φύλλο
			// και κύριο σκοπό έχει να μας διαφυλάξει από διπλά κλικ κλπ.

			if (Arena.partida.klikFilo)
			return;

			filoDom.finish().css('cursor', 'pointer');

			if (trapezi.partidaBazaCountGet() > 8)
			return;

			filoDom.finish().animate({bottom: pano}, delay);
		}).
		on('mouseleave', function(e) {
			e.stopPropagation();
			e.preventDefault();

			if (Arena.partida.klikFilo)
			return;

			filoDom.finish().css('cursor', 'auto');

			if (trapezi.partidaBazaCountGet() > 8)
			return;

			filoDom.finish().animate({bottom: filoDom.data('bottom')}, delay);
		}).
		on('click', function(e) {
			Arena.inputRefocus(e);

			// Αν είμαστε σε καθεστώς ακύρωσης κινήσεων, δεν προβαίνουμε
			// σε περαιτέρω ενέργειες.

			if (Arena.partida.akirosiKiniseon())
			return;

			// Αν το φύλλο έχει ήδη κλικαριστεί, δεν προβαίνουμε σε περαιτέρω
			// ενέργειες.

			if (Arena.partida.klikFilo)
			return;

			// Από τη στιγμή που γίνεται κλικ στο φύλλο, απενεργοποιούμε
			// την ηχητική υπενθύμιση και καθαρίζουμε τυχόν μηνύματα
			// προτροπής προς το χρήστη.

			Arena.partida.
			xipnitiriAfoplismos().
			enimerosiClearDOM();

			// Κάνοντας κλικ το φύλλο μαρκάρω με 1, εκκινώ κίνηση φύλλου και
			// κοινοποιώ το κλικ στον σέρβερ.

			Arena.partida.klikFilo = 1;

			Arena.partida.kinisiFilo({
				pektis: pektis,
				filoDOM: filoDom,

				// Η function callback καλείται μόλις η κίνηση του φύλλου προς το
				// κέντρο έχει περατωθεί.

				callback: function() {
					switch (Arena.partida.klikFilo) {

					// Αν έχω παραμείνει σε κατάσταση 1 σημαίνει ότι δεν έχει
					// παραληφθεί ακόμη η κοινοποίηση της συγκεκριμένης ενέργειας
					// από τον σέρβερ, οπότε μαρκάρω 2 που σημαίνει ακριβώς αυτό.

					case 1:
						Arena.partida.klikFilo = 2;
						return;

					// Αλλιώς σημαίνει ότι η ενέργεια έχει ήδη ληφθεί από τον σέρβερ
					// και αφού καθαρίσω την κατάσταση εμφανίζω την τρέχουσα εικόνα
					// και στέλνω την μπάζα εκεί που ανήκει, εφόσον έχει κλείσει μπάζα.

					case 3:
						delete Arena.partida.klikFilo;
						Arena.partida.trapeziRefreshDOM();
						Arena.partida.kinisiBaza();
						return;
					}
				},
			});

			Client.skiserService('peximo',
				'vld=' + trapezi.validationPeximoFiloData(),
				'pektis=' + pektis,
				'filo=' + filoDom.data('filo').filo2string()).
			done(function(rsp) {
				switch (rsp) {
				case 'lathosFilo':
					Client.sound.beep();
					Client.fyi.ekato('Παίχτηκε λάθος φύλλο. Γίνεται ανανέωση…', 1000);
					Arena.cpanel.freskarismaButton.pbuttonGetDOM().trigger('click');
					break;
				}
			}).
			fail(function(err) {
				Client.skiserFail(err);
				delete Arena.partida.klikFilo;
			});
		});
	});

	return this;
};

Trapezi.prototype.efoplismosPexnidiClaim = function(pektis) {
	if (pektis != this.partidaTzogadorosGet()) return this;
	if (this.bazaCount > 8) return this;
	if (this.bazaFila.length > 0) return this;

	Arena.cpanel.claimButtonDOM.removeData('akiro').css('opacity', '');
	return this;
};

Trapezi.prototype.efoplismosPexnidiFila = function(iseht, over) {
	var fila, bottom, xroma, found, agora;

	bottom = (iseht == 1 ? '30px' : '26px');
	fila = Arena.partida['fila' + iseht + 'DOM'].find('.tsoxaXartosiaFilo').

	// Ακυρώνουμε τυχόν mouse event listeners για όλα τα φύλλα τής
	// συγκεκριμένης θέσης.

	off('mousedown mouseenter mouseleave click').

	// Ο επόμενος mouse event listener κρίθηκε απαραίτητος στην περίπτωση
	// χειραφετημένης τσόχας όπου δεν θέλουμε να κινείται η τσόχα όταν
	// σέρνουμε λάθος φύλλο.

	on('mousedown', function(e) {
		Arena.inputRefocus(e);
	}).

	removeData('ok').
	data('bottom', bottom);

	// Ανιχνεύουμε το χρώμα της τρέχουσας μπάζας. Αν δεν υφίσταται
	// τρέχουσα μπάζα, τότε όλα τα φύλλα είναι υποψήφια.

	xroma = this.partidaBazaXromaGet();
	if (!xroma) return fila.data('ok', true);

	// Υπάρχει μπάζα σε εξέλιξη, επομένως θα πρέπει να μαρκάρουμε για
	// εφοπλισμό τα φύλλα στο χρώμα της τρέχουσσας μπάζας.

	found = 0;
	fila.each(function() {
		found += Trapezi.efoplismosFiloXroma($(this), xroma, over);
	});

	// Αν βρέθηκαν φύλλα στο χρώμα της τρέχουσας μπάζας, τότε αυτά έχουν
	// μαρκαριστεί για εφοπλισμό (flag "ok") και επιστρέφουμε όλα τα φύλλα
	// προκειμένου να προχωρήσουμε στον εφοπλισμό των μαρκαρισμένων φύλλων.

	if (found) return fila;

	// Δεν βρέθηκαν φύλλα στο χρώμα της τρέχουσας μπάζας. Αν δεν υφίσταται
	// αγορά, τότε παίζουμε το πάσο και όλα τα φύλλα μαρκάρονται ως υποψήφια.
	// Το ίδιο ισχύει και στην περίπτωση που η αγορά είναι αχρωμάτιστη.

	agora = this.partidaAgoraGet();
	if ((!agora) || agora.dilosiIsAxroa())
	return fila.data('ok', true);

	// Ανιχνεύουμε το χρώμα της αγοράς και εντοπίζουμε τα φύλλα του συγκεκριμένου
	// χρώματος (ατού).

	xroma = agora.dilosiXromaGet();
	fila.each(function() {
		found += Trapezi.efoplismosFiloXroma($(this), xroma, over);
	});

	// Αν βρέθηκαν ατού, τότε αυτά έχουν μαρκαριστεί για εφοπλισμό (flag "ok")
	// και επιστρέφουμε όλα τα φύλλα προκειμένου να προχωρήσουμε στον εφοπλισμό
	// των μαρκαρισμένων φύλλων (ατού).

	if (found) return fila;

	// Δεν βρέθηκαν φύλλα που επιτρέπεται να παιχτούν στην παρούσα φάση, επομένως
	// ο παίκτης μπορεί να πετάξει οποιοδήποτε φύλλο.

	return fila.data('ok', true);
};

// Η function "efoplismosFiloXroma" δέχεται το jQuery DOM element κάποιου φύλλου
// και ένα χρώμα, και εφοπλίζει το φύλλο εφόσον το χρώμα του φύλλου συμφωνεί με
// το χρώμα που δόθηκε. Εφοπλισμός σημαίνει ότι το φύλλο καθίσταται υποψήφιο για
// να παιχτεί θέτοντας το data tag "ok" σε true. Μπορούμε να δώσουμε και τρίτη
// παράμετρο με το ύψος (σε pixels) της ανύψωσης του φύλλου, εφόσον αυτό κριθεί
// υποψήφιο.
//
// Η function επιστρέφει 1 εφόσον το φύλλο που ελέγχεται βρεθεί υποψήφιο, αλλιώς
// επιστρέφει 0.

Trapezi.efoplismosFiloXroma = function(filoDom, xroma, over) {
	var filo;

	filo = filoDom.data('filo');
	if (!filo) return 0;
	if (filo.filoXromaGet() != xroma) return 0;

	filoDom.data('ok', true);
	if (over) filoDom.data('bottom', over).finish().animate({
		bottom: over
	}, 100);
	return 1;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Trapezi.prototype.efoplismosCLAIM = function() {
	var thesi, basi, klikApantisi;

	thesi = this.partidaEpomenosGet();
	if (Debug.flagGet('epomenosCheck') && Arena.ego.oxiThesi(thesi)) return this;

	Arena.partida.dilosiPanelDOM.empty().
	append(basi = $('<div>').attr('id', 'tsoxaDilosiPanelBasi'));

	basi.
	append($('<div>').addClass('tsoxaButton').attr('id', 'panoButton').data('apodoxi', 'ΝΑΙ').text('ΝΑΙ')).
	append($('<div>').addClass('tsoxaButton').attr('id', 'escapeButton').data('apodoxi', 'ΟΧΙ').text('ΟΧΙ'));

	Arena.partida.xipnitiriOplismos();
	Arena.partida.dilosiPanelDOM.find('.tsoxaButton').addClass('tsoxaDilosiButton').
	off('mouseenter').on('mouseenter', function(e) {
		e.stopPropagation();
		$(this).addClass('tsoxaButtonOplismeno');
	}).
	off('mouseleave').on('mouseleave', function(e) {
		e.stopPropagation();
		$(this).removeClass('tsoxaButtonOplismeno');
	}).
	off('mousedown').on('mousedown', function(e) {
		Arena.inputRefocus(e);
	}).
	off('click').on('click', function(e) {
		Arena.inputRefocus(e);
		Arena.partida.xipnitiriAfoplismos();
		if (Arena.partida.akirosiKiniseon()) return;
		if (klikApantisi) return;

		klikApantisi = true;
		Arena.partida.enimerosiDOM.css('display', 'none');
		Client.skiserService('claimApantisi',
			'thesi=' + thesi,
			'apodoxi=' + $(this).data('apodoxi')).
		fail(function(err) {
			Client.skiserFail(err);
			Arena.partida.enimerosiDOM.css('display', 'block');
			klikApantisi = false;
		});
	});

	Arena.partida.dilosiPanelDOM.css('display', 'block');
	return this;
};
