///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@
//
// PM -- Personal Messages (εσωτερικό ταχυδρομείο)
//
// Στο παρόν module υπάρχει κώδικας που οδηγεί τη σελίδα διαχείρισης προσωπικών
// μηνυμάτων. Τα προσωπικά μηνύματα είναι ένα είδος εσωτερικού ταχυδρομείου του
// «Πρεφαδόρου», όπου οι χρήστες μπορούν να ανταλλάσσουν μηνύματα σε προσωπική
// βάση.
//
// Τα μηνύματα του PM συντάσσονται από κάποιον χρήστη που ονομάζεται αποστολέας
// και αποστέλλονται σε κάποιον χρήστη που ονομάζεται παραλήπτης. Παραλήπτης
// μπορεί να είν αι και ο ίδιος ο αποστολέας, οπότε το μήνυμα σ' αυτήν την
// περίπτωση ονομάζεται ΟΙΚΟΘΕΝ.
//
// Από τη στιγμή που κάποιο μήνυμα έχει αποσταλεί, πρόσβαση στο μήνυμα έχουν
// ο αποστολέας και ο παρλήπτης. Και οι δύο μπορούν να το διαγράψουν, επομένως
// αν ο αποστολέας διαγράψει το μήνυμα πριν το διαβάσει ο παραλήπτης, το μήνυμα
// δεν διαβαστεί ποτέ από τον παραλήπτη. Επομένως, δεν είναι καλή τακτική να
// διαγράφει κάποιο μηνύματα ο αποστολέας πριν το διαβάσει ο παραλήπτης. Ούτε,
// όμως είναι καλή τακτική να διαγράφει ένα μήνυμα ο αποστολέας χωρίς ενημέρωση
// του αποστολέα ότι το μήνυμα διβάστηκε.
//
// Τακτική ορθής διαχείρισης μηνυμάτων
// -----------------------------------
// Ο αποστολέας συντάσσει και αποστέλλει το μήνυμα στον παραλήπτη.
// Ο παραλήπτης παραλαμβάνει και διαβάζει το μήνυμα.
// Ο παραλήπτης καθιστά το μήνυμα "ΔΙΑΒΑΣΜΕΝΟ".
// Ο αποστολέας διαγράφει το μήνυμα εφόσον λάβει γνώση ότι το μήνυμα έχει
// διαβαστεί από τον παραλήπτη.
//
// Εξαίρεση στην παραπάνω διαδικασία μπορεί να γίνει μέσω της ΚΡΑΤΗΣΗΣ μηνυμάτων.
// Πράγματι, κάποιες φορές ο παραλήπτης μπορεί να θέλει να κρατήσει κάποιο μήνυμα
// στο προσωπικό του αρχείο. Υπάρχουν πολλοί λόγοι γι' αυτό, π.χ. μέσα στο μήνυμα
// υπάρχει σημαντική πληροφορία, κάποιο τηλέφωνο κλπ.
//
// Κράτηση μηνυμάτων
// -----------------
// Ο αποστολέας συντάσσει και αποστέλλει το μήνυμα στον παραλήπτη.
// Ο παραλήπτης παραλαμβάνει το μήνυμα, το διαβάζει και κρίνει ότι πρέπει να το
// κρατήσει στο προσωπικό του αρχείο.
// Ο παραλήπτης καθιστά το μήνυμα "ΚΡΑΤΗΜΕΝΟ".
// Ο αποστολέας δεν μπορεί να διαγράψει κάποιο μήνυμα που έχει συντάξει και έχει
// κρατηθεί από τον παραλήπτη.
// Ο αποστολέας δεν θα «βλέπει» το μήνυμα σε επόμενες επισκέψεις του στη σελίδα
// διαχείρισης μηνυμάτων.
//
// Η σελίδα διαχείρισης μηνυμάτων έχει δύο μέρη: Στο επάνω μέρος της σελίδας
// υπάρχει control panel που περιέχει πλήκτρα και check boxes που αφορούν σε
// χειρισμούς που μπορεί να κάνει ο χρήστης, π.χ. σύνταξη νέου μηνύματος, επιλογή
// εισερχομένων/εξερχομένων κλπ. Ακολουθεί η λίστα των μηνυμάτων του χρήστη, δηλαδή
// μηνύματα στα οποία ο χρήστης εμπλέκεται είτε ως αποστολέας, είτε ως παραλήπτης.
// Αν ο χρήστης βρίσκεται στο χαμηλότερο μέρος της σελίδας και δεν έχει άμεση στο
// control panel, μπορεί να εμφανίσει το control panel τοποθετώντας τον δείκτη τού
// ποντικιού επάνω δεξιά, ή επάνω αριστερά και κάνοντας κλικ στις μπαρούλες που θα
// εμφανιστούν.
//
// Η σελίδα ενημερώνεται αυτόματα με την έλευση νέων μηνυμάτων, αλλά ο χρήστης
// μπορεί να κάνει ανανέωση του περιεχομένου κάνοντας κλικ στο σχετικό πλήκτρο.
// Για να απαντήσουμε σε κάποιο μήνυμα, μπρούμε να κάνουμε κλικ στην αριστερή
// πλευρά του μηνύματος, στην περιοχή ημερομηνίας και αποστολέα/παραλήπτη.

$(document).ready(function() {
	Client.tabPektis();
	Client.tabKlisimo($('#toolbarRight'));

	Minima.setupControls();
	Minima.setupMinimata();

	Client.fyi.pano('Καλώς ήλθατε στο ταχυδρομείο του «Πρεφαδόρου»');

	Arena = null;
	if (!window.opener) return;
	Arena = window.opener.Arena;
});

Minima.unload = function() {
	if (!Arena) return;
	if (!Arena.minima) return;
	if (!Arena.minima.win) return;

	Arena.minima.win.close();
	Arena.minima.win = null;
};

$(window).
on('beforeunload', function() {
	Minima.unload();
}).
on('unload', function() {
	Minima.unload();
}).
on('blur', function() {
	if (!Arena) return;
	Arena.minima.endixiClear();
}).
on('focus', function() {
	if (!Arena) return;
	Arena.inputRefocus();
	Arena.minima.endixiClear();
});

Minima.setupControls = function() {
	Minima.controlsDOM = $('#minimaControls');

	$('.minimaControlsGo').
	on('mouseenter', function(e) {
		$(this).children('.minimaControlsGoIcon').finish().fadeIn(100);
	}).
	on('mouseleave', function(e) {
		$(this).children('.minimaControlsGoIcon').finish().fadeOut();
	});

	$('.minimaControlsGoIcon').attr({
		src: '../ikona/misc/baresH.png',
		title: 'Κορυφή σελίδας',
	}).on('click', function(e) {
		e.stopPropagation();
		$(window.document).scrollTop(0);
	});

	$('.minimaCheckboxButton').addClass('minimaButton sinefo');

	$('#minimaNeoButton').on('click', function(e) {
		e.stopPropagation();
		Minima.editFormaParaliptisLoginDOM.val('');
		Minima.editFormaDOM.finish().fadeIn(100, function() {
			Minima.editFormaParaliptisLoginDOM.focus();
		});
	});

	Minima.ananeosiButtonDOM = $('#minimaAnaneosiButton').on('click', function(e) {
		e.stopPropagation();
		Client.skiserService('minimaFeredata', 'last=' + Minima.kodikosMax).
		done(function(rsp) {
			var mlist;

			try {
				mlist = ('[' + rsp + ']').evalAsfales();
			} catch (e) {
				Client.sound.beep();
				Client.fyi.epano('Παρελήφθησαν ακαθόριστα δεδομένα');
				return;
			}

			Globals.awalk(mlist, function(i, minima) {
				minima = new Minima(minima).
				minimaPoteAdd(Client.timeDif).
				minimaPushLista().
				minimaPushDOM();
			});
			Minima.filtrarisma();
		}).
		fail(function(err) {
			Client.skiserFail(err);
		});
	});

	$('.minimaCheckboxButton').
	on('mousedown', function(e) {
		e.stopPropagation();
		e.preventDefault();
	}).
	on('click', function(e) {
		e.stopPropagation();
		e.preventDefault();
		$(this).children('input').trigger('click');
	}).
	children('input').
	on('click', function(e) {
		e.stopPropagation();
	});

	Minima.buttonOlaDOM = $('#minimaOlaButton').
	on('click', function(e) {
		if ($(this).prop('checked')) {
			Minima.buttonIserxomenaDOM.prop('checked', true);
			Minima.buttonExerxomenaDOM.prop('checked', true);
			Minima.buttonIkothenDOM.prop('checked', true);
			Minima.buttonKratimenaDOM.prop('checked', true);
			Minima.buttonDiavasmenaDOM.prop('checked', true);
			Minima.buttonAdiavastaDOM.prop('checked', true);
		}
		else {
			Minima.buttonIserxomenaDOM.prop('checked', true);
			Minima.buttonExerxomenaDOM.prop('checked', true);
			Minima.buttonIkothenDOM.prop('checked', false);
			Minima.buttonKratimenaDOM.prop('checked', false);
			Minima.buttonDiavasmenaDOM.prop('checked', false);
			Minima.buttonAdiavastaDOM.prop('checked', true);
		}
		Minima.filtrarisma();
	});

	Minima.buttonIserxomenaDOM = $('#minimaIserxomenaButton').
	prop('checked', true).
	on('click', function(e) {
		Minima.buttonOlaDOM.prop('checked', false);
		if ($(this).prop('checked')) {
			Minima.buttonIserxomenaDOM.prop('checked', true);
			Minima.buttonExerxomenaDOM.prop('checked', false);
			Minima.buttonIkothenDOM.prop('checked', false);
			Minima.buttonKratimenaDOM.prop('checked', false);
			Minima.buttonDiavasmenaDOM.prop('checked', false);
			Minima.buttonAdiavastaDOM.prop('checked', true);
		}
		Minima.filtrarisma();
	});

	Minima.buttonExerxomenaDOM = $('#minimaExerxomenaButton').
	prop('checked', true).
	on('click', function(e) {
		Minima.buttonOlaDOM.prop('checked', false);
		if ($(this).prop('checked')) {
			Minima.buttonIserxomenaDOM.prop('checked', false);
			Minima.buttonExerxomenaDOM.prop('checked', true);
			Minima.buttonIkothenDOM.prop('checked', false);
			Minima.buttonKratimenaDOM.prop('checked', false);
			Minima.buttonDiavasmenaDOM.prop('checked', false);
			Minima.buttonAdiavastaDOM.prop('checked', true);
		}
		Minima.filtrarisma();
	});

	Minima.buttonIkothenDOM = $('#minimaIkothenButton').
	on('click', function(e) {
		Minima.buttonOlaDOM.prop('checked', false);
		if ($(this).prop('checked')) {
			Minima.buttonIkothenDOM.prop('checked', true);
		}
		Minima.filtrarisma();
	});

	Minima.buttonKratimenaDOM = $('#minimaKratimenaButton').
	on('click', function(e) {
		Minima.buttonOlaDOM.prop('checked', false);
		if ($(this).prop('checked')) {
			Minima.buttonKratimenaDOM.prop('checked', true);
		}
		Minima.filtrarisma();
	});

	Minima.buttonDiavasmenaDOM = $('#minimaDiavasmenaButton').
	on('click', function(e) {
		Minima.buttonOlaDOM.prop('checked', false);
		if ($(this).prop('checked')) {
			Minima.buttonDiavasmenaDOM.prop('checked', true);
		}
		Minima.filtrarisma();
	});

	Minima.buttonAdiavastaDOM = $('#minimaAdiavastaButton').
	prop('checked', true).
	on('click', function(e) {
		Minima.buttonOlaDOM.prop('checked', false);
		if ($(this).prop('checked')) {
			Minima.buttonAdiavastaDOM.prop('checked', true);
		}
		Minima.filtrarisma();
	});
};

Minima.filtrarisma = function() {
	var count = 0;

	Minima.minimataDOM.find('.minima').each(function() {
		var minima;

		$(this).css('display', 'none');
		minima = Minima.lista[$(this).data('minima')];
		if (!minima) return;

		if (minima.filtroCheck())
		$(this).removeClass('minimaZebra0 minimaZebra1').
		addClass('minimaZebra' + (count++ % 2)).
		css('display', 'table-row');
	});
};

Minima.prototype.filtroCheck = function() {
	if (Minima.buttonOlaDOM.prop('checked'))
	return true;

	if (Minima.buttonIkothenDOM.prop('checked'))
	return this.minimaIsIkothen();

	if (this.minimaIsIkothen())
	return false;

	if (Minima.buttonKratimenaDOM.prop('checked'))
	return this.minimaIsKratimeno();

	if (this.minimaIsKratimeno())
	return false;

	if ((!Minima.buttonDiavasmenaDOM.prop('checked')) && this.minimaIsDiavasmeno())
	return false;

	if ((!Minima.buttonAdiavastaDOM.prop('checked')) && this.minimaIsAdiavasto())
	return false;

	if (this.minimaIsIkothen())
	return false;

	if ((!Minima.buttonIserxomenaDOM.prop('checked')) && this.minimaIsIserxomeno())
	return false;

	if ((!Minima.buttonExerxomenaDOM.prop('checked')) && this.minimaIsExerxomeno())
	return false;

	return true;
};

Minima.setupMinimata = function() {
	Minima.minimataDOM = $('#minimata');
	Minima.lista = {};
	Minima.kodikosMax = 0;

	Minima.minimataDOM.

	// Τοποθετώντας τον δείκτη του ποντικιού στον χώρο κάποιου μηνύματος
	// φροντίζουμε να κάνουμε εμφανέστερο το μήνυμα και να το εφοπλίσουμε
	// με το πάνελ διαχείρισης μηνυμάτων.

	on('mouseenter', '.minima', function(e) {
		var minimaDOM, kodikos, minima, panelDOM, katastasi;

		minimaDOM = $(this);
		kodikos = minimaDOM.data('minima');
		minima = Minima.lista[kodikos];
		if (!minima) return;

		// Καθιστούμε το μήνυμα εμφανές.

		minimaDOM.addClass('minimaTrexon');
		minimaDOM.children('.minimaKimeno').addClass('minimaKimenoTrexon');

		// Εμφανίζουμε ενημερωτική ταμπελίτσα στο σημείο που ο χρήστης
		// μπορεί να κάνει κλικ για να απαντήσει.

		if (Minima.apantisiLabelDOM)
		Minima.apantisiLabelDOM.remove();

		$(this).children('.minimaPote').
		append(Minima.apantisiLabelDOM = $('<div>').
		addClass('minimaApantisiLabel').text('Απάντηση').
		on('click', function(e) {
			Minima.editFormaParaliptisLoginDOM.
			val($(this).parents('.minima').children('.minimaPios').text().trim());
			Minima.editFormaDOM.finish().fadeIn(100, function() {
				Minima.editFormaKimenoDOM.focus();
			});
		}));

		// Εφοπλίζουμε το πάνελ διαχείρισης μηνυμάτων ανάλογα με τα
		// χαρακτηριστικά του μηνύματος.

		panelDOM = minimaDOM.children('.minimaPanel');
		panelDOM.empty().

		// Η διαγραφή μηνύματος είναι πάντοτε μια διαθέσιμη επιλογή.

		append($('<div>').addClass('minimaPanelButton').
		append($('<img>').addClass('minimaPanelIcon').attr({
			src: '../ikona/minima/diagrafi.png',
			title: 'Διαγραφή μηνύματος',
		}).
		on('click', function(e) {
			Client.fyi.pano('Διαγραφή μηνύματος. Παρακαλώ περιμένετε…');
			Client.skiserService('minimaDelete', 'minima=' + kodikos).
			done(function(rsp) {
				Client.fyi.pano(rsp);
				Client.sound.skisimo();
				minimaDOM.addClass('minimaDiagrafi').
				fadeOut(function() {
					$(this).remove();
					Minima.zebraRefresh();
				});
			}).
			fail(function(err) {
				Client.sound.beep();
				Client.skiserFail(err);
			});
		})));

		if (minima.minimaParaliptisGet().toLowerCase() !== Client.session.pektis.toLowerCase())
		return;

		katastasi = minima.minimaStatusGet();

		if ((katastasi !== 'ΔΙΑΒΑΣΜΕΝΟ') && (katastasi !== 'ΚΡΑΤΗΜΕΝΟ'))
		panelDOM.append($('<div>').addClass('minimaPanelButton').
		append($('<img>').addClass('minimaPanelIcon').attr({
			src: '../ikona/minima/adiavasto.png',
			title: 'ΑΔΙΑΒΑΣΤΟ μήνυμα. Αλλαγή κατάστασης σε ΔΙΑΒΑΣΜΕΝΟ',
		}).
		on('click', function(e) {
			var katastasi = 'ΔΙΑΒΑΣΜΕΝΟ';

			Client.fyi.pano('Αλλαγή κατάστασης μηνύματος. Παρακαλώ περιμένετε…');
			Client.skiserService('minimaKatastasi', 'minima=' + kodikos, 'katastasi=' + katastasi).
			done(function(rsp) {
				Client.fyi.pano(rsp);
				Client.sound.tak();
				minima.minimaStatusSet(katastasi);
				minimaDOM.addClass('minimaDiavasmeno').trigger('mouseenter');
			}).
			fail(function(err) {
				Client.sound.beep();
				Client.skiserFail(err);
			});
		})));

		else
		panelDOM.append($('<div>').addClass('minimaPanelButton').
		append($('<img>').addClass('minimaPanelIcon').attr({
			src: '../ikona/minima/diavasmeno.png',
			title: 'Αλλαγή κατάστασης σε ΑΔΙΑΒΑΣΤΟ',
		}).
		on('click', function(e) {
			var katastasi = 'ΑΔΙΑΒΑΣΤΟ';

			Client.fyi.pano('Αλλαγή κατάστασης μηνύματος. Παρακαλώ περιμένετε…');
			Client.skiserService('minimaKatastasi', 'minima=' + kodikos, 'katastasi=' + katastasi).
			done(function(rsp) {
				Client.fyi.pano(rsp);
				Client.sound.tak();
				minima.minimaStatusSet(katastasi);
				minimaDOM.removeClass('minimaDiavasmeno').trigger('mouseenter');
			}).
			fail(function(err) {
				Client.sound.beep();
				Client.skiserFail(err);
			});
		})));

		if (katastasi !== 'ΚΡΑΤΗΜΕΝΟ')
		panelDOM.append($('<div>').addClass('minimaPanelButton').
		append($('<img>').addClass('minimaPanelIcon').attr({
			src: '../ikona/minima/kratimeno.png',
			title: 'Αρχειοθέτηση μηνύματος',
		}).
		on('click', function(e) {
			var katastasi = 'ΚΡΑΤΗΜΕΝΟ';

			Client.fyi.pano('Αρχειοθέτηση μηνύματος. Παρακαλώ περιμένετε…');
			Client.skiserService('minimaKatastasi', 'minima=' + kodikos, 'katastasi=' + katastasi).
			done(function(rsp) {
				Client.fyi.pano(rsp);
				Client.sound.tak();
				minima.minimaStatusSet(katastasi);
				minimaDOM.addClass('minimaDiavasmeno').trigger('mouseenter');
			}).
			fail(function(err) {
				Client.sound.beep();
				Client.skiserFail(err);
			});
		})));
	}).

	on('mouseleave', '.minima', function(e) {
		var minimaDOM, panelDOM;

		minimaDOM = $(this);
		minimaDOM.removeClass('minimaTrexon');
		minimaDOM.children('.minimaKimeno').removeClass('minimaKimenoTrexon');
		Minima.apantisiLabelDOM.remove();
		delete Minima.apantisiLabelDOM;
		panelDOM = minimaDOM.children('.minimaPanel');
		panelDOM.empty();
	});

	Minima.editFormaSetup();
	Minima.ananeosiButtonDOM.trigger('click');
};

Minima.editFormaSetup = function() {
	Minima.editFormaDOM = $('#minimaEditForma');
	Minima.editFormaKimenoDOM = $('#minimaEditFormaKimeno');
	Minima.editFormaPanelSetup();
	Minima.editFormaDOM.addClass('formaSoma').siromeno({
		position: 'fixed',
	}).
	append(Client.klisimo(function() {
		Minima.editFormaKlisimo();
	})).
	css('display', 'none');
};

Minima.editFormaPanelSetup = function() {
	Minima.editFormaParaliptisLoginDOM = $('#minimaEditFormaParaliptisLogin');
	$('#minimaEditFormaPanel').
	append($('<button>').addClass('formaButton').attr('type', 'submit').text('Αποστολή').
	on('click', function(e) {
		var paraliptis, kimeno;

		Minima.editFormaParaliptisLoginDOM.focus();
		paraliptis = Minima.editFormaParaliptisLoginDOM.val().trim();
		if (!paraliptis) {
			Client.fyi.epano('Ακαθόριστος παραλήπτης');
			Client.sound.beep();
			return;
		}

		kimeno = Minima.editFormaKimenoDOM.val().trim();
		if (!kimeno) {
			Client.fyi.epano('Κενό μήνυμα');
			Client.sound.beep();
			return;
		}

		Client.fyi.pano('Αποστολή μηνύματος. Παρακαλώ περιμένετε…');
		Client.skiserService('minimaSend', 'pektis=' + paraliptis, 'kimeno=' + kimeno.uri()).
		done(function(rsp) {
			var kodikos;

			Client.fyi.pano();
			Minima.editFormaKimenoDOM.val('');
			Minima.editFormaKlisimo();

			kodikos = parseInt(rsp);
			new Minima({
				kodikos: kodikos,
				apostoleas: Client.session.pektis,
				paraliptis: paraliptis,
				kimeno: kimeno,
				pote: Globals.tora(),
				status: 'ΑΔΙΑΒΑΣΤΟ',
			}).
			minimaPushLista().
			minimaPushDOM(true);
		}).
		fail(function(err) {
			Client.sound.beep();
			Client.skiserFail(err);
		});
	})).
	append($('<button>').addClass('formaButton').attr('type', 'button').text('Άκυρο').
	on('click', function(e) {
		Minima.editFormaKimenoDOM.val('');
		Minima.editFormaKlisimo();
	}));
};

Minima.editFormaKlisimo = function() {
	Minima.editFormaDOM.finish().fadeOut(100);
};

Minima.zebraRefresh = function() {
	var count = 0;

	Minima.minimataDOM.find('.minima').each(function() {
		if ($(this).css('display') === 'none')
		return;

		$(this).removeClass('minimaZebra0 minimaZebra1').addClass('minimaZebra' + (count++ % 2));
	});
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Minima.prototype.minimaPushLista = function() {
	var kodikos;

	kodikos = this.minimaKodikosGet();
	if (kodikos > Minima.kodikosMax)
	Minima.kodikosMax = kodikos;

	Minima.lista[kodikos] = this;
	return this;
};

Minima.prototype.minimaPushDOM = function(online) {
	var kodikos, pios, pote, img;

	kodikos = this.minimaKodikosGet();
	pios = this.minimaIsIserxomeno() ? this.minimaApostoleasGet() : this.minimaParaliptisGet();
	pote = this.minimaPoteGet();

	this.DOM = $('<tr>').
	data('minima', kodikos).
	addClass('minima').
	append($('<td>').addClass('minimaKodikos').text(this.minimaKodikosGet())).
	append($('<td>').addClass('minimaPote').
	html(Globals.mera(pote) + '<br />' + Globals.ora(pote))).
	append($('<td>').addClass('minimaPios').
	append($('<div>').addClass('minimaPiosOnoma').text(pios)).
	append(img = $('<img>').addClass('minimaIdosIcon'))).
	append($('<td>').addClass('minimaPanel')).
	append($('<td>').addClass('minimaKimeno').html(this.minimaKimenoGetHTML())).
	prependTo(Minima.minimataDOM);

	if (online) this.DOM.finish().fadeIn(500, function() {
		Minima.zebraRefresh();
	});

	if (this.minimaStatusGet() !== 'ΑΔΙΑΒΑΣΤΟ')
	this.DOM.addClass('minimaDiavasmeno');

	if (this.minimaIsIserxomeno()) img.attr({
		src: '../ikona/minima/iserxomeno.png',
		title: 'Εισερχόμενο',
	});
	else if (this.minimaIsExerxomeno()) img.attr({
		src: '../ikona/minima/exerxomeno.png',
		title: 'Εξερχόμενο',
	});
	else {
		this.DOM.addClass('minimaIkothen');
		img.attr({
			src: '../ikona/minima/ikothen.png',
			title: 'Οίκοθεν',
		});
	}

	return this;
};

Minima.prototype.minimaGetDOM = function() {
	return this.DOM;
};

Minima.prototype.minimaEndixiNeo = function() {
	var dom;

	dom = this.minimaGetDOM();
	if (!dom) return this;

	if (dom.find('.minimaNeoIcon').length)
	return this;

	dom.children('.minimaPote').
	append($('<img>').attr('src', '../ikona/minima/neo.png').addClass('minimaNeoIcon').
	on('click', function() {
		$(this).finish().fadeOut(function() {
			$(this).remove();
		});
	}));
	return this;
};

Minima.prototype.minimaIsIserxomeno = function() {
	var apostoleas;

	apostoleas = this.minimaApostoleasGet().toLowerCase();
	if (apostoleas === this.minimaParaliptisGet().toLowerCase())
	return false;

	return(apostoleas !== Client.session.pektis.toLowerCase());
};

Minima.prototype.minimaOxiIserxomeno = function() {
	return !this.minimaIsIserxomeno();
};

Minima.prototype.minimaIsExerxomeno = function() {
	return(this.minimaParaliptisGet().toLowerCase() !== Client.session.pektis.toLowerCase());
};

Minima.prototype.minimaOxiExerxomeno = function() {
	return !this.minimaIsExerxomeno();
};
