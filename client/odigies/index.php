<?php
require_once "../lib/standard.php";
Globals::diavase("lib/selida.php");

Selida::head("Οδηγίες");

Selida::stylesheet("odigies/odigies");
Selida::javascript("odigies/odigies");

Selida::body();
Selida::toolbar();

Selida::ofelimo_begin();
Odigies::anigma();
Odigies::periexomena();
Odigies::soma();
Odigies::klisimo();
Odigies::enimerotiko();
Selida::ofelimo_end();

Selida::ribbon();
Selida::telos();

Class Odigies {
	public static function anigma() {
		?><div class="odigiesArea"><?php
	}

	public static function periexomena() {
		require "periexomena.php";
	}

	public static function soma() {
		require "soma.php";
	}

	public static function enimerotiko() {
		require "enimerotiko.php";
	}
	
	public static function klisimo() {
		?></div><?php
	}

	public static function periexomenaItem($topic) {
		$idx = preg_replace("/[, !]/", "_", $topic);
		?>
		<a href="#<?php print $idx; ?>" class="odigiesPeriexomena"
			onmouseover="this.style.fontWeight='bold';"
			onmouseout="this.style.fontWeight='normal';">
			<?php print $topic; ?>
		</a>
		<?php
	}

	public static function titlos($topic) {
		$idx = preg_replace("/[, !]/", "_", $topic);
		?>
		<a name="<?php print $idx; ?>"></a>
		<a href="#" title="Κορυφή της σελίδας"><div class="odigiesTitlos"><?php
			print $topic; ?></div></a>
		<?php
	}

	public static function sindesmos($tag) {
		?><a href="#" style="cursor: default;" onclick="return false;"><?php
			print $tag; ?></a><?php
 	}
}
?>
