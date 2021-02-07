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

# Η βαθμολογία επιτελείται στο directory "stats/rank" και ως εκ τούτου
# ελέγχουμε την ύπαρξη του συγκεκριμένου directory.

cd "${PREFADOROS}/stats/rank" 2>/dev/null || {
	echo "${progname}: ${PREFADOROS}/stats/rank: directory not found" >&2
	exit 2
}

usage() {
	echo "usage: ${progname}" >&2
	exit 1
}

errs=

while getopts ":" arg
do
	case "${arg}" in
	\?)
		echo "${progname}: ${OPTARG}: invalid option" >&2
		errs="yes"
		;;
	esac
done

[ -n "${errs}" ] && usage

shift `expr ${OPTIND} - 1`

[ $# -eq 0 ] || usage

tmp1="/tmp/$$xx1"
tmp2="/tmp/$$xx2"
tmp3="/tmp/$$xx3"

cleanup() {
	rm -f ${tmp1} ${tmp2} ${tmp3}
}

trap "cleanup; exit 2" 1 2 3 15

pinifile="${PREFADOROS}/stats/www/pini.tsv"
sql="${PREFADOROS}/bin/sql"

{
	[ -s "${pinifile}" ] && cat "${pinifile}"
	"${sql}" -e 'SELECT `pektis`, `timi` FROM `peparam` WHERE `param` LIKE '"'ΒΑΘΜΟΛΟΓΙΑ'"
} |\
"${PREFADOROS}/bin/rank" -d 10000 -u - `ls -r 20[1-9][0-9].tsv` |\
"${sql}"

cleanup
exit 0
