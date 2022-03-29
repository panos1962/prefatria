<?php
// Το παρόν  περιέχει PHP δομές και μεθόδους που αφορούν γενικά στην εφαρμογή
// και όχι μόνο στις σελίδες που παρέχονται στο διαδίκτυο.

// Η συμβολική σταθερά "KENTRO_IPOSTIRIXIS" περιέχει το URL του κέντρου υποστήριξης του
// «Πρεφαδόρου». Πρόκειται για εξωτερική σελίδα που περιέχει χρήσιμες πληροφορίες
// και links.

define("KENTRO_IPOSTIRIXIS", "https://sites.google.com/a/prefadoros.net/main/");

// Η συμβολική σταθερά "OWNER_ONOMA" περιέχει το ονοματεπώνυμο του κατέχοντος
// το copyright της εφαρμογής.

define("OWNER_ONOMA", "Panos I. Papadopoulos");

// Η συμβολική σταθερά "OWNER_EMAIL" περιέχει το email του κατέχοντος
// το copyright της εφαρμογής.

define("OWNER_EMAIL", "prefadoros@hotmail.com");

// Η συμβολική σταθερά "SUPPORT_EMAIL" περιέχει το email της τεχνικής
// υποστήριξης της εφαρμογής.

define("SUPPORT_EMAIL", "prefadoros@hotmail.com");

// Η συμβολική σταθερά "VIDA" περιέχει το URL της βίδας.

define("VIDA", "http://www.pexevida.gr");

mb_internal_encoding("UTF-8");
mb_regex_encoding("UTF-8");

if (defined("STDERR") && defined("COMMAND_MODE"))
Globals::$stderr = STDERR;

else
Globals::$stderr = NULL;

Globals::init();
register_shutdown_function('Globals::klise_fige');

// Η κλάση "Globals" χρησιμοποιείται κυρίως ως name space, οπότε δεν υπάρχουν properties
// και όλες οι μέθοδοι είναι static.

class Globals {
	// Η property "stderr" δείχνει το κανάλι εκτύπωσης μηνυμάτων λαθών που
	// αφορούν στη βιβλιοθήκη μας. By default είναι το standard output αλλά
	// μπορεί να είναι το standard error εφόσον έχει οριστεί η σταθερά "COMMAND_MODE".

	public static $stderr;

	// Η property "init_ok" δείχνει αν έτρεξε η μέθοδος "init".
	// Η μέθοδος πρέπει να τρέχει το πολύ μια φορά.

	private static $init_ok;

	// Η property "session_ok" δείχνει αν έτρεξε η μέθοδος "session".
	// Η μέθοδος πρέπει να τρέχει το πολύ μια φορά.

	private static $session_ok;

	// Η property "klise_fige_ok" δείχνει αν έτρεξε η μέθοδος "klise_fige".
	// Η μέθοδος πρέπει να τρέχει το πολύ μια φορά.

	private static $klise_fige_ok;

	// Η property "server" περιέχει το URL του home directory του server
	// στον οποίο βρίσκεται η εφαρμογή. Πρέπει να τελειώνει με "/", καθώς
	// θα κολλήσουμε subdirectories και file names προκειμένου να
	// προσπελάσουμε άλλα αρχεία και directories της εφαρμογής.

	public static $server;

	// Η property "skiser" περιέχει το URL του node server στον οποίο
	// βρίσκεται η εφαρμογή. Πρόκειται για το URL του server ακολουθούμενο
	// από τον αριθμό της πόρτας στην οποία ο node server ακούει αιτήματα
	// της εφαρμογής.

	public static $skiser;

	// Η property "filajs" περιέχει το URL του "filajs" API.

	public static $filajs;

	// Η property "ip" περιέχει την IP του client που αιτείται
	// τις υπηρεσίες της PHP.

	public static $ip;

	// Η property "www" είναι το πλήρες pathname του βασικού directory της
	// εφαρμογής, π.χ. "/home/panos/Desktop/prefadoros/".

	public static $www;

	// Η property "db" είναι ο database handler μέσω του οποίου προσπελαύνουμε
	// την database της εφαρμογής.

	public static $db;

	// Η property "prive" δείχνει αν πρόκειται για πριβέ εκδοχή, δηλαδή για
	// site στο οποίο η εγγραφή γίνεται μόνο από εξουσιοδοτημένους χρήστες.

	private static $prive;

	// Η μέθοδος "init" δίνει τιμές στα properties της κλάσης "Globals" και
	// αρχικοποιεί τις μεθόδους της κλάσεις.

	public static function errmsg($msg) {
		if (isset(self::$stderr))
		fwrite(self::$stderr, $msg);

		else
		print $msg;
	}

	public static function init() {
		if (self::$init_ok) self::klise_fige("init: reinitialization");
		self::$init_ok = TRUE;

		self::$session_ok = FALSE;
		self::$klise_fige_ok = FALSE;
		self::$server = NULL;
		self::$skiser = NULL;
		self::$ip = NULL;
		self::$www = NULL;
		self::$db = NULL;

		if (!isset($_SERVER)) self::klise_fige("_SERVER: not set");
		if (!is_array($_SERVER)) self::klise_fige("_SERVER: not an array");

		$server_name = array_key_exists("HTTP_HOST", $_SERVER) ?
			$_SERVER["HTTP_HOST"] : "localhost";
		self::$skiser = "http://" . $server_name;
		self::$filajs = "http://www.prefadoros.gr/filajs/";

		switch ($server_name) {
		case "127.0.0.1":
		case "localhost":
			self::$server = "http://" . $server_name . "/prefatria/";
			self::$filajs = "http://" . $server_name . "/filajs/";
			break;
		case "www.opasopa.net":
		case "opasopa.net":
			self::$server = "http://" . $server_name . "/prefa/";
			break;
		case "5.9.24.181":
			self::$server = "http://" . $server_name . "/prefadoros/";
			break;
		case "www.prefadoros.gr":
		case "www.prefadoros.com":
		case "www.prefadoros.org":
		case "www.prefaprive.net":
		case "prefadoros.gr":
			self::$server = "http://" . $server_name . "/";
			break;
		default:
			if ($server_name) self::errmsg($server_name . ": ");
			self::klise_fige("unknown server");	
		}

		// Αν έχουμε κλήση με πρωτόκολλο HTTPS, τότε «γυρνάμε» σε HTTP,
		// λόγω της δυσκολίας που έχω με τον node server.

		if (isset($_SERVER['SERVER_PORT']) && ($_SERVER['SERVER_PORT'] == 443)) {
			header("Location: " . self::$server);
			exit(0);
		}

		self::get_client_ip();
		self::$www = preg_replace("/client.lib.standard.php$/", "", __FILE__);
		self::$prive = file_exists(self::$www . "misc/.mistiko/prive");
	}

	// Με την μέθοδο "get_client_ip" βολιδοσκοπούμε την IP του client.

	private static function get_client_ip() {
		self::$ip = "";
		if (array_key_exists("REMOTE_ADDR", $_SERVER)) self::$ip = $_SERVER["REMOTE_ADDR"];
		if (!array_key_exists("HTTP_X_FORWARDED_FOR", $_SERVER)) return;

		$ipf = explode(",", $_SERVER["HTTP_X_FORWARDED_FOR"]);
		if (count($ipf)) self::$ip = $ipf[0];
	}

	// Η μέθοδος "database" μας συνδέει με την database και την καλούμε όποτε υπάρχει
	// ανάγκη συνδέσεως με την database.

	public static function database() {
		if (self::$db) self::klise_fige("database: reconnection");
		$dbhost = "localhost";
		$dbname = "prefatria";
		$dbuser = "prefadoros";

		switch (self::$server) {
		case "http://127.0.0.1/prefatria/":
		case "http://localhost/prefatria/";
		case "http://5.9.24.181/prefadoros/";
		case "http://prefadoros.gr/":
		case "http://www.prefadoros.gr/":
		case "http://opasopa.net/prefa/";
		case "http://www.opasopa.net/prefa/":
			break;
		default:
			if (self::$server) self::errmsg(self::$server . ": ");
			self::klise_fige("unknown server (database)");	
		}

		$bekadb = preg_replace("/[^a-zA-Z0-9]/", "", @file_get_contents(self::$www . "misc/.mistiko/bekadb"));
		self::$db = @new mysqli($dbhost, $dbuser, $bekadb, $dbname);
		self::$db->connect_errno && die("database connection failed (" . self::$db->connect_error . ")");
		@self::$db->set_charset("utf8") || self::klise_fige("cannot set character set (database)");
	}

	// Η μέθοδος "session_init" ενεργοποιεί το session και είναι καλό να καλείται
	// στην αρχή του PHP script.

	public static function session_init() {
		if (self::$session_ok) return;
		self::$session_ok = TRUE;

		// 24 * 7 * 3600 = 604800 (μια εβδομάδα)
		ini_set("session.gc_maxlifetime", "604800");
		session_set_cookie_params(604800);
		session_start();

		if (!isset($_SESSION)) self::klise_fige("_SESSION: not set");
		if (!is_array($_SESSION)) self::klise_fige("_SESSION: not an array");
	}

	// Η μέθοδος "session_set" δέχεται ως παράμετρο ένα key/value pair και θέτει
	// το σχετικό cookie.

	public static function session_set($tag, $val) {
		self::session_init();
		$_SESSION[$tag] = $val;
	}

	// Η μέθοδος "session_clear" δέχεται ως παράμετρο ένα string και διαγράφει
	// το σχετικό cookie.

	public static function session_clear($tag) {
		self::session_init();
		unset($_SESSION[$tag]);
	}

	// Η μέθοδος "is_session" δέχεται ως παράμετρο ένα string και επιστρέφει
	// TRUE εφόσον υπάρχει το αντίστοιχο session cookie.

	public static function is_session($tag) {
		self::session_init();
		return array_key_exists($tag, $_SESSION);
	}

	// Η μέθοδος "oxi_session" δέχεται ως παράμετρο ένα string και επιστρέφει
	// TRUE εφόσον ΔΕΝ υπάρχει το αντίστοιχο session cookie.

	public static function oxi_session($tag) {
		return !self::is_session($tag);
	}

	// Η μέθοδος "session" δέχεται ως παράμετρο ένα string και επιστρέφει
	// την τιμή του αντίστοιχου στοιχείου από το session array.

	public static function session($tag) {
		self::session_init();
		return $_SESSION[$tag];
	}

	public static function is_pektis() {
		return self::is_session("pektis");
	}

	public static function oxi_pektis() {
		return !self::is_pektis();
	}

	public static function pektis_must() {
		if (self::is_pektis()) return;
		Globals::klise_fige("Διαπιστώθηκε ανώνυμη χρήση");
	}

	public static function is_prive() {
		return self::$prive;
	}

	public static function oxi_prive() {
		return !self::is_prive();
	}

	// Η μέθοδος "url" είναι ήσσονος σημασίας και σκοπό έχει τη διευκόλυνση στη γραφή
	// των ονομάτων αρχείων μέσω της πλήρωσης των ονομάτων αυτών με το όνομα του server,
	// π.χ. από "astra" σε "www.prefadoros.gr/astra". Η μέθοδος εκτυπώνει, μάλλον, το
	// πλήρες όνομα, παρά το επιστρέφει, καθώς έτσι είναι πιο εύχρηστη.

	public static function url($fname = "") {
		print self::$server . $fname;
	}

	// Η μέθοδος "diavase" είναι ήσσονος σημασίας καθώς υποκαθιστά την "require" και
	// μόνο σκοπό έχει την απλοποίηση των pathnames.

	public static function diavase($file) {
		require self::$www . "client/" . $file;
	}

	// Η μέθοδος "query" δέχεται ως πρώτη παράμετρο ένα SQL query και το εκτελεί.
	// Αν υπάρξει οποιοδήποτε δομικό πρόβλημα (όχι σχετικό με την επιτυχία ή μη
	// του query), τότε εκτυπώνεται μήνυμα λάθους και το πρόγραμμα σταματά.

	public static function query($query) {
		$result = self::$db->query($query);
		if ($result) return $result;

		self::errmsg("SQL ERROR: " . $query . ": " . self::sql_error());
		self::klise_fige(2);
	}

	public static function sql_errno() {
		return self::$db->errno;
	}

	public static function sql_error() {
		return self::$db->error;
	}

	// Η μέθοδος "first_row" τρέχει ένα query και επιστρέφει την πρώτη γραμμή των
	// αποτελεσμάτων απελευθερώνοντας τυχόν άλλα αποτελέσματα.

	public static function first_row($query, $idx = MYSQLI_BOTH) {
		$result = self::query($query);
		while ($row = $result->fetch_array($idx)) {
			$result->free();
			break;
		}

		return $row;
	}

	public static function insert_id() {
		return self::$db->insert_id;
	}

	public static function affected_rows() {
		return self::$db->affected_rows;
	}

	public static function autocommit($on_off) {
		self::$db->autocommit($on_off) || self::klise_fige("autocommit failed");
	}

	public static function commit() {
		self::$db->commit() || self::klise_fige("commit failed");
	}

	public static function rollback() {
		self::$db->rollback() || self::klise_fige("rollback failed");
	}

	// Η μέθοδος "klidoma" επιχειρεί να θέσει κάποιο database lock που καθορίζεται
	// από το tag που περνάμε ως πρώτη παράμετρο. By default η μέθοδος θεωρεί ότι
	// δεν μπορεί να κλειδώσει εφόσον το κλείδωμα αποτύχει για 2 δευτερόλεπτα, αλλά
	// μπορούμε να περάσουμε μεγαλύτερο ή μικρότερο χρονικό διάστημα ως δεύτερη
	// παράμετρο.
	//
	// Η μέθοδος επιστρέφει TRUE εφόσον το κλείδωμα επιτύχει, αλλιώς επιστρέφει
	// FALSE.

	public static function klidoma($tag, $timeout = 2) {
		$query = "SELECT GET_LOCK(" . self::asfales_sql($tag) . ", " . $timeout . ")";
		$row = self::first_row($query, MYSQLI_NUM);
		if (!$row) return FALSE;
		return($row[0] == 1);
	}

	// Η μέθοδος "xeklidoma" ξεκλειδώνει κάποιο κλείδωμα που θέσαμε με την μέθοδο
	// "klidoma". Το tag του κλειδώματος που θα ξεκλειδωθεί περνιέται ως πρώτη
	// παράμετρος, ενώ ως δεύτερη παράμετρος μπορεί να περάσει TRUE/FALSE value
	// που δείχνει αν πριν το ξεκλείδωμα θα γίνει commit ή rollback αντίστοιχα.
	// Αν δεν περαστεί δεύτερη παράμετρος, τότε δεν γίνεται ούτε commit ούτε
	// rollback, οπότε μπορούμε να συνεχίσουμε στα πλαίσια της τρέχουσας
	// transaction.

	public static function xeklidoma($tag, $commit = NULL) {
		if (isset($commit)) {
			if ($commit) self::$db->commit();
			else self::$db->rollback();
		}

		$query = "DO RELEASE_LOCK(" . self::asfales_sql($tag) . ")";
		self::$db->query($query);
	}

	// Η μέθοδος "klise_fige" κλείνει τη σύνδεση με την database και διακόπτει
	// το πρόγραμμα. Μπορούμε να περάσουμε μήνυμα το οποίο θα εκτυπωθεί πριν τη
	// διακοπή του προγράμματος. Μπορούμε, ακόμη, να περάσουμε ως παράμετρο μια
	// αριθμητική τιμή η οποία θα χρησιμοποιηθεί ως exit status.

	public static function klise_fige($msg = NULL) {
		if (Globals::$klise_fige_ok) return;
		Globals::$klise_fige_ok = TRUE;

		if (isset(self::$db)) {
			self::$db->kill(self::$db->thread_id);
			self::$db->close();
		}

		if (!isset($msg)) {
			$stat = 0;
		}
		elseif (is_int($msg)) {
			$stat = (int)$msg;
		}
		else {
			self::errmsg($msg);
			$stat = 2;
		}

		while (@ob_end_flush());
		die($stat);
	}

	public static function fatal($msg = "generic error") {
		Globals::klise_fige("ERROR: " . $msg);
	}

	// Η μέθοδος "perastike" δέχεται ως παράμετρο ένα string και επιστρέφει
	// TRUE εφόσον έχει περαστεί αντίστοιχη GET/POST παράμετρος.

	public static function perastike($key) {
		return(isset($_REQUEST) && is_array($_REQUEST) && array_key_exists($key, $_REQUEST));
	}

	public static function den_perastike($key) {
		return !self::perastike($key);
	}

	// Η μέθοδος "perastike_must" επιτάσσει να έχει περαστεί η GET/POST παράμετρος που
	// περνάμε ως πρώτη παράμετρο. Αν έχει περαστεί η παράμετρος, τότε επιστρέφεται η
	// τιμή της παραμέτρου, αλλιώς το πρόγραμμα σταματά.

	public static function perastike_must($key, $msg = NULL) {
		if (self::perastike($key)) return $_REQUEST[$key];

		self::errmsg(isset($msg) ? $msg : $key . ": δεν περάστηκε παράμετρος");
		self::klise_fige(2);
	}

	// Η μέθοδος "asfales_sql" δέχεται ένα string και επιστρέφει το ίδιο string
	// αλλά τροποποιημένο ώστε να μην τίθεται θέμα SQL injection. Γίνεται επίσης
	// και διαφυγή των quotes. Το string επιστρέφεται μαζί με τα quotes που το
	// περικλείουν, εκτός και αν περάσουμε δεύτερη (false) παράμετρο.

	public static function asfales_sql($s, $string = TRUE) {
		if (get_magic_quotes_gpc()) $s = stripslashes($s);
		if (isset(self::$db)) $s = self::$db->real_escape_string($s);
		return($string ? "'" . $s . "'" : $s);
	}

	// Η μέθοδος "asfales_json" δέχεται ως παράμετρο ένα string και το επιστρέφει
	// τροποιημένο ώστε να μπορεί με ασφάλεια να ενταχθεί ως rvalue σε json objects
	// μαζί με τα quotes.

	public static function asfales_json($s) {
		$s = str_replace('\\', '\\\\', $s);
		return "'" . str_replace("'", "\'", $s) . "'";
	}

	// Η μέθοδος "akirosi_script" χρησιμοποιείται για να ακυρώσει τυχόν
	// ενσωματωμένο javascript κώδικα σε μηνύματα και συζητήσεις, και
	// το επιτυγχάνει εισάγοντας χαρακτήρα μηδενικού πλάτους πριν τη
	// λέξη script.

	public static function akirosi_script($s) {
		return preg_replace("/script/i", "&#8203;script", $s);
	}

	public static function email_check($email) {
		return filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : NULL;
	}

	public static function header_data() {
		header('Content-type: text/plain; charset=utf-8');
	}

	public static function header_json() {
		header('Content-Type: application/json; charset=utf-8');
	}

	public static function header_html() {
		header('Content-type: text/html; charset=utf-8');
	}

	// Η μέθοδος "random_string" επιστρέφει ένα string συγκεκριμένου μήκους, αποτελούμενο
	// από χαρακτήρες που λαμβάνονται από παλέτα.

	public static function random_string($mikos, $paleta =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789") {
		$s = "";
		$n = strlen($paleta) - 1;
		for ($i = 0; $i < $mikos; $i++) {
			$s .= $paleta[mt_rand(0, $n)];
		}

		return $s;
	}
}
