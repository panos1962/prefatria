<?php
class Dianomi {
	public function __construct($dianomi = NULL) {
		if (!isset($dianomi))
		return;

		if (is_numeric($dianomi)) {
			$query = "SELECT * FROM `dianomi` WHERE `kodikos` = " . $dianomi;
			$res = Globals::query($query);

			$dianomi = $res->fetch_array(MYSQLI_ASSOC);
			$res->free();

			if (!$dianomi)
			return;
		}

		$this->kodikos = intval($dianomi["kodikos"]);
		$this->trapezi = intval($dianomi["trapezi"]);
		$this->enarxi = $dianomi["enarxi"];
		$this->dealer = intval($dianomi["dealer"]);
		$this->kasa = array(0, 0, 0, 0);
		$this->metrita = array(0, 0, 0, 0);
		$this->kapikia = array(0, 0, 0, 0);
		$this->telos = $dianomi["telos"];

		// Για κάθε παίκτη υπάρχει ένα πεδίο «κάσας» και ένα πεδίο «μετρητών».
		//
		// Το πεδίο της «κάσας» περιέχει τα καπίκια που πήρε ή κατέβαλε στην κάσα
		// ο παίκτης στα πλαίσια της συγκεκριμένης διανομής. Από αυτά τα καπίκια
		// το ένα τρίτο θεωρείται εν δυνάμει του παίκτη, αν π.χ. κάποις παίκτης
		// έχει +60 καπίκια στην κάσα, τότε σημαίνει ότι ο παίκτης «σήκωσε» 60
		// καπίκια από την κάσα, ωστόσο το κέρδος του από αυτή τη συναλλαγή ήταν
		// 40 καπίκια, καθώς τα 20 καπίκια ήταν εν δυνάμει δικά του.
		//
		// Το πεδίο των «μετρητών» αφορά σε καπίκια που κάποιος παίκτης καταβάλλει
		// στους άλλους παίκτες, ή εισπράττει από τους άλλους παίκτες, και ως εκ
		// τούτου θα πρέπει το αλγεβρικό άθροισμα των «μετρητών» να είναι μηδέν.

		// Με βάση τα παραπάνω υπολογίζουμε τα κέρδη και της ζημίες καθενός από
		// τους παίκτες για τη συγκεκριμένη διανομή και τα κρατάμε στο attribute
		// "kapikia" που δεικτοδοτείται με τη θέση του παίκτη.

		for ($thesi = 1; $thesi <= 3; $thesi++) {
			$this->kasa[$thesi] = intval($dianomi["kasa" . $thesi]);
			$this->metrita[$thesi] = intval($dianomi["metrita" . $thesi]);

			// Αρχικά προσθέτουμε στα κέρδη του παίκτη όλη την «κάσα» που έχει
			// σηκώσει και τα «μετρητά» του. Αργότερα θα αφαιρέσουμε το ένα
			// τρίτο από την «κάσα», καθώς ένα τρίτο αυτού του ποσού θα
			// αφαιρεθεί από όλους τους παίκτες.

			$this->kapikia[$thesi] += $this->kasa[$thesi] + $this->metrita[$thesi];

			// Υπολογίζουμε το περίφημο ένα τρίτο του ποσού που «σήκωσε»
			// ο παίκτης από την κάσα του.

			$kasa = sprintf("%.2f", $this->kasa[$thesi] / 3);

			// Αυτό το ένα τρίτο αφαιρείται τώρα από τα κέρδη όλων των παικτών,
			// επομένως και από τα κέρδη του ανά χείρας παίκτη.

			for ($i = 1; $i <= 3; $i++)
			$this->kapikia[$i] -= $kasa;
		}
	}

	public function kodikos_get() {
		return $this->kodikos;
	}

	public function kasa_get($pektis) {
		return $this->kasa[$pektis];
	}

	public function metrita_get($pektis) {
		return $this->metrita[$pektis];
	}

	public function kapikia_get($pektis) {
		return $this->kapikia[$pektis];
	}

	// Η function "is_pliromi" ελέγχει αν στην ανά χείρας διανομή υπάρχουν
	// κέρδη ή ζημίες και ως εκ τούτου αν η διανομή έχει παιχτεί και έχει
	// πληρωθεί.

	public function is_pliromi() {
		for ($thesi = 1; $thesi <= 3; $thesi++) {
			if ($this->kapikia_get($thesi))
			return TRUE;
		}

		return FALSE;
	}

	public function oxi_pliromi() {
		return !$this->is_pliromi();
	}

	public function energia_fetch() {
		$this->energia = array();

		$query = "SELECT * FROM `energia` WHERE `dianomi` = " . $this->kodikos . " ORDER BY `kodikos`";
		$res = Globals::query($query);

		while ($row = $res->fetch_array(MYSQLI_ASSOC))
		$this->energia[] = new Energia($row);

		$res->free();
		return $this;
	}

	public function energia_get($idx) {
		if (!isset($this->energia))
		$this->energia_fetch();

		return $this->energia[$idx];
	}

	public function energia_walk($callback, $method = FALSE) {
		if (!isset($this->energia))
		$this->energia_fetch();

		for ($n = count($this->energia), $i = 0; $i < $n; $i++) {
			if ($method)
			$ret = $this->$callback($this->energia[$i], $i);

			else
			$ret = $callback($this->energia[$i], $i);

			if (!$ret)
			break;
		}

		return $this;
	}

	public function agora_fetch() {
		$this->agora = new Agora();

		if (!isset($this->energia))
		$this->energia_fetch();

		$this->energia_walk("agora_seek", TRUE);

		return $this;
	}

	private function agora_seek($energia) {
		if ($energia->is_agora()) {
			$this->agora->energia_set($energia);
			return FALSE;
		}

		// Αν έχει παιχτεί φύλλο ενώ ακόμη δεν έχει εντοπιστεί ενέργεια αγοράς,
		// τότε σημαίνει ότι παίζεται το πάσο και παύουμε την αναζήτηση αγοράς.

		if ($energia->is_filo())
		return FALSE;

		return TRUE;
	}

	public function is_agora() {
		return $this->agora_get()->is_agora();
	}

	public function agora_get() {
		if (!isset($this->agora))
		$this->agora_fetch();

		return $this->agora;
	}

	public function tzogadoros_get() {
		$agora = $this->agora_get();
		return $agora->is_agora() ? $agora->pektis_get() : NULL;
	}

	public function fila_fetch() {
		$this->fila = array("", "", "", "");

		if (!isset($this->energia))
		$this->energia_fetch();

		$this->energia_walk("fila_seek", TRUE);

		return $this;
	}

	private function fila_seek($energia) {
		if ($energia->is_dianomi()) {
			$this->fila[1] = substr($energia->data, 0, 20);
			$this->fila[2] = substr($energia->data, 20, 20);
			$this->fila[3] = substr($energia->data, 40, 20);
			$this->fila[0] = substr($energia->data, 60, 4);
			return FALSE;
		}

		if ($energia->is_dilosi())
		return FALSE;

		return TRUE;
	}

	public function fila_get($pektis) {
		if (!isset($this->fila))
		$this->fila_fetch();

		return $this->fila[$pektis];
	}

	public function tzogos_get() {
		return $this->fila_get(0);
	}

	public function simetoxi_fetch() {
		$this->simetoxi = array("", "", "", "");
		$this->simetoxi[$this->tzogadoros_get()] = "Α";

		if (!isset($this->energia))
		$this->energia_fetch();

		$this->energia_walk("simetoxi_seek", TRUE);

		return $this;
	}

	private function simetoxi_seek($energia) {
		if ($energia->is_simetoxi()) {
			switch ($energia->data) {
			case "ΠΑΙΖΩ":
				$this->simetoxi[$energia->pektis] = "Π";
				return TRUE;
			case "ΜΑΖΙ":
				$this->simetoxi[$energia->pektis] = "Ζ";
				return FALSE;
			case "ΠΑΣΟ":
				$this->simetoxi[$energia->pektis] = "Σ";
				return TRUE;
			case "ΜΟΝΟΣ":
				return TRUE;
			default:
				Globals::errmsg($energia->kodikos . ": " .
					$energia->data . ": άγνωστο είδος συμμετοχής\n");
				return TRUE;
			}
		}

		if ($energia->is_filo())
		return FALSE;

		return TRUE;
	}

	public function simetoxi_get($pektis) {
		if (!isset($this->simetoxi))
		$this->simetoxi_fetch();

		return $this->simetoxi[$pektis];
	}

	// Η function "bazes_fetch" καταμετρά τις μπάζες των παικτών. Ουσιαστικά
	// πρόκειται για ένα είδος reverse engineering, καθώς πρέπει να διατρέξουμε
	// όλες τις ενέργειες της διανομής προκειμένου να ανασυστήσουμε τις μπάζες.

	public function bazes_fetch() {
		$this->bazes = array(0, 0, 0, 0);

		// Αν δεν έχει πληρωθεί -και επομένως δεν έχει παιχτεί- η διανομή,
		// αφήνουμε τις μπάζες στο μηδέν.

		if ($this->oxi_pliromi())
		return $this;

		// Η διανομή έχει πληρωθεί και ως εκ τούτου έχει παιχτεί, επομένως
		// προχωρούμε στην καταμέτρηση των μπαζών.

		// Χρησιμοποιούμε άλλη function καταμέτρησης όταν έχουμε αγορά…

		if ($this->is_agora())
		$this->bazes_fetch_agora();

		// …και άλλη όταν παίζουμε το πάσο.

		else
		$this->bazes_fetch_paso();

		return $this;
	}

	private function bazes_fetch_agora() {
		$tzogadoros = $this->tzogadoros_get();

		// Η μεταβλητή "lipes" κρατάει το πλήθος των μπαζών που έχουν απομείνει
		// καθ' όλη τη διάρκεια της διαδικασίας.

		$lipes = 10;

		// Για κάθε παιζόμενη μπάζα κρατάμε κάποια στοιχεία καθώς παίζεται η μπάζα.
		// Πιο συγκεκριμένα, κρατάμε τα φύλλα της μπάζας στο array "fila"

		$fila = array();

		// …το ποιος παίκτης έπαιξε κάθε φύλλο στο array "pios"

		$pios = array();

		// …το αν κάποιος παίκτης έχει παίξει κάποιο φύλλο στην παιζόμενη μπάζα στη
		// λίστα "soip"

		$soip = array();

		// …και το πλήθος των παικτών που έχουν παίξει κάποιο φύλλο στην εκάστοτε
		// τελευταία μπάζα που «κλείνει» κατά τη διάρκεια της διαδικασίας.

		$npek = 0;

		// Διατρέχουμε τις ενέργειες της διανομής προκειμένου να εντοπίσουμε εκείνες
		// τις ενέργειες που θα μας βοηθήσουν να καταμετρήσουμε τις μπάζες της διανομής.

		for ($n = count($this->energia), $i = 0; $i < $n; $i++) {
			$energia = $this->energia_get($i);

			// Ως γνωστόν, η ενέργεια τύπου claim έχει κρατηθεί μόνον εφόσον
			// το claim έχει γίνει αποδεκτό.

			if ($energia->is_claim()) {
				$this->bazes[$tzogadoros] += $lipes;
				return $this;
			}

			// Ψάχνουμε ενέργειες τύπου "ΦΥΛΛΟ".

			if ($energia->oxi_filo())
			continue;

			// Έχουμε ανά χείρας ενέργεια τύπου "ΦΥΛΛΟ" και αποσπούμε τον
			// παίκτη που έπαιξε το φύλλο.

			$pektis = $energia->pektis_get();

			// Αν ο παίκτης που έπαιξε το φύλλο υπάρχει ήδη στο μητρώο παικτών
			// τρέχουσας μπάζας, τότε σημαίνει ότι έχει κλείσει η προηγούμενη
			// μπάζα και το ανά χείρας φύλλο είναι το πρώτο νέας μπάζας και
			// μάλιστα ο παίκτης που παίζει το φύλλο είναι αυτός που κέρδισε
			// την προηγούμενη μπάζα.

			if (array_key_exists($pektis, $soip)) {
				$this->bazes[$pektis]++;
				$lipes--;

				// Η μεταβλητή "npek" δείχνει πόσα φύλλα μετέχουν στην μπάζα
				// και θα μας χρειαστεί στον έλεγχο της τελευταίας μπάζας.
				// Αν παίζουν τρεις παίκτες τότε το npek είναι 3, αν παίζουν
				// δύο παίκτες είναι 2· άλλη περίπτωση δεν υπάρχει.

				$npek = count($fila);

				// Στήνουμε νέα μπάζα «μηδενίζοντας» τις σχετικές δομές.

				$fila = array();
				$pios = array();
				$soip = array();
			}

			// Κρατάμε τα στοιχεία του ανά χείρας φύλλου στις δομές της τρέχουσας
			// μπάζας.

			$filo = new Filo($energia->data_get());

			// Αν κάτι δεν πάει καλά με τα φύλλα, μηδενίζουμε τις μπάζες και
			// διακόπτουμε τη διαδικασία.

			if ($filo->oxi_filo()) {
				Globals::errmsg($this->kodikos_get() . ": " . $energia->kodikos_get() .
					": " . $energia->data_get() . ": λανθασμένο φύλλο");
				$this->bazes = array(0, 0, 0, 0);
				return $this;
			}

			$fila[] = $filo;
			$pios[] = $pektis;
			$soip[$pektis] = TRUE;
		}

		// Αν οι μπάζες που απομένουν είναι 10, τότε σημαίνει ότι δεν έχουν παιχτεί
		// φύλλα στη διανομή και αυτό μπορεί να συμβαίνει μόνον εφόσον οι αμυνόμενοι
		// απείχαν. Σ' αυτήν την περίπτωση ο τζογαδόρος καρπώνεται όλες τις μπάζες.

		if ($lipes >= 10) {
			$this->bazes[$tzogadoros] = 10;
			return $this;
		}

		// Πρέπει να έχει μείνει η τελευταία μπάζα στον αέρα, αλλιώς κάτι δεν πάει
		// καλά εφόσον η διανομή έχει πληρωθεί.

		if ($lipes !== 1) {
			Globals::errmsg($this->kodikos_get() . ": πλεονάζουσες μπάζες\n");
			$this->bazes = array(0, 0, 0, 0);
			return $this;
		}

		// Το πλήθος των φύλλων της τελευταίας μπάζας πρέπει να συμφωνεί με το πλήθος
		// της τελευταίας μπάζας που έκλεισε.

		if (($npek < 2) || (count($fila) !== $npek)) {
			Globals::errmsg($this->kodikos_get() . ": ελλείπουσες μπάζες\n");
			$this->bazes = array(0, 0, 0, 0);
			return $this;
		}

		// Έχουμε διασφαλίσει κατά το δυνατόν την ορθότητα της τελευταίας μπάζας και
		// θα προβούμε τώρα στον εντοπισμό του παίκτη που κερδίζει τη συγκεκριμένη
		// μπάζα.

		$atou = $this->agora_get()->xroma_get();

		// Εκκινούμε τη διαδικασία θεωρώντας αρχικά ότι ο παίκτης που κερδίζει την
		// τελευταία μπάζα είναι ο παίκτης που βάζει το πρώτο φύλλο της μπάζας.

		$pektis = $pios[0];
		$trexon_xroma = $fila[0]->xroma_get();
		$trexousa_dinami = $fila[0]->dinami_get();

		// Διατρέχουμε τώρα τα υπόλοιπα φύλλα της τελευταίας μπάζας.

		for ($i = 1; $i < $npek; $i++) {
			$xroma = $fila[$i]->xroma_get();
			$dinami = $fila[$i]->dinami_get();

			// Αν το ανά χείρας φύλλο ακολουθεί στο χρώμα που μέχρι στιγμής επικρατεί,
			// είτε είναι αυτό το χρώμα του πρώτου φύλλου είτε είναι το χρώμα των ατού,
			// ελέγχουμε την αξία του φύλλου.

			if ($xroma === $trexon_xroma) {
				if ($dinami <= $trexousa_dinami)
				continue;

				$pektis = $pios[$i];
				$trexousa_dinami = $dinami;
				continue;
			}

			if ($xroma !== $atou)
			continue;

			$pektis = $pios[$i];
			$trexon_xroma = $xroma;
			$trexousa_dinami = $dinami;
		}

		$this->bazes[$pektis]++;

		return $this;
	}

	// Η function "bazes_fetch_paso" κάνει καταμέτρηση μπαζών στην περίπτωση που
	// παίζεται το πάσο και δεν έχει γίνει αγορά. Εδώ ακολουθούμε διαφορετική
	// τακτική και καταμετρούμε τις μπάζες με βάση την κάσα που έχουν ανεβάσει
	// οι παίκτες. Υπενθυμίζουμε ότι έχουμε αφαιρέσει από όλους την ελάχιστη
	// κάσα από τις τρεις και τώρα θα πληρώσουμε γι' αυτό, καθώς θα πρέπει να
	// επανυπολογίσουμε τις αρχικές κάσες.

	private function bazes_fetch_paso() {
		// Οι κάσες που έχουν υπολογιστεί είναι αρνητικές, καθώς οι παίκτες
		// ανεβάζουν κάσα ανάλογα με τις μπάζες τους. Κανονικά θα έπρεπε το
		// σύνολο των κασών να κάνει -100, αλλά με την απαλοιφή της κοινής
		// κάσας έχουμε έλλειμμα.
	
		for ($kasa = 100, $thesi = 1; $thesi <= 3; $thesi++)
		$kasa += $this->kasa_get($thesi);

		// Μοιράζουμε το έλλειμμα σε όλους τους παίκτες και υπολογίζουμε τις
		// μπάζες κάθε παίκτη από την κάσα που έχει ανεβάσει.

		for ($kasa /= 3, $thesi = 1; $thesi <= 3; $thesi++)
		$this->bazes[$thesi] = round(($kasa - $this->kasa_get($thesi)) / 10);

		return $this;
	}

	public function bazes_get($pektis) {
		if (!isset($this->bazes))
		$this->bazes_fetch();

		return $this->bazes[$pektis];
	}
}
?>
