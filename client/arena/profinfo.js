// Στο παρόν module ορίζονται μέθοδοι, functions και δομές που σχετίζονται με την
// προφίλ popup φόρμα του παίκτη. Πράγματι, με κλικ επάνω σε οποιοδήποτε κουτάκι
// παίκτη, ή με κλικ στο σχετικό εικονίδιο παίκτη της τσόχας, εμφανίζεται popup
// φόρμα που αφορά στον συγκεκριμένο παίκτη και στην οποία μπορούμε να επιτελέσουμε
// τις παρακάτω λειτουργίες:
//
//	Προβολή και επεξεργασία πληροφοριών προφίλ παίκτη. Προβάλλονται οι πληροφορίες
//	προφίλ που έχει συμπληρώσει ο παίκτης για τον εαυτό του και οι πληροφορίες που
//	έχει συμπληρώσει ο χρήστης για τον εν λόγω παίκτη. Ο παίκτης μπορεί να διορθώσει
//	τις πληροφορίες προφίλ που συντάσσει ο ίδιος.
//
//	Προβολή φωτογραφίας προφίλ παίκτη. Ο χρήστης μπορεί να δει τυχόν φωτογραφία
//	προφίλ του εν λόγω παίκτη τοποθετώντας τον δείκτη του ποντικιού στο σχετικό
//	εικονίδιο. Μπορεί να σταθεροποιήσει τη φωτογραφία κάνντας κλικ στο σχετικό
//	εικονίδιο, καθώς επίσης μπορεί και να μετακινήσει τη φωτογραφία με χειρισμό
//	drag/drop.
//
//	Καθορισμός σχέσης του χρήστη με τον εν λόγω παίκτη. Εδώ ο χρήστης μπορεί να
//	καθορίσει τη σχέση του με τον παίκτη κάνοντάς τον φίλο, αποκλείοντάς τον από
//	τυχόν προσκλήσεις σε παιχνίδι, ή αποσυσχετίζοντάς τον.
//
//	Αποστολή πρόσκλησης με το πάτημα σχετικού πλήκτρου. Κάνοντας κλικ στο πλήκτρο
//	αποστολής πρόσκλησης, αποστέλλεται πρόσκληση προς τον παίκτη για το τραπέζι
//	στο οποίο ο χρήστης μετέχει ως παίκτης. Αν ο χρήστης δεν μετέχει ως παίκτης
//	σε κάποιο τραπέζι, δεν εμφανίζεται το πληκτρο προσκλήσεων.
//
//	Αποστολή προσωπικού μηνύματος προς τον εν λόγω παίκτη. Κάνοντας κλικ στο πλήκτρο
// 	μηνυμάτων, ο χρήστης μπορεί να συντάξει και να αποστείλει προσωπικό μήνυμα προς
//	τον παίκτη.
//
// Η φόρμα προφίλ μπορεί να μετακινηθεί με χειρισμό drag/drop σε βολικότερη θέση, ενώ
// ο χρήστης μπορεί να αλλάζει παίκτη χωρίς προηγουμένως να κλείσει τη φόρμα, πράγμα
// που σημαίνει ότι δεν μπορούμε να έχουμε ταυτόχρονα ανοικτές popup φόρμες προφίλ
// για περισσότερους από έναν παίκτη.

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η μέθοδος "pektisFormaPopupDOM" καλείται όταν κάνουμε κλικ στο κουτάκι οποιουδήποτε
// παίκτη, η στο σχετικό εικονίδιο την περιοχή παίκτη της τσόχας. Η μέθοδος ζητά τις
// πληροφορίες προφίλ του παίκτη, εφόσον αυτές δεν εχουν ήδη ζητηθεί, και προβαίνει
// στο «γέμισμα» της popup φόρμας με τα στοιχεία του εν λόγω παίκτη παίκτη. Αν επαναλάβουμε
// την ενέργεια για τον ίδιο παίκτη, τότε κλείνει η popup φόρμα προφίλ, οπότε μπορούμε
// να κάνουμε κλικ στον παίκτη, να δούμε τις πληροφορίες που θέλουμε και να ξανακάνουμε
// κλικ κλείνοντας τη φόρμα.

Pektis.prototype.pektisFormaPopupDOM = function(e) {
	var pektis = this, login;

	Arena.inputRefocus(e);

	login = this.pektisLoginGet();
	if (!login) return this;

	// Αν κάνουμε απόπειρα να ξανανοίξουμε το προφίλ του παίκτη του
	// οποίου ήδη έχουμε ανοικτό το προφίλ, τότε κλείνει το ανοικτό
	// προφίλ. Αυτό βοηθά στο να κάνουμε κλικ στο προφίλ του παίκτη,
	// να δούμε ό,τι θέλουμε να δούμε εκεί και να ξανακάνουμε κλικ
	// για να το κλείσουμε.

	if (Arena.pektisFormaDOM.data('pektis') === login) {
		Arena.pektisFormaKlisimo(200);
		return this;
	}

	// Οι πληροφορίες προφίλ των παικτών δεν έρχονται με το αρχικό πακέτο
	// σκηνικών δεδομένων, ούτε υπάρχει αρχικά property "profinfo" στους
	// παίκτες, παρά αυτό το συγκεκριμένο property συμπληρώνεται την πρώτη
	// φορά που θα παραλάβουμε πληροφορίες προφίλ για τον παίκτη. Αν, λοιπόν,
	// δεν βρεθεί property "profinfo" για τον παίκτη, τότε είναι η ώρα να
	// ζητηθούν οι πληροφορίες προφίλ από τον skiser, αλλιώς οι πληροφορίες
	// προφίλ έχουν ήδη παραληφθεί και προχωρούμε άμεσα στο άνοιγμα της φόρμας
	// προφίλ του παίκτη.

	if (this.hasOwnProperty('profinfo')) {
		pektis.pektisFormaPopupFillDOM(login);
		return this;
	}

	Client.fyi.pano('Ζητήθηκαν πληροφορίες προφίλ για τον παίκτη <span class="entona ble">' +
		login + '</span>. Παρακαλώ περιμένετε…');
	Client.skiserService('profinfoGet', 'pektis=' + login).
	done(function(rsp) {
		var i;

		if (!rsp.hasOwnProperty('peparam'))
		rsp.peparam = {};

		try {
			rsp = ('{' + rsp + '}').evalAsfales();
			pektis.profinfo = rsp.profinfo;

			for (i in rsp.peparam)
			pektis.pektisPeparamSet(new Peparam({
				param: i,
				timi: rsp.peparam[i],
			}));
		} catch (e) {
			Client.fyi.epano('Παρελήφθησαν ακαθόριστες πληροφορίες προφίλ για τον παίκτη ' +
				'<span class="entona ble">' + login + '</span>');
			Client.sound.beep();
			Arena.pektisFormaKlisimo(10);
			return;
		}

		Client.fyi.pano();
		pektis.pektisFormaPopupFillDOM(login);
	}).
	fail(function(err) {
		Client.skiserFail(err);
		Client.sound.beep();
		Arena.pektisFormaKlisimo(10);
	});

	return this;
};

Pektis.prototype.pektisFormaPopupFillDOM = function(login) {
	delete Arena.pektisFormaEditing;
	Arena.pektisFormaDOM.empty().
	data('pektis', login).
	append(Client.klisimo(function() {
		Arena.pektisFormaKlisimo();
	})).
	append(Arena.pektisFormaLoginDOM = $('<div>').attr('id', 'pektisFormaLogin').addClass('pektisFormaOnoma')).
	append(Arena.pektisPanelDOM = $('<div>').attr('id', 'pektisPanel').
	on('mousedown', function(e) {
		Arena.inputRefocus(e);
	})).
	append(Arena.pektisFormaIdiosDOM = $('<div>').attr('id', 'profinfoIdios').addClass('profinfoArea')).
	append(Arena.pektisFormaEgoDOM = $('<div>').attr('id', 'profinfoEgo').addClass('profinfoArea')).
	append(Arena.pektisFormaBaraDOM = $('<div>').attr('id', 'profinfoIsozigio')).
	append(Arena.pektisFormaEditDOM = $('<textarea>').attr('id', 'pektisFormaEdit').
	on('mouseup', function(e) {
		e.stopPropagation();
	}).
	on('mousedown', function(e) {
		e.stopPropagation();
		Arena.pektisFormaEditDOM.focus();
	}));

	Arena.pektisPanelRefreshDOM();
	this.pektisProfinfoRefreshDOM(login);

	Arena.pektisFormaDOM.anadisi().finish().fadeIn('fast').
	find('.klisimoIcon').on('mousedown', function(e) {
		Arena.inputRefocus(e);
	});

	// Υπάρχει οριζόντια μπάρα που χωρίζει τη φόρμα προφίλ σε δύο μέρη. Στο επάνω
	// μέρος εμφανίζονται οι πληροφορίες προφίλ που έχει συντάξει ο ίδιος ο παίκτης
	// για τον εαυτό του, ενώ στο κάτω μέρος εμφανίζονται οι πληροφορίες προφίλ που
	// έχει συντάξει ο χρήστης για τον παίκτη. Η μπάρα μπορεί να μετακινηθεί πάνω/κάτω
	// με χειρισμό drag/drop, επιτρέποντας με τον τρόπο αυτό τον χρήστη να αλλάξει το
	// ισοζύγιο.

	Arena.pektisFormaBaraDOM.
	append($('<div>').addClass('pektisFormaOnoma').text(this.pektisOnomaGet())).
	append($('<img>').attr('id', 'profinfoIsozigioIcon').attr('src', 'ikona/misc/bara.png')).
	on('mousedown', function(e) {
		var y0;

		y0 = e.pageY;
		Arena.inputRefocus(e);
		$(document).
		off('mousemove').
		on('mousemove', function(e) {
			var y, dy, egoH, egoY, idiosH, baraY;

			y = e.pageY;
			dy = y - y0;
			if (dy === 0) return;
			y0 = y;

			egoH = parseInt(Arena.pektisFormaEgoDOM.css('height'));
			if (egoH - dy < 0) dy = egoH;

			idiosH = parseInt(Arena.pektisFormaIdiosDOM.css('height'));
			if (idiosH + dy < 0) dy = -idiosH;

			egoY = parseInt(Arena.pektisFormaEgoDOM.css('top'));
			egoY += dy;

			baraY = parseInt(Arena.pektisFormaBaraDOM.css('top'));
			baraY += dy;

			Arena.pektisFormaBaraDOM.css('top', baraY + 'px');
			Arena.pektisFormaIdiosDOM.css('height', (idiosH + dy) + 'px');
			Arena.pektisFormaEgoDOM.css({
				height: (egoH - dy) + 'px',
				top: egoY + 'px',
			});
		}).
		off('mouseup').
		on('mouseup', function(e) {
			$(document).
			off('mousemove').
			off('mouseup');
		});
	});

	return this;
};

Pektis.prototype.pektisProfinfoRefreshDOM = function(login) {
	var kimeno;

	if (Arena.pektisFormaZigismaTimer) {
		clearTimeout(Arena.pektisFormaZigismaTimer);
		delete Arena.pektisFormaZigismaTimer;
	}

	Arena.pektisFormaIdiosDOM.empty();
	kimeno = this.profinfo[login];
	if (kimeno) {
		kimeno = kimeno.replace(/\r?\n/g, '<br />');
		Arena.pektisFormaIdiosDOM.
		append($('<div>').addClass('profinfoKimeno').html(kimeno));
	}

	Arena.pektisFormaEgoDOM.empty();
	if (login.oxiEgo()) {
		kimeno = this.profinfo[Client.session.pektis];
		if (kimeno) kimeno = kimeno.replace(/\r?\n/g, '<br />');
		Arena.pektisFormaEgoDOM.append($('<div>').addClass('profinfoKimeno').html(kimeno));
	}

	Arena.pektisFormaZigismaTimer = setTimeout(function() {
		Arena.pektisFormaZigisma(),
		delete Arena.pektisFormaZigismaTimer;
	}, 0);
	return this;
};

Arena.pektisFormaZigisma = function() {
	var idiosDOM, idiosH, idiosK, idiosM, egoDOM, egoH, egoK, egoM;

	idiosDOM = Arena.pektisFormaIdiosDOM;
	idiosH = idiosDOM.height();
	idiosK = idiosDOM.text() ? idiosDOM.find('.profinfoKimeno').outerHeight() : 0;
	idiosM = idiosH - idiosK;

	egoDOM = Arena.pektisFormaEgoDOM;
	egoH = egoDOM.height();
	egoK = egoDOM.text() ? egoDOM.find('.profinfoKimeno').outerHeight() : 0;
	egoM = egoH - egoK;

	if ((idiosM <= 0) && (egoM <= 0))
	return this;

	if (egoM > 0) {
		egoDOM.css({
			height: '-=' + egoM + 'px',
			top: '+=' + egoM + 'px',
		});
		Arena.pektisFormaBaraDOM.css({
			top: '+=' + egoM + 'px',
		});
		idiosDOM.css({
			height: '+=' + egoM + 'px',
		});
	}
	else  {
		idiosDOM.css({
			height: '-=' + idiosM + 'px',
		});
		Arena.pektisFormaBaraDOM.css({
			top: '-=' + idiosM + 'px',
		});
		egoDOM.css({
			top: '-=' + idiosM + 'px',
			height: '+=' + idiosM + 'px',
		});
	}

	return this;
};

Arena.pektisFormaEditOn = function(edit) {
	Arena.pektisFormaIdiosDOM.css('display', 'none');
	Arena.pektisFormaBaraDOM.css('display', 'none');
	Arena.pektisFormaEgoDOM.css('display', 'none');
	Arena.pektisFormaEditDOM.css('display', 'block');

	Arena.pektisFormaIplocatorDOM.css('display', 'none');
	Arena.pektisFormaProsklisiDOM.css('display', 'none');
	Arena.pektisFormaArvilaDOM.css('display', 'none');
	Arena.pektisFormaAlivraDOM.css('display', 'none');
	Arena.pektisFormaMinimaDOM.css('display', 'none');
	Arena.pektisFormaSxolioDOM.css('display', 'none');
	Arena.pektisFormaApostoliDOM.css('display', edit === 'minima' ? 'inline-block' : 'none');
	Arena.pektisFormaKataxorisiDOM.css('display', edit === 'sxolio' ? 'inline-block' : 'none');
	Arena.pektisFormaAkiroDOM.css('display', 'inline-block');

	Arena.pektisFormaEditing = edit;
	return Arena;
};

Arena.pektisFormaEditOff = function() {
	Arena.pektisFormaIdiosDOM.css('display', 'block');
	Arena.pektisFormaBaraDOM.css('display', 'block');
	Arena.pektisFormaEgoDOM.css('display', 'block');
	Arena.pektisFormaEditDOM.css('display', 'none');

	Arena.pektisFormaIplocatorDOM.css('display', 'inline-block');
	Arena.pektisFormaProsklisiDOM.css('display', 'inline-block');
	Arena.pektisFormaArvilaDOM.css('display', 'inline-block');
	Arena.pektisFormaAlivraDOM.css('display', 'inline-block');
	Arena.pektisFormaMinimaDOM.css('display', 'inline-block');
	Arena.pektisFormaSxolioDOM.css('display', 'inline-block');
	Arena.pektisFormaApostoliDOM.css('display', 'none');
	Arena.pektisFormaKataxorisiDOM.css('display', 'none');
	Arena.pektisFormaAkiroDOM.css('display', 'none');

	delete Arena.pektisFormaEditing;
	return Arena;
};

Arena.pektisFormaKlisimo = function(delay) {
	if (delay === undefined)
	delay = 200;

	Arena.pektisFormaDOM.finish().fadeOut(delay, function() {
		Arena.pektisFormaDOM.empty().
		removeData('pektis');
		delete Arena.pektisPanelDOM;
	});

	return Arena;
};

Arena.pektisPanelRefreshDOM = function() {
	var login, pektis, photoSrc, photoDOM;

	if (!Arena.pektisPanelDOM) return Arena;
	Arena.pektisPanelDOM.empty();

	if (!Arena.pektisFormaLoginDOM) return Arena;
	Arena.pektisFormaLoginDOM.removeClass('sxesiFilos sxesiApoklismenos').empty();

	if (!Arena.pektisFormaDOM) return Arena;
	login = Arena.pektisFormaDOM.data('pektis');
	if (!login) return Arena;

	pektis = Arena.skiniko.skinikoPektisGet(login);
	if (!pektis) return Arena;

	Arena.pektisPanelDOM.
	on('mousedown', function(e) {
		Arena.inputRefocus(e);
	});

	photoSrc = pektis.pektisPhotoSrcGet();
	if (photoSrc) Arena.pektisPanelDOM.
	append($('<img>').addClass('pektisPanelIcon').
	attr({
		src: Client.server + 'ikona/pektis/photo.png',
		title: 'Φωτογραφία προφίλ',
	}).on('mouseenter', function(e) {
		if (photoDOM.data('emfanis')) return;
		photoDOM.finish().fadeIn(100);
	}).on('mouseleave', function(e) {
		if (photoDOM.data('emfanis')) return;
		photoDOM.finish().fadeOut(100);
	}).on('click', function(e) {
		Arena.inputRefocus(e);
		if (photoDOM.data('emfanis')) photoDOM.finish().fadeOut(100).removeData('emfanis');
		else photoDOM.finish().fadeIn(100).data('emfanis', true);
	}));

	// Οι βαθμοφόροι από επόπτες και άνω έχουν δικαίωμα να δουν το IP οποιουδήποτε
	// online παίκτη κάνοντας κλικ στο σχετικό εικονίδιο (σταυρόνημα).

	if (Arena.ego.isEpoptis())
	Arena.pektisPanelDOM.
	append(Arena.pektisFormaIplocatorDOM = $('<img>').addClass('pektisPanelIcon').
	css('display', Arena.pektisFormaEditing ? 'none' : 'inline-block').
	attr({
		src: 'ikona/external/iplocator.png',
		title: 'Εντοπισμός συνεδρίας παίκτη',
	}).on('click', function(e) {
		Arena.inputRefocus(e);
		Client.skiserService('ipGet', 'login=' + login).
		done(function(rsp) {
			var href;

			href = 'iplocator?ip=' + rsp;
			window.open(href, '_blank', 'width=1200,height=740,top=100,left=100');
		}).
		fail(function(err) {
			Client.skiserFail(err);
		});
	}));
	else Arena.pektisFormaIplocatorDOM = $();

	Arena.pektisPanelDOM.
	append(Arena.pektisFormaProsklisiDOM = $('<button>').text('Πρόσκληση').
	css('display', Arena.pektisFormaEditing ? 'none' : 'inline-block').
	on('click', function(e) {
		var button = $(this);

		Arena.inputRefocus(e);

		// Ελέγχουμε αν ήδη βρίσκεται αποστολή παρόμοιας πρόσκλησης σε εξέλιξη.
		// Πράγματι, με double click, ο χρήστης στέλνει δυο απανωτές προσκλήσεις,
		// πράγμα που πρέπει να αποφύγουμε ώστε να μην σπαταλάμε πόρους.

		if ($(this).data('apostoli'))
		return;

		$(this).data('apostoli', true);

		if (Arena.ego.oxiTrapezi())
		return Client.fyi.epano('Απροσδιόριστο τραπέζι');

		if (Arena.ego.oxiPektis())
		return Client.fyi.epano('Δεν είστε παίκτης στο τραπέζι');

		Client.fyi.pano('Αποστολή πρόσκλησης. Παρακαλώ περιμένετε…');
		Client.skiserService('prosklisiApostoli', 'pros=' + login.uri()).
		done(function(rsp) {
			button.removeData('apostoli');
			Arena.pektisFormaKlisimo(100);
			Client.fyi.pano();
		}).
		fail(function(err) {
			button.removeData('apostoli');
			Client.sound.beep();
			switch (err.responseText) {
			case 'pektisApasxolimenos':
				Client.fyi.epano('Ο παίκτης <span class="ble entona">' + login +
					'</span> είναι απασχολημένος');
				break;
			case 'pektisNotFound':
				Client.fyi.epano('Ο παίκτης <span class="ble entona">' + login +
					'</span> δεν βρέθηκε στο σκηνικό');
				break;
			default:
				Client.skiserFail(err);
				break;
			}
		});
	})).	

	append(Arena.pektisFormaMinimaDOM = $('<button>').text('Μήνυμα').
	css('display', Arena.pektisFormaEditing ? 'none' : 'inline-block').
	on('click', function(e) {
		Arena.inputRefocus(e);
		Arena.pektisFormaEditDOM.val('');
		Arena.pektisFormaEditOn('minima');
		Arena.pektisPanelRefreshDOM();
		Arena.pektisFormaEditDOM.focus();
	})).

	append(Arena.pektisFormaApostoliDOM = $('<button>').text('Αποστολή').
	css('display', Arena.pektisFormaEditing === 'minima' ? 'inline-block' : 'none').
	on('click', function(e) {
		var kimeno;

		Arena.inputRefocus(e);
		kimeno = Arena.pektisFormaEditDOM.val().trim();
		if (!kimeno) return Arena.pektisFormaEditOff();

		Client.fyi.pano('Αποστολή μηνύματος. Παρακαλώ περιμένετε…');
		Client.skiserService('minimaSend', 'pektis=' + login, 'kimeno=' + kimeno.uri()).
		done(function(rsp) {
			Client.fyi.pano();
			Arena.pektisFormaEditOff();
			Arena.pektisPanelRefreshDOM();
		}).
		fail(function(err) {
			Arena.pektisFormaEditDOM.focus();
			Client.skiserFail(err);
		});
	})).

	append(Arena.pektisFormaSxolioDOM = $('<img>').addClass('pektisPanelIcon').attr({
		src: 'ikona/pektis/edit.png',
		title: 'Ενημέρωση πληροφοριών προφίλ',
	}).css('display', Arena.pektisFormaEditing ? 'none' : 'inline-block').
	on('click', function(e) {
		Arena.inputRefocus(e);
		Arena.pektisFormaEditDOM.
		val(pektis.pektisProfinfoGet(Client.session.pektis));
		Arena.pektisFormaEditOn('sxolio');
		Arena.pektisFormaEditDOM.focus();
	})).

	append(Arena.pektisFormaKataxorisiDOM = $('<button>').text('Καταχώρηση').
	css('display', Arena.pektisFormaEditing === 'sxolio' ? 'inline-block' : 'none').
	on('click', function(e) {
		var kimeno;

		Arena.inputRefocus(e);
		kimeno = Arena.pektisFormaEditDOM.val().trim();

		// Αν το κείμενο που επιχειρεί να καταχωρήσει ο συντάκτης είναι το
		// ίδιο με αυτό που ήδη υπάρχει ως πληροφορία προφίλ του συντάκτη
		// για τον εν λόγω παίκτη, δεν χρειάζεται να γίνει αποστολή στον
		// skiser και συνακόλουθη κοινοποίηση στους clients.

		if (pektis.pektisProfinfoGet(Client.session.pektis) == kimeno) {
			pektis.pektisProfinfoRefreshDOM(login);
			Arena.pektisFormaEditOff();
			return;
		}

		Client.fyi.pano('Καταχώρηση προφίλ. Παρακαλώ περιμένετε…');
		Client.skiserService('profinfoPut', 'pektis=' + login, 'kimeno=' + kimeno.uri()).
		done(function(rsp) {
			Client.fyi.pano(rsp);

			// Ο ίδιος ο συντάκτης κάνει επί τόπου την αλλαγή της πληροφορίας
			// στο σκηνικό του και δεν χρειάζεται να περιμένει την παραλαβή της
			// από τον skiser.

			pektis.
			pektisProfinfoSet(Client.session.pektis, kimeno).
			pektisFormaPopupFillDOM(login);
			Arena.pektisFormaEditOff();
		}).
		fail(function(err) {
			Arena.pektisFormaEditDOM.focus();
			Client.skiserFail(err);
		});
	})).

	append(Arena.pektisFormaAkiroDOM = $('<button>').text('Άκυρο').
	css('display', Arena.pektisFormaEditing ? 'inline-block' : 'none').
	on('click', function(e) {
		Arena.inputRefocus(e);
		Arena.pektisFormaEditOff();
		Arena.pektisPanelRefreshDOM();
	}));

	if (Arena.ego.isFilos(login))
	Arena.pektisPanelDOM.append($('<img>').addClass('pektisPanelIcon').attr({
		src: Client.server + 'ikona/misc/Xgreen.png',
		title: 'Ανάκληση φιλίας',
	}).on('click', function(e) {
		Arena.alagiSxesis(e, login);
	}));

	else
	Arena.pektisPanelDOM.append($('<img>').addClass('pektisPanelIcon').attr({
		src: Client.server + 'ikona/pektis/filos.png',
		title: 'Φίλος',
	}).on('click', function(e) {
		Arena.alagiSxesis(e, login, 'ΦΙΛΟΣ');
	}));

	if (Arena.ego.isApoklismenos(login))
	Arena.pektisPanelDOM.append($('<img>').addClass('pektisPanelIcon').attr({
		src: Client.server + 'ikona/misc/Xred.png',
		title: 'Άρση αποκλεισμού',
	}).on('click', function(e) {
		Arena.alagiSxesis(e, login);
	}));

	else
	Arena.pektisPanelDOM.append($('<img>').addClass('pektisPanelIcon').attr({
		src: Client.server + 'ikona/pektis/apoklismos.png',
		title: 'Αποκλεισμός',
	}).on('click', function(e) {
		Arena.alagiSxesis(e, login, 'ΑΠΟΚΛΕΙΣΜΕΝΟΣ');
	}));

	Arena.pektisPanelDOM.
	append(Arena.pektisFormaArvilaDOM = $('<img>').addClass('pektisPanelIcon').attr({
		src: Client.server + 'ikona/pektis/arvila.png',
		title: 'Αποκλεισμός παίκτη',
	}).
	css('display', Arena.pektisFormaEditing ? 'none' : 'inline-block').
	on('click', function(e) {
		var button = $(this);

		Arena.inputRefocus(e);

		// Ελέγχουμε αν ήδη βρίσκεται αποστολή αποκλεισμού σε εξέλιξη. Πράγματι,
		// με double click, ο χρήστης στέλνει δυο απανωτούς αποκλεισμούς, πράγμα
		// που πρέπει να αποφύγουμε ώστε να μην σπαταλάμε πόρους.

		if (button.data('apostoli'))
		return;

		button.data('apostoli', true);

		if (!Arena.dikeomaArvila(pektis))
		return button.removeData('apostoli');

		Client.fyi.pano('Αποστολή αποκλεισμού. Παρακαλώ περιμένετε…');
		Client.skiserService('arvilaApostoli', 'pros=' + login.uri()).
		done(function(rsp) {
			button.removeData('apostoli');
			Client.fyi.pano('Καταθέσατε αίτημα αποκλεισμού του παίκτη ' +
				'<span class="kokino entona">' + login +
				'</span> από αυτό το τραπέζι');
		}).
		fail(function(err) {
			button.removeData('apostoli');
			Client.sound.beep();
			switch (err.responseText) {
			case 'arvilaPektis':
				Client.fyi.epano('Ο παίκτης <span class="ble entona">' + login +
					'</span> παίζει στο τραπέζι');
				break;
			case 'arvilaNotAllowed':
				Client.fyi.epano('Ο παίκτης <span class="ble entona">' + login +
					'</span> δεν μπορεί να αποκλειστεί');
				break;
			case 'arvilaExists':
				Client.fyi.epano('Ο παίκτης <span class="ble entona">' + login +
					'</span> έχει ήδη αποκλειστεί από το τραπέζι');
				break;
			case 'pektisNotFound':
				Client.fyi.epano('Ο παίκτης <span class="ble entona">' + login +
					'</span> δεν βρέθηκε στο σκηνικό');
				break;
			default:
				Client.skiserFail(err);
				break;
			}
		});
	}));

	Arena.pektisPanelDOM.
	append(Arena.pektisFormaAlivraDOM = $('<img>').addClass('pektisPanelIcon').attr({
		src: Client.server + 'ikona/pektis/alivra.png',
		title: 'Άρση αποκλεισμού',
	}).
	css('display', Arena.pektisFormaEditing ? 'none' : 'inline-block').
	on('click', function(e) {
		var button = $(this);

		Arena.inputRefocus(e);

		if (button.data('apostoli'))
		return;

		button.data('apostoli', true);

		if (!Arena.dikeomaAlivra(pektis))
		return button.removeData('apostoli');

		Client.fyi.pano('Αποστολή άρσης αποκλεισμού. Παρακαλώ περιμένετε…');
		Client.skiserService('arvilaArsi', 'pros=' + login.uri()).
		done(function(rsp) {
			button.removeData('apostoli');
			Client.fyi.pano('Καταθέσατε αίτημα άρσης αποκλεισμού του παίκτη ' +
				'<span class="prasino entona">' + login +
				'</span> από αυτό το τραπέζι');
		}).
		fail(function(err) {
			button.removeData('apostoli');
			Client.sound.beep();
			switch (err.responseText) {
			case 'pektisNotFound':
				Client.fyi.epano('Ο παίκτης <span class="ble entona">' + login +
					'</span> δεν βρέθηκε στο σκηνικό');
				break;
			case 'arvilaNotFound':
				Client.fyi.epano('Ο παίκτης <span class="ble entona">' + login +
					'</span> δεν έχει αποκλειστεί από αυτό το τραπέζι');
				break;
			default:
				Client.skiserFail(err);
				break;
			}
		});
	}));

	if (Arena.ego.isDiaxiristis() && login.oxiEgo())
	Arena.pektisPanelDOM.append($('<img>').addClass('pektisPanelIcon').attr({
		src: Client.server + 'ikona/pektis/exit.png',
		title: 'Αποβολή παίκτη',
	}).on('click', function(e) {
		Arena.inputRefocus(e);

		Client.skiserService('apovoli', 'pektis=' + login).
		fail(function(err) {
			Client.skiserFail(err);
		});
	}));

	Arena.pektisPanelRankRefreshDOM(pektis);

	if (photoSrc) Arena.pektisFormaDOM.append(photoDOM = $('<img>').attr({
		id: 'pektisPhoto',
		src: 'photo/' + photoSrc,
	}).siromeno({
		top: '40px',
		left: '8px',
	}));

	Arena.pektisFormaProsklisiDOM.css('display', Arena.dikeomaProsklisis() ? 'inline-block' : 'none');
	Arena.pektisFormaArvilaDOM.css('display', Arena.dikeomaArvila(pektis) ? 'inline-block' : 'none');
	Arena.pektisFormaAlivraDOM.css('display', Arena.dikeomaAlivra(pektis) ? 'inline-block' : 'none');
	Arena.pektisFormaLoginDOM.text(login);
	if (Arena.ego.isFilos(login)) Arena.pektisFormaLoginDOM.addClass('sxesiFilos');
	else if (Arena.ego.isApoklismenos(login)) Arena.pektisFormaLoginDOM.addClass('sxesiApoklismenos');
	return Arena;
};

Arena.pektisPanelRankRefreshDOM = function(pektis) {
	var rank, x, dom, opa, apodosi;

	rank = pektis.pektisPeparamGet('ΒΑΘΜΟΛΟΓΙΑ');

	if (!rank)
	return Arena;

	x = rank.split('#');

	if (x.length !== 2)
	return Arena;

	x[0] = parseFloat(x[0]);

	if (isNaN(x[0]))
	return Arena;

	x[1] = parseInt(x[1]);

	if (isNaN(x[1]))
	return Arena;

	apodosi = Prefadoros.apodosi2string(x[0], x[1]);

	Arena.pektisFormaBaraDOM.append(dom = $('<div>').
	addClass('pektisPanelRank ' + (x[0] < 0 ? 'kokino' : 'prasino')).
	attr('title', 'Ενδεικτική απόδοση από τις τελευταίες ' + x[1] + ' διανομές').
	text(apodosi));

	if (x[1] >= 1000)
	return Arena;

	opa = x[1] / 1000;

	if (opa < 0.3)
	opa = 0.3;

	dom.css('opacity', opa);
	return Arena;
};

Arena.dikeomaProsklisis = function() {
	if (Arena.ego.oxiPektis()) return false;
	if (Arena.ego.trapezi.trapeziIsElefthero()) return true;
	return Arena.ego.isThesi(1);
};

Arena.dikeomaArvila = function(pektis) {
	var login;

	if (Debug.flagGet('arvilaInactive'))
	return false;

	// Δεν μπορούμε να αποκλείσουμε τον εαυτό μας.

	if (Arena.ego.pektis === pektis)
	return false;

	// Δεν μπορούμε να αποκλείσουμε παίκτες του τραπεζιού.

	if (Arena.ego.oxiTrapezi())
	return false;

	// Δεν μπορούμε να αποκλείσουμε ανώτερους αξιωματούχους
	// από επόπτες και πάνω.

	if (pektis.pektisIsEpoptis())
	return false;

	login = pektis.pektisLoginGet();

	if (Arena.ego.trapezi.trapeziIsPektis(login))
	return false;

	// Δεν δίνουμε δικαίωμα αποκλεισμού εφόσον ο αποκλειόμενος
	// είναι ήδη αποκλεισμένος.

	if (Arena.ego.trapezi.trapeziIsArvila(login))
	return false;

	// Για να αιτηθούμε αποκλεισμό παίκτη πρέπει να είμαστε
	// παίκτες στο τραπέζι…

	if (Arena.ego.isPektis())
	return true;

	// …ή να κατέχουμε ανώτερο αξίωμα από
	// επόπτες και πάνω.

	if (Arena.ego.isEpoptis())
	return true;

	return false;
};

Arena.dikeomaAlivra = function(pektis) {
	var login;

	if (Debug.flagGet('arvilaInactive'))
	return false;

	if (Arena.ego.oxiTrapezi())
	return false;

	// Δίνουμε δικαίωμα άρσης αποκλεισμού μόνον εφόσον ο παίκτης
	// είναι αποκλεισμένος.

	login = pektis.pektisLoginGet();

	if (Arena.ego.trapezi.trapeziOxiArvila(login))
	return false;

	// Δικαίωμα άρσης αποκλεισμού έχουν μόνο οι παίκτες του
	// τραπεζιού…

	if (Arena.ego.isPektis())
	return true;

	// …ή αξιωματούχοι από επόπτες και πάνω.

	if (Arena.ego.isEpoptis())
	return true;

	return false;
};

// Η αλλαγή σχέσης δεν αφορά κανέναν παρά μόνον τον παίκτη που την αλλάζει.
// Έτσι στέλνουμε την αλλαγή στον skiser και κατά την επιστροφή επιτελούμε
// αυτά που θα κάναμε αν η αλλαγή σχέσης ερχόταν ως κίνηση από τον skiser.
// Αυτή η τακτική δεν είναι η προσήκουσα, καθώς αν κάνουμε αλλαγή σχέσης
// με κάποιον άλλον τρόπο, ο skiser δεν έχει τον τρόπο να ενημερώσει τον
// παίκτη.

Arena.alagiSxesis = function(e, login, sxesi) {
	Arena.inputRefocus(e);
	Client.skiserService('sxesi', 'pektis=' + login, 'sxesi=' + (sxesi ? sxesi : '')).
	done(function(rsp) {
		var sinedria;

		Arena.ego.pektis.pektisSxesiSet(login, sxesi);
		Arena.pektisPanelRefreshDOM(Arena.skiniko.skinikoPektisGet(login));
		Arena.sizitisi.apoklismosRefreshDOM();

		// Αλλάζουμε την εμφάνιση του σχετιζόμενου/αποσυσχετιζόμενου
		// παίκτη στα τραπέζια του καφενείου.

		Arena.skiniko.pektisEntopismosDOM(login);

		// Μένει να δούμε αν ο συσχετιζόμενος/αποσυσχετιζόμενος παίκτης
		// είναι ενεργός, οπότε θα πρέπει να ενημερώσουμε τις εμφανίσεις
		// του στις διάφορες περιοχές του καφενείου.

		sinedria = Arena.skiniko.skinikoSinedriaGet(login);
		if (!sinedria) return;

		sinedria.
		sinedriaNiofertosRefreshDOM().
		sinedriaRebelosRefreshDOM().
		sinedriaTheatisRefreshDOM();
	}).
	fail(function(err) {
		Client.skiserFail(err);
	});
};
