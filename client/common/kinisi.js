///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// PK -- Νέος παίκτης
//
// Δεδομένα
//
//	pektis		Περιέχει τα στοιχεία παίκτη.

Skiniko.prototype.processKinisiPK = function(data) {
	this.skinikoPektisSet(new Pektis(data));
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SN -- Νέα συνεδρία
//
// Με την κίνηση νέας συνεδρία κάνουμε γνωστό στο σκηνικό ότι δημιουργήθηκε νέα
// συνεδρία, δηλαδή ότι κάποιος εισήλθε (ή επανεισήλθε) στο καφενείο.
//
// Δεδομένα
//
//	sinedria	Περιέχει τα στοιχεία της συνεδρίας.
//
// Προαιρετικά δεδομένα
//
//	pektis		Περιέχει τα στοιχεία του παίκτη της συνεδρίας και παρέχεται
//			συνήθως όταν ο παίκτης δεν υπάρχει στο σκηνικό.

Skiniko.prototype.processKinisiSN = function(data) {
	if (data.hasOwnProperty('pektis'))
	this.skinikoPektisSet(new Pektis(data.pektis));

	this.skinikoSinedriaSet(new Sinedria(data.sinedria));
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// NS -- Διαγραφή συνεδρίας
//
// Με την κίνηση διαγραφής συνεδρία κάνουμε γνωστό στο σκηνικό ότι κάποια συνεδρία
// έχει λήξει, δηλαδή ότι κάποιος εξήλθε από το καφενείο, ή το πρόγραμμα τον απόδιωξε
// ως ανενεργό.
//
// Δεδομένα
//
//	login	Το login name του παίκτη της συνεδρίας.

Skiniko.prototype.processKinisiNS = function(data) {
	this.skinikoSinedriaDelete(data.login);
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SL -- Χαιρετισμός κατά την είσοδο/επανείσοδο συνεδρίας
//
// Αμέσως μετά την είσοδο του παίκτη, ή την επώνυμη επαναφόρτωση του καφενείου λαμβάνει
// χώρα χαιρετισμός.
//
// Δεδομένα
//
//	login	Το login name του παίκτη της συνεδρίας.

Skiniko.prototype.processKinisiSL = function(data) {
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// TR -- Νέο τραπέζι
//
// Με την κίνηση νέου τραπεζιού κάνουμε γνωστό στο σκηνικό ότι δημιουργήθηκε νέο
// τραπέζι.
//
// Δεδομένα
//
//	trapezi		Περιέχει τα στοιχεία του τραπεζιού.

Skiniko.prototype.processKinisiTR = function(data) {
	var trapezi, pektis, sinedria;

	// Εντάσσουμε το τραπέζι στο σκηνικό.

	trapezi = new Trapezi(data.trapezi);
	trapezi.trapeziStisimoSet();
	this.skinikoTrapeziSet(trapezi);

	// Στην πρώτη θέση πρέπει να υπάρχει ο δημιουργός.

	pektis = trapezi.trapeziPektisGet(1);
	if (!pektis) return this;

	// Κρατάμε τον δημιουργό ως τον τελευταίο παίκτη που κάθησε
	// στην πρώτη θέση.

	trapezi.telefteos[1] = pektis;

	// Εντοπίζουμε τη σχετική συνεδρία και την «τοποθετούμε»
	// στο νέο τραπέζι.

	sinedria = this.skinikoSinedriaGet(pektis);
	if (sinedria) sinedria.sinedriaSetPektis(trapezi, 1);

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ET -- Επιλογή τραπεζιού
//
// Επιλογή τραπεζιού από παίκτη.
//
// Δεδομένα
//
//	pektis		Login name παίκτη.
//	trapezi		Κωδικός τραπεζιού.

Skiniko.prototype.processKinisiET = function(data) {
	var sinedria, trapezi, thesi;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria) return this;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	sinedria.sinedriaTrapeziSet(trapezi.kodikos);
	thesi = trapezi.trapeziThesiPekti(data.pektis);
	if (thesi) {
		sinedria.sinedriaThesiSet(thesi);
		sinedria.sinedriaSimetoxiSet('ΠΑΙΚΤΗΣ');
	}
	else {
		sinedria.sinedriaThesiSet(trapezi.trapeziSimetoxiGet(data.pektis));
		sinedria.sinedriaSimetoxiSet('ΘΕΑΤΗΣ');
	}

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// RT -- Έξοδος από τραπέζι
//
// Έξοδος παίκτη/θεατή από το τραπέζι.
//
// Δεδομένα
//
//	pektis		Login name παίκτη.

Skiniko.prototype.processKinisiRT = function(data) {
	var sinedria, trapezi, thesi;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria) return this;

	trapezi = this.skinikoTrapeziGet(sinedria.sinedriaTrapeziGet());
	if (trapezi) {
		thesi = trapezi.trapeziThesiPekti(data.pektis);
		if (thesi) trapezi.trapeziPektisSet(thesi);
	}

	sinedria.sinedriaEntopismos();
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SZ -- Νέο σχόλιο συζήτησης
//
// Νέο σχόλιο συζήτησης.
//
// Δεδομένα
//
//	kodikos		Κωδικός αριθμός σχολίου.
//	pektis		Login name του παίκτη που κάνει το σχόλιο.
//	trapezi		Κωδικός τραπεζιού στο οποίο διεξάγεται η συζήτηση.
//			Αν δεν προσδιοριστεί εννοείται η δημόσια συζήτηση.
//	sxolio		Το σχόλιο αυτό καθαυτό.

Skiniko.prototype.processKinisiSZ = function(data) {
	var sizitisi, trapezi;

	sizitisi = new Sizitisi(data);
	sizitisi.sizitisiPoteSet();

	if (!sizitisi.hasOwnProperty('trapezi')) {
		this.skinikoSizitisiSet(sizitisi);
		return this;
	}

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	trapezi.trapeziSizitisiSet(sizitisi);
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// PL -- Πρόσκληση
//
// Νέα πρόσκληση.
//
// Δεδομένα
//
//	kodikos		Κωδικός πρόσκλησης.
//	trapezi		Κωδικός τραπεζιού.
//	apo		Login name Αποστολέα.
//	pros		Login name παραλήπτη.

Skiniko.prototype.processKinisiPL = function(data) {
	var prosklisi;

	prosklisi = new Prosklisi(data);
	this.skinikoProsklisiSet(prosklisi);

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// DL -- Διαγραφή πρόσκλησης
//
// Απόρριψη/ανάκληση πρόσκλησης.
//
// Δεδομένα
//
//	kodikos		Κωδικός πρόσκλησης.

Skiniko.prototype.processKinisiDL = function(data) {
	this.skinikoProsklisiDelete(data.kodikos);
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// AL -- Αποδοχή πρόσκλησης
//
// Αποδοχή πρόσκλησης.
//
// Δεδομένα
//
//	pektis		Login name προσκεκλημένου.
//	trapezi		Κωδικός τραπεζιού.
//	thesi		Θέση παίκτη/θεατή.
//	simetoxi	Παίκτης ή θεατής.

Skiniko.prototype.processKinisiAL = function(data) {
	var sinedria, trapezi;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (sinedria) {
		sinedria.sinedriaTrapeziSet(data.trapezi);
		sinedria.sinedriaThesiSet(data.thesi);
		sinedria.sinedriaSimetoxiSet(data.simetoxi);
	}
	if (data.simetoxi.isTheatis()) return this;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	trapezi.trapeziPektisSet(data.thesi, data.pektis);
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// AV -- Αποκλεισμός παίκτη από τραπέζι
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	apo		Login name παίκτη/επόπτη που θέτει τον αποκλεισμό.
//	pros		Login name αποκλειομένου.

Skiniko.prototype.processKinisiAV = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);

	if (!trapezi)
	return this;

	trapezi.trapeziArvilaSet(new Arvila(data));
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// DV -- Άρση αποκλεισμού παίκτη από τραπέζι
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	pros		Login name αποκλειομένου.

Skiniko.prototype.processKinisiDV = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);

	if (!trapezi)
	return this;

	trapezi.trapeziArvilaDelete(data.pros);
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// PT -- Από παίκτης θεατής
//
// Ο παίκτης καθίσταται θεατής στην ίδια θέση στο τραπέζι που παίζει.
//
// Δεδομένα
//
//	pektis		Login name προσκεκλημένου.
//	trapezi		Κωδικός τραπεζιού.
//	thesi		Θέση παίκτη.

Skiniko.prototype.processKinisiPT = function(data) {
	var sinedria, trapezi;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (sinedria) sinedria.sinedriaSimetoxiSetTheatis();

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	trapezi.trapeziPektisSet(data.thesi);
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// PS -- Παράμετρος παίκτη
//
// Θέση/αλλαγή παραμέτρου παίκτη.
//
// Δεδομένα
//
//	pektis		Login name του ενεργούντος παίκτη.
//	param		Ονομασία παραμέτρου.
//	timi		Τιμή παραμέτρου.

Skiniko.prototype.processKinisiPS = function(data) {
	var pektis;

	pektis = this.skinikoPektisGet(data.pektis);
	if (!pektis) return this;

	pektis.
	pektisPeparamSet(new Peparam({
		param: data.param,
		timi: data.timi,
	}));

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// TS -- Παράμετρος τραπεζιού
//
// Θέση/αλλαγή παραμέτρου τραπεζιού.
//
// Δεδομένα
//
//	pektis		Login name του ενεργούντος παίκτη.
//	trapezi		Κωδικός τραπεζιού.
//	param		Ονομασία παραμέτρου.
//	timi		Τιμή παραμέτρου.
//	apodoxi		Αν είναι true να μην αλλάζει η αποδοχή

Skiniko.prototype.processKinisiTS = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	trapezi.
	trapeziTrparamSet(new Trparam({
		param: data.param,
		timi: data.timi,
	})).
	trapeziThesiWalk(function(thesi) {
		if (this.trapeziPektisGet(thesi) == data.pektis) return;
		if (!data.apodoxi) this.trapeziApodoxiSet(thesi, false);
	});
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// DX -- Αλλαγή διάταξης παικτών
//
// Αλλαγή της διάταξης των παικτών στο τραπέζι.
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	h1		Αριθμός θέσης.
//	p1		Παίκτης για τη θέση h1.
//	h2		Αριθμός θέσης.
//	p2		Παίκτης για τη θέση h2.

Skiniko.prototype.processKinisiDX = function(data) {
	var trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	trapezi.trapeziPektisSet(data.h1, data.p1);
	trapezi.trapeziPektisSet(data.h2, data.p2);
	trapezi.trapeziApodoxiSet(data.h1, false);
	trapezi.trapeziApodoxiSet(data.h2, false);
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// RL -- Κυκλική εναλλαγή παικτών
//
// Κυκλική εναλλαγή των παικτών ενός τραπεζιού.
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	p1		Παίκτης για τη θέση 1.
//	a1		Αποδοχή για τη θέση 1.
//	p2		Παίκτης για τη θέση 2.
//	a2		Αποδοχή για τη θέση 2.
//	p3		Παίκτης για τη θέση 3.
//	a3		Αποδοχή για τη θέση 3.

Skiniko.prototype.processKinisiRL = function(data) {
	var trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	trapezi.trapeziPektisSet(1, data.p1);
	trapezi.trapeziApodoxiSet(1, data.a1.isNai());
	trapezi.trapeziPektisSet(2, data.p2);
	trapezi.trapeziApodoxiSet(2, data.a2.isNai());
	trapezi.trapeziPektisSet(3, data.p3);
	trapezi.trapeziApodoxiSet(3, data.a3.isNai());
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// AX -- Αποδοχή/Επαναδιαπραγμάτευση όρων
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	thesi		Θέση παίκτη που εκτελεί την ενέργεια.
//	apodoxi		ΝΑΙ = Αποδοχή, ΟΧΙ = Επαναδιαπραγμάτευση.

Skiniko.prototype.processKinisiAX = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	trapezi.trapeziApodoxiSet(data.thesi, data.apodoxi.isNai());
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// TT -- Αλλαγή θέσης θέασης
//
// Δεδομένα
//
//	pektis		Login name θεατή που αλλάζει θέση.
//	thesi		Νέα θέση θέασης.

Skiniko.prototype.processKinisiTT = function(data) {
	var sinedria, trapezi;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria) return this;

	trapezi = this.skinikoTrapeziGet(sinedria.sinedriaTrapeziGet());
	if (!trapezi) return this;

	sinedria.sinedriaThesiSet(data.thesi);
	trapezi.trapeziSimetoxiSet(data.thesi, data.pektis);
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// DN -- Νέα διανομή
//
// Δεδομένα
//
//	kodikos		Κωδικός διανομής.
//	trapezi		Κωδικός τραπεζιού.
//	dealer		Θέση dealer.

Skiniko.prototype.processKinisiDN = function(data) {
	var trapezi, dianomi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	// Εφόσον έχουμε διανομή στο τραπέζι, την καθαρίζουμε από
	// τις ενέργειές της.

	dianomi = trapezi.trapeziTelefteaDianomi();
	if (dianomi) {
		delete dianomi.energiaArray;
		delete dianomi.energia;
	}

	// Δημιουργούμε τη νέα διανομή και την εντάσσουμε στο τραπέζι.

	dianomi = new Dianomi({
		kodikos: data.kodikos,
		trapezi: data.trapezi,
		dealer: data.dealer,
	});
	trapezi.trapeziDianomiSet(dianomi);
	trapezi.dianomiArray.push(dianomi);
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// EG -- Νέα ενέργεια
//
// Δεδομένα
//
//	kodikos		Κωδικός ενέργειας.
//	trapezi		Κωδικός τραπεζιού.
//	dianomi		Κωδικός διανομής.
//	pektis		Θέση ενεργούντος παίκτη.
//	idos		Το είδος της ενέργειας.
//	data		Data ενέργειας.

Skiniko.prototype.processKinisiEG = function(data) {
	var trapezi, dianomi, energia;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	dianomi = trapezi.trapeziDianomiGet(data.dianomi);
	if (!dianomi) return this;
	if (!dianomi.hasOwnProperty('energia')) return this;

	energia = new Energia({
		kodikos: data.kodikos,
		dianomi: data.dianomi,
		pektis: data.pektis,
		idos: data.idos,
		data: data.data,
	});

	dianomi.dianomiEnergiaSet(energia);
	dianomi.energiaArray.push(energia);
	trapezi.trapeziProcessEnergia(energia);
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// PD -- Πληρωμή διανομής
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	dianomi		Κωδικός διανομής.
//	kasa1		Ποσό κάσας παίκτη θέσης 1.
//	metrita1	Μετρητά παίκτη θέσης 1.
//	kasa2		Ποσό κάσας παίκτη θέσης 2.
//	metrita2	Μετρητά παίκτη θέσης 2.
//	kasa3		Ποσό κάσας παίκτη θέσης 3.
//	metrita3	Μετρητά παίκτη θέσης 3.

Skiniko.prototype.processKinisiPD = function(data) {
	var skiniko = this, trapezi, dianomi, kapikia;

	trapezi = skiniko.skinikoTrapeziGet(data.trapezi);

	if (!trapezi)
	return this;

	dianomi = trapezi.trapeziDianomiGet(data.dianomi);

	if (!dianomi)
	return this;

	kapikia = [
		0,	// spare
		0,	// παίκτης 1
		0,	// παίκτης 2
		0,	// παίκτης 3
	];

	Prefadoros.thesiWalk(function(thesi) {
		var kasa, metrita;

		kasa = data['kasa' + thesi];
		metrita = data['metrita' + thesi];

		dianomi.dianomiKasaSet(thesi, kasa);
		dianomi.dianomiMetritaSet(thesi, metrita);

		// Θα μας χρειαστεί το ένα τρίτο του ποσού αυξομείωσης 
		// της κάσας για τον κάθε παίκτη.

		kapikia[0] = kasa / 3.0;

		kapikia[thesi] += metrita;
		kapikia[thesi] += kapikia[0] * 2.0;

		switch (thesi) {
		case 1:
			kapikia[2] -= kapikia[0];
			kapikia[3] -= kapikia[0];
			break;
		case 2:
			kapikia[1] -= kapikia[0];
			kapikia[3] -= kapikia[0];
			break;
		case 3:
			kapikia[1] -= kapikia[0];
			kapikia[2] -= kapikia[0];
			break;
		}
	});

	// Είναι η στιγμή να ενημερώσουμε την απόδοση των παικτών. Ωστόσο,
	// ελέγχουμε πρώτα την ύπαρξη άσων στην αγορά, καθώς οι αγορές με
	// άσους δεν μετέχουν στη διαμόρφωση της απόδοσης των παικτών.

/*
XXX

	var agora;

	Έχω ακυρώσει την εξαίρεση για τους άσους στη βαθμολογία.

	agora = trapezi.partidaAgoraGet();

	if (agora && (agora instanceof Dilosi) && agora.dilosiIsAsoi())
	return this;

XXX
*/

	Prefadoros.thesiWalk(function(thesi) {
		var pektis, apodosi;

		pektis = trapezi['pektis' + thesi];

		if (!pektis)
		return;

		pektis = skiniko.pektis[pektis];

		if (!pektis)
		return;

		if (!pektis.hasOwnProperty('peparam'))
		pektis.peparam = {};

		if (!pektis.peparam.hasOwnProperty(Apodosi.peparamIdx))
		pektis.pektisApodosiSet('0#0');

		apodosi = pektis.pektisApodosiGet().
		apodosiAdd(kapikia[thesi]);

		pektis.pektisApodosiSet(apodosi);
	});

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// AK -- Ακύρωση κινήσεων
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//
// Προαιρετικά
//
//	pektis		Login name του ενεργούντος παίκτη.
//	ecount		Πλήθος ενεργειών που απομένουν.

Skiniko.prototype.processKinisiAK = function(data) {
	var trapezi, dianomi, ecount, energiaArray, i, energia;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	trapezi.trapeziAkirosiSet();
	if (!data.ecount) return this;

	dianomi = trapezi.trapeziTelefteaDianomi();
	if (!dianomi) return this;
	if (!dianomi.hasOwnProperty('energiaArray')) return this;

	energiaArray = dianomi.energiaArray;
	ecount = parseInt(data.ecount);
	if (energiaArray.length <= ecount) return this;

	dianomi.energiaArray = energiaArray.slice(0, ecount);
	energiaArray = dianomi.energiaArray;

	dianomi.energia = {};
	for (i = 0; i < ecount; i++) {
		energia = energiaArray[i];
		dianomi.energia[energia.energiaKodikosGet()] = energia;
	}

	trapezi.partidaReplay();
	if (energiaArray.length < 2) return this;

	trapezi.trapeziAkirosiSet(data.pektis);
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// RC -- Reject claim
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	dianomi		Κωδικός διανομής.
//	ecount		Πλήθος ενεργειών πριν το claim.

Skiniko.prototype.processKinisiRC = function(data) {
	var trapezi, dianomi, ecount, energiaArray, energia;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) return this;

	dianomi = trapezi.trapeziTelefteaDianomi();
	if (!dianomi) return this;

	if (!dianomi.hasOwnProperty('energiaArray')) return this;
	energiaArray = dianomi.energiaArray;
	ecount = parseInt(data.ecount);
	if (energiaArray.length <= ecount) return this;

	dianomi.energiaArray = energiaArray.slice(0, ecount);
	dianomi.energia = {};
	for (i = 0; i < ecount; i++) {
		energia = dianomi.energiaArray[i];
		dianomi.energia[energia.energiaKodikosGet()] = energia;
	}

	trapezi.partidaReplay();
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// AT -- Αρχειοθέτηση τραπεζιού
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.

Skiniko.prototype.processKinisiAT = function(data) {
	var skiniko = this;

	// Διαγράφουμε το τραπέζι από το σκηνικό.

	this.skinikoTrapeziDelete(data.trapezi);

	// Επανεντοπίζουμε τις συνεδρίες που εμπλέκονταν με
	// το συγκεκριμένο τραπέζι.

	this.skinikoSinedriaWalk(function() {
		if (this.sinedriaIsTrapezi(data.trapezi))
		this.sinedriaEntopismos();
	});

	// Διαγράφουμε τις προσκλήσεις που αναφέρονται στο
	// συγκεκριμένο τραπέζι.

	this.skinikoProsklisiWalk(function() {
		if (this.prosklisiIsTrapezi(data.trapezi))
		delete skiniko.prosklisi[this.prosklisiKodikosGet()];
	});

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ZS -- Διαγραφή σχολίου συζήτησης
//
// Διαγραφή σχολίου συζήτησης τραπεζιού.
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού στο οποίο διεξάγεται η συζήτηση.
//			Αν δεν έχει καθοριστεί τραπέζι, τότε πρόκειται για
//			καθαρισμό της δημόσιας συζήτησης.
//	sxolio		Κωδικός αριθμός σχολίου προς διαγραφή. Αν δεν έχει
//			καθοριστεί σημαίνει μαζική διαγραφή.
//	pektis		Login name του παίκτη που διαγράφει το σχόλιο.

Skiniko.prototype.processKinisiZS = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi) {
		this.sizitisi = {};
		return this;
	}

	if (!data.sxolio)
	trapezi.sizitisi = {};

	else
	trapezi.trapeziSizitisiDelete(data.sxolio);

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// PI -- Πληροφορίες προφίλ παίκτη
//
// Ενημέρωση πληροφοριών προφίλ παίκτη.
//
// Δεδομένα
//
//	pektis		Το login name του παίκτη στον οποίον αναφέρεται το
//			κείμενο του προφίλ.
//
//	sxoliastis	Το login name του συντάκτη του κειμένου προφίλ.
//
//	kimeno		Το κείμενο του προφίλ.

Skiniko.prototype.processKinisiPI = function(data) {
	var pektis;

	pektis = this.skinikoPektisGet(data.pektis);
	if (!pektis) return this;

	if (!pektis.profinfo)
	pektis.profinfo = {};

	if (data.kimeno) pektis.pektisProfinfoSet(data.sxoliastis, data.kimeno);
	else delete pektis.profinfo[data.sxoliastis];

	return this;
};
