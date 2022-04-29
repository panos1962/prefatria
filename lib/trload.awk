BEGIN {
	FS = "\t"

	load_func["trapezi"] = "trapezi_load"
	load_func["trparam"] = "trparam_load"
	load_func["dianomi"] = "dianomi_load"
	load_func["energia"] = "energia_load"

	trapezi = 0
}

$1 ~ /^@/ {
	sub(/^@/, "", $1)

	if ($1 in load_func) {
		load_data = load_func[$1]
		next
	}

	if (trapezi)
	load_abort()

	errmsg($1 ": invalid section header")
	next
}

{
	@load_data()
}

function trapezi_load(				query, i) {
	load_close()

	trapezi = $1
	begin_work()

	query = "DELETE FROM `trapezi` WHERE `kodikos` = " $1

	if (spawk_submit(query) != 2) {
		rollback_work()
		return 1
	}

	query = "INSERT INTO `trapezi` (`kodikos`, `stisimo`," \

	for (i = 1; i <= 3; i++)
	query = query " `pektis" i "`, `apodoxi" i "`,"

	query = query " `arxio`) VALUES (" \
		$1 ", " \
		spawk_escape($2) ", " \
		pektis($3) ", " \
		spawk_escape($4) ", " \
		pektis($5) ", " \
		spawk_escape($6) ", " \
		pektis($7) ", " \
		spawk_escape($8) ", " \
		spawk_escape($9) ")"

	if (spawk_submit(query) != 2) {
		rollback_work()
		return 1
	}

	if (spawk_affected != 1) {
		errmsg($0 ": insert failed")
		rollback_work()
		return 1
	}
}

function trparam_load(				query) {
	if (!trapezi)
	return

	query = "INSERT INTO `trparam` (`trapezi`, `param`, `timi`) VALUES ("

	query = query trapezi "," \
		spawk_escape($1) ", " \
		spawk_escape($2) ")"

	if (spawk_submit(query) != 2) {
		load_abort()
		return
	}

	if (spawk_affected != 1) {
		load_abort()
		return
	}
}

function dianomi_load(				query) {
}

function energia_load(				query) {
}

function trparam_dump(trapezi,			query, trparam) {
	query = "SELECT `param`, `timi` FROM `trparam` " \
		"WHERE `trapezi` = " trapezi " ORDER BY `param`"

	if (spawk_submit(query) != 3)
	exit(2)

	if (!spawk_fetchrow(trparam, 0))
	return

	print "@trparam"
	print trparam[0]

	while (spawk_fetchrow(trparam, 0))
	print trparam[0]
}

function dianomi_dump(trapezi,			query, dianomi) {
	query = "SELECT `kodikos`, `enarxi`, `dealer`, "

	for (i = 1; i <= 3; i++)
	query = query "`kasa" i "`, `metrita" i "`, "

	query = query "`telos` FROM `dianomi` " \
		"WHERE `trapezi` = " trapezi " ORDER BY `kodikos`"

	if (spawk_submit(query) != 3)
	exit(2)

	while (spawk_fetchrow(dianomi, 0)) {
		print "@dianomi", dianomi[1]
		print dianomi[0]
		energia_dump(dianomi[1])
	}
}

function energia_dump(dianomi,			query, energia) {
	query = "SELECT `kodikos`, `pektis`, `idos`, `data`, `pote` " \
		"FROM `energia` WHERE `dianomi` = " dianomi " " \
		"ORDER BY `kodikos`"

	if (spawk_submit(query) != 3)
	exit(2)

	if (!spawk_fetchrow(energia, 0))
	return

	print "@energia", dianomi
	print energia[0]

	while (spawk_fetchrow(energia, 0))
	print energia[0]
}

function pektis(s) {
if (s == "") {
	print ">>>>"
	exit(0)
}
	if (s == spawk_null)
	return "NULL"

	return spawk_escape(s)
}

function begin_work() {
	spawk_submit("START TRANSACTION")
}

function commit_work() {
	spawk_submit("COMMIT WORK")
}

function rollback_work() {
	spawk_submit("ROLLBACK WORK")
}

function commit() {
	spawk_submit("COMMIT WORK")
}

function oxi_kodikos(x) {
	if (x ~ /^[ \t]*[0-9]{1,9}[ \t]*$/)
	return 0

	errmsg(x ": απαράδεκτος κωδικός τραπεζιού")
	return 1
}

function load_close() {
	if (!trapezi)
	return

	commit_work()
	trapezi = 0
}

function load_abort() {
	if (!trapezi)
	return

	rollback_work()
	trapezi = 0
}
