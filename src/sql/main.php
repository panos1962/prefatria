<?php
define("PROGNAME", "prefadoros::sql");

define("PREFADOROS", getenv("PREFADOROS"));

if (!PREFADOROS)
fatal("PREFADOROS: environment variable not set");

if ($argc != 1)
usage();

define("COMMAND_MODE", TRUE);
require_once PREFADOROS . "/client/lib/standard.php";

define("OFS", "\t");

Globals::database();

while (read_query($query) !== FALSE)
exec_query($query);

function read_query(&$query) {
	if (feof(STDIN))
	return FALSE;

	for ($query = ""; $x = fgets(STDIN); $query .= $x) {
		if ($x === ";\n")
		break;
	}

	return $query;
}

function exec_query($query) {
	if ($query === "")
	return;

	$result = Globals::$db->query($query);

	if (!$result)
	return Globals::errmsg("SQL ERROR: " . $query . ": " . Globals::sql_error() . "\n");

	if ($result === TRUE)
	return;

	while ($row = $result->fetch_array(MYSQLI_NUM)) {
		print $row[0];

		for ($n = count($row), $i = 1; $i < $n; $i++)
		print OFS . $row[$i];

		print "\n";
	}

	$result->free();
}

Globals::klise_fige(0);

function usage() {
	fwrite(STDERR, "usage: " . PROGNAME . "\n" .
		"       " . PROGNAME . " sql_query\n");
	exit(1);
}
?>
