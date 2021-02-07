BEGIN {
	FS = "\t"
	OFS = "\t"
	exit_status = 0
}

function set_onoma() {
	onoma = FILENAME
}

function fatal(msg) {
	exit_status = 2
	print msg >"/dev/stderr"
	exit(2)
}
