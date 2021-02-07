Movie.panel = new BPanel();
Movie.panel.omadaMax = 1;

Movie.playTimerClear = function() {
	if (!Movie.playTimer)
	return Movie;

	clearInterval(Movie.playTimer);
	delete Movie.playTimer;
	Movie.panelPlayButton.pbuttonRefresh();
	return Movie;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Movie.panel.bpanelButtonPush(Movie.panelPlayButton = new PButton({
	omada: 1,
	refresh: function() {
		if (Movie.playTimer) {
			this.pbuttonIconGetDOM().attr('src', '../ikona/movie/pause.png');
			this.pbuttonGetDOM().attr('title', 'Pause');
		}
		else {
			this.pbuttonIconGetDOM().attr('src', '../ikona/movie/play.png');
			this.pbuttonGetDOM().attr('title', 'Replay');
		}
	},
	click: function(e) {
		var button = this;

		if (Movie.playTimer) {
			Movie.playTimerClear();
		}
		else {
			if (Movie.panelEnergiaNextButton.click())
			Movie.playTimer = setInterval(function() {
				Movie.panelEnergiaNextButton.click();
			}, Movie.duration.replay);
		}
		this.pbuttonRefresh();
	},
}));

Movie.panel.bpanelButtonPush(new PButton({
	id: 'dianomiNext',
	omada: 1,
	img: '../ikona/movie/fwd.png',
	title: 'Επόμενη διανομή',
	click: function(e) {
		Movie.playTimerClear();
		Movie.dianomiIndex++;

		if (Movie.dianomiIndex >= Movie.trapezi.dianomiArray.length) {
			Movie.dianomiIndex--;
			return;
		}

		Movie.
		bazaClearDOM().
		displayDianomi();
	},
}));

Movie.panel.bpanelButtonPush(Movie.panelEnergiaNextButton = new PButton({
	omada: 1,
	img: '../ikona/movie/end.png',
	title: 'Επόμενη κίνηση',
	click: function(e) {
		var elist, energia, fasi, idos;

		if (e && Movie.playTimer)
		return Movie.playTimerClear();

		if (!Movie.dianomi)
		return false;

		if (Movie.bazaEkremis) {
			Movie.pareBaza(Movie.trapezi.partidaBazaPios(true));
			return true;
		}

		elist = Movie.dianomi.energiaArray;

		Movie.energiaIndex++;
		if (Movie.energiaIndex >= elist.length) {
			Movie.energiaIndex--;
			Client.sound.beep();
			Movie.playTimerClear();
			return false;
		}

		energia = elist[Movie.energiaIndex];
		Movie.trapezi.trapeziProcessEnergia(energia);

		fasi = Movie.trapezi.partidaFasiGet();
		idos = energia.energiaIdosGet();
console.log('STEP FORWARD: φάση', fasi, 'είδος', idos);

		Movie.displayAkirotis(energia);

		switch (idos) {
		case 'ΦΥΛΛΟ':
			Movie.pexeFilo(energia, fasi);
			return true;
		case 'FLOP':
			Movie.anixeTzogo();
			return true;
		case 'CLAIM':
			Movie.requestClaim(energia);
			return true;
		}

		switch (fasi) {
		case 'ΑΛΛΑΓΗ':
			if (idos === 'ΔΗΛΩΣΗ') {
				Movie.pareTzogo();
				return true;
			}
			break;
		case 'ΠΛΗΡΩΜΗ':
			Movie.trapezi.partidaReplay({eoske:Movie.dianomi.dianomiKodikosGet()});
			break;
		}

		Movie.displayPartida();
		return true;
	},
}));

Movie.panel.bpanelButtonPush(Movie.panelEnergiaPrevButton = new PButton({
	omada: 1,
	img: '../ikona/movie/start.png',
	title: 'Προηγούμενη κίνηση',
	click: function(e) {
		var elist, i, fasi, idos;

		Movie.playTimerClear();
		if (!Movie.dianomi)
		return;

		delete Movie.bazaEkremis;
		elist = Movie.dianomi.energiaArray;

		Movie.energiaIndex--;
		if (Movie.energiaIndex < 0) {
			Movie.energiaIndex++;
			Client.sound.beep();
			return;
		}

		Movie.trapezi.partidaReplay({eosxoris:Movie.dianomi.dianomiKodikosGet()});
		for (i = 0; i <= Movie.energiaIndex; i++) {
			energia = elist[i];
			Movie.trapezi.trapeziProcessEnergia(energia);
		}

		fasi = Movie.trapezi.partidaFasiGet();
		idos = energia.energiaIdosGet();
console.log('STEP BACKWARDS: φάση', fasi, 'είδος', idos);

		Movie.displayAkirotis(energia);

		switch (fasi) {
		case 'ΑΛΛΑΓΗ':
			if (idos === 'ΔΗΛΩΣΗ')
			return Movie.panelEnergiaPrevButton.click();
		}

		Movie.
		bazaClear().
		displayPartida();
	},
}));

Movie.panel.bpanelButtonPush(new PButton({
	id: 'dianomiPrev',
	omada: 1,
	img: '../ikona/movie/rew.png',
	title: 'Προηγούμενη διανομή',
	click: function(e) {
		Movie.playTimerClear();
		if (Movie.dianomiIndex <= 0)
		return;

		Movie.dianomiIndex--;
		Movie.
		bazaClearDOM().
		displayDianomi();
	},
}));

Movie.panel.bpanelButtonPush(new PButton({
	omada: 1,
	img: '../ikona/movie/trapoula.png',
	title: 'Αλλαγή τράπουλας',
	click: function(e) {
		var family;

		switch (filajs.cardFamilyGet()) {
		case 'aguilar':
			filajs.cardFamilySet('classic');
			break;
		case 'classic':
			filajs.cardFamilySet('nicubunu');
			break;
		case 'nicubunu':
			filajs.cardFamilySet('ilias');
			break;
		case 'ilias':
			filajs.cardFamilySet('jfitz');
			break;
		default:
			filajs.cardFamilySet('aguilar');
			break;
		}

		Movie.displayDianomi();

		family = filajs.cardFamilyGet();
		$.ajax('../lib/session.php', {data:{trapoula:family}});

		if (Client.isPektis())
		Client.skiserService('peparamSet', 'param=ΤΡΑΠΟΥΛΑ', 'timi=' + family);
	},
}));

Movie.panel.bpanelButtonPush(new PButton({
	id: 'tzogosAniktos',
	omada: 1,
	img: '../ikona/movie/tzogosAniktos.png',
	title: 'Τζόγος φανερός',
	check: function() {
		return !Movie.tzogosFaneros;
	},
	click: function(e) {
		Movie.tzogosFaneros = true;
		Movie.tzogos.
		cardWalk(function() {
			this.
			faceUp().
			domRefresh();
		});

		this.pbuttonPanelGet().bpanelRefresh();
	},
}));

Movie.panel.bpanelButtonPush(new PButton({
	id: 'tzogosKlistos',
	omada: 1,
	img: '../ikona/movie/tzogosKlistos.png',
	title: 'Τζόγος κρυφός',
	check: function() {
		return Movie.tzogosFaneros;
	},
	click: function(e) {
		Movie.tzogosFaneros = false;
		Movie.tzogos.
		cardWalk(function() {
			this.
			faceDown().
			domRefresh();
		});

		this.pbuttonPanelGet().bpanelRefresh();
	},
}));

Movie.panel.bpanelButtonPush(new PButton({
	id: 'klistaWE',
	omada: 1,
	img: '../ikona/movie/tzogosKlistos.png',
	refresh: function() {
		if (Movie.isKlista23()) {
			this.pbuttonIconGetDOM().attr('src', '../ikona/trapoula/CQ.png');
			this.pbuttonGetDOM().attr('title', 'Άνοιγμα φύλλων Ανατολής και Δύσης');
		}
		else {
			this.pbuttonIconGetDOM().attr('src', '../ikona/trapoula/BV.png');
			this.pbuttonGetDOM().attr('title', 'Απόκρυψη φύλλων Ανατολής και Δύσης');
		}

		return this;
	},
	click: function(e) {
		Movie.klistaWE = !Movie.klistaWE;
		Movie.displayFila();
		this.refresh();
	},
}));

Movie.replayPiravlosMap = {
	3000: 2500,
	2500: 2100,
	2100: 1800,
	1800: 1500,
	1500: 1200,
	1200: 1000,
	1000: 800,
	800: 600,
	600: 300,
	300: 300,
};

Movie.replayXelonakiMap = {};
(function() {
	var i, val, max = 0;

	for (i in Movie.replayPiravlosMap) {
		i = parseInt(i);
		val = Movie.replayPiravlosMap[i];
		if (i === val)
		continue;

		Movie.replayXelonakiMap[val] = i;
		if (i > max)
		max = i;
	}

	Movie.replayXelonakiMap[max] = max;
})();

Movie.panel.bpanelButtonPush(Movie.panelPiravlosButton = new PButton({
	omada: 1,
	img: '../ikona/movie/piravlos.png',
	title: 'Επιτάχυνση',
	refresh: function() {
		if (Movie.duration.replay > Movie.duration.replayDefault)
		this.pbuttonGetDOM().addClass('panelButtonEkremes');

		else
		this.pbuttonGetDOM().removeClass('panelButtonEkremes');
	},
	click: function(e) {
		Movie.duration.replay = Movie.replayPiravlosMap[Movie.duration.replay];
		Movie.panelTaxititaSet();
	},
}));

Movie.panel.bpanelButtonPush(Movie.panelXelonakiButton = new PButton({
	omada: 1,
	img: '../ikona/movie/xelonaki.png',
	title: 'Επιβράδυνση',
	refresh: function() {
		if (Movie.duration.replay < Movie.duration.replayDefault)
		this.pbuttonGetDOM().addClass('panelButtonEkremes');

		else
		this.pbuttonGetDOM().removeClass('panelButtonEkremes');
	},
	click: function(e) {
		Movie.duration.replay = Movie.replayXelonakiMap[Movie.duration.replay];
		Movie.panelTaxititaSet();
	},
}));

Movie.panelTaxititaSet = function() {
	Movie.panelXelonakiButton.pbuttonRefresh();
	Movie.panelPiravlosButton.pbuttonRefresh();

	if (!Movie.playTimer)
	return;

	clearInterval(Movie.playTimer);
	Movie.playTimer = setInterval(function() {
		Movie.panelEnergiaNextButton.click();
	}, Movie.duration.replay);
};
