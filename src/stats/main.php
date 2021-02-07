<?php
// Το παρόν πρόγραμμα διαβάζει κωδικούς τραπεζιών από το standard input και εκτυπώνει
// όλα τα στοιχεία παρτίδας που είναι απαραίτητα για την παραγωγή στατιστικών στοιχείων.
// Το output δεν είναι ομοιογενές, με την έννοια ότι δεν ακολουθεί ενιαία γραμμογράφηση,
// ωστόσο κάθε γραμμή περιέχει διάφορα πεδία χωρισμένα με tabs, με το πρώτο πεδίο να
// είναι πάντα ο κωδικός τραπεζιού.
//
// Πιο συγκεκριμένα, για κάθε τραπέζι εκτυπώνονται:
//
// ΒΑΣΙΚΑ ΣΤΟΙΧΕΙΑ ΠΑΡΤΙΔΑΣ
// ------------------------
//
// Τραπέζι		Ο κωδικός του τραπεζιού.
//
// Στήσιμο		Είναι το datetime της χρονικής στιγμής που στήθηκε η παρτίδα.
//
// Παίκτης (1)		Το login name του πρώτου παίκτη
//
// Παίκτης (2)		Το login name του δεύτερου παίκτη
//
// Παίκτης (3)		Το login name του τρίτου παίκτη
//
// ΧΑΡΑΚΤΗΡΙΣΤΙΚΑ ΠΑΡΤΙΔΑΣ
// -----------------------
//
// Τραπέζι		Ο κωδικός του τραπεζιού
//
// Χαρακτηριστικό	Μπορεί να είναι "ΦΙΛΙΚΗ" που σημαίνει ότι πρόκειται για φιλική
//			παρτίδα, "ΑΣΟΙ" που σημαίνει ότι στην παρτίδα δεν παίζονται οι
//			άσοι και "ΠΑΣΟ" που σημαίνει ότι στην παρτίδα παίζεται το πάσο.
//
// ΔΙΑΝΟΜΕΣ
// --------
//
// Τραπέζι		Ο κωδικός τραπεζιού
//
// Διανομή		Ο κωδικός διανομής
//
// Dealer		Είναι η θέση του παίκτη που μοίρασε στη συγκεκριμένη διανομή.
//
// Φύλλα (1)		Τα φύλλα του πρώτου παίκτη ως ένα string 20 χαρακτήρων, όπου το
//			κάθε φύλλο παριστάνεται με τη μορφή "ΧΑ", όπου Χ είναι το χρώμα
//			(S μπαστούνια, C σπαθιά, D καρά, H κούπες), και Α είναι η αξία,
//			ήτοι 7, 8, 9, T, J, Q, K, A. Επί παραδείγματι SJ σημαίνει βαλές
//			μπαστούνι, HT σημαίνει 10 κούπα, CQ σημαίνει ντάμα σπαθί και D9
//			σημαίνει 9 καρό.
//
// Φύλλα (2)		Τα φύλλα του δεύτερου παίκτη.
//
// Φύλλα (3)		Τα φύλλα του τρίτου παίκτη.
//
// Τζόγος		Είναι τα φύλλα του τζόγου ως ένα string 4 χαρακτήρων.
//
// Τζογαδόρος		Είναι η θέση του τζογαδόρου σε περίπτωση που έγινε αγορά. Αν δεν
//			έχει γίνει αγορά παραμένει κενό.
//
// Αγορά		Ένα string 3 χαρακτήρων της μορφής "ΔΧΜ", όπου Δ είναι "D" που
//			σημαίνει δήλωση αγοράς, "A" που σημαίνει δήλωση αγοράς με άσους,
//			ή "S" που σημαίνει σόλο αξιοπρεπείας όπου ο τζογαδόρος αποφασίζει
//			να γράψει σόλο την αγορά χωρίς να παιχτεί. Το στοιχείο Χ είναι το
//			χρώμα της αγοράς (S μπαστούνια, C σπαθιά, D καρά, H κούπες, N άχροα).
//			Αν δεν έχει γίνει αγορά, το πεδίο παραμένει κενό.
//
// Σκάρτα		Είναι ένα string 4 χαρακτήρων με τα σκάρτα φύλλα της αγοράς. Αν
//			δεν έχει γίνει αγορά, το πεδίο παραμένει κενό.
//
// Συμμετοχή (1)	Είναι η δήλωση συμμετοχής του πρώτου παίκτη. Το πεδίο παίρνει
//			τιμές: "Π" που σημαίνει "ΠΑΙΖΩ", "Σ" που σημαίνει "ΠΑΣΟ" και
//			"Ζ" που σημαίνει "ΜΑΖΙ". Για λόγους απλότητας, στον τζογαδόρο
//			βάζουμε την τιμή "Α" που σημαίνει "ΑΓΟΡΑΣΤΗΣ" αν και δεν έχει
//			νόημα συμμετοχής. Αν δεν έχει γίνει αγορά το πεδίο παραμένει
//			κενό.
//
// Μπάζες (1)		Το πλήθος των μπαζών που έκανε ο πρώτος παίκτης στη συγκεκριμένη
//			διανομή.
//
// Καπίκια (1)		Τα καπίκια που κέρδισε ή έχασε ο πρώτος παίκτης στη συγκεκριμένη
//			διανομή.
//
// Συμμετοχή (2)	Είναι η δήλωση συμμετοχής του δεύτερου παίκτη.
//
// Μπάζες (2)		Το πλήθος των μπαζών που έκανε ο δεύτερος παίκτης.
//
// Καπίκια (2)		Τα καπίκια που κέρδισε ή έχασε ο δεύτερος παίκτης.
//
// Συμμετοχή (3)	Είναι η δήλωση συμμετοχής του τρίτου παίκτη.
//
// Μπάζες (3)		Το πλήθος των μπαζών που έκανε ο τρίτος παίκτης.
//
// Καπίκια (3)		Τα καπίκια που κέρδισε ή έχασε ο τρίτος παίκτης.

define("PROGNAME", "prefadoros::stats");
define("PREFADOROS", getenv("PREFADOROS"));
define("OFS", "\t");

if (!PREFADOROS)
fatal("PREFADOROS: environment variable not set");

define("COMMAND_MODE", TRUE);
require_once PREFADOROS . "/client/lib/standard.php";
require_once PREFADOROS . "/client/lib/trapezi.php";
require_once PREFADOROS . "/client/lib/dianomi.php";
require_once PREFADOROS . "/client/lib/energia.php";
require_once PREFADOROS . "/client/lib/agora.php";
require_once PREFADOROS . "/client/lib/filo.php";

Globals::database();

while ($trapezi = fgets(STDIN))
process_trapezi(intval($trapezi));

Globals::klise_fige(0);

function process_trapezi($kodikos) {
	$trapezi = new Trapezi($kodikos);

	if (!$trapezi->is_trapezi())
	return Globals::errmsg($kodikos . ": δεν βρέθηκε το τραπέζι\n");

	$trapezi->trparam_fetch();

	print $trapezi->kodikos;
	print OFS . $trapezi->stisimo;

	$trapezi->thesi_walk("pektis_print");
	print "\n";

	if ($trapezi->oxi_asoi())
	trparam_print($trapezi, "ΑΣΟΙ");

	if ($trapezi->is_paso())
	trparam_print($trapezi, "ΠΑΣΟ");

	if ($trapezi->is_filiki())
	trparam_print($trapezi, "ΦΙΛΙΚΗ");

	$trapezi->dianomi_walk("process_dianomi");
}

function pektis_print($trapezi, $thesi) {
	print "\t" . $trapezi->pektis_get($thesi);
	return TRUE;
}

function trparam_print($trapezi, $param) {
	print $trapezi->kodikos . OFS . $param . "\n";
}

function process_dianomi($trapezi, $dianomi) {
	print $trapezi->kodikos . OFS . $dianomi->kodikos . OFS . $dianomi->dealer;

	for ($thesi = 1; $thesi <= 3; $thesi++)
	print OFS . $dianomi->fila_get($thesi);

	print OFS . $dianomi->tzogos_get();

	$dianomi->
	agora_fetch()->
	simetoxi_fetch()->
	bazes_fetch();

	if ($dianomi->is_agora())
	print OFS . $dianomi->agora->pektis . OFS . $dianomi->agora->data . OFS . $dianomi->agora->skarta;

	else 
	print OFS . OFS . OFS;

	for ($thesi = 1; $thesi <= 3; $thesi++)
	print OFS . $dianomi->simetoxi_get($thesi) .\
		OFS . $dianomi->bazes_get($thesi) .\
		OFS . $dianomi->kapikia_get($thesi);

	print "\n";
	return TRUE;
}

function errmsg($msg = NULL) {
	fwrite(STDERR, PROGNAME . ": ");

	if ($msg === NULL)
	return TRUE;

	fwrite(STDERR, $msg);
	fwrite(STDERR, "\n");
	return TRUE;
}

function fatal($msg = "fatal error", $err = 2) {
	errmsg($msg);
	exit($err);
}

function usage() {
	fwrite(STDERR, "usage: " . PROGNAME . "\n");
	exit(1);
}
?>
