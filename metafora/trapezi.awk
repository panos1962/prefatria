@include "util.awk"

BEGIN {
	telioma["ΑΝΙΣΟΡΡΟΠΗ"] = "ΑΝΙΣΟΡΡΟΠΟ"
	telioma["ΔΙΚΑΙΗ"] = "ΔΙΚΑΙΟ"
}

{
	set_onoma()
	if (onoma_prev && (onoma != onoma_prev))
	print_load()
	onoma_prev = onoma

	trapezi = onoma ".trapezi"
	trparam = onoma ".trparam"
}

($1 != "") {
	trapezi_set()
	next
}

{
	next
}

END {
	if (exit_status)
	exit(exit_status)

	print_load()
}

function trapezi_set() {
	if (NF != 11)
	fatal($0 ": λάθος στοιχεία τραπεζιού")

	$1 += 0
	print $1, $10, $2, "ΝΑΙ", $3, "ΝΑΙ", $4, "ΝΑΙ", $11, $11 >trapezi

	$5 += 0
	if ($5 != 50)
	print $1, "ΚΑΣΑ", $5 >trparam

	if ($6 != "NO")
	print $1, "ΠΑΣΟ", "ΝΑΙ" >trparam

	if ($7 != "YES")
	print $1, "ΑΣΟΙ", "ΟΧΙ" >trparam

	if ($8 in telioma)
	print $1, "ΤΕΛΕΙΩΜΑ", telioma[$8] >trparam

	if ($9 != "NO")
	print $1, "ΦΙΛΙΚΗ", "ΝΑΙ" >trparam
}

function print_load() {
	print "LOAD DATA LOCAL INFILE '" onoma_prev ".trapezi' INTO TABLE `trapezi` " \
		"(`kodikos`, `stisimo`, `pektis1`, `apodoxi1`, `pektis2`, `apodoxi2`, " \
		"`pektis3`, `apodoxi3`, `poll`, `arxio`)" >onoma_prev ".trapezi.load"
	print "LOAD DATA LOCAL INFILE '" onoma_prev ".trparam' INTO TABLE `trparam` " \
		"(`trapezi`, `param`, `timi`)" >onoma_prev ".trparam.load"

	print onoma_prev
	fflush()
}
