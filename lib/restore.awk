@load "spawk"
@include "prefadoros"

BEGIN {
	FS = "\t"
	EOD = "\004"

	strtype["CHAR"]
	strtype["VARCHAR"]
	strtype["TEXT"]
	strtype["TINYTEXT"]
	strtype["MEDIUMTEXT"]
	strtype["LONGTEXT"]
	strtype["ENUM"]
	strtype["DATE"]
	strtype["DATETIME"]
	strtype["TIMESTAMP"]

	refresh["profinfo"]
	refresh["sxesi"]
	refresh["minima"]

	state = "table"
}

state == "table" {
	table = $1
	state = "column"

	delete cols
	ncol = 0

	if (table in refresh)
	delete_table(table)

	next
}

state == "column" {
	if ($0 == EOD) {
		state = "data"
		next
	}

	ncol++
	cols[ncol] = $1
	typs[ncol] = $2

	next
}

state == "data" {
	if ($0 == EOD) {
		state = "table"
		next
	}

	if (NF != ncol) {
		print NR ": syntax error" >"/dev/stderr"
		next
	}

	replace_data(table)
}

END {
	if (state == "table")
	exit(0)

	print "missing data" >"/dev/stderr"
	exit(2)
}

function delete_table(table) {
	if (spawk_submit("DELETE FROM `" table "`") != 2)
	exit(2)
}

function replace_data(table,			query, sep, i, q) {
	query = "INSERT INTO `" table "` ("
	sep = ""

	for (i = 1; i <= ncol; i++) {
		query = query sep "`" cols[i] "`"
		sep = ", "
	}

	query = query ") VALUES ("
	sep = ""

	for (i = 1; i <= ncol; i++) {
		quote = typs[i] in strtype ? "'" : ""
		query = query sep quote $i quote
		sep = ", "
	}

	query = query ") ON DUPLICATE KEY UPDATE"

print query
	if (spawk_submit(query) != 2)
	exit(2)
}
