BEGIN {
	ret = 0
	tcol += 0
}

{
	if (NF < tcol) {
		errmsg("syntax error")
		next
	}

	if ($(tcol) != $(tcol) + 0) {
		errmsg($0 ": λανθασμένος κωδικός παρτίδας")
		next
	}

	print $(tcol) + 0
}

END {
	exit(ret)
}

function errmsg(s) {
	print s >"/dev/stderr"
	ret = 1
}
