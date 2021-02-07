<?php
class Energia {
	public function __construct($energia = NULL) {
		if (!isset($energia))
		return;

		if (is_numeric($energia)) {
			$query = "SELECT * FROM `energia` WHERE `kodikos` = " . $energia;
			$res = Globals::query($query);

			$energia = $res->fetch_array(MYSQLI_ASSOC);
			$res->free();

			if (!$energia)
			return;
		}

		if (!is_array($energia))
		return;

		$this->kodikos = intval($energia["kodikos"]);
		$this->dianomi = intval($energia["dianomi"]);
		$this->pektis = intval($energia["pektis"]);
		$this->idos = $energia["idos"];
		$this->data = $energia["data"];
		$this->pote = $energia["pote"];
	}

	public function kodikos_get() {
		return $this->kodikos;
	}

	public function pektis_get() {
		return $this->pektis;
	}

	public function data_get() {
		return $this->data;
	}

	public function is_dianomi() {
		return($this->idos === "ΔΙΑΝΟΜΗ");
	}

	public function is_dilosi() {
		return($this->idos === "ΔΗΛΩΣΗ");
	}

	public function is_agora() {
		switch ($this->idos) {
		case "ΑΓΟΡΑ":
		case "ΣΟΛΟ":
			return TRUE;
		}

		return FALSE;
	}

	public function is_simetoxi() {
		return($this->idos === "ΣΥΜΜΕΤΟΧΗ");
	}

	public function is_filo() {
		return($this->idos === "ΦΥΛΛΟ");
	}

	public function oxi_filo() {
		return !$this->is_filo();
	}

	public function is_claim() {
		return($this->idos === "CLAIM");
	}
}
?>
