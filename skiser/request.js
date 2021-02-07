////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η κλάση "NodeRequest" δέχεται ως παραμέτρους ένα αίτημα και το κανάλι απάντησης και
// δημιουργεί αντικείμενο που περιέχει πολλά βολικά properties και μεθόδους για τους
// μετέπειτα χειρισμούς τού συγκεκριμένου αιτήματος. Το αντικείμενο που δημιουργείται
// ονομάζεται «ενισχυμένο» αίτημα και, εκτός των άλλων, περιέχει το ίδιο το αίτημα
// και το κανάλι απάντησης.

NodeRequest = function(request, response, skiniko) {
	var urlComponents;

	// Αρχικά εντάσσουμε στο ενισχυμένο αίτημα το ίδιο το αίτημα και το κανάλι
	// απάντησης.

	this.request = request;		// το αίτημα
	this.response = response;	// το κανάλι απάντησης
	this.skiniko = skiniko;		// το σκηνικό μας

	// Εντάσσουμε επίσης το IP του αιτούντος client. Αν το αίτημα δρομολογήθηκε
	// μέσω proxy server ιχνηλατούμε το αρχικό IP.

	try {
		this.ip = request.headers['x-forwarded-for']; 
		this.ip = this.ip ? this.ip.split(',')[0] : request.connection.remoteAddress;
		this.ip = this.ip.validIp();
	} catch (e) {
		this.ip = '';
	}

	// Κατόπιν εντάσσουμε δεδομένα που αφορούν στο url του αιτήματος από όπου
	// θα μπορέσουμε να αποσπάσουμε το είδος της ζητούμενης υπηρεσίας και τις
	// παραμέτρους του αιτήματος καθώς τα αιτήματα προς τον Node server γίνονται
	// με την μέθοδο GET και επομένως οι όποιες παράμετροι περνάνε ως παράμετροι
	// του url.

	urlComponents = URL.parse(request.url, true);
	this.service = urlComponents.pathname;
	this.url = urlComponents.query;

	// Οι μέθοδοι που ακολουθούν αφορούν στο header των δεδομένων επιστροφής.
	// Η property "redaeh" περιέχει τον τύπο των δεδομένων και by default
	// τίθεται "text/plain". Επειδή όλα τα δεδομένα επιστροφής υποτίθενται
	// "text/*", χρησιμοποιούμε μόνο το δεύτερο συνθετικό.
	// ΣτΜ: το "redaeh" είναι το αντίστροφο του "header".

	this.redaeh = 'plain';
};

// Η μέθοδος "header" χρησιμοποείται ως πρώτο βήμα στην απάντηση καθορίζοντας
// το είδος των δεδομένων. Η μέθοδος μπορεί να κληθεί κατ' επανάληψη καθώς
// η πραγματική αποστολή θα γίνει σε μεταγενέστερο χρόνο. Αυτό σημαίνει ότι
// μπορούμε να ξεκινήσουμε με έναν προβλεπόμενο τύπο επιστροφής και στην
// πορεία να αναθεωρήσουμε, μέχρι να αποσταλλούν τα πρώτα δεδομένα προς
// το κανάλι απάντησης.

NodeRequest.prototype.header = function(tipos) {
	if (this.redaeh === null)
	Globals.fatal('header data already sent');

	this.redaeh = tipos;
	return this;
};

// Η μέθοδος "headerCheck" καλείται πριν την επιστροφή οποιωνδήποτε δεδομένων
// και σκοπό έχει να στείλει τα header data εφόσον αυτά δεν έχουν ήδη αποσταλεί.
// Η μέθοδος καλείται με το πρώτο write στο κανάλι απάντησης.

NodeRequest.prototype.headerCheck = function() {
	if (this.redaeh === null) return this;

	this.response.writeHead(200, {
		'Access-Control-Allow-Origin': '*',
		'Content-type': 'text/' + this.redaeh + '; charset=utf-8',
	});
	this.redaeh = null;
	return this;
};

NodeRequest.prototype.error = function(msg, code) {
	if (code === undefined) code = 500;
	if (this.redaeh === null)
	Globals.fatal('header data already sent');

	this.response.writeHead(code, {
		'Access-Control-Allow-Origin': '*',
		'Content-type': 'text/plain; charset=utf-8',
	});
	this.redaeh = null;
	if (msg === undefined) msg = 'skiser error';
	this.response.write(msg);
	this.end();
	return this;
};

// Η μέθοδος "write" αποστέλλει τμήμα της απάντησης στον αιτούντα client.
// Η μέθοδος μπορεί να κληθεί επαναληπτικά μέχρι να ολοκληρώσουμε την
// απάντηση. Χωρίς όρισμα (ή με κενό όρισμα), η μέθοδος μπορεί να
// χρησιμοποιηθεί ως flush των header data.

NodeRequest.prototype.write = function(s) {
	this.headerCheck();
	if (s === undefined) return this;
	else if (typeof s === 'number') this.response.write(s.toString());
	else if (typeof s !== 'string') Globals.fatal('response.write: invalid data type');
	else if (s !== '') this.response.write(s);
	return this;
};

// Η μέθοδος "end" ολοκληρώνει την απάντηση προς τον αιτούντα client και
// προαιρετικά μπορεί να δεχθεί και δεδομένα τα οποία αποστέλλει ως coda
// στον client.

NodeRequest.prototype.end = function(s) {
	this.headerCheck();

	if (s === undefined)
	this.response.end();

	else if (typeof s === 'number')
	this.response.end(s.toString());

	else if (typeof s !== 'string')
	Globals.fatal('response.end: invalid data type');

	else if (s !== '')
	this.response.end(s);

	else
	this.response.end();

	return this;
};

// Η μέθοδος "anonimo" ελέχγει την ύπαρξη παραμέτρων "PK" και "KL"
// στο url. Αυτά τα στοιχεία αποτελούν τα διαπιστευτήρια του αιτούντος
// client και αν αυτά δεν υπάρχουν, τότε το αίτημα θεωρείται ανώνυμο.
// Η μέθοδος επιστρέφει true αν το αίτημα είναι ανώνυμο, αλλιώς επιστρέφει
// false και εμπλουτίζεται το ενισχυμένο αίτημα με τις δύο αυτές παραμέτρους.

NodeRequest.prototype.anonimo = function(s) {
	// XXX
	// Για λόγους που δεν γνωρίζω το url property, το οποίο είναι αντικείμενο,
	// παρουσιάζει έλλειψη της μεθόδου "hasOwnProperty". Γι' αυτό το λόγο
	// «δανείζομαι» τη συγκεκριμένη μέθοδο από το Object prototype, επομένως
	// o κώδικας είναι ολισθηρός σε αυτό το σημείο και σε άλλα παρόμοια.

	if (!Object.prototype.hasOwnProperty.call(this.url, 'PK')) {
	//XXX if (!this.url.hasOwnProperty('PK')) {
		this.error(s ? s : 'ακαθόριστος αιτών παίκτης');
		return true;
	}

	if (!Object.prototype.hasOwnProperty.call(this.url, 'KL')) {
	//XXX if (!this.url.hasOwnProperty('KL')) {
		this.error(s ? s : 'ακαθόριστο κλειδί αιτούντος');
		return true;
	}

	// Εφόσον όλα πήγαν καλά, προσθέτουμε στο ενισχυμένο αίτημα τα
	// properties "login" και "klidi".

	this.login = this.url.PK;
	this.klidi = this.url.KL;

	return false;
};

// Η μέθοδος "nosinedria" εξετάζει αν το αίτημα είναι επώνυμο και μάλιστα αν
// υπάρχει συνεδρία στον server για τον εν λόγω παίκτη. Αν το αίτημα είναι
// ανώνυμο ή δεν υπάρχει σχετική συνεδρία επιστρέφει true, αλλιώς επιστρέφει
// false και εμπλουτίζεται το ενισχυμένο αίτημα με τη σχετική συνεδρία.

NodeRequest.prototype.nosinedria = function(s) {
	var skiniko = this.skinikoGet(), trapezi;

	if (this.anonimo(s)) return true;

	this.sinedria = skiniko.skinikoSinedriaGet(this.login);
	if (!this.sinedria) {
		this.error(s ? s : 'ανύπαρκτη συνεδρία αιτούντος');
		console.error(this.login + ': ανύπαρκτη συνεδρία αιτούντος');
		return true;
	}

/*
	if (this.ip != this.sinedria.ip) {
		this.error(s ? s : 'invalid IP address (' + this.ip + ' <> ' + this.sinedria.ip + ')');
		console.error(this.login + ': invalid IP address(' + this.ip + ' <> ' + this.sinedria.ip + ')');
		return true;
	}
*/

	if (this.ip != this.sinedria.ip) {
		console.error(this.login + ': new IP address (' + this.ip + ' <> ' + this.sinedria.ip + ', ' +
			Globals.meraOra() + ')');
		this.sinedria.sinedriaIpSet(this.ip);
	}

	this.pektis = skiniko.skinikoPektisGet(this.login);
	if (!this.pektis) {
		this.error(s ? s : 'ανύπαρκτος αιτών παίκτης');
		console.error(this.login + ': ανύπαρκτος αιτών παίκτης');
		return true;
	}

	// Αν η συνεδρία συνδέεται με κάποιο τραπέζι, θα προσθέσουμε
	// και το τραπέζι ως property του ενισχυμένου αιτήματος.

	trapezi = this.sinedria.sinedriaTrapeziGet();
	if (!trapezi) return false;

	// Η συνεδρία σχετίζεται με κάποιο τραπέζι, επομένως προσπελαύνουμε
	// το τραπέζι και το προσθέτουμε ως property στο ενισχυμένο αίτημα.

	this.trapezi = skiniko.skinikoTrapeziGet(trapezi);
	if (!this.trapezi) {
		this.error(s ? s : 'ανύπαρκτο τραπέζι αιτούντος');
		return true;
	}

	// Καλού κακού κάνουμε και έναν έλεγχο στη θέση.

	if (!this.sinedria.sinedriaThesiGet()) {
		this.error(s ? s : 'απροσδιόριστη θέση αιτούντος');
		return true;
	}

	// Από τη στιγμή που έχουμε συνεδρία που επικοινωνεί με τον skiser και
	// εμπλέκεται με κάποιο τραπέζι, ανανεώνουμε το poll timestamp του εν
	// λόγω τραπεζιού.

	this.trapezi.trapeziPollSet();

	return false;
};

NodeRequest.prototype.skinikoGet = function() {
	return this.skiniko;
};

NodeRequest.prototype.skinikoFetch = function() {
	var skiniko = this.skiniko;
	if (skiniko) return skiniko;
	Globals.fatal('ακαθόριστο σκηνικό αιτήματος');
};

NodeRequest.prototype.loginGet = function() {
	return this.login;
};

NodeRequest.prototype.ipGet = function() {
	return this.ip;
};

NodeRequest.prototype.pektisGet = function() {
	return this.pektis;
};

NodeRequest.prototype.sinedriaGet = function() {
	return this.sinedria;
};

NodeRequest.prototype.trapeziGet = function() {
	return this.trapezi;
};

// Η μέθοδος "isvoli" ελέχγει αν το αίτημα είναι επώνυμο, έχει σχετική συνεδρία
// και αν τα διαπιστευτήρια του αιτούντος client συμπίπτουν με αυτά της σχετικής
// συνεδρίας. Αν όλα αυτά βρεθούν εντάξει επιστρέφεται false, αλλιώς επιστρέφεται
// true.

NodeRequest.prototype.isvoli = function(s) {
	var sinedria;

	if (this.nosinedria(s)) return true;

	sinedria = this.sinedriaGet();
	if (this.klidi !== sinedria.sinedriaKlidiGet()) {
		this.error(s ? s : 'απόπειρα εισβολής');
		return true;
	}

	// Η λίστα "noPoll" περιέχει τα pathnames των αυτοματοποιημένων skiser
	// requests. Αν το αίτημα δεν ανήκει σ' αυτά τα αιτήματα ενημερώνουμε
	// το poll timestamp της συνεδρίας.

	if (Server.noPoll.hasOwnProperty(this.service))
	return false;

	// Το αίτημα δεν ήταν αυτοματοποιημένο, επομένως θεωρούμε ότι η συνεδρία
	// είναι ενεργή και επικοινωνεί με τον skiser στέλνοντας διάφορα αιτήματα.

	sinedria.sinedriaPollSet();

	// Παράλληλα κρατάμε ζωντανό και τον παίκτη, απλώς επιχειρώντας να τον
	// προσπελάσουμε στο σκηνικό.

	Server.skiniko.skinikoPektisGet(this.loginGet());

	return false;
};

NodeRequest.prototype.oxiTrapezi = function(s) {
	if (this.trapeziGet()) return false;

	this.error(s ? s : 'ακαθόριστο τραπέζι αιτούντος');
	return true;
};

NodeRequest.prototype.oxiPektis = function(s) {
	var trapezi;

	if (this.oxiTrapezi(s)) return true;

	trapezi = this.trapeziGet();
	if (trapezi.trapeziThesiPekti(this.loginGet())) return false;

	this.error(s ? s : 'Δεν είστε παίκτης στο τραπέζι');
	return true;
};

NodeRequest.prototype.perastike = function(s) {
	return Object.prototype.hasOwnProperty.call(this.url, s);
	//XXX return this.url.hasOwnProperty(s);
};

NodeRequest.prototype.denPerastike = function(parametros, msg) {
	// Αν έχει περαστεί η συγκεκριμένη παράμετρος είμαστε εντάξει και
	// επιστρέφουμε false χωρίς να προβούμε σε περαιτέρω ενέργειες.

	if (this.perastike(parametros)) return false;

	// Η συγκεκριμένη παράμετρος δεν έχει περαστεί. Σ' αυτή την περίπτωση
	// λειτουργούμε ανάλογα με την τιμή της δεύτερης παραμέτρου.

	// Αν δεν έχει περαστεί δεύτερη παράμετρος, τότε απλώς επιστρέφουμε true
	// χωρίς να στείλουμε κάποια απάντηση στον client και χωρίς να πειράξουμε
	// το αίτημα καθ' οιονδήποτε τρόπο.

	if (msg === undefined ) return true;

	// Αν η δεύτερη παράμετρος φέρει την τιμή true, τότε επιστρέφουμε στον
	// client γενικό μήνυμα λάθους και κλείνουμε το request επιστρέφοντας true.

	if (msg === true) {
		this.error('Δεν περάστηκε παράμετρος "' + parametros + '"');
		return true;
	}

	// Επιστρέφουμε στον client την δεύτερη παράμετρο ως μήνυμα λάθους και
	// κλείνουμε το request επιστρέφοντας true.

	this.error(msg);
	return true;
};

NodeRequest.prototype.urlGet = function(s) {
	return this.url[s];
};
