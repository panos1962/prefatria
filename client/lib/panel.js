// Η κλάση "BPanel" απεικοζίζει button panels, όπως είναι το βασικό control panel,
// το πάνελ των emoticons, το control panel των αναζητήσεων, το control panel της
// συζήτησης κλπ. Τα button panels μπορούν να είναι κάθετα ή οριζόντια και περιέχουν
// πλήκτρα που μπορούν να είναι κατανεμημένα σε ομάδες.

BPanel = function(props) {
	Globals.initObject(this, props);

	// Ακολουθεί array με τα πλήκτρα του panel με τη σειρά που
	// αυτά προσετέθησαν στον panel.

	this.button = [];

	// Ακολουθεί λίστα με τα πλήκτρα του panel δεικτοδοτημένη με
	// τα ids των πλήκτρων.

	this.nottub = {};

	// Το property "DOM" περιέχει το DOM element του πάνελ.

	this.DOM = $('<div>').addClass('panel');

	this.omada = 1;
	this.omadaMax = 1;
};

BPanel.prototype.bpanelGetDOM = function() {
	return this.DOM;
};

BPanel.prototype.bpanelIconGetDOM = function() {
	return this.bpanelGetDOM().children('.panelIcon');
};

BPanel.prototype.bpanelVertical = function() {
	this.bpanelGetDOM().addClass('panelV').
	find('.panelButton').addClass('panelButtonV').
	find('.panelIcon').addClass('panelIconV');
	return this;
};

BPanel.prototype.bpanelHorizontal = function() {
	this.bpanelGetDOM().addClass('panelH').
	find('.panelButton').addClass('panelButtonH').
	find('.panelIcon').addClass('panelIconH');
	return this;
};

BPanel.prototype.bpanelSiromeno = function() {
	this.bpanelGetDOM().addClass('panelSiromeno');
	return this;
};

BPanel.prototype.bpanelOmadaSet = function(omada) {
	if (this.bpanelOmadaGet() == omada)
	return this;

	this.omada = omada;
	this.bpanelRefresh();
	return this;
};

BPanel.prototype.bpanelOmadaGet = function() {
	return this.omada;
};

BPanel.prototype.bpanelEpomeniOmada = function() {
	this.omada++;
	if (this.omada > this.omadaMax)
	this.omada = 1;

	this.bpanelRefresh();
	return this;
};

// Με τη μέθοδο "bpanelButtonPush" εισάγουμε πλήκτρα στο πάνελ. Τα πλήκτρα
// εμφανίζονται με τη σειρά που τα εισάγουμε.

BPanel.prototype.bpanelButtonPush = function(button) {
	var id, omada;

	button.pbuttonPanelSet(this);
	this.button.push(button);

	id = button.pbuttonIdGet();
	if (id) this.nottub[id] = button;

	this.bpanelGetDOM().append(button.pbuttonGetDOM());

	omada = button.pbuttonOmadaGet();
	if (omada && (omada > this.omadaMax)) this.omadaMax = omada;

	return this;
};

BPanel.prototype.bpanelButtonWalk = function(callback) {
	Globals.awalk(this.button, function(i, button) {
		callback.call(button);
	});

	return this;
};

BPanel.prototype.bpanelRefresh = function(omada) {
	if (omada) this.omada = omada;
	this.bpanelButtonWalk(function() {
		this.
		pbuttonRefresh().
		pbuttonDisplay();
	});

	return this;
};

BPanel.prototype.bpanelButtonGet = function(id) {
	return this.nottub[id];
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

PButton = function(props) {
	var img, src;

	Globals.initObject(this, props, {
		functions: true,
	});

	this.DOM = $('<div>').addClass('panelButton').
	data('button', this).
	append(img = $('<img>').addClass('panelIcon')).
	on('click', function(e) {
		var button, panel;

		button = $(this).data('button');
		panel = button.pbuttonPanelGet();

		if (typeof panel.clickCommon === 'function')
		panel.clickCommon(e, button);

		if (typeof button.click === 'function')
		button.click.call(button, e);
	});

	if (typeof this.enter === 'function')
	this.DOM.on('mouseenter', function(e) {
		var button;

		button = $(this).data('button');
		button.enter.call(button, e);
	});

	if (typeof this.leave === 'function')
	this.DOM.on('mouseleave', function(e) {
		var button;

		button = $(this).data('button');
		button.leave.call(button, e);
	});

	if (this.hasOwnProperty('title')) this.DOM.attr('title', this.title);

	if (this.hasOwnProperty('img')) {
		src = this.img.match(/[/]/) ? this.img : 'ikona/panel/' + this.img;
		img.attr('src', src);
	}
};

PButton.prototype.pbuttonPanelSet = function(panel) {
	this.panel = panel;
	return this;
};

PButton.prototype.pbuttonPanelGet = function() {
	return this.panel;
};

PButton.prototype.pbuttonIdGet = function() {
	return this.id;
};

PButton.prototype.pbuttonOmadaGet = function() {
	return this.omada;
};

PButton.prototype.pbuttonCheck = function() {
	// Τα πλήκτρα που δεν έχουν καθορισμένη μέθοδο
	// ελέγχου κατάστασης θεωρούνται ενεργά.

	if (!this.hasOwnProperty('check')) return true;

	return this.check.call(this);
};

PButton.prototype.pbuttonIsEnergo = function() {
	var panel, omada;

	panel = this.pbuttonPanelGet();
	if (!panel) return false;

	// Τα πλήκτρα που δεν έχουν καθορισμένη ομάδα εμφανίζονται σε όλες τις ομάδες.

	omada = this.pbuttonOmadaGet();
	if (omada && (omada != panel.bpanelOmadaGet())) return false;

	return this.pbuttonCheck();
};

PButton.prototype.pbuttonGetDOM = function() {
	return this.DOM;
};

PButton.prototype.pbuttonIconGetDOM = function() {
	return this.pbuttonGetDOM().find('.panelIcon');
};

PButton.prototype.pbuttonRefresh = function() {
	if (this.hasOwnProperty('refresh'))
	this.refresh.call(this);

	return this;
};

PButton.prototype.pbuttonDisplay = function() {
	this.pbuttonGetDOM().css('display', this.pbuttonIsEnergo() ? 'inline-block' : 'none');
	return this;
};

PButton.prototype.pbuttonHide = function() {
	this.pbuttonGetDOM().css('display', 'none');
	return this;
};

PButton.prototype.pbuttonShow = function() {
	this.pbuttonGetDOM().css('display', 'inline-block');
	return this;
};

PButton.prototype.pbuttonDexia = function() {
	this.pbuttonGetDOM().addClass('panelButtonDexia');
	return this;
};

PButton.prototype.pbuttonLock = function() {
	var img;

	if (this.lock) return this;
	this.lock = true;

	img = this.pbuttonIconGetDOM();
	if (img) img.working(true);

	return this;
};

PButton.prototype.pbuttonRelease = function() {
	var img;

	delete this.lock;

	img = this.pbuttonIconGetDOM();
	if (img) img.working(false);

	return this;
};

PButton.prototype.pbuttonTitleSet = function(s) {
	this.title = s;
	this.pbuttonGetDOM().attr('title', s);
	return this;
};

PButton.prototype.pbuttonTitleGet = function() {
	return this.title;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@
