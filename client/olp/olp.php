<?php
require_once "../lib/standard.php";
require_once "olplib.php";
Globals::database();

$query = "SELECT `pektis` FROM `sinedria` ORDER BY `pektis`";
$res = Globals::query($query);

print "var plist = [";
while ($row = $res->fetch_array(MYSQLI_NUM)) {
	print "'" . $row[0] . "',";
}

$res->free();
print "];";

if (Globals::oxi_pektis())
Globals::klise_fige();

if (Globals::perastike("sxesi"))
Olp::sxesi_data($_SESSION["pektis"]);
?>
