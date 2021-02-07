@include "util.awk"

BEGIN {
	FS = "\t"
	OFS = "\t"
}

{
	set_onoma()
	if (onoma_prev && (onoma != onoma_prev))
	print_load()
	onoma_prev = onoma

	dianomi = onoma ".dianomi"
}

($1 == "") && ($2 != "") {
	dianomi_print()
	dianomi_set()
	next
}

($1 == "") && ($2 == "") && ($3 != "") {
	telos = $8
	next
}

END {
	if (exit_status)
	exit(exit_status)

	dianomi_print()
	print_load()
}

function dianomi_set(			nf, kodikos, trapezi, dealer, \
	kasa1, metrita1, kasa2, metrita2, kasa3, metrita3, enarxi) {
	if (NF != 11)
	fatal($0 ": λάθος στοιχεία διανομής")

	nf = 2

	kodikos = $(nf++) + 0
	trapezi = $(nf++) + 0
	dealer = $(nf++) + 0

	kasa1 = $(nf++) + 0
	metrita1 = $(nf++) + 0

	kasa2 = $(nf++) + 0
	metrita2 = $(nf++) + 0

	kasa3 = $(nf++) + 0
	metrita3 = $(nf++) + 0

	enarxi = $(nf++)

	dianomi_keep = kodikos OFS trapezi OFS enarxi OFS dealer OFS kasa1 OFS \
		metrita1 OFS kasa2 OFS metrita2 OFS kasa3 OFS metrita3
}

function dianomi_print() {
	if (dianomi_keep)
	print dianomi_keep OFS telos >dianomi
}

function print_load() {
	print "LOAD DATA LOCAL INFILE '" onoma_prev ".dianomi' INTO TABLE `dianomi` " \
		"(`kodikos`, `trapezi`, `enarxi`, `dealer`, `kasa1`, `metrita1`, `kasa2`, " \
		"`metrita2`, `kasa3`, `metrita3`, `telos`)" >onoma_prev ".dianomi.load"

	print onoma_prev
	fflush()
}
