BEGIN {
	FS = "\t"
	trapezi_count = 0
	dianomi_count = 0
	energia_count = 0
}

$1 != "" {
	$1 += 0

	if (trapezi_count++ == 0) {
		trapezi_min = $1
		trapezi_max = $1
	}

	else if ($1 < trapezi_min)
	trapezi_min = $1

	else if ($1 > trapezi_max)
	trapezi_max = $1

	next
}

($1 == "") && ($2 != "") {
	$2 += 0

	if (dianomi_count++ == 0) {
		dianomi_min = $2
		dianomi_max = $2
	}

	else if ($2 < dianomi_min)
	dianomi_min = $2

	else if ($2 > dianomi_max)
	dianomi_max = $2
}

($1 == "") && ($2 == "") && ($3 != "") {
	$3 += 0

	if (energia_count++ == 0) {
		energia_min = $3
		energia_max = $3
	}

	else if ($3 < energia_min)
	energia_min = $3

	else if ($3 > energia_max)
	energia_max = $3
}

END {
	printf("trapezi %d", trapezi_count)

	if (trapezi_count)
	printf(" %d %d\n", trapezi_min, trapezi_max)

	else
	print ""

	printf("dianomi %d", dianomi_count)

	if (dianomi_count)
	printf(" %d %d\n", dianomi_min, dianomi_max)

	else
	print ""

	printf("energia %d", energia_count)

	if (energia_count)
	printf(" %d %d\n", energia_min, energia_max)

	else
	print ""
}
