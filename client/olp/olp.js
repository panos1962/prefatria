olp = {}

olp.plist = {};
olp.sxesi = {};

$(window).
on('resize', function() {
	var hw, ha;

	hw = $(window).innerHeight();
	ha = olp.konsolaDOM.outerHeight(true);
	Client.ofelimoDOM.css({
		top: ha + 'px',
		height: (hw - ha) + 'px',
	});
});

$(document).
ready(function() {
	olp.
	konsolaSetup().
	ofelimoSetup().
	arxikiEnimerosi();
}).
on('keyup', function(e) {
	if (Client.isPektis())
	return;

	switch (e.which) {
	case 13:
		olp.isodos();
		break;
	case 27:
		$('input').val('');
		break;
	}
});

olp.konsolaSetup = function() {
	olp.konsolaDOM = $('<div>').attr('id', 'konsola').
	prependTo(Client.bodyDOM);
	olp.konsolaDOM.

	// Ακολουθεί το panel εισόδου με login και password.

	append(olp.isodosDOM = $('<div>').
	css('display', Client.isPektis() ? 'none' : 'inline-block').

	append($('<div>').addClass('prompt').text('Login')).
	append(olp.loginDOM = $('<input>').addClass('pedio')).

	append($('<div>').addClass('prompt').text('Password')).
	append(olp.kodikosDOM = $('<input>').addClass('pedio').
	prop('type', 'password')).

	append($('<button>').text('Είσοδος').
	on('click', function(e) {
		olp.isodos(e);
	}))).

	// Ακολουθεί το panel εξόδου.

	append(olp.exodosDOM = $('<div>').
	css('display', Client.oxiPektis() ? 'none' : 'inline-block').

	append(olp.accountDOM = $('<div>').attr('id', 'account').text(Client.session.pektis)).

	append($('<button>').text('Έξοδος').
	on('click', function(e) {
		olp.exodos(e);
	}))).

	// Ακολουθεί το panel αναζήτησης παίκτη.

	append(olp.anazitisiDOM = $('<div>').
	attr('id', 'anazitisi').

	append($('<div>').addClass('prompt').text('Αναζήτηση')).
	append(olp.anazitisiInputDOM = $('<input>').addClass('pedio').
	on('keyup', function(e) {
		var fld;

		switch (e.which) {
		case 27:
			fld = olp.anazitisiInputDOM.val();

			if (fld)
			olp.anazitisiInputDOM.
			val('').
			data('prev', fld);

			else
			olp.anazitisiInputDOM.
			val(olp.anazitisiInputDOM.data('prev'));

			break;
		}

		fld = olp.anazitisiInputDOM.val();
		olp.anazitisiRE = fld ? new RegExp(fld, 'i') : false;

		$('.pektis').each(function() {
			if (olp.anazitisiRE && $(this).text().match(olp.anazitisiRE))
			$(this).addClass('pektisMatch');

			else
			$(this).removeClass('pektisMatch');
		});
	})));

	if (olp.anazitisiURL) {
		olp.anazitisiInputDOM.val(olp.anazitisiURL);
		olp.anazitisiRE = new RegExp(olp.anazitisiURL, 'i');
	}

	olp.anazitisiInputDOM.focus();
	return olp;
};

olp.ofelimoSetup = function() {
	$(document).trigger('resize');
	return olp;
};

olp.arxikiEnimerosi = function() {
	$.post(Client.server + 'olp/olp.php', {
		sxesi: true,
	}).
	done(function(rsp) {
		var filos;

		Client.ofelimoDOM.empty();

		try {
			eval(rsp);
		} catch (e) {
			return;
		}

		filos = false;
		Globals.awalk(plist, function(i, p) {
			var dom;

			olp.plist[p] = true;
			Client.ofelimoDOM.append(dom = $('<div>').addClass('pektis').text(p));

			if (olp.pektisCheck(p, dom))
			filos = true;
		});

		if (filos)
		Client.sound.deskbell();

		setTimeout(function() {
			olp.ananeosi();
		}, 5000);
	});
};

olp.ananeosi = function() {
	$.post(Client.server + 'olp/olp.php').
	done(function(rsp) {
		var plist, tsilp;

		try {
			eval(rsp);
		} catch (e) {
			return;
		}

		tsilp = {};

		Globals.awalk(plist, function(i, pektis) {
			var dom;

			tsilp[pektis] = true;

			if (olp.plist[pektis])
			return;

			Client.ofelimoDOM.prepend(dom = $('<div>').addClass('pektis').text(pektis));
			olp.plist[pektis] = true;

			if (olp.pektisCheck(pektis, dom))
			Client.sound.deskbell();
		});

		$('.pektis').each(function() {
			var pektis = $(this).text();

			if (tsilp[pektis])
			return true;

			$(this).remove();
			delete olp.plist[pektis];

			return true;
		});

		setTimeout(function() {
			olp.ananeosi();
		}, 5000);
	});
};

olp.pektisCheck = function(pektis, dom) {
	var found = false;

	if (olp.anazitisiRE && pektis.match(olp.anazitisiRE)) {
		dom.addClass('pektisMatch');
		found = true;
	}

	if (!olp.sxesi.hasOwnProperty(pektis))
	return found;

	if (olp.sxesi[pektis]) {
		dom.addClass('filos');
		found = true;
	}

	else
	dom.addClass('apoklismenos');

	return found;
};

olp.isodos = function(e) {
	var login = olp.loginDOM.val();

	$.post(Client.server + 'olp/isodos.php', {
		login: login,
		kodikos: olp.kodikosDOM.val(),
	}).
	done(function(rsp) {
		var filos;

		try {
			eval(rsp);
		} catch (e) {
			olp.pektisSet();
			olp.sxesi = {};
			return;
		}

		olp.pektisSet(login);
		olp.anazitisiInputDOM.focus();

		filos = false;
		$('.pektis').
		removeClass().
		addClass('pektis').
		each(function() {
			if (olp.pektisCheck($(this).text(), $(this)))
			filos = true;

			return true;
		});

		if (filos)
		Client.sound.deskbell();
	});
};

olp.exodos = function(e) {
	$.post(Client.server + 'account/exodos.php');
	olp.pektisSet();
	olp.anazitisiInputDOM.focus();

	$('.pektis').
	removeClass().
	addClass('pektis').
	each(function() {
		olp.pektisCheck($(this).text(), $(this));
		return true;
	});
};

olp.pektisSet = function(login) {
	if (login) {
		Client.session.pektis = login;
		olp.accountDOM.text(login);
		olp.isodosDOM.css('display', 'none');
		olp.exodosDOM.css('display', 'inline-block');

		return olp;
	}

	delete Client.session.pektis;
	olp.sxesi = {};
	olp.exodosDOM.css('display', 'none');
	olp.isodosDOM.css('display', 'inline-block');

	return olp;
};
