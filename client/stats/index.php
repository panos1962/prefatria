<?php

require_once "../lib/standard.php";
Globals::diavase("lib/selida.php");
Globals::database();

Selida::head("Στατιστικά");
//Selida::stylesheet('lib/chartist');
//Selida::javascript('lib/chartist');
?>
<script src="//cdn.jsdelivr.net/chartist.js/latest/chartist.min.js"></script>
<link rel="stylesheet" href="//cdn.jsdelivr.net/chartist.js/latest/chartist.min.css" />
<?php
Selida::javascript('stats/stats');
Selida::stylesheet('stats/stats');

Selida::body();
Selida::toolbar("Στατιστικά");
Selida::fyi_pano();

Selida::ofelimo_begin();
Stats::scan_etos();
Stats::parse_url();
Selida::ofelimo_end();

Selida::fyi_kato();
Selida::ribbon();
Selida::telos();

Class Stats {
	public static function scan_etos() {
		// Το file "etos.list" στο ασφαλές directory "stats" περιέχει λίστα
		// των ετών που διαμορφώνουν τα στατιστικά των παικτών.

		$elist = @file("../../stats/etos.list");

		if ((!isset($elist)) || (!$elist) || (count($elist) <= 0))
		Globals::klise_fige();

		Selida::javascript_begin();

		for ($i = count($elist) - 1; $i >= 0; $i--) {
			?>Stats.elist.push(<?php print intval($elist[$i]); ?>);<?php
		}

		Selida::javascript_end();
	}

	public static function parse_url() {
		self::parse_url_etos();
		self::parse_url_paso();
		self::parse_url_idos();
		self::parse_url_dianomes();
		self::parse_url_pektis();
	}

	private static function parse_url_etos() {
		if (!array_key_exists("etos", $_REQUEST))
		return;

		$elist = preg_split("/[\s,]/", $_REQUEST["etos"]);
		$n = count($elist);

		$tsile = array();
		$sep = "";

		for ($i = 0; $i < $n; $i++) {
			if (!$elist[$i])
			continue;

			if (array_key_exists($elist[$i], $tsile))
			continue;

			$tsile[$elist[$i]] = TRUE;
			$elist_fixed .= $sep . $elist[$i];

			$sep = " ";
		}

		Selida::javascript_begin();
		?>Stats.urlEtos = '<?php print $elist_fixed; ?>';<?php
		Selida::javascript_end();
	}

	private static function parse_url_paso() {
		$paso = FALSE;
		$oxipaso = FALSE;

		$paso_not_set = TRUE;

		if (array_key_exists("paso", $_REQUEST)) {
			$paso = TRUE;
			$paso_not_set = FALSE;
		}

		if (array_key_exists("oxipaso", $_REQUEST)) {
			$oxipaso = TRUE;
			$paso_not_set = FALSE;
		}

		if ($paso_not_set) {
			$paso = TRUE;
			$oxipaso = TRUE;
		}

		Selida::javascript_begin();
		?>
		Stats.paso = <?php print $paso ? "true" : "false"; ?>;
		Stats.oxipaso = <?php print $oxipaso ? "true" : "false"; ?>;
		<?php
		Selida::javascript_end();
	}

	private static function parse_url_idos() {
		$idos = "katataxi";

		if (array_key_exists("katataxi", $_REQUEST))
		$idos = "katataxi";

		if (array_key_exists("stisimo", $_REQUEST))
		$idos = "stisimo";

		Selida::javascript_begin();
		?>Stats.idos = '<?php print $idos; ?>';<?php
		Selida::javascript_end();
	}

	private static function parse_url_dianomes() {
		if (!array_key_exists("dianomes", $_REQUEST))
		return;

		Selida::javascript_begin();
		?>Stats.dianomesMin = <?php print intval($_REQUEST["dianomes"]); ?>;<?php
		Selida::javascript_end();
	}

	private static function parse_url_pektis() {
		if (!array_key_exists("pektis", $_REQUEST))
		return;

		$plist = preg_split("/[\s,]/", $_REQUEST["pektis"]);
		$n = count($plist);

		$tsilp = array();
		$sep = "";

		for ($i = 0; $i < $n; $i++) {
			if (!$plist[$i])
			continue;

			if (array_key_exists($plist[$i], $tsilp))
			continue;

			$tsilp[$plist[$i]] = TRUE;
			$plist_fixed .= $sep . $plist[$i];

			$sep = " ";
		}

		Selida::javascript_begin();
		?>Stats.urlPektis = '<?php print $plist_fixed; ?>';<?php
		Selida::javascript_end();
	}
}

?>
