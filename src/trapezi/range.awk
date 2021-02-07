BEGIN {
	errs = 0

	query = "SELECT `kodikos`, `pektis1`, `pektis2`, `pektis3` " \
		"FROM `trapezi` WHERE (`arxio` IS NOT NULL)"

	if (!ola) {
		errs += etos_check(etos)
		errs += minas_check(apo)
		errs += minas_check(eos)

		if (errs)
		exit(1)

		if (apo > eos)
		fatal(sprintf("%02d-%02d: λανθασμένο διάστημα μηνών", apo, eos))

		query = query sprintf(" AND (`stisimo` >= '%4d-%02d-01 00:00:00')", etos, apo)

		if (++eos > 12) {
			etos++
			eos = 1
		}

		query = query sprintf(" AND (`stisimo` < '%4d-%02d-01 00:00:00')", etos, eos)
	}

	print query " ORDER BY `kodikos` " fora

	exit(0)
}

function etos_check(etos) {
	if (etos != (etos + 0))
	return errmsg(etos ": λανθασμένο έτος")

	if ((etos < 2011) || (etos > 2099))
	return errmsg(etos ": έτος εκτός ορίων")

	return 0
}

function minas_check(minas) {
	if (minas != (minas + 0))
	return errmsg(minas ": λανθασμένος μήνας")

	if ((minas < 1) || (minas > 12))
	return errmsg(minas ": μήνας εκτός ορίων")

	return 0
}

function errmsg(msg) {
	print progname ": " msg >"/dev/stderr"
	return 1
}

function fatal(msg) {
	print progname ": " msg >"/dev/stderr"
	exit(1)
}
