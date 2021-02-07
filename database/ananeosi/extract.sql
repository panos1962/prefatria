USE `prefatria`
;

SELECT
	`login`,
	`egrafi`,
	`onoma`,
	`email`,
	`kodikos`
FROM `prefatria`.`pektis`
INTO OUTFILE '/tmp/pektis.data'
;

SELECT
	`pektis`,
	`param`,
	`timi`
FROM `prefatria`.`peparam`
INTO OUTFILE '/tmp/peparam.data'
;

SELECT
	`pektis`,
	`sxoliastis`,
	`kimeno`
FROM `prefatria`.`profinfo`
INTO OUTFILE '/tmp/profinfo.data'
;

SELECT
	`pektis`,
	`sxetizomenos`,
	`sxesi`
FROM `prefatria`.`sxesi`
INTO OUTFILE '/tmp/sxesi.data'
;

SELECT
	`pektis`,
	`imerominia`,
	`poso`
FROM `prefatria`.`isfora`
INTO OUTFILE '/tmp/isfora.data'
;
