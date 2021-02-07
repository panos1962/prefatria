Globals = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "walk" διατρέχει όλα τα στοιχεία μιας λίστας και για κάθε στοιχείο
// καλεί κάποια function με παραμέτρους το ανά χείρας κλειδί και το αντίστοιχο
// στοιχείο της λίστας. Η μέθοδος επιστρέφει το πλήθος των στοιχείων της λίστας.

Globals.walk = function(list, callback) {
	var count = 0, i;

	for (i in list) {
		count++;
		if (callback) callback(i, list[i]);
	}

	return count;
};

// Η function "awalk" διατρέχει όλα τα στοιχεία ενός array και για κάθε στοιχείο
// καλεί κάποια function με παραμέτρους το ανά χείρας κλειδί και το αντίστοιχο
// στοιχείο του array. Η μέθοδος επιστρέφει το πλήθος των στοιχείων του array.
// Η διαφορά της με την "walk" είναι ότι διατρέχει τα στοιχεία του array με
// τη σειρά.

Globals.awalk = function(list, callback) {
	var i;

	for (i = 0; i < list.length; i++) {
		if (callback) callback(i, list[i]);
	}

	return list.length;
};

Globals.fatal = function(msg) {
	try {
		Client.provlimaDialogos(msg);
	} finally {
		throw msg;
	}
};

// Η μέθοδος "sportCheck" ελέγχει την ορθότητα της πόρτας του server σκηνικού.
// Πρόκειται για την πόρτα στην οποία ακούει ο server σκηνικού και πρέπει να
// είναι ένα ακέραιο νούμερο πόρτας που δεν χρησιμοποιείται από άλλη δικτυακή
// διαδικασία, π.χ. 12666.

Globals.sportCheck = function() {
	if (!Globals.hasOwnProperty('sport')) Globals.sport = null;
	else if (Globals.sport === undefined) Globals.sport = null;
	if (Globals.sport === null) Globals.fatal('skiser port udefined');

	if (parseInt(Globals.sport) != Globals.sport) Globals.fatal(Globals.sport + ': invalid skiser port');
	Globals.sport = parseInt(Globals.sport);
	if (Globals.sport < 1000) Globals.fatal(Globals.sport + ': invalid skiser port number');
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Ακολουθούν functions σχετικές με ημερομηνία και ώρα.

// Η function "torams" επιστρέφει το τρέχον timestamp σε milliseconds,
// με όρους της μηχανής στην οποία εκτελείται.

Globals.torams = function() {
	return (new Date).getTime();
};

// Η function "tora" επιστρέφει το τρέχον timestamp σε seconds,
// με όρους της μηχανής στην οποία εκτελείται.

Globals.tora = function() {
	return Math.floor((new Date).getTime() / 1000);
};

// Η function "toramsServer" επιστρέφει το τρέχον timestamp
// σε milliseconds, με όρους του server. Η διαφορά ώρας μεταξύ
// server και client δίνεται στην property "timeDif" και είναι
// σε seconds.

Globals.toramsServer = function() {
	return Globals.torams() + (Client ? Client.timeDif * 1000 : 0);
};

// Η function "toraServer" επιστρέφει το τρέχον timestamp
// σε seconds, με όρους του server.

Globals.toraServer = function() {
	return Globals.tora() + (Client ? Client.timeDif : 0);
};

// Η function "pote" δέχεται ένα timestamp και εμφανίζει το χρονικό διάστημα
// μέχρι την τρέχουσα χρονική στιγμή σε πιο ανθρώπινη μορφή. Το τρέχον timestamp
// λογίζεται με όρους της μηχανής στην οποία εκτελείται.

Globals.pote = function(ts) {
	var tora, dif, x, msg;

	tora = Globals.tora();
	dif = tora - ts;
	if (dif < 60) return 'τώρα';

	if (dif < 3600) {
		x = parseInt(dif / 60);
		return(isNaN(x) ? '' : 'πριν ' + x + ' λεπτ' + (x < 2 ? 'ό' : 'ά'));
	}

	if (dif < 86400) {
		x = parseInt(dif / 3600);
		if (isNaN(x)) return '';

		msg = 'πριν ' + x + ' ώρ' + (x < 2 ? 'α' : 'ες');
		dif -= (x * 3600);
		x = parseInt(dif / 60);
		return (isNaN(x) ? msg : msg + ' και ' + x + ' λεπτ' + (x < 2 ? 'ό' : 'ά'));
	}
	
	// Μετατρέπουμε το timestamp σε αντικείμενο ημερομηνίας, προκειμένου
	// να εκτυπώσουμε την ημερομηνία σε μορφή "dd/mm/yyyy".

	ts = new Date(ts * 1000);
	return Globals.mera(ts) + ', ' + Globals.ora(ts);
};

// Η function "poteOra" είναι παρόμοια με την "pote" καθώς τυπώνει την ώρα για
// το τρέχον 24ωρο, ενώ για παλαιότερες χρονικές στιγμές τυπώνει και την ημέρα.

Globals.poteOra = function(pote, full) {
	var tora, toraMera, toraMinas, toraEtos, poteMera, poteMinas, poteEtos;

	tora = new Date(full ? 0 : Globals.torams());
	toraMera = tora.getDate();
	toraMinas = tora.getMonth();
	toraEtos = tora.getFullYear();

	pote = new Date(pote * 1000);
	poteMera = pote.getDate();
	poteMinas = pote.getMonth();
	poteEtos = pote.getFullYear();

	return((poteEtos === toraEtos) && (poteMinas === toraMinas) && (poteMera === toraMera) ?
		Globals.ora(pote) : Globals.mera(pote, full) + ', ' + Globals.ora(pote, full));
};

// Η function "mera" δίνει την τρέχουσα ημερομηνία στη μηχανή που τρέχει.
// Μπορούμε να δώσουμε και συγκεκριμένη ώρα ως παράμετρο.

Globals.mera = function(d, full) {
	var s, x;

	if (!d) d = new Date;
	else if (typeof d === 'number') d = new Date(d * 1000);

	s = '';

	x = d.getDate();
	if (x < 10) s += '0';
	s += x;
	s += '/';

	x = d.getMonth() + 1;
	if (x < 10) s += '0';
	s += x;
	s += '/'; 

	x = d.getFullYear();
	if (full || (x < 2000)) s += x;
	else {
		x %= 100;
		if (x < 10) s += '0';
		s += x;
	}

	return s;
};

// Η function "ora" δίνει την τρέχουσα ώρα στη μηχανή που τρέχει.
// Μπορούμε να δώσουμε και συγκεκριμένη ώρα ως παράμετρο.

Globals.ora = function(d, seconds) {
	var s, x;

	if (!d) d = new Date;
	else if (typeof d === 'number') d = new Date(d * 1000);

	s = '';

	x = d.getHours();
	if (x < 10) s += '0';
	s += x + ':';

	x = d.getMinutes();
	if (x < 10) s += '0';
	s += x;

	if (seconds === undefined)
	seconds = false;

	if (seconds) {
		s += ':';
		x = d.getSeconds();
		if (x < 10) s += '0';
		s += x;
	}

	return s;
};

Globals.meraOra = function(seconds) {
	var tora = new Date;

	return Globals.mera(tora) + ', ' + Globals.ora(tora, seconds);
};

Globals.consoleLog = function(msg) {
	console.log(msg, '(' + Globals.meraOra(true) + ')');
};

Globals.consoleError = function(msg) {
	console.error(msg, '(' + Globals.meraOra(true) + ')');
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, '');
};

String.prototype.ltrim = function() {
	return this.replace(/^\s+/, '');
};

String.prototype.rtrim = function() {
	return this.replace(/\s+$/, '');
};

String.prototype.isNai = function() {
	return(this.valueOf() === 'ΝΑΙ');
};

String.prototype.isOxi = function() {
	return !this.isNai();
};

String.prototype.evalAsfales = function() {
	eval('var x = ' + this.valueOf() + ';');
	return x;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η κλήση που ακολουθεί εξυπηρετεί στη λειτουργία άλλων μεθόδων.

;(function() {
	var ipOctet = '(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])';

	Globals.loginRE = new RegExp('^[a-zA-Z][a-zA-Z0-9_!@#=.:+-]*$');
	Globals.emailRE = new RegExp('^[a-zA-Z0-9_\.-]+\@([a-zA-Z0-9-]+\\.)+([a-zA-Z0-9]{2,4})+$');

	Globals.ipRE = new RegExp('^(?:' + ipOctet + '\\.){3}' + ipOctet + '$');
	Globals.ipv4mappedRE = new RegExp('^::[fF]{4}:(?:' + ipOctet + '\\.){3}' + ipOctet + '$');
})();

// Η μέθοδος "validIp" ελέγχει ένα string ως προς το εαν είναι
// είναι δεκτό IP. Αν ναι το επιστρέφει, αλλιώς επιστρέφει κενό
// string.

// XXX
// Μην διώξετε το valueOf() στις επιστροφές. Φαίνεται να δημιουργεί πρόβλημα
// στο "sinedria.ip.json()" και δεν το έχω ψάξει για να ξέρω πού ακριβώς
// οφείλεται.

String.prototype.validIp = function() {
	if (this.match(Globals.ipv4mappedRE))
	return this.substr(7).valueOf();

	if (this.match(Globals.ipRE))
	return this.valueOf();

	return '';
};

// Η μέθοδος "validEmail" ελέγχει ένα string ως email address. Αν
// είναι δεκτό το επιστρέφει, αλλιώς επιστρέφει κενό string.

String.prototype.validEmail = function() {
	return this.match(Globals.emailRE) ? this : '';
};

// Η μέθοδος "validLogin" ελέγχει ένα string ως login name. Αν
// είναι δεκτό το επιστρέφει, αλλιώς επιστρέφει κενό string.

String.prototype.validLogin = function() {
	return this.match(Globals.loginRE) ? this : '';
};

// Η μέθοδος "json" επιστρέφει json safe μορφή του ανά χείρας string.

String.prototype.json = function(nl) {
	return Globals.json(this.valueOf(), nl);
};

// Η μέθοδος "uri το μετατρέπει ένα string σε μορφή ασφαλή
// ώστε να χρησιμοποιηθεί ως URI component.

String.prototype.uri = function() {
	return encodeURIComponent(this);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "json" δέχεται μια παράμετρο και την μετατρέπει σε
// μορφή ασφαλή ώστε να χρησιμοποιηθεί ως rvalue σε δομές json.
// Η function δεν δίδεται ως string method ώστε να δύναται να
// χρησιμοποιηθεί σε οποιαδήποτε μεταβλητή και όχι μόνο σε strings.
//
// Μπορούμε να περάσουμε και δεύτερη παράμετρο με την οποία λέμε
// αν θέλουμε αντικατάσταση των control χαρακτήρων μέσα στα strings.
// Control χαρακτήρες είναι τα newlines, τα carriage returns, τα
// tabs κλπ. By default αυτή η παράμετρος λογίζεται true, επομένως
// όταν δεν θέλουμε αντικατάσταση των control χαρακτήρων, περνάμε
// παράμετρο με τιμή false.

Globals.json = function(s, nl) {
	var err = false, x;

	if (s === undefined) err = 'undefined data';
	else if (s === null) err = 'null data';
	else {
		switch (typeof s)  {
		case 'number':
			return s;
		case 'string':
			x = s.replace(/\\/g, '\\\\');
			if (nl === undefined) nl = true;
			if (nl) x = x.replace(/[\n\r\f\v\b\t]/g, ' ');
			return "'" + x.replace(/'/g, '\\\'') + "'";
		default:
			err = s + ': invalid data type';
			break;
		}
	}

	Globals.fatal('Globals.json: ' + err);
};

// Η μέθοδος "random" επιστρέφει έναν τυχαίο ακέραιο μεταξύ των τιμών που δίνονται
// ως παράμετροι (inclusive). Π.χ. η κλήση Globals.random(5, 10) μπορεί να δώσει 5,
// 6, 7, 8, 9 και 10.

Globals.random = function(min, max) {
	switch (arguments.length) {
	case 0:
		min = 0;
		max = 999999999;
		break;
	case 1:
		max = min;
		min = 0;
		break;
	}

	return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Η μέθοδος "randomString" επιστρέφει ένα τυχαίο string με μήκος που καθορίζεται
// από τις παραμέτρους. Το string αποτελείται από γράμματα του λατινικού αλφαβήτου,
// αλλά αν θέλουμε μπορούμε να περάσουμε αυθαίρετο string από το οποίο θα επιλεγούν
// χαρακτήρες.

Globals.randomString = function(min, max, pool) {
	if (pool === undefined) pool = 'abcdefghijklmnopqrstuvwxyz';
	var ret = '';
	max = Globals.random(min, max);
	for (min = 0; min < max; min++) ret += pool.substr(Globals.random(pool.length - 1), 1);
	return ret;
};

// Η function "initObj" χρησιμοποιείται συνήθως στην αρχικοποίηση αντικειμένων.
// Δέχεται ένα αντικείμενο και μια λίστα και θέτει τα στοιχεία τής λίστας ως
// properties του αντικειμένου. Αν το αντικείμενο είχε κάποια properties πριν
// την εφαρμογή τής μεθόδου, αυτά τα properties διατηρούνται. By default τα
// properties τύπου function δεν αντιγράφονται, μπορούμε όμως να αντιγράψουμε
// και αυτά δίνοντας κατάλληλες options στην τρίτη παράμετρο.

Globals.initObject = function(obj, props, opt) {
	var i;

	if (opt === undefined) opt = {
		functions: false,
		recursive: true,
	};

	for (i in props) {
		if (props[i] === null) obj[i] = null;
		else if (typeof props[i] === 'function') {
			if (opt.functions) obj[i] = props[i];
		}
		else if (typeof props[i] !== 'object') obj[i] = props[i];
		else if (opt.recursive) {
			if (props[i] instanceof Array) obj[i] = Globals.initObject([], props[i]);
			else obj[i] = Globals.initObject({}, props[i]);
		}
		else obj[i] = props[i];
	}

	return obj;
};

Globals.date = {
	dayNames: [
		'Κυριακή',
		'Δευτέρα',
		'Τρίτη',
		'Τετάρτη',
		'Πέμπτη',
		'Παρασκευή',
		'Σάββατο',
	],
	dayNamesMin: [
		'ΚΥ',
		'ΔΕ',
		'ΤΡ',
		'ΤΕ',
		'ΠΕ',
		'ΠΑ',
		'ΣΑ',
	],
	dayNamesShort: [
		'Κυρ',
		'Δευ',
		'Τρί',
		'Τετ',
		'Πέμ',
		'Πα',
		'Σαβ',
	],
	monthNames: [
		'Ιανουάριος',
		'Φεβρουάριος',
		'Μάρτιος',
		'Απρίλιος',
		'Μάιος',
		'Ιούνιος',
		'Ιούλιος',
		'Αύγουστος',
		'Σεπτέμβριος',
		'Οκτώβριος',
		'Νοέμβριος',
		'Δεκέμβριος',
	],
	monthNamesShort: [
		'Ιαν',
		'Φεβ',
		'Μάρ',
		'Απρ',
		'Μάι',
		'Ιον',
		'Ιολ',
		'Αύγ',
		'Σεπ',
		'Οκτ',
		'Νοέ',
		'Δεκ',
	],
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Debug = {
	flags: {},
};

Debug.flagSet = function(flag, val) {
	if (val === undefined) val = true;
	Debug.flags[flag] = val;
};

Debug.flagGet = function(flag) {
	return Debug.flags[flag];
};

Debug.flagSet('epomenosCheck');
Debug.flagSet('agoraEpomenosCheck');
