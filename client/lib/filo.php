<?php
Class Filo {
	private static $xroma_kostos = array(
		"S" => 2,
		"C" => 3,
		"D" => 4,
		"H" => 5
	);

	private static $axia_array = array(
		"7",
		"8",
		"9",
		"T",
		"J",
		"Q",
		"K",
		"A"
	);

	private static $axia_list = array();

	private static $init_ok = FALSE;

	public static function init() {
		if (self::$init_ok)
		Globals::klise_fige("Filo::init: already called");

		self::$init_ok = TRUE;

		for ($n = count(self::$axia_array), $i = 0; $i < $n; $i++)
		self::$axia_list[self::$axia_array[$i]] = $i;
	}

	public function __construct($data = NULL) {
		if ($data === NULL)
		return;

		if (!is_string($data))
		return;

		if (!array_key_exists($sxroma = substr($data, 0, 1), self::$xroma_kostos))
		return;

		if (!array_key_exists($saxia = substr($data, 1, 1), self::$axia_list))
		return;

		$this->xroma = $sxroma;
		$this->axia = $saxia;
		$this->data = $sxroma . $saxia;
	}

	public function is_filo() {
		if (!isset($this->xroma))
		return FALSE;

		if (!isset($this->axia))
		return FALSE;

		if (!array_key_exists($this->xroma, self::$xroma_kostos))
		return FALSE;

		if (!array_key_exists($this->axia, self::$axia_list))
		return FALSE;

		return TRUE;
	}

	public function oxi_filo() {
		return !$this->is_filo();
	}

	public function is_xroma($xroma = NULL) {
		if ($xroma === NULL)
		return $this->xroma;

		return($this->xroma === $xroma);
	}

	public function xroma_get() {
		return $this->xroma;
	}

	public function axia_get() {
		return $this->axia;
	}

	public function data_get() {
		return $this->data;
	}

	public function dinami_get() {
		return self::$axia_list[$this->axia];
	}
}

Filo::init();
?>
