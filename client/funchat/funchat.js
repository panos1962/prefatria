$(document).ready(function() {
	// Χρειαζόμαστε πρόσβαση στη βασική σελίδα του «Πρεφαδόρου», από
	// την οποία εκκίνησε το funchat. Σ' αυτή τη σελίδα υπάρχει global
	// μεταβλητή "Arena" και ουσιαστικά αυτήν χρειαζόμαστε.
	// Αν δεν υπάρχει γονική σελίδα, ή η μεταβλητή "Arena" δεν βρεθεί
	// στη γονική σελίδα, τότε θεωρούμε ότι το funchat έχει εκκινήσει
	// ανεξάρτητα σε δική του σελίδα.

	Arena = (window.opener && window.opener.Arena ? window.opener.Arena : null);

	Funchat.ofelimoDOM = $('#ofelimo');
	Funchat.listaArrayWalk(function() {
		this.funchatCreateDOM();
	});
});

Funchat.isArena = function() {
	return Arena;
};

Funchat.oxiArena = function() {
	return !Funchat.isArena();
};

Funchat.unload = function() {
	if (Funchat.unloaded) return;
	Funchat.unloaded = true;

	if (Funchat.oxiArena())
	return;

	Funchat.diastasiSave();
	Arena.funchat.klisimo();
};

$(window).
on('resize', function() {
	Funchat.diastasiSave();
}).
on('beforeunload', function() {
	Funchat.unload();
}).
on('unload', function() {
	Funchat.unload();
});

Funchat.diastasiSave = function() {
return;
	Client.ajaxService('asdasda').
	done(function(rsp) {
		Client.fyi.pano(rsp);
	}).
	fail(function(err) {
		Client.fyi.epano('asdasd');
	});
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η μεταβλητή "adamo" δείχνει την τρέχουσα ομάδα. Κάθε φορά που συναντούμε
// νέα ομάδα, το πρώτο στοιχείο της ομάδας χρησιμοποιείται ως σημείο εισόδου
// και τα υπόλοιπα τοποθετούνται σε div που περιέχει τα στοιχεία της εκάστοτε
// ομάδας.

Funchat.adamo = null;

Funchat.prototype.funchatCreateDOM = function() {
	var ikona, kimeno, ixos;

	if (this.hasOwnProperty('dom'))
	return this;

	this.dom = $('<div>').addClass('funchatItem').
	data('item', this).
	on('click', function(e) {
		var item, id, sxolio, lezanta;

		e.stopPropagation();
		e.preventDefault();

		if (Funchat.oxiArena())
		return;

		if (Arena.kafenioMode())
		return Client.sound.beep();

		if (Arena.ego.oxiTrapezi())
		return Client.sound.beep();

		item = $(this).data('item');
		if (!item) return;

		id = item.funchatIdGet();
		if (!id) return;

		lezanta = Arena.sizitisi.inputDOM.val().trim();
		Arena.sizitisi.inputDOM.val('');
		sxolio = 'FC^' + id + '^' + lezanta;
		self.opener.Client.skiserService('sizitisiPartida', 'sxolio=' + sxolio.uri());
		Arena.inputRefocus();
		window.open('', 'arena').focus();
	});

	ikona = this.funchatIkona0Get();
	if (!ikona)
	ikona = this.funchatIkona2Get();
	if (!ikona)
	ikona = this.funchatIkonaGet();

	kimeno = this.funchatSxolioGet();

	if (!kimeno)
	kimeno = this.funchatKimenoGet();

	if (kimeno)
	this.dom.attr('title', kimeno);

	if (this.hasOwnProperty('img'))
	$('<img>').addClass('funchatIkona').attr('src', Funchat.server + ikona).appendTo(this.dom);

	// TODO
	// Εδώ θα προστεθεί κώδικας για ομαδοποίηση των στοιχείων.

	this.dom.appendTo(Funchat.ofelimoDOM);

	ixos = this.funchatIxosGet();
	if (!ixos) return this;

	$('<img>').addClass('funchatIxosIcon').attr({
		src: '../ikona/panel/entasi.png',
		title: 'Δοκιμή ηχητικού εφέ',
	}).
	on('click', function(e) {
		var item, pezi, sigasiIcon;

		e.stopPropagation();

		item = $(this).parent().data('item');
		if (!item) return;

		pezi = item.funchatIxosPeziGet();
		if (pezi) {
			item.funchatIxosPeziDelete(pezi);
			$(this).attr({
				src: '../ikona/panel/entasi.png',
				title: 'Δοκιμή ηχητικού εφέ',
			});

			return;
		}

		$(this).attr({
			src: '../ikona/panel/funchat/sigasi.png',
			title: 'Σίγαση δοκιμής ηχητικού εφέ',
		});

		sigasiIcon = $(this);
		pezi = item.funchatIxosPlay({
			callback: function() {
				sigasiIcon.trigger('click');
			},
		});
		item.funchatIxosPeziSet(pezi);
	}).
	appendTo(this.dom);

	return this;
};

Funchat.prototype.funchatIxosPeziSet = function(pezi) {
	this.ixosPezi = pezi;
	return this;
};

Funchat.prototype.funchatIxosPeziGet = function() {
	return this.ixosPezi;
};

Funchat.prototype.funchatIxosPeziDelete = function(pezi) {
	var dom;

	if (pezi === undefined)
	pezi = this.funchatIxosPeziGet();

	delete this.ixosPezi;
	if (!pezi) return this;

	dom = pezi.get(0);
	if (dom) dom.pause();
	pezi.remove();

	return this;
};
