<?php
require_once("../lib/standard.php");
Globals::header_data();
Globals::session_init();
Globals::pektis_must();
Globals::database();

$sparaliptis = Globals::asfales_sql($_SESSION["pektis"]);

$query = "DELETE FROM `minima` WHERE (`paraliptis` = " . $sparaliptis . ") " .
	"AND (`apostoleas` IN (SELECT `sxetizomenos` FROM `sxesi` " .
	"WHERE (`pektis` = " . $sparaliptis . ") AND (`sxesi` = 'ΑΠΟΚΛΕΙΣΜΕΝΟΣ')))";
Globals::query($query);

$query = "SELECT COUNT(*) FROM `minima` " .
	"WHERE (`paraliptis` = " . $sparaliptis . ") " .
	"AND (`status` = 'ΑΔΙΑΒΑΣΤΟ')";

$row = Globals::first_row($query, MYSQLI_NUM);
if ($row && ($row[0] > 0)) print $row[0];
?>
