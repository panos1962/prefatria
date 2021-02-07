<?php
// ΣΑΠ -- Σελίδα Αναψηλάφησης Παρτίδας
// -----------------------------------
//
// Η παρούσα σελίδα χρησιμοποιείται για την αναψηλάφηση παρτίδας. Στο δεξί
// μέρος υπάρχει στήλη με όλες τις διανομές τής παρτίδας, ενώ στο αριστερό
// μέρος υπάρχει τσόχα στην οποία μπορούμε να δούμε τις κινήσεις που έγιναν
// σε κάθε διανομή.
//
// Η παρτίδα καθορίζεται στο URL είτε άμεσα μέσω των παραμέτρων "trapezi" ή
// "partida", είτε έμμεσα μέσω της διανομής που καθορίζεται με την παράμετρο
// "dianomi".

require_once "../lib/standard.php";
Globals::diavase("lib/selida.php");
Globals::database();

Movie::trapoula_set();

Selida::head("Αναψηλάφηση");
?>
<script src="<?php print Globals::$filajs; ?>lib/filajs.js"></script>
<script src="<?php print Globals::$filajs; ?>lib/filajsDOM.js"></script>
<link rel="stylesheet" href="<?php print Globals::$filajs; ?>lib/filajs.css" />
<?php
Movie::boss_check();
Selida::stylesheet("arena/arena");
Selida::stylesheet("arxio/arxio");
Selida::stylesheet("movie/movie");
Selida::javascript("common/prefadoros");
Selida::javascript("common/skiniko");
Selida::javascript("common/partida");
Selida::javascript("common/energia");
Selida::javascript("lib/skiniko");
Selida::javascript("lib/panel");
Selida::javascript("movie/movie");
Selida::javascript("movie/data");
Selida::javascript("movie/partida");
Selida::javascript("movie/panel");
Selida::javascript("movie/online");
Movie::init();

Selida::body();
Selida::toolbar("Αναψηλάφηση παρτίδας");
Selida::fyi_pano();

Selida::ofelimo_begin();
Movie::selida();
Selida::ofelimo_end();

Selida::fyi_kato();
Selida::ribbon();
Selida::telos();

class Movie {
	private static $trapezi = NULL;
	private static $dianomi = NULL;
	private static $thesi = 1;

	private static function trapezi_set($trapezi) {
		self::$trapezi = intval($trapezi);
	}

	private static function is_trapezi() {
		return self::$trapezi;
	}

	private static function oxi_trapezi() {
		return !self::is_trapezi();
	}

	private static function dianomi_set($dianomi) {
		self::$dianomi = intval($dianomi);
	}

	private static function is_dianomi() {
		return self::$dianomi;
	}

	private static function thesi_set($thesi) {
		self::$thesi = intval($thesi) % 3;
		if (self::$thesi <= 0) self::$thesi += 3;
	}

	private static function is_thesi() {
		return self::$thesi;
	}

	private static function oxi_thesi() {
		return !self::is_thesi();
	}

	public static function init() {
		if (Globals::perastike("dianomi"))
		self::dianomi_set($_REQUEST["dianomi"]);

		if (self::is_dianomi())
		self::trapezi_set_dianomi();

		if (self::oxi_trapezi())
		self::trapezi_set_url();

		if (self::oxi_trapezi())
		self::trapezi_set_trexon();

		if (self::oxi_trapezi())
		Globals::klise_fige("Ακαθόριστη παρτίδα");

		if (Globals::perastike("thesi"))
		self::thesi_set($_REQUEST["thesi"]);

		self::trapezi_check();
		?>
		<script type="text/javascript">
		//<![CDATA[
		Movie.trapezi.kodikos = <?php print self::$trapezi; ?>;
		Movie.dianomiURL = <?php print self::is_dianomi() ? self::$dianomi : "null"; ?>;
		Movie.egoThesi = <?php print self::$thesi; ?>;
		Movie.klistaWE = <?php print Globals::perastike("klista") ? "true" : "false"; ?>;
		Movie.tzogosFaneros = <?php print Globals::perastike("tzogos") ? "true" : "false"; ?>;
		Movie.akirosi = <?php print Globals::perastike("akirosi") ? 1 : 0; ?>;
		//]]>
		</script>
		<?php
	}

	private static function trapezi_set_dianomi() {
		$query = "SELECT `trapezi` FROM `dianomi` WHERE `kodikos` = " . self::$dianomi;
		$dianomi = Globals::first_row($query);
		if (!$dianomi)
		Globals::klise_fige("Δεν βρέθηκε τραπέζι για τη διανομή " . self::$dianomi);

		self::trapezi_set($dianomi["trapezi"]);
	}

	private static function trapezi_set_url() {
		if (Globals::perastike("trapezi")) {
			self::trapezi_set($_REQUEST["trapezi"]);
			self::trapezi_check();
			return;
		}

		if (Globals::perastike("partida")) {
			self::trapezi_set($_REQUEST["partida"]);
			self::trapezi_check();
			return;
		}
	}

	private static function trapezi_check() {
		$query = "SELECT `kodikos` FROM `trapezi` WHERE `kodikos` = " . self::$trapezi;
		$trapezi = Globals::first_row($query);
		if (!$trapezi)
		Globals::klise_fige("Δεν βρέθηκε τραπέζι με κωδικό " . self::$trapezi);
	}

	private static function trapezi_set_trexon() {
		if (Globals::oxi_pektis())
		return;

		$pektis = $_SESSION["pektis"];
		$query = "SELECT `kodikos`, `pektis1`, `pektis2`, `pektis3` FROM `trapezi` " .
			"WHERE `arxio` IS NULL ORDER BY `kodikos` DESC";
		$result = Globals::query($query);
		while ($trapezi = $result->fetch_array(MYSQLI_NUM)) {
			for ($thesi = 1; $thesi <= 3; $thesi++) {
				if ($trapezi[$thesi] === $pektis) {
					$result->free();
					self::trapezi_set($trapezi[0]);
					return;
				}
			}
		}
	}

	public static function selida() {
		?>
		<div id="tsoxa" class="tsoxaPeximo"></div>
		<div id="panel"></div>
		<div id="dianomes"></div>
		<?php
	}

	public static function boss_check() {
		if (!file_exists("Boss!"))
		return;
		?>
		<link rel="stylesheet" href="<?php print Globals::$filajs; ?>lib/filajsBoss.css" />
		<?php
	}

	// Η μέθοδος "trapoula_set" καθορίζει την τράπουλα που θα χρησιμοποιηθεί στην
	// αναψηλάφηση της παρτίδας. Η τελική επιλογή θα γίνει με βάση το session cookie
	// "trapoula", αλλά ξεκινάμε την έρευνά μας από τυχόν παράμετρο χρήστη "ΤΡΑΠΟΥΛΑ".

	public static function trapoula_set() {
		// Αν έχουμε ανώνυμη χρήση θα βασιστούμε στο session cookie "trapoula",
		// είτε αυτό είναι ορισμένο είτε όχι.

		if (Globals::oxi_pektis())
		return;

		// Διαπιστώθηκε επώνυμη χρήση, επομένως θα ελέγξουμε για τυχόν παράμετρο
		// χρήστη "ΤΡΑΠΟΥΛΑ".

		$query = "SELECT `timi` FROM `peparam` WHERE (`pektis` LIKE " .
			Globals::asfales_sql(Globals::session("pektis")) .
			") AND (`param` LIKE 'ΤΡΑΠΟΥΛΑ')";
		$param = Globals::first_row($query, MYSQLI_NUM);

		// Αν δεν υπάρχει παράμετρος χρήστη "ΤΡΑΠΟΥΛΑ" βασιζόμαστε πάλι στο session
		// cookie "trapoula", είτε αυτό είναι ορισμένο είτε όχι.

		if (!$param)
		return;

		// Βρέθηκε παράμετρος χρήστη με την οποία καθορίζεται τράπουλα, οπότε θέτουμε
		// το σχετικό session cookie.

		if ($param[0])
		Globals::session_set("trapoula", $param[0]);
	}
}
?>
