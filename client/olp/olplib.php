<?php
Class Olp {
	public static function sxesi_data($login) {
		$query = "SELECT `sxetizomenos`, `sxesi` FROM `sxesi` " .
			"WHERE `pektis` LIKE " . Globals::asfales_sql($login);
		$res = Globals::query($query);

		print "olp.sxesi = {";
		while ($row = $res->fetch_array(MYSQLI_NUM))
		print Globals::asfales_json($row[0]) . ":" . ($row[1] === "ΦΙΛΟΣ" ? 1 : 0) . ",";

		$res->free();
		print "};";
	}
}
?>
