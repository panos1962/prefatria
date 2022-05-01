# Το παρόν χρησιμοποιείται από το πρόγραμμα "trload" για την [επαν]εισαγωγή
# τραπεζιών από αρχεία δεδομένων που έχουν προκύψει από το πρόγραμμα "trdump".

BEGIN {
	FS = "\t"

	load_func["@trapezi"] = "trapezi_load"
	load_func["@trparam"] = "trparam_load"
	load_func["@dianomi"] = "dianomi_load"
	load_func["@energia"] = "energia_load"
	load_func["@akirosi"] = "akirosi_load"

	# Η global μεταβλητή "trapezi" περιέχει τον κωδικό τού προς εισαγωγή
	# τραπεζιού και τίθεται από τα data που αφορούν στον πίνακα "trapezi".
	# Αν η τιμή τής μεταβλητής είναι μηδενική, τότε σημαίνει ότι δεν έχει
	# καθοριστεί κωδικός τραπεζιού και σ' αυτήν την περίπτωση το input
	# απλώς απορρίπτεται.

	trapezi = 0

	# Η global μεταβλητή "dianomi" περιέχει τον κωδικό τής προς εισαγωγή
	# διανομής και τίθεται από τα data που αφορούν στον πίνακα "dianomi".
	# Αν η τιμή τής μεταβλητής είναι μηδενική, τότε σημαίνει ότι δεν έχει
	# καθοριστεί κωδικός διανομής και σ' αυτήν την περίπτωση το input
	# απλώς απορρίπτεται.

	dianomi = 0
}

$0 ~ /^@/ {
	process_header()
	next
}

END {
	load_commit()
}

function process_header(			tag, n, a) {
	split($0, a, "[ \t]")
	new_header(a[1])
}

# Το input αποτελείται από δεδομένα τραπεζιών, όπου κάθε τραπέζι αποτελείται
# από τα κεφάλαια που καθορίζονται από επικεφαλίδες της μορφής "@TAG", όπου
# "TAG" είναι "trapezi", "trparam", "dianomi" και "energia".

function new_header(tag) {
	if (tag in load_func)
	return (load_data = load_func[tag])

	load_abort()
	errmsg($1 ": invalid section header")
}

{
	@load_data()
}

function trapezi_load(				query, i) {
	load_commit()

	trapezi = $1
	dianomi = 0

	begin_work()

	query = "DELETE FROM `trapezi` WHERE `kodikos` = " trapezi

	if (spawk_submit(query) != 2)
	return load_abort()

	query = "INSERT INTO `trapezi` (`kodikos`, `stisimo`," \

	for (i = 1; i <= 3; i++)
	query = query " `pektis" i "`, `apodoxi" i "`,"

	query = query " `poll`, `arxio`) VALUES (" \
		trapezi ", " \
		spawk_escape($2) ", " \
		val2string($3) ", " \
		spawk_escape($4) ", " \
		val2string($5) ", " \
		spawk_escape($6) ", " \
		val2string($7) ", " \
		spawk_escape($8) ", " \
		spawk_escape($9) ", " \
		val2string($10) ")"

	if (spawk_submit(query) != 2)
	return load_abort()

	if (spawk_affected != 1)
	return load_abort()
}

function trparam_load(				query) {
	if (!trapezi)
	return

	query = "INSERT INTO `trparam` (`trapezi`, `param`, `timi`) VALUES ("

	query = query trapezi "," \
		spawk_escape($1) ", " \
		spawk_escape($2) ")"

	if (spawk_submit(query) != 2)
	return load_abort()

	if (spawk_affected != 1)
	return load_abort()
}

function dianomi_load(				query, i, telos) {
	if (!trapezi)
	return

	dianomi = $1

	if ($10 != spawk_null)
	telos = spawk_escape($10)

	else
	telos = "NULL"

	query = "INSERT INTO `dianomi` (`kodikos`, `trapezi`, " \
		"`enarxi`, `dealer`, "

	for (i = 1; i <= 3; i++)
	query = query "`kasa" i "`, `metrita" i "`, "

	query = query "`telos`) VALUES (" \

	query = query dianomi ", " \
		trapezi ", " \
		spawk_escape($2) ", " \
		$3 ", " \
		$4 ", " $5 ", " \
		$6 ", " $7 ", " \
		$8 ", " $9 ", " \
		telos ")"

	if (spawk_submit(query) != 2)
	return load_abort()

	if (spawk_affected != 1)
	return load_abort()
}

function energia_load(				query) {
	if (!dianomi)
	return load_abort()

	query = "INSERT INTO `energia` (`kodikos`, `dianomi`, " \
		"`pektis`, `idos`, `data`, `pote`) VALUES ("

	query = query $1 ", " \
		dianomi ", " \
		$2 ", " \
		spawk_escape($3) ", " \
		spawk_escape($4) ", " \
		spawk_escape($5) ")"

	if (spawk_submit(query) != 2)
	return load_abort()

	if (spawk_affected != 1)
	return load_abort()
}

function akirosi_load(				query) {
	if (!dianomi)
	return load_abort()

	query = "INSERT INTO `akirosi` (`kodikos`, `dianomi`, " \
		"`pektis`, `akirotis`, `idos`, `data`, `pote`) VALUES ("

	query = query $1 ", " \
		dianomi ", " \
		$2 ", " \
		$3 ", " \
		spawk_escape($4) ", " \
		spawk_escape($5) ", " \
		spawk_escape($6) ")"

	if (spawk_submit(query) != 2)
	return load_abort()

	if (spawk_affected != 1)
	return load_abort()
}

function val2string(s) {
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

function load_commit() {
	if (!trapezi)
	return

	commit_work()

	if (verbal) {
		print trapezi
		fflush()
	}

	trapezi = 0
	dianomi = 0
}

function load_abort() {
	if (!trapezi)
	return

	rollback_work()
	errmsg(trapezi ": ακυρώθηκε η διαδικασία ενημέρωσης τραπεζιού")
	trapezi = 0
}
