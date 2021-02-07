<?php
require_once("../lib/standard.php");
require_once("olplib.php");
session_start();
Globals::database();


$query = "SELECT `login` FROM `pektis` WHERE `login` LIKE " .
	Globals::asfales_sql($_REQUEST["login"]) .
	" AND `kodikos` LIKE BINARY " .
	Globals::asfales_sql(sha1($_REQUEST["kodikos"]));
$row = Globals::first_row($query, MYSQLI_NUM);

if (!$row) {
	unset($_SESSION["pektis"]);
	Globals::klise_fige();
}

$_SESSION["pektis"] = $row[0];
Olp::sxesi_data($_REQUEST["login"]);
?>
