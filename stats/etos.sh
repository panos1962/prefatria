#!/usr/bin/env bash

progname=`basename $0`

[ -z "${PREFADOROS}" ] && {
	echo "${progname}: PREFADOROS: parameter not set" >&2
	exit 2
}

# Ελέγχουμε αν ο «Πρεφαδόρος» είναι σε λειτουργία.

sh "${PREFADOROS}/skiser.sh" >/dev/null || {
	echo "${progname}: server σκηνικού εκτός λειτουργίας" >&2
	exit 2
}

# Τα στατιστικά κρατούνται σε εξωτερικά files στο directory "stats/etos"
# και ως εκ τούτου ελέγχουμε την ύπαρξη του συγκεκριμένου directory.

cd "${PREFADOROS}/stats/etos" 2>/dev/null || {
	echo "${progname}: ${PREFADOROS}/stats: directory not found" >&2
	exit 2
}

# Το πρόγραμμα τρέχει με παραμέτρους τα έτη για τα οποία επιθυμούμε να
# παράξουμε στατιστικά στοιχεία. Αν δεν καθορίσουμε έτη, χρησιμοποιούμε
# το τρέχον και το προηγούμενο έτος.

usage() {
	echo "usage: ${progname} [-v] [years...]" >&2
	exit 1
}

errs=
verbose=

while getopts ":v" arg
do
	case "${arg}" in

	# Με την option -v το πρόγραμμα γίνεται «ομιλητικό» με την έννοια
	# της εκτύπωσης μηνυμάτων για κάθε φάση της παραγωγής στατιστικών.

	v)
		verbose="yes"
		;;

	\?)
		echo "${progname}: ${OPTARG}: invalid option" >&2
		errs="yes"
		;;

	esac
done

[ -n "${errs}" ] && usage

shift `expr ${OPTIND} - 1`

# Όπως είπαμε παραπάνω, αν δεν καθοριστούν έτη στο command line, παράγονται
# στατιστικά στοιχεία για το τρέχον έτος. Αν, όμως, βρσκόμαστε στις αρχές
# του έτους, τότε παράγονται στατιστικά στοιχεία και για το προηγούμενο
# έτος, καθώς κάποια τραπέζια μπορεί να αρχειοθετήθηκαν τις πρώτες ώρες
# του νέου έτους.

[ $# -lt 1 ] && {
	set -- `awk 'BEGIN {
	ymd = strftime("%Y-%m-%d")
	n = split(ymd, a, "-")

	if (n != 3)
	exit(0)

	# Αν είμαστε στον πρώτο μήνα και στην πρώτη ημέρα, τότε
	# θα πρέπει να παράξουμε στατιστικά στοιχεία και για το
	# προηγούμενο έτος.

	if (((a[2] + 0) < 2) && ((a[3] + 0) < 2))
	print a[1] - 1

	print a[1]
	exit(0)
}'`
}

etos_check() {
	[ "${1}" -eq "${1}" ] 2>/dev/null && return 0

	echo "${progname}: ${etos}: invalid year" >&2
	return 1
}

tmp1="/tmp/$$xx1"
tmp2="/tmp/$$xx2"
tmp3="/tmp/$$xx3"

cleanup() {
	rm -f ${tmp1} ${tmp2} ${tmp3}
}

trap "cleanup; exit 2" 1 2 3 15

for etos in $*
do
	etos_check "${etos}" || continue

	[ -n "${verbose}" ] && echo "
Έτος ${etos}:"

	trapezi="${etos}.trapezi"
	[ -n "${verbose}" ] && echo "Δημιουργία αρχείου ${trapezi}..."
	"${PREFADOROS}/bin/trapezi" -r -y ${etos} >${trapezi}

	data="${etos}.data"
	errs="${etos}.err"

	[ -f "${data}" ] || {
		[ -n "${verbose}" ] && echo "Δημιουργία αρχείου ${data}..."
		nice "${PREFADOROS}/bin/stats" -D ${trapezi} >${data} 2>${errs}
		[ -s ${errs} ] || rm -f ${errs}
		continue
	}

	# Κρατάμε τους κωδικούς τραπεζιών από τα στοιχεία που υπάρχουν ήδη
	# για το ανά χείρας έτος.

	[ -n "${verbose}" ] && echo "Εξαγωγή κωδικών παρτίδων από το υπάρχον αρχείο ${data}..."
	awk '{ print $1 + 0 }' ${data} | sort -u >${tmp1}

	# Συγκρίνουμε τους κωδικούς με τους κωδικούς όλων των τραπεζιών τού
	# ανά χείρας έτους και ταξινομούμε τους κωδικούς των νέων τραπεζιών
	# που προκύπτουν, κατά φθίνουσα αριθμητική σειρά.

	[ -n "${verbose}" ] && echo "Απόσπαση νέων κωδικών παρτίδων..."
	sort -u ${trapezi} | comm -13 ${tmp1} - | sort -run >${tmp2}

	# Αν δεν έχουν προκύψει κωδικοί νέων παρτίδων, τότε το παλαιό αρχείο
	# είναι πλήρες και επομένως δεν προβαίνουμε σε καμία περαιτέρω ενέργεια.

	[ -s ${tmp2} ] || continue

	# Έχουν προκύψει κωδικοί νέων παρτίδων, επομένως προχωρούμε στην
	# παραγωγή στοιχείων παρτίδας για τις νέες παρτίδες και στη μείξη
	# των στοιχείων αυτών με τα παλαιά στοιχεία.

	[ -n "${verbose}" ] && echo "Ενσωμάτωση στοιχείων παρτίδων για τις νέες παρτίδες..."
	nice "${PREFADOROS}/bin/stats" -D ${tmp2} >${tmp1} 2>${tmp3}

	# Ενημερώνουμε το αρχείο λαθών με τυχόν νέα λάθη που προέκυψαν κατά
	# την παραγωγή στοιχείων παρτίδας για τις νέες παρτίδες.

	[ -s ${tmp3} ] && {
		cat ${tmp3} >>${errs}
		cat ${tmp3} >&2
	}

	# Αν δεν έχουν προκύψει νέα στοιχεία παρτίδας, τότε δεν προβαίνουμε σε
	# καμία περαιτέρω ενέργεια.

	[ -s ${tmp1} ] || continue

	# Προχωρούμε στη μείξη παλαιών και νέων στοιχείων παρτίδας και κρατάμε
	# τα αποτελέσματα σε προσωρινό file.

	awk -f "${PREFADOROS}/stats/etos.awk" -v old="${data}" ${tmp1} >${tmp2}

	# Εφόσον προέκυψαν νέα στοιχεία και τα στοιχεία αυτά είναι ποσοτικά ίσα
	# με το άθροισμα παλαιών και νέων στοιχείων, προχωρούμε στην ενημέρωση
	# του αρχείου στοιχείων παρτίδας για το ανά χείρας έτος.

	[ -s ${tmp2} ] || continue

	n_old=`wc -c <${data}`
	n_new=`wc -c <${tmp1}`
	n_mix=`wc -c <${tmp2}`

	[ `expr ${n_old} + ${n_new}` -ne ${n_mix} ] && {
		echo "${progname}: ${etos}: προέκυψαν σφάλματα συγχώνευσης στοιχείων παρτίδας" >&2
		continue
	}

	mv ${tmp2} ${data}

	[ -n "${verbose}" ] && echo "Παραγωγή στοιχείων κατάταξης παικτών..."
	sh "${PREFADOROS}/stats/pektis.sh" ${etos}

	[ -n "${verbose}" ] && echo "Παραγωγή στοιχείων στησίματος παρτίδων..."
	sh "${PREFADOROS}/stats/stisimo.sh" ${etos}
done

[ -n "${verbose}" ] && echo "
Ενημέρωση στοιχείων βαθμολογίας..."
sh "${PREFADOROS}/stats/rank.sh"

cleanup
exit 0
