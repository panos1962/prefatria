@load "spawk"

BEGIN {
	OFS = "\t"

	errs = 0
	errs += process_tlist()
	errs += process_apo_eos()

	if (errs)
	exit(2)

	ok = 0
	ok += dump_tlist()
	ok += dump_apo_eos()

	if (ok)
	exit(0)
}

{
	dump_trapezi($0, 1)
}

function process_tlist(			errs, n, a, i) {
	errs = 0

	if (tlist == "")
	return errs

	n = split(tlist, a, ",")

	if (n < 2)
	return 1

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

	if (apo && oxi_kodikos(apo))
	errs++

	if (eos && oxi_kodikos(eos))
	errs++

	return errs
}

function dump_tlist(			n, a, i) {
	if (!tlist)
	return 0

	n = split(tlist, a, ",")

	for (i = 2; i <= n; i++)
	dump_trapezi(a[i])

	return 1
}

function dump_apo_eos(					) {
	if ((apo == "") && (eos == ""))
	return 0

	if (apo)
	apo += 0;

	else
	apo = trapezi_min()

	if (eos)
	eos += 0

	else
	eos = trapezi_max()

	for (;apo <= eos; apo++)
	dump_trapezi(apo)

	return 1
}

function dump_trapezi(x, check,			kodikos, query, trapezi) {
	if (oxi_kodikos(x)) {
		if (check)
		errmsg(x ": δεν βρέθηκε το τραπέζι")

		return
	}

	kodikos = x + 0

	query = "SELECT `kodikos`, `stisimo`,"

	for (i = 1; i <= 3; i++)
	query = query " `pektis" i "`, `apodoxi" i "`,"

	query = query " `poll`, `arxio` " \
		"FROM `trapezi` " \
		"WHERE `kodikos` = " kodikos

	if (spawk_submit(query) != 3)
	exit(2)

	if (!spawk_fetchone(trapezi, 0))
	return errmsg(kodikos ": δεν βρέθηκε το τραπέζι")

	print "@trapezi", kodikos
	print trapezi[0]

	trparam_dump(kodikos)
	dianomi_dump(kodikos)
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

function trapezi_min() {
	return trapezi_mm("MIN")
}

function trapezi_max() {
	return trapezi_mm("MAX")
}

function trapezi_mm(mm,			query, data) {
	query = "SELECT " mm "(`kodikos`) FROM trapezi"

	if (spawk_submit(query) != 3)
	exit(2)

	if (spawk_fetchone(data))
	return (data[1] + 0)

	fatal("δεν υπάρχουν τραπεζια")
}

function oxi_kodikos(x) {
	if (x ~ /^[ \t]*[0-9]{1,9}[ \t]*$/)
	return 0

	errmsg(x ": απαράδεκτος κωδικός τραπεζιού")
	return 1
}
