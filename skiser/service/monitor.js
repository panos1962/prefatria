////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: monitor');

Service.monitor = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.monitor.action = function(nodereq) {
	var skiniko = Server.skiniko, i;

	nodereq.write('pektis>>>>\n');
	for (i in skiniko.pektis) Service.monitor.pektis(nodereq, skiniko.skinikoPektisGet(i));

	nodereq.write('trapezi>>>>\n');
	for (i in skiniko.trapezi) Service.monitor.trapezi(nodereq, skiniko.skinikoTrapeziGet(i));

	nodereq.write('sinedria>>>>\n');
	for (i in skiniko.sinedria) Service.monitor.sinedria(nodereq, skiniko.skinikoSinedriaGet(i));

	nodereq.write('prosklisi>>>>\n');
	for (i in skiniko.prosklisi) Service.monitor.prosklisi(nodereq, skiniko.skinikoProsklisiGet(i));

	nodereq.end();
};

Service.monitor.pektis = function(nodereq, pektis) {
	nodereq.write('\t' + pektis.pektisFeredata() + '\n');
};

Service.monitor.trapezi = function(nodereq, trapezi) {
	nodereq.write('\t' + trapezi.trapeziFeredata() + '\n');
};

Service.monitor.sinedria = function(nodereq, sinedria) {
	nodereq.write('\t' + sinedria.sinedriaFeredata() + '\n');
};

Service.monitor.prosklisi = function(nodereq, prosklisi) {
	nodereq.write('\t' + JSON.stringify(prosklisi) + '\n');
};
