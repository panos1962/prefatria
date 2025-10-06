Funchat = function(props) {
	var img;

	Globals.initObject(this, props);

	// Αν έχει καθοριστεί id για το ανά χείρας funchat item,
	// δεν χρειάζεται να κάνουμε κάτι.

	if (this.funchatIdGet())
	return;

	// Αλλιώς χρησιμοποιούμε το source της εικόνας χωρίς το
	// επίθεμα, π.χ. για την εικόνα "etsi.gif" θα δώσουμε το
	// id "etsi".

	img = this.funchatIkonaGet();
	if (img) this.funchatIdSet(img.replace(/\..*/, ''));
};

Funchat.prototype.funchatIdSet = function(id) {
	this.id = id;
};

Funchat.prototype.funchatIdGet = function() {
	return this.id;
};

Funchat.prototype.funchatOmadaSet = function(omada) {
	this.omada = omada;
};

Funchat.prototype.funchatOmadaGet = function() {
	return this.omada;
};

Funchat.prototype.funchatIkona0Get = function() {
	return this.img0;
};

Funchat.prototype.funchatIkonaGet = function() {
	return this.img;
};

Funchat.prototype.funchatIkona2Get = function() {
	return this.img2;
};

Funchat.prototype.funchatDurationGet = function() {
	return this.dur;
};

Funchat.prototype.funchatPlatosGet = function() {
	return this.platos;
};

Funchat.prototype.funchatPlatos2Get = function() {
	return this.platos2;
};

Funchat.prototype.funchatKimenoGet = function() {
	return this.txt;
};

Funchat.prototype.funchatSxolioGet = function() {
	return this.sxolio;
};

Funchat.prototype.funchatIxosGet = function() {
	return this.ixos;
};

Funchat.prototype.funchatIxosDelayGet = function() {
	var delay;

	delay = this.ixosDelay;

	if (!delay)
	delay = 0;

	return delay;
};

Funchat.prototype.funchatIsterisiGet = function() {
	var isterisi;

	isterisi = parseInt(this.isterisi);
	if (isNaN(isterisi) || (isterisi < 0))
	isterisi = 0;

	return isterisi;
};

Funchat.prototype.funchatEntasiGet = function() {
	return this.entasi;
};

Funchat.prototype.funchatIxosPlay = function(opts) {
	var ixos, entasi, isterisi;

	ixos = this.funchatIxosGet();
	if (!ixos) return null;

	if (opts === undefined)
	opts = {};

	if (!opts.hasOwnProperty('entasi')) {
		entasi = this.funchatEntasiGet();
		if (entasi) opts.entasi = entasi;
	}

	if (!ixos.match(/^https?:/)) ixos = Funchat.server + ixos;
	isterisi = this.funchatIsterisiGet();

	if (!isterisi) 
	return Client.sound.play(ixos, opts);

	setTimeout(function() {
		Client.sound.play(ixos, opts);
	}, isterisi);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Funchat.server = 'http://opasopa.gr/prefadorosFC/';

Funchat.lista = {};
Funchat.listaArray = [];

Funchat.listaArrayWalk = function(callback) {
	var i;

	for (i = 0; i < Funchat.listaArray.length; i++) {
		callback.call(Funchat.listaArray[i]);
	}

	return Funchat;
};

Funchat.listaGet = function(id) {
	return Funchat.lista[id];
};

Funchat.omada = 0;

Funchat.listaPush = function(item) {
	var id;

	id = item.funchatIdGet();
	if (!id) {
		console.error('funchat item missing id');
		return Funchat;
	}

	if (Funchat.listaGet(id)) {
		console.error(id + ': double funchat id');
		return Funchat;
	}

	item.funchatOmadaSet(Funchat.omada);
	Funchat.listaArray.push(item);
	Funchat.lista[id] = item;
	return Funchat;
};

Funchat.omada++;

Funchat.listaPush(new Funchat({
	img: 'etsi.gif',
	txt: 'Έεεεεετσι!',
	img2: 'etsi1.png',
	dur: 4000,
}));

Funchat.listaPush(new Funchat({
	img: 'elaStoThio.gif',
	platos: 100,
	img2: 'elaStoThio1.png',
	dur: 4000,
	txt: 'Έλα στο θείο!',
	ixos: 'elaMouTo.mp3',
	entasi: 4,
}));

Funchat.listaPush(new Funchat({
	img: 'bougas.png',
	platos: 120,
	txt: 'Έλα στον παπού!',
	ixos: 'bougas.mp3',
}));

Funchat.listaPush(new Funchat({
	img: 'assWiggle.gif',
	txt: 'Ε, ρε, γλέντια!',
	img2: 'assWiggle1.png',
	dur: 4000,
}));

Funchat.listaPush(new Funchat({
	img: 'eReGlentiaaa.gif',
	txt: 'Ε, ρε, γλέντια!',
	img2: 'eReGlentiaaa1.png',
	ixos: 'eReGlentiaaa.mp3?x',
	entasi: 10,
	dur: 4800,
}));

Funchat.listaPush(new Funchat({
	img: 'pipaKaroto.gif',
	platos: 120,
	img2: 'pipaKaroto1.png',
	dur: 4000,
}));

Funchat.listaPush(new Funchat({
	img: 'tonIpiame.gif',
	platos: 120,
	img2: 'tonIpiame1.png',
	dur: 4000,
}));

Funchat.listaPush(new Funchat({
	id: 'tsimbousi',
	img: 'pipaKaroto.gif',
	platos: 120,
	img2: 'pipaKaroto1.png',
	dur: 4000,
	ixos: 'tsibousiMale.mp3',
	entasi: 4,
}));

Funchat.listaPush(new Funchat({
	img: 'gelia.gif',
	platos: 120,
	img2: 'gelia1.png',
	dur: 4000,
}));

Funchat.listaPush(new Funchat({
	img: 'xekardismenoEmoticon.gif',
	img2: 'xekardismenoEmoticon1.png',
	dur: 4000,
}));

Funchat.listaPush(new Funchat({
	img: 'gelioEmoticon.gif',
	platos: 42,
	img2: 'gelioEmoticon1.png',
	dur: 4000,
}));

Funchat.omada++;

Funchat.listaPush(new Funchat({
	img: 'kota.gif',
	platos: 100,
	img2: 'kota1.png',
	dur: 4000,
	txt: 'Κο κο κο…',
}));

Funchat.listaPush(new Funchat({
	img: 'mesa.gif',
	platos: 240,
	img2: 'mesa1.png',
	dur: 8000,
}));

Funchat.listaPush(new Funchat({
	img: 'mlk.jpg',
	platos: 120,
	ixos: 'haveDream.ogg',
	entasi: 2,
}));

Funchat.listaPush(new Funchat({
	img0: 'maziCats.png',
	img: 'maziCats.gif',
	platos: 120,
	ixos: 'thaSeParo.mp3',
	entasi: 4,
	img2: 'ipopto1.png',
	platos2: 60,
	dur: 6000,
}));

Funchat.listaPush(new Funchat({
	img: 'tinPatisame.jpg',
	platos: 180,
	ixos: 'tinPatisame.mp3',
	entasi: 2,
}));

Funchat.listaPush(new Funchat({
	img: 'piravlos.png',
	platos: 180,
	dur: 8000,
	img2: 'piravlos1.png',
	ixos: 'piravlos.mp3',
	entasi: 10,
}));

Funchat.listaPush(new Funchat({
	img: 'nevrokavalikema.png',
	ixos: 'nevrokavalikema.mp3',
	txt: 'Πονάς;',
}));

Funchat.listaPush(new Funchat({
	img: 'tirania.png',
	dur: 4500,
	img2: 'tirania1.png',
	platos: 180,
	ixos: 'tirania.mp3',
	entasi: 10,
}));

Funchat.listaPush(new Funchat({
	img: 'oxiReSi.gif',
	img2: 'oxiReSi1.png',
	dur: 4000,
	txt: 'Όχι ρε πούτιν μου…',
}));

Funchat.listaPush(new Funchat({
	img: 'aomatos.jpg',
	platos: 120,
	ixos: 'aomatos.mp3',
}));

Funchat.listaPush(new Funchat({
	img: 'apoMatiaPosIse.png',
	ixos: 'apoMatiaPosIse.mp3',
	txt: 'Από μάτια πώς είσαι;',
}));

Funchat.listaPush(new Funchat({
	img: 'giatiEpexes.gif',
	img2: 'giatiEpexes1.png',
	dur: 4000,
	txt: 'Γιατί έπαιξες, ρε συ;',
}));

Funchat.listaPush(new Funchat({
	img: 'tsopaTsopa.gif',
	img2: 'tsopaTsopa1.png',
	dur: 4000,
	txt: 'Τσώπα, τσώπα…',
}));

Funchat.listaPush(new Funchat({
	img: 'ipemoni.gif',
	img2: 'ipemoni.png',
	platos: 240,
	ixos: 'ipemoni.mp3',
	entasi: 10,
	dur: 4300,
}));

Funchat.listaPush(new Funchat({
	img: 'theosSchoreston.png',
	ixos: 'theosSchoreston.mp3',
	txt: "Θεός σχωρέσ' τον!",
}));

Funchat.listaPush(new Funchat({
	img: 'gunFail.gif',
	img2: 'gunFail1.png',
	dur: 6000,
	platos: 240,
}));

Funchat.listaPush(new Funchat({
	img: 'fuckfuckfuck.gif',
	img2: 'fuckfuckfuck.jpg',
	platos: 320,
	dur: 10000,
}));

Funchat.listaPush(new Funchat({
	img: 'meSkisate.gif',
	img2: 'meSkisate1.png',
	dur: 4000,
	platos: 140,
}));

Funchat.listaPush(new Funchat({
	img: 'tonXeskises.png',
	ixos: 'tonXeskises.mp3',
	txt: 'Τώρα κλαίτε, ε;',
	platos: 140,
}));

Funchat.listaPush(new Funchat({
	img: 'meTipota.gif',
	img2: 'meTipota1.png',
	dur: 5000,
}));

Funchat.listaPush(new Funchat({
	img: 'zervos.jpg',
	platos: 100,
	txt: 'Ου να χαθείς!',
	ixos: 'ouNaXathis.mp3',
	entasi: 10,
}));

Funchat.listaPush(new Funchat({
	img: 'rebeskedes.png',
	txt: 'Ρεμπεσκέδες!',
	ixos: 'rebeskedes.mp3',
	platos: 250,
	entasi: 10,
}));

Funchat.listaPush(new Funchat({
	img: 'kilotes.png',
	txt: 'Είναι όλοι κιλότες!',
	ixos: 'kilotes.mp3',
	platos: 180,
	entasi: 8,
}));

Funchat.listaPush(new Funchat({
	img: 'anteGamithiteRe.gif',
	platos: 200,
	img2: 'anteGamithiteRe1.png',
	dur: 4000,
}));

Funchat.listaPush(new Funchat({
	id: 'miaZoiPlirono',
	img: 'anteGamithiteRe.gif',
	platos: 200,
	img2: 'miaZoiPlirono1.png',
	dur: 15600,
	ixos: 'miaZoiPlirono.mp3',
}));

Funchat.listaPush(new Funchat({
	img: 'diskoliStigmi.gif',
	platos: 240,
	ixos: 'diskoliStigmi.mp3',
	img2: 'diskoliStigmi.jpg',
	dur: 45000,
}));

Funchat.listaPush(new Funchat({
	img: 'popothatrelatho.gif',
	platos: 180,
	ixos: 'popothatrelatho.mp3',
	img2: 'popothatrelatho.jpg',
	dur: 14000,
	sxolio: 'Θα τρελαθώ!',
}));

Funchat.listaPush(new Funchat({
	id: 'katastrofi',
	img: 'popothatrelatho.gif',
	platos: 180,
	ixos: 'katastrofi.mp3',
	img2: 'popothatrelatho.jpg',
	dur: 7800,
	sxolio: 'Γεννήθηκες για την καταστοφή!',
}));

Funchat.listaPush(new Funchat({
	id: 'rimadio',
	img: 'popothatrelatho.gif',
	platos: 180,
	ixos: 'rimadio.mp3',
	img2: 'popothatrelatho.jpg',
	dur: 8100,
	sxolio: "Τα 'χεις κάνει ρημαδιό…",
}));

Funchat.listaPush(new Funchat({
	id: 'rezili',
	img: 'mesa.gif',
	platos: 180,
	ixos: 'rezili.mp3',
	img2: 'mesa1.png',
	dur: 7800,
	sxolio: 'Με ρεζίλεψες στην κοινωνία…',
}));

Funchat.listaPush(new Funchat({
	img: 'astrapesEmoticon.gif',
	img2: 'astrapesEmoticon1.png',
	dur: 4000,
	txt: '#!%@^&#*!@',
}));

Funchat.listaPush(new Funchat({
	img: 'bounidiEmoticon.gif',
	img2: 'bounidiEmoticon1.png',
	dur: 4000,
	txt: "Άμα σ' αρχίσω τώρα στα μπουνίδια θα φταίω;",
}));

Funchat.listaPush(new Funchat({
	img: 'exeteXesti.gif',
	platos: 200,
	img2: 'exeteXesti1.png',
	dur: 4000,
}));

Funchat.listaPush(new Funchat({
	img: 'tiGamisesTinPartida.gif',
	platos: 140,
	img2: 'tiGamisesTinPartida1.png',
	dur: 4000,
}));

Funchat.listaPush(new Funchat({
	img: 'tiKanisRe.gif',
	img2: 'tiKanisRe1.png',
	dur: 4000,
	platos: 70,
	txt: 'Τι έκανες ρε;',
}));

Funchat.listaPush(new Funchat({
	img: 'sfiriEmoticon.gif',
	img2: 'sfiriEmoticon1.png',
	dur: 4000,
	platos: 70,
}));

Funchat.listaPush(new Funchat({
	img: 'parathiro.gif',
	img2: 'parathiro1.png',
	dur: 2500,
	platos: 70,
	ixos: Client.server + 'sounds/tzamia.ogg',
	isterisi: 2200,
}));

Funchat.listaPush(new Funchat({
	img: 'aisxos.jpg',
	platos: 100,
	txt: 'Αίσχος!',
	ixos: 'aisxos.mp3',
}));

Funchat.listaPush(new Funchat({
	img: 'marinikol.gif',
	img2: 'marinikol1.png',
	dur: 4000,
	platos: 140,
}));

Funchat.listaPush(new Funchat({
	img: 'pexeBala.gif',
	img2: 'pexeBala1.png',
	dur: 10000,
	platos: 100,
	txt: 'Παίξε μπάλα ρε!',
}));

Funchat.listaPush(new Funchat({
	img: 'notaraTaTheli.jpg',
	platos: 120,
	ixos: 'taTheli.mp3',
}));

Funchat.listaPush(new Funchat({
	img: 'notaraSodoma.jpg',
	platos: 160,
	ixos: 'sodomaGomora.mp3',
	entasi: 7,
}));

Funchat.listaPush(new Funchat({
	img: 'kokiniKarta.jpg',
	ixos: Client.server + 'sounds/sfirixtra.ogg',
	platos: 120,
}));

Funchat.listaPush(new Funchat({
	img: 'thaTiFaskelona.png',
	ixos: 'thaTiFaskelona.mp3',
	txt: 'Λυπάμαι το φάσκελο…',
	platos: 100,
}));

Funchat.listaPush(new Funchat({
	img: 'bartAss.gif',
	img2: 'bartAss4.png',
	dur: 3200,
	ixos: 'klania.mp3',
	ixosDelay: 1600,
}));

Funchat.listaPush(new Funchat({
	img: 'mrBean.gif',
	img2: 'mrBean1.png',
	dur: 4000,
	platos: 140,
}));

Funchat.listaPush(new Funchat({
	img: 'epidixias.jpg',
	platos: 300,
}));

Funchat.omada++;

Funchat.listaPush(new Funchat({
	img: 'xmEmoticon.gif',
	img2: 'xmEmoticon1.png',
	dur: 4000,
}));

Funchat.listaPush(new Funchat({
	img: 'laptopEmoticon.gif',
	img2: 'laptopEmoticon1.png',
	dur: 4000,
}));

Funchat.listaPush(new Funchat({
	img: 'dikeoma.gif',
	img2: 'dikeoma1.png',
	dur: 9000,
	platos: 180,
	txt: 'Δικαίωμα…',
}));

Funchat.listaPush(new Funchat({
	img: 'tiEgineRePedia.gif',
	img2: 'tiEgineRePedia.png',
	dur: 9000,
	platos: 180,
	txt: 'Τι έγινε ρε παιδιά;',
}));

Funchat.listaPush(new Funchat({
	img: 'aporiaPokemon.gif',
	img2: 'aporiaPokemon1.png',
	dur: 4000,
}));

Funchat.listaPush(new Funchat({
	img: 'ipopto.gif',
	img2: 'ipopto1.png',
	dur: 4000,
	platos: 50,
}));

Funchat.listaPush(new Funchat({
	img: 'lesEmoticon.gif',
	img2: 'lesEmoticon1.png',
	dur: 4000,
	txt: 'Λες;',
}));

Funchat.listaPush(new Funchat({
	img: 'nailbiter.gif',
	img2: 'nailbiter1.png',
	dur: 4000,
}));

Funchat.listaPush(new Funchat({
	img: 'fox1.png',
	img2: 'fox2.png',
	platos: 300,
	dur: 4200,
	ixos: 'drumroll.mp3',
}));

Funchat.listaPush(new Funchat({
	img: 'toTrooToFaiMou.png',
	ixos: 'toTrooToFaiMou.mp3',
	txt: 'Θέλω τη μαμά μου!',
}));

Funchat.listaPush(new Funchat({
	img: 'tinEstise.gif',
	img2: 'tinEstise1.png',
	dur: 4000,
	txt: 'Την έστησε!!!',
}));

Funchat.listaPush(new Funchat({
	img: 'toMatiMou.gif',
	img2: 'toMatiMou1.png',
	dur: 2000,
	platos: 200,
}));

Funchat.listaPush(new Funchat({
	img: 'vegos.gif',
	dur: 4000,
	img2: 'vegos.png',
	platos: 200,
	ixos: Client.server + 'sounds/daiaiaing.ogg',
	ixosDelay: 1800,
}));

Funchat.listaPush(new Funchat({
	img: 'kirieTonDinameon.png',
	txt: 'Κύριε των δυνάμεων!',
	platos: 200,
	ixos: 'kirieTonDinameon.mp3',
}));

Funchat.listaPush(new Funchat({
	img: 'ohMyGod.gif',
	img2: 'ohMyGod1.png',
	dur: 4000,
	platos: 140,
}));

Funchat.listaPush(new Funchat({
	img: 'mavrosGourlomatis.gif',
	img2: 'mavrosGourlomatis1.png',
	dur: 4000,
}));

Funchat.listaPush(new Funchat({
	img: 'matia.gif',
	img2: 'matia1.png',
	dur: 4000,
	platos: 80,
}));

Funchat.listaPush(new Funchat({
	id: 'astoNaPai',
	txt: "Άσ' το πονάει, άσ'το!",
	img: 'astoNaPai.png',
	ixos: 'astoNaPai.mp3',
	platos: 200,
}));

Funchat.listaPush(new Funchat({
	img: 'kinezos.gif',
	img2: 'kinezos1.png',
	dur: 4000,
}));

Funchat.listaPush(new Funchat({
	img: 'ILoveUEmoticon.gif',
	img2: 'ILoveUEmoticon1.png',
	dur: 4000,
}));

Funchat.listaPush(new Funchat({
	img: 'vgika.gif',
	img2: 'vgika1.png',
	dur: 4000,
}));

Funchat.listaPush(new Funchat({
	id: 'vgikaIxos',
	img: 'vgika.gif',
	img2: 'vgika2.png',
	ixos: 'vgika.mp3',
	dur: 10800,
}));

Funchat.listaPush(new Funchat({
	id: 'bezos',
	img: 'xorosSpagato.gif',
	img2: 'xorosSpagato2.png',
	dur: 24200,
	ixos: 'bezos.mp3',
}));

Funchat.listaPush(new Funchat({
	img: 'skizoGates.png',
	ixos: 'skizoGates.mp3',
	txt: 'Σήμερα σκίζω γάτες!',
}));

Funchat.listaPush(new Funchat({
	img: 'mikes.png',
	platos: 260,
	ixos: 'mikes.mp3',
	txt: 'Ω, ρε, πού το πήγαινα…',
}));

Funchat.listaPush(new Funchat({
	img: 'snoopy.gif',
	img2: 'snoopy1.png',
	dur: 4000,
	platos: 70,
	txt: 'Τρέλα!',
}));

Funchat.listaPush(new Funchat({
	id: 'fouro',
	img: 'assWiggle.gif',
	img2: 'assWiggle1.png',
	dur: 12000,
	ixos: 'foustaFouro.mp3',
}));

Funchat.listaPush(new Funchat({
	img: 'oniroZo.png',
	ixos: 'oniroZo.mp3',
	txt: 'Όνειρο ζω!',
	platos: 120,
}));

Funchat.listaPush(new Funchat({
	img: 'egiptiakosXoros.gif',
	img2: 'egiptiakosXoros1.png',
	dur: 5000,
}));

Funchat.listaPush(new Funchat({
	img: 'soldierDance.gif',
	img2: 'soldierDance1.png',
	dur: 35000,
	platos: 80,
	ixos: 'clarinetitis.mp3',
}));

Funchat.listaPush(new Funchat({
	img: 'imeMegalos.gif',
	img2: 'imeMegalos1.png',
	dur: 4000,
}));

Funchat.listaPush(new Funchat({
	platos: 120,
	img: 'donGiovani.gif',
	ixos: 'donGiovani.mp3',
	img2: 'donGiovani.png',
	dur: 20000,
}));

Funchat.listaPush(new Funchat({
	img: 'soloDance.gif',
	img2: 'soloDance1.png',
	dur: 4000,
	ixos: 'machucando.mp3',
	img2: 'soloDance.jpg',
	dur: 27500
}));

Funchat.listaPush(new Funchat({
	img: 'spiderman.gif',
	img2: 'spiderman1.png',
	dur: 46000,
	ixos: 'jeannie.ogg',
}));

Funchat.listaPush(new Funchat({
	img: 'michaelJackson.gif',
	img2: 'michaelJackson1.png',
	dur: 8000,
	txt: 'Είμαι μεγάλος μάστορας!',
}));

Funchat.listaPush(new Funchat({
	img: 'imeApisteftos.gif',
	img2: 'imeApisteftos1.png',
	dur: 8000,
	txt: 'Είμαι απίστευτος!',
}));

Funchat.listaPush(new Funchat({
	img: 'xorosSpagato.gif',
	img2: 'xorosSpagato1.png',
	dur: 8000,
	platos: 32,
	txt: 'Τρελάθηκα τώρα!',
}));

Funchat.listaPush(new Funchat({
	img: 'gunPenis.gif',
	img2: 'gunPenis1.png',
	dur: 6000,
	platos: 300,
}));

Funchat.omada++;

Funchat.listaPush(new Funchat({
	img: 'toblerone.jpg',
	platos: 240,
	txt: 'Τον πλέρωνε…',
}));

Funchat.listaPush(new Funchat({
	img: 'cheersEmoticon.gif',
	img2: 'cheersEmoticon1.png',
	dur: 4000,
	platos: 120,
}));

Funchat.listaPush(new Funchat({
	img: 'mikiMaous.gif',
	img2: 'mikiMaus1.png',
	dur: 6000,
	platos: 100,
}));

Funchat.listaPush(new Funchat({
	img: 'thankYou.gif',
	img2: 'thankYou1.png',
	dur: 8000,
}));

Funchat.listaPush(new Funchat({
	img: 'pedakiMouEsi.jpg',
	platos: 140,
	ixos: 'pedakiMouEsi.mp3',
	txt: 'Παιδάκι μου, εσύ!',
}));

Funchat.listaPush(new Funchat({
	img: 'axtipitoDidimo.gif',
	img2: 'axtipitoDidimo1.png',
	dur: 6000,
	txt: 'Είμαστε αχτύπητο δίδυμο!',
}));

Funchat.listaPush(new Funchat({
	img: 'kalaPouMePires.gif',
	img2: 'kalaPouMePires1.png',
	dur: 10000,
}));

Funchat.listaPush(new Funchat({
	img: 'seLatrevo.gif',
	img2: 'seLatrevo1.png',
	dur: 4000,
	txt: 'Σε λατρεύω!',
}));

Funchat.listaPush(new Funchat({
	img: 'iseTromeros.gif',
	img2: 'iseTromeros1.png',
	dur: 5000,
}));

Funchat.listaPush(new Funchat({
	img: 'iseTerastios.gif',
	img2: 'iseTerastios1.png',
	dur: 7000,
	txt: 'Είσαι τεράστιος!',
}));

Funchat.listaPush(new Funchat({
	img: 'diCaprio.gif',
	img2: 'diCaprio1.png',
	platos: 120,
	dur: 6312,
	txt: 'Respect!'
}));

Funchat.listaPush(new Funchat({
	img: 'bingoPokemon.gif',
	img2: 'bingoPokemon1.png',
	dur: 4000,
	txt: 'Σωστόοοστ!',
}));

Funchat.listaPush(new Funchat({
	img: 'oliEfxaristimeni.gif',
	img2: 'oliEfxaristimeni1.png',
	dur: 4000,
	platos: 80,
}));

Funchat.listaPush(new Funchat({
	img: 'oliOk.gif',
	img2: 'oliOk1.png',
	dur: 4000,
	platos: 120,
	txt: 'Όλοι ευχαριστημένοι!',
}));

Funchat.listaPush(new Funchat({
	img: 'telia.gif',
	img2: 'telia1.png',
	dur: 6000,
}));

Funchat.listaPush(new Funchat({
	img: 'bravoEmoticon.gif',
	img2: 'bravoEmoticon1.png',
	dur: 4000,
}));

Funchat.listaPush(new Funchat({
	img: 'omorfantraMou.png',
	platos: 100,
	ixos: 'omorfantraMou.ogg',
}))

Funchat.listaPush(new Funchat({
	img: 'kino.gif',
	img2: 'kino1.png',
	dur: 4000,
}));

Funchat.omada++;

Funchat.listaPush(new Funchat({
	img: 'pouPame.jpg',
	platos: 180,
	ixos: 'pouPame.ogg',
}));

Funchat.listaPush(new Funchat({
	img: 'pouVadizoume.jpg',
	platos: 140,
	ixos: 'pouVadizoume.mp3',
}));

Funchat.listaPush(new Funchat({
	img: 'staExigoOrea.jpg',
	platos: 200,
	ixos: 'alefantos.mp3',
}));

Funchat.listaPush(new Funchat({
	img: 'ipoklinome.gif',
	img2: 'ipoklinome1.png',
	dur: 5000,
	platos: 30,
	ixos: 'panos.mp3',
}));

Funchat.listaPush(new Funchat({
	img: 'oops.png',
	img2: 'misdoubt.png',
	dur: 3000,
	platos: 30,
	ixos: 'panoulisSkandinavia.mp3',
	entasi: 8,
	txt: 'Κοίτα ρε τον Πανούλη…',
}));

Funchat.listaPush(new Funchat({
	id: 'panoulisMari',
	img: 'iligos.gif',
	img2: 'eek.png',
	dur: 8200,
	ixos: 'panoulisMari.mp3',
	entasi: 8,
	platos: 50,
	txt: 'Αααχ…',
}));

Funchat.omada++;

Funchat.listaPush(new Funchat({
	img: 'nop.gif',
	img2: 'nop1.png',
	dur: 4000,
}));

Funchat.listaPush(new Funchat({
	img: 'xipna.gif',
	img2: 'xipna1.png',
	dur: 4000,
	platos: 180,
	txt: 'Ξύπνα ρεεε!',
	ixos: Client.server + 'sounds/bell.ogg',
	entasi: 15,
	isterisi: 800,
}));

Funchat.listaPush(new Funchat({
	img: 'misoLepto.gif',
	img2: 'misoLepto1.png',
	dur: 8000,
	txt: 'Μισό…',
	platos: 80,
}));

Funchat.listaPush(new Funchat({
	img: 'ImBack.gif',
	img2: 'ImBack1.png',
	dur: 4000,
	platos: 80,
}));

Funchat.listaPush(new Funchat({
	img: 'daffyPhone.gif',
	img2: 'daffyPhone1.png',
	dur: 9000,
	txt: 'Μισό λεπτό, μιλάω στο τηλέφωνο…',
	platos: 80,
}));

Funchat.listaPush(new Funchat({
	img: 'kalimeraEmoticon.gif',
	img2: 'kalimeraEmoticon1.png',
	dur: 3900,
}));

Funchat.listaPush(new Funchat({
	img: 'goodNight.gif',
	img2: 'goodNight1.png',
	dur: 4000,
}));
