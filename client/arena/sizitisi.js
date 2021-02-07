Arena.sizitisi = {
	// Η παράμετρος "lexiMax" δείχνει το μέγιστο μήκος λέξης
	//σχολίου συζήτησης. Τίθεται περιορισμός ώστε να μην
	// απλώνεται η περιοχή της συζήτησης από μεγάλες λέξεις.

	lexiMax: 40,

	mikosMax: 40,
	mikosCut: 10,
};

Arena.sizitisi.flags = {
	// Η flag "pagomeni" δείχνει αν η περιοχή της συζήτησης είναι
	// σταθερή και δεν σκρολάρει κάθε φορά που εμφανίζεται κάποιο
	// καινούριο σχόλιο.

	pagomeni: false,

	// Η flag "molivi" δείχνει αν ο χρήστης έχει αρχινημένο μολύβι.
	// Το μολύβι εκκινεί κάθε φορά που ο χρήστης αρχίζει να γράφει
	// στο πεδίο εισαγωγής σχολίων, και παύει όταν ο χρήστης καθαρίσει
	// το πεδίο, ή με την παραλαβή σχολίου του συγκεκριμένου χρήστη
	// από τον server.

	molivi: false,

	// Η flag "funchatIxos" δείχνει αν τα funchat με ήχο θα ακούγονται.
	// Πράγματι, υπάρχουν αρκετά funchat items που συνοδεύονται από
	// ηχητικά εφέ· o χρήστης μπορεί να «σιγάσει» αυτά τα εφέ.

	funchatIxos: true,
};

// Η function "isPagomeni" δείχνει αν η περιοχή συζήτησης είναι παγωμένη.

Arena.sizitisi.isPagomeni = function() {
	return Arena.sizitisi.pagomeni;
};

Arena.sizitisi.oxiPagomeni = function() {
	return !Arena.sizitisi.isPagomeni();
};

// Η function "isMolivi" δείχνει αν ο χρήστης έχει αρχινημένο μολύβι.

Arena.sizitisi.isMolivi = function() {
	return Arena.sizitisi.flags.molivi;
};

Arena.sizitisi.oxiMolivi = function() {
	return !Arena.sizitisi.isMolivi();
};

// Η function "isFunchatIxos" δείχνει αν ο χρήστης έχει ήχο στο funchat.

Arena.sizitisi.isFunchatIxos = function() {
	return Arena.sizitisi.flags.funchatIxos;
};

Arena.sizitisi.isFunchatSigasi = function() {
	return !Arena.sizitisi.isFunchatIxos();
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.sizitisi.setup = function() {
	var dom;

	Arena.sizitisi.panelDOM = $('<div>').appendTo(Arena.pssDOM);
	dom = $('<div>').appendTo(Arena.pssDOM).css('position', 'relative');

	// Ακολουθεί η πινακίδα στο επάνω μέρος της συζήτησης που αναφέρει,
	// με μεγάλα πλην αχνά γράμματα, αν πρόκειται για δημόσια συζήτηση,
	// ή για συζήτηση τραπεζιού.

	Arena.sizitisi.tabelaDOM = $('<div>').attr('id', 'sizitisiTabela').appendTo(dom);

	// Ακολουθεί, πάλι στο επάνω μέρος της συζήτησης, το εικονίδιο διαγραφής
	// ολόκληρης της συζήτησης τραπεζιού. Αυτό το εικονίδιο εμφανίζεται όταν
	// ο χρήστης διαγράφει το τελευταίο σχόλιο και εξαφανίζεται μετά από λίγο,
	// εκτός και αν ο χρήστης τοποθετήσει επάνω στο εικονίδιο τον δείκτη τού
	// ποντικιού, οπότε διαρκεί όσο ο δείκτης παραμένει εκεί.

	Arena.sizitisi.diagrafiAllDOM = $('<img>').attr({
		id: 'sizitisiDiagrafiAllIcon',
		src: 'ikona/misc/Xred.png',
		title: 'Tabula rasa',
	}).
	on('click', function(e) {
		Arena.inputRefocus(e);
		Client.skiserService('sizitisiDiagrafi').
		done(function(rsp) {
			Arena.sizitisi.diagrafiAllDOM.finish().fadeOut(200);
			Client.fyi.pano(rsp);
		}).
		fail(function(err) {
			Client.skiserFail(err);
		});
	}).
	on('mouseenter', function(e) {
		Arena.sizitisi.diagrafiAllDOM.finish().css('display', 'block');
	}).
	on('mouseleave', function(e) {
		Arena.sizitisi.diagrafiAllDOM.finish().fadeOut(200);
	}).appendTo(dom);

	// Ακολουθεί η περιοχή στην οποία περιέχονται τόσο η δημόσια συζήτηση,
	// όσο και η συζήτηση τραπεζιού. Περιέχεται επίσης η περιοχή προεπισκόπησης
	// σχολίων.

	Arena.sizitisi.areaDOM = $('<div>').addClass('pss').appendTo(dom);

	Arena.sizitisi.kafenioDOM = $('<div>').addClass('sizitisiArea').appendTo(Arena.sizitisi.areaDOM);
	Arena.sizitisi.trapeziDOM = $('<div>').addClass('sizitisiArea').appendTo(Arena.sizitisi.areaDOM);
	Arena.sizitisi.proepiskopisiDOM = $('<div>').attr('id', 'sizitisiProepiskopisi').appendTo(Arena.sizitisi.areaDOM);
	Arena.sizitisi.areaDOM.
	on('click', '.sizitisiPektis', function(e) {
		var login, pektis;

		Arena.inputRefocus(e);

		login = $(this).text();
		if (!login)
		return;

		pektis = Arena.skiniko.skinikoPektisGet(login);
		if (!pektis)
		Arena.skiniko.skinikoPektisSet(pektis = new Pektis({
			login: login,
		}));

		return pektis.pektisFormaPopupDOM();
	}).
	on('mouseenter', '.sizitisi', function(e) {
		var pote;

		$(this).addClass('sizitisiEpilogi');

		pote = $(this).data('pote');
		if (!pote) return;

		pote = Globals.poteOra(pote + Client.timeDif);
		$(this).append($('<div>').addClass('sizitisiPote').text(pote));
	}).
	on('mouseleave', '.sizitisi', function(e) {
		$(this).
		removeClass('sizitisiEpilogi').
		children('.sizitisiPote').remove();
	}).
	on('mousedown', '.sizitisi', function(e) {
		$(this).
		children('.sizitisiPote').css('display', 'none');
	}).
	on('mouseup', '.sizitisi', function(e) {
		$(this).
		children('.sizitisiPote').css('display', 'block');
	});

	Arena.sizitisi.panel.bpanelRefresh();
	Arena.sizitisi.panelDOM.
	append(Arena.sizitisi.panel.bpanelHorizontal().bpanelSiromeno().bpanelGetDOM());
	Arena.sizitisi.panelSetup();

	Arena.sizitisi.panel.bpanelButtonGet('metakinisi').pbuttonGetDOM().
	on('mouseenter', function(e) {
		$(this).css('cursor', 'ns-resize');
	});

	Arena.sizitisi.panel.bpanelButtonGet('kouskous').pbuttonDexia();
	return Arena;
};

Arena.sizitisi.scrollKato = function(opts) {
	if (Arena.sizitisi.isPagomeni())
	return Arena;

	Arena.sizitisi.areaDOM.scrollKato(opts);
	return Arena;
};

Arena.sizitisi.prosvasi = function() {
	// Η συζήτηση στο τραπέζι είναι ελεύθερη για όλους.

	if (Arena.partidaMode()) {
		if (Arena.ego.isTrapezi())
		Arena.sizitisi.prosvasiNai();

		else
		Arena.sizitisi.prosvasiOxi();
	}

	// Η δημόσια συζήτηση είναι περιορισμένη από διαχειριστές και άνω.

	else {
		if (Arena.ego.isAdministrator())
		Arena.sizitisi.prosvasiNai();

		else
		Arena.sizitisi.prosvasiOxi();

		// Αφήνω για όλους τελικά (Δεκέμβριος 2018)

		// Τελικά το ξανάκλεισα γιατί έγινε κώλος.
		return;

		Arena.sizitisi.prosvasiNai();
	}

	Arena.inputRefocus();
	return Arena;
};

Arena.sizitisi.prosvasiNai = function() {
	Arena.sizitisi.inputDOM.attr('disabled', false);
	Arena.sizitisi.panel.apostoliButton.pbuttonShow();
	return Arena;
};

Arena.sizitisi.prosvasiOxi = function() {
	Arena.sizitisi.inputDOM.attr('disabled', true);
	Arena.sizitisi.panel.apostoliButton.pbuttonHide();
	return Arena;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.sizitisi.panel = new BPanel();

Arena.anazitisi.panel.clickCommon = function(e) {
	Arena.inputRefocus(e);
};

Arena.sizitisi.panel.bpanelButtonPush(new PButton({
	id: 'metakinisi',
	img: 'ikona/misc/bara.png',
	title: 'Αυξομείωση περιοχής προσκλήσεων',
}));

Arena.sizitisi.panel.bpanelGetDOM().
append(Arena.sizitisi.inputDOM = $('<input>').addClass('panelInput').
on('keyup', function(e) {
	Arena.sizitisi.keyup(e);
}).
on('click', function(e) {
	e.stopPropagation();
	Arena.inputTrexon = $(this);
	Arena.inputTrexon.focus();
}));

Arena.inputTrexon = Arena.sizitisi.inputDOM;

Arena.sizitisi.panel.bpanelButtonPush(Arena.sizitisi.panel.apostoliButton = new PButton({
	id: 'apostoli',
	img: 'talk.png',
	title: 'Υποβολή σχολίου',
	click: function(e) {
		Arena.sizitisi.apostoli();
	},
}));

Arena.sizitisi.panel.bpanelButtonPush(new PButton({
	id: 'clear',
	img: 'clear.png',
	title: 'Καθαρισμός πεδίου εισαγωγής σχολίου',
	click: function(e) {
		Arena.
		sizitisi.katharismos().
		sizitisi.moliviTelos();
	},
}));

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.sizitisi.panel.bpanelButtonPush(Arena.sizitisi.panel.diagrafiButton = new PButton({
	id: 'diagrafi',
	img: 'ikona/misc/Xred.png',
	title: 'Διαγραφή σχολίου',
	click: function(e) {
		var sxolio;

		if (Arena.kafenioMode()) {
			if (Arena.ego.oxiEpoptis()) {
				Client.sound.beep();
				Client.fyi.ekatoDexia('Δεν επιτρέπεται διαγραφή σχολίων δημόσιας συζήτησης');
				return;
			}

			Arena.sizitisi.panel.diagrafiButton.pbuttonLock();
			Client.skiserService('sizitisiClearKafenio').
			done(function(rsp) {
				Client.fyi.pano(rsp);
				Arena.sizitisi.panel.diagrafiButton.pbuttonRelease();
			}).
			fail(function(err) {
				Client.skiserFail(err);
				Arena.sizitisi.panel.diagrafiButton.pbuttonRelease();
			});
			return;
		}

		if (Arena.ego.oxiPektis()) {
			Client.sound.beep();
			Client.fyi.ekatoDexia('Δεν επιτρέπεται διαγραφή σχολίων από τους θεατές');
			return;
		}

		// Επιχειρούμε να αδράξουμε τον κωδικό του τελευταίου σχολίου της
		// συζήτησης του τραπεζιού.

		sxolio = Arena.ego.trapezi.trapeziSizitisiLast();

		// Αν υπάρχει σχόλιο στη συζήτηση του τραπεζιού, τότε προτείνουμε
		// το εικονίδιο μαζικής διαγραφής και προχωρούμε στη διαγραφή του
		// σχολίου.

		if (sxolio)
		Arena.sizitisi.diagrafiAllDOM.finish().css('display', 'block').
		delay(1000).fadeOut(800);

		// Σε περίπτωση που δεν υπάρχουν σχόλια στη λίστα σχολίων του τραπεζιού
		// αλλά υπάρχουν DOM elements σχολίων συζήτησης τραπεζιού, πρόκειται
		// για κόρνες, μολύβια κλπ, που δεν καταχωρούνται στην database και
		// στη λίστα συζήτησης του τραπεζιού. Σ' αυτή την περίπτωση διαγράφουμε
		// όλη τη συζήτηση, δηλαδή όλα αυτά τα σχόλια από το DOM.

		else if (Arena.sizitisi.trapeziDOM.children('.sizitisi').length)
		sxolio = 0;

		// Δεν υπάρχουν σχόλια ούτε στη λίστα σχολίων της συζήτησης του τραπεζιού
		// ούτε στο DOM της συζήτησης τραπεζιού. Εδώ δεν υπάρχει κάτι για διαγραφή.

		else {
			Client.sound.beep();
			Client.fyi.ekatoDexia('Δεν υφίσταται σχόλιο προς διαγραφή');
			return;
		}

		Arena.sizitisi.panel.diagrafiButton.pbuttonLock();
		Client.skiserService('sizitisiDiagrafi', 'sxolio=' + sxolio).
		done(function(rsp) {
			Client.fyi.pano(rsp);
			Arena.sizitisi.panel.diagrafiButton.pbuttonRelease();
		}).
		fail(function(err) {
			Client.skiserFail(err);
			Arena.sizitisi.panel.diagrafiButton.pbuttonRelease();
		});
	},
}));

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Ο τελευταίος ήχος που παίχτηκε από funchat κρατείται στο "funchatIxosLast"
// ως jQuery list (με ένα στοιχείο).

Arena.sizitisi.funchatIxosLast = null;

Arena.sizitisi.panel.bpanelButtonPush(Arena.sizitisi.sigasiFunchatButton = new PButton({
	id: 'sigasi',
	img: 'ikona/panel/funchat/ixos.png',
	title: 'Σίγαση funchat',
	check: function() {
		return Arena.sizitisi.isFunchatIxos();
	},
	click: function(e) {
		Arena.sizitisi.funchatIxosTelos();
		Arena.sizitisi.flags.funchatIxos = false;
		Arena.sizitisi.sigasiFunchatButton.pbuttonDisplay();
		Arena.sizitisi.isagisFunchatButton.pbuttonDisplay();

		Arena.sizitisi.sigasiFunchatButtonDOM.
		removeClass('panelButtonEkremes');
	},
}));

Arena.sizitisi.funchatIxosTelos = function() {
		var ixos;

		if (!Arena.sizitisi.funchatIxosLast)
		return;

		ixos = Arena.sizitisi.funchatIxosLast.get(0);
		Arena.sizitisi.funchatIxosLast.remove();
		Arena.sizitisi.funchatIxosLast = null;

		if (!ixos) return;
		if (!ixos.pause) return;

		ixos.pause();
};

Arena.sizitisi.sigasiFunchatButtonDOM = Arena.sizitisi.sigasiFunchatButton.pbuttonGetDOM();

Arena.sizitisi.panel.bpanelButtonPush(Arena.sizitisi.isagisFunchatButton = new PButton({
	id: 'isagis',
	img: 'ikona/panel/funchat/isagis.png',
	title: 'Ήχος στο funchat',
	check: function() {
		return Arena.sizitisi.isFunchatSigasi();
	},
	click: function(e) {
		Arena.sizitisi.flags.funchatIxos = true;
		Arena.sizitisi.sigasiFunchatButton.pbuttonDisplay();
		Arena.sizitisi.isagisFunchatButton.pbuttonDisplay();
	},
}));

Arena.sizitisi.isagisFunchatButtonDOM = Arena.sizitisi.isagisFunchatButton.pbuttonGetDOM();

Arena.sizitisi.panel.bpanelButtonPush(new PButton({
	id: 'korna',
	img: 'korna.png',
	title: 'Κόρνα',
	click: function(e) {
		if (Arena.ego.isPektis())
		return Client.skiserService('korna');

		Client.fyi.ekato('Μην κορνάρετε, δεν σας ακούει κανείς!');
		Client.sound.play('korna/dout2.ogg');
	},
}));

Arena.sizitisi.panel.bpanelButtonPush(new PButton({
	id: 'pagoma',
	refresh: function() {
		var dom, img;

		dom = this.pbuttonGetDOM();
		img = this.pbuttonIconGetDOM();
		if (Arena.sizitisi.isPagomeni()) {
			Arena.sizitisi.areaDOM.addClass('sizitisiPagomeni');
			dom.attr('title', 'Ρολάρισμα κειμένου');
			img.attr('src', 'ikona/panel/xepagoma.png');
		}
		else {
			Arena.sizitisi.areaDOM.removeClass('sizitisiPagomeni');
			dom.attr('title', 'Πάγωμα κειμένου');
			img.attr('src', 'ikona/panel/pagoma.png');
		}
	},
	click: function(e) {
		Arena.sizitisi.pagomeni = !Arena.sizitisi.pagomeni;
		this.pbuttonRefresh();
		Arena.sizitisi.scrollKato();
	},
}));

Arena.sizitisi.panel.bpanelButtonPush(new PButton({
	id: 'kouskous',
	refresh: function() {
		var dom, img;

		dom = this.pbuttonGetDOM();
		img = dom.children('.panelIcon');

		if (Arena.flags.kouskous) {
			img.attr('src', 'ikona/endixi/dealer.png');
			dom.attr('title', 'Παιχνίδι');
		}
		else {
			img.attr('src', 'ikona/panel/kafedaki.png');
			dom.attr('title', 'Κουσκούς');
		}

		return this;
	},
	click: function(e) {
		Arena.flags.kouskous = !Arena.flags.kouskous;
		Arena.viewRefresh();
		this.refresh();
	},
}));

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "panelSetup" διαμορφώνει το οριζόντιο panel της συζήτησης του καφενείου.
// Εδώ παρέχεται input πεδίο στο οποίο ο χρήστης γράφει τα σχόλιά του, και εικονίδια/εργαλεία
// που αφορούν σε ενέργειες που αφορούν στη συζήτηση του καφενείου, π.χ. αποστολή σχολίου,
// διαγραφή σχολίου, πάγωμα κειμένου κλπ.

Arena.sizitisi.panelSetup = function() {
	Arena.sizitisi.panelDOM.
	on('mousedown', function(e) {
		var
		y0 = e.pageY,
		prosklisiH = Arena.prosklisi.areaDOM.height();
		anazitisiH = Arena.anazitisi.areaDOM.height();
		sizitisiH = Arena.sizitisi.areaDOM.height();

		e.preventDefault();
		e.stopPropagation();

		Arena.flags.epanadiataxiPss = true;
		Arena.prosklisi.panel.bpanelButtonGet('epanadiataxiPss').pbuttonDisplay();
		Arena.sizitisi.panelDOM.css('cursor', 'ns-resize');
		Arena.sizitisi.panel.bpanelButtonGet('metakinisi').
		pbuttonGetDOM().addClass('panelButtonCandi');
		$(document).off('mousemove mouseup').
		on('mousemove', function(e) {
			var dh, h, pH, aH, sH;

			e.stopPropagation();
			pH = prosklisiH;

			dh = e.pageY - y0;
			if (dh >= 0) {
				h = sizitisiH - dh;
				if (h < 0) h = 0;
				dh = sizitisiH - h;

				aH = anazitisiH + dh;
				sH = sizitisiH - dh;
			}
			else {
				h = anazitisiH + dh;
				if (h < 0) {
					aH = 0;
					sH = sizitisiH + anazitisiH;
					dh += anazitisiH;

					h = prosklisiH + dh;
					if (h < 0) {
						pH = 0;
						sH += prosklisiH;
						dh = prosklisiH;
					}
					else {
						sH -= dh;
						pH += dh;
					}
				}
				else {
					sH = sizitisiH - dh;
					aH = anazitisiH + dh;
				}
			}

			Arena.prosklisi.areaDOM.css('height', pH + 'px');
			Arena.anazitisi.areaDOM.css('height', aH + 'px');
			Arena.sizitisi.areaDOM.css({
				display: sH > 1 ? 'block' : 'none',
				height: sH + 'px',
			});
		}).
		on('mouseup', function(e) {
			e.stopPropagation();
			Arena.sizitisi.panelDOM.css('cursor', '');
			Arena.sizitisi.panel.bpanelButtonGet('metakinisi').
			pbuttonGetDOM().removeClass('panelButtonCandi');
			$(document).off('mousemove mouseoff');
		});
	});

	Arena.sizitisi.panelDOM.find('.panelButton').slice(1).
	add(Arena.sizitisi.panelDOM.find('.panelInput')).
	on('mousedown', function(e) {
		Arena.inputRefocus(e);
	});

	return Arena;
};

Arena.sizitisi.keyup = function(e) {
	var sxolio;

	if (e) {
		switch (e.which) {
		case 13:
			Arena.sizitisi.apostoli();
			return Arena;
		case 27:
			if (!Arena.sintomefsiCheck(e))
			Arena.sizitisi.katharismos();

			return Arena;
		}
	}

	sxolio = Arena.sizitisi.inputDOM.val().trim();
	if (sxolio === '') {
		Arena.sizitisi.katharismos();
		return Arena;
	}

	new Sizitisi({
		pektis: Client.session.pektis,
		sxolio: sxolio,
		pote: Globals.toraServer(),
	}).sizitisiCreateDOM({
		proepiskopisi: true,
	});

	Arena.sizitisi.moliviEkinisi();

	return Arena;
};

Arena.sizitisi.apostoli = function() {
	var sxolio;

	sxolio = Arena.sizitisi.inputDOM.val().trim();
	if (sxolio === '') {
		Arena.sizitisi.katharismos();
		return Arena;
	}

	// Κατά την αποστολή δεν κάνουμε καθαρισμό μολυβιού με την
	// κλασική διαδικασία, καθώς το μολύβι θα «καθαρίσει» στους
	// διάφορους clients όταν θα παραλάβουν το σχόλιο συζήτησης
	// που αποστέλλεται τώρα. Απλώς ακυρώνουμε το μολύβι τοπικά,
	// ώστε να μπορεί να επανεκκινήσει όταν ο χρήστης ξεκινήσει
	// νέο σχόλιο. Έτσι γλιτώνουμε κλήσεις στον skiser και ίσως
	// να έχουμε και ορθότερη ακύρωση του μολυβιού στους clients.

	Arena.sizitisi.flags.molivi = false;

	Arena.sizitisi.panel.apostoliButton.pbuttonLock();
	Client.skiserService((Arena.partidaMode() && Arena.ego.isTrapezi()) ?
		'sizitisiPartida' : 'sizitisiKafenio', 'sxolio=' + sxolio.uri()).
	done(function(rsp) {
		Arena.sizitisi.inputDOM.val('');
		Arena.sizitisi.panel.apostoliButton.pbuttonRelease();
	}).
	fail(function(err) {
		Client.skiserFail(err);
		Arena.sizitisi.panel.apostoliButton.pbuttonRelease();
	});

	return Arena;
};

Arena.sizitisi.katharismos = function() {
	Arena.sizitisi.inputDOM.val('');
	Arena.sizitisi.proepiskopisiClearDOM();
	Arena.sizitisi.moliviAkirosi();

	return Arena;
};

Arena.sizitisi.proepiskopisiClearDOM = function() {
	Arena.sizitisi.proepiskopisiDOM.empty();

	return Arena;
};

// Η function "apoklismosRefreshDOM" δέχεται ως παράμετρο jQuery DOM element
// list και εφαρμόζει στα στοιχεία της λίστας απόκρυψη ή εμφάνιση των στοιχείων
// αυτών ανάλογα με τη flag απόκρυψης/εμφάνισης σχολίων αποκλεισμένων παικτών.

Arena.sizitisi.apoklismosRefreshDOM = function(dom) {
	var pektis, xroma;

	if (dom === undefined) {
		Arena.sizitisi.trapeziDOM.children().each(function() {
			Arena.sizitisi.apoklismosRefreshDOM($(this));
		});

		Arena.sizitisi.kafenioDOM.children().each(function() {
			Arena.sizitisi.apoklismosRefreshDOM($(this));
		});

		return Arena;
	}

	dom.removeClass('sizitisiApoklismos').css('background-color', '');
	pektis = dom.data('pektis');

	if (!pektis)
	return Arena;

	if (!Arena.flags.sizitisiApoklismos)
	return Arena;

	if (pektis.isEgo())
	return Arena;

	if (Arena.ego.oxiApoklismenos(pektis))
	return Arena;

	dom.addClass('sizitisiApoklismos');

	xroma = dom.children('.sizitisiPektis').css('color');
	if (xroma)
	dom.css('background-color', xroma);

	return Arena;
};

// Η function "moliviEkinisi" κοινοποιεί το μολύβι του χρήστη στους
// εμπλεκόμενους clients.

Arena.sizitisi.moliviEkinisi = function() {
	var mode = null;

	// Αν έχουμε ήδη κοινοποιήσει μολύβι του χρήστη δεν
	// προχωρούμε σε περαιτέρω ενέργειες.

	if (Arena.sizitisi.isMolivi())
	return Arena;

	service = 'moliviEkinisi';

	// Αν ο χρήστης εκκινεί τη γραφή σχολίου καθώς βρίσκεται
	// σε mode καφενείου, το μολύβι θα πρέπει να είναι μολύβι
	// καφενείου και θα πρέπει να κοινοποιηθεί σε όλους.

	if (Arena.kafenioMode())
	mode = 'kafenio';

	// Αλλιώς ο χρήστης βρίσκεται σε mode παρτίδας, επομένως
	// θα πρέπει να γίνει κοινοποίηση μολυβιού στους παίκτες
	// και στους θεατές του τραπεζιού του χρήστη.

	// Αν ο χρήστης δεν έχει καθορισμένο τραπέζι, παρ' όλο
	// που βρίσκεται σε mode παρτίδας, τότε δεν χρειάζεται
	// να γίνει καμια κοινοποίηση μολυβιού.

	else if (Arena.ego.oxiTrapezi())
	return;

	Arena.sizitisi.flags.molivi = true;
	Client.skiserService('moliviEkinisi', mode);

	return Arena;
};

Arena.sizitisi.moliviAkirosi = function() {
	if (Arena.sizitisi.oxiMolivi())
	return Arena;

	Arena.sizitisi.flags.molivi = false;
	Client.skiserService('moliviAkirosi');
};

// Στη λίστα "moliviPektis" κρατάμε τα dom elements των σχολίων μολυβιού
// δεικτοδοτημένα με το login name του αντίστοιχου παίκτη.

Arena.sizitisi.moliviPektis = {};

// Η function "moliviEnarxi" δέχεται ένα record συζήτησης μολυβιού και
// το αντίστοιχο DOM element και σχηματίζει το μολύβι ανάλογα με το αν
// πρόκειται για μολύβι καφενείου ή τραπεζιού.

Arena.sizitisi.moliviEnarxi = function(sizitisi, dom) {
	var pektis, molivi, klasi;

	pektis = sizitisi.sizitisiPektisGet();
	switch (sizitisi.sizitisiSxolioGet()) {
	case 'MVT':
		molivi = 'grafi';
		klasi = 'sizitisiMoliviTrapezi';
		break;
	default:
		molivi = 'pliktrologisi';
		klasi = 'sizitisiMoliviKafenio';
		break;
	}

	// Αρχικά διαγράφουμε τυχόν υπάρχον μολύβι για τον συγκεκριμένο
	// παίκτη.

	if (Arena.sizitisi.moliviPektis[pektis])
	Arena.sizitisi.moliviPektis[pektis].remove();

	// Κρατάμε το φρέσκο dom element μολυβιού που μόλις παραλάβαμε
	// και σχηματίζουμε το μολύβι.

	Arena.sizitisi.moliviPektis[pektis] = dom.parents('.sizitisi');
	dom.append($('<div>').addClass('sizitisiMoliviContainer').
	append($('<img>').addClass(klasi).
	attr('src', 'ikona/endixi/' + molivi + '.gif')));
};

// Η function "moliviTelos" διαγράφει τυχόν μολύβι για τον παίκτη του οποίου
// το login δίνουμε ως παράμετρο. Αν δεν περάσουμε παίκτη, τότε διαγράφονται
// όλα τα μολύβια.

Arena.sizitisi.moliviTelos = function(pektis) {
	if (pektis === undefined) {
		for (pektis in Arena.sizitisi.moliviPektis) {
			Arena.sizitisi.moliviTelos(pektis);
		}
		return;
	}

	if (Arena.sizitisi.moliviPektis[pektis])
	Arena.sizitisi.moliviPektis[pektis].remove();
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Sizitisi.zebraPaleta = [
	'#B45F04',
	'#9E3F70',
	'#006600',
	'#8A0808',
	'#084B8A',
	'#CD5C5C',
	'#663300',
	'#D52A00',
	'#666699',
	'#FF8400',
	'#669199',
	'#7AB404',
	'#7A04B4',
	'#777EFD',
	'#B29B00',
	'#387965',
	'#2B4100',
	'#A5B236',
];

Sizitisi.zebraIndex = Sizitisi.zebraPaleta.length;

Sizitisi.zebraXroma = {};

Sizitisi.prototype.sizitisiGetDOM = function() {
	return this.DOM;
};

Sizitisi.prototype.sizitisiCreateDOM = function(opts) {
	var pektis, klasi, xroma, dom, sxolioDOM, trakaDOM, mikos;

	pektis = this.sizitisiPektisGet();
	klasi = 'sizitisiPektis';

	if (pektis.isEgo()) {
		klasi += ' sizitisiPektisEgo';
		xroma = '#144C88';
	}
	else {
		xroma = Sizitisi.zebraXroma[pektis];
		if (!xroma) {
			xroma = Sizitisi.zebraPaleta[Sizitisi.zebraIndex++ % Sizitisi.zebraPaleta.length];
			Sizitisi.zebraXroma[pektis] = xroma;
		}
	}

	if (opts === undefined)
	opts = {};

	dom = opts.proepiskopisi ? Arena.sizitisi.proepiskopisiDOM.empty() : this.DOM = $('<div>');

	dom.data('pektis', pektis);

	dom.addClass('sizitisi').
	append($('<div>').addClass(klasi).css('color', xroma).text(pektis)).
	append(sxolioDOM = $('<div>').addClass('sizitisiSxolio'));
	Arena.sizitisi.apoklismosRefreshDOM(dom);

	this.sizitisiSxolioCreateDOM(sxolioDOM, opts.online);

	if (opts.proepiskopisi) {
		Arena.sizitisi.scrollKato();
		return this;
	}

	dom.
	data('pote', this.sizitisiPoteGet());

	trakaDOM = this.sizitisiTrapeziGet() ? Arena.sizitisi.trapeziDOM : Arena.sizitisi.kafenioDOM;
	this.DOM.appendTo(trakaDOM);

	// Φροντίζουμε το μήκος της συζήτησης να διατηρείται σε λογικά
	// πλαίσια ώστε να μην παραφορτώνεται το DOM.

	mikos = trakaDOM.children().length;

	if (mikos < Arena.sizitisi.mikosMax)
	return this;

	trakaDOM.children().
	slice(0, Arena.sizitisi.mikosCut).remove();
	return this;
};

Sizitisi.prototype.sizitisiSxolioCreateDOM = function(dom, online) {
	var sxolio, tmima, i, lexi, j;

	sxolio = this.sizitisiSxolioGet();
	tmima = sxolio.split('^');

	dom.empty();

	switch (tmima[0]) {

	// Αν το πρώτο πεδίο του σχολίου είναι "FP" τότε πρόκειται για τα φύλλα της
	// προηγούμενης διανομής του παίκτη.

	case 'FP':
		sxolio = tmima[1].string2xartosia().xartosiaTaxinomisi().xartosiaDOM();
		dom.append(sxolio);
		return this;

	// Αν το πρώτο πεδίο του σχολίου είναι "MV[KT]" τότε πρόκειται για έναρξη
	// μολυβιού.

	case 'MVT':
	case 'MVK':
		Arena.sizitisi.moliviEnarxi(this, dom);
		return this;

	// Αν το πρώτο πεδίο του σχολίου είναι "FC" τότε πρόκειται για funchat
	// σχόλιο και σ' αυτή την περίπτωση το δεύτερο πεδίο πρέπει να είναι
	// το id του funchat item.

	case 'FC':
		Sizitisi.funchatAppend(dom, tmima[1], tmima[2], online);
		return this;

	// Αν το πρώτο πεδίο του σχολίου είναι "KN" τότε πρόκειται για κόρνα από
	// κάποιον παίκτη του τραπεζιού.

	case 'KN':
		Sizitisi.kornaAppend(dom);
		return this;
	}

	for (i = 0; i < tmima.length; i++) {
		if (tmima[i].match(/^E[0-9]+:[0-9]+$/)) {
			Sizitisi.emoticonAppend(dom, tmima[i]);
			continue;
		}

		if (tmima[i].match(/^https?:\/\/youtu\.be\//)) {
			Sizitisi.youtubeAppend(dom, tmima[i]);
			continue;
		}

		if (tmima[i].match(/^https?:\/\/.*\.(png|jpg|gif|jpeg)[-+]*$/i)) {
			Sizitisi.ikonaAppend(dom, tmima[i]);
			continue;
		}

		if (tmima[i].match(/^https?:\/\/.*/i)) {
			Sizitisi.sindesmosAppend(dom, tmima[i]);
			continue;
		}

		if (tmima[i] === '~') {
			dom.append($('<br />'));
			continue;
		}

		sxolio = tmima[i].replace(/</g, '&lt;');
		lexi = sxolio.split(/[ ]/);
		Arena.sizitisi.lexiMax = 40;
		sxolio = null;
		for (j = 0; j < lexi.length; j++) {
			if (lexi[j].length > Arena.sizitisi.lexiMax)
			lexi[j] = lexi[j].substr(0, Arena.sizitisi.lexiMax);

			if (sxolio === null) sxolio = lexi[j];
			else sxolio += ' ' + lexi[j];
		}
		dom.append(sxolio);
	}

	return this;
};

Sizitisi.funchatAppend = function(dom, id, sxolio, online) {
	var item, ikona, ikona2, img, platos, platos2, kimeno;

	item = Funchat.listaGet(id);
	if (!item)
	return;

	ikona = item.funchatIkonaGet();
	if (ikona) {
		ikona2 = item.funchatIkona2Get();
		if (ikona2 && (!online)) {
			ikona = ikona2;
			ikona2 = null;
		}

		img = $('<img>').addClass('sizitisiFunchatIkona').attr('src', Funchat.server + ikona);

		platos2 = item.funchatPlatos2Get();
		if (platos2 && (!online))
		platos = platos2;

		else
		platos = item.funchatPlatosGet();

		if (platos) img.css('width', platos + 'px');
		dom.append(img);

		if (ikona2)
		setTimeout(function() {
			img.attr('src', Funchat.server + item.funchatIkona2Get());
			if (platos2) img.css('width', platos2 + 'px');
		}, item.funchatDurationGet());
	}

	kimeno = sxolio ? Sizitisi.funchatSxolio(sxolio) : item.funchatKimenoGet();

	if (kimeno)
	dom.append(kimeno);

	if (!online)
	return;

	// Αν υπάρχει συσχετισμένος ήχος, τελειώνουμε τυχόν προηγούμενο ήχο
	// και εκκινούμε τον ήχο από το νέο funchat item.

	if (item.funchatIxosGet())
	setTimeout(function() {
		if (Arena.sizitisi.isFunchatIxos()) {
			Arena.sizitisi.funchatIxosTelos();
			Arena.sizitisi.sigasiFunchatButton.pbuttonIconGetDOM().
			attr('src', 'ikona/panel/funchat/sigasi.png');
			Arena.sizitisi.sigasiFunchatButtonDOM.addClass('panelButtonEkremes');
			Arena.sizitisi.funchatIxosLast = item.funchatIxosPlay({
				callback: function() {
					Arena.sizitisi.sigasiFunchatButton.pbuttonIconGetDOM().
					attr('src', 'ikona/panel/funchat/ixos.png');
					Arena.sizitisi.sigasiFunchatButtonDOM.
					removeClass('panelButtonEkremes');
				},
			});
		}
		else {
			Arena.sizitisi.isagisFunchatButton.pbuttonIconGetDOM().
			attr('src', 'ikona/panel/funchat/ixos.png');
			Arena.sizitisi.isagisFunchatButtonDOM.css('borderColor', 'crimson').
			delay(300).finish().animate({
				borderColor: 'orange',
			}, 1000, 'easeOutBounce', function() {
				$(this).css('borderColor', '');
				Arena.sizitisi.isagisFunchatButton.pbuttonIconGetDOM().
				attr('src', 'ikona/panel/funchat/isagis.png');
			});
		}
	}, item.funchatIxosDelayGet());
};

Sizitisi.funchatSxolio = function(sxolio) {
	if (sxolio === '-')
	return '';

	return sxolio;
};

Sizitisi.kornaAppend = function(dom) {
	var img;

	Arena.kornaPlay();
	img = $('<img>').attr('src', 'ikona/panel/korna.png').css('width', '60px');
	dom.append(img);
	img.animate({
		width: '40px',
	}, 1000, 'easeInOutBounce');
};

Sizitisi.emoticonAppend = function(dom, s) {
	var tmima, omada, ikona, lefkoma, emoticon;

	tmima = s.split(':');
	if (tmima.length != 2)
	return;

	omada = parseInt(tmima[0].replace(/^E/, ''));
	lefkoma = Arena.epanel.lefkoma[omada - 1];
	if (!lefkoma)
	return;

	ikona = parseInt(tmima[1]);
	emoticon = lefkoma[ikona - 1];
	if (!emoticon)
	return;

	dom.append($('<img>').addClass('sizitisiEmoticon').
	attr('src', 'ikona/emoticon/set' + omada + '/' + emoticon));
};

Sizitisi.youtubeAppend = function(dom, s) {
	var iframe;

	dom.
	append($('<img>').addClass('sizitisiYoutube').attr({
		src: 'ikona/external/youtube.jpg',
		title: 'Κλικ για βίντεο',
	}).
	data('video', s.replace(/^https?:\/\/youtu\.be/, '')).
	on('click', function(e) {
		Arena.inputRefocus(e);
		$('.sizitisiIframe').empty();
		if ($(this).data('klikarismeno'))
		return $(this).removeData('klikarismeno').attr('title', 'Κλικ για επανεμφάνιση του βίντεο');

		$('.sizitisiYoutube').removeData('klikarismeno');
		$(this).data('klikarismeno', true).attr('title', 'Κλικ για απόκρυψη του βίντεο');
		iframe.html($('<iframe>').attr({
			width: 420,
			height: 315,
			frameborder: 0,
			src: '//www.youtube.com/embed' + $(this).data('video') + '?rel=0',
		}));
	})).
	append(iframe = $('<div>').addClass('sizitisiIframe'));
};

Sizitisi.sindesmosAppend = function(dom, s) {
	dom.
	append($('<a>').attr({
		target: '_blank',
		href: s,
		title: 'Μετάβαση στο σύνδεσμο με δική σας ευθύνη',
	}).
	append($('<img>').addClass('sizitisiSindesmos').attr('src', 'ikona/misc/link.png')));
};

Sizitisi.ikonaAppend = function(dom, s) {
	var wmax, img, sinPlin, i;

	wmax = Arena.sizitisi.areaDOM.innerWidth();
	wmax = parseInt(wmax * 0.8);

	dom.
	append(img = $('<img>').addClass('sizitisiIkona').attr({
		src: s.replace(/[-+]*$/, ''),
	}).
	css({
		maxWidth: wmax + 'px',
	}));

	sinPlin = [];
	for (i = 0; i < s.length; i++) {
		switch (s.substr(i, 1)) {
		case '+':
			sinPlin.push(1.5);
			break;
		case '-':
			sinPlin.push(0.75);
			break;
		default:
			sinPlin = [];
			break;
		}
	}

	if (!sinPlin.length)
	return;

	img.on('load', function() {
		var width, i;

		width = $(this).outerWidth();
		for (i = 0; i < sinPlin.length; i++) {
			width *= sinPlin[i];
		}
		$(this).css('width', width + 'px');
	});
};
