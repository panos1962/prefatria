<?php
require_once "../lib/standard.php";
Globals::header_data();
Globals::session_init();
Globals::pektis_must();
Globals::database();

$spektis = Globals::asfales_sql($_SESSION["pektis"]);

if (Globals::perastike("paraskinio")) {
	$_SESSION["paraskinio"] = $_REQUEST["paraskinio"];
	$query = "REPLACE `peparam` (`pektis`, `param`, `timi`) VALUES (" . $spektis .
		", 'ΠΑΡΑΣΚΗΝΙΟ', " . Globals::asfales_sql($_REQUEST["paraskinio"]) . ")";
}

else {
	unset($_SESSION["paraskinio"]);
	$query = "DELETE FROM `peparam` WHERE pektis` = " . $spektis .  " AND `param` = 'ΠΑΡΑΣΚΗΝΙΟ'";
}

Globals::query($query);
Globals::klise_fige();
?>
