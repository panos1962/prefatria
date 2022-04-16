##############################################################################@
#
# Το παρόν αποτελεί AWK function library για τον «Πρεφαδόρο».
# Συμπεριλαμβάνεται σε AWK scripts με τις εντολές:
#
#	@load "spawk"
#	@include "prefadoros"
#

BEGIN {
	spawk_verbose = 1

	spawk_sesami["dbuser"] = "prefadoros"
	spawk_sesami["dbname"] = "prefatria"
	spawk_sesami["dbcharset"] = "utf8mb4"
	set_password()

	prefa_setup()
}

##############################################################################@

function trapezi_fetch(trapezi,			thesi) {
	if (!spawk_fetchrow(trapezi))
	return 0

	for (thesi = 1; thesi <= 3; thesi++) {
		trapezi["pektis"][thesi] = trapezi["pektis" thesi]
		delete trapezi["pektis" thesi]

		trapezi["apodoxi"][thesi] = trapezi["apodoxi" thesi]
		delete trapezi["apodoxi" thesi]
	}

	return 1
}

##############################################################################@
#
# Τα παρακάτω αφορούν στις παραμέτρους τραπεζιού/παρτίδας (trparam).

function kasa_get(trapezi) {
	return trparam_get(trapezi, "ΚΑΣΑ", 50)
}

function is_asoi(trapezi) {
	return trparam_get(trapezi, "ΑΣΟΙ", 1)
}

function oxi_asoi(trapezi) {
	return !is_asoi(trapezi)
}

function is_paso(trapezi) {
	return trparam_get(trapezi, "ΠΑΣΟ", 0)
}

function oxi_paso(trapezi) {
	return !is_paso(trapezi)
}

function telioma_get(trapezi) {
	return trparam_get(trapezi, "ΤΕΛΕΙΩΜΑ", "ΚΑΝΟΝΙΚΟ")
}

function is_anikto(trapezi) {
	return trparam_get(trapezi, "ΑΝΟΙΚΤΟ", 1)
}

function oxi_anikto(trapezi) {
	return !is_anikto(trapezi)
}

function is_klisto(trapezi) {
	return oxi_anikto(trapezi)
}

function oxi_klisto(trapezi) {
	return is_anikto(trapezi)
}

function is_filiki(trapezi) {
	return trparam_get(trapezi, "ΦΙΛΙΚΗ", 0)
}

function oxi_filiki(trapezi) {
	return !is_filiki(trapezi)
}

function is_idioktito(trapezi) {
	return trparam_get(trapezi, "ΙΔΙΟΚΤΗΤΟ", 0)
}

function oxi_idioktito(trapezi) {
	return !is_idioktito(trapezi)
}

function is_aorato(trapezi) {
	return trparam_get(trapezi, "ΑΟΡΑΤΟ", 0)
}

function oxi_aorato(trapezi) {
	return !is_aorato(trapezi)
}

function is_tournoua(trapezi) {
	return trparam_get(trapezi, "ΤΟΥΡΝΟΥΑ", 0)
}

function oxi_tournoua(trapezi) {
	return !is_tournoua(trapezi)
}

function epetiaki_get(trapezi) {
	return trparam_get(trapezi, "ΕΠΕΤΕΙΑΚΗ", "")
}

function is_epetiaki(trapezi) {
	return epetiaki_get(trapezi)
}

function trparam_get(trapezi, key, val) {
	trparam_check(trapezi)

	if (!("param" in trapezi))
	return val

	return key in trapezi["param"] ? trapezi["param"][key] : val
}

function trparam_clear(trapezi) {
	delete trapezi["param"]
}

function trparam_check(trapezi,		trparam) {
	if ("param" in trapezi)
	return

	trapezi["param"][""]
	delete trapezi["param"][""]

	if (spawk_submit("SELECT `param`, `timi` FROM `trparam` " \
		"WHERE `trapezi` = " trapezi["kodikos"], 1) != 3)
	exit(2)

	while (spawk_fetchrow(trparam)) {
		if (trparam[1] == "ΚΑΣΑ") {
			if ((trparam[2] += 0) != 50)
			trapezi["param"][trparam[1]] = trparam[2]

			continue
		}

		if (trparam[1] == "ΑΣΟΙ") {
			if (trparam[2] != "ΝΑΙ")
			trapezi["param"][trparam[1]] = 0

			continue
		}

		if (trparam[1] == "ΠΑΣΟ") {
			if (trparam[2] != "ΟΧΙ")
			trapezi["param"][trparam[1]] = 1

			continue
		}

		if (trparam[1] == "ΤΕΛΕΙΩΜΑ") {
			if (trparam[2] != "ΚΑΝΟΝΙΚΟ")
			trapezi["param"][trparam[1]] = traparam[2]

			continue
		}

		if (trparam[1] == "ΠΡΙΒΕ") {
			if (trparam[2] != "ΟΧΙ")
			trapezi["param"][trparam[1]] = 1

			continue
		}

		if (trparam[1] == "ΑΝΟΙΚΤΟ") {
			if (trparam[2] != "ΝΑΙ")
			trapezi["param"][trparam[1]] = 0

			continue
		}

		if (trparam[1] == "ΦΙΛΙΚΗ") {
			if (trparam[2] != "ΟΧΙ")
			trapezi["param"][trparam[1]] = 1

			continue
		}

		if (trparam[1] == "ΙΔΙΟΚΤΗΤΟ") {
			if (trparam[2] != "ΟΧΙ")
			trapezi["param"][trparam[1]] = 1

			continue
		}

		if (trparam[1] == "ΑΟΡΑΤΟ") {
			if (trparam[2] != "ΟΧΙ")
			trapezi["param"][trparam[1]] = 1

			continue
		}

		if (trparam[1] == "ΤΟΥΡΝΟΥΑ") {
			if (trparam[2] != "ΟΧΙ")
			trapezi["param"][trparam[1]] = 1

			continue
		}

		if (trparam[1] == "ΕΠΕΤΕΙΑΚΗ") {
			if (trparam[2])
			trapezi["param"][trparam[1]] = trparam[2]

			continue
		}
	}
}

##############################################################################@
#
#	trapezi {
#		kodikos
#		stisimo
#
#		pektis {
#			1
#			2
#			3
#		}
#
#		apodoxi {
#			1
#			2
#			3
#		}
#
#		poll
#		arxio
#	
#		dianomi {
#			kodikos
#			enarxi
#			dealer
#
#			kasa {
#				1
#				2
#				3
#			}
#
#			metrita {
#				1
#				2
#				3
#			}
#
#			telos
#		} []
#	
#		kapikia {
#			1
#			2
#			3
#		}
#	}

function dianomi_clear(trapezi) {
	delete trapezi["dianomi"]
}

function dianomi_check(trapezi,			dianomi, thesi, i) {
	if ("dianomi" in trapezi)
	return

	if (spawk_submit("SELECT * FROM `dianomi` WHERE `trapezi` = " \
		trapezi["kodikos"] " ORDER BY `kodikos`", 2) != 3)
	exit(2)

	for (trapezi["dcount"] = 0; spawk_fetchrow(dianomi); trapezi["dcount"]++) {
		for (thesi = 1; thesi <= 3; thesi++) {
			trapezi["dianomi"][trapezi["dcount"]]["kasa"][thesi] = dianomi["kasa" thesi]
			delete dianomi["kasa" thesi]

			trapezi["dianomi"][trapezi["dcount"]]["metrita"][thesi] = dianomi["metrita" thesi]
			delete dianomi["metrita" thesi]
		}

		delete dianomi["trapezi"]

		for (i in dianomi)
		trapezi["dianomi"][trapezi["dcount"]][i] = dianomi[i]
	}

	return trapezi["dcount"] 
}

##############################################################################@

function kapikia_clear(trapezi) {
	delete trapezi["kapikia"]
}

function kapikia_check(trapezi,		thesi, kasa, i) {
	if ("kapikia" in trapezi)
	return

	dianomi_check(trapezi)

	for (thesi = 1; thesi <= 3; thesi++)
	trapezi["kapikia"][thesi] = 0

	kasa = 0
	for (i = 0; i < trapezi["dcount"]; i++) {
		for (thesi = 1; thesi <= 3; thesi++) {
			trapezi["kapikia"][thesi] += trapezi["dianomi"][i]["kasa"][thesi] + \
				trapezi["dianomi"][i]["metrita"][thesi]
			kasa -= trapezi["dianomi"][i]["kasa"][thesi]
		}
	}

	kasa /= 3
	trapezi["kapikia"][3] = 0
	for (thesi = 1; thesi <= 2; thesi++) {
		trapezi["kapikia"][thesi] = sprintf("%.0f", trapezi["kapikia"][thesi] + kasa)
		trapezi["kapikia"][3] -= trapezi["kapikia"][thesi]
	}
}

function kapikia_get(trapezi, thesi) {
	kapikia_check(trapezi)
	return trapezi["kapikia"][thesi]
}

##############################################################################@

function set_password() {
	if ("dbpassword" in spawk_sesami)
	return

	if ("PREFADOROS_PASSWORD" in ENVIRON)
	return spawk_sesami["dbpassword"] = ENVIRON["PREFADOROS_PASSWORD"]

	spawk_sesami["dbpassword"] = spawk_getpass()
}

function fatal(msg, err) {
	print msg >"/dev/stderr"
	exit(err ? err : 2)
}

##############################################################################@

function prefa_setup(			i, j) {
	suit_list["S"] = "SPADES"
	suit_list["C"] = "CLUBS"
	suit_list["D"] = "DIAMONDS"
	suit_list["H"] = "HEARTS"

	i = 0

	rank_array[i++] = "7"
	rank_array[i++] = "8"
	rank_array[i++] = "9"
	rank_array[i++] = "T"
	rank_array[i++] = "J"
	rank_array[i++] = "Q"
	rank_array[i++] = "K"
	rank_array[i++] = "A"

	for (j = 0; j < i; j++)
	rank_list[rank_array[j]] = j

	axia_agoras["S6"] = 2
	axia_agoras["C6"] = 3
	axia_agoras["D6"] = 4
	axia_agoras["H6"] = 5
	axia_agoras["N6"] = 6

	for (i = 7; i < 10; i++) {
		for (j in suit_list)
		axia_agoras[suit_list[j] i] = i

		axia_agoras["N" i] = i + 1
	}

	axia_agoras["ST"] = 10
	axia_agoras["CT"] = 10
	axia_agoras["DT"] = 10
	axia_agoras["HT"] = 10
	axia_agoras["NT"] = 10
}
