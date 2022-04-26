@load "spawk"

BEGIN {
	OFS = "\t"

	errs = 0

	errs += process_tlist()
	errs += process_apo_eos()

	if (errs)
	exit(2)

	ok = 0

	if (tlist)
	ok = dump_tlist()

	if (apo || eos)
	ok = dump_apo_eos()

	if (ok)
	exit(0)
}

{
	dump_trapezi($0)
}

function process_tlist(			n, a, i, errs) {
	errs = 0

	if (tlist == "")
	return errs

	n = split(tlist, a, ",")

	if (n < 2)
	return errs

	errs = 0

	for (i = 2; i <= n; i++) {
		if (oxi_kodikos(a[i]))
		errs++
	}

	return errs
}

function process_apo_eos(			errs) {
	errs = 0

	if ((apo == "") && (eos == ""))
	return errs

	if (oxi_kodikos(apo))
	errs++

	if (oxi_kodikos(eos))
	errs++

	return errs
}

function dump_tlist(			n, a, i) {
	n = split(tlist, a, ",")

	for (i = 2; i <= n; i++)
	dump_trapezi(a[i])

	return 1
}

function dump_apo_eos(					) {
	for (;apo <= eos; apo++)
	dump_trapezi(apo)

	return 1
}

function dump_trapezi(x,		kodikos, query, trapezi) {
	if (oxi_kodikos(x))
	return
		
	kodikos = x + 0

	query = "SELECT `kodikos`, `stisimo`,"

	for (i = 1; i <= 3; i++)
	query = query " `pektis" i "`, `apodoxi" i "`,"

	query = query " `poll`, `arxio` " \
		"FROM `trapezi` " \
		"WHERE `kodikos` = " kodikos

	if (spawk_submit(query) != 3)
	return

	if (!spawk_fetchone(trapezi, 0))
	return errmsg(kodikos ": δεν βρέθηκε το τραπέζι")

	print "@trapezi", kodikos
	print trapezi[0]
}

function oxi_kodikos(x) {
	if (x ~ /^[ \t]*[0-9]{1,9}[ \t]*$/)
	return 0

	errmsg(x ": απαράδεκτος κωδικός τραπεζιού")
	return 1
}

function errmsg(msg) {
	print progname ": " msg >"/dev/stderr"
}
