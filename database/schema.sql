DROP DATABASE IF EXISTS `prefatria`
;

-- Με το παρόν κατασκευάζουμε την database.

CREATE DATABASE `prefatria`
DEFAULT CHARSET = utf8mb4
DEFAULT COLLATE = utf8mb4_general_ci
;

\! echo "database created!"

-- Καθιστούμε τρέχουσα την database που μόλις κατασκευάσαμε.

USE `prefatria`;

-- Ακυρώνουμε προσωρινά τα foreign key checks, όχι επειδή είναι απαραίτητο,
-- αλλά επειδή σε κάποιες μηχανές προκαλείται κάποια εμπλοκή.

SET FOREIGN_KEY_CHECKS = 0;

\! echo "creating tables…"

-- Ο πίνακας "pektis" είναι ο σημαντικότερος πίνακας της εφαρμογής και περιέχει
-- τους χρήστες του «Πρεφαδόρου».

CREATE TABLE `pektis` (
	`login`		VARCHAR(64) NOT NULL COMMENT 'Login name',
	`egrafi`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ημερομηνία εγγραφής',
	`onoma`		VARCHAR(128) NOT NULL COMMENT 'Πλήρες όνομα παίκτη',
	`email`		VARCHAR(128) NULL DEFAULT NULL COMMENT 'e-mail address',

	-- Το password αποθηκεύεται σε SHA1 κρυπτογραφημένη μορφή.

	`kodikos`	CHARACTER(40) COLLATE utf8_bin NOT NULL COMMENT 'Password',

	-- Θα μπορούσε να είναι current timestamp, αλλά έχω ήδη ένα τέτοιο πεδίο
	-- και η MySQL δεν επιτρέπει δεύτερο. Λύνεται με trigger.

	`poll`		TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Τελευταία προσπέλαση του παίκτη',

	PRIMARY KEY (
		`login`
	) USING BTREE,

	INDEX (
		`onoma`
	) USING BTREE,

	INDEX (
		`email`
	) USING BTREE
)

ENGINE = InnoDB
COMMENT = 'Πίνακας παικτών'
;

-- Στον πίνακα "peparam" κρατάμε στοιχεία και χαρακτηριστικά που αφορούν στους χρήστες,
-- π.χ. αν ο παίκτης είναι επόπτης πρέπει να βρούμε μια παράμετρο με κλειδί τη
-- λέξη "ΑΞΙΩΜΑ" και τιμή "ΕΠΟΠΤΗΣ", αν κάποιος χρήστης έχει επιλέξει ως background
-- το "tetragona.jpg" θα πρέπει να υπάρχει παράμετρος με κλειδί τη λέξη "ΠΑΡΑΣΚΗΝΙΟ"
-- και τιμή "tetragona.jpg" κλπ.
--
--	ΑΞΙΩΜΑ		ΘΑΜΩΝΑΣ
--			VIP
--			ΕΠΟΠΤΗΣ
--			ΔΙΑΧΕΙΡΙΣΤΗΣ
--			ADMINISTRATOR
--			ΠΡΟΕΔΡΟΣ
--
--	ΚΑΤΑΣΤΑΣΗ	ΔΙΑΘΕΣΙΜΟΣ
--			ΑΠΑΣΧΟΛΗΜΕΝΟΣ
--
--	ΠΛΑΤΗ		ΜΠΛΕ
--			ΚΟΚΚΙΝΟ
--			ΤΥΧΑΙΟ
--
--	ΠΑΡΑΣΚΗΝΙΟ	standard.png
--			any filename in "images/paraskinio"
--			or external images starting with "http[s]://"
--
--	BLOCKIMAGE	ΟΧΙ
--			ΝΑΙ
--
--	MOVIETIME	ΜΕΤΡΟΝΟΜΟΣ
--			ΠΡΑΓΜΑΤΙΚΟΣ
--
--	MOVIESCALE	1000
--			milliseconds per second
--
--	ΑΣΟΙ		ΝΑΙ
--			ΟΧΙ
--
--	ΠΑΣΟ		ΟΧΙ
--			ΝΑΙ
--
--	ΤΕΛΕΙΩΜΑ	ΚΑΝΟΝΙΚΟ
--			ΑΝΙΣΟΡΡΟΠΟ
--			ΔΙΚΑΙΟ
--
--	ΤΡΑΠΟΥΛΑ	Σετ παιγνιοχάρτων
--
--	SOUNDFILOS	deskbell.ogg
--			any sound file in "sounds" directory
--
--	SOUNDTHEATIS	tinybell.ogg
--			any sound file in "sounds" directory
--
--	DEVELOPER	ΟΧΙ
--			ΝΑΙ
--
--	ΑΝΕΡΓΟΣ		ΟΧΙ
--			ΝΑΙ
--
--	ΕΠΙΔΟΤΗΣΗ	ΟΧΙ
--			ΝΑΙ
--
--	ΒΑΘΜΟΛΟΓΙΑ	κάποιο string που δείχνει την αξιολόγηση τού
--			παίκτη με καποιον τρόπο που προς το παρόν είναι
--			ασαφής. XXX
--
-- Ακολουθεί ανάλυση των παραμέτρων.
--
-- DEVELOPER
-- ---------
-- Η παράμετρος "DEVELOPER" τίθεται στους προγραμματιστές που αναπτύσσουν και
-- συντηρούν το πρόγραμμα. Με αυτήν την παράμετρο ενεργοποιούνται διάφορες
-- λειτουργίες που είναι χρήσιμες στους προγραμματιστές, π.χ. πλήκτρο για τον
-- έλεγχο των διαρροών μνήμης.

CREATE TABLE `peparam` (
	`pektis`	VARCHAR(64) NOT NULL COMMENT 'Παίκτης',
	`param`		VARCHAR(32) NOT NULL COMMENT 'Παράμετρος',
	`timi`		TEXT(32768) NOT NULL COMMENT 'Τιμή παραμέτρου',

	PRIMARY KEY (
		`pektis`,
		`param`
	) USING BTREE
)

ENGINE = InnoDB
COMMENT = 'Παράμετροι παικτών'
;

-- Στον πίνακα "profinfo" περιέχονται πληροφορίες που αφορούν τους παίκτες.
-- Το πεδίο "pektis" είναι ο παίκτης στον οποίο αφορά η πληροφορία, ενώ το
-- πεδίο "sxoliastis" είναι ο συντάκτης.
--
-- Οι πληροφορία που δίνει ο παίκτης για τον εαυτό του είναι δημόσια, ενώ
-- όλες οι υπόλοιπες πληροφορίες είναι προσβάσιμες μόνο από τον εκάστοτε
-- σχολιαστή.

CREATE TABLE `profinfo` (
	`pektis`	VARCHAR(64) NOT NULL COMMENT 'Παίκτης',
	`sxoliastis`	VARCHAR(64) NOT NULL COMMENT 'Σχολιαστής',
	`kimeno`	TEXT(32768) NOT NULL COMMENT 'Κείμενο παρατήρησης',

	PRIMARY KEY (
		`pektis`,
		`sxoliastis`
	) USING BTREE,

	INDEX (
		`sxoliastis`
	) USING HASH
)

ENGINE = InnoDB
COMMENT = 'Πίνακας πληροφοριών προφίλ παίκτη'
;

-- Ο πίνακας "sxesi" περιέχει τις σχέσεις μεταξύ των παικτών. Η πληροφορία είναι
-- προσβάσιμη μόνο από τον παίκτη που καθορίζει τη σχέση.

CREATE TABLE `sxesi` (
	`pektis`	VARCHAR(64) NOT NULL COMMENT 'Login name του παίκτη',
	`sxetizomenos`	VARCHAR(64) NOT NULL COMMENT 'Login name του σχετιζόμενου παίκτη',
	`sxesi`	ENUM (
		'ΦΙΛΟΣ',
		'ΑΠΟΚΛΕΙΣΜΕΝΟΣ'
	) NOT NULL COMMENT 'Είδος σχέσης',
	`pote`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ημερομηνία δημιουργίας',

	PRIMARY KEY (
		`pektis`,
		`sxetizomenos`
	) USING BTREE,

	INDEX (
		`sxetizomenos`
	) USING HASH
)

ENGINE = InnoDB
COMMENT = 'Πίνακας σχέσεων'
;

-- Ο πίνακας "minima" περιέχει την αλληλογραφία των παικτών. Πράγματι, οι παίκτες,
-- εκτός από την άμεση επικοινωνία μέσω του chat, μπορούν να επικοινωνούν και με
-- προσωπικά μηνύματα τα οποία αποστέλλουν ο ένας στον άλλον.

CREATE TABLE `minima` (
	`kodikos`	INTEGER(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
	`apostoleas`	VARCHAR(64) NOT NULL COMMENT 'Αποστολέας',
	`paraliptis`	VARCHAR(64) NOT NULL COMMENT 'Παραλήπτης',
	`kimeno`	TEXT(32768) NOT NULL COMMENT 'Κείμενο μηνύματος',
	`pote`		TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ημερομηνία αποστολής',
	`status`	ENUM (
		'ΑΔΙΑΒΑΣΤΟ',
		'ΔΙΑΒΑΣΜΕΝΟ',
		'ΚΡΑΤΗΜΕΝΟ'
	) NOT NULL DEFAULT 'ΑΔΙΑΒΑΣΤΟ' COMMENT 'Κατάσταση μηνύματος',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE,

	INDEX (
		`apostoleas`
	) USING HASH,

	INDEX (
		`paraliptis`
	) USING HASH
)

ENGINE = InnoDB
COMMENT = 'Πίνακας μηνυμάτων αλληλογραφίας'
;

-- Ο πίνακας "trapezi" είναι ο σημαντικότερος πίνακας της εφαρμογής μετά τον πίνακα
-- "pektis". Ο πίνακας περιέχει όλα τα ενεργά τραπέζια καθώς και όλα τα τραπέζια που
-- δημιουργήθηκαν κατά καιρούς και στα οποία μοιράστηκε έστω μια διανομή. Το πεδίο
-- "arxio" είναι πολύ σημαντικό και δείχνει ποια από τα τραπέζια είναι ενεργά και
-- ποια έχουν αρχειοθετηθεί. Τα τραπέζια στα οποία το πεδίο "arxio" είναι null είναι
-- ενεργά, ενώ στα τραπέζια που το πεδίο είναι συμπληρωμένο δείχνει τη στιγμή της
-- αρχειοθέτησής τους, δηλαδή τη στιγμή που και ο τελευταίος παίκτης του τραπεζιού
-- εγκατέλειψε το τραπέζι.
--
-- Τα τραπέζια μπορούν, όμως, να αρχειοθετηθούν ακόμη και όταν υπάρχουν παίκτες
-- εφόσον έχει περάσει αρκετός χρόνος χωρίς κάποιος παίκτης του τραπεζιού να έχει
-- επαφή με τον server.

CREATE TABLE `trapezi` (
	`kodikos`	INTEGER(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
	`stisimo`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Πότε δημιουργήθηκε',

	`pektis1`	VARCHAR(64) NULL DEFAULT NULL COMMENT 'Πρώτος παίκτης',
	`apodoxi1`	ENUM(
		'ΟΧΙ',
		'ΝΑΙ'
	) NOT NULL DEFAULT 'ΟΧΙ' COMMENT 'Αποδοχή όρων από τον πρώτο παίκτη',

	`pektis2`	VARCHAR(64) NULL DEFAULT NULL COMMENT 'Δεύτερος παίκτης',
	`apodoxi2`	ENUM(
		'ΟΧΙ',
		'ΝΑΙ'
	) NOT NULL DEFAULT 'ΟΧΙ' COMMENT 'Αποδοχή όρων από τον δεύτερο παίκτη',

	`pektis3`	VARCHAR(64) NULL DEFAULT NULL COMMENT 'Τρίτος παίκτης',
	`apodoxi3`	ENUM(
		'ΟΧΙ',
		'ΝΑΙ'
	) NOT NULL DEFAULT 'ΟΧΙ' COMMENT 'Αποδοχή όρων από τον τρίτο παίκτη',

	-- Για νέα τραπέζια θα πρέπει να τίθεται current timestamp, αλλά δεν
	-- επιτρέπει η MySQL. Λύνεται με trigger.

	`poll`		TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Last poll time',

	`arxio`		TIMESTAMP NULL DEFAULT NULL COMMENT 'Αρχειοθέτηση τραπεζιού',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE,

	INDEX (
		`pektis1`
	) USING HASH,

	INDEX (
		`pektis2`
	) USING HASH,

	INDEX (
		`pektis3`
	) USING HASH,

	INDEX (
		`stisimo`
	) USING BTREE,

	INDEX (
		`arxio`
	) USING BTREE
)

ENGINE = InnoDB
COMMENT = 'Πίνακας τραπεζιών'
;

-- Στον πίνακα "trparam" κρατάμε στοιχεία και χαρακτηριστικά που αφορούν στο
-- τραπέζι και στην παρτίδα που εξελίσσεται στο τραπέζι, π.χ. την κάσα της
-- παρτίδας, το αν το τραπέζι είναι δημόσιο ή πριβέ κλπ.
--
--	ΚΑΣΑ		50
--			οποιαδήποτε άλλη αριθμητική τιμή
--
--	ΑΣΟΙ		ΝΑΙ
--			ΟΧΙ
--
--	ΠΑΣΟ		ΟΧΙ
--			ΝΑΙ
--
--	ΤΕΛΕΙΩΜΑ	ΚΑΝΟΝΙΚΟ
--			ΑΝΙΣΟΡΡΟΠΟ
--			ΔΙΚΑΙΟ
--
--	ΠΡΙΒΕ		ΟΧΙ
--			ΝΑΙ
--
--	ΑΝΟΙΚΤΟ		ΝΑΙ
--			ΟΧΙ
--
--	ΦΙΛΙΚΗ		ΟΧΙ
--			ΝΑΙ
--
--	ΙΔΙΟΚΤΗΤΟ	ΟΧΙ
--			ΝΑΙ
--
--	ΑΟΡΑΤΟ		ΟΧΙ
--			ΝΑΙ
--
--	ΤΟΥΡΝΟΥΑ	ΟΧΙ
--			ΝΑΙ
--
--	ΕΠΕΤΕΙΑΚΗ	(nil)
--			Περιγραφή επετείου
--
-- ΑΟΡΑΤΟ
-- ======
-- Η παράμετρος "ΑΟΡΑΤΟ" δείχνει αν το τραπέζι είναι αόρατο. Τα αόρατα τραπέζια
-- δεν εμφανίζονται στο καφενείο, οπότε ο μόνος τρόπος να τα προσπελάσει κανείς
-- είναι μέσω προσκλήσεως. Αν υπάρχουν θεατές στο τραπέζι τότε και οι θεατές τού
-- τραπεζιού καθίστανται αόρατοι.
--
-- ΙΔΙΟΚΤΗΤΟ
-- =========
-- Η παράμετρος "ΙΔΙΟΚΤΗΤΟ" δείχνει αν το τραπέζι είναι ιδιόκτητο ή όχι. Αν το
-- τραπέζι είναι ιδιόκτητο, τότε μόνο ο δημιουργός μπορεί να θέσει ή να αλλάξει
-- διάφορες παραμέτρους του τραπεζιού. Επίσης, είναι ο μόνος που μπορεί να
-- προσκαλέσει η να αποκλείσει θεατές και συμπαίκτες, με λίγα λόγια στα
-- ιδιόκτητα τραπέζια ο δημιουργός είναι ο απόλυτος κυρίαρχος των παραμέτρων
-- του παιχνιδιού. Δημιουργός θεωρείται ο παίκτης που βρίσκεται στη θέση 1.
--
-- ΤΕΛΕΙΩΜΑ
-- ========
-- Το πεδίο "ΤΕΛΕΙΩΜΑ" δείχνει πώς θα πληρωθεί η τελευταία αγορά της παρτίδας.
-- Υπάρχουν τρεις τρόποι πληρωμής:
--
-- ΚΑΝΟΝΙΚΟ (συμβολίζεται με το αχλάδι)
-- ------------------------------------
-- Η τελευταία αγορά πληρώνεται με αξία προσαρμοσμένη στο υπόλοιπο της κάσας.
-- Αν, π.χ. υπάρχουν 20 καπίκια στην κάσα και γίνει αγορά στις απλές κούπες,
-- τότε η αξία των μπαζών δεν λογίζεται προς 5 καπίκια/μπάζα, αλλά προς
-- 2 καπίκια/μπάζα. Αυτός είναι ο ενδεδειγμένος τρόπος πληρωμής.
--
-- ΑΝΙΣΟΡΡΟΠΟ (συμβολίζεται με την πιπεριά)
-- ----------------------------------------
-- Η τελευταία αγορά πληρώνεται με αξία προσαρμοσμένη στο υπόλοιπο της κάσας,
-- εκτός και αν η αγορά μπει μέσα είτε από τον τζογαδόρο είτε από τους αμυνόμενους.
-- Αν, λοιπόν, η αγορά μπει μέσα, τότε η πληρωμή γίνεται με βάση την πραγματική
-- αξία της αγοράς. Ο τρόπος αυτός είναι ανισόρροπος, καθώς το διακύβευμα
-- μπορεί να είναι μικρό, ενώ το ρίσκο μεγάλο.
--
-- ΔΙΚΑΙΟ (συμβολίζεται με την ντομάτα)
-- ------------------------------------
-- Η τελευταία αγορά πληρώνεται με την πραγματική αξία της αγοράς είτε επαρκεί
-- το υπόλοιπο της κάσας, είτε όχι. Σε περίπτωση που δεν επαρκεί το υπόλοιπο
-- της κάσας, παρουσιάζεται αρνητικό υπόλοιπο κάσας και είναι σαν να προστέθηκε
-- λίγη επιπλέον κάσα από όλους τους παίκτες ώστε να επαρκεί για την πληρωμή.
-- Ο τρόπος αυτός είναι πατέντα του «Πρεφαδόρου» και δεν διαφοροποιεί καθόλου
-- την τελευταία αγορά από τις προηγούμενες αγορές.
--
-- ΠΡΙΒΕ
-- =====
-- Η παράμετρος "ΠΡΙΒΕ" αφορά στην πρόσβαση των υπολοίπων παικτών στο
-- τραπέζι. Αν το τραπέζι είναι δημόσιο, τότε οποιοσδήποτε μπορεί να εισέλθει
-- ως θεατής στο τραπέζι, ενώ αν είναι πριβέ, τότε απαιτείται πρόσκληση.
-- Για συμμετοχή στο παιχνίδι, ή στη συζήτηση του τραπεζιού, απαιτείται
-- πρόσκληση είτε το τραπέζι είναι δημόσιο, είτε όχι.
--
-- ΑΝΟΙΚΤΟ
-- =======
-- Η παράμετρος "ΑΝΟΙΚΤΟ" αφορά στο δικαίωμα των θεατών να βλέπουν τα φύλλα
-- των παικτών.

CREATE TABLE `trparam` (
	`trapezi`	INTEGER(10) UNSIGNED NOT NULL COMMENT 'Τραπέζι',
	`param`		VARCHAR(32) NOT NULL COMMENT 'Παράμετρος',
	`timi`		TEXT(32768) NOT NULL COMMENT 'Τιμή παραμέτρου',

	PRIMARY KEY (
		`trapezi`,
		`param`
	) USING BTREE
)

ENGINE = InnoDB
COMMENT = 'Παράμετροι τραπεζιών'
;

-- Ο πίνακας "simetoxi" περιέχει εγγραφές που δείχνουν την τελευταία θέση που
-- κατείχαν ή παρακολουθούσαν οι παίκτες στα τραπέζια στα οποία συμμετείχαν
-- είτε ως παίκτες, είτε ως θεατές.
--
-- Πρόκειται για βοηθητικό πίνακα ο οποίος εξυπηρετεί μόνον τρέχουσες ανάγκες
-- αναφοράς όσο το τραπέζι είναι ενεργό. Μόλις το τραπέζι αρχειοθετηθεί, τα
-- στοιχεία του πίνακα "simetoxi" για το εν λόγω τραπέζι καθίστανται άχρηστα
-- και πρέπει να διαγραφούν.
--
-- Ουσιαστικά ο πίνακας χρησιμεύει στο να γνωρίζουμε σε ποια θέση συμμετείχε
-- κάποιος παίκτης σε κάποιο τραπέζι την τελευταία φορά που συμμετείχε στο
-- συγκεκριμένο τραπέζι, δηλαδή δίνουμε τραπέζι και παίκτη και επιστρέφεται
-- η θέση στην οποία συμμετείχε την τελευταία φορά σ' αυτό το τραπέζι.

CREATE TABLE `simetoxi` (
	`trapezi`	INTEGER(10) UNSIGNED NOT NULL COMMENT 'Κωδικός τραπεζιού',
	`pektis`	VARCHAR(64) NULL DEFAULT NULL COMMENT 'Login name παίκτη/θεατή',
	`thesi`		TINYINT(1) NOT NULL COMMENT 'Αριθμός θέσης',

	UNIQUE (
		`trapezi`,
		`pektis`
	) USING BTREE
)

ENGINE = InnoDB
COMMENT = 'Πίνακας συμμετοχών'
;

-- Ο πίνακας "telefteos" περιέχει εγγραφές που δείχνουν ποιος παίκτης κάθησε
-- τελευταίος σε κάθε θέση του τραπεζιού.
--
-- Πρόκειται για βοηθητικό πίνακα ο οποίος εξυπηρετεί μόνον τρέχουσες ανάγκες
-- αναφοράς όσο το τραπέζι είναι ενεργό. Μόλις το τραπέζι αρχειοθετηθεί, τα
-- στοιχεία του πίνακα "telefteos" για το εν λόγω τραπέζι καθίστανται άχρηστα
-- και πρέπει να διαγραφούν.
--
-- Ουσιαστικά ο πίνακας χρησιμεύει στο να γνωρίζουμε ποιος κάθισε τελευταίος
-- ως παίκτης σε κάθε θέση του τραπεζιού, δηλαδή δίνουμε τραπέζι και θέση και
-- επιστρέφεται ο παίκτης που κάθισε τελευταίος στη συγκεκριμένη θέση.

CREATE TABLE `telefteos` (
	`trapezi`	INTEGER(10) UNSIGNED NOT NULL COMMENT 'Κωδικός τραπεζιού',
	`thesi`		TINYINT(1) NOT NULL COMMENT 'Αριθμός θέσης',
	`pektis`	VARCHAR(64) NULL DEFAULT NULL COMMENT 'Login name παίκτη',

	PRIMARY KEY (
		`trapezi`,
		`thesi`
	) USING BTREE,

	INDEX (
		`pektis`
	) USING HASH
)

ENGINE = InnoDB
COMMENT = 'Πίνακας τελευταίων παικτών τραπεζιού'
;

-- Ο πίνακας προσκλήσεων περιέχει τις προσκλήσεις που αποστέλλονται μεταξύ
-- των παικτών. Για να παίξει κάποιος παίκτης σε κάποιο τραπέζι πρέπει να
-- λάβει πρόσκληση από κάποιον από τους ήδη υπάρχοντες παίκτες. Πρόσκληση,
-- επίσης, χρειάζεται κάποιος για να παρακολουθήσει σε πριβέ τραπέζι.
--
-- Ο πίνακας δεν χρήζει primary key καθώς υπάρχει μοναδικός συνδυασμός
-- πεδίων που θα μπορούσε να εξυπηρετήσει ως primary key, αλλά η εισαγωγή
-- ξέχωρου αριθμητικού primary key διευκολύνει κατά πολύ αρκετούς χειρισμούς.

CREATE TABLE `prosklisi` (
	`kodikos`	INTEGER(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
	`trapezi`	INTEGER(10) UNSIGNED NOT NULL COMMENT 'Κωδικός τραπεζιού',
	`apo`		VARCHAR(64) NOT NULL COMMENT 'Οικοδεσπότης',
	`pros`		VARCHAR(64) NOT NULL COMMENT 'Προσκεκλημένος',
	`epidosi`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Πότε επιδόθηκε',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE,

	UNIQUE INDEX (
		`trapezi`,
		`apo`,
		`pros`
	) USING BTREE,

	INDEX (
		`apo`
	) USING HASH,

	INDEX (
		`pros`
	) USING HASH
)

ENGINE = InnoDB
COMMENT='Πίνακας προσκλήσεων'
;

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

-- Ο πίνακας "sizitisi" περιέχει όλα τα σχόλια των συζητήσεων που εξελίσσονται
-- στα τραπέζια ή στο καφενείο.

CREATE TABLE `sizitisi` (
	`kodikos`	INTEGER(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
	`pektis`	VARCHAR(64) NOT NULL COMMENT 'Ομιλών παίκτης',

	-- Αν ο κωδικός τραπεζιού είναι κενός, τότε πρόκειται για σχόλιο
	-- που αφορά στη συζήτηση του καφενείου.

	`trapezi`	INTEGER(10) UNSIGNED NULL COMMENT 'Κωδικός τραπεζιού',

	`sxolio`	TEXT(32768) NOT NULL COMMENT 'Κείμενο σχολίου',
	`pote`		TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Πότε ειπώθηκε',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE,

	INDEX (
		`pektis`
	) USING HASH,

	INDEX (
		`trapezi`
	) USING HASH
)

ENGINE = InnoDB
COMMENT = 'Πίνακας συζητήσεων'
;

-- Με το παρόν κατασκευάζουμε τον πίνακα των διανομών. Κάθε τραπέζι έχει πολλές
-- διανομές που απαρτίζουν την παρτίδα που παίχτηκε στο τραπέζι και κάθε διανομή
-- έχει πολλές ενέργειες που είναι όλες οι κινήσεις που γίνονται στη διανομή:
-- μοίρασμα, δηλώσεις, αγορά κλπ. Η διανομή περιέχει ουσιαστικά τη θέση του παίκτη
-- που μοίρασε και τα οικονομικά στοιχεία της διανομής, δηλαδή αυξομειώσεις κάσας
-- και καπικίων. Τα οικονομικά στοιχεία συμπληρώνονται, βεβαίως, κατά το τέλος
-- της διανομής.

CREATE TABLE `dianomi` (
	`kodikos`	INTEGER(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
	`trapezi`	INTEGER(10) UNSIGNED NOT NULL COMMENT 'Κωδικός τραπεζιού',
	`enarxi`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Μοίρασμα διανομής',

	-- Η θέση του παίκτη που μοιράζει. Παίρνει τιμές 1, 2, και 3, εναλλάξ
	-- και στην πρώτη διανομή τού τραπεζιού παίρνει την τιμή 1.

	`dealer`	TINYINT(1) NOT NULL COMMENT 'Ποιος μοιράζει',

	-- Τα πεδία "kasa1" και "metrita1" συμπληρώνονται με το τέλος της διανομής
	-- και περιέχουν τα καπίκια που παίρνει ή δίνει ο παίκτης από τη συγκεκριμένη
	-- διανομή. Το πεδίο "kasa1" περιέχει τα καπίκια που παίρνει από την κάσα,
	-- εκτός και αν είναι αρνητικό οπότε τα βάζει στην κάσα (μέσα). Το πεδίο
	-- "metrita1" είναι τα καπίκια που παίρνει από τους άλλους παίκτες ή,
	-- εφόσον είναι αρνητικό, δίνει στους άλλους παίκτες. Παρόμοια είναι και
	-- τα πεδία "kasa2", "metrita2", "kasa3" και "metrita3". Για να γίνει
	-- κατανοητό το πώς ακριβώς λειτουργούν τα εν λόγω πεδία θα δώσουμε
	-- μερικά παραδείγματα:
	--
	-- Παράδειγμα 1
	-- ------------
	-- Ας υποθέσουμε ότι ο παίκτης 2 έκανε αγορά 6 κούπες και ότι οι παίκτες 1 και 3
	-- πήραν 3 και 1 μπάζα αντίστοιχα, οπότε η αγορά έχει "βγεί". Τα εν λόγω πεδία
	-- διαμορφώνονται ως εξής:
	--
	--	kasa1		15	(πήρε 3 Χ 5 = 15 καπίκια από την κάσα)
	--	metrita1	0	(δεν υπάρχει πάρε δώσε μετρητών)
	--	kasa2		30	(πήρε 6 Χ 5 = 30 καπίκια από την κάσα)
	--	metrita2	0	(δεν υπάρχει πάρε δώσε μετρητών)
	--	kasa3		5	(πήρε 1 Χ 5 = 5 καπίκια από την κάσα)
	--	metrita3	0	(δεν υπάρχει πάρε δώσε μετρητών)
	--
	-- Παράδειγμα 2
	-- ------------
	-- Ας υποθέσουμε ότι ο παίκτης 3 έκανε αγορά 7 χωρίς ατού και ότι ο παίκτης 2
	-- πήρε 2 μπάζες, ενώ ο παίκτης 1 δεν έπαιξε. Η αγορά έχει "βγεί" και τα
	-- καπίκια έχουν ως εξής:
	--
	--	kasa1		0	(δεν υπάρχει πάρε δώσε με την κάσα)
	--	metrita1	0	(δεν υπάρχει πάρε δώσε μετρητών)
	--	kasa2		16	(πήρε 2 Χ 8 = 16 καπίκια από την κάσα)
	--	metrita2	0	(δεν υπάρχει πάρε δώσε μετρητών)
	--	kasa3		64	(πήρε 8 Χ 8 = 64 καπίκια από την κάσα)
	--	metrita3	0	(δεν υπάρχει πάρε δώσε μετρητών)
	--
	-- Παράδειγμα 3
	-- ------------
	-- Ας υποθέσουμε ότι ο παίκτης 1 έκανε αγορά 7 μπαστούνια και ότι οι παίκτες 2
	-- και 3 πήραν 2 και 2 μπάζες αντίστοιχα. Ο τζογαδόρος έχει μπεί απλά μέσα
	-- και τα καπίκια έχουν ως εξής:
	--
	--	kasa1		-70	(βάζει όλο το ποσό της αγοράς στην κάσα)
	--	metrita1	28	(δίνει (2 + 2) Χ 7 στους δύο αντιπάλους)
	--	kasa2		0	(δεν έχει πάρε δώσε με την κάσα)
	--	metrita2	14	(παίρνει 2 Χ 7 = 14 καπίκια μετρητά)
	--	kasa3		0	(δεν έχει πάρε δώσε με την κάσα)
	--	metrita3	14	(παίρνει 2 Χ 7 = 14 καπίκια μετρητά)

	`kasa1`		INTEGER(3) NOT NULL DEFAULT 0 COMMENT 'Καπίκια κάσας πρώτου παίκτη',
	`metrita1`	INTEGER(3) NOT NULL DEFAULT 0 COMMENT 'Καπίκια μετρητά πρώτου παίκτη',

	`kasa2`		INTEGER(3) NOT NULL DEFAULT 0 COMMENT 'Καπίκια κάσας δεύτερου παίκτη',
	`metrita2`	INTEGER(3) NOT NULL DEFAULT 0 COMMENT 'Καπίκια μετρητά δεύτερου παίκτη',

	`kasa3`		INTEGER(3) NOT NULL DEFAULT 0 COMMENT 'Καπίκια κάσας τρίτου παίκτη',
	`metrita3`	INTEGER(3) NOT NULL DEFAULT 0 COMMENT 'Καπίκια μετρητά τρίτου παίκτη',

	-- Το πεδίο "telos" είναι το timestamp του τέλους τής διανομής, δηλαδή τής
	-- στιγμής τής πληρωμής. Όσο το πεδίο "telos" παραμένει null, η διανομή
	-- βρίσκεται σε εξέλιξη.

	`telos`		TIMESTAMP NULL DEFAULT NULL COMMENT 'Τέλος διανομής',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE,

	INDEX (
		`trapezi`
	) USING HASH
)

ENGINE = InnoDB
COMMENT = 'Πίνακας διανομών'
;

-- Ο πίνακας "energia" περιέχει τις ενέργειες που γίνονται στα τραπέζια. Κάθε ενέργεια
-- εντάσσεται στα πλαίσια μιας διανομής και κάθε διανομή εντάσσεται σε κάποιο τραπέζι.

CREATE TABLE `energia` (
	`kodikos`	INTEGER(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
	`dianomi`	INTEGER(10) UNSIGNED NOT NULL COMMENT 'Κωδικός διανομής',

	-- Η θέση του παίκτη που αφορά στη συγκεκριμένη ενέργεια, π.χ. σε ενέργεια
	-- τύπου "ΔΙΑΝΟΜΗ" είναι ο dealer, σε ενέργεια τύπου "ΑΓΟΡΑ" είναι ο
	-- τζογαδόρος κλπ.

	`pektis`	TINYINT(1) NOT NULL COMMENT 'Θέση παίκτη που εκτελεί την ενέργεια',

	`idos`	ENUM (
		'ΔΙΑΝΟΜΗ',
		'ΔΗΛΩΣΗ',
		'FLOP',
		'ΤΖΟΓΟΣ',
		'ΣΟΛΟ',
		'ΑΓΟΡΑ',
		'ΣΥΜΜΕΤΟΧΗ',
		'ΦΥΛΛΟ',
		'CLAIM',
		'ΠΑΡΑΙΤΗΣΗ'
	) NOT NULL COMMENT 'Είδος ενέργειας',

	-- Το πεδίο "data" περιέχει τα δεδομένα της ενέργειας και έχουν συγκεκριμένο
	-- συντακτικό και περιεχόμενο, ανάλογα με το είδος της ενέργειας, π.χ.
	-- σε είδος ενέργειας "ΔΙΑΝΟΜΗ" είναι τα φύλλα των παικτών 1, 2 και 3 με
	-- αυτή τη σειρά και ακολουθούν τα φύλα του τζόγου, επομένως πρόκειται
	-- για string 64 χαρακτήρων. Αν το είδος της ενέργειας είναι "ΑΓΟΡΑ", τότε
	-- τα δεδομένα της ενέργειας είναι η αγορά συνοδευόμενη από τα φύλλα τού
	-- τζογαδόρου, επομένως πρόκειται για string 23 χαρακτήρων.
	--
	-- Παραθέτουμε δείγματα από διάφορα είδη ενεργειών:
	--
	--	ΔΙΑΝΟΜΗ		HKCKDAS9CQDJSTHTSACTHAC7C9S7H8SKC8CADTH7HJHQD9S8CJD7SJH9DQDKSQD8
	--	ΔΗΛΩΣΗ		DS6
	--	FLOP		CJH7
	--	ΤΖΟΓΟΣ		CJH7
	--	ΣΟΛΟ
	--	ΑΓΟΡΑ		NH6SQD7DTDJDACJH7HTHKHA
	--	ΣΥΜΜΕΤΟΧΗ	ΠΑΙΖΩ
	--	ΦΥΛΛΟ		H9
	--	ΜΠΑΖΑ
	--	CLAIM
	--	ΑΚΥΡΩΣΗ
	--	ΠΛΗΡΩΜΗ		0:0:0:20:50:-20

	`data`		VARCHAR(1024) NOT NULL COMMENT 'Δεδομένα ενέργειας',

	`pote`		TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Χρονική στιγμή',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE,

	INDEX (
		`dianomi`
	) USING HASH
)

ENGINE = InnoDB
COMMENT ='Πίνακας ενεργειών'
;

-- Ο πίνακας "akirosi" μοιάζει με τον πίνακα "energia" και περιέχει τις ακυρωμένες
-- ενέργειες.

CREATE TABLE `akirosi` (
	`kodikos`	INTEGER(10) UNSIGNED NOT NULL COMMENT 'Primary key',
	`dianomi`	INTEGER(10) UNSIGNED NOT NULL COMMENT 'Κωδικός διανομής',
	`pektis`	TINYINT(1) NOT NULL COMMENT 'Θέση παίκτη που εκτέλεσε την ενέργεια',
	`akirotis`	TINYINT(1) NOT NULL COMMENT 'Θέση παίκτη που ακύρωσε την ενέργεια',
	`idos`	ENUM (
		'ΔΙΑΝΟΜΗ',
		'ΔΗΛΩΣΗ',
		'FLOP',
		'ΤΖΟΓΟΣ',
		'ΣΟΛΟ',
		'ΑΓΟΡΑ',
		'ΣΥΜΜΕΤΟΧΗ',
		'ΦΥΛΛΟ',
		'CLAIM',
		'ΠΑΡΑΙΤΗΣΗ'
	) NOT NULL COMMENT 'Είδος ακυρωμένης ενέργειας',
	`data`		VARCHAR(1024) NOT NULL COMMENT 'Δεδομένα ακυρωμένης ενέργειας',
	`pote`		TIMESTAMP NOT NULL COMMENT 'Χρονική στιγμή ενέργειας',

	INDEX (
		`dianomi`
	) USING HASH
)

ENGINE = InnoDB
COMMENT ='Πίνακας ακυρωμένων ενεργειών'
;

-- Ο πίνακας "sinedria" περιέχει τους ενεργούς παίκτες. Για κάθε χρήστη που εισέρχεται
-- στο καφενείο δημιουργείται ένα record συνεδρίας και με βάση το record αυτό γίνεται
-- η περαιτέρω επικοινωνία του χρήστη με τον server.
--
-- Όταν η συνεδρία λήξει, τότε αρχειοθετείται στον πίνακα "istoriko". Η λήξη μιας
-- συνεδρίας γίνεται είτε όταν ο παίκτης εξέλθει ρητά από το καφενείο, είτε όταν
-- περάσει αρκετός χρόνος χωρίς επαφή του χρήστη με τον server.

CREATE TABLE `sinedria` (
	-- Κάθε συνεδρία έχει ως πρωτεύον στοιχείο της το login name τού παίκτη,
	-- το οποίο μάλιστα χρησιμοποιείται ως primary key.

	`pektis`	VARCHAR(64) NOT NULL COMMENT 'Παίκτης',

	-- Το πεδίο "klidi" είναι string 10 χαρακτήρων και δημιουργείται αυτόματα
	-- κατά την εισαγωγή του record στην database, δηλαδή με την είσοδο ή την
	-- εγγραφή του παίκτη. Το κλειδί αποθηκεύεται σε cookie και χρησιμοποιείται
	-- κατόπιν για την πιστοποίηση των κλήσεων Ajax προς τον Node server.

	`klidi`		CHARACTER(10) NOT NULL COMMENT 'Κλειδί πιστοποίησης',

	-- Στο πεδίο "IP" κρατάμε την IP του client από τον οποίο δημιουργήθηκε η
	-- συνεδρία. Όσον αφορά στο μέγεθος της IP, ειδωμένης ως character string
	-- και όχι ως bit sequence, το θέμα έχει περιπλακεί μετά την εισαγωγή τής
	-- IPv6. Σε διάφορα blogs αναφέρονται διάφορες τιμές για το σωστό μήκος
	-- μιας IP address, π.χ. 39, 45 κλπ, επομένως μια τιμή 64 χαρακτήρων πρέπει
	-- να με καλύπτει.

	`ip`		VARCHAR(64) NOT NULL DEFAULT '' COMMENT 'IP address',

	`isodos`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Είσοδος',

	-- Το πεδίο "poll" δείχνει την τελευταία επαφή τού παίκτη με τον server στα
	-- πλαίσια της συγκεκριμένης συνεδρίας.

	`poll`		TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Τελευταία επαφή',

	-- Τα παρακάτω στοιχεία ονομάζονται στοιχεία θέσης. Πρόκειται για το τρέχον
	-- τραπέζι του παίκτη/θεατή, για τη θέση στην οποία παίζει/παρακολουθεί και
	-- για το αν συμμετέχει ως παίκτης ή ως θεατής.

	`trapezi`	INTEGER(10) UNSIGNED NULL DEFAULT NULL COMMENT 'Τρέχον τραπέζι παίκτη',
	`thesi`		TINYINT(1) NULL DEFAULT NULL COMMENT 'Θέση παίκτη/θεατή',
	`simetoxi`	ENUM (
		'ΠΑΙΚΤΗΣ',
		'ΘΕΑΤΗΣ'
	) NULL DEFAULT NULL COMMENT 'Τρόπος συμμετοχής',

	PRIMARY KEY (
		`pektis`
	) USING BTREE,

	INDEX (
		`trapezi`
	) USING HASH
)

ENGINE = InnoDB
COMMENT = 'Πίνακας συνεδριών'
;

-- Ο πίνακας "istoriko" αρχειοθετεί τις συνεδρίες που κλείνουν.

CREATE TABLE `istoriko` (
	`kodikos`	INTEGER(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
	`pektis`	VARCHAR(64) NOT NULL COMMENT 'Παίκτης',
	`ip`		VARCHAR(64) NOT NULL DEFAULT '' COMMENT 'IP address',
	`isodos`	TIMESTAMP NOT NULL COMMENT 'Είσοδος',

	-- Κανονικά θα έπρεπε στην έξοδο να έχω default current timestamp, αλλά
	-- δεν μου επιτρέπει επειδή υπάρχει και άλλο not null timestamp και πεδίο
	-- με auto increment (MySQL bug). Αυτό το θέμα το αντιμετωπίζουμε και σε
	-- άλλους πίνακες και το λύνουμε με triggers.

	`exodos`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Έξοδος',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE,

	INDEX (
		`pektis`
	) USING HASH
)

ENGINE = InnoDB
COMMENT ='Πίνακας συνεδριών (αρχείο)'
;

-- Ο πίνακας "isfora" περιέχει τις εισφορές που κάνουν οι παίκτες για τα
-- έξοδα του server.

CREATE TABLE `isfora` (
	`pektis`	VARCHAR(64) NOT NULL COMMENT 'Παίκτης',
	`imerominia`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ημερομηνία καταβολής',

	-- Το ποσό της εισφοράς δίδεται σε λεπτά, π.χ. 50 ευρώ γράφεται 5000,
	-- 40.50 ευρώ γράφεται 4050 κοκ.

	`poso`		NUMERIC(6) NOT NULL COMMENT 'Ποσό',

	INDEX (
		`pektis`
	) USING HASH,

	INDEX (
		`imerominia`
	) USING BTREE
)

ENGINE = InnoDB
COMMENT ='Πίνακας εισφορών'
;

\! echo "tables created!"

\! echo "creating relations…"

-- Στο παρόν παρατίθενται όλα τα foreign keys, δηλαδή οι συσχετίσεις
-- μεταξύ των πινάκων τής database.

-- Πίνακας παραμέτρων παίκτη ("peparam")

ALTER TABLE `peparam` ADD FOREIGN KEY (
	`pektis`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

-- Πίνακας πληροφοριών προφίλ ("profinfo")

ALTER TABLE `profinfo` ADD FOREIGN KEY (
	`pektis`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

ALTER TABLE `profinfo` ADD FOREIGN KEY (
	`sxoliastis`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

-- Πίνακας σχέσεων ("sxesi")

ALTER TABLE `sxesi` ADD FOREIGN KEY (
	`pektis`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

ALTER TABLE `sxesi` ADD FOREIGN KEY (
	`sxetizomenos`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

-- Πίνακας εισφορών ("isfora")

ALTER TABLE `isfora` ADD FOREIGN KEY (
	`pektis`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

-- Πίνακας μηνυμάτων ("minima")

ALTER TABLE `minima` ADD FOREIGN KEY (
	`apostoleas`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

ALTER TABLE `minima` ADD FOREIGN KEY (
	`paraliptis`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

-- Πίνακας τραπεζιών ("trapezi")

ALTER TABLE `trapezi` ADD FOREIGN KEY (
	`pektis1`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE
;

ALTER TABLE `trapezi` ADD FOREIGN KEY (
	`pektis2`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE
;

ALTER TABLE `trapezi` ADD FOREIGN KEY (
	`pektis3`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE
;

-- Πίνακας παραμέτρων τραπεζιού ("trparam")

ALTER TABLE `trparam` ADD FOREIGN KEY (
	`trapezi`
) REFERENCES `trapezi` (
	`kodikos`
) ON UPDATE CASCADE ON DELETE CASCADE
;

-- Πίνακας συμμετοχών ("simetoxi")

ALTER TABLE `simetoxi` ADD FOREIGN KEY (
	`trapezi`
) REFERENCES `trapezi` (
	`kodikos`
) ON UPDATE CASCADE ON DELETE CASCADE
;

ALTER TABLE `simetoxi` ADD FOREIGN KEY (
	`pektis`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

-- Πίνακας συμμετεχόντων παικτών ("telefteos")

ALTER TABLE `telefteos` ADD FOREIGN KEY (
	`trapezi`
) REFERENCES `trapezi` (
	`kodikos`
) ON UPDATE CASCADE ON DELETE CASCADE
;

ALTER TABLE `telefteos` ADD FOREIGN KEY (
	`pektis`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

-- Πίνακας προσκλήσεων ("prosklisi")

ALTER TABLE `prosklisi` ADD FOREIGN KEY (
	`trapezi`
) REFERENCES `trapezi` (
	`kodikos`
) ON UPDATE CASCADE ON DELETE CASCADE
;

ALTER TABLE `prosklisi` ADD FOREIGN KEY (
	`apo`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

ALTER TABLE `prosklisi` ADD FOREIGN KEY (
	`pros`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

-- Πίνακας αποκλεισμών παρτίδας ("arvila")

ALTER TABLE `arvila` ADD FOREIGN KEY (
	`trapezi`
) REFERENCES `trapezi` (
	`kodikos`
) ON UPDATE CASCADE ON DELETE CASCADE
;

-- Πίνακας διανομών ("dianomi")

ALTER TABLE `dianomi` ADD FOREIGN KEY (
	`trapezi`
) REFERENCES `trapezi` (
	`kodikos`
) ON UPDATE CASCADE ON DELETE CASCADE
;

-- Πίνακας ενεργειών ("energia")

ALTER TABLE `energia` ADD FOREIGN KEY (
	`dianomi`
) REFERENCES `dianomi` (
	`kodikos`
) ON UPDATE CASCADE ON DELETE CASCADE
;

-- Πίνακας ακυρωμένων ενεργειών ("akirosi")

ALTER TABLE `akirosi` ADD FOREIGN KEY (
	`dianomi`
) REFERENCES `dianomi` (
	`kodikos`
) ON UPDATE CASCADE ON DELETE CASCADE
;

-- Πίνακας συνεδριών ("sinedria")

ALTER TABLE `sinedria` ADD FOREIGN KEY (
	`pektis`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

ALTER TABLE `sinedria` ADD FOREIGN KEY (
	`trapezi`
) REFERENCES `trapezi` (
	`kodikos`
) ON UPDATE CASCADE
;

-- Ιστορικό συνεδριών ("istoriko")

ALTER TABLE `istoriko` ADD FOREIGN KEY (
	`pektis`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

-- Πίνακας συζητήσεων ("sizitisi")

ALTER TABLE `sizitisi` ADD FOREIGN KEY (
	`pektis`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

ALTER TABLE `sizitisi` ADD FOREIGN KEY (
	`trapezi`
) REFERENCES `trapezi` (
	`kodikos`
) ON UPDATE CASCADE ON DELETE CASCADE
;

\! echo "database relations created!"

\! echo "creating triggers…"

-- Εδώ συμπληρώνουμε το πεδίο "poll" για τους νέους παίκτες.

DELIMITER //
CREATE TRIGGER `neos_pektis` BEFORE INSERT ON `pektis`
FOR EACH ROW
BEGIN
	IF (NEW.`poll` < NEW.`egrafi`) THEN
		SET NEW.`poll` = NEW.`egrafi`;
	END IF;
END;//
DELIMITER ;

-- Εδώ συμπληρώνουμε το πεδίο "poll" για τις νέες συνεδρίες.

DELIMITER //
CREATE TRIGGER `nea_sinedria` BEFORE INSERT ON `sinedria`
FOR EACH ROW
BEGIN
	IF (NEW.`poll` < NEW.`isodos`) THEN
		SET NEW.`poll` = NEW.`isodos`;
	END IF;
END;//
DELIMITER ;

-- Εδώ συμπληρώνουμε το πεδίο "exodos" για τις αρχειοθετημένες συνεδρίες.

DELIMITER //
CREATE TRIGGER `neo_istoriko` BEFORE INSERT ON `istoriko`
FOR EACH ROW
BEGIN
	SET NEW.`exodos` = NOW();
END;//
DELIMITER ;

-- Εδώ συμπληρώνουμε το πεδίο "poll" για τα νέα τραπέζια.

DELIMITER //
CREATE TRIGGER `neo_trapezi` BEFORE INSERT ON `trapezi`
FOR EACH ROW
BEGIN
	if (NEW.`poll` < NEW.`stisimo`) THEN
		SET NEW.`poll` = NEW.`stisimo`;
	END IF;
END;//
DELIMITER ;

\! echo "database triggers created!"

\! echo "creating views…"

-- Το view "partida" περιλαμβάνει τα ενεργά τραπέζια, δηλαδή τις παρτίδες
-- που βρίσκονται σε εξέλιξη.

CREATE VIEW `partida` AS SELECT *
FROM `trapezi`
WHERE `arxio` IS NULL
ORDER BY `kodikos` DESC
;

\! echo "views created!"

-- Επαναφέρουμε την προσωρινή ακύρωση του foreign key check.

SET FOREIGN_KEY_CHECKS = 1;
