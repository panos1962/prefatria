<?php
require_once "../lib/standard.php";
session_start();

$tag = Globals::perastike_must("tag");
if (Globals::perastike("val")) $_SESSION[$tag] = $_REQUEST["val"];
else unset($_SESSION[$tag]);
Globals::klise_fige();
?>
