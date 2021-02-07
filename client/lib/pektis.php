<?php
class Pektis {
	public $login;
	public $onoma;
	public $email;
	public $kodikos;
	public $peparam;

	public function __construct($login, $kodikos = NULL) {
		$peparam = array();
		$query = "SELECT * FROM `pektis` WHERE (`login` LIKE " . Globals::asfales_sql($login) . ")";

		if ($kodikos !== NULL)
		$query .= " AND (`kodikos` LIKE BINARY " . Globals::asfales_sql(sha1($kodikos)) . ")";

		$result = Globals::$db->query($query);
		$row = $result->fetch_array(MYSQLI_ASSOC);
		$result->free();
		if (!$row) return;

		foreach($row as $col => $val) {
			$this->$col = $val;
		}
	}

	public function peparam_fetch() {
		if (!isset($this->login))
		return $this;

		$this->peparam = array();
		$query = "SELECT `param`, `timi` FROM `peparam` WHERE `pektis` LIKE " .
			Globals::asfales_sql($_SESSION["pektis"]);
		$res = Globals::query($query);
		while ($row = $res->fetch_array(MYSQLI_NUM)) {
			$this->peparam[$row[0]] = $row[1];
		}

		$res->free();
		return $this;
	}

	public function is_developer() {
		if (!isset($this->peparam))
		return FALSE;

		$idx = "DEVELOPER";
		if (!array_key_exists($idx, $this->peparam))
		return FALSE;

		return($this->peparam[$idx] === "ΝΑΙ");
	}

	// Η μέθοδος "photo_file" επιστρέφει το πλήρες pathname του αρχείου εικόνας
	// που αφορά στον ανά χείρας παίκτη. Ως γνωστόν, το αρχείο βρίσκεται στο
	// directory photo, σε subdirectory σχετικό με το πρώτο γράμμα του login
	// name, και φέρει όνομα ίδιο με το login name του παίκτη.

	public function photo_file() {
		return Globals::$www . "client/photo/" . strtolower(substr($this->login, 0, 1)) . "/" . $this->login;
	}

	// Η μέθοδος "photo_src" επιστρέφει το URL του αρχείου εικόνας που αφορά
	// στον ανά χείρας παίκτη, εμπλουτισμένο με αντιcache παράμετρο που αφορά
	// στο modification time του αρχείου.

	public function photo_src() {
		$photo = "photo/" . strtolower(substr($this->login, 0, 1)) . "/" . $this->login;
		$photo_file = Globals::$www . "client/" . $photo;

		if (!file_exists($photo_file))
		return NULL;

		return Globals::$server . $photo . "?mt=" . filemtime($photo_file);
	}
}
?>
