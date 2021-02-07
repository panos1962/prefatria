#!/usr/bin/env awk

# Το πρόγραμμα δέχεται και εξωτερικές παραμέτρους:
#
# pardia	Είναι ο ελάχιστος αριθμός διανομών που πρέπει να έχει
#		η παρτίδα προκειμένου να θεωρηθεί κανονική.
#
# filiki	Αν έχει καθοριστεί μη μηδενική παράμετρος "filiki",
#		τότε οι φιλικές παρτίδες λογίζονται ως αγωνιστικές
#		και συμμετέχουν στα στατιστικά, αλλιώς αγνοούνται.
#
# paso		0: Μόνο παρτίδες στις οποίες ΔΕΝ παίζεται το πάσο.
#
#		1: Μόνο παρτίδες στις οποίες παίζεται το πάσο.
#
#		2: Όλες οι παρτίδες, αναξαρτήτως αν παίζεται ή όχι
#		   το πάσο.
#
# pekdia	Είναι ο ελάχιστος αριθμός διανομών που πρέπει να έχει
#		παίξει ο παίκτης προκειμένου να υπολογιστούν τα
#		στατιστικά του.
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
	pekdia += 0

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

	# Καθαρίζουμε το στοιχείο ελέγχου συμμετοχής παικτών.

	pektes_checked = 0

	# Μηδενίζουμε το πλήθος διανομών της νέας παρτίδας.

	dianomes_partidas = 0
	pegmenes_partidas = 0

	# Μηδενίζουμε κέρδη και ζημίες παρτίδας κατά παίκτη.

	delete kapikia_partidas

	nf = 2

	# Μετατρέπουμε το στήσιμο σε YYYYMMDDHHMMSS

	stisimo = $(nf++)
	gsub(/[^0-9]/, "", stisimo)

	# Κρατάμε τα ονόματα των παικτών στη λίστα "pektis" με
	# index τη θέση του παίκτη.

	for (i = 1; i <= 3; i++)
	pektis[i] = $(nf++)

	# Θέτουμε ήδη από την αρχή το στοιχείο ελέγχου παικτών.
	# Αυτό το κάνουμε για να «πιάσουμε» και τραπέζια που δεν
	# έχουν καθόλου διανομές.

	check_pektes()

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

# Ακοκολουθούν οι γραμμές που αφορούν στις διανομές της παρτίδας. Τα στοιχεία
# κάθε διανομής είναι:
#
# Κωδικός τραπεζιού	Είναι ο κωδικός τραπεζιού.
#
# Κωδικός διανομής	Ο κωδικός διανομής.
#
# Θέση dealer		Η θέση του παίκτη που μοίρασε τα φύλλα της διανομής.
#
# Φύλλα παίκτη (1)	Τα φύλλα του πρώτου παίκτη ως ένα string 20 χαρακτήρων
#			όπου κάθε ζεύγος χαρακτήρων δείχνει ένα φύλλο ως χρώμα
#			και αξία, π.χ. S6 σημαίνει 6 μπαστούνι, CT σημαίνει
#			βαλές σπαθί.
#
# Φύλλα παίκτη (2)	Τα φύλλα του δεύτερου παίκτη
#
# Φύλλα παίκτη (3)	Τα φύλλα του τρίτου παίκτη.
#
# Φύλλα τζόγου		Ένα string 4 χαρακτήρων που δείχνει τα φύλλα του τζόγου.
#
# Θέση τζογαδόρου	Αν έχει γίνει αγορά δείχνει τη θέση του τζογαδόρου, ήτοι
#			έναν από τους αριθμούς 1, 2, ή 3. Αν δεν έχει γίνει αγορά
#			είναι 0.
#
# Αγορά			Εφόσον έχει γίνει γίνει αγορά δείχνει την αγορά ως εξής:
#			ΔΧΜ όπου το Δ μπορεί να είναι "D" που σημαίνει δήλωση
#			αγοράς, ή Α που σημαίνει δήλωση αγοράς με άσους. Μπορεί
#			το Δ να φέρει και τιμή "S" σημαίνει σόλο αξιοπρέπειας.
#			Το Χ υποδηλώνει το χρώμα της αγοράς, ήτοι "S" για τα
#			μπαστούνια, "C" για τα σπαθιά, "D" για τα καρά, "H" για
#			τις κούπες και "N" για τα άχροα.
#			Το Μ είναι αριθμητικό ψηφίο που δείνχει το πλήθος των
#			μπαζών, ή "T" που σημαίνει 10 μπάζες.
#
# Σκάρτα		Ένα string 4 χαρακτήρων που δείχνει τα σκάρτα, εφόσον έχει
#			γίνει αγορά. Αν δεν έχει γίνει αγορά παραμένει κενό.
#
# Συμμετοχή παίκτη (1)	Πρόκειται για μονογράμματο string που δείχνει τη δήλωση
#			συμμετοχής του πρώτου παίκτη, εφόσον έχει γίνει αγορά.
#			Οι τιμές είναι "Π" που σημαίνει "ΠΑΙΖΩ", "Σ" που σημαίνει
#			"ΠΑΣΟ" και "Ζ" που σημαίνει "ΜΑΖΙ". Για τον τζογαδόρο δεν
#			υφίσταται δήλωση συμμετοχής, ωστόσο η τιμή του εν λόγω
#			πεδίου τίθεται "Α". Αν δεν έχει γίνει αγορά, τότε οι
#			συμμετοχές είναι κενές.
#
# Μπάζες παίκτη (1)	Είναι το πλήθος των μπαζών που έκανε ο πρώτος παίκτης.
#
# Καπίκια παίκτη (1)	Είναι τα καπίκια που κέρδισε ή έχασε ο πρώτος παίκτης στη
#			συγκεκριμένη διανομή.
#
# Συμμετοχή παίκτη (2)	Είναι το string συμμετοχής του δεύτερου παίκτη και ακολουθεί
#			τους κανόνες που αναλύσαμε στον πρώτο παίκτη.
#
# Μπάζες παίκτη (2)	Είναι το πλήθος των μπαζών που έκανε ο δεύτερος παίκτης.
#
# Καπίκια παίκτη (2)	Είναι τα καπίκια που κέρδισε ή έχασε ο δεύτερος παίκτης στη
#			συγκεκριμένη διανομή.
#
# Συμμετοχή παίκτη (3)	Είναι το string συμμετοχής του τρίτου παίκτη και ακολουθεί
#			τους κανόνες που αναλύσαμε στον πρώτο παίκτη.
#
# Μπάζες παίκτη (3)	Είναι το πλήθος των μπαζών που έκανε ο τρίτος παίκτης.
#
# Καπίκια παίκτη (3)	Είναι τα καπίκια που κέρδισε ή έχασε ο τρίτος παίκτης στη
#			συγκεκριμένη διανομή.

NF == 19 {
	# Αρχικά γίνεται έλεγχος που αφορά στη φιλικότητα της παρτίδας.

	if (!check_filiki())
	next

	# Εφόσον περάσαμε τον έλεγχο φιλικότητας, ελέγχουμε το καθεστώς
	# του πάσο.

	if (!check_paso())
	next

	# Ελέγχουμε τους συμμετέχοντες παίκτες.

	if (!check_pektes())
	next

	# Εφόσον περάσαμε όλους τους ελέγχους συμμετοχής της παρτίδας στα
	# στατιστικά, προχωρούμε στη διαχείριση της διανομής.

	process_dianomi()
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

	delete partida_count[""]
	for (i in partida_count) {
		if (dianomi_count[i] < pekdia)
		continue

		tzogadoros_isa_kapikia[i] = sprintf("%.0f", tzogadoros_isa_kapikia[i]) + 0
		tzogadoros_exo_kapikia[i] = sprintf("%.0f", tzogadoros_exo_kapikia[i]) + 0
		tzogadoros_mesa_kapikia[i] = sprintf("%.0f", tzogadoros_mesa_kapikia[i]) + 0

		sinolika_kapikia[i] = sprintf("%.0f", sinolika_kapikia[i]) + 0
		aminomenos_kapikia[i] = sprintf("%.0f", aminomenos_kapikia[i]) + 0
		paso_kapikia[i] = sprintf("%.0f", paso_kapikia[i]) + 0

		print i,			# παίκτης
		partida_count[i],		# πλήθος παρτίδων
		dianomi_count[i],		# πλήθος διανομών

		pegmenes_dianomes[i] + 0,	# πλήθος παιγμένων διανομών
		sinolika_kapikia[i],		# συνολικά καπίκια

		partides_katataxis[i] + 0,	# πλήθος παρτίδων κατάταξης 123
		protos_count[i] + 0,		# πλήθος παρτίδων που κατετάγη πρώτος
		defteros_count[i] + 0,		# πλήθος παρτίδων που κατετάγη δεύτερος
		tritos_count[i] + 0,		# πλήθος παρτίδων που κατετάγη τρίτος

		apli_count[i] + 0,		# πλήθος αγορών έξι μπαζών
		apli_mesa_count[i] + 0,		# πλήθος αγορών έξι μπαζών που μπήκαν απλώς μέσα
		apli_solo_count[i] + 0,		# πλήθος αγορών έξι μπαζών που μπήκαν σόλο μέσα

		alli_count[i] + 0,		# πλήθος αγορών από επτά και πάνω
		alli_mesa_count[i] + 0,		# πλήθος αγορών από επτά και πάνω που μπήκαν απλώς μέσα
		alli_solo_count[i] + 0,		# πλήθος αγορών από επτά και πάνω που μπήκαν σόλο μέσα

		asoi_count[i] + 0,		# πλήθος αγορών που δήλωσε τους άσους
		aftosolo[i] + 0,		# πλήθος αγορών που δήλωσε σόλο αξοπρέπειας

		mesa_protos[i] + 0,		# πλήθος αγορών που έπαιζε πρώτος και μπήκε μέσα
		mesa_defteros[i] + 0,		# πλήθος αγορών που έπαιζε δεύτερος και μπήκε μέσα
		mesa_tritos[i] + 0,		# πλήθος αγορών που έπαιζε τρίτος και μπήκε μέσα

		tzogadoros_isa_kapikia[i],	# καπίκια ως αγοραστής σε αγορές που βγήκαν ακριβώς
		tzogadoros_exo_kapikia[i],	# καπίκια ως αγοραστής σε αγορές με πλεόνασμα μπαζών
		tzogadoros_mesa_kapikia[i],	# καπίκια ως αγοραστής σε αγορές που μπήκαν μέσα

		amina_dianomes[i] + 0,		# πλήθος διανομών ως αμυνόμενος
		mazi_count[i] + 0,		# πλήθος διανομών που δήλωσε ΜΑΖΙ
		aminomenos_kapikia[i],		# καπίκια ως αμυνόμενος

		paso_dianomes[i] + 0,		# πλήθος διανομών που έπαιξε το πάσο
		paso_kapikia[i]			# καπίκια από διανομές που παίχτηκε το πάσο
	}
}

function process_trapezi(	i) {
	if (!trapezi)
	return

	if (!dianomes_partidas)
	return

	for (i = 1; i <= 3; i++) {
		partida_count[pektis[i]]++
		dianomi_count[pektis[i]] += dianomes_partidas
	}

	process_katataxi()
}

function pektes_set(	n, a, i) {
	n = split(pektes, a, "[, ]")

	pektes_lista[""] = 0
	pektes_count = 0

	for (i = 1; i <= n; i++) {
		if (a[i] in pektes_lista)
		continue

		pektes_lista[a[i]] = pektes_count++
	}

	delete pektes_lista[""]
}

# Η function "check_pektes" ελέγχει αν οι συμμετέχοντες παίκτες πληρούν τα
# κριτήρια που αφορούν στα ονόματα των συμμετεχόντων παικτών.
#
# Ο έλεγχος γίνεται ως εξής:
#
# Αν δεν έχουν δοθεί περιορισμοί που αφορούν στους συμμετέχοντες παίκτες, τότε
# όλες οι παρτίδες γίνονται δεκτές.
#
# Αν η λίστα των ονομάτων περιέχει μέχρι τρία ονόματα, τότε στα τραπέζια πρέπει
# να συμμετέχουν όλοι οι παίκτες που έχουν καθοριστεί.
#
# Αν η λίστα των ονομάτων περιέχει περισσότερα από τρία ονόματα, τότε επιλέγονται
# τραπέζια στα οποία όλοι συμμετέχοντες ανήκουν στη λίστα.

function check_pektes(		thesi, ok) {
	# Αν οι παίκτες έχουν ήδη ελεγχθεί για το τρέχον τραπέζι και βρέθηκαν
	# εντάξει, τότε ο έλεγχος των παικτών επιτυγχάνει.

	if (pektes_checked == 1)
	return 1

	# Αν οι παίκτες έχουν ήδη ελεγχθεί για το τρέχον τραπέζι και δεν βρέθηκαν
	# εντάξει, τότε ο έλεγχος των παικτών αποτυγχάνει.

	if (pektes_checked == 2)
	return 0

	# Οι παίκτες δεν έχουν ελεγθεί για το τρέχον τραπέζι, επομένως ελέγχονται
	# τώρα και παράλληλα τίθεται το στοιχείο ταχέως ελέγχου.

	if (pektes_count <= 0)
	return (pektes_checked = 1)

	ok = 0

	for (thesi = 1; thesi <= 3; thesi++) {
		if (pektis[thesi] in pektes_lista)
		ok++
	}

	if (ok >= pektes_count)
	return (pektes_checked = 1)

	if (ok >= 3)
	return (pektes_checked = 1)

	return (pektes_checked = 2)
}

# Αν η παρτίδα έχει ικανό πλήθος διανομών, θεωρείται παρτίδα κατάταξης
# και τα αποτελέσματα κατάταξης καταγράφονται.

function process_katataxi(	i, kp) {
	if (dianomes_partidas < pardia)
	return

	if (rankfile)
	process_rank()

	# Ταξινομούμε τα καπίκια κάθε παίκτη κατά αύξουσα σειρά στο array
	# "kp", επομένως στην θέση 3 θα βρίσκεται ο πρώτος παίκτης, στη
	# θέση 2 θα βρίσκεται ο δεύτερος παίκτης και θέση 1 θα βρίσκεται
	# ο τρίτος παίκτης.

	asort(kapikia_partidas, kp)

	for (i in kapikia_partidas) {
		if (kapikia_partidas[i] == kp[3]) {
			partides_katataxis[pektis[i]]++
			protos_count[pektis[i]]++
			delete kapikia_partidas[i]
			break
		}
	}

	for (i in kapikia_partidas) {
		if (kapikia_partidas[i] == kp[2]) {
			partides_katataxis[pektis[i]]++
			defteros_count[pektis[i]]++
			delete kapikia_partidas[i]
			break
		}
	}

	for (i in kapikia_partidas) {
		partides_katataxis[pektis[i]]++
		tritos_count[pektis[i]]++
		break
	}
}

# Στο αρχείο βαθμολογίας καταγράφονται για κάθε παρτίδα τα εξής στοιχεία:
#
#	Κωδικός παρτίδα
#	Πλήθος παιγμένων διανομών
#	Όνομα παίκτη
#	Καπίκια που κέρδισε ή έχασε ο παίκτης

function process_rank(		i) {
	pegmenes_partidas += 0
	if (pegmenes_partidas <= 0)
	return

	for (i = 1; i <= 3; i++) {
		if (pektis[i])
		print trapezi, pegmenes_partidas, pektis[i], sprintf("%.0f", kapikia_partidas[i] + 0) >rankfile
	}
}

function process_dianomi(	nf, dianomi, dealer, protos, i, fila, tzogos, \
	tzogadoros, agora, skarta, simetoxi, bazes, kapikia) {

	nf = 2

	dianomi = $(nf++) + 0
	dealer = $(nf++) + 0

	protos = dealer + 1

	if (protos > 3)
	protos = 1

	for (i = 1; i <= 3; i++)
	fila[i] = $(nf++)

	tzogos = $(nf++)

	tzogadoros = $(nf++) + 0
	agora = $(nf++)
	skarta = $(nf++)

	for (i = 1; i <= 3; i++) {
		simetoxi[i] = $(nf++)
		bazes[i] = $(nf++) + 0
		kapikia[i] = $(nf++) + 0
		kapikia_partidas[i] += kapikia[i]
	}

	if (agora)
	process_agora(dianomi, protos, tzogadoros, agora, simetoxi, bazes, kapikia)

	else if (is_paso())
	process_paso(dianomi, bazes, kapikia)

	else
	return

	pegmenes_partidas++

	for (i = 1; i <= 3; i++)
	pegmenes_dianomes[pektis[i]]++
}

function process_agora(dianomi, protos, tzogadoros, agora, simetoxi, \
	bazes, kapikia,		agorastis, das, agora_xroma, agora_bazes, \
	mesa_bazes, apla_mesa, solo_mesa) {

	agorastis = pektis[tzogadoros]

	das = substr(agora, 1, 1)

	if (das == "S")
	aftosolo[agorastis]++

	else if (das == "A")
	asoi_count[agorastis]++

	agora_xroma = substr(agora, 2, 1)

	agora_bazes = substr(agora, 3, 1)

	if (agora_bazes == "T")
	agora_bazes = 10

	else
	agora_bazes += 0

	apla_mesa = 0
	solo_mesa = 0

	mesa_bazes = agora_bazes - bazes[tzogadoros]

	if (mesa_bazes > 1)
	solo_mesa = 1

	else if (mesa_bazes > 0)
	apla_mesa = 1

	if (mesa_bazes > 0)
	mesa_sira(tzogadoros, protos, agorastis)

	agora_count[agorastis]++
	agora_mesa_count[agorastis] += apla_mesa
	agora_solo_count[agorastis] += solo_mesa

	if (agora_bazes == 6) {
		apli_count[agorastis]++
		apli_mesa_count[agorastis] += apla_mesa
		apli_solo_count[agorastis] += solo_mesa
	}

	else {
		alli_count[agorastis]++
		alli_mesa_count[agorastis] += apla_mesa
		alli_solo_count[agorastis] += solo_mesa
	}

	kapikia_tzogadoros(kapikia, tzogadoros, mesa_bazes, agorastis)
	kapikia_aminomenos(kapikia, tzogadoros, simetoxi)
	kapikia_sinolika(kapikia)
}

# Η function "mesa_sira" κρατάει στοιχεία σχετικά με τη θέση του τζογαδόρου
# που έχει μπει μέσα, τουτέστιν αν έπαιζε πρώτος, δεύτερος, ή τελευταίος.

function mesa_sira(tzogadoros, protos, agorastis,	sira) {
	sira = tzogadoros - protos

	if (sira < 0)
	sira += 3

	if (sira == 0)
	return mesa_protos[agorastis]++

	if (sira == 1)
	return mesa_defteros[agorastis]++

	if (sira == 2)
	return mesa_tritos[agorastis]++

	errmsg(dianomi ": εξωτική σειρά τζογαδόρου")
}

function kapikia_tzogadoros(kapikia, tzogadoros, mesa_bazes, agorastis) {
	if (mesa_bazes > 0)
	tzogadoros_mesa_kapikia[agorastis] -= kapikia[tzogadoros]

	else if (mesa_bazes < 0)
	tzogadoros_exo_kapikia[agorastis] += kapikia[tzogadoros]

	else
	tzogadoros_isa_kapikia[agorastis] += kapikia[tzogadoros]
}

function kapikia_aminomenos(kapikia, tzogadoros, simetoxi,	i) {
	for (i = 1; i <= 3; i++) {
		if (i == tzogadoros)
		continue

		aminomenos_kapikia[pektis[i]] += kapikia[i]
		amina_dianomes[pektis[i]]++

		if (simetoxi[i] == "Ζ")
		mazi_count[pektis[i]]++
	}
}

function kapikia_sinolika(kapikia,	i) {
	for (i = 1; i <= 3; i++)
	sinolika_kapikia[pektis[i]] += kapikia[i]
}

function process_paso(dianomi, bazes, kapikia,		i) {
	for (i = 1; i <= 3; i++) {
		paso_kapikia[pektis[i]] += kapikia[i]
		sinolika_kapikia[pektis[i]] += kapikia[i]
		kapikia_partidas[i] += kapikia[i]
		paso_dianomes[pektis[i]]++
	}
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
