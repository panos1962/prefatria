//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Ακολουθούν οι διαδικασίες διαχείρισης ενεργειών ως μέθοδοι του τραπεζιού.
// Κάθε μέθοδος διαχείρισης ενέργειας φέρει όνομα της μορφής "processEnergiaEEE",
// όπου "EEE" είναι το είδος της ενέργειας.

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// ΔΙΑΝΟΜΗ
//
// Κάθε διανομή εκκινεί με ενέργεια τύπου "ΔΙΑΝΟΜΗ". Ο παίκτης της ενέργειας είναι
// ο dealer και τα δεδομένα είναι η τράπουλα ανακατεμένη ως ένα ενιαίο string όπου
// τα πρώτα 10 φύλλα είναι τα φύλλα του πρώτου παίκτη, τα επόμενα 10 φύλλα είναι τα
// φύλλα του δεύτερου παίκτη, τα επόμενα 10 φύλλα είναι τα φύλλα του τρίτου παίκτη
// και τα υπόλοιπα 2 φύλλα είναι τα φύλλα του τζόγου.

Trapezi.prototype.processEnergiaΔΙΑΝΟΜΗ = function(energia) {
	var fila = energia.energiaDataGet().string2xartosia();

	this.
	partidaResetAgora().
	partidaResetBazes().
	partidaResetBaza().
	partidaResetDianomi().
	partidaFilaSet(1, fila.xartosiaXartosia(0, 10)).
	partidaFilaSet(2, fila.xartosiaXartosia(10, 10)).
	partidaFilaSet(3, fila.xartosiaXartosia(20, 10)).
	partidaTzogosSet(fila.xartosiaXartosia(30, 2)).
	partidaDealerSet(energia.energiaPektisGet()).
	partidaProtosSet(this.partidaDealerGet().epomeniThesi()).
	partidaFasiSet('ΔΗΛΩΣΗ').
	partidaEpomenosSet(this.partidaProtosGet());

	// Κρατάμε τα φύλλα όλων των παικτών όπως διαμορφώθηκαν μετά
	// τη διανομή.

	if (Server)
	this.trapeziFilaSaveSet();

	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// ΔΗΛΩΣΗ

Trapezi.prototype.processEnergiaΔΗΛΩΣΗ = function(energia) {
	var pektis, dilosi, agora;

	this.acount++;
	pektis = energia.energiaPektisGet();
	dilosi = energia.energiaDataGet().string2dilosi();

	if (dilosi.dilosiIsPaso()) {
		this.apaso[pektis] = true;
		this.apasoCount++;
		if (this.apasoCount > 2) {
			if (this.trapeziIsPaso()) {
				this.
				trapeziThesiWalk(function(thesi) {
					this.sdilosi[thesi] = '';
				}).
				partidaEpomenosSet(this.partidaProtosGet()).
				partidaFasiSet('ΠΑΙΧΝΙΔΙ');
				return this;
			}

			this.
			partidaDealerSet(this.partidaProtosGet()).
			partidaProtosSet().
			partidaEpomenosSet().
			partidaFasiSet('ΔΙΑΝΟΜΗ');
			return this;
		}
	}
	else {
		this.partidaTzogadorosSet(pektis);
		this.alast = dilosi;
		if (dilosi.dilosiIsTagrafo()) this.tagrafo = pektis;
		this.tzogadoros = pektis;
		this.adilosi[pektis] = dilosi;
	}

	this.anext = this.dilosiEpomeniDilosi();

	// Ελέγχουμε αν με την ανά χείρας δήλωση προκύπτει τζογαδόρος.

	agora = null;

	if (this.alast && (this.apasoCount === 2))
	agora = true;

	else if ((this.apasoCount === 1) && this.tagrafo && this.alast.dilosiOxiTagrafo())
	agora = true;

	else if (!this.anext)
	agora = true;

	if (agora) {
		this.
		partidaFasiSet('ΑΛΛΑΓΗ').
		partidaEpomenosSet(this.partidaTzogadorosGet());
		return this;
	}

	this.energiaDilosiEpomenosSet();
	return this;
};

Trapezi.prototype.energiaDilosiEpomenosSet = function(level) {
	var epomenos;

	if (level === undefined)
	level = 0;

	else if (++level > 2)
	return this.partidaEpomenosSet();

	this.partidaEpomenosSet(epomenos = this.partidaEpomenosGet().epomeniThesi());

	if (this.apaso[epomenos])
	return this.energiaDilosiEpomenosSet(level);

	if (epomenos === this.tagrafo)
	return this.energiaDilosiEpomenosSet(level);

	return this;
};

Trapezi.prototype.dilosiEpomeniDilosi = function() {
	var dilosi = this.alast, bazes, xroma;

	if (!dilosi) return new Dilosi('DTG');
	if (dilosi.dilosiIsTagrafo()) return new Dilosi('DS6');
	if ((this.acount >= 3) && dilosi.dilosiOxiExo()) return new Dilosi(dilosi).dilosiExoSet();

	bazes = dilosi.dilosiBazesGet();
	switch (dilosi.dilosiXromaGet()) {
	case 'S':
		xroma = 'C';
		break;
	case 'C':
		xroma = 'D';
		break;
	case 'D':
		xroma = 'H';
		break;
	case 'H':
		xroma = 'N';
		break;
	case 'N':
		if (bazes > 9) return null;
		xroma = 'S';
		bazes++;
		break;
	}

	return new Dilosi({
		xroma: xroma,
		bazes: bazes,
	});
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// FLOP

Trapezi.prototype.processEnergiaFLOP = function(energia) {
	this.partidaTzogosSet(energia.energiaDataGet().string2xartosia());
	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// ΤΖΟΓΟΣ

Trapezi.prototype.processEnergiaΤΖΟΓΟΣ = function(energia) {
	var tzogadoros, fila, tzogos;

	tzogadoros = this.partidaTzogadorosGet();
	if (!tzogadoros) return this;

	fila = this.partidaFilaGet(tzogadoros);
	if (!fila) return this;

	tzogos = energia.energiaDataGet().string2xartosia();
	this.partidaTzogosSet(tzogos);

	tzogos.xartosiaWalk(function(i, filo) {
		fila.xartosiaFiloPush(filo);
	});

	// Στα φύλλα του τζογαδόρου έχουν προστεθεί τα φύλλα του τζόγου.

	if (Server)
	this.trapeziFilaSaveSet(tzogadoros);

	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// ΣΟΛΟ

Trapezi.prototype.processEnergiaΣΟΛΟ = function(energia) {
	var tzogadoros, agora, protos, defteros;

	tzogadoros = energia.energiaPektisGet();
	this.partidaTzogadorosSet(tzogadoros);
	protos = tzogadoros.epomeniThesi();
	defteros = protos.epomeniThesi();

	agora = new Dilosi(energia.energiaDataGet());
	this.partidaAgoraSet(agora);

	this.sdilosi[protos] = 'ΠΑΙΖΩ';
	this.sdilosi[defteros] = 'ΠΑΙΖΩ';

	switch (agora.dilosiBazesGet()) {
	case 6:
		this.bazes[tzogadoros] = 4;
		this.bazes[protos] = 3;
		this.bazes[defteros] = 3;
		break;
	case 7:
		this.bazes[tzogadoros] = 5;
		this.bazes[protos] = 3;
		this.bazes[defteros] = 2;
		break;
	case 8:
		this.bazes[tzogadoros] = 6;
		this.bazes[protos] = 2;
		this.bazes[defteros] = 2;
		break;
	case 9:
		this.bazes[tzogadoros] = 7;
		this.bazes[protos] = 2;
		this.bazes[defteros] = 1;
		break;
	case 10:
		this.bazes[tzogadoros] = 8;
		this.bazes[protos] = 1;
		this.bazes[defteros] = 1;
		break;
	default:
		return this;
	}

	this.partidaPliromi();
	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// ΑΓΟΡΑ

Trapezi.prototype.processEnergiaΑΓΟΡΑ = function(energia) {
	var tzogadoros, data, agora, skarta, fila, alif;

	tzogadoros = energia.energiaPektisGet();

	data = energia.energiaDataGet();

	agora = data.substr(0, 3).string2dilosi();

	skarta = data.substr(3, 4).string2xartosia();

	alif = new Xartosia();
	fila = this.partidaFilaGet(tzogadoros);
	fila.xartosiaWalk(function(i, filo) {
		if (filo.filoIsFilo(skarta.xartosiaFiloGet(0))) return;
		if (filo.filoIsFilo(skarta.xartosiaFiloGet(1))) return;
		alif.xartosiaFiloPush(filo);
	});

	this.
	partidaTzogadorosSet(tzogadoros).
	partidaSkartaSet(skarta).
	partidaFilaSet(tzogadoros, alif).
	partidaAgoraSet(agora).
	partidaFasiSet('ΣΥΜΜΕΤΟΧΗ').
	partidaEpomenosSet(tzogadoros.epomeniThesi());

	// Τα φύλλα του τζογαδόρου έχουν αλλάξει μετά την αλλαγή.

	if (Server)
	this.trapeziFilaSaveSet(tzogadoros);

	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// ΣΥΜΜΕΤΟΧΗ

Trapezi.prototype.processEnergiaΣΥΜΜΕΤΟΧΗ = function(energia) {
	var sdilosi, pektis, dilosi, simpektis;

	sdilosi = this.sdilosi;
	pektis = energia.energiaPektisGet();
	dilosi = energia.energiaDataGet();

	simpektis = pektis.epomeniThesi();

	if (simpektis == this.partidaTzogadorosGet())
	simpektis = simpektis.epomeniThesi();

	if (dilosi.simetoxiIsPaso()) {
		if (sdilosi[pektis] && sdilosi[pektis].simetoxiIsPaso())
		return this.energiaSimetoxiPexnidiStart();

		sdilosi[pektis] = dilosi;
		if (!sdilosi[simpektis])
		return this.partidaEpomenosSet(simpektis);

		if (sdilosi[simpektis].simetoxiIsPaso())
		return this.partidaPliromi();

		return this.partidaEpomenosSet(simpektis);
	}

	if (dilosi.simetoxiIsMazi()) {
		sdilosi[pektis] = 'ΜΑΖΙ';
		sdilosi[simpektis] = 'ΒΟΗΘΑΩ';
		return this.energiaSimetoxiPexnidiStart();
	}

	if (dilosi.simetoxiIsMonos()) {
		sdilosi[pektis] = dilosi;
		return this.energiaSimetoxiPexnidiStart();
	}

	sdilosi[pektis] = 'ΠΑΙΖΩ';
	if (!sdilosi[simpektis])
	return this.partidaEpomenosSet(simpektis);

	if (sdilosi[simpektis].simetoxiIsPaso())
	return this.partidaEpomenosSet(simpektis);

	return this.energiaSimetoxiPexnidiStart();
};

Trapezi.prototype.energiaSimetoxiPexnidiStart = function() {
	var epomenos, tzogadoros, simetoxi;

	this.partidaFasiSet('ΠΑΙΧΝΙΔΙ');
	tzogadoros = this.partidaTzogadorosGet();
	simetoxi = this.sdilosi;

	epomenos = this.partidaDealerGet().epomeniThesi();
	if (epomenos === tzogadoros) return this.partidaEpomenosSet(epomenos);
	if (simetoxi[epomenos].simetoxiOxiPaso()) return this.partidaEpomenosSet(epomenos);

	epomenos = epomenos.epomeniThesi();
	if (epomenos === tzogadoros) return this.partidaEpomenosSet(epomenos);
	if (simetoxi[epomenos].simetoxiOxiPaso()) return this.partidaEpomenosSet(epomenos);

	epomenos = epomenos.epomeniThesi();
	this.partidaEpomenosSet(epomenos);
	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// ΦΥΛΛΟ

Trapezi.prototype.processEnergiaΦΥΛΛΟ = function(energia) {
	var pektis, xeri, fila, filo, i, epomenos;

	pektis = energia.energiaPektisGet();
	xeri = this.partidaFilaGet(pektis);
	if (!xeri) return this;

	fila = xeri.fila;
	filo = energia.energiaDataGet().string2filo();

	for (i = 0; i < fila.length; i++) {
		if (fila[i].filoOxiFilo(filo)) continue;

		fila.splice(i, 1);
		break;
	}

	this.partidaBazaFiloPush(pektis, filo);
	epomenos = this.energiaFiloEpomenos(pektis);

	if (epomenos == this.partidaBazaPiosGet(0))
	return this.energiaFiloBaza();

	this.partidaEpomenosSet(epomenos);
	return this;
};

Trapezi.prototype.energiaFiloEpomenos = function(pektis) {
	var epomenos;

	epomenos = pektis.epomeniThesi();
	if (epomenos == this.partidaTzogadorosGet())
	return epomenos;

	// Κάποια στιγμή παρουσιάστηκε σφάλμα undefined για το "simetoxiOxiPaso"
	// που ακολουθεί παρακάτω, επομένως ελέγχω τα πάντα.

	if (!this.sdilosi)
	return epomenos;

	if (!this.sdilosi[epomenos])
	return epomenos;

	if (this.sdilosi[epomenos].simetoxiOxiPaso())
	return epomenos;

	return epomenos.epomeniThesi();
};

Trapezi.prototype.energiaFiloBaza = function() {
	var nikitis = this.partidaBazaPios();

	this.
	partidaEpomenosSet(nikitis).
	partidaBazesAdd(nikitis).
	partidaBazaCountAdd().
	partidaResetBaza();

	if (this.partidaBazaCountGet() < 10)
	return this;

	this.partidaPliromi();
	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// CLAIM

Trapezi.prototype.processEnergiaCLAIM = function(energia) {
	var epomenos;

	this.partidaFasiSet('CLAIM');
	epomenos = energia.energiaPektisGet().epomeniThesi();

	if (this.sdilosi[epomenos].simetoxiIsPaso())
	epomenos = epomenos.epomeniThesi();

	this.partidaEpomenosSet(epomenos);
	this.claim = [];

	if (Server)
	return this;

	this.claimFila = energia.energiaDataGet().string2xartosia().xartosiaTaxinomisi();
	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// ΠΑΡΑΙΤΗΣΗ

Trapezi.prototype.processEnergiaΠΑΡΑΙΤΗΣΗ = function(energia) {
	var apodoxi, pektis;

	apodoxi = (energia.energiaDataGet() === 'ΝΑΙ');
	if (!apodoxi) return this.processEnergiaParetisiOxi(energia);

	if (!this.hasOwnProperty('claim')) this.claim = [];
	pektis = energia.energiaPektisGet();
	this.claim[pektis] = true;
	pektis = pektis.epomeniThesi();

	if (pektis === this.partidaTzogadorosGet())
	return this.processEnergiaParetisiPliromi(energia);

	if (this.sdilosi[pektis].simetoxiIsPaso())
	return this.processEnergiaParetisiPliromi(energia);

	this.partidaEpomenosSet(pektis);
	return this;
};

Trapezi.prototype.processEnergiaParetisiOxi = function(energia) {
	var dianomi, i, j, kodikos;

	delete this.claim;
	dianomi = this.trapeziDianomiGet(energia.energiaDianomiGet());

	for (i = 0; i < dianomi.energiaArray.length; i++) {
		if (dianomi.energiaArray[i].energiaIdosGet() === 'CLAIM') break;
	}

	for (j = dianomi.energiaArray.length - 1; j >= i; j--) {
		kodikos = dianomi.energiaArray[j].energiaKodikosGet();
		delete dianomi.energia[kodikos];
		dianomi.energiaArray.pop();
	}

	this.partidaReplay();
	return this;
};

Trapezi.prototype.processEnergiaParetisiPliromi = function(energia) {
	this.partidaBazesAdd(this.partidaTzogadorosGet(), 10 - this.bazaCount);
	this.partidaPliromi();
	return this;
};
