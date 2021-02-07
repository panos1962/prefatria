#!/usr/bin/env bash

progname=`basename "${0}"`

usage() {
	echo "usage: ${progname} [-D directory] [-t] [-d] [files...]" >&2
	exit 1
}

fatal() {
	echo "${progname}: ${1}" >&2
	exit 2
}

errs=
appdir=
trapezi=
dianomi=
energia=

while getopts ":D:tde" arg
do
	case "${arg}" in
	D)
		appdir="${OPTARG}"
		;;
	t)
		trapezi=yes
		;;
	d)
		dianomi=yes
		;;
	e)
		energia=yes
		;;
	\?)
		echo "${OPTARG}: invalid option" >&2
		errs=yes
		;;
	esac
done

[ -n "${errs}" ] && usage
shift `expr ${OPTIND} - 1`

[ -n "${appdir}" ] && {
	[ -d "${appdir}" ] || fatal "${appdir}: directory not found"
	[ -x "${appdir}" ] || fatal "${appdir}: cannot read directory"
	AWKPATH="${appdir}/metafora" export AWKPATH
}

[ -n "${trapezi}" ] && awk -f trapezi.awk $*
[ -n "${dianomi}" ] && awk -f dianomi.awk $*
[ -n "${energia}" ] && awk -f energia.awk $*
