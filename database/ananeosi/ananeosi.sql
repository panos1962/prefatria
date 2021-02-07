USE `prefatria`
;

DELETE FROM `prefatria`.`sinedria`
;

DELETE FROM `prefatria`.`trapezi`
;

DELETE FROM `prefatria`.`pektis`
;

LOAD DATA LOCAL INFILE 'pektis.data'
INTO TABLE `prefatria`.`pektis` (
	`login`,
	`egrafi`,
	`onoma`,
	`email`,
	`kodikos`
);

DELETE FROM `prefatria`.`profinfo`
;

LOAD DATA LOCAL INFILE 'profinfo.data'
REPLACE INTO TABLE `prefatria`.`profinfo` (
	`pektis`,
	`sxoliastis`,
	`kimeno`
);

DELETE FROM `prefatria`.`sxesi`
;

LOAD DATA LOCAL INFILE 'sxesi.data'
REPLACE INTO TABLE `prefatria`.`sxesi` (
	`pektis`,
	`sxetizomenos`,
	`sxesi`
);

DELETE FROM `prefatria`.`peparam`
;

LOAD DATA LOCAL INFILE 'peparam.data'
REPLACE INTO TABLE `prefatria`.`peparam` (
	`pektis`,
	`param`,
	`timi`
);

DELETE FROM `prefatria`.`isfora`
;

LOAD DATA LOCAL INFILE 'isfora.data'
REPLACE INTO TABLE `prefatria`.`isfora` (
	`pektis`,
	`imerominia`,
	`poso`
);
