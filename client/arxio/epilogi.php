<?php
require_once "../lib/standard.php";

if (file_exists("rcArxio.php"))
require_once "rcArxio.php";

Globals::session_init();
Globals::database();

Epilogi::queryInit();
if (Epilogi::queryPartida()) {
	Epilogi::queryPektis();
	Epilogi::queryApo();
	Epilogi::queryEos();
}
Epilogi::queryClose();

$result = Epilogi::queryRun();
if (!$result)
Globals::fatal("Λανθασμένα κριτήρια");

Globals::header_data();
$sep = "";
while ($row = $result->fetch_assoc()) {
	Epilogi::checkPektis($row);
	Epilogi::trparam($row);
	Epilogi::dianomi($row);

	print $sep;

	if (defined(JSON_UNESCAPED_UNICODE))
	print json_encode($row, JSON_UNESCAPED_UNICODE);

	else
	print json_encode($row);

	$sep = ",";
}
$result->free();

Globals::klise_fige(0);

class Epilogi {
	public static $akirosi;
	public static $query;

	public static function queryInit() {
		self::$akirosi = (Globals::perastike("akirosi") && ($_REQUEST["akirosi"] == 1));
		self::$query = "SELECT `kodikos` AS `k`, UNIX_TIMESTAMP(`stisimo`) AS `s`, " .
			"`pektis1` AS `p1`, `pektis2` AS `p2`, `pektis3` AS `p3`, " .
			"UNIX_TIMESTAMP(`arxio`) AS `a` FROM `trapezi` WHERE (1 = 1)";
	}

	public static function queryPektis() {
		if (Globals::den_perastike("pektis"))
		return;

		$pektis = trim($_REQUEST["pektis"]);
		if (!$pektis) return;

		if (preg_match("/\\+/", $pektis)) {
			$pektis = explode("+", $pektis);
			for ($i = count($pektis) - 1; $i >= 0; $i--) {
				$pat = trim($pektis[$i]);
				if (!$pat) continue;

				$pat = Globals::asfales_sql($pat);
				self::$query .= " AND ((`pektis1` LIKE " . $pat . ") " .
				" OR (`pektis2` LIKE " . $pat . ") OR (`pektis3` LIKE " . $pat . "))";
			}
		}
		else {
			$open = " AND (";
			$close = "";
			$pektis = explode(",", $pektis);
			for ($i = count($pektis) - 1; $i >= 0; $i--) {
				$pat = trim($pektis[$i]);
				if (!$pat) continue;

				$pat = Globals::asfales_sql($pat);
				self::$query .= $open . "(`pektis1` LIKE " . $pat . ") " .
				" OR (`pektis2` LIKE " . $pat . ") OR (`pektis3` LIKE " . $pat . ")";
				$open = " OR ";
				$close = ")";
			}
			self::$query .= $close;
		}
	}

	public static function queryApo() {
		if (Globals::den_perastike("apo"))
		return;

		$apo = (int)$_REQUEST["apo"];
		if ($apo <= 0)
		return;

		self::$query .= " AND (`stisimo` >= FROM_UNIXTIME(" . $apo . "))";
	}

	public static function queryEos() {
		if (Globals::den_perastike("eos"))
		return;

		$eos = (int)$_REQUEST["eos"];
		if ($eos <= 0)
		return;

		$eos = $eos + (24 * 3600);
		self::$query .= " AND (`stisimo` < FROM_UNIXTIME(" . $eos . "))";
	}

	public static function queryPartida() {
		if (Globals::den_perastike("partida"))
		return TRUE;

		$partida = trim($_REQUEST["partida"]);

		if (preg_match("/^[0-9]+$/", $partida)) {
			self::queryInit();
			self::$query .= " AND (`kodikos` = " . $partida . ")";
			return FALSE;
		}

		if (preg_match("/^([0-9]+)-([0-9]+)$/", $partida)) {
			$partida = explode("-", $partida);
			self::$query .= " AND (`kodikos` BETWEEN " . $partida[0] . " AND " .
				$partida[1] . ")";
			return FALSE;
		}

		if (preg_match("/^<([0-9]+)$/", $partida)) {
			$partida = explode("<", $partida);
			self::$query .= " AND (`kodikos` < " . $partida[1] . ")";
			return FALSE;
		}

		if (preg_match("/^>([0-9]+)$/", $partida)) {
			$partida = explode(">", $partida);
			self::$query .= " AND (`kodikos` > " . $partida[1] . ")";
			return FALSE;
		}

		if (preg_match("/^-([0-9]+)$/", $partida)) {
			$partida = explode("-", $partida);
			self::$query .= " AND (`kodikos` <= " . $partida[1] . ")";
			return FALSE;
		}

		if (preg_match("/^([0-9]+)-$/", $partida)) {
			$partida = explode("-", $partida);
			self::$query .= " AND (`kodikos` >= " . $partida[0] . ")";
			return FALSE;
		}

		return TRUE;
	}

	public static function queryClose() {
		self::$query .= " ORDER BY `kodikos` DESC LIMIT ";
		self::$query .= (Globals::perastike("limit") ? $_REQUEST["limit"] : 20);

		if (Globals::perastike("skip"))
		self::$query .= " OFFSET " . $_REQUEST["skip"];
	}

	public static function queryRun() {
		return Globals::query(self::$query);
	}

	public static function checkPektis(&$trapezi) {
		for ($thesi = 1; $thesi <= 3; $thesi++) {
			if (!$trapezi["p" . $thesi])
			break;
		}

		if ($thesi > 3)
		return;

		$query = "SELECT `thesi`, `pektis` FROM `telefteos` WHERE `trapezi` = " . $trapezi["k"];
		$result = Globals::query($query);
		while ($telefteos = $result->fetch_assoc()) {
			if (!$telefteos["thesi"])
			continue;

			if (!$telefteos["pektis"])
			continue;

			$idx = "p" . $telefteos["thesi"];
			if (!array_key_exists($idx, $trapezi))
			continue;

			if ($trapezi[$idx])
			continue;

			$trapezi[$idx] = $telefteos["pektis"];
		}
		$result->free();
	}

	public static function trparam(&$trapezi) {
		$query = "SELECT `param`, `timi` FROM `trparam` WHERE `trapezi` = " . $trapezi["k"];
		$result = Globals::query($query);
		$trapezi["t"] = array();
		while ($trparam = $result->fetch_assoc()) {
			$trapezi["t"][$trparam["param"]] = $trparam["timi"];
		}
		$result->free();
	}

	public static function dianomi(&$trapezi) {
		$query = "SELECT `kodikos` AS `k`, `dealer` AS `d`, UNIX_TIMESTAMP(`enarxi`) AS `s`, " .
			"`kasa1` AS `k1`, `metrita1` AS `m1`, `kasa2` AS `k2`, `metrita2` AS `m2`, " .
			"`kasa3` AS `k3`, `metrita3` AS `m3` FROM `dianomi` " .
			"WHERE (`trapezi` = " .  $trapezi["k"] . ")";

		// Αν η παρτίδα δεν έχει αρχειοθετηθεί, τότε πρέπει να αφήσουμε
		// έξω την τρέχουσα διανομή καθώς ελλοχεύει ο κίνδυνος οι παίκτες
		// της παρτίδας να βλέπουν τα φύλλα των αντιπάλων.

		if (!$trapezi["a"])
		$query .= " AND (`telos` IS NOT NULL)";

		$result = Globals::query($query);
		$trapezi["d"] = array();
		while ($dianomi = $result->fetch_assoc()) {
			self::apotelesmata($dianomi);
			$trapezi["d"][] = $dianomi;
		}
		$result->free();
	}

	private static function apotelesmata(&$dianomi) {
		$dianomi["e"] = array();

		$query = "SELECT `kodikos` AS `k`, `pektis` AS `p`, " .
			"UNIX_TIMESTAMP(`pote`) AS `t`, `idos` AS `i`, `data` AS `d` " .
			"FROM `energia` WHERE `dianomi` = " . $dianomi["k"];
		$result = Globals::query($query);

		while ($energia = $result->fetch_assoc())
		$dianomi["e"][] = $energia;

		$result->free();

		if (!self::$akirosi)
		return;

		$query = "SELECT `kodikos` AS `k`, `pektis` AS `p`, `akirotis` AS `a`, " .
			"UNIX_TIMESTAMP(`pote`) AS `t`, `idos` AS `i`, `data` AS `d` " .
			"FROM `akirosi` WHERE `dianomi` = " . $dianomi["k"];
		$result = Globals::query($query);

		while ($akirosi = $result->fetch_assoc())
		$dianomi["e"][] = $akirosi;

		$result->free();
	}
}
?>
