Movie.duration = {
	tzogos: 400,
	filo: 400,
	baza: 400,
	bazaDelay: 1000,
	claim: 400,
	replayDefault: 1000,
};
Movie.duration.replay = Movie.duration.replayDefault;

Movie.pareTzogo = function() {
	var tzogadoros, count;

	tzogadoros = Movie.trapezi.partidaTzogadorosGet();
	Movie.displayAgora();

	count = 0;
	Movie.tzogos.
	cardWalk(function(i) {
		if (Movie.oxiKlista23())
		this.
		faceUp().
		domRefresh();

		Movie.tzogos.
		cardAnimate(i, Movie.fila[tzogadoros], {
			duration: Movie.duration.tzogos,
			sort: true,
			callback: function() {
				if (++count === 2)
				Movie.panelEnergiaNextButton.click();
			},
		});
	});
};

Movie.anixeTzogo = function() {
	Movie.tzogos.
	cardWalk(function(i) {
		this.
		faceUp().
		domRefresh();
	});
};

Movie.pexeFilo = function(energia, fasi) {
	var pektis, filo, fila, iseht;

	pektis = energia.energiaPektisGet();
	filo = energia.energiaDataGet();

	fila = Movie.fila[pektis];
	for (i = 0; i < fila.cardArray.length; i++) {
		if (fila.cardArray[i].toString() === filo)
		break;
	}

	if (i >= fila.cardArray.length)
	return;

	fila.cardArray[i].
	faceUp().
	domRefresh();

	if (Movie.trapezi.bazaFila.length === 1)
	Movie.bazaClear();

	iseht = Movie.thesiMap(pektis);
	Movie.baza.
	circlePush($('#filajsCircle3' + iseht));

	fila.cardAnimate(i, Movie.baza, {
		duration: Movie.duration.filo,
		callback: function() {
			Movie.
			displayFila();

			Movie.baza.domRefresh();

			if (Movie.trapezi.bazaPios.length)
			return;

			Movie.bazaEkremis = true;
		},
	});
};

Movie.pareBaza = function(pektis) {
	var baza, iseht, bazesDOM, bazaPektis, count;

	iseht = Movie.thesiMap(pektis);
	bazesDOM = Movie.bazesDOM[iseht];

	bazaPektis = new filajsHand().
	circleSet($('#filajsCircle11')).
	alignmentSet(iseht === 2 ? 'L' : 'R').
	domCreate();

	bazaPektis.
	domGet().
	appendTo(bazesDOM);

	baza = Movie.baza;
	dom = baza.domGet();
	count = baza.cardsCount();
	baza.
	cardWalk(function(i) {
/*
		try {
			this.
			domGet().
			addClass('bazaKlisti bazaXroma0').
			children().
			remove();
		} catch (e) {
			count--;
			return;
		}
*/

		baza.
		cardAnimate(i, bazaPektis, {
			duration: Movie.duration.baza,
			width: 14,
			callback: function() {
				count--;
				if (count > 0)
				return;

				delete Movie.bazaEkremis;
				dom.remove();
				if (Movie.trapezi.partidaFasiGet() === 'ΠΛΗΡΩΜΗ')
				Movie.trapezi.partidaReplay({eoske:Movie.dianomi.dianomiKodikosGet()});
				Movie.displayPartida();
			},
		});
	});
};

Movie.requestClaim = function(energia) {
	var pektis, iseht, baza, x, animate = {};

	pektis = energia.energiaPektisGet();
	iseht = Movie.thesiMap(pektis);
	baza = Movie.filaDOM[iseht];

	if (iseht === 1)
	animate.top = '-=187px';

	else
	animate.bottom = '-=190px';

	switch (iseht) {
	case 2:
		animate.left = '-=180px';
		break;
	case 3:
		animate.left = '+=182px';
		break;
	}

	baza.animate(animate, Movie.duration.claim);
};
