#!/usr/bin/env awk

# Το πρόγραμμα δέχεται και εξωτερικές παραμέτρους:
#
# pdmin		Είναι ο ελάχιστος αριθμός διανομών που πρέπει να έχει
#		η παρτίδα προκειμένου να θεωρηθεί κανονική.
#
# filiki	Αν έχει καθοριστεί μη μηδενική παράμετρος "filiki",
#		τότε οι φιλικές παρτίδες λογίζονται ως αγωνιστικές
#		και συμμετέχουν στα στατιστικά, αλλιώς αγνοούνται.
#
# paso		0: Μόνο παρτίδες στις οποίες δεν παίζεται το πάσο.
#
#		1: Μόνο παρτίδες στις οποίες παίζεται το πάσο.
#
#		2: Όλες οι παρτίδες, αναξαρτήτως αν παίζεται ή όχι
#		   το πάσο.
#
# pektes	Ονόματα παικτών χωρισμένα μεταξύ τους με κόμματα ή κενά.
#		Το πρόγραμμα θα περιοριστεί σε παρτίδες στις οποίες
#		συμμετέχουν οι συγκεκριμένοι παίκτες.

BEGIN {
	FS = "\t"
	OFS = "\t"

	pardia += 0
	filiki += 0
	paso += 0

	pektes_set()

	# Η μεταβλητή trapezi κρατάει τον κωδικό της τρέχουσας
	# παρτίδας.

	trapezi = 0
}

# Σε όλες τις γραμμές πρέπει ο κωδικός τραπεζιού να βρίσκεται στην
# πρώτη στήλη. Μπορούμε, ωστόσο, να παρεμβάλλουμε κενές γραμμές για
# λόγους ευαναγωσιμότητας.

NF < 1 {
	next
}

# Μετατρέπουμε τον κωδικό τραπεζιού σε αριθμό.

{
	$1 += 0
}

# Ελέγχουμε αν έχουμε νέο τραπέζι στα σκαριά. Αν ναι τυπώνουμε τα
# στοιχεία του προηγούμενου τραπεζιού και αρχικοποιούμε τις δομές
# του νέου τραπεζιού.

$1 != trapezi {
	process_trapezi()

	# Η αλλαγή τραπεζιού πρέπει να ξεκινά με τα βασικά στοιχεία
	# παρτίδας, ήτοι τον κωδικό, το στήσιμο, και τα ονόματα των
	# παικτών.

	if (NF != 5) {
		errmsg()
		trapezi = 0
		next
	}

	# Θέτουμε τον κωδικό τρέχοντος τραπεζιού.

	trapezi = $1

	# Καθαρίζουμε τις παραμέτρους παρτίδας.

	delete trparam

	# Μηδενίζουμε το πλήθος διανομών της νέας παρτίδας.

	dianomes_partidas = 0

	nf = 2

	# Μετατρέπουμε το στήσιμο σε YYYYMMDDHHMMSS

	stisimo = $(nf++)
	gsub(/[^0-9]/, "", stisimo)

	# Κρατάμε τα ονόματα των παικτών στη λίστα "pektis" με
	# index τη θέση του παίκτη.

	for (i = 1; i <= 3; i++)
	pektis[i] = $(nf++)

	next
}

# Οι γραμμές με δύο πεδία αφορούν στα χαρακτηριστικά της παρτίδας,
# τουτέστιν στο αν δεν παίζονται οι άσοι, αν παίζεται το πάσο, αν
# η παρτίδα είναι φιλική κλπ. Τα αντίστοιχα χαρακτηριστικά, ήτοι
# "ΑΣΟΙ", "ΠΑΣΟ" και "ΦΙΛΙΚΗ" δίνονται απλά με το όνομά τους.
#
# ΑΣΟΙ		Σημαίνει ότι στο τραπέζι δεν παίζονται οι άσοι. Αν
#		δεν έχει δοθεί η συγκεκριμένη παράμετρος, σημαίνει
#		ότι στο τραπέζι παίζονται οι άσοι.
#
# ΠΑΣΟ		Σημαίνει ότι στο τραπέζι παίζεται το πάσο. Αν δεν
#		έχει δοθεί η συγκεκριμένη παράμετρος, σημαίνει ότι
#		στο τραπέζι δεν παίζεται το πάσο.
#
# ΦΙΛΙΚΗ	Σημαίνει φιλική παρτίδα.

NF == 2 {
	trparam[$2] = 1
	next
}

NF == 19 {
	dianomes_partidas++
	next
}

# Γραμμές με άλλο πλήθος πεδίων από τα προβλεπόμενα παραπάνω
# μαρκάρονται ως εσφαλμένες.

{
	errmsg()
}

END {
	process_trapezi()
}

function pektes_set(	n, a, i) {
	n = split(pektes, a, "[, ]")

	for (i = 1; i <= n; i++) {
		if (a[i] != "")
		pektes_list[a[i]] = pektes_count++
	}
}

function process_trapezi(	i) {
	if (!trapezi)
	return

	if (!check_filiki())
	return

	if (!check_paso())
	return

	if (dianomes_partidas < pardia)
	return

	if (!pektes_check())
	return

	print substr(stisimo, 1, 10) + 0, trapezi, dianomes_partidas
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

function check_filiki() {
	if (filiki)
	return 1

	return oxi_filiki()
}

function check_paso() {
	if (paso == 2)
	return 1

	if (paso == 1)
	return is_paso()

	return oxi_paso()
}

function is_filiki() {
	return trparam["ΦΙΛΙΚΗ"]
}

function oxi_filiki() {
	return !is_filiki()
}

function is_paso() {
	return trparam["ΠΑΣΟ"]
}

function oxi_paso() {
	return !is_paso()
}

function errmsg(msg) {
	if (!msg)
	msg = $0 ": syntax error"

	print "prefadoros::pektis: " msg >"/dev/stderr"
}
