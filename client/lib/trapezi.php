<?php
class Trapezi {
	// Αν δοθεί παράμετρος στον constructor, τότε αυτή μπορεί να είναι κωδικός
	// τραπεζιού, ή row τραπεζιού από την database.

	public function __construct($trapezi = NULL) {
		// Αν δεν έχει δοθεί πραράμετρος τότε επιστρέφεται τελείως κενό
		// αντικείμενο τραπεζιού.

		if (!isset($trapezi))
		return;

		// Αν έχει δοθεί αριθμητική παράμετρος, τότε αυτός ο αριθμός θεωρείται
		// κωδικός τραπεζιού και επιχειρούμε να προσπελασουμε το τραπέζι στην
		// database.

		if (is_numeric($trapezi)) {
			$query = "SELECT * FROM `trapezi` WHERE `kodikos` = " . $trapezi;
			$res = Globals::query($query);

			$trapezi = $res->fetch_array(MYSQLI_ASSOC);
			$res->free();

			if (!$trapezi)
			return;
		}

		// Έχει δοθεί (ή έχει ανακληθεί) row τραπεζιού από την database. Πρόκειται
		// για associative array δεικτοδοτημένο με τα ονόματα των [πεδίων του
		// τραπεζιού.

		$this->kodikos = intval($trapezi["kodikos"]);
		$this->stisimo = $trapezi["stisimo"];
		$this->poll = $trapezi["poll"];
		$this->arxio = $trapezi["arxio"];

		$this->pektis = array();

		for ($thesi = 1; $thesi <= 3; $thesi++)
		$this->pektis[$thesi] = $trapezi["pektis" . $thesi];
	}

	public function is_trapezi() {
		return isset($this->kodikos);
	}

	public function pektis_get($thesi) {
		return $this->pektis[$thesi];
	}

	public function trparam_fetch() {
		$this->trparam = array();

		$query = "SELECT `param`, `timi` FROM `trparam` WHERE `trapezi` = " . $this->kodikos;
		$res = Globals::query($query);

		while ($row = $res->fetch_array(MYSQLI_NUM))
		$this->trparam[$row[0]] = $row[1];

		$res->free();
		return $this;
	}

	private static $trparam_default = array(
		"ΚΑΣΑ" => 50,
		"ΑΣΟΙ" => "ΝΑΙ",
		"ΠΑΣΟ" => "ΟΧΙ",
		"ΤΕΛΕΙΩΜΑ" => "ΚΑΝΟΝΙΚΟ",
		"ΠΡΙΒΕ" => "ΟΧΙ",
		"ΑΝΟΙΚΤΟ" => "ΝΑΙ",
		"ΦΙΛΙΚΗ" => "ΟΧΙ",
		"ΕΠΕΤΕΙΑΚΗ" => "",
		"ΙΔΙΟΚΤΗΤΟ" => "ΟΧΙ",
		"ΑΟΡΑΤΟ" => "ΟΧΙ",
		"ΤΟΥΡΝΟΥΑ" => "ΟΧΙ"
	);

	public function trparam_get($param) {
		if (!isset($this->trparam))
		$this->trparam_fetch();

		if (array_key_exists($param, $this->trparam))
		return $this->trparam[$param];

		if (array_key_exists($param, self::$trparam_default))
		return self::$trparam_default[$param];

		return NULL;
	}

	public function is_asoi() {
		return ($this->trparam_get("ΑΣΟΙ") === "ΝΑΙ");
	}

	public function oxi_asoi() {
		return !$this->is_asoi();
	}

	public function is_paso() {
		return ($this->trparam_get("ΠΑΣΟ") === "ΝΑΙ");
	}

	public function oxi_paso() {
		return !$this->is_paso();
	}

	public function telioma_get() {
		return $this->trparam_get("ΤΕΛΕΙΩΜΑ");
	}

	public function is_filiki() {
		return ($this->trparam_get("ΦΙΛΙΚΗ") === "ΝΑΙ");
	}

	public function thesi_walk($callback, $method = FALSE) {
		for ($thesi = 1; $thesi <= 3; $thesi++) {
			if ($method)
			$ret = $this->$callback($thesi);

			else
			$ret = $callback($this, $thesi);

			if (!$ret)
			break;
		}

		return $this;
	}

	public function dianomi_fetch() {
		$this->dianomi = array();

		$query = "SELECT * FROM `dianomi` WHERE `trapezi` = " . $this->kodikos . " ORDER BY `kodikos`";
		$res = Globals::query($query);

		while ($row = $res->fetch_array(MYSQLI_ASSOC))
		$this->dianomi[] = new Dianomi($row);

		$res->free();
		return $this;
	}

	public function dianomi_walk($callback, $method = FALSE) {
		if (!isset($this->dianomi))
		$this->dianomi_fetch();

		for ($n = count($this->dianomi), $i = 0; $i < $n; $i++) {
			if ($method)
			$ret = $this->$callback($this->dianomi[$i], $i);

			else
			$ret = $callback($this, $this->dianomi[$i], $i);

			if (!$ret)
			break;
		}

		return $this;
	}
}
?>
