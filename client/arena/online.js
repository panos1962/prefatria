Trapezi.prototype.processEnergiaOnlineΣΟΛΟ = function(energia) {
	Arena.partida.
	trapeziRefreshDOM().
	enimerosiRefreshDOM().
	tsoxaDOM.append(Arena.partida.soloEndixiDOM = $('<img>').attr({
		src: Client.server + 'ikona/endixi/solo.png',
		title: 'Ο τζογαδόρος έγραψε σόλο μέσα την αγορά',
	}).css({
		position: 'absolute',
		left: '250px',
		top: '150px',
		width: '100px',
	}).finish().animate({
		left: '200px',
		width: '200px',
		top: '130px',
	}, 1000, 'easeOutBounce'));

	Client.sound.kanonia();
	return this;
};

Trapezi.prototype.processEnergiaOnlineΠΑΡΑΙΤΗΣΗ = function(energia) {
	Arena.partida.trapeziRefreshDOM();
	this.processEnergiaOnlineFiloKrotos();
	return this;
};

Trapezi.prototype.processEnergiaOnlineΑΓΟΡΑ = function() {
	var tzogadoros, iseht;

	// Εμφανίζουμε το τραπέζι μετά την ένταξη και επεξεργασία της
	// ανά χείρας ενέργειας δήλωσης τελικού συμβολαίου.

	Arena.partida.trapeziRefreshDOM();

	// Κάνουμε εμφανές στους παίκτες και στους θεατές του τραπεζιού
	// το τελικό συμβόλαιο, εμφανίζοντας ειδική σήμανση στην περιοχή
	// του τζογαδόρου.

	tzogadoros = Arena.ego.trapezi.partidaTzogadorosGet();
	iseht = Arena.ego.thesiMap(tzogadoros);

	// Εντοπίζουμε το DOM element της δήλωσης του τελικού συμβολαίου
	// και εμφανίζουμε αριστερά βελάκι που δείχνει την αγορά.

	Arena.partida['pektisAgora' + iseht + 'DOM'].
	find('.tsoxaPektisAgoraDilosi').
	append($('<img>').attr({
		id: 'tsoxaPektisAgoraDixe',
		src: 'ikona/endixi/that.gif',
	}).
	addClass('tsoxaPektisIcon').delay(3000).fadeOut(400, function() {
		$(this).remove();
	}));

	// Οι αμυνόμενοι θα ακούσουν και ηχητικό σήμα. Αν είμαστε θεατές
	// δεν θα γίνει καμία περαιτέρω ενέργεια.

	if (Arena.ego.oxiPektis())
	return this;

	// Ο τζογαδόρος δεν χρειάζεται να ακούσει ηχητικό σήμα.

	if (Arena.ego.isThesi(tzogadoros))
	return this;

	// Είμαστε αμυνόμενοι, επομένως θα ακουστεί διακριτικό ηχητικό σήμα
	// που «σημαίνει» ότι έγινε αποφώνηση του τελικού συμβολαίου.

	Client.sound.handbell();
	return this;
};

Trapezi.prototype.processEnergiaOnlineΣΥΜΜΕΤΟΧΗ = function(energia) {
	// Εμφανίζουμε το τραπέζι μετά την ένταξη και επεξεργασία της
	// ανά χείρας συμετοχής.

	Arena.partida.trapeziRefreshDOM();

	// Αν δεν είμαστε παίκτες, δεν χρειάζονται περαιτέρω ενέργειες.

	if (Arena.ego.oxiPektis())
	return this;

	// Αν η ανά χείρας συμμετοχή είναι "ΜΑΖΙ", τότε πρέπει αυτό να
	// γίνει αισθητό στους παίκτες του τραπεζιού.

	if (energia.energiaDataGet().simetoxiIsMazi())
	Client.sound.bikebell();

	// Ελέγχουμε αν μετά την ανά χείρας συμμετοχή το παιχνίδι έχει
	// περάσει σε φάση παιχνιδιού.

	switch (this.partidaFasiGet()) {

	// Ένας, ή και οι δυο αμυνόμενοι έπαιξαν, επομένως πρέπει να
	// ξανασχηματίσουμε το control panel, π.χ. ο τζογαδόρος πρέπει
	// να έχει δυνατότητα claim.

	case 'ΠΑΙΧΝΙΔΙ':
		Arena.panelRefresh();
		break;
	}

	return this;
};

Trapezi.prototype.processEnergiaOnlineΦΥΛΛΟ = function(energia) {
	// Ελέγχουμε μήπως μόλις έκλεισε μπάζα και αν με αυτήν την μπάζα
	// κάποιος μπαίνει μέσα, απλά, σόλο, ή τρίσολο, ώστε να ηχήσουν
	// οι ανάλογοι κρότοι.

	this.processEnergiaOnlineFiloKrotos();

	// Αν είμαι θεατής απλώς δείχνω το φύλλο να κινείται προς το κέντρο
	// και εφόσον έκλεισε μπάζα δείχνω και την μπάζα να κινείται προς
	// το μέρος του παίκτη που κερδίζει την μπάζα.

	if (Arena.ego.isTheatis())
	return this.processEnergiaOnlineFiloKinisi(energia);

	// Αν το φύλλο δεν είναι δικό μας, αλλά παίχτηκε από κάποιον άλλον,
	// πάλι δείχνω τις ίδιες κινήσεις.

	if (Arena.ego.oxiThesi(energia.energiaPektisGet()))
	return this.processEnergiaOnlineFiloKinisi(energia);

	switch (Arena.partida.klikFilo) {

	// Είμαστε στην περίπτωση που παραλαμβάνει την ενέργεια ο παίκτης
	// που έπαιξε το φύλλο. Αν είμαστε ακόμη σε κατάσταση 1 σημαίνει
	// ότι το φύλλο που έπαιξε ο παίκτης ακόμη κινείται προς το κέντρο,
	// οπότε αλλάζω κατάσταση σε 3 και δεν κάνω τίποτε άλλο, καθώς η
	// τρέχουσα κατάσταση και τυχόν κίνηση μπάζας θα εμφανιστεί μόλις
	// περατωθεί η κίνηση του φύλλου προς το κέντρο.

	case 1:
		Arena.partida.klikFilo = 3;
		break;

	// Παραλαμβάνω την ενέργεια αφού η κίνηση του φύλλου προς το κέντρο
	// έχει περατωθεί. Σ' αυτή την περίπτωση καθαρίζω την κατάσταση και
	// δείχνω πώς έχουν αυτή τη στιγμή τα πράγματα στο τραπέζι, ενώ κινώ
	// τυχόν μπάζα προς τον παίκτη που την κερδίζει.

	default:
		delete Arena.partida.klikFilo;
		Arena.partida.trapeziRefreshDOM();
		Arena.partida.kinisiBaza();
		break;
	}

	return this;
};

Trapezi.prototype.processEnergiaOnlineFiloKinisi = function(energia) {
	var pektis, filo, filoDom, fila, i, olif, css = {};

	pektis = energia.energiaPektisGet();
	filo = energia.energiaDataGet().string2filo();
	filoDom = null;
	fila = $('.tsoxaXartosiaFilo');

	for (i = 0; i < fila.length; i++) {
		olif = $(fila[i]).data('filo');

		// Αν δεν υπάρχουν δεδομένα φύλλου, τότε κάτι δεν πάει
		// καλά, οπότε απλώς επιστρέφουμε.

		if (!olif)
		return this;

		if (filo.filoOxiFilo(olif))
		continue;

		if ($(fila[i]).offset().top)
		filoDom = $(fila[i]);

		break;
	}

	if (!filoDom) {
		css = {position: 'absolute'};
		switch (Arena.ego.thesiMap(pektis)) {
		case 3:
			css.left = '90px';
			css.top = '40px';
			css.width = '60px';
			break;
		case 2:
			css.left = '400px';
			css.top = '40px';
			css.width = '60px';
			break;
		default:
			css.left = '340px';
			css.top = '360px';
			css.width = '80px';
			break;
		}

		filoDom = $('<img>').addClass('tsoxaBazaFiloProxiro').css(css).attr({
			src: 'ikona/trapoula/' + filo.filoXromaGet() + filo.filoAxiaGet() + '.png',
		}).appendTo(Arena.partida.tsoxaDOM);
	}

	Arena.partida.kinisiFilo({
		pektis: pektis,
		filoDOM: filoDom,
		callback: function() {
			Arena.partida.trapeziRefreshDOM();
			Arena.partida.kinisiBaza();
		},
	});

	return this;
};

Trapezi.prototype.processEnergiaOnlineFiloKrotos = function() {
	var tzogadoros, protos, defteros;

	// Αν δεν υπάρχει τζογαδόρος σημαίνει ότι στο τραπέζι παίζεται το
	// πάσο και στη συγκεκριμένη διανομή όλοι οι παίκτες δήλωσαν πάσο,
	// οπότε δεν θα παραχθούν κρότοι.

	tzogadoros = this.partidaTzogadorosGet();
	if (!tzogadoros) return this;

	// Ελέγχουμε αν με το φύλλο που παίχτηκε έκλεισε μπάζα.

	if (this.bazaFila.length > 0) return this;

	// Με το φύλλο που παίχτηκε έκλεισε μπάζα. Χρειαζόμαστε
	// δομή στην οποία θα κρατήσουμε τους κρότους ώστε να μην
	// τους επαναλαμβάνουμε.

	if (!this.hasOwnProperty('krotos'))
	this.krotos = {};

	protos = tzogadoros.epomeniThesi();
	defteros = protos.epomeniThesi();

	if (this.sdilosi[protos].simetoxiIsPaso())
	return this.processEnergiaOnlineFiloKrotosEnas(tzogadoros, defteros);

	if (this.sdilosi[defteros].simetoxiIsPaso())
	return this.processEnergiaOnlineFiloKrotosEnas(tzogadoros, protos);

	this.processEnergiaOnlineFiloKrotosOloi(tzogadoros, protos, defteros);
	return this;
};

Trapezi.prototype.processEnergiaOnlineFiloKrotosEnas = function(tzogadoros, aminomenos) {
	var prepiTzogadoros, bazesTzogadoros, prepiAminomenos, bazesAminomenos,
		diathesimes;

	prepiTzogadoros = this.agora.dilosiBazesGet();
	bazesTzogadoros = this.partidaBazesGet(tzogadoros);

	switch (prepiTzogadoros) {
	case 6:
	case 7:
		prepiAminomenos = 2;
		break;
	case 8:
	case 9:
		prepiAminomenos = 1;
		break;
	default:
		prepiAminomenos = 0;
		break;
	}
	bazesAminomenos = this.partidaBazesGet(aminomenos);

	diathesimes = 10 - bazesTzogadoros - bazesAminomenos;

	dif = bazesTzogadoros + diathesimes - prepiTzogadoros;
	if (dif < -3) return this;
	if (dif !== this.krotos[tzogadoros]) {
		this.krotos[tzogadoros] = dif;
		switch (dif) {
		case -3:
			Client.sound.tzamia();
			return this;
		case -2:
			Client.sound.kanonia();
			return this;
		case -1:
			Client.sound.kanonia();
			return this;
		}
	}

	dif = bazesAminomenos + diathesimes - prepiAminomenos;
	if (dif < -3) return this;
	if (dif === this.krotos[aminomenos]) return this;

	this.krotos[aminomenos] = dif;
	switch (dif) {
	case -3:
		Client.sound.tzamia();
		return this;
	case -2:
		Client.sound.machineGun();
		Client.sound.polivolo();
		return this;
	case -1:
		Client.sound.balothia();
		return this;
	}

	return this;
};

Trapezi.prototype.processEnergiaOnlineFiloKrotosOloi = function(tzogadoros, protos, defteros) {
	var prepiTzogadoros, bazesTzogadoros, prepiAmina, bazesAmina,
		diathesimes;

	prepiTzogadoros = this.agora.dilosiBazesGet();
	bazesTzogadoros = this.partidaBazesGet(tzogadoros);

	prepiAmina = 10 - prepiTzogadoros;
	bazesAmina = this.partidaBazesGet(protos) + this.partidaBazesGet(defteros);

	diathesimes = 10 - bazesTzogadoros - bazesAmina;

	dif = bazesTzogadoros + diathesimes - prepiTzogadoros;
	if (dif < -3) return this;
	if (dif !== this.krotos[tzogadoros]) {
		this.krotos[tzogadoros] = dif;
		switch (dif) {
		case -3:
			Client.sound.tzamia();
			return this;
		case -2:
			Client.sound.kanonia();
			return this;
		case -1:
			Client.sound.kanonia();
			return this;
		}
	}

	dif = bazesAmina + diathesimes - prepiAmina;
	if (dif < -4) return this;

	// Επειδή οι κρότοι των αμυνομένων αφορούν και τους δύο
	// αμυνόμενους χρησιμοποιούμε μηδενικό δείκτη.

	if (dif === this.krotos[0]) return this;

	this.krotos[0] = dif;
	switch (dif) {
	case -4:
		Client.sound.tzamia();
		return this;
	case -3:
		Client.sound.machineGun();
		Client.sound.polivolo();
		return this;
	case -2:
	case -1:
		Client.sound.balothia();
		return this;
	}

	return this;
};

// Η ενέργεια τύπου "ΔΗΛΩΣΗ" δεν είναι απαραίτητο να έχει online διαδικασία, αλλά
// παρασύρεται από την ενέργεια τύπου "FLOP" στην οποία είναι ωραίο να βγάζουμε
// κάποιους ήχους όταν ο τζόγος είναι ιδιαίτερος. Πράγματι, η τελευταία δήλωση
// πάσο στην πλειοδοσία της αγοράς, σε παρτίδες χωρίς πάσο, συμπαρασύρει και
// ενέργεια τύπου "FLOP" με το άνοιγμα του τζόγου.

Trapezi.prototype.processEnergiaOnlineΔΗΛΩΣΗ = function(energia) {
	Arena.partida.trapeziRefreshDOM();
	Arena.cpanel.bpanelButtonGet('akirosi').pbuttonDisplay();
	return this;
};

Trapezi.prototype.processEnergiaOnlineFLOP = function(energia) {
	var data;

	Arena.partida.trapeziRefreshDOM();
	data = energia.energiaDataGet();
	if (!data) return this;

	// Αν έχουμε δύο άσους στα φύλλα του τζόγου κάνουμε ιδιαίτερο
	// ήχο cartoon.

	if (data.match(/^.A.A/)) {
		Client.sound.play('daiaiaing.ogg');
		return this;
	}

	// Αν έχουμε άσο και ρήγα ιδίου χρώματος στα φύλλα του τζόγου
	// κάνουμε ιδιαίτερο ήχο cartoon.

	if ((data.substr(0, 1) === data.substr(2, 1)) && data.match(/A/) && data.match(/K/)) {
		Client.sound.play('daiaiaing.ogg');
		return this;
	}

	// Αν έχουμε έναν άσο στον τζόγο, κάνουμε κάποιον άλλον τυχαίο
	// ήχο cartoon.

	if (data.match(/A/)) {
		Client.sound.opa();
		return this;
	}

	return this;
};
