@load "spawk"
@include "prefadoros"

BEGIN {
	OFS = "\t"
	EOD = "\004"

	strtype["CHAR"]
	strtype["VARCHAR"]
	strtype["TEXT"]
	strtype["TINYTEXT"]
	strtype["MEDIUMTEXT"]
	strtype["LONGTEXT"]
	strtype["ENUM"]

	backup_table("pektis")
	backup_table("peparam")
	backup_table("profinfo")
	backup_table("sxesi")
	backup_table("minima")
}

function backup_table(table,			query, sep, ncol, typ, data, i, s) {
	if (spawk_submit("SELECT `COLUMN_NAME`, UPPER(`DATA_TYPE`) " \
		"FROM `INFORMATION_SCHEMA`.`COLUMNS` " \
		"WHERE `TABLE_NAME` = " spawk_escape(table) " " \
		"ORDER BY `ORDINAL_POSITION`", 1) != 3)
	exit(2)

	print table

	query = "SELECT"
	sep = " "

	for (ncol = 0; spawk_fetchrow(data);) {
		ncol++
		print data[1], typ[ncol] = data[2]
		query = query sep "`" data[1] "`"
		sep = ", "
	}

	print EOD

	query = query " FROM `" table "`"

	if (spawk_submit(query, 1) != 3)
	exit(2)

	while (spawk_fetchrow(data)) {
		sep = ""
		for (i = 1; i <= ncol; i++) {
			printf sep

			if (typ[i] in strtype) {
				s = spawk_escape(data[i], 0)
				gsub(/\t/, "\\t", s)
				printf s
			}

			else
			printf data[i]

			sep = OFS
		}

		print ""
	}

	print EOD
}
