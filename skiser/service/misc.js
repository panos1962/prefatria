////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: misc');

Service.misc = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Με το αίτημα κόρνας ο παίκτης κορνάρει σε όσους έχουν σχέση με το τραπέζι στο
// οποίο παίζει. Όσοι βρίσκονται στο τραπέζι του ως παίκτες ή ως θεατές θα δουν
// στη συζήτηση του τραπεζιού μια κόρνα από τον συγκεκριμένο παίκτη και θα
// ακούσουν ηχητικό σήμα κόρνας. Αν κάποιος παίκτης του τραπεζιού αλητεύει
// σε άλλο τραπέζι, τοτε και αυτός θα ακούσει το σήμα.

Service.misc.korna = function(nodereq) {
	if (nodereq.isvoli()) return;
	if (nodereq.oxiPektis()) return;
	nodereq.end();

	Server.skiniko.
	kinisiAdd(new Kinisi({
		idos: 'KN',
		data: {
			pektis: nodereq.loginGet(),
			trapezi: nodereq.trapeziGet().trapeziKodikosGet(),
		},
	}));
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.misc.ipGet = function(nodereq) {
	var pektis, sinedria;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('login', true)) return;

	pektis = nodereq.pektisGet();
	if (pektis.pektisAxiomaRankGet() < Peparam.axiomaRank['ΕΠΟΠΤΗΣ'])
	return nodereq.error('Δεν έχετε πρόσβαση για το IP');

	sinedria = Server.skiniko.skinikoSinedriaGet(nodereq.url.login);
	if (!sinedria) return nodereq.error('Ο παίκτης δεν είναι online');

	nodereq.end(sinedria.sinedriaIpGet());
};
