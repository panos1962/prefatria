<?php
require_once "../lib/selida.php";

Selida::head("Πρεφαδόρος - Κιτάπι");
Selida::stylesheet("kitapi/kitapi");
Selida::javascript("common/prefadoros");
Selida::javascript("kitapi/kitapi");
kitapi::paraskinio();

Selida::body();
Selida::ofelimo_begin();
Kitapi::setup();
Selida::ofelimo_end();
Selida::telos();

class Kitapi {
	public static function setup() {
		?>
		<table id="kitapiPinakas">
		<tr>
		<td style="width: 50%;">
			<div id="kitapiPerioxi3" class="kitapiPerioxi"></div>
		</td>
		<td style="width: 50%;">
			<div id="kitapiPerioxi2" class="kitapiPerioxi"></div>
		</td>
		</tr>
		</table>
		<div id="kitapiPerioxi1" class="kitapiPerioxi"></div>
		<?php
	}

	public static function paraskinio() {
		$paleta = scandir("../ikona/kitapi");
		$n = count($paleta);
		?>
		<script type="text/javascript">
		//<![CDATA[
		<?php
		for ($i = 0; $i < $n; $i++) {
			if (!preg_match("/\.(JPG|GIF|PNG)$/i", $paleta[$i])) continue;
			?>
			Kitapi.paraskinio.push('<?php print $paleta[$i]; ?>');
			<?php
		}
		?>
		//]]>
		</script>
		<?php
	}
}
?>
