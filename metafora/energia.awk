@include "util.awk"

BEGIN {
	FS = "\t"
	OFS = "\t"

	diagrafi["ΜΠΑΖΑ"] = 1
	diagrafi["ΠΛΗΡΩΜΗ"] = 1
}

{
	set_onoma()
	if (onoma_prev && (onoma != onoma_prev))
	print_load()
	onoma_prev = onoma

	ofile = onoma ".energia"
}

($1 == "") && ($2 == "") && ($3 != "") {
	process_energia()
	next
}

END {
	if (exit_status)
	exit(exit_status)

	process_energia()
	print_load()
}

function process_energia(		nf, energia, i) {
	if (NF != 8)
	fatal($0 ": λάθος στοιχεία ενέργειας (" NF ")")

	nf = 3

	energia["kodikos"] = $(nf++) + 0
	energia["dianomi"] = $(nf++) + 0
	energia["pektis"] = $(nf++) + 0
	energia["idos"] = $(nf++)

	if (energia["idos"] in diagrafi)
	next

	energia["data"] = $(nf++)
	energia["pote"] = $(nf++)

	# print_energia(energia, ">>>>")

	if (energia["idos"] == "ΔΙΑΝΟΜΗ")
	return metatropi_dianomi(energia)

	if (energia["idos"] == "ΔΗΛΩΣΗ")
	return metatropi_dilosi(energia)

	if (energia["idos"] == "ΑΓΟΡΑ")
	return metatropi_agora(energia)

	if ((energia["idos"] == "CLAIM") && (energia["data"] == "YES")) {
		energia["idos"] = "ΠΑΡΑΙΤΗΣΗ"
		energia["data"] = "ΝΑΙ"
	}

	else if (energia["idos"] == "ΣΟΛΟ")
	energia["data"] = "S" energia["data"]

	print_energia(energia)
}

function metatropi_dianomi(energia,			n, atad) {
	n = split(energia["data"], atad, ":")
	if (n != 4)
	fatal($0 ": λάθος στοιχεία διανομής")

	fila[1] = atad[2]
	fila[2] = atad[3]
	fila[3] = atad[4]
	tzogos = atad[1]

	energia["data"] = fila[1] fila[2] fila[3] tzogos
	print_energia(energia)
}

function metatropi_dilosi(energia,			n, atad) {
	if (data ~ /^E/) {
		energia["data"] = "=" substr(energia["data"], 2)
		return print_energia(energia)
	}

	if (energia["data"] !~ /^P/)
	return print_energia(energia)

	n = split(energia["data"], atad, ":")
	energia["data"] = "DPS"

	if (n == 1)
	return print_energia(energia)

	if (n != 2)
	fatal($0 ": λάθος στοιχεία δήλωσης ΠΑΣΟ")

	print_energia(energia)

	energia_keep = energia["kodikos"] OFS energia["dianomi"] OFS energia["pektis"] OFS \
		"FLOP" OFS atad[2] OFS energia["pote"]
}

function metatropi_agora(energia,			n, atad, agora) {
	if (energia["data"] == "NNN") {
		energia_keep = ""
		return
	}

	n = split(energia["data"], atad, ":")
	if (n != 2)
	fatal($0 ": λάθος στοιχεία αγοράς")

	agora = (atad[1] ~ /^N/ ? "D" : "A") substr(atad[1], 2) skarta(energia["pektis"], atad[2])

	energia["data"] = agora
	print_energia(energia)
}

function skarta(pektis, alif,			l, i, filo, fila1, s) {
	delete fila1

	l = length(fila[pektis])
	for (i = 1; i <= l; i += 2) {
		filo = substr(fila[pektis], i, 2)
		fila1[filo] = 1
	}

	l = length(tzogos)
	for (i = 1; i <= l; i += 2) {
		filo = substr(tzogos, i, 2)
		fila1[filo] = 1
	}

	l = length(alif)
	for (i = 1; i <= l; i += 2) {
		filo = substr(alif, i, 2)

		if (filo in fila1)
		delete fila1[filo]
	}

	s = ""
	for (i in fila1)
	s = s i

	if (length(s) != 4)
	print $0 ": λάθος σκάρτα" >"/dev/stderr"

	return s
}

function print_energia(energia) {
	if (energia_keep) {
		print energia_keep >ofile
		energia_keep = ""
	}

	print energia["kodikos"] OFS energia["dianomi"] OFS energia["pektis"] OFS \
		energia["idos"] OFS energia["data"] OFS energia["pote"] >ofile
}

function print_load() {
	print "LOAD DATA LOCAL INFILE '" onoma_prev ".energia' INTO TABLE `energia` " \
		"(`kodikos`, `dianomi`, `pektis`, `idos`, `data`, `pote`)" >onoma_prev ".energia.load"

	print onoma_prev
	fflush()
}
