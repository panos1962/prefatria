#!/usr/bin/env bash

progname=`basename "${0}"`

if [ -x /usr/bin/node ]; then
	node="node"
elif [ -x /usr/bin/nodejs ]; then
	node="nodejs"
else
	echo "${progname}: node/nodejs not found" >&2
	exit 2
fi

[ -n "${PREFADOROS}" ] || {
	echo "${PREFADOROS}: PREFADOROS: variable not set" >&2
	exit 2
}

nodetag="`basename ${PREFADOROS}`"
logdir="${PREFADOROS}/log"

cd "${logdir}" 2>/dev/null || {
	echo "${progname}: ${logdir}: directory not found" >&2
	exit 2
}

cd "${PREFADOROS}/skiser" 2>/dev/null || {
	echo "${progname}: ${PREFADOROS}: invalid directory" >&2
	exit 2
}

case $# in
0)
	set -- status
	;;
1)
	;;
*)
	echo "${0} { status | start | stop | restart }" >&2
	exit 1
esac

skiserPid() {
	ps -fC ${node} | awk '$NF == "'${nodetag}'" { print $2 + 0 }'
}

skiserStartup() {
	ts=`date +"%Y%m%d%H%M%S"`
	[ -s "${logdir}/skiser.out" ] && mv "${logdir}/skiser.out" "${logdir}/skiser.out.${ts}"
	[ -s "${logdir}/skiser.err" ] && mv "${logdir}/skiser.err" "${logdir}/skiser.err.${ts}"

	nohup ${node} main.js "${nodetag}" >"${logdir}/skiser.out" 2>"${logdir}/skiser.err" &
	sleep 1
	pid=`skiserPid`
	if [ -z "${pid}" ]; then
		echo "${progname}: skiser startup failed(?)" >&2
		exit 2
	fi
	echo "${pid}"
}

skiserStop() {
	pid=`skiserPid`
	[ -n "${pid}" ] && kill "${pid}" || exit 2
}

case "${1}" in
status)
	ps -fC ${node} | awk -v stat=1 '$NF == "'${nodetag}'" { print; stat = 0; exit } END { exit stat }'
	;;
start)
	pid=`skiserPid`
	if [ -n "${pid}" ]; then
		echo "${progname}: skiser is already runing (${pid})" >&2
		exit 2
	else
		skiserStartup
	fi
	;;
stop)
	pid=`skiserPid`
	if [ -z "${pid}" ]; then
		echo "${progname}: skiser is not runing" >&2
		exit 2
	else
		skiserStop
	fi
	;;
restart)
	pid=`skiserPid`
	[ -n "${pid}" ] && skiserStop; sleep 1
	skiserStartup
	;;
esac
