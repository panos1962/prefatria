// Το singleton "Arena" χρησιμοποιείται ως name space στο οποίο θα εντάξουμε
// functions και αντικείμενα που αφορούν στην αναπαράσταση του σκηνικού στο
// DOM, καθώς επίσης και στον εφοπλισμό των DOM elements με mouse event
// listeners.

Arena = {};

// Στο attribute "flags" εντάσσουμε διάφορες flags που κανονίζουν εν πολλοίς
// τη συμπεριφορά και την εμφάνιση διαφόρων DOM elements.

Arena.flags = {
	// Η flag "emoticon" δείχνει το αν είναι εμφανής η στήλη των emoticons.
	// Η τιμή της flag αλλάζει μέσω κατάλληλου πλήκτρου στο control panel.

	emoticon: true,

	// Η flag "viewBoth" δείχνει αν θα έχουμε πανοραμική ή οικονομική άποψη.
	// Η πανοραμική άποψη περιλαμβάνει ταυτόχρονη εμφάνιση στο DOM τόσο του
	// καφενείου όσο και της παρτίδας, ενώ η οικονομική άποψη εμφανίζει μόνο
	// το καφενείο ή μόνο την παρτίδα. Η αλλαγή της τιμής της flag γίνεται
	// κυρίως μέσω πλήκτρου στο control panel.

	viewBoth: false,

	// Η flag "partidaMode" δείχνει αν ο παίκτης βρίσκεται και επιχειρεί στο
	// καφενείο ή σε κάποια παρτίδα (είτε ως παίκτης είτε ως θεατής).

	partidaMode: false,

	// Η flag "rebelosView" δείχνει αν θα είναι εμφανείς οι περιφερόμενοι παίκτες
	// (ρέμπελοι) στο καφενείο. Η αλλαγή της τιμής της flag γίνεται μέσω ειδικού
	// πλήκτρου στο panel προσκλήσεων.

	rebelosView: true,

	// Η flag "theatisView" δείχνει αν θα είναι εμφανείς οι θεατές στο καφενείο
	// και στην παρτίδα. Η αλλαγή της τιμής της flag γίνεται μέσω ειδικού πλήκτρου
	// στο panel προσκλήσεων.

	theatisView: true,

	// Η flag "epanadiataxiPss" δείχνει αν θα εμφανίζεται πλήκτρο επαναδιάταξης
	// περιοχών pss στο panel των προσκλήσεων. Αυτό το πλήκτρο πρέπει να εμφανίζεται
	// κάθε φορά που αλλάζουμε την default αναλογία περιοχών στο pss μετακινώντας
	// καθ' ύψος τα ενδιάμεσα χωρίσματα των περιοχών αυτών.

	epanadiataxiPss: false,

	// Η flag "kouskous" δείχνει αν βρισκόμαστε σε mode συζήτησης. Σε mode συζήτησης
	// αποκρύπτονται οι λειτουργικές περιοχές καφενείου και τραπεζιού και μεγαλώνει
	// κατά πλάτος ο χώρος συζήτησης και γενικότερα η περιοχή pss. Η αλλαγή της τιμής
	// της εν λόγω flag γίνεται με πλήκτρο στο δεξί μέρος του panel συζήτησης.

	kouskous: false,

	// Η flag "alarmClock" δείχνει αν ο παίκτης έχει ενεργή την ηχητική ειδοποίηση
	// καθυστέρησης. Πρόκειται για μα σειρά ήχων που ηχούν κάθε 10 δευτερόλεπτα με
	// σκοπό την επαναφορά του παίκτη που έχει αφαιρεθεί.

	alarmClock: true,

	// Η flag "sizitisiApoklismos" δείχνει αν τα σχόλια αποκλεισμένων παικτών θα
	// είναι εμφανή ή όχι. By default τα σχόλια αποκλεισμένων παικτών αποκρύπτονται.

	sizitisiApoklismos: true,
};

// Για λόγους ασφαλείας διαγράφουμε τη flag "kinito", ακόμη και αν δεν έχει τεθεί ρητώς,
// ώστε το πρόγραμμα να ακολουθήσει την εξής λογική που αφορά στη συμπεριφορά απέναντι σε
// αυτόματο πληκτρολόγιο οθόνης αφής:
//
// Αν έχει τεθεί URL παράμετρος "kinito", τότε αυτή μεταφράζεται αριθμητικά και εφόσον
// βρεθεί μη μηδενική θεωρείται ότι υπάρχει αυτόματο πληκτρολόγιο οθόνης αφής, αλλιώς
// θεωρείται ότι δεν υπάρχει αυτόματο πληκτρολόγιο οθόνης αφής.
//
// Αν δεν έχει τεθεί URL παράμετρος "kinito", τότε το πρόγραμμα θα αποφασίσει μοναχό του
// αν παρέχεται αυτόματο πληκτρολόγιο οθόνης αφής· αυτό θα γίνει στη φάση στησίματος της
// αρένας.

delete Arena.flags.kinito;

// Η function "viewBoth" επιστρέφει true εφόσον ο χρήστης έχει επιλέξει πανοραμική άποψη,
// ήτοι ταυτόχρονη άποψη παρτίδας και καφενείου.

Arena.viewBoth = function() {
	return Arena.flags.viewBoth;
};

// Η function "viewSingle" επιστρέφει true εφόσον ο χρήστης έχει επιλέξει οικονομική
// άποψη, ήτοι άποψη της παρτίδας ή του καφενείου.

Arena.viewSingle = function() {
	return !Arena.viewBoth();
};

// Η function "partidaMode" επιστρέφει true εφόσον ο χρήστης έχει επιλέξει την περιοχή
// της παρτίδας. Η παρτίδα περιλαμβάνει τους νεοφερμένους, την τσόχα του τραπεζιού στο
// οποίο εξελίσσεται η παρτίδα και τη συζήτηση που αφορά στο συγκεκριμένο τραπέζι.

Arena.partidaMode = function() {
	return Arena.flags.partidaMode;
};

// Η function "kafenioMode" επιστρέφει true εφόσον ο χρήστης έχει επιλέξει την περιοχή
// καφενείου. Η περιοχή καφενείου περιλαμβάνει τους περιφερόμενους παίκτες και συνοπτική
// άποψη όλων των τραπεζιών. Όσον αφορά στη συζήτηση, στο προσκήνιο έρχεται η συζήτηση
// που εξελίσσεται στο συγκεκριμένο τραπέζι.

Arena.kafenioMode = function() {
	return !Arena.partidaMode();
};

// Η function "rebelosView" επιστρέφει true όσο η περιοχή των περιφερομένων παικτών είναι
// εμφανής.

Arena.rebelosView = function() {
	return Arena.flags.rebelosView;
};

// Η function "theatisView" επιστρέφει true όσο η περιοχή των θεατών, τόσο στο καφενείο όσο
// και στην παρτίδα είναι εμφανής.

Arena.theatisView = function() {
	return Arena.flags.theatisView;
};

// Η function "kouskous" επιστρέφει true εφόσον ο χρήστης έχει επιλέξει mode συζήτησης, όπου
// τόσο το καφενείο όσο και η παρτίδα έχουν αποκρυβεί και έχει απλωθεί απ' άκρου εις άκρον
// η περιοχή προσκλήσεων, αναζητήσεων και συζήτησης.

Arena.kouskous = function() {
	return Arena.flags.kouskous;
};

// Η function "isKinito" επιστρέφει true εφόσον το πρόγραμμα τρέχει σε οθόνη αφής.

Arena.isKinito = function() {
	return Arena.flags.kinito;
};

Arena.oxiKinito = function() {
	return !Arena.isKinito();
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function() {
	window.name = 'arena';
	Client.fortos.setup();
	Client.toolbarLeft('pexnidi');
	Client.toolbarRight();
	Arena.kafenioDOM = $('<div>').addClass('stiliPeriexomeno').appendTo('#stiliKafenio');
	Arena.partidaDOM = $('<div>').addClass('stiliPeriexomeno').appendTo('#stiliPartida');
	Arena.cpanelDOM = $('<div>').addClass('stiliPeriexomeno').appendTo('#stiliCpanel');
	Arena.pssDOM = $('<div>').addClass('stiliPeriexomeno').appendTo('#stiliPss');
	Arena.epanelDOM = $('<div>').addClass('stiliPeriexomeno').appendTo('#stiliEpanel');
	Arena.setup();

	Client.fyi.pano('Αναμένονται πλήρη σκηνικά δεδομένα. Παρακαλώ περιμένετε…').
	skiserService('salute').
	done(function(rsp) {
		Arena.skiniko.stisimo(function() {
			Client.fyi.pano('Καλώς ήλθατε στον «Πρεφαδόρο»');
			Client.fyi.kato('Καλή διασκέδαση και καλές σολαρίες!');
			Arena.prosklisi.panel.bpanelRefresh();
			Arena.sizitisi.prosvasi();

			if (Arena.ego.oxiTrapezi())
			return Client.bodyDOM.scrollTop(0);

			// Αν ο παίκτης βρίσκεται σε κάποιο τραπέζι, τον περνάμε αυτόματα
			// σε mode παρτίδας, αλλά κάνουμε εμφανές το tab που τον επαναφέρει
			// στο καφενείο.

			Arena.partidaModeSet();
			Arena.modeTabDOM.kounima(20);
		});
	}).
	fail(function(rsp) {
		$.ajax('account/exodos.php', {async: false});
		Client.provlima('<div>Η συνεδρία σας έχει λήξει!</div><div><a href="' +
		Client.server + 'isodos" target="_self">Επανείσοδος</a></div>').css({
			textAlign: 'center',
		});
	});
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Arena.unload = function() {
	if (Arena.unloaded) return;
	Arena.unloaded = true;

	Arena.
	paraskinio.klisimo().
	kitapi.klisimo().
	funchat.klisimo().
	arxio.klisimo().
	minima.klisimo();
};

Arena.windowDOM = $(window).
on('beforeunload', function() {
	Arena.unload();
}).
on('unload', function() {
	Arena.unload();
}).
on('focus', function() {
	setTimeout(function() {
		Arena.inputRefocus();
	}, 100);
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.setup = function() {
	Arena.
	setupOfelimo().
	setupDiafimisi().
	setupMotd().
	setupFortos().
	setupKafenio().
	partida.setup().
	arxio.setup().
	minima.setup().
	setupPss().
	setupCpanel().
	setupEpanel().
	setupView().
	setupMode().
	radiaki.setup().
	setupKinito().
	viewRefresh();

	if (Arena.oxiKinito())
	Arena.inputTrexon.focus();

	if (Arena.flags.test === 'pexnidi') {
		Arena.pssDOM.css('display', 'none');
		Arena.epanelDOM.css('display', 'none');
	}

	Client.ofelimoDOM.
	on('keyup', function(e) {
		Arena.sintomefsiCheck(e);
	}).
	on('mouseup', function(e) {
		Arena.inputRefocus();
	}).
	on('mouseenter', '.pektis', function(e) {
		var pektis = $(this).data('pektis');
		if (pektis) pektis.pektisFyiInfo();
	}).
	on('mouseleave', '.pektis', function(e) {
		if ($(this).data('pektis'))
		Client.fyi.pano();
	}).
	on('click', '.pektis,.anazitisi', function(e) {
		var pektis = $(this).data('pektis');
		if (pektis) pektis.pektisFormaPopupDOM(e);
	});

	return Arena;
};

Arena.setupOfelimo = function() {
	Client.ofelimoDOM.
	append(Arena.xipnitiriDOM = $('<div>')).
	append(Arena.pektisFormaDOM = $('<div>').attr('id', 'pektisForma').siromeno({
		top: '32px',
		left: '624px',
	}));

	Arena.resizeOfelimo();
	return Arena;
};

Arena.resizeOfelimo = function() {
	var dh;

	Arena.windowHeight = Arena.windowDOM.innerHeight()
	dh = Arena.windowHeight - Client.bodyDOM.outerHeight(true);

	if (dh > 0)
	Client.ofelimoDOM.css('height', '+=' + dh + 'px');

	Arena.ofelimoHeight = Client.ofelimoDOM.outerHeight(true);
	dh = Arena.windowHeight - Client.bodyDOM.outerHeight(true);

	if (dh > 20)
	Arena.ofelimoHeight += dh;

	Client.ofelimoDOM.css('height', Arena.ofelimoHeight + 'px');

	$('#arena td').addClass('stili').
	find('.stiliPeriexomeno').css('height', Client.ofelimoDOM.innerHeight() + 'px');

	return Arena;
};

// Στις περιπτώσεις που παρέχεται επιλογή ΠΑΣΟ μέσω σχετικού πλήκτρου, δίνουμε
// τη δυνατότητα στον παίκτη να πατήσει το πλήκτρο Escape αντί του σχετικού
// πλήκτρου. Προϋπόθεση γι' αυτό είναι το πλήκτρο να φέρει id "escapeButton".
// Η μέθοδος "sintomefsiCheck" επιστρέφει ακριβώς αυτό το πλήκτρο ως jQuery
// list με ΑΚΡΙΒΩΣ ΕΝΑ dom element. Τα ίδια ισχύουν και για τα πλήκτρα Up Arrow
// με id "panoButton", και Down Arrow με id "katoButton".

Arena.sintomefsiCheck = function(e) {
	var keyIdMap = {
		27: 'escapeButton',
		38: 'panoButton',
		40: 'katoButton',
	}, button;

	if (!keyIdMap.hasOwnProperty(e.which))
	return undefined;

	if (e.shiftKey)
	return undefined;

	if (e.ctrlKey)
	return undefined;

	if (e.altKey)
	return undefined;

	if (e.metaKey)
	return undefined;

	button = $('#' + keyIdMap[e.which]);

	if (button.length !== 1)
	return undefined;

	// Ελέγχουμε αν το πλήκτρο έχει ήδη πατηθεί με συντόμευση.

	if (button.data('sintomefsi'))
	return undefined;

	e.stopPropagation();
	button.addClass('tsoxaButtonOplismeno').data('sintomefsi', true).trigger('click');

	return button;
};

Arena.setupDiafimisi = function() {
	Client.diafimisi.callback = function() {
		Client.diafimisi.emfanis = false;
		Arena.cpanel.bpanelButtonGet('diafimisi').refresh();
	};

	return Arena;
};

Arena.setupMotd = function() {
	Client.motd.callback = function() {
		Client.motd.emfanes = false;
		Arena.cpanel.bpanelButtonGet('motd').refresh();
	};

	return Arena;
};

// Ακυρώνουμε την κλασική ανανέωση δεδομένων φόρτου, καθώς θα παίρνουμε
// τον φόρτο της CPU με κάθε ενημέρωση σκηνικών δεδομένων από τον skiser,
// ενώ το πλήθος των online παικτών και των ενεργών τραπεζιών θα υπολογίζεται
// στον client από τα τοπικά σκηνικά δεδομένα.

Arena.setupFortos = function() {
	Client.fortos.clearTimer();
	return Arena;
};

Arena.setupKafenio = function() {
	Arena.kafenioDOM.css('overflowY', 'auto');
	Arena.rebelosDOM = $('<div>').attr('id', 'rebelos').appendTo(Arena.kafenioDOM);
	Arena.trapeziDOM = $('<div>').attr('id', 'trapezi').appendTo(Arena.kafenioDOM);

	return Arena;
};

Arena.setupCpanel = function() {
	Arena.cpanel.bpanelRefresh();
	Arena.cpanelDOM.empty().
	append(Arena.cpanel.bpanelVertical().bpanelGetDOM());

	return Arena;
};

Arena.panelRefresh = function(omada) {
	Arena.cpanel.bpanelRefresh(omada);
	Arena.pektisPanelRefreshDOM();
	return Arena;
}

Arena.setupEpanel = function() {
	Arena.epanel.setup();
	Arena.epanel.bpanelRefresh();
	Arena.epanelDOM.empty().
	append(Arena.epanel.bpanelVertical().bpanelGetDOM());

	if (Arena.flags.emoticon)
	$('#stiliEpanel').css('display', 'table-cell');

	return Arena;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.setupPss = function() {
	Arena.pssDOM.empty();
	Arena.
	prosklisi.setup().
	anazitisi.setup().
	sizitisi.setup().
	epanadiataxiPss();

	return Arena;
};

Arena.epanadiataxiPss = function() {
	var hpss, prosklisiH = 66, anazitisiH = 120, sizitisiH;

	hpss = $('#stiliPss').innerHeight();
	hpss -= Arena.prosklisi.panelDOM.outerHeight(true);
	hpss -= Arena.anazitisi.panelDOM.outerHeight(true);
	hpss -= Arena.sizitisi.panelDOM.outerHeight(true);

	Arena.prosklisi.areaDOM.css('height', prosklisiH + 'px');
	Arena.anazitisi.areaDOM.css('height', anazitisiH + 'px');
	sizitisiH = hpss - prosklisiH - anazitisiH - 3;
	Arena.sizitisi.areaDOM.css('height', sizitisiH + 'px');

	Arena.flags.epanadiataxiPss = false;
	Arena.prosklisi.panel.bpanelButtonGet('epanadiataxiPss').pbuttonDisplay();

	return Arena;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.setupView = function() {
	var dom;

	dom = Client.tab($('<a>').attr({href: '#'}).
	on('click', function(e) {
		Arena.inputRefocus(e);
		Arena.flags.viewBoth = !Arena.flags.viewBoth;
		Arena.viewRefresh();
	}).append(Arena.viewTabDOM = Client.sinefo('')));

	$('#toolbarLeft').prepend(dom);
	Arena.viewRefresh();

	return Arena;
};

Arena.viewRefresh = function() {
	var kirio, oirik;

	if (Arena.partidaMode()) {
		kirio = $('#stiliPartida');
		oirik = $('#stiliKafenio');
	}
	else {
		kirio = $('#stiliKafenio');
		oirik = $('#stiliPartida');
	}

	if (Arena.kouskous()) {
		kirio.css('display', 'none');
		oirik.css('display', 'none');
	}
	else {
		kirio.css('display', 'table-cell');
		oirik.css('display', Arena.viewBoth() ? 'table-cell' : 'none');
	}

	Arena.viewTabDOM.text(Arena.viewBoth() ? 'Οικονομική' : 'Πανοραμική');
	Arena.cpanel.bpanelButtonGet('view').pbuttonRefresh();

	return Arena;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.setupKinito = function() {
	if (Arena.flags.hasOwnProperty('kinito'))
	return Arena;

	Arena.flags.kinito = ('ontouchstart' in document.documentElement);

	return Arena;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.setupMode = function() {
	var dom;

	dom = Client.tab($('<a>').attr({href: '#'}).
	on('click', function(e) {
		Arena.inputRefocus(e);
		Arena.flags.partidaMode = !Arena.flags.partidaMode;
		Arena.modeRefresh();
	}).append(Arena.modeTabDOM = Client.sinefo('')));

	$('#toolbarLeft').prepend(dom);
	Arena.modeRefresh();

	return Arena;
};

// Η function "modeRefresh" καλείται όποτε αλλάζουμε εστίαση από καφενείο
// σε τραπέζι και το αντίστροφο. 

Arena.modeRefresh = function() {
	var tabela;

	if (Arena.partidaMode()) {
		Arena.modeTabDOM.text('Καφενείο');
		$('#stiliKafenio').addClass('stiliIpotoniki');
		$('#stiliPartida').removeClass('stiliIpotoniki');
		Arena.sizitisi.kafenioDOM.css('display', 'none');
		Arena.sizitisi.trapeziDOM.css('display', 'block');
		tabela = 'ΤΡΑΠΕΖΙ';

		if (Arena.ego.trapeziKodikos)
		tabela += ' ' + Arena.ego.trapeziKodikos;
	}
	else {
		Arena.modeTabDOM.text('Παρτίδα');
		$('#stiliPartida').addClass('stiliIpotoniki');
		$('#stiliKafenio').removeClass('stiliIpotoniki');
		Arena.sizitisi.trapeziDOM.css('display', 'none');
		Arena.sizitisi.kafenioDOM.css('display', 'block');
		tabela = 'ΚΑΦΕΝΕΙΟ';
	}

	Arena.sizitisi.tabelaDOM.text(tabela);
	Arena.sizitisi.areaDOM.scrollKato();
	Arena.viewRefresh();
	Arena.sizitisi.prosvasi();

	return Arena;
};

Arena.partidaModeSet = function() {
	if (Arena.kafenioMode())
	Arena.modeTabDOM.trigger('click');

	return Arena;
};

Arena.kafenioModeSet = function() {
	if (Arena.partidaMode())
	Arena.modeTabDOM.trigger('click');

	return Arena;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "inputRefocus" σκοπό έχει την επανατοποθέτηση του κέρσορα γραφής στο
// τρέχον input πεδίο της εφαρμογής. Υπάρχουν δύο input πεδία, το πεδίο αναζήτησης
// παικτών και το πεδίο γραφής σχολίων συζήτησης. Κάθε φορά που κάνουμε κλικ σε
// κάποιο οπλισμένο DOM element, π.χ. όταν παίζουμε κάποιο φύλλο, ή όταν επιλέγουμε
// κάποια αγορά από το panel των αγορών, ο κέρσορας χάνει το focus από το τρέχον
// input πεδίο, οπότε μπορούμε να καλούμε την εν λόγω function προκειμένου να
// επαναφέρουμε τον κέρσορα στο τρέχον input πεδίο. Παράλληλα συνδυάζουμε και
// την ακύρωση του event propagation που είναι πάγια σε τέτοιου είδους events.

Arena.inputRefocus = function(e) {
	if (e) {
		e.stopPropagation();
		e.preventDefault();
	}

	if (Arena.isKinito())
	return Arena;

	Arena.inputTrexon.focus();
	return Arena;
};

Arena.kafenioScrollTop = function() {
	Arena.kafenioDOM.finish().animate({
		scrollTop: 0
	}, 400, 'easeInQuint');

	return Arena;
};

// Η function "trapeziRithmisi" επιστρέφει true εφόσον ο χρήστης ανήκει σε κάποιο
// τραπέζι και το τραπέζι βρίσκεται σε φάση ρυθμίσεων, δηλαδή πριν παιχτεί οποιαδήποτε
// διανομή. Αν θέλουμε μπορούμε αγνοήσουμε το αν υπάρχουν ή όχι διανομές περνώτας
// literal true.
//
// Η function χρησιμποιείται κατά κόρον στο control panel, μπορεί όμως να χρησιμοποιηθεί
// και οπουδήποτε αλλού.

Arena.trapeziRithmisi = function(dianomi) {
	if (Arena.ego.oxiTrapezi()) return false;
	if (Arena.ego.oxiPektis()) return false;
	if (Arena.ego.trapezi.trapeziIsIdioktito() && Arena.ego.oxiThesi(1)) return false;

	if (dianomi === undefined) dianomi = Debug.flagGet('rithmisiPanta');
	if (dianomi) return true;

	return Arena.ego.trapezi.trapeziOxiDianomi();
};

Arena.trapeziOxiRithmisi = function(dianomi) {
	return !Arena.trapeziRithmisi(dianomi);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Arena.paraskinio = {
	win: null,
	button: $(),
};

Arena.paraskinio.open = function() {
	Arena.paraskinio.klisimo();
	Arena.paraskinio.win = window.open(Client.server + 'paraskinio',
		'_blank', 'top=' + (window.screenY + 200) + ',left=' +
		(window.screenX + 100) + ',width=820,height=400,scrollbars=1');
	Arena.paraskinio.button.addClass('panelButtonEkremes');
	return Arena;
};

Arena.paraskinio.klisimo = function() {
	if (!Arena.paraskinio.win)
	return Arena;

	Arena.paraskinio.win.close();
	delete Arena.paraskinio.win;
	Arena.paraskinio.button.removeClass('panelButtonEkremes');
	return Arena;
};

Arena.paraskinioAlagi = function(img) {
	$(document.body).css({backgroundImage:img});
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Arena.funchat = {
	win: null,
};

Arena.funchat.isAnikto = function() {
	return Arena.funchat.win;
};

Arena.funchat.isKlisto = function() {
	return !Arena.funchat.isAnikto();
};

Arena.funchat.anigma = function() {
	if (Arena.funchat.isAnikto())
	Arena.funchat.klisimo();

	Arena.funchat.win = window.open('funchat', '_blank', 'top=' + (window.screenY - 100) +
		',left=' + (window.screenX + 640) + ',width=900,height=800,scrollbars=1');

	Arena.cpanel.bpanelRefresh(1);
	return Arena.funchat;
};

Arena.funchat.klisimo = function() {
	if (Arena.funchat.isKlisto())
	return Arena;

	Arena.funchat.win.close();
	Arena.funchat.win = null;

	Arena.cpanel.bpanelRefresh();
	return Arena;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Arena.minima = {
	win: null,
};

Arena.minima.setup = function() {
	var tbr, dom;

	tbr = $('#toolbarLeft');
	if (!tbr.length) return Arena;

	Client.tab($('<a>').attr('href', 'minima').
	on('click', function(e) {
		Arena.inputRefocus();
		Arena.minima.endixiClear();

		if (Arena.minima.isAnikto())
		Arena.minima.focus();

		else
		Arena.minima.anigma();

		return false;
	}).append(dom = Client.sinefo('PM')), tbr);

	dom.css('position', 'relative').
	append(Arena.minima.endixiDOM = $('<div>').addClass('minimaEndixi').
	on('mouseenter', function() {
		$(this).addClass('minimaEndixiLow');
	}));
	Client.ajaxService('minima/check.php').
	done(function(rsp) {
		var count, msg;

		if (!rsp) return;
		count = parseInt(rsp);
		if (isNaN(count)) return;
		if (count <= 0) return;

		msg = 'Έχετε ' + rsp + ' ' + (count === 1 ? 'αδιάβαστο μήνυμα' : 'αδιάβαστα μηνύματα');
		Arena.minima.endixiDOM.finish().fadeIn({
			duration: 1000,
			easing: 'easeInExpo',
		}).
		text(rsp).attr('title', msg);
	}).
	fail(function(err) {
		var msg;

		if (err.hasOwnProperty('responseText') && (err.responseText !== ''))
		msg = err.responseText;

		else if (typeof err === 'string')
		msg = err;

		Arena.minima.endixiDOM.text('?').attr('title', msg);
	});

	return Arena;
};

Arena.minima.anigma = function() {
	Arena.minima.win = window.open('minima', '_blank', 'top=' + (window.screenY + 100) +
		',left=' + (window.screenX - 100) + ',width=1200,height=800,scrollbars=1');
	return Arena.minima;
};

Arena.minima.klisimo = function() {
	if (Arena.minima.isKlisto())
	return Arena;

	Arena.minima.win.close();
	Arena.minima.win = null;

	return Arena;
};

Arena.minima.isAnikto = function() {
	return Arena.minima.win;
};

Arena.minima.isKlisto = function() {
	return !Arena.minima.isAnikto();
};

Arena.minima.focus = function() {
	Arena.minima.win.focus();

	return Arena;
};

Arena.minima.endixiClear = function() {
	Arena.minima.endixiDOM.finish().fadeOut().
	empty().removeAttr('title');

	return Arena;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Ακολουθούν δομές και functions σχετικές με το αρχείο. Η σελίδα του αρχείου
// μπορεί να ανοίξει είτε αυτόνομα, είτε από το σχετικό tab της βασικής σελίδας.
// Εδώ έχουμε τα σχετικά με τη σελίδα του αρχείου εφόσον αυτή ανοίξει από τη
// βασική σελίδα.

Arena.arxio = {
	// Η property "win" «κρατά» το παράθυρο της σελίδας του αρχείου που θα
	// ανοίξει από τη βασική σελίδα.

	win: null,
};

// Η function "setup" δημιουργεί το tab του αρχείου στο επάνω αριστερό μέρος της
// σελίδας.

Arena.arxio.setup = function() {
	Client.tab($('<a>').attr('href', 'arxio').
	on('click', function(e) {
		Arena.inputRefocus();

		if (Arena.arxio.isAnikto())
		Arena.arxio.win.focus();

		else
		Arena.arxio.win = window.open('arxio', '_blank');

		return false;
	}).
	append(Client.sinefo('Αρχείο')), $('#toolbarLeft'));

	return Arena;
};

// Η function "klisimo" κλείνει τη σελίδα του αρχείου που ανοίξαμε από τη βασική
// σελίδα και απελευθερώνει τον σχετικό σύνδεσμο.

Arena.arxio.klisimo = function() {
	if (Arena.arxio.isKlisto())
	return Arena;

	Arena.arxio.win.close();
	Arena.arxio.win = null;

	return Arena;
};

// Η function "isAnikto" επιστρέφει true εφόσον υπάρχει σελίδα αρχείου που έχει
// ανοίξει από τη βασική σελίδα, αλλιώς επιστρέφει false.

Arena.arxio.isAnikto = function() {
	if (!Arena.arxio)
	return false;

	if (!Arena.arxio.win)
	return false;

	return true;
};

Arena.arxio.isKlisto = function() {
	return !Arena.arxio.isAnikto();
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Arena.ixosFilos = function() {
	ixos = Arena.ego && Arena.ego.pektis && Arena.ego.pektis.peparam &&
		Arena.ego.pektis.peparam.hasOwnProperty('SOUNDFILOS') ?
		Arena.ego.pektis.pektisPeparamGet('SOUNDFILOS') : 'deskbell.ogg';
	if (ixos) Client.sound.play(ixos);
	return Arena;
}

Arena.ixosTheatis = function() {
	ixos = Arena.ego && Arena.ego.pektis && Arena.ego.pektis.peparam &&
		Arena.ego.pektis.peparam.hasOwnProperty('SOUNDTHEATIS') ?
		Arena.ego.pektis.pektisPeparamGet('SOUNDTHEATIS') : 'tinybell.ogg';
	if (ixos) Client.sound.play(ixos);
	return Arena;
}

Arena.kornaLista = [
	{s:'beep2.ogg'},
	{s:'beep4.ogg'},
	{s:'bop2.ogg'},
	{s:'dinati3.ogg'},
	{s:'dinati4.ogg'},
	{s:'honk.ogg'},
	{s:'honk2.ogg'},
	{s:'kanoniki3.ogg'},
];

Arena.kornaPlay = function() {
	var korna;

	korna = Arena.kornaLista[Globals.random(1000) % Arena.kornaLista.length];
	if (!korna.hasOwnProperty('v')) korna.v = 10;
	Client.sound.play('korna/' + korna.s, korna.v);
};
