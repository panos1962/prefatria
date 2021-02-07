<?php
require_once "../lib/selida.php";

Selida::head();
Selida::stylesheet("paraskinio/paraskinio");
Selida::javascript("paraskinio/paraskinio");
Paraskinio::paleta();

Selida::body();
Selida::ofelimo_begin();
Selida::ofelimo_end();
Paraskinio::klisimo();
Selida::telos();

class Paraskinio {
	public static function paleta() {
		$paleta = scandir("../ikona/paraskinio");
		$n = count($paleta);
		?>
		<script type="text/javascript">
		//<![CDATA[
		<?php
		for ($i = 0; $i < $n; $i++) {
			if (!preg_match("/\.(JPG|GIF|PNG)$/i", $paleta[$i])) continue;
			?>
			Paraskinio.paleta.push('<?php print $paleta[$i]; ?>');
			<?php
		}
		?>
		//]]>
		</script>
		<?php
	}

	public static function klisimo() {
		?>
		<img id="paraskinio_klisimoIcon" title="Κλείσιμο παραθύρου" src="../ikona/misc/klisimo.png" />
		<?php
	}
}
?>
