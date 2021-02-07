<?php
register_shutdown_function('Egrafi::klisimo');
require_once "../lib/standard.php";
Egrafi::init();
Egrafi::check_data();

Globals::database();
$query = "INSERT INTO `pektis` (`login`, `onoma`, `email`, `kodikos`) VALUES (" .
	Globals::asfales_sql($_POST["login"]) . ", " .
	Globals::asfales_sql($_POST["onoma"]) . ", " .
	Globals::asfales_sql($_POST["email"]) . ", " .
	Globals::asfales_sql(sha1($_POST["kodikos1"])) . ")";
@Globals::$db->query($query);
if (Globals::affected_rows() != 1) Globals::klise_fige("Απέτυχε η δημιουργία λογαριασμού");
$_SESSION["pektis"] = $_POST["login"];
unset($_SESSION["klidi"]);

class Egrafi {
	public static function init() {
		Globals::header_html();
		Globals::session_init();
		if (Globals::is_pektis())
		Globals::klise_fige("Απόπειρα επανεγγραφής");
	}

	public static function check_data() {
		Globals::perastike_must("login");
		Globals::perastike_must("onoma");
		Globals::perastike_must("email");
		Globals::perastike_must("kodikos1");
		if (Globals::den_perastike("prive"))
		return;

		if (trim(file_get_contents("../../misc/.mistiko/prive")) !== sha1($_POST["prive"]))
		Globals::klise_fige("Δεν έχετε εξουσιοδότηση εγγραφής");
	}

	public static function klisimo() {
		?>@EOD@<script type="text/javascript">parent.Account.checkAction();</script><?php
	}
}
?>
