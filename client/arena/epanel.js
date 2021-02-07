Arena.epanel = new BPanel();

Arena.epanel.bpanelGetDOM().
on('click', function(e) {
	Arena.inputRefocus(e);
}).
on('mousedown', function(e) {
	Arena.inputRefocus(e);
});

Arena.epanel.clickCommon = function(e) {
	Arena.inputRefocus(e);
};

Arena.epanel.bpanelButtonPush(new PButton({
	id: 'enalagi',
	img: '4Balls.png',
	title: 'Εναλλαγή εργαλείων',
	click: function(e) {
		Arena.epanel.bpanelEpomeniOmada();
		this.pbuttonGetDOM().strofi({
			strofi: 90,
			duration: 200,
		});
	},
}));

Arena.epanel.bpanelButtonPush(new PButton({
	id: 'arxiki',
	img: 'ikona/misc/mazemaPano.png',
	title: 'Αρχική σειρά εργαλείων',
	click: function(e) {
		Arena.epanel.bpanelOmadaSet(2);
		Arena.epanel.bpanelButtonGet('enalagi').pbuttonGetDOM().strofi({
			strofi: -90,
			duration: 200,
		});
	},
}));

Arena.epanel.lefkoma = [
	[
		'pikra.png',
		'mati.png',
		'dakri.png',
		'klama.png',
		'tromos.png',
		'thimos.png',
		'ekplixi.png',
		'mataki.png',
		'gelaki.png',
		'gelio.png',
		'love.png',
	],
	[
		'hi.gif',
		'mati.png',
		'doubt.png',
		'binelikia.gif',
		'plastis.gif',
		'ipopto.gif',
		'klama.png',
		'oxi.gif',
		'glosa.png',
		'toulipa.gif',
		'angry.png',
	],
	[
		'boss.png',
		'smile.png',
		'look.png',
		'haha.png',
		'oops.png',
		'misdoubt.png',
		'doubt.png',
		'pudency.png',
		'beated.png',
		'sad.png',
		'ah.png',
	],
	[
		'angry.png',
		'ft.png',
		'eek.png',
		'razz.png',
		'shame.png',
		'lovely.png',
		'sad.png',
		'smile.png',
		'lol.png',
		'shuai.png',
		'sweat.png',
	],
	[
		'matia.gif',
		'binelikia.gif',
		'kapikia.gif',
		'bouketo.gif',
		'kakos.gif',
		'plastis.gif',
		'malakia.gif',
		'lol.gif',
		'love.gif',
		'oxi.gif',
		'tromos.gif',
	],
	[
		'hi.gif',
		'koroidia.gif',
		'matakia.gif',
		'toulipa.gif',
		'ipopto.gif',
		'aporia.gif',
		'klaps.gif',
		'ekplixi.gif',
		'tromos.gif',
		'binelikia.gif',
		'nani.gif',
	],
	[
		'gialiko.png',
		'glosa.png',
		'kokinisma.png',
		'mousitsa.png',
		'mataki.png',
		'gelaki.png',
		'lol.png',
		'love.png',
		'apogoitefsi.png',
		'zimia.png',
		'dakri.png',
	],
	[
		'kardia.png',
		'xara.png',
		'tomata.png',
		'gelaki.png',
		'kokinizo.png',
		'kamenos.png',
		'mati.png',
		'glosa.png',
		'keratas.png',
		'what.png',
		'devil.png',
	],
];

Arena.epanel.setup = function() {
	Globals.awalk(Arena.epanel.lefkoma, function(i, setaki) {
		var omada, dir;

		omada = i + 1;
		dir = 'ikona/emoticon/set' + omada + '/';
		Globals.awalk(setaki, function(i, emoticon) {
			Arena.epanel.bpanelButtonPush(button = new PButton({
				img: dir + emoticon,
				omada: omada,
				emoticon: i + 1,
				click: function(e) {
					Arena.sizitisi.inputDOM.val(Arena.sizitisi.inputDOM.val() +
						'^E' + this.omada + ':' + this.emoticon + '^');
					Arena.sizitisi.keyup();
				},
			}));
		});
	});

	return Arena.epanel;
};
