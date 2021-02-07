<?php

require_once("../lib/selida.php");

Stats::pektis();
Stats::stisimo();

class Stats {
	private static $pektis_dir = "../site/stats/pektis/";

	public static function pektis() {
		print "Stats.pektis = {\n";
		self::pektis_idos("oxipaso");
		self::pektis_idos("paso");
		print "};\n";
	}

	private static function pektis_idos($idos) {
		$dir = "../site/stats/pektis/" . $idos . "/";
		$files = scandir($dir);

		print $idos . ": {\n";

		for ($i = count($files) - 1; $i >= 0; $i--)
		self::pektis_file($dir, $files[$i]);

		print "},\n";
	}

	private static function pektis_file($dir, $file) {
		$etos = intval($file);

		if (!$etos)
		return;

		$handle = fopen($dir . $file, "r");

		if (!$handle)
		return;

		print $etos . ": [\n";

		while (($line = fgets($handle)) !== FALSE)
		print "'" . trim($line) . "',\n";

		fclose($handle);
		print "],\n";
	}

	public static function stisimo() {
		print "Stats.omisits = {\n";
		self::stisimo_idos("oxipaso");
		self::stisimo_idos("paso");
		print "};\n";
	}

	private static function stisimo_idos($idos) {
		$dir = "../site/stats/stisimo/" . $idos . "/";
		$files = scandir($dir);

		print $idos . ": [\n";

		for ($i = count($files) - 1; $i >= 0; $i--)
		self::stisimo_file($dir, $files[$i]);

		print "],\n";
	}

	private static function stisimo_file($dir, $file) {
		$etos = intval($file);

		if (!$etos)
		return;

		$handle = fopen($dir . $file, "r");

		if (!$handle)
		return;

		while (($line = fgets($handle)) !== FALSE)
		print "'" . trim($line) . "',\n";

		fclose($handle);
	}
}

?>
