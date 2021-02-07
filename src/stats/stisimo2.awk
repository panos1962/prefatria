BEGIN {
	OFS = "\t"
	reset_timestamp()
}

NF != 3 {
	errmsg($0 ": syntax error")
	next
}

{
	$1 += 0

	if ($1 != trexon_timestamp) {
		print_timestamp()
		alagi_timestamp($1)
	}

	if (!trexon_timestamp)
	next

	partida_count++
	dianomi_count += $3
}

END {
	print_timestamp()
}

function reset_timestamp() {
	trexon_timestamp = 0
	partida_count = 0
	dianomi_count = 0
}

function alagi_timestamp(ts,		ts1, ora, mera, minas, etos, dow) {
	reset_timestamp()

	if (ts < 2012000000)
	return errmsg($0 ": invalid timestamp (tiny)")

	if (ts > 2099123123)
	return errmsg($0 ": invalid timestamp (huge)")

	ora = ts % 100

	if ((ora < 0) || (ora > 23))
	return errmsg($0 ": invalid timestamp (λανθασμένη ώρα)")

	ts1 = (ts - ora) / 100
	mera = ts1 % 100

	if ((mera < 1) || (mera > 31))
	return errmsg($0 ": invalid timestamp (λανθασμένη ημέρα)")

	ts1 = (ts1 - mera) / 100
	minas = ts1 % 100

	if ((minas < 1) || (minas > 12))
	return errmsg($0 ": invalid timestamp (λανθασμένος μήνας)")

	etos = (ts1 - minas) / 100

	if ((etos < 2012) || (etos > 2099))
	return errmsg($0 ": invalid timestamp (λανθασμένο έτος)")

	ts1 = mktime(sprintf("%04d %02d %02d %02d 00 00", etos, minas, mera, ora))

	if (ts1 < 0)
	return errmsg($0 ": invalid timestamp")

	dow = strftime("%w", ts1)

	if ((dow < 0) || (dow > 6))
	return errmsg($0 ": invalid timestamp (λανθασμένη ημέρα εβδομάδας)")

	trexon_timestamp = ts
	timestamp = etos OFS minas OFS mera OFS dow OFS ora
}

function print_timestamp() {
	if (trexon_timestamp)
	print timestamp, partida_count, dianomi_count
}

function errmsg(msg) {
	print msg >"/dev/stderr"
	return 0
}
