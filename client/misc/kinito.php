<?php

// XXX
// Το παρόν εκαλείτο κατά την ενεργοποίηση/απενεργοποίηση του αυτόματου
// πληκτρολογίου σε οθόνες αφής, αλλά τώρα πια έχει τεθεί σε αχρηστία.
// Το κρατώ μήπως και μου χρειαστεί ξανά στο μέλλον.

require_once "../lib/standard.php";
session_start();

if (Globals::perastike("energo"))
$_SESSION["kinito"] = 1;

else
unset($_SESSION["kinito"]);

Globals::klise_fige();
?>
