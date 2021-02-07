USE `prefatria`;

-- Ο πίνακας αποκλεισμών παρτίδας περιέχει τους αποκλεισμούς συγκεκριμένων
-- προσώπων από συγκεκριμένες παρτίδες.

CREATE TABLE `arvila` (
	`trapezi`	INTEGER(10) UNSIGNED NOT NULL COMMENT 'Κωδικός τραπεζιού',
	`apo`		VARCHAR(64) NOT NULL COMMENT 'Παίκτης',
	`pros`		VARCHAR(64) NOT NULL COMMENT 'Αποκλεισμένος',

	UNIQUE INDEX (
		`trapezi`,
		`pros`
	) USING BTREE
)

ENGINE = InnoDB
COMMENT='Πίνακας αποκλεισμών παρτίδας'
;

-- Πίνακας αποκλεισμών παρτίδας ("arvila")

ALTER TABLE `arvila` ADD FOREIGN KEY (
	`trapezi`
) REFERENCES `trapezi` (
	`kodikos`
) ON UPDATE CASCADE ON DELETE CASCADE
;
