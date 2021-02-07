$(document).ready(function() {
	Paraskinio.opener = window.opener;
	if (Paraskinio.opener) Paraskinio.openerBI = $(Paraskinio.opener.document.body).css('backgroundImage');
	Paraskinio.paletaDisplay();

	$('#paraskinio_klisimoIcon').
	on('mouseenter', function(e) {
		e.stopPropagation();
		$(this).finish().fadeTo(100, 1);
	}).
	on('mouseleave', function(e) {
		e.stopPropagation();
		$(this).finish().fadeTo(100, 0.2);
	}).
	on('click', function(e) {
		e.stopPropagation();
		self.close();
	});
});

Paraskinio = {};

Paraskinio.unload = function() {
	if (Paraskinio.unloaded) return;
	Paraskinio.unloaded = true;
	if (!Paraskinio.opener) return;

	$(Paraskinio.opener.document.body).css({backgroundImage:Paraskinio.openerBI});
	Paraskinio.opener.Arena.paraskinio.klisimo();
}

$(window).on('beforeunload', function() {
	Paraskinio.unload();
});

$(window).on('unload', function() {
	Paraskinio.unload();
});

Paraskinio.paleta = [];

Paraskinio.paletaDisplay = function() {
	var i, ofelimo = $('#ofelimo'), klasi;

	for (i = 0; i < Paraskinio.paleta.length; i++) {
		klasi = 'paraskinio_digma';
		if (Paraskinio.paleta[i] === Client.session.paraskinio) klasi += ' paraskinio_digmaTrexon';

		ofelimo.
		append($('<div>').addClass('paraskinio_digmaContainer').
		append($('<div>').addClass(klasi).css({
			backgroundImage: "url('" + Client.server + "ikona/paraskinio/" + Paraskinio.paleta[i] + "')",
		}).
		data({paraskinio: Paraskinio.paleta[i]}).
		on('mouseenter', function(e) {
			var obj = $(this), timer = $(this).data('timer');
			obj.addClass('paraskinio_digmaCandi');
			if (timer) clearTimeout(timer);
			$(this).data({
				timer: setTimeout(function() {
					var img = obj.css('backgroundImage');
					$(document.body).css({backgroundImage:img});

					if (!Paraskinio.opener) return;
					if (Paraskinio.opener.hasOwnProperty('Arena'))
					Paraskinio.opener.Arena.paraskinioAlagi(img);
				}, 300),
			});
		}).
		on('mouseleave', function(e) {
			var timer = $(this).data('timer');
			$(this).removeClass('paraskinio_digmaCandi');
			if (!timer) return;

			clearTimeout(timer);
			$(this).removeData('timer');
		}).
		on('click', function(e) {
			var img = $(this).data('paraskinio');
			Paraskinio.openerBI = "url('" + Client.server + "ikona/paraskinio/" + img + "')";
			$.ajax('paraskinio.php', {data:{paraskinio:img}}).
			done(function() {
				window.close();
			});
			if (Paraskinio.opener) {
				if (Paraskinio.opener.hasOwnProperty('Arena'))
				Paraskinio.opener.Arena.paraskinioAlagi(Paraskinio.openerBI);
			}
		})));
	}
};
