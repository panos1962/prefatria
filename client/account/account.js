$(document).ready(function() {
	Account.init();
	Client.fortos.setup();

	Client.tabPrive();
	if (Client.isPektis()) {
		Client.toolbarLeft('account');
		Client.tabKlisimo();
		Account.login.prop( 'disabled', true );
		Account.onoma.focus().val(Account.onoma.val());
		Account.ilikia.val(1);
		Account.xrisi.val(1);
		$('.account_sokidok').css({visibility:'visible'});
		$('.account_kodikos').find('input').prop({disabled:true});
	}
	else {
		Client.toolbarLeft('egrafi');
		Client.tabArxiki();
		$('.account_kodikos').css({opacity:1});
		$('#ilikiaContainer').css({display:'table-row'});
		$('#xrisiContainer').css({display:'table-row'});
		Account.xrisi.css({visibility:'visible'});
		Account.login.focus().on('keyup', function(e) {
			e.stopPropagation();
			Account.checkLogin();
		});
		Client.tabIsodos();
	}
});

$(window).ready(function() {
	$(window).trigger('resize');
});

Account = {};

Account.init = function() {
	Account.login = $('input[name="login"]');
	Account.onoma = $('input[name="onoma"]');
	Account.email = $('input[name="email"]');
	Account.ilikia = $('#ilikia');
	Account.xrisi = $('#xrisi');
	Account.photo = $('input[name="photo"]');
	Account.kodikos = $('input[name="kodikos"]');
	Account.kodikos1 = $('input[name="kodikos1"]');
	Account.kodikos2 = $('input[name="kodikos2"]');
	Account.actionFrame = $('iframe[name="action"]');
	$('#photoContainer').on('click', function(e) {
		Account.photo.trigger('click');
	});
}

Account.kodikosAlagi = function(x) {
	if (x) $(x).parents('tr').css({visibility: 'hidden'});
	$('.account_kodikos').css({opacity:1}).find('input').prop({disabled:false});
	Account.kodikos1.focus();
	return false;
}

Account.akiro = function() {
	if (Client.isPektis()) self.close();
	else self.location = Client.server;
	return false;
}

Account.checkAction = function() {
	var res, slogin, sklidi, skodikos;

	res = Account.actionFrame.contents().text().split('@EOD@');
	if (res[0]) {
		Client.fyi.epano(res[0]);
		if (Client.isPektis()) Account.onoma.focus();
		else Account.login.focus();
		return;
	}

	// Αν έχουμε επώνυμη χρήση, τότε πρόκειται για ενημέρωση στοιχείων
	// λογαριασμού επομένως δεν θα γίνει καμία περαιτέρω ενέργεια.

	// TODO
	// Θα πρέπει να γίνει ενημέρωση του σκηνικού στον skiser και
	// κατ' επέκτασιν του σκηνικού των clients με τα νέα στοιχεία του
	// παίκτη.

	if (Client.isPektis()) return self.close();

	// Ο παίκτης έχει μόλις εγγραφεί, δηλαδή έχει ενταχθεί στην database και
	// θα ακολουθήσουμε τη διαδικασία που ακολουθούμε και κατά την είσοδο.

	slogin = Account.login.val().uri();
	sklidi = Globals.randomString(10, 10).uri();
	skodikos = Account.kodikos1.val().uri();

	$.ajax(Client.skiser + 'checkin' +
		'?PK=' + slogin +
		'&KL=' + sklidi +
		'&kodikos=' + skodikos
	).
	done(function(rsp) {
		if (rsp !== '') return Client.fyi.epano(rsp);
		self.location = Client.server + 'isodos/isodos.php' +
			'?login=' + slogin +
			'&klidi=' + sklidi;
	}).
	fail(function(rsp) {
		Client.skiserFail(rsp);
	});
}

Account.checkLogin = function() {
	var login = Account.login.val().trim();
	if (login != Account.login.val()) Account.login.val(Account.login.val().trim());

	if (Account.checkLoginTimer) clearTimeout(Account.checkLoginTimer);
	Account.checkLoginTimer = null;
	if (!Account.login.val().validLogin())  return Account.login.addClass('kokino');

	Account.checkLoginTimer = setTimeout(function() {
		$.ajax(Client.server + 'account/checkLogin.php', {
			data: {
				login: Account.login.val(),
			},
		}).
		done(function(data) {
			if (data === "X") Account.login.addClass('kokino');
			else Account.login.removeClass('kokino');
		});
	}, 200);
}

Account.invalidData = function(form) {
	Account.login.val(Account.login.val().trim());
	if (Account.login.val() === '') {
		Client.fyi.epano('Το login δεν μπορεί να είναι κενό');
		Account.login.focus();
		return true;
	}

	if (!Account.login.val().validLogin()) {
		Client.fyi.epano('Το login περιέχει απαράδεκτους χαρακτήρες');
		Account.login.focus();
		return true;
	}

	Account.onoma.val(Account.onoma.val().trim());
	if (Account.onoma.val() === '') {
		Client.fyi.epano('Το ονοματεπώνυμο δεν μπορεί να είναι κενό');
		Account.onoma.focus();
		return true;
	}

	Account.email.val(Account.email.val().trim());
	if ((Account.email.val() !== '') && (!Account.email.val().validEmail())) {
		Client.fyi.epano('Λανθασμένο email');
		Account.email.focus();
		return true;
	}

	if (Account.ilikia.val() != 1) {
		Client.fyi.epano('Πρέπει να είστε άνω των 18 ετών');
		Account.ilikia.focus();
		return true;
	}

	if (Account.xrisi.val() != 1) {
		Client.fyi.epano('Πρέπει να έχετε διαβάσει και να συμφωνείτε με τους <a href="' +
			Client.server + 'xrisi' + '" target="xrisi">όρους χρήσης</a>');
		Account.xrisi.focus();
		return true;
	}

	if (Account.kodikos2.val() != Account.kodikos1.val()) {
		Client.fyi.epano('Οι δύο κωδικοί είναι διαφορετικοί');
		Account.kodikos1.focus();
		return true;
	}

	if (Client.isPektis()) return false;

	if (Account.kodikos1.val() === '') {
		Client.fyi.epano('Δεν δώσατε κωδικό');
		Account.kodikos1.focus();
		return true;
	}

	return false;
}

Account.submit = function(form) {
	Client.fyi.pano();
	return !Account.invalidData(form);
}
