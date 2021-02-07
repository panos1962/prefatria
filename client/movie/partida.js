Movie.displayPartida = function() {
	Movie.
	displayEpomenos().
	displayKapikia().
	displayAgora().
	displayFila().
	displayBazes().
	displayTzogos().
	displayBaza();
};

Movie.displayKapikia = function(thesi) {
	var iseht, dilosi, paso, simetoxi;

	if (thesi === undefined)
	return Movie.thesiWalk(function(thesi) {
		Movie.displayKapikia(thesi);
	});

	iseht = Movie.thesiMap(thesi);

	Movie.kapikiaDOM[iseht].
	removeClass().
	empty();

	kapikia = Movie.trapezi.partidaKapikiaGet(thesi);
	if (!kapikia)
	return Movie;

	Movie.kapikiaDOM[iseht].
	addClass('kapikia').
	text(kapikia);

	if (kapikia < 0)
	Movie.kapikiaDOM[iseht].
	addClass('kapikiaMion');

	return Movie;
};

Movie.displayAgora = function(thesi) {
	var iseht, dilosi, paso, simetoxi;

	if (thesi === undefined)
	return Movie.thesiWalk(function(thesi) {
		Movie.displayAgora(thesi);
	});

	iseht = Movie.thesiMap(thesi);

	Movie.filaDOM[iseht].
	removeClass().
	addClass('fila');

	Movie.agoraDOM[iseht].
	removeClass().
	addClass('agora').
	empty();

	Movie.dilosiDOM[iseht].
	removeClass().
	addClass('dilosi').
	empty();

	Movie.pektisDOM[iseht].children('.movieMazi').remove();

	if (thesi == Movie.trapezi.partidaTzogadorosGet()) {
		if (Movie.trapezi.partidaIsAgora()) {
			dilosi = Movie.trapezi.partidaAgoraGet();
			Movie.agoraDOM[iseht].
			addClass('movieDilosiAgora');
		}
		else {
			dilosi = Movie.trapezi.adilosi[thesi];
			Movie.agoraDOM[iseht].
			addClass('movieDilosiTzogadoros');
		}
	}
	else {
		dilosi = Movie.trapezi.adilosi[thesi];
	}

	if (dilosi)
	Movie.agoraDOM[iseht].
	addClass('movieDilosiOxiPaso').
	append(dilosi.dilosiDOM());

	paso = Movie.trapezi.apaso[thesi];
	if (paso) {
		if (Movie.agoraDOM[iseht].text())
		Movie.agoraDOM[iseht].
		addClass('movieDilosiPaso');

		Movie.dilosiDOM[iseht].
		addClass('movieDilosiPaso').
		text('ΠΑΣΟ');
	}

	simetoxi = Movie.trapezi.sdilosi[thesi];
	if (simetoxi) {
		Movie.dilosiDOM[iseht].removeClass().addClass('dilosi').empty();
		if (simetoxi.simetoxiIsPaso()) {
			Movie.dilosiDOM[iseht].addClass('tsoxaPektisSimetoxiPaso').text('ΠΑΣΟ');
			Movie.filaDOM[iseht].addClass('filaPaso');
		}
		else if (simetoxi.simetoxiIsPezo())
		Movie.dilosiDOM[iseht].addClass('tsoxaPektisSimetoxiPezo').text('ΠΑΙΖΩ');
		else if (simetoxi.simetoxiIsMazi()) {
			Movie.dilosiDOM[iseht].
			addClass('tsoxaPektisSimetoxiMazi').text('ΜΑΖΙ');

			Movie.pektisDOM[iseht].
			append($('<img>').
			addClass('moviePektisEndixi movieMazi movieMazi' + iseht).
			attr({
				src: '../ikona/endixi/mazi.png',
				title: 'Πήρε τον συμπαίκτη μαζί',
			}));
		}
		else if (simetoxi.simetoxiIsVoithao())
		Movie.dilosiDOM[iseht].addClass('tsoxaPektisSimetoxiPezo').text('ΒΟΗΘΑΩ');
		else if (simetoxi.simetoxiIsMonos())
		Movie.dilosiDOM[iseht].addClass('tsoxaPektisSimetoxiMonos').text('ΜΟΝΟΣ');
	}

	switch (Movie.trapezi.partidaFasiGet()) {
	case 'ΠΑΙΧΝΙΔΙ':
	case 'ΠΛΗΡΩΜΗ':
		if (Movie.trapezi.bazaCount > 0)
		Movie.dilosiDOM[iseht].
		addClass('movieDilosiAorati');
		break;
	}

	return Movie;
};

Movie.displayFila = function(thesi) {
	var iseht, fila, anikta, pos = {};

	if (thesi === undefined)
	return Movie.thesiWalk(function(thesi) {
		Movie.displayFila(thesi);
	});

	iseht = Movie.thesiMap(thesi);

	if ((Movie.trapezi.partidaFasiGet() === 'CLAIM') && (thesi == Movie.trapezi.partidaTzogadorosGet())) {
		if (iseht === 1)
		pos.top = '-187px';

		else
		pos.bottom = '-190px';

		switch (iseht) {
		case 2:
			pos.left = '-178px';
			break;
		case 3:
			pos.left = '184px';
			break;
		}
	}
	else {
		pos = {
			left: '2px',
		};
		switch (iseht) {
		case 2:
		case 3:
			pos['bottom'] = '0px';
			break;
		default:
			pos['top'] = '0px';
			break;
		}
	}

	Movie.filaDOM[iseht].
	css(pos).
	empty();

	anikta = ((iseht === 1) || Movie.oxiKlista23());

	fila = new filajsHand(Movie.trapezi.fila[thesi].xartosia2string());

	if (anikta)
	fila.sort();

	else
	fila.shuffle();

	fila.
	baselineSet(iseht === 1 ? 'T' : 'B').
	alignmentSet('C').
	domCreate();

	if (fila.cardsCount() > 10)
	fila.shiftxSet(0.23);

	Movie.filaDOM[iseht].
	append(fila.domGet());

	fila.
	cardWalk(function() {
		this.
		faceSet(anikta).
		domCreate().
		domRefresh();
	}).
	domRefresh();

	Movie.fila[thesi] = fila;
	return Movie;
};

Movie.displayBazes = function(thesi) {
	var iseht, count, i;

	if (thesi === undefined)
	return Movie.thesiWalk(function(thesi) {
		Movie.displayBazes(thesi);
	});

	iseht = Movie.thesiMap(thesi);
	Movie.bazesDOM[iseht].empty();

	count = Movie.trapezi.bazes[thesi];
	if (!count)
	return Movie;

	while (count-- > 0)
	Movie.bazesDOM[iseht].
	append($('<div>').addClass('bazaPektis bazaKlisti bazaXroma' + (parseInt(count / 3) % 2)));

	return Movie;
};

Movie.displayTzogos = function() {
	$('#movieTzogos').
	remove();

	switch (Movie.trapezi.partidaFasiGet()) {
	case 'ΔΙΑΝΟΜΗ':
	case 'ΔΗΛΩΣΗ':
		break;
	default:
		return Movie;
	}

	Movie.tzogos = new filajsHand(Movie.trapezi.tzogos.xartosia2string());

	Movie.tzogos.
	cardWalk(function() {
		this.
		faceSet(Movie.tzogosFaneros).
		domCreate().
		domRefresh();
	}).
	sort().
	baselineSet('M').
	alignmentSet('C').
	archSet(2).
	domCreate();

	Movie.tsoxaDOM.
	append(Movie.tzogos.domGet().
	attr('id', 'movieTzogos').
	on('click', function(e) {
		Movie.tzogosFaneros = !Movie.tzogosFaneros;

		Movie.tzogos.
		cardWalk(function() {
			this.
			faceSet(Movie.tzogosFaneros).
			domRefresh();
		});
		Movie.panel.bpanelButtonGet('tzogosAniktos').pbuttonDisplay();
		Movie.panel.bpanelButtonGet('tzogosKlistos').pbuttonDisplay();
	}));
	Movie.tzogos.domRefresh();

	return Movie;
};

Movie.displayBaza = function() {
	var i, iseht, pios, fila;

	if (!Movie.baza)
	return Movie;

	if (Movie.bazaEkremis) {
		pios = Movie.trapezi.azabPios;
		fila = Movie.trapezi.azabFila;
	}
	else {
		pios = Movie.trapezi.bazaPios;
		fila = Movie.trapezi.bazaFila;
	}

	for (i = 0; i < pios.length; i++) {
		iseht = Movie.thesiMap(pios[i]);
		Movie.baza.
		cardPush(new filajsCard(fila[i].filo2string()).domCreate().domRefresh()).
		circlePush($('#filajsCircle3' + iseht));
	}

	Movie.baza.domRefresh();

	return Movie;
};

Movie.displayAkirotis = function(energia) {
	$('.akirosi').removeClass('akirosi');
	if (energia.hasOwnProperty('akirotis')) {
		Movie.pektisDOM[Movie.thesiMap(parseInt(energia.akirotis))].addClass('akirosi');
		Movie.displayPartida();
	}

	return Movie;
};
