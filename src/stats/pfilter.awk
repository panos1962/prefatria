#!/usr/bin/env awk

BEGIN {
	FS = "\t"
	OFS = "\t"

	pektes_set()
}

{
	$1 += 0
}

$1 != trapezi {
	trapezi = $1

	if (NF != 5) {
		trapezi_ok = 0
		next
	}

	pektis[1] = $3
	pektis[2] = $4
	pektis[3] = $5

	trapezi_ok = pektes_check()
}

trapezi_ok {
	print
}

function pektes_set(	n, a, i) {
	n = split(pektes, a, "[, ]")

	for (i = 1; i <= n; i++) {
		if (a[i] != "")
		pektes_list[a[i]] = pektes_count++
	}
}

function pektes_check(		p, thesi, ok) {
	if (pektes_count <= 0)
	return 1

	for (p in pektes_list) {
		for (thesi = 1; thesi <= 3; thesi++) {
			if (p != pektis[thesi])
			continue

			ok++

			if (ok >= 3)
			return 1

			break
		}
	}

	return (ok == pektes_count)
}
