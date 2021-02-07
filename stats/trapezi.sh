# Το παρόν πρόγραμμα επιχειρεί να κατασκευάσει τα files κωδικών παρτίδας
# και στοιχείων παρτίδας για κάθε έτος που δέχτεαι στο command line.
# Αν π.χ. δώσουμε την εντολή:
#
#	sh trapezi.sh 2012 2013
#
# το πρόγραμμα θα κατασκευάσει τα files "2012.trapezi", "2012.data",
# "2013.trapezi" και "2013.data" στο directory "stats/etos". Τα έτη
# που δίνουμε στο command line πρέπει να είναι γραμμένα στη λίστα
# δεκτών ετών "etos.list" στο directory "stats".
#
# Αν θέλουμε να τρέξουμε το πρόγραμμα για όλα τα δεκτά έτη, τότε
# μπορούμε να δώσουμε την εντολή:
#
#	sh trapezi.sh `cat etos.list`

cd "${PREFADOROS:?parameter not set}/stats/etos" 2>/dev/null

elist="${PREFADOROS}/stats/etos.list"
[ -f "${elist}" ] || {
	echo "${elist}: file not found" >&2
	exit 2
}

for i in $*
do
	[ "${i}" -eq "${i}" ] 2>/dev/null || {
		echo "${i}: invalid year" >&2
		continue
	}

	etos=`echo $i | comm -12 "${elist}" -`
	[ -n "${etos}" ] || {
		echo "${i}: not in ${elist}" >&2
		continue
	}

	"${PREFADOROS}/bin/trapezi" -r -y "${etos}" >"${etos}.trapezi"
	nice "${PREFADOROS}/bin/stats" -D "${etos}.trapezi" >"${etos}.data"
done
