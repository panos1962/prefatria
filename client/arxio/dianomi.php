<?php
require_once "../lib/standard.php";
Globals::header_data();
Globals::database();

$result = Epilogi::queryRun();
if (!$result)
Globals::fatal("Αποτυχία επιλογής διανομών");
while ($row = $result->fetch_assoc()) {
	Epilogi::dianomiPrint($row);
}
$result->free();

Globals::klise_fige();

class Epilogi {
	public static function queryRun() {
		$trapezi = Globals::perastike_must("trapezi");
		$query = "SELECT `kodikos` AS `k`, `enarxi` AS `e`, `dealer` AS `d`, " .
			"`kasa1` AS `k1`, `metrita1` AS `m1`, " .
			"`kasa2` AS `k2`, `metrita2` AS `m2`, " .
			"`kasa3` AS `k3`, `metrita3` AS `m3`, " .
			"`telos` AS `t` FROM `dianomi` " .
			"WHERE `trapezi` = " . $trapezi . " ORDER BY `kodikos`";
		return Globals::query($query);
	}

	public static function dianomiPrint($row) {
		if (defined(JSON_UNESCAPED_UNICODE))
		print json_encode($row, JSON_UNESCAPED_UNICODE) . ",";

		else
		print json_encode($row) . ",";
	}
}
?>
