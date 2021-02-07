cd "${PREFADOROS:?parameter not set}/stats/www/stisimo" 2>/dev/null

errs=

for i in oles paso oxipaso
do
	[ -d "${i}" ] && continue

	echo "${i}: directory not found" >&2
	errs="yes"
done

elist="${PREFADOROS}/stats/etos.list"
[ -f "${elist}" ] || {
	echo "${elist}: file not found" >&2
	errs="yes"
}

[ -n "${errs}" ] && exit 2

tmp1="/tmp/$$xx1"

cleanup() {
	rm -f ${tmp1}
}

trap "cleanup; exit 2" 1 2 3 15

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

	data="${PREFADOROS}/stats/etos/${etos}.data"

	[ -f "${data}" ] || continue
	[ -s "${data}" ] || continue

	tsv="oles/${etos}.tsv"
	err="oles/${etos}.err"

	nice "${PREFADOROS}/bin/stats" -T -a "${data}" >"${tmp1}" 2>"${err}"
	mv "${tmp1}" "${tsv}"
	[ -s "${err}" ] || rm -f "${err}"

	tsv="paso/${etos}.tsv"
	err="paso/${etos}.err"

	nice "${PREFADOROS}/bin/stats" -T -p "${data}" >"${tmp1}" 2>"${err}"
	mv "${tmp1}" "${tsv}"
	[ -s "${err}" ] || rm -f "${err}"

	tsv="oxipaso/${etos}.tsv"
	err="oxipaso/${etos}.err"

	nice "${PREFADOROS}/bin/stats" -T "${data}" >"${tmp1}" 2>"${err}"
	mv "${tmp1}" "${tsv}"
	[ -s "${err}" ] || rm -f "${err}"
done

cleanup
exit 0
