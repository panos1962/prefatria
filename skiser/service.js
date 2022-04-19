////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Ακολουθούν τα σχετικά με τις υπηρεσίες που θα προσφέρει ο skiser.
// Οι υπηρεσίες ορίζονται σε δικά τους modules. Υπάρχουν modules που
// ορίζουν μια υπηρεσία, υπάρχουν όμως και modules που ορίζουν πολλές
// παρεμφερείς υπηρεσίες.

Service = {};

Log.level.push();
require('./service/anazitisi.js');
require('./service/minima.js');
require('./service/profinfo.js');
require('./service/fortos.js');
require('./service/misc.js');
require('./service/claim.js');
require('./service/akirosi.js');
require('./service/peximo.js');
require('./service/simetoxi.js');
require('./service/agora.js');
require('./service/dilosi.js');
require('./service/sxesi.js');
require('./service/peparam.js');
require('./service/trparam.js');
require('./service/prosklisi.js');
require('./service/arvila.js');
require('./service/sizitisi.js');
require('./service/trapezi.js');
require('./service/feredata.js');
require('./service/pektis.js');
require('./service/sinedria.js');
require('./service/stop.js');
require('./service/monitor.js');
Log.level.pop();

// Στο αντικείμενο "router" περιέχονται οι υπηρεσίες που προσφέρει ο server.
// Σε κάθε "υπηρεσία" αντιστοιχούμε μια function που θα κληθεί με παράμετρο
// το ίδιο το αίτημα όπως αυτό διαμορφώνεται μετά τον έλεγχο και την αρχική
// επεξεργασία που υφίσταται από τον server.

Server.router = {
	'/dianomiTora': Service.trapezi.dianomiTora,
	'/anazitisi': Service.anazitisi.anazitisi,
	'/minimaFeredata': Service.minima.feredata,
	'/minimaKatastasi': Service.minima.katastasi,
	'/minimaDelete': Service.minima.diagrafi,
	'/minimaSend': Service.minima.send,
	'/ipGet': Service.misc.ipGet,
	'/profinfoPut': Service.profinfo.put,
	'/profinfoGet': Service.profinfo.get,
	'/fortosData': Service.fortos.data,
	'/sizitisiClearKafenio': Service.sizitisi.clearKafenio,
	'/sizitisiDiagrafi': Service.sizitisi.diagrafi,
	'/moliviAkirosi': Service.sizitisi.moliviAkirosi,
	'/moliviEkinisi': Service.sizitisi.moliviEkinisi,
	'/korna': Service.misc.korna,
	'/filaPrev': Service.sizitisi.filaPrev,
	'/claimApantisi': Service.claim.apantisi,
	'/claimProtasi': Service.claim.protasi,
	'/akirosiStart': Service.akirosi.start,
	'/akirosiStop': Service.akirosi.stop,
	'/peximo': Service.peximo.peximo,
	'/simetoxi': Service.simetoxi.dilosi,
	'/agora': Service.agora.agora,
	'/dilosi': Service.dilosi.dilosi,
	'/sxesi': Service.sxesi.sxesi,
	'/tsoxaSalute': Service.sinedria.tsoxaSalute,
	'/sizitisiPartida': Service.sizitisi.partida,
	'/thesiTheasis': Service.sinedria.thesiTheasis,
	'/apodoxi': Service.trapezi.apodoxi,
	'/roloi': Service.trapezi.roloi,
	'/diataxi': Service.trapezi.diataxi,
	'/peparamSet': Service.peparam.set,
	'/trparamSet': Service.trparam.set,
	'/pektisTheatis': Service.sinedria.pektisTheatis,
	'/prosklisiApodoxi': Service.prosklisi.apodoxi,
	'/prosklisiDiagrafi': Service.prosklisi.diagrafi,
	'/prosklisiApostoli': Service.prosklisi.apostoli,
	'/arvilaApostoli': Service.arvila.apostoli,
	'/arvilaArsi': Service.arvila.arsi,
	'/sizitisiKafenio': Service.sizitisi.kafenio,
	'/exodosTrapezi': Service.trapezi.exodos,
	'/trapeziEpilogi': Service.trapezi.epilogi,
	'/miaPrefa': Service.trapezi.miaPrefa,
	'/salute': Service.sinedria.salute,
	'/fereFreska': Service.feredata.freska,
	'/fereAlages': Service.feredata.alages,
	'/pektisFetch': Service.pektis.fetch,
	'/exodos': Service.sinedria.exodos,
	'/apovoli': Service.sinedria.apovoli,
	'/checkin': Service.sinedria.checkin,
	'/stop': Service.stop,
	'/monitor': Service.monitor.action,
};

// Ακολουθούν υπηρεσίες που ζητούνται μεν, αλλά αγνοούνται και δεν επιστρέφουν
// αποτελέσματα ούτε εκτελούν κάποιες διεργασίες. Η υπηρεσία "favicon.ico" είναι
// κλήση που ζητείται από πολλούς browsers by default μετά την αίτηση οποιασδήποτε
// σελίδας, αλλά ο παρών server δεν χρειάζεται να απαντάει σε τέτοιου είδους
// αιτήματα.

Server.off = {
	'/favicon.ico': 0,
	'/testOff': 0,
};

// Ακολουθούν υπηρεσίες που δεν πρέπει να επηρεάζουν το timestamp επαφής της
// συνεδρίας καθώς εκτελούνται αυτόματα από το πρόγραμμα ακόμη και αν ο παίκτης
// δεν κάνει καμία απολύτως ενέργεια.

Server.noPoll = {
	'/fereAlages': 0,
};
