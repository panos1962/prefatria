////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Δημιουργούμε το singelton "DB" το οποίο αφορά στην επαφή μας με την database.
// Περιέχει connection pool, connection free stack και σχετικές functions.

DB = {};

Debug.flagSet('database');
Debug.flagSet('database', false);

// Ακολουθεί το connection pool. Πρόκειται για array συνδέσεων με την database.
// Κάθε νέα connection προστίθεται στο array. Εφόσον φροντίζουμε να απελευθερώνουμε
// τα database connections μετά την εκτέλεση των σχετικών queries, τα connections
// μπορούν να ξαναχρησιμοποιηθούν αργότερα. Το πρόγραμμα φροντίζει ώστε τα
// connections να παραμένουν ενεργά δίνοντας ψευδοqueries όταν παρέλθει αρκετός
// χρόνος κατά τον οποίο τα connections παραμένουν ανενεργά.

DB.pool = [];

// Ακουλουθεί το free stack του connection pool. Κάθε connection που δεν χρειάζεται
// πια, τοποθετείται στο free stack και το connection ανασύρεται πάλι όταν χρειαστούμε
// νέο. Στο free stack δεν κρατάμε τα ίδια τα connections αλλά τους αντίστοιχους δείκτες
// από το connection pool, δηλαδή νούμερα 0, 1, 2 κλπ.

DB.freeStack = [];

// Η μέθοδος "connection" μας επιστρέφει ένα connection προς την database είτε από
// το connection pool, εφόσον υπάρχει ελεύθερο connection, είτε δημιουργεί νέο.

DB.connection = function() {
	var conn;

	if (!DB.freeStack.length)
	return new DBSindesi();

	conn = DB.pool[DB.freeStack.pop()];
	if (conn.isActive())
	Globals.fatal('active database connection detected in the free stack');

	conn.activeSet(true);
	return conn;
}

// Η property "timeout" δείχνει σε πόσα milliseconds μια sql connection θεωρείται ανενεργή.
// Αν, δηλαδή, κάποια sql connection δεν εκτελέσει query στο συγκεκριμένο διάστημα, τότε
// θα θεωρηθεί ανενεργή και πιθανότατα κάποια περίπολος θα την θέσει στο free stack ως
// ελεύθερη.
//
// Η τιμή αυτή αναπροσαρμόζεται κατά την εκκίνηση με βάση τις πραγματικές timeout τιμές του
// sql server. Η property "timeout" χρησιμοποιείται για να μην μας κλείσει τη σύνδεση ο sql
// server λόγω αχρησίας. Οι συνδέσεις που βρίσκονται στο free stack επανενεργοποιούνται από
// καιρού εις καιρόν εκτελώντας κάποιο ανώδυνο ψευδοquery.

DB.timeout = 10000;

// Η function "timeoutSet" δέχεται μια γραμμή αποτελεσμάτων που αποσπούμε στην αρχή από τον
// sql server και εξετάζει τις συγκεκριμένες παραμέτρους προκειμένου να καθορίσει μια ορθή,
// ρεαλιστική τιμή για το sql connection timeout. Στη γραμμή αποτελεσμάτων περιέχονται δυο
// timeout παράμετροι του sql server, διαλέγουμε τη μικρότερη και με βάση αυτή την τιμή
// αυτής της παραμέτρου καθορίζουμε όλα τα υπόλοιπα.

DB.timeoutSet = function(rows) {
	var sqlTimeout;

	if (rows.length != 1) throw 'DB.timeoutSet: failed to get sql timeout values';

	sqlTimeout = Math.floor(rows[0].ito < rows[0].wto ? rows[0].ito : rows[0].wto);

	// Οι τιμές των παραμέτρων δίνονται σε seconds. Αφού τις μετατρέψουμε σε milliseconds,
	// φροντίζουμε να θέσουμε τις περιόδους ελέγχου σε τιμές που να διασφαλίζουν ότι οι
	// συνδέσεις με την database δεν θα λήξουν.

	sqlTimeout *= 1000;
	Log.print('MySQL database connection timeout: ' + sqlTimeout + ' ms');

	// Ορίζουμε τακτικό έλεγχο ανενεργών συνδέσεων περίπου στο μισό του μέγιστου
	// επιτρεπτού χρόνου ανενεργών συνδέσεων.

	Peripolos.ergasia.dbconn.period = Math.floor(sqlTimeout / 2);
	Log.print('database connection patrol cycle: ' + Peripolos.ergasia.dbconn.period + ' ms');

	// Κατά τον έλεγχο θα επανεργοποιήσουμε συνδέσεις που είναι ανενεργές για περίπου
	// το 90% του χρόνου της περιόδου ελέγχου.

	DB.timeout = Math.floor(Peripolos.ergasia.dbconn.period * 0.9);
	Log.print('database connection idle max: ' + DB.timeout + ' ms');

	if (DB.timeout < 10000)
		throw 'DB.timeoutSet: too small database connection timeout (' +
			Math.floor(DB.timeout / 1000) + ' sec)';
}

// Αν το connection δεν εκτελέσει κανένα πραγματικό query για πάνω από μισή ώρα, τότε
// θεωρείται zombie και επανατοποθετείται στο free stack. Η property "zombie" σκοπό έχει
// να θεραπεύσει τυχόν προγραμματιστικά σφάλματα μέσω των οποίων μπορεί να δημιουργούνται
// διαρροές συνδέσεων. Ουσιαστικά, όταν κάποιο sql connection δεν εκτελέσει κάποιο query
// για μεγάλο χρονικό διάστημα, θεωρούμε ότι ξεχάστηκε να απελευθερωθεί από τον προγραμματιστή
// και το απελευθερώνουμε εμείς.

DB.zombie = 1800000;	// 30 minutes X 60 seconds X 1000 = μισή ώρα σε milliseconds

// Η μέθοδος "check" καλείται στα πλαίσια τακτικού περιοδικού ελέγχου και σκοπό έχει την
// επανεργοποίηση ανενεργών συνδέσεων προκειμένου αυτές να μην κλείσουν από τον database
// server. Ο έλεγχος αφορά σε όλες τις συνδέσεις και όχι μόνο σ' αυτές που έχουν κλείσει
// τον κύκλο τους και έχουν τοποθετηθεί στο free stack. Βέβαια, οι συνδέσεις που είναι
// ενεργές και εκτελούν κάποια queries είναι μάλλον απίθανο να επανενεργοποιηθούν, καθώς
// δεν θα υπερβαίνουν το χρονικό όριο απενεργοποίησης. Όλες οι χρονικές τιμές είναι σε
// milliseconds.

DB.check = function() {
	var tora, ora;

	tora = Globals.torams();
	ora = Globals.ora(null, true);

	if (Debug.flagGet('database'))
	Globals.consoleLog('Περίπολος: DB.check');

	Globals.walk(DB.pool, function(i, conn) {
		// Επανενεργοποιούνται συνδέσεις που φαίνονται ανενεργές για αρκετά
		// μεγάλο χρονικό διάστημα.

		if (tora - conn.action > DB.timeout) {
			if (Debug.flagGet('database'))
			Globals.consoleLog('SQL connection timeout: ' + conn.index);

			conn.action = tora;
			conn.connection.query('SELECT 1', function(err, res) {
				if (err) throw err;
				if (!res) throw new Error('refresh failed for database connection ' + conn.index);
			});
		}

		// Απελευθερώνονται συνδέσεις που πιθανότατα δεν απελευθερώθηκαν από
		// τα προγράμματα που τις έχουν δεσμεύσει (zombies).

		if (conn.isActive() && (tora - conn.realAction > DB.zombie)) {
			Globals.consoleLog('zombie SQL connection freed: ' + conn.index);
			conn.free();
		}
	});
}

// Η function "reset" κλείνει όλα τα database connections και "μηδενίζει" το connection
// pool και το connection free stack.

DB.reset = function(callback) {
	Log.level.push('closing database connections');
	DB.resetRest(callback);
}

DB.resetRest = function(callback) {
	if (DB.pool.length) return DB.pool.pop().connection.end(function() {
		Log.print('connection ' + DB.pool.length);
		DB.resetRest(callback);
	});

	DB.pool = [];
	DB.freeStack = [];
	if (callback) callback();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Για να συνδεθούμε με την database πρέπει να δώσουμε τις κατάλληλες παραμέτρους
// στην "createConnection" μέθοδο του MySQL node module. Οι παράμετροι αυτές είναι:
//
//	database	Το όνομα της database, π.χ. "prefatria"
//
//	user		Το όνομα του database user μέσω του οποίου προσπελαύνουμε
//			την database, π.χ. "prefadoros".
//
//	password	Το password του database user που αναφέραμε παραπάνω.
//
//	host		Το hostname του database server. Συνήθως είναι το "localhost".
//			Αν η σύνδεσή μας στην database γίνεται με UNIX socket και όχι
//			μέσω TCP/IP, τότε η παράμετρος αυτή δεν είναι απαραίτητη.
//
//	socketPath	Το sokcet pathname του UNIX socket μέσω του οποίου συνδεόμαστε
//			με την database. ΑΝ η σύνδεση γίνεται μέσω TCP/IP, τότε αυτή η
//			παράμετρος δεν είναι απαραίτητη.
//
// Για να υπάρχει ευελιξία κάποιες από τις παραπάνω παραμέτρους δίνονται σε εξωτερικά
// files στο directory "misc/.mistiko", κάτω από το βασικό directory της εφαρμογής.

DB.nodedb = ('{' + Server.readFileSync('misc/.mistiko/nodedb') + '}').evalAsfales();

if (!DB.nodedb.hasOwnProperty('database'))
DB.nodedb.database = 'prefatria';

if (!DB.nodedb.hasOwnProperty('user'))
DB.nodedb.user = 'prefadoros';

DB.nodedb.password = Server.readFileSync('misc/.mistiko/bekadb').replace(/[^a-zA-Z0-9]/g, '');

// Ακολουθεί η κλάση "DBSindesi" που παριστά συνδέσεις με την database. Πρόκειται
// για ενισχυμένα αντικείμενα συνδέσεων, δηλαδή συνδέσεις που εμπλουτίζονται με
// επιπλέλον properties και μεθόδους.

DBSindesi = function() {
	// Το property "active" δείχνει αν το connection είναι ενεργό, δηλαδή
	// αν το connection δεν έχει τοποθετηθεί ή επανατοποθετηθεί στο free
	// stack.

	this.activeSet(true);

	// Το property "action" δείχνει τη χρονική στιγμή της τελευταίας επαφής
	// του connection με την database, ενώ το property "realAction" δείχνει
	// τη χρονική στιγμή που το connection χρησιμοποιήθηκε από το πρόγραμμα
	// για να φέρει εις πέρας κάποιο πραγματικό query. Όταν λέμε πραγματικό
	// query εννοούμε query ουσίας και όχι ψευδοquery που δίδεται για να
	// κρατήσει "ζωντανή" τη σύνδεση.

	this.realAction = (this.action = Globals.torams());

	// Το property "connection" είναι η καρδιά του connection. Πρόκειται
	// για το connection αυτό καθεαυτό.

	this.connection = MYSQL.createConnection(DB.nodedb);

	// Αμέσως μετά τη δημιουργία νέας σύνδεσης με την database, τοποθετούμε
	// τη νέα σύνδεση στο connection pool και κρατάμε τη θέση στo property
	// "index".

	this.indexSet(DB.pool.push(this) - 1);
	Globals.consoleLog('new database connection: ' + this.indexGet());
}

DBSindesi.prototype.indexSet = function(idx) {
	this.index = idx;
	return this;
}

DBSindesi.prototype.indexGet = function() {
	return this.index;
}

DBSindesi.prototype.activeSet = function(naiOxi) {
	this.active = naiOxi;
	return this;
}

DBSindesi.prototype.isActive = function() {
	return this.active;
}

DBSindesi.prototype.oxiActive = function() {
	return !this.isActive();
}

// Η μέθοδος "escape" χρησιμοποιείται κυρίως στην κατασκευή των queries και σκοπό
// έχει την προφύλαξη από SQL injections και το escaping των ειδικών χαρακτήρων.

DBSindesi.prototype.escape = function(s) {
	return this.connection.escape(s);
}

// Η μέθοδος "query" είναι αυτή που αναλαμβάνει να εκτελέσει τα queries του ανά χείρας
// connection. Ως παραμέτρους δέχεται το query αυτό καθεαυτό και (προαιρετικά) μια
// callback function που, εφόσον έχει δοθεί, θα κληθεί με παραμέτρους την ίδια τη
// σύνδεση και το αποτέλεσμα του query.

DBSindesi.prototype.query = function(query, callback) {
	var conn;

	if (Debug.flagGet('database'))
	console.log('connection: ' + this.index + '\n' + query);

	if (this.oxiActive())
	Globals.fatal(query + ': inactive database connection');

	conn = this;
	this.realAction = (this.action = Globals.torams());
	this.connection.query(query, function(err, res) {
		if (err) {
			switch (err.code) {
			case 'ER_NO_REFERENCED_ROW_':
			case 'ER_LOCK_DEADLOCK':
				conn.affectedRows = 0;
				delete conn.insertId;
				if (callback) callback(conn);
				return;
			default:
				console.error(query);
				throw err;
			}
		}

		if (!res) throw new Error('null database query result');

		conn.affectedRows = res.affectedRows;
		if (isNaN(conn.affectedRows))
		conn.affectedRows = 0;

		conn.insertId = res.insertId;
		if (callback) callback(conn, res);
	});

	return this;
}

// Μετά το πέρας των εργασιών που επιτελούνται στα πλαίσια κάποιας database connection,
// πρέπει να καλείται η μέθοδος "free" με την οποία επιστρέφεται το connection στο free
// stack ώστε να μπορεί να ξαναχρησιμοποιηθεί.

DBSindesi.prototype.free = function() {
	if (this.oxiActive())
	Globals.fatal('inactive database connection pushed free');

	this.activeSet(false);
	DB.freeStack.push(this.index);
	return this;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η μέθοδος "transaction" εκκινεί μια σειρά από queries που θα πρέπει να εκτελεστούν ως
// ενιαίο transaction. Η μέθοδος δέχεται (υποχρεωτικά) μια callback function που θα είναι
// αυτή που θα παραλάβει τη σκυτάλη, πιθανόν για να εκτελέσει το πρώτο query. Η callback
// function καλείται με παράμετρο την ίδια τη σύνδεση.

DBSindesi.prototype.transaction = function(callback) {
	this.query('START TRANSACTION', function(conn) {
		callback(conn);
	});

	return this;
}

// Η μέθοδος "commit" κλείνει μια σειρά από queries που είχαν εκκινήσει με τη μέθοδο
// "transaction" κάνοντας commit. Ως παράμετρο μπορούμε να περάσουμε callback function
// που θα κληθεί με παράμετρο την ίδια τη σύνδεση. Αν δεν περάσουμ callback function,
// τότε η σύνδεση απελευθερώνεται και επιστρέφει στο free stack.

DBSindesi.prototype.commit = function(callback) {
	this.query('COMMIT', function(conn) {
		if (callback) callback(conn);
		else conn.free();
	});

	return this;
}

// Η μέθοδος "rollback" κλείνει μια σειρά από queries που είχαν εκκινήσει με τη μέθοδο
// "transaction" κάνοντας rollback, ακυρώνοντας ουσιαστικά τις όποιες αλλαγές τα queries
// αυτά επέφεραν στην database. Ως παράμετρο μπορούμε να περάσουμε callback function
// που θα κληθεί με παράμετρο την ίδια τη σύνδεση. Αν δεν περάσουμ callback function,
// τότε η σύνδεση απελευθερώνεται και επιστρέφει στο free stack.

DBSindesi.prototype.rollback = function(callback) {
	this.query('ROLLBACK', function(conn) {
		if (callback) callback(conn);
		else conn.free();
	});

	return this;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "xeklidoma" χρησιμοποιείατι ως default callback function κατά
// το ξεκλείδωμα, ή ως default callback function κατά το κλείδωμα.

DBSindesi.xeklidoma = function(conn) {
	conn.free();
}

// Η function "klidomeno" χρησιμοποιείται ως default error function σε περίπτωση
// που κάποιο κλείδωμα αποτύχει.

DBSindesi.klidomeno = function(conn, tag) {
	conn.free();
	throw tag + ': database lock exists'
}

DBSindesi.prototype.klidoma = function(tag, opts) {
	var query;

	if (opts === undefined) opts = {};
	if (!opts.hasOwnProperty('onsuccess')) opts.onsuccess = DBSindesi.xeklidoma;
	if (!opts.hasOwnProperty('onerror')) opts.onerror = DBSindesi.klidomeno;
	if (!opts.hasOwnProperty('timeout')) opts.timeout = 2;

	query = 'SELECT GET_LOCK(' + this.escape(tag) + ', ' + opts.timeout + ') AS `lock`';
	this.query(query, function(conn, rows) {
		if (rows.length != 1) return opts.onerror(conn, tag);
		if (rows[0]['lock'] != 1) return opts.onerror(conn, tag);
		opts.onsuccess(conn);
	});

	return this;
}

DBSindesi.prototype.xeklidoma = function(tag, callback) {
	var query = 'DO RELEASE_LOCK(' + this.escape(tag) + ')';
	if (callback === undefined) callback = DBSindesi.xeklidoma;
	this.query(query, function(conn) {
		callback(conn);
	});

	return this;
}
