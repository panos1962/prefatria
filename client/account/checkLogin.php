<?php
require_once "../lib/standard.php";
Globals::database();
$query = "SELECT `login` FROM `pektis` WHERE `login` = " . Globals::asfales_sql($_REQUEST["login"]);
$res = @Globals::$db->query($query);
if ($res->num_rows) print "X";
?>
