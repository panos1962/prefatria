#!/usr/bin/env bash

progname="`basename $0`"

[ -n "${PREFADOROS}" ] || {
	echo "${progname}: PREFADOROS: environment variable not set" >&2
	exit 2
}

[ -d "${PREFADOROS}" ] || {
	echo "${progname}: ${PREFADOROS}: directory not found" >&2
	exit 2
}

[ -d "${PREFADOROS}/client/site/test" ] || {
	echo "${progname}: not a test machine" >&2
	exit 2
}

usage() {
	echo "usage: ${progname} [-t ταχύτητα (default: 500)]" >&2
	exit 1
}

errs=
erru=
taxitita="1000"

while getopts ":t:" arg
do
	case "${arg}" in
	t)
		if [ \( "${OPTARG}" -eq "${OPTARG}" \) -a \( "${OPTARG}" -ge 0 \) ] 2>/dev/null; then
			taxitita="${OPTARG}"
		else
			echo "${progname}: ${OPTARG}: λανθασμένο ταχύτητα" >&2
			errs="yes"
		fi
		;;
	\?)
		echo "${progname}: ${OPTARG}: invalid option" >&2
		erru="yes"
		;;
	esac
done

[ -n "${erru}" ] && usage
[ -n "${errs}" ] && exit 1

shift `expr ${OPTIND} - 1`

cd "${PREFADOROS}" || exit 2
sh skiser.sh status || sh skiser.sh start || exit 2

cleanup() {
	pkill -P $$
}

trap "cleanup" 0

winpos() {
	pid=$!

	cnt=0
	wid=""
	while [ "${wid}" = "" ]; do
		wid="$(wmctrl -lp 2>/dev/null | grep $pid | cut -d' ' -f1)"
		if [ "${cnt}" -gt 100 ]; then
			echo "${progname}: ${1}: browser window not found" >&2
			exit 2
		fi

		cnt=`expr ${cnt} + 1`
		sleep 0.1
	done
	wmctrl -i -r "${wid}" -e 0,$2,$3,$4,$5
}

url='http://localhost/prefatria?diafimisi&motd&test=pexnidi'

browser1="opera"
browser2="firefox"
browser3="vivaldi"

"${browser1}" "${url}&taxitita=${taxitita}" & winpos "${browser1}" 50 100 600 800
"${browser2}" "${url}" & winpos "${browser2}" 680 100 600 800
"${browser3}" "${url}" & winpos "${browser3}" 1300 140 620 800

read -p "

Press any key…" x
