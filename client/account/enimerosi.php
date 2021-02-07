<?php
define("MAX_PHOTO_FILE_SIZE", 100000);

register_shutdown_function('Enimerosi::klisimo');
require_once "../lib/standard.php";
require_once "../lib/pektis.php";
Enimerosi::init();
Enimerosi::check_data();

Globals::database();
Enimerosi::check_idio();

$query = "UPDATE `pektis` SET " .
	"`onoma` = " . Globals::asfales_sql($_POST["onoma"]) . ", " .
	"`email` = " . Globals::asfales_sql($_POST["email"]);
if (Globals::perastike("kodikos1") && $_POST["kodikos1"] != "")
	$query .= ", `kodikos` = " . Globals::asfales_sql(sha1($_POST["kodikos1"]));
$query .= " WHERE (`login` LIKE " . Globals::asfales_sql($_SESSION["pektis"]) .
	") AND (`kodikos` LIKE BINARY " . Globals::asfales_sql(sha1($_POST["kodikos"])) . ")";
@Globals::$db->query($query);
if (Globals::affected_rows() != 1) Globals::klise_fige("Απέτυχε η ενημέρωση λογαριασμού");

class Enimerosi {
	public static function init() {
		Globals::header_html();
		Globals::session_init();
		if (Globals::oxi_pektis())
		Globals::klise_fige("Απροσδιόριστος λογαριασμός");
	}

	public static function check_data() {
		Globals::perastike_must("onoma");
		Globals::perastike_must("email");
	}

	public static function check_idio() {
		$pektis = @new Pektis($_SESSION["pektis"], $_POST["kodikos"]);
		if (!isset($pektis->login)) Globals::klise_fige("Access denied");

		$alagi_photo = self::alagi_photo($pektis);
		if ($pektis->onoma !== $_POST["onoma"]) return;
		if ($pektis->email !== $_POST["email"]) return;
		if (Globals::perastike("kodikos1") && ($_POST["kodikos1"] !== "") &&
			($pektis->kodikos !== $_POST["kodikos1"])) return;
		Globals::klise_fige($alagi_photo ? 0 : "Δεν έγιναν αλλαγές");
	}

	private static function alagi_photo($pektis) {
		if (!isset($_FILES))
		return FALSE;

		if (!is_array($_FILES))
		return FALSE;

		if (!array_key_exists("photo", $_FILES))
		return FALSE;

		$photo = $_FILES["photo"];

		if (!is_array($photo))
		return FALSE;

		if (!array_key_exists("tmp_name", $photo))
		return FALSE;

		$photo_file = $photo["tmp_name"];
		if (!$photo_file)
		return FALSE;

		switch (exif_imagetype($photo_file)) {
		case IMAGETYPE_GIF:
		case IMAGETYPE_JPEG:
		case IMAGETYPE_PNG:
			break;
		default:
			Globals::klise_fige("Απαράδεκτο αρχείο εικόνας");
		}

		if ($photo["size"] > MAX_PHOTO_FILE_SIZE)
		Globals::klise_fige("Μεγάλο μέγεθος αρχείου εικόνας (" .
			$photo["size"] . " > " . MAX_PHOTO_FILE_SIZE . ")");

		$dest = $pektis->photo_file();
		move_uploaded_file ($photo_file, $dest);
		return TRUE;
	}

	public static function klisimo() {
		?>@EOD@<script type="text/javascript">parent.Account.checkAction();</script><?php
	}
}
?>
