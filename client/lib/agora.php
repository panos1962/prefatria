<?php
class Agora {
	public function data_reset() {
		unset($this->data);
		unset($this->pektis);
		unset($this->xroma);
		unset($this->bazes);
		unset($this->asoi);
		unset($this->solo);

		return $this;
	}

	public function energia_set($energia) {
		$this->data_reset();

		switch ($pektis = intval($energia->pektis)) {
		case 1:
		case 2:
		case 3:
			break;
		default:
			return;
		}

		switch ($xroma = substr($energia->data, 1, 1)) {
		case "S":
		case "C":
		case "D":
		case "H":
		case "N":
			break;
		default:
			return;
		}

		switch ($bazes = substr($energia->data, 2, 1)) {
		case "6":
		case "7":
		case "8":
		case "9":
			break;
		case "T":
			$bazes = "10";
			break;
		default:
			return;
		}

		$solo = FALSE;
		$asoi = FALSE;
		$skarta = "";

		switch (substr($energia->data, 0, 1)) {
		case "D":
			$skarta = substr($energia->data, 3, 4);
			break;
		case "A":
			$asoi = TRUE;
			$skarta = substr($energia->data, 3, 4);
			break;
		case "S":
			$solo = TRUE;
			break;
		default:
			return;
		}

		$this->data = substr($energia->data, 0, 3);
		$this->pektis = $pektis;
		$this->xroma = $xroma;
		$this->bazes = intval($bazes);
		$this->asoi = $asoi;
		$this->solo = $solo;
		$this->skarta = $skarta;

		return $this;
	}

	public function pektis_get() {
		return $this->pektis;
	}

	public function xroma_get() {
		return $this->xroma;
	}

	public function is_agora() {
		return isset($this->pektis);
	}

	public function is_asoi() {
		return($this->asoi === TRUE);
	}

	public function is_solo() {
		return($this->asoi === TRUE);
	}
}
?>
