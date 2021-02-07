Client = null;
Server = {};

// Εμπλουτίζουμε με απλές δομές και μεθόδους που θα μας βοηθήσουν στην
// εκτύπωση μηνυμάτων προόδου των εργασιών του παρόντος κλπ.

require('./log.js');
Log.print('reading "log" module');

// Εμπλουτίζουμε με θεμελιακές δομές και μεθόδους που αφορούν στη γενικότερη
// λειτουργία του node server.

Log.level.push('reading node system modules');

// Εμπλουτίζουμε με δομές και μεθόδους που θα μας επιτρέψουν να προσπελάσουμε
// παραμέτρους του λειτουργικού συστήματος.

Log.print('reading operating system module');
OS = require('os');

// Εμπλουτίζουμε με δομές και μεθόδους που θα μας επιτρέψουν να προσπελάσουμε
// το file system προκειμένου να διαβάσουμε αρχεία ή να γράψουμε σε αυτά.

Log.print('reading file system module');
FS = require('fs');

// Εμπλουτίζουμε με δομές και μεθόδους που θα μας επιτρέψουν να επικοινωνήσουμε
// με την MySQL database που αποτελεί τον πυρήνα της εφαρμογής.

Log.print('reading MySQL module');
try {
	MYSQL = require('mysql');
} catch (e) {
	MYSQL = require('/usr/local/lib/node_modules/mysql');
}

// Εμπλουτίζουμε με με δομές και μεθόδους που επιτρέπουν στον node server να
// ακούει και να απαντά σε HTTP requests.

Log.print('reading http module');
HTTP = require('http');

// Εμπλουτίζουμε με δομές και μεθόδους που μας επιτρέπουν να διαπασπάσουμε ένα
// url και να προσπελάσουμε τα δομικά του στοιχεία, π.χ. pathname, παράμετροι κλπ.

Log.print('reading url module');
URL = require('url');

// Εμπλουτίζουμε με δομές και μεθόδους που μας επιτρέπουν να κρυπτογραφούμε τους
// κωδικούς εισόδου των χρηστών.

Log.print('reading crypto module');
Crypto = require('crypto');

Log.level.pop();
Server.APPDIR = process.cwd().replace(/skiser$/, '');
Log.print('setting "APPDIR" to "' + Server.APPDIR + '"');

// Εμπλουτίζουμε με δομές και μεθόδους που είναι κοινές σε server και client, και
// αφορούν σε JavaScript functions γενικής χρήσης.

Log.print('reading common "globals" module');
require('../client/common/globals.js');

// Εμπλουτίζουμε με δομές και μεθόδους που αφορούν σε JavaScript functions γενικής
// χρήσης του server.

Log.print('reading server "globals" module');
require('./globals.js');

// Εμπλουτίζουμε με δομές και μεθόδους που είναι απαραίτητες για την επαφή μας με την
// database της εφαρμογής.

Log.print('reading database access module');
require('./db.js');

// Εμπλουτίζουμε με δομές και μεθόδους που είναι κοινές σε server και client, και
// αφορούν στον «Πρεφαδόρο».

Log.print('reading common "prefadoros" module');
require('../client/common/prefadoros.js');

// Εμπλουτίζουμε με δομές και μεθόδους που είναι κοινές σε server και client και
// αφορούν στη διαμόρφωση και στον χειρισμό του σκηνικού.

Log.print('reading common "skiniko" module');
require('../client/common/skiniko.js');
require('../client/common/partida.js');
require('../client/common/energia.js');
require('../client/common/kinisi.js');

// Εμπλουτίζουμε με δομές και μεθόδους που αφορούν στη διαμόρφωση και στο χειρισμό
// του σκηνικού ειδικά από την πλευρά του server.

Log.print('reading server "skiniko" module');
require('./skiniko.js');

// Εμπλουτίζουμε με δομές και μεθόδους που είναι κοινές σε server και client και
// αφορούν στα παιγνιόχαρτα, στις χαρτωσιές, στην τράπουλα κλπ.

Log.print('reading common "trapoula" module');
//require('../client/common/trapoula.js');

// Εμπλουτίζουμε με δομές και μεθόδους που  αφορούν στα παιγνιόχαρτα, στις χαρτωσιές,
// στην τράπουλα κλπ, και είναι ιδιαίτερες για το server και μόνο.

Log.print('reading server "trapoula" module');
//require('../server/trapoula.js');

// Εμπλουτίζουμε με δομές και μεθόδους που είναι κοινές σε server και client και
// αφορούν στο παιχνίδι, δηλαδή δηλώσεις, αγορές, μπάζες, αξίες κλπ.

Log.print('reading common "pexnidi" module');
//require('../client/common/pexnidi.js');

// Εμπλουτίζουμε με δομές και μεθόδους που αφορούν στις υπηρεσίες που θα παρέχει
// ο Node server.

Log.print('reading "service" module');
require('./service.js');

// Εμπλουτίζουμε με δομές και μεθόδους που αφορούν στη διαχείριση των αιτημάτων
// που υποβάλλουν οι clients.

Log.print('reading "request" module');
require('./request.js');

// Εμπλουτίζουμε με δομές και μεθόδους που αφορούν στον τρόπο με τον οποίο εκκινούν οι
// υπηρεσίες που παρέχει ο παρών server.

Log.print('reading "server" module');
require('./server.js');

// Εμπλουτίζουμε με δομές και μεθόδους που αφορούν στο transaction log.

Log.print('reading "kinisi" module');
require('./kinisi.js');

// Εμπλουτίζουμε με δομές και μεθόδους που αφορούν στον κύκλο τακτικού ελέγχου εργασιών.

Log.print('reading "peripolos" module');
require('./peripolos.js');

// Τρέχουμε τυχόν ιδιαίτερες εντολές για κάθε site, π.χ. στο local site
// όπου κάνουμε ανάπτυξη των προγραμμάτων θέτουμε κάποιες flags για το
// debugging.

try { require('../client/common/rcLocal.js'); } catch(e) {}
try { require('./rcLocal.js'); } catch(e) {}

// Αναπροσαρμόζουμε διάφορες παραμέτρους, στήνουμε το σκηνικό και μπαίνουμε σε κατάσταση
// ετοιμότητας. Όλα αυτά θα γίνουν αλυσιδωτά, εκκινώντας με την "Server.ekinisi"
// και συνεχίζοντας με callbacks, λόγω της ασύγχρονης φύσης του Node.

Server.skiniko = new Skiniko().stisimo();
