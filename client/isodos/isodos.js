$(document).ready(function() {
	Isodos.init();
	Client.toolbarLeft('isodos');
	Client.tabPrive();
	Client.tabArxiki();
	Client.tabEgrafi();
	Client.fortos.setup();
});

$(window).ready(function() {
	$(window).trigger('resize');
});

Isodos = {};

Isodos.init = function() {
	Isodos.login = $('input[name="login"]');
	Isodos.kodikos = $('input[name="kodikos"]');
	Isodos.klidi = $('input[name="klidi"]');
	Isodos.ilikia = $('#ilikia');
	Isodos.xrisi = $('#xrisi');
	Isodos.login.focus().val(Isodos.login.val());
	Isodos.proxori = 0;
}

Isodos.akiro = function() {
	self.location = Client.server;
	return false;
}

Isodos.submit = function(form) {
	if (Isodos.ilikia.val() != 1) {
		Client.fyi.epano('Πρέπει να είστε άνω των 18 ετών');
		Isodos.ilikia.focus();
		return false;
	}

	if (Isodos.xrisi.val() != 1) {
		Client.fyi.epano('Πρέπει να έχετε διαβάσει και να συμφωνείτε με τους <a href="' +
			Client.server + 'xrisi' + '" target="xrisi">όρους χρήσης</a>');
		Isodos.xrisi.focus();
		return false;
	}

	if (Isodos.proxori === 1) return false;
	if (Isodos.proxori === 2) return true;

	Isodos.proxori = 1;
	Client.fyi.pano();
	Isodos.klidi.val(Globals.randomString(10, 10));
	$.ajax(Client.skiser + 'checkin' +
		'?PK=' + Isodos.login.val().uri() +
		'&KL=' + Isodos.klidi.val().uri() +
		'&kodikos=' + Isodos.kodikos.val().uri()
	).
	done(function(rsp) {
		if (rsp !== '') {
			Client.fyi.epano(rsp);
			Isodos.proxori = 0;
			return;
		}

		Isodos.proxori = 2;
		$(form).submit();
	}).
	fail(function(rsp) {
		Client.skiserFail(rsp);
		Isodos.proxori = 0;
	});

	return false;
}
