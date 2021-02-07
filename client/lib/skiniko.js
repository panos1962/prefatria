Dilosi.prototype.dilosiDOM = function(idos) {
	var dom;

	if (idos === undefined) idos = 'Dilosi';
	dom = $('<div>').addClass('tsoxa' + idos);

	if (this.dilosiIsPaso()) {
		dom.text('ΠΑΣΟ');
		return dom;
	}

	if (this.dilosiIsTagrafo()) {
		dom.text('Άμα μείνουν');
		return dom;
	}
	
	if (this.dilosiIsExo()) dom.append($('<div>').addClass('tsoxa' + idos + 'Exo').text('Έχω'));
	dom.append($('<div>').addClass('tsoxa' + idos + 'Bazes').text(this.dilosiBazesGet()));
	dom.append($('<img>').addClass('tsoxa' + idos + 'Xroma').attr({
		src: Client.server + 'ikona/trapoula/xroma' + this.dilosiXromaGet() + '.png',
	}));

	if (this.dilosiIsAsoi())
	dom.
	append($('<div>').addClass('tsoxaDilosiAsoi').
	append($('<img>').addClass('tsoxaDilosiAsoiIcon').attr({
		src: Client.server + 'ikona/panel/asoiOn.png',
	})));

	return dom;
};
