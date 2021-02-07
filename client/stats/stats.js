var Stats = {
	elist: [],
	ximeromaOra: 6,
	urlPektis: '',
	urlEtos: '',
	paso: true,
	oxipaso: true,
	idos: 'katataxi',
	dianomesMin: 3000,
};

$(document).ready(function() {
	Client.
	tabKlisimo().
	tabPektis();

	Stats.
	kritiriaSetup().
	katataxiSetup().
	stisimoSetup().
	chartistSetup().
	dataGet();
});

Stats.kritiriaSetup = function() {
	var etosDOM, pasoDOM, panelDOM;

	Client.ofelimoDOM.
	append($('<div>').attr('id', 'kritiria').
	append($('<table>').
	append($('<tr>').
	append(etosDOM = $('<td>')).
	append(pasoDOM = $('<td>')).
	append(filtroDOM = $('<td>')).
	append(panelDOM = $('<td>')))));

	Stats.
	etosSetup(etosDOM).
	pasoSetup(pasoDOM).
	idosSetup(pasoDOM).
	filtroSetup(filtroDOM).
	panelSetup(panelDOM);

	return Stats;
};

// Η function "etosSetup" διαμορφώνει τα χρονολογικά κατ' έτος κριτήρια επιλογής
// παρτίδων. By default είναι επιλεγμένα τα δύο πιο πρόσφατα έτη, ενώ παρέχεται
// πλήκτρο επιλογής/αποεπιλογής όλων των ετών.

Stats.etosSetup = function(dom) {
	var i, earray, elist, etosDOM;

	dom.css('vertical-align', 'top');

	if (!Stats.elist.length)
	return Stats;

	$('<div>').addClass('epilogi epilogiNo').
	on('click', function() {
		Stats.etosToggle(dom, $(this), true);
	}).
	appendTo(dom);

	earray = [];

	if (Stats.urlEtos) {
		elist = {};
		earray = Stats.urlEtos.split(' ');

		for (i = 0; i < earray.length; i++)
		elist[earray[i]] = 1;
	}

	for (i = 0; i < Stats.elist.length; i++) {
		etosDOM = $('<div>').addClass('etos epilogi').text(Stats.elist[i]).
		on('click', function() {
			Stats.etosToggle(dom, $(this));
		}).
		appendTo(dom);

		if (earray.length) {
			if (elist.hasOwnProperty(Stats.elist[i]))
			etosDOM.addClass('epilogiYes');

			else
			etosDOM.addClass('epilogiNo');
		}

		else if (i < 2)
		etosDOM.addClass('epilogiYes');

		else
		etosDOM.addClass('epilogiNo');
	}

	return Stats;
};

// Η function "etosToggle" καλείται στο click επιλογής έτους. Υπάρχει διαφοροποίηση
// στο πλήκτρο επιλογής όλων των ετών, όπου εάν γίνει επιλογή επιλέγονται όλα τα
// έτη, ενώ αν γίνει αποεπιλογή επιλέγονται τα δύο πιο πρόσφατα έτη.

Stats.etosToggle = function(enotita, dom, ola) {
	var yes, elist;

	if (Stats.running)
	return;


	// Ελέγχουμε αν πρόκειται για επιλογή ή αποεπιλογή.

	yes = dom.hasClass('epilogiNo');

	// Κάνουμε την εναλλαγή στο τρέχον στοιχείο επιλογής, είτε πρόκειται για
	// μεμονωμένο έτος, είτε πρόκειται για το πλήκτρο καθολικής επιλογής.

	if (yes)
	dom.removeClass('epilogiNo').addClass('epilogiYes');

	else
	dom.removeClass('epilogiYes').addClass('epilogiNo');

	elist = enotita.find('.epilogi');

	// Αν το click αφορά σε κάποιο μεμονωμένο έτος, τότε κάνουμε αποεπιλογή
	// στο πλήκτρο καθολικής επιλογής. Αυτά τα κόλπα δεν είναι σημαντικά,
	// ωστόσο διευκολύνουν τους χειρισμούς του χρήστη.

	if (!ola)
	return elist.first().removeClass('epilogiYes').addClass('epilogiNo');

	// Αν έχει γίνει click επιλογής στο πλήκτρο καθολικής επιλογής, τότε
	// κάνουμε επιλογή σε όλα τα πλήκτρα.

	if (yes)
	return elist.removeClass('epilogiNo').addClass('epilogiYes');

	// Έχει γίνει click αποεπιλογής στο πλήκτρο καθολικής επιλογής, επομένως
	// αποεπιλέγουμε όλα τα έτη…

	elist.removeClass('epilogiYes').addClass('epilogiNo');

	// …και επανεπιλέγουμε τα δύο πιο πρόσφατα έτη.

	if (elist.length > 1)
	$(elist.get(1)).removeClass('epilogiNo').addClass('epilogiYes');

	if (elist.length > 2)
	$(elist.get(2)).removeClass('epilogiNo').addClass('epilogiYes');
};

Stats.etosWalk = function(callback) {
	$('.etos.epilogiYes').each(function() {
		callback(parseInt($(this).text()));
		return true;
	});

	return Stats;
};

// Η function "pasoSetup" διαμορφώνει τα κριτήρια επιλογής με βάση το αν παίζεται
// ή όχι το πάσο. Οι επιλογές είναι οι εξής:
//
//	Μόνο παρτίδες στις οποίες παίζεται το πάσο.
//
//	Μόνο παρτίδες στις οποίες δεν παίζεται το πάσο.
//
//	Όλες οι παρτίδες ανεξαρτήτως αν παίζεται ή όχι το πάσο.

Stats.pasoSetup = function(dom) {
	var pasoDOM, oxiPasoDOM;

	dom.css('vertical-align', 'top');

	pasoDOM = $('<div>').addClass('paso epilogi epilogi' + (Stats.paso ? 'Yes' : 'No')).
	text('Παίζεται το ΠΑΣΟ').
	on('click', function() {
		Stats.pasoToggle($(this), oxiPasoDOM);
	}).
	appendTo(dom);

	oxiPasoDOM = $('<div>').addClass('oxiPaso epilogi epilogi' + (Stats.oxipaso ? 'Yes' : 'No')).
	text('Δεν παίζεται το ΠΑΣΟ').
	on('click', function() {
		Stats.pasoToggle($(this), pasoDOM);
	}).
	appendTo(dom);

	return Stats;
};

// Η function "pasoToggle" καλείται για τις επιλογές που αφορούν στο αν παίζεται
// ή όχι το πάσο. Ως πρώτη παράμετρο περνάμε το πεδίο επιλογής/αποεπιλογής και ως
// δεύτερη παράμετρο περνάμε το έτερο πεδίο.

Stats.pasoToggle = function(dom, alo) {
	if (Stats.running)
	return;

	if (dom.hasClass('epilogiNo'))
	return dom.removeClass('epilogiNo').addClass('epilogiYes');

	dom.removeClass('epilogiYes').addClass('epilogiNo');

	// Έχει γίνει αποεπιλογή οπότε φροντίζουμε να επιλέξουμε το έτερο πεδίο,
	// ώστε να υπάρχει επιλεγμένο τουλάχιστον ένα από τα δύο πεδία.

	alo.removeClass('epilogiNo').addClass('epilogiYes');
};

Stats.isPaso = function() {
	return $('.paso.epilogiYes').length;
}

Stats.isOxiPaso = function() {
	return $('.oxiPaso.epilogiYes').length;
}

Stats.idosSetup = function(dom) {
	var kdom, sdom;

	dom.css('vertical-align', 'top').

	append(kdom = $('<div>').addClass('katataxi epilogi epilogi' + (Stats.idos === 'katataxi' ? 'Yes' : 'No')).
	text('Κατάταξη παικτών').
	on('click', function() {
		Stats.idosToggle($(this), sdom);
	})).

	append(sdom = $('<div>').addClass('stisimo epilogi epilogi' + (Stats.idos === 'stisimo' ? 'Yes' : 'No')).
	text('Χρονική κατανομή').
	on('click', function() {
		Stats.idosToggle($(this), kdom);
	}));

	return Stats;
};

Stats.idosToggle = function(dom, alo) {
	if (Stats.running)
	return Stats;

	switch (Stats.idos) {
	case 'katataxi':
		Stats.idos = 'stisimo';
		Stats.pektesDOM.css('display', 'none');
		Stats.dianomesDOM.css('display', 'none');
		Stats.katataxiDOM.css('display', 'none');
		Stats.stisimoDOM.css('display', 'block');
		break;
	default:
		Stats.idos = 'katataxi';
		Stats.pektesDOM.css('display', 'block');
		Stats.dianomesDOM.css('display', 'block');
		Stats.katataxiDOM.css('display', 'block');
		Stats.stisimoDOM.css('display', 'none');
		break;
	}

	if (dom.hasClass('epilogiNo')) {
		dom.removeClass('epilogiNo').addClass('epilogiYes');
		alo.removeClass('epilogiYes').addClass('epilogiNo');
	}

	else {
		dom.removeClass('epilogiYes').addClass('epilogiNo');
		alo.removeClass('epilogiNo').addClass('epilogiYes');
	}

	return Stats;
};

Stats.filtroSetup = function(dom) {
	Stats.
	dianomesSetup(dom).
	pektisSetup(dom);

	return Stats;
};

Stats.dianomesSetup = function(dom) {
	var sliderDOM;

	dom.css('vertical-align', 'top');

	dom.
	append(Stats.dianomesDOM = $('<div>').addClass('epilogi').
	append($('<label>').attr({
		for: 'dianomesMin',
	}).text('Διανομές >')).
	append(Stats.dianomesMinDOM = $('<input>').attr({
		id: 'dianomesMin',
		type: 'number',
		value: 0,
		step: 1000,
		min: 0,
	}).on('change', function() {
		sliderDOM.slider('option', 'value', $(this).val());
	})).
	append(sliderDOM = $('<div>').css({
		margin: '2px 8px',
	})));

	sliderDOM.slider({
		orientation: 'horizontal',
		range: 'min',
		min: 0,
		max: 100000,
		value: Stats.dianomesMin,
		step: 1000,
		slide: function(e, ui) {
			Stats.dianomesMinDOM.val(ui.value);
		},
	});

	Stats.dianomesMinDOM.val(sliderDOM.slider('value'));

	return Stats;
};

Stats.pektisSetup = function(dom) {
	var pektisDOM;

	dom.css('vertical-align', 'top');

	dom.
	append(Stats.pektesDOM = $('<div>').addClass('epilogi').
	append($('<div>').text('Παίκτες')).
	append($('<img>').attr({
		id: 'pektesClear',
		src: Client.server + 'ikona/misc/Xred.png',
	}).on('click', function(e) {
		e.stopPropagation();
		pektisDOM.val('').focus();
		Stats.pektisLista = {};
	})).
	append(pektisDOM = $('<textarea>').css({
		width: '97%',
		height: '12ex',
		margin: '2px 0 2px 0',
	}).val(Stats.urlPektis).
	on('change', function() {
		var x;

		Stats.pektisLista = {};

		x = $(this).val();

		if (!x)
		return;

		x = x.split(/[\s,]/);
		for (i = 0; i < x.length; i++) {
			if (x[i])
			Stats.pektisLista[x[i]] = new RegExp(x[i], 'i');
		}
	}).trigger('change')));

	setTimeout(function() {
		pektisDOM.focus();
	}, 10);

	return Stats;
};

Stats.katataxiPektisCheck = function(data) {
	var i, ret = true;

	for (i in Stats.pektisLista) {
		if (data.login.match(Stats.pektisLista[i]))
		return true;

		ret = false;
	}

	return ret;
};

Stats.panelSetup = function(dom) {
	dom.css('vertical-align', 'top');

	dom.
	append($('<div>').addClass('pliktroContainer').
	append(Stats.starterDOM = $('<img>').addClass('pliktro').
	on('click', function() {
		if (Stats.running)
		return Stats.stopStats();

		Stats.running = true;
		Stats.working();
		setTimeout(function() {
			Stats.startStats();
		}, 0);
	})));

	Stats.stopStats();
	return Stats;
};

Stats.katataxiSetup = function() {
	Client.ofelimoDOM.
	append(Stats.katataxiDOM = $('<div>').attr('id', 'katataxi'));

	Client.bodyDOM.on('click', '.katataxiRow', function(e) {
		var zoomDOM;

		e.stopPropagation();

		zoomDOM = $(this).find('.katataxiRowZoom');
		if (zoomDOM.length)
		return zoomDOM.anadisi();

		$(this).find('.arithmisi').
		append(zoomDOM = $('<div>').addClass('katataxiRowZoom').css({
			position: 'absolute',
			top: '-10px',
			left: (10 + Globals.random(0, 60)) + 'px',
		}).anadisi().draggable({
			start: function(e, ui) {
				ui.helper.anadisi();
			},
		}).
		append(Client.klisimo()));

		Stats.
		katataxiZoomData($(this).data('data'), zoomDOM).
		katataxiZoomCharts($(this).data('data'), zoomDOM);
	});

	return Stats;
};

Stats.katataxiZoomData = function(data, dom) {
	dom.append($('<div>').addClass('katataxiZoomData').
	append($('<table>').

	append($('<tr>').
	append($('<td>').addClass('katataxiZoomLeft').text('Login')).
	append($('<td>').addClass('katataxiZoomRight entona').text(data.login))).

	append($('<tr>').
	append($('<td>').attr('colspan', 2).html('<hr>'))).

	append($('<tr>').
	append($('<td>').addClass('katataxiZoomLeft').text('Παρτίδες')).
	append($('<td>').addClass('katataxiZoomRight').text(data.partides))).

	append($('<tr>').
	append($('<td>').addClass('katataxiZoomLeft').text('Κατάταξη')).
	append($('<td>').addClass('katataxiZoomRight').
		append($('<span>').text('πρώτος: ')).
		append($('<span>').addClass('entona').text((data.protos * 100 / data.katataxi).toFixed(0))).
		append($('<span>').text('%, δεύτερος: ')).
		append($('<span>').addClass('entona').text((data.defteros * 100 / data.katataxi).toFixed(0))).
		append($('<span>').text('%, τρίτος: ')).
		append($('<span>').addClass('entona').text((data.tritos * 100 / data.katataxi).toFixed(0))).
		append($('<span>').text('%')))).

	append($('<tr>').
	append($('<td>').attr('colspan', 2).html('<hr>'))).

	append($('<tr>').
	append($('<td>').addClass('katataxiZoomLeft').text('Διανομές')).
	append($('<td>').addClass('katataxiZoomRight').text(data.pegmenes + ' παιγμένες διανομές'))).

	append($('<tr>').
	append($('<td>').addClass('katataxiZoomLeft').text('Καπίκια')).
	append($('<td>').addClass('katataxiZoomRight').text(data.kapikia + ' καπίκια'))).

	append($('<tr>').
	append($('<td>').addClass('katataxiZoomLeft').text('Ισοζύγιο')).
	append($('<td>').addClass('katataxiZoomRight').
		append($('<span>').addClass('entona').text(data.isozigio.toFixed(2))).
		append($('<span>').text(' καπίκια ανά παιγμένη διανομή')))).

	append($('<tr>').
	append($('<td>').attr('colspan', 2).html('<hr>'))).

	append($('<tr>').
	append($('<td>').addClass('katataxiZoomLeft').text('Αγορές')).
	append($('<td>').addClass('katataxiZoomRight').
		text(data.agora + ' διανομές (' + (data.agora * 100 / data.pegmenes).toFixed(0) + '%)'))).

	append($('<tr>').
	append($('<td>').addClass('katataxiZoomLeft').text('Ισοζύγιο αγορών')).
	append($('<td>').addClass('katataxiZoomRight').text(data.isozigioAgora.toFixed(2) +
		' καπίκια ανά διανομή ως αγοραστής'))).

	append($('<tr>').
	append($('<td>').attr('colspan', 2).html('<hr>'))).

	append($('<tr>').
	append($('<td>').addClass('katataxiZoomLeft').text('Άμυνες')).
	append($('<td>').addClass('katataxiZoomRight').
		text(data.amina + ' διανομές (' + (data.amina * 100 / data.pegmenes).toFixed(0) + '%)'))).

	append($('<tr>').
	append($('<td>').addClass('katataxiZoomLeft').text('Μαζί')).
	append($('<td>').addClass('katataxiZoomRight').
	text(data.amina ? data.mazi + ' διανομές, ' + (data.mazi * 100 / data.amina).toFixed(2) + '% της αμύνης' : 0))).

	append($('<tr>').
	append($('<td>').addClass('katataxiZoomLeft').text('Ισοζύγιο άμυνας')).
	append($('<td>').addClass('katataxiZoomRight').text(data.isozigioAmina.toFixed(2) +
		' καπίκια ανά διανομή ως αμυνόμενος'))).

	append($('<tr>').
	append($('<td>').attr('colspan', 2).html('<hr>'))).

	append($('<tr>').
	append($('<td>').addClass('katataxiZoomLeft').text('Παίχτηκε το πάσο')).
	append($('<td>').addClass('katataxiZoomRight').
		text(data.paso + ' διανομές (' + (data.paso * 100 / data.pegmenes).toFixed(0) + '%)'))).

	append($('<tr>').
	append($('<td>').addClass('katataxiZoomLeft').text('Ισοζύγιο πάσο')).
	append($('<td>').addClass('katataxiZoomRight').text(data.isozigioPaso.toFixed(2) +
		' καπίκια ανά διανομή που παίχτηκε το πάσο')))));

	return Stats;
};

Stats.katataxiZoomCharts = function(data, dom) {
	dom = $('<div>').addClass('katataxiZoomCharts').appendTo(dom);

	Stats.
	katataxiZoomChartDianomes(data, dom).
	katataxiZoomChartKatataxi(data, dom).
	katataxiZoomChartKapikia(data, dom);

	return Stats;
}

Stats.katataxiZoomChartDianomes = function(data, dom) {
	var chartData, chartOpts;

	chartData = {
		labels: [],
		series: [],
	};

	chartOpts = {
		width: '200px',
		height: '190px',
	};

	if (data.agora) {
		chartData.labels.push('Αγορά');
		chartData.series.push({
			value: data.agora,
			className: 'aapAgora',
		});
	}

	if (data.amina) {
		chartData.labels.push('Άμυνα');
		chartData.series.push({
			value: data.amina,
			className: 'aapAmina',
		});
	}

	if (data.paso) {
		chartData.labels.push('Πάσο');
		chartData.series.push({
			value: data.paso,
			className: 'aapPaso',
		});
	}

	dom = $('<div>').addClass('katataxiZoomCharts katataxiZoomChartDianomes').appendTo(dom);
	new Chartist.Pie(dom.get(0), chartData, chartOpts);

	return Stats;
};

Stats.katataxiZoomChartKatataxi = function(data, dom) {
	var chartData, chartOpts;

	chartData = {
		labels: [],
		series: [],
	};

	chartOpts = {
		width: '200px',
		height: '190px',
	};

	if (data.protos) {
		chartData.labels.push('Πρώτος');
		chartData.series.push({
			value: data.protos,
			className: 'pdtProtos',
		});
	}

	if (data.defteros) {
		chartData.labels.push('Δεύτερος');
		chartData.series.push({
			value: data.defteros,
			className: 'pdtDefteros',
		});
	}

	if (data.tritos) {
		chartData.labels.push('Τρίτος');
		chartData.series.push({
			value: data.tritos,
			className: 'pdtTritos',
		});
	}

	dom = $('<div>').addClass('katataxiZoomCharts katataxiZoomChartKatataxi').appendTo(dom);
	new Chartist.Pie(dom.get(0), chartData, chartOpts);

	return Stats;
};

Stats.katataxiZoomChartKapikia = function(data, dom) {
	var chartData, chartOpts;

	chartData = {
		labels: [ 'Αγορά', 'Άμυνα', 'Πάσο' ],
		series: [
			{
				className: 'aapAgora',
				data: [ data.kapikiaAgora, 0, 0 ],
			},
			{
				className: 'aapAmina',
				data: [ 0, data.kapikiaAmina, 0 ],
			},
			{
				className: 'aapPaso',
				data: [ 0, 0, data.kapikiaPaso ],
			},
		],
	};

	chartOpts = {
		width: '400px',
		height: '200px',
	};

	dom = $('<div>').addClass('katataxiZoomChartKapikia').appendTo(dom);
	new Chartist.Bar(dom.get(0), chartData, chartOpts);

	return Stats;
};

Stats.stisimoSetup = function() {
	Client.ofelimoDOM.
	append(Stats.stisimoDOM = $('<div>').attr('id', 'stisimo'));

	return Stats;
};

Stats.chartistSetup = function() {
return Stats;
	Client.ofelimoDOM.
	append($('<div>').attr('id', 'stisimo').
	append($('<div>').addClass('ct-chart').attr('id', 'mera')).
	append($('<div>').addClass('ct-chart').attr('id', 'minas')));

	return Stats;
};

Stats.dataGet = function() {
	Stats.running = true;
	Stats.starterDOM.attr({
		src: Client.server + 'ikona/working/arrows.gif',
		title: 'Stop',
	});

	$.post(Client.server + 'stats/stats.php').
	done(function(res) {
		Stats.running = true;
		try {
			eval(res);
			Stats.
			pektisFix().
			stisimoFix();
		} catch (e) {
			console.error(e);
			Stats.pektis = {};
			Stats.stisimo = {};
		}

		Stats.stopStats();
	}).
	fail(function(err) {
		Stats.running = true;
		console.error(err);
	});

	return Stats;
};

Stats.pektisFix = function() {
	Globals.walk(Stats.pektis, function(idos, elist) {
		Globals.walk(elist, function(etos, plist) {
			var i;

			for (i = 0; i < plist.length; i++)
			plist[i] = new Pektis(plist[i]);
		});
	});

	return Stats;
};

function Pektis(p) {
	var x, i, skip;

	x = p.split('\t');
	i = 0;

	this.login = x[i++];

	// Πλήθος παρτίδων

	this.partides = parseInt(x[i++]);

	// Πλήθος διανομών

	this.dianomes = parseInt(x[i++]);

	// Πλήθος παιγμένων διανομών

	this.pegmenes = parseInt(x[i++]);

	// Συνολικά καπίκια που κέρδισε ή έχασε

	this.kapikia = parseInt(x[i++]);

	// Πλήθος παρτίδων κατάταξης

	this.katataxi = parseInt(x[i++]);

	// Παρτίδες κατάταξης στις οποίες κατέλαβε την πρώτη θέση

	this.protos = parseInt(x[i++]);

	// Παρτίδες κατάταξης στις οποίες κατέλαβε τη δεύτερη θέση

	this.defteros = parseInt(x[i++]);

	// Παρτίδες κατάταξης στις οποίες κατέλαβε την τρίτη θέση

	this.tritos = parseInt(x[i++]);

	// Πλήθος απλών αγορών

	this.agora6 = parseInt(x[i++]);

	// Πλήθος απλών αγορών που έβαλε μέσα ως τζογαδόρος

	this.agora6Mesa = parseInt(x[i++]);

	// Πλήθος απλών αγορών που έβαλε σόλο μέσα ως τζογαδόρος

	this.agora6Solo = parseInt(x[i++]);

	// Πλήθος αγορών από επτά και άνω

	this.agora7 = parseInt(x[i++]);

	// Πλήθος αγορών από επτά και άνω που έβαλε μέσα ως τζογαδόρος

	this.agora7Mesa = parseInt(x[i++]);

	// Πλήθος αγορών από επτά και άνω που έβαλε σόλο μέσα ως τζογαδόρος

	this.agora7Solo = parseInt(x[i++]);

	// Ακολουθεί το πλήθος των αγορών στις οποίες δήλωσε άσους.

	this.asoi = parseInt(x[i++]);

	// Ακολουθεί το πλήθος των αγορών που τις έγραψε σόλο αξιοπρεπώς.

	this.axios = parseInt(x[i++]);

	// Ακολουθεί το πλήθος των αγορών που έβαλε μέσα ως τζογαδόρος
	// παίζοντας πρώτος…

	this.agoraMesa1 = parseInt(x[i++]);

	// …παίζοντας δεύτερος…

	this.agoraMesa2 = parseInt(x[i++]);

	// …παίζοντας τρίτος.

	this.agoraMesa3 = parseInt(x[i++]);

	// Τα επόμενα πεδία αφορούν τον παίκτη ως τζογαδόρο.

	this.kerdosIsa = parseInt(x[i++]);
	this.kerdosPleon = parseInt(x[i++]);
	this.zimiaMesa = parseInt(x[i++]);

	// Τα πεδία που ακολουθούν αφορούν τον παίκτη ως αμυνόμενο.

	this.amina = parseInt(x[i++]);
	this.mazi = parseInt(x[i++]);
	this.kapikiaAmina = parseInt(x[i++]);

	// Ακολουθεί το ισοζύγιο των παρτίδων που παίχτηκε το πάσο.

	this.paso = parseInt(x[i++]);
	this.kapikiaPaso = parseInt(x[i++]);
};

Stats.stisimoFix = function() {
	Stats.stisimo = {};
	Globals.walk(Stats.omisits, function(idos, list) {
		var stisimo, domi;

		Stats.stisimo[idos] = {};

		for (i = 0; i < list.length; i++) {
			stisimo = new Stisimo(list[i]);
			domi = Stats.stisimo[idos];

			if (!domi.hasOwnProperty(stisimo.etos))
			domi[stisimo.etos] = {};

			domi = domi[stisimo.etos];

			if (!domi.hasOwnProperty(stisimo.minas))
			domi[stisimo.minas] = {
				day: {},
				dow: {},
			};

			domi = domi[stisimo.minas].day;

			if (!domi.hasOwnProperty(stisimo.mera))
			domi[stisimo.mera] = {};

			domi = domi[stisimo.mera];

			if (!domi.hasOwnProperty(stisimo.ora))
			domi[stisimo.ora] = {
				partides: 0,
				dianomes: 0,
			};

			domi = domi[stisimo.ora];

			domi.partides += stisimo.partides;
			domi.dianomes += stisimo.dianomes;

			domi = Stats.stisimo[idos][stisimo.etos][stisimo.minas].dow;

			if (!domi.hasOwnProperty(stisimo.dow))
			domi[stisimo.dow] = {
				partides: 0,
				dianomes: 0,
			};

			domi = domi[stisimo.dow];

			domi.partides += stisimo.partides;
			domi.dianomes += stisimo.dianomes;
		}
	});

	delete Stats.omisits;
	return Stats;
};

function Stisimo(x) {
	var a, i;

	a = x.split('\t');
	i = 0;

	this.etos = parseInt(a[i++]);
	this.minas = parseInt(a[i++]);
	this.mera = parseInt(a[i++]);
	this.dow = parseInt(a[i++]);
	this.ora = parseInt(a[i++]);
	this.partides = parseInt(a[i++]);
	this.dianomes = parseInt(a[i++]);
}

Stats.startStats = function() {
	var elist = {};

	Stats.etosWalk(function(etos) {
		elist[etos] = true;
	});

	Stats.katataxiDOM.empty();
	Stats.stisimoDOM.empty();

	switch (Stats.idos) {
	case 'stisimo':
		Stats.startStatsStisimo(elist);
		break;
	default:
		Stats.startStatsKatataxi(elist);
		break;
	}

	return Stats;
};

Stats.startStatsKatataxi = function(elist) {
	var lstats = {};

	if (Stats.isPaso())
	Globals.walk(Stats.pektis.paso, function(etos, edata) {
		Stats.katataxiDataAdd(elist, lstats, etos, edata);
	});

	if (Stats.isOxiPaso())
	Globals.walk(Stats.pektis.oxipaso, function(etos, edata) {
		Stats.katataxiDataAdd(elist, lstats, etos, edata);
	});

	Stats.astats = [];

	Globals.walk(lstats, function(login, pdata) {
		pdata.login = login;

		if (!pdata.pegmenes)
		return;

		pdata.isozigio = pdata.kapikia / pdata.pegmenes;

		if (pdata.agora) {
			pdata.isozigioMesa = pdata.kapikiaMesa / pdata.agora;
			pdata.isozigioStisimo = pdata.kapikiaStisimo / pdata.agora;
			pdata.isozigioAgora = pdata.kapikiaAgora / pdata.agora;
		}
		else {
			pdata.isozigioMesa = 0;
			pdata.isozigioStisimo = 0;
			pdata.isozigioAgora = 0;
		}

		if (pdata.amina) {
			pdata.isozigioAmina = pdata.kapikiaAmina / pdata.amina;
			pdata.posostoMazi = pdata.mazi * 100 / pdata.amina;
		}

		else {
			pdata.isozigioAmina = 0;
			pdata.posostoMazi = 0;
		}

		if (pdata.paso)
		pdata.isozigioPaso = pdata.kapikiaPaso / pdata.paso;

		else
		pdata.isozigioPaso = 0;

		Stats.astats.push(pdata);
	});

	lstats = {};

	Stats.katataxiSort().katataxiStatsDisplay();
	return Stats;
};

Stats.katataxiStatsDisplay = function() {
	var tableDOM, aa;

	Stats.katataxiDOM.empty().
	append(tableDOM = $('<table>').addClass('katataxi').prop('border', '1').
	append($('<tr>').
	append($('<th>').text('Α/Α')).
	append($('<th>').
	addClass('headerSort' + (Stats.sort == Stats.katataxiSortLogin ? ' sorter' : '')).
	text('Login').on('click', function(e) {
		Stats.katataxiSortSet(e, $(this), Stats.katataxiSortLogin);
	})).
	append($('<th>').
	addClass('headerSort' + (Stats.sort == Stats.katataxiSortPartides ? ' sorter' : '')).
	text('Παρτίδες').on('click', function(e) {
		Stats.katataxiSortSet(e, $(this), Stats.katataxiSortPartides);
	})).
	append($('<th>').
	addClass('headerSort' + (Stats.sort == Stats.katataxiSortDianomes ? ' sorter' : '')).
	text('Διανομές').on('click', function(e) {
		Stats.katataxiSortSet(e, $(this), Stats.katataxiSortDianomes);
	})).
	append($('<th>').
	addClass('headerSort' + (Stats.sort == Stats.katataxiSortIsozigio ? ' sorter' : '')).
	text('Ισοζύγιο').on('click', function(e) {
		Stats.katataxiSortSet(e, $(this), Stats.katataxiSortIsozigio);
	})).
	append($('<th>').
	addClass('headerSort' + (Stats.sort == Stats.katataxiSortAgora ? ' sorter' : '')).
	text('Αγορές').on('click', function(e) {
		Stats.katataxiSortSet(e, $(this), Stats.katataxiSortAgora);
	})).
	append($('<th>').
	addClass('headerSort' + (Stats.sort == Stats.katataxiSortIsozigioMesa ? ' sorter' : '')).
	html('Μέσα<br/>Αγορές').on('click', function(e) {
		Stats.katataxiSortSet(e, $(this), Stats.katataxiSortIsozigioMesa);
	})).
	append($('<th>').
	addClass('headerSort' + (Stats.sort == Stats.katataxiSortIsozigioStisimo ? ' sorter' : '')).
	html('Στημένες<br/>Αγορές').on('click', function(e) {
		Stats.katataxiSortSet(e, $(this), Stats.katataxiSortIsozigioStisimo);
	})).
	append($('<th>').
	addClass('headerSort' + (Stats.sort == Stats.katataxiSortIsozigioAgora ? ' sorter' : '')).
	html('Ισοζύγιο<br/>Αγορών').on('click', function(e) {
		Stats.katataxiSortSet(e, $(this), Stats.katataxiSortIsozigioAgora);
	})).
	append($('<th>').
	addClass('headerSort' + (Stats.sort == Stats.katataxiSortAmina ? ' sorter' : '')).
	text('Άμυνα').on('click', function(e) {
		Stats.katataxiSortSet(e, $(this), Stats.katataxiSortAmina);
	})).
	append($('<th>').
	addClass('headerSort' + (Stats.sort == Stats.katataxiSortMazi ? ' sorter' : '')).
	html('Ποσοστό<br/>Μαζί').on('click', function(e) {
		Stats.katataxiSortSet(e, $(this), Stats.katataxiSortMazi);
	})).
	append($('<th>').
	addClass('headerSort' + (Stats.sort == Stats.katataxiSortIsozigioAmina ? ' sorter' : '')).
	html('Ισοζύγιο<br/>Άμυνας').on('click', function(e) {
		Stats.katataxiSortSet(e, $(this), Stats.katataxiSortIsozigioAmina);
	})).
	append($('<th>').
	addClass('headerSort' + (Stats.sort == Stats.katataxiSortPaso ? ' sorter' : '')).
	html('Πάσο').on('click', function(e) {
		Stats.katataxiSortSet(e, $(this), Stats.katataxiSortPaso);
	})).
	append($('<th>').
	addClass('headerSort' + (Stats.sort == Stats.katataxiSortIsozigioPaso ? ' sorter' : '')).
	html('Ισοζύγιο<br/>Πάσο').on('click', function(e) {
		Stats.katataxiSortSet(e, $(this), Stats.katataxiSortIsozigioPaso);
	}))));

	Stats.katataxiDisplayTimer = setTimeout(function() {
		Stats.katataxiDisplayRow(0, 1, tableDOM);
	}, 0);

	return Stats;
}

Stats.katataxiDisplayRow = function(idx, aa, dom) {
	var data, rowDOM, loginDOM, maziDOM;

	if (!Stats.running)
	return Stats;

	for (; idx < Stats.astats.length; idx++) {

		data = Stats.astats[idx];

		if (data.pegmenes < parseInt(Stats.dianomesMinDOM.val()))
		continue;

		if (!Stats.katataxiPektisCheck(data))
		continue;

		break;
	}

	if (idx >= Stats.astats.length) {
		clearTimeout(Stats.katataxiDisplayTimer);
		delete Stats.katataxiDisplayTimer;

		Stats.stopStats();
		return Stats;
	}

	dom.append(rowDOM = $('<tr>').data('data', data).
	addClass('katataxiRow isozigio' + (data.isozigio >= 0 ? 'Thetiko' : 'Arnitiko')).
	append($('<td>').addClass('arithmisi').text(aa)).
	append(loginDOM = $('<td>').addClass('katataxiLogin').text(data.login).attr('title', data.login)).
	append($('<td>').addClass('dexia').text(data.partides)).
	append($('<td>').addClass('dexia').text(data.pegmenes)).
	append($('<td>').addClass('isozigio').text(data.isozigio.toFixed(2))).
	append($('<td>').addClass('dexia').text(data.agora)).
	append($('<td>').addClass('dexia').text(data.isozigioMesa.toFixed(2))).
	append($('<td>').addClass('dexia').text(data.isozigioStisimo.toFixed(2))).
	append($('<td>').addClass('dexia').text(data.isozigioAgora.toFixed(2))).
	append($('<td>').addClass('dexia').text(data.amina)).
	append($('<td>').addClass('dexia').text(data.posostoMazi.toFixed(2))).
	append($('<td>').addClass('dexia').text(data.isozigioAmina.toFixed(2))).
	append($('<td>').addClass('dexia').text(data.paso)).
	append($('<td>').addClass('dexia').text(data.isozigioPaso.toFixed(2))));

	if (Client.isPektis() && (data.login === Client.session.pektis))
	loginDOM.addClass('katataxiLoginEgo');

	Stats.katataxiDisplayTimer = setTimeout(function() {
		Stats.katataxiDisplayRow(idx + 1, aa + 1, dom);
	}, 0);

	return Stats;
};

Stats.isozigio = function(pdata, attr1, attr2) {
	if (!pdata[attr1])
	return 'N/A';

	return(pdata[attr2] / pdata[attr1]).toFixed(2);
};

Stats.working = function(nai) {
	if (nai === undefined)
	nai = true;

	Stats.starterDOM.attr({
		src: Client.server + 'ikona/' + (nai ? 'working/arrows.gif' : 'panel/dianomiRed.png'),
		title: nai ? 'Stop!' : 'Start!',
	});

	return Stats;
};

Stats.relax = function() {
	Stats.starterDOM.attr({
		src: Client.server + 'ikona/panel/dianomi.png',
	});

	return Stats;
};

Stats.katataxiDataAdd = function(elist, stats, etos, edata) {
	if (!elist.hasOwnProperty(etos))
	return Stats;

	Globals.awalk(edata, function(i, pdata) {
		var login = pdata.login;

		if (!stats.hasOwnProperty(login))
		stats[login] = {
			partides: 0,

			pegmenes: 0,
			kapikia: 0,

			katataxi: 0,
			protos: 0,
			defteros: 0,
			tritos: 0,

			agora: 0,
			kapikiaAgora: 0,
			kapikiaStisimo: 0,
			kapikiaMesa: 0,

			amina: 0,
			mazi: 0,
			kapikiaAmina: 0,

			paso: 0,
			kapikiaPaso: 0,
		};

		stats[login].partides += pdata.partides;

		stats[login].pegmenes += pdata.pegmenes;
		stats[login].kapikia += pdata.kapikia;

		stats[login].katataxi += pdata.katataxi;
		stats[login].protos += pdata.protos;
		stats[login].defteros += pdata.defteros;
		stats[login].tritos += pdata.tritos;

		stats[login].agora += pdata.agora6 + pdata.agora7;
		stats[login].kapikiaAgora += pdata.kerdosIsa + pdata.kerdosPleon - pdata.zimiaMesa;
		stats[login].kapikiaStisimo += pdata.kerdosPleon;
		stats[login].kapikiaMesa += pdata.zimiaMesa;

		stats[login].amina += pdata.amina;
		stats[login].mazi += pdata.mazi;
		stats[login].kapikiaAmina += pdata.kapikiaAmina;

		stats[login].paso += pdata.paso;
		stats[login].kapikiaPaso += pdata.kapikiaPaso;
	});

	return Stats;
};

Stats.katataxiSortSet = function(e, headerDOM, cmpfunc) {
	e.preventDefault();

	if (Stats.running)
	Stats.stopStats();

	Stats.running = true;
	Stats.sort = cmpfunc;
	$('.sorter').removeClass('sorter');
	headerDOM.addClass('sorter');

	Stats.
	working().
	katataxiSort().
	katataxiStatsDisplay();
};

Stats.katataxiSort = function() {
	Stats.astats.sort(Stats.sort);
	return Stats;
};

Stats.katataxiSortLogin = function(p1, p2) {
	return p1.login.localeCompare(p2.login);
};

Stats.katataxiSortPartides = function(p1, p2) {
	return Stats.sortNumber(p1, p2, 'partides');
};

Stats.katataxiSortDianomes = function(p1, p2) {
	return Stats.sortNumber(p1, p2, 'pegmenes');
};

Stats.katataxiSortIsozigio = function(p1, p2) {
	return Stats.sortNumber(p1, p2, 'isozigio');
};

Stats.katataxiSortAgora = function(p1, p2) {
	return Stats.sortNumber(p1, p2, 'agora');
};

Stats.katataxiSortIsozigioMesa = function(p1, p2) {
	return Stats.sortNumber(p1, p2, 'isozigioMesa');
};

Stats.katataxiSortIsozigioStisimo = function(p1, p2) {
	return Stats.sortNumber(p1, p2, 'isozigioStisimo');
};

Stats.katataxiSortIsozigioAgora = function(p1, p2) {
	return Stats.sortNumber(p1, p2, 'isozigioAgora');
};

Stats.katataxiSortAmina = function(p1, p2) {
	return Stats.sortNumber(p1, p2, 'amina');
};

Stats.katataxiSortMazi = function(p1, p2) {
	return Stats.sortNumber(p1, p2, 'posostoMazi');
};

Stats.katataxiSortIsozigioAmina = function(p1, p2) {
	return Stats.sortNumber(p1, p2, 'isozigioAmina');
};

Stats.katataxiSortPaso = function(p1, p2) {
	return Stats.sortNumber(p1, p2, 'paso');
};

Stats.katataxiSortIsozigioPaso = function(p1, p2) {
	return Stats.sortNumber(p1, p2, 'isozigioPaso');
};

Stats.sortNumber = function(p1, p2, attr) {
	var n1, n2;

	if (attr) {
		n1 = p1[attr];
		n2 = p2[attr];
	}
	else {
		n1 = p1;
		n2 = p2;
	}

	if (n1 < n2)
	return 1;

	if (n1 > n2)
	return -1;

	return 0;
};

Stats.sort = Stats.katataxiSortIsozigio;

/////////////////////////////////////////////////////////////////////////////@

Stats.startStatsStisimo = function(elist) {
	var i, mstats = [], dstats = [], hstats = [], hstatsXimeroma = [];

	for (i = 0; i < 12; i++)
	mstats[i] = 0;

	for (i = 0; i < 7; i++)
	dstats[i] = 0;

	for (i = 0; i < 24; i++)
	hstats[i] = 0;

	if (Stats.isPaso())
	Globals.walk(Stats.stisimo.paso, function(etos, mlist) {
		Stats.stisimoDataAdd(elist, mstats, dstats, hstats, etos, mlist);
	});

	if (Stats.isOxiPaso())
	Globals.walk(Stats.stisimo.oxipaso, function(etos, mlist) {
		Stats.stisimoDataAdd(elist, mstats, dstats, hstats, etos, mlist);
	});

	// Μετατρέπουμε με ωρολογιακή αρχή ώρα ξημερώματος.

	Globals.awalk(hstats, function(ora, n) {
		hstatsXimeroma[(ora + 24 - Stats.ximeromaOra) % 24] = n;
	});

	Stats.
	stisimoStatsDisplay(mstats, dstats, hstatsXimeroma).
	stopStats();

	return Stats;
};

Stats.stisimoDataAdd = function(elist, mstats, dstats, hstats, etos, mlist) {
	if (!elist.hasOwnProperty(etos))
	return Stats;

	Globals.walk(mlist, function(minas, mdata) {
		minas--;
		Stats.
		stisimoDataDayAdd(minas, mdata.day, mstats, hstats).
		stisimoDataDowAdd(minas, mdata.dow, dstats);
	});

	return Stats;
};

Stats.stisimoDataDayAdd = function(minas, dlist, mstats, hstats) {
	Globals.walk(dlist, function(day, olist) {
		Globals.walk(olist, function(ora, odata) {
			mstats[minas] += odata.partides;
			hstats[ora] += odata.partides;
		});
	});

	return Stats;
};

Stats.stisimoDataDowAdd = function(minas, dlist, dstats) {
	Globals.walk(dlist, function(dow, odata) {
		dstats[dow] += odata.partides;
	});

	return Stats;
};

Stats.stisimoStatsDisplay = function(mstats, dstats, hstats) {
	Stats.stisimoDOM.empty();
	Stats.
	stisimoChartMines(mstats).
	stisimoChartMeres(dstats).
	stisimoChartOres(hstats);

	return Stats;
};

Stats.stisimoChartMines = function(data) {
	var chartData, chartOpts, i, dom;

	chartData = {
		labels: Globals.date.monthNamesShort,
		series: [
			{
				data: data,
			},
		],
	};

	chartOpts = {
		width: '100%',
		height: '400px',
	};

	Stats.stisimoDOM.
	append($('<div>').addClass('stisimoEpikefalida').text('Κατανομή παρτίδων κατά μήνα')).
	append(dom = $('<div>').attr('id', 'stisimoMinas'));

	new Chartist.Bar(dom.get(0), chartData, chartOpts);

	return Stats;
};

Stats.stisimoChartMeres = function(data) {
	var chartData, chartOpts, i, dom;

	chartData = {
		labels: Globals.date.dayNamesShort,
		series: [
			{
				data: data,
			},
		],
	};

	chartOpts = {
		width: '80%',
		height: '300px',
	};

	Stats.stisimoDOM.
	append($('<div>').addClass('stisimoEpikefalida').text('Κατανομή παρτίδων κατά ημέρα')).
	append(dom = $('<div>').attr('id', 'stisimoMera'));

	new Chartist.Bar(dom.get(0), chartData, chartOpts);

	return Stats;
};

Stats.stisimoChartOres = function(data) {
	var chartData, chartOpts, i, dom;

	chartData = {
		labels: [],
		series: [
			{
				data: data,
			},
		],
	};

	for (i = 0; i < 24; i++)
	chartData.labels[i] = (i + Stats.ximeromaOra) % 24;

	chartOpts = {
		width: '100%',
		height: '300px',
	};

	Stats.stisimoDOM.
	append($('<div>').addClass('stisimoEpikefalida').text('Ωρολογιακή κατανομή παρτίδων')).
	append(dom = $('<div>').attr('id', 'stisimoOra'));

	new Chartist.Bar(dom.get(0), chartData, chartOpts);

	return Stats;
};

/////////////////////////////////////////////////////////////////////////////@

Stats.stopStats = function() {
	if (Stats.katataxiDisplayTimer) {
		clearTimeout(Stats.katataxiDisplayTimer);
		delete Stats.katataxiDisplayTimer;
	}

	Stats.starterDOM.attr({
		src: Client.server + 'ikona/panel/dianomi.png',
		title: 'Start!',
	});

	delete Stats.running;
	return Stats;
}
