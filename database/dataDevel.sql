-- phpMyAdmin SQL Dump
-- version 3.5.2.2
-- http://www.phpmyadmin.net
--
-- Φιλοξενητής: localhost
-- Χρόνος δημιουργίας: 15 Απρ 2014 στις 08:31:44
-- Έκδοση διακομιστή: 5.5.27
-- Έκδοση PHP: 5.4.7

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

USE `prefatria`;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

DELETE FROM `sinedria`;
DELETE FROM `trapezi`;
DELETE FROM `sizitisi`;
DELETE FROM `pektis`;
DELETE FROM `peparam`;

INSERT INTO `pektis` (`login`, `egrafi`, `onoma`, `email`, `kodikos`, `poll`) VALUES
('akis', '2014-01-13 10:27:01', 'Akis Sotakis', NULL, '', '2014-01-13 10:27:01'),
('lakis', '2014-01-14 07:36:08', 'Lakis Gavalas', NULL, '', '2014-01-14 07:36:08'),
('lefas', '2014-01-13 10:28:14', 'Lefteris Lefakis', NULL, '', '2014-01-13 10:28:14'),
('manos', '2014-01-13 10:28:14', 'Manos Karamanos', NULL, '', '2014-01-13 10:28:14'),
('maria', '2014-01-13 10:27:01', 'Maria Pentagiotisa', NULL, '', '2014-01-13 10:27:01'),
('panos', '2014-01-13 10:27:01', 'Panos Papadopoulos', NULL, '', '2014-01-13 10:27:01'),
('sakis', '2014-01-13 10:27:01', 'Sakis Sakakis', NULL, '', '2014-01-13 10:27:01'),
('tasos', '2014-01-13 10:27:01', 'Tasos Karatasos', NULL, '', '2014-01-13 10:27:01'),
('aris', '2014-01-13 10:27:01', 'Aris Paparis', NULL, '', '2014-01-13 10:27:01'),
('sotos', '2014-01-13 10:27:01', 'Sotos Papasotos', NULL, '', '2014-01-13 10:27:01'),
('sofia', '2014-01-13 10:27:01', 'Sofia Vosou', NULL, '', '2014-01-13 10:27:01'),
('babis', '2014-01-13 10:27:01', 'Babis Tsertos', NULL, '', '2014-01-13 10:27:01'),
('nikos', '2014-01-13 10:27:01', 'Nikos Lefakis', NULL, '', '2014-01-13 10:27:01'),
('aleka', '2014-01-13 10:27:01', 'Aleka Tsimbouka', NULL, '', '2014-01-13 10:27:01'),
('rania', '2014-01-13 10:27:01', 'Ourania Poutanara', NULL, '', '2014-01-13 10:27:01'),
('fenia', '2014-01-13 10:27:01', 'Ifigenia Samara', NULL, '', '2014-01-13 10:27:01'),
('zoi', '2014-01-13 10:27:01', 'Zoi Fitousi', NULL, '', '2014-01-13 10:27:01');

UPDATE `pektis` SET `kodikos` = SHA1('xxx');

INSERT INTO `profinfo` (`pektis`, `sxoliastis`, `kimeno`) VALUES
('panos', 'panos', 'asdasdas das dasdas dasd asdas dasd asdas das das das das das das dasd asd asda sdadada'),
('panos', 'zoi', 'AAA SHGDF SD SDS DSD SDS DSDS DSDSDSD DSDSDSD'),
('panos', 'akis', 'AAA SHGDF SD SDS DSD SDS DSDS DSDSDSD DSDSDSD'),
('zoi', 'zoi', 'asdasdas das dasdas dasd asdas dasd asdas das das das das das das dasd asd asda sdadada'),
('zoi', 'panos', 'AAA SHGDF SD SDS DSD SDS DSDS DSDSDSD DSDSDSD'),
('maria', 'maria', 'asd asdas dasdasda sdasds dsdasd adasdas dasdasd asdasdasdasd'),
('maria', 'panos', 'asdas das dasd asdas dasd asdas dasd asda sdas dad asd asdasdasdasd asdasdasdas dasasdasdasdad asddasdas');

UPDATE `pektis` SET `kodikos` = SHA1('xxx');

INSERT INTO `peparam` (`pektis`, `param`, `timi`) VALUES
('aris', 'ΑΞΙΩΜΑ', 'VIP'),
('aris', 'ΑΝΕΡΓΟΣ', 'ΝΑΙ'),
('aris', 'ΕΠΙΔΟΤΗΣΗ', 'ΝΑΙ'),
('panos', 'ΑΝΕΡΓΟΣ', 'ΝΑΙ'),
('panos', 'DEVELOPER', 'ΝΑΙ'),
('panos', 'ΑΞΙΩΜΑ', 'ADMINISTRATOR'),
('maria', 'ΑΞΙΩΜΑ', 'ΔΙΑΧΕΙΡΙΣΤΗΣ'),
('akis', 'ΑΞΙΩΜΑ', 'ΕΠΟΠΤΗΣ'),
('lakis', 'ΑΞΙΩΜΑ', 'VIP'),
('manos', 'ΑΞΙΩΜΑ', 'VIP'),
('lefas', 'ΑΞΙΩΜΑ', 'VIP'),
('sakis', 'ΑΞΙΩΜΑ', 'ΠΡΟΕΔΡΟΣ');

INSERT INTO `trapezi` (`kodikos`, `stisimo`, `pektis1`, `apodoxi1`, `pektis2`,
	`apodoxi2`, `pektis3`, `apodoxi3`, `poll`, `arxio`) VALUES
(1, '2014-01-13 10:29:11', 'akis', 'ΝΑΙ', 'panos', 'ΝΑΙ', 'maria', 'ΝΑΙ', '2014-01-13 10:29:11', NULL),
(2, '2014-01-13 10:29:11', 'lefas', 'ΟΧΙ', NULL, 'ΟΧΙ', 'tasos', 'ΟΧΙ', '2014-01-13 10:29:11', NULL),
(3, '2014-01-13 10:29:11', 'babis', 'ΟΧΙ', NULL, 'ΟΧΙ', 'panos', 'ΝΑΙ', '2014-01-13 10:29:11', NULL);

INSERT INTO `trparam` (`trapezi`, `param`, `timi`) VALUES
(1, 'ΚΑΣΑ', '30'),
(2, 'ΑΣΟΙ', 'ΟΧΙ'),
(2, 'ΠΑΣΟ', 'ΝΑΙ');

INSERT INTO `simetoxi` (`trapezi`, `pektis`, `thesi`) VALUES
(1, 'akis', 1),
(1, 'panos', 2),
(1, 'maria', 3),
(2, 'lefas', 1),
(2, 'tasos', 3);

INSERT INTO `telefteos` (`trapezi`, `thesi`, `pektis`) VALUES
(1, 1, 'akis'),
(1, 2, 'panos'),
(1, 3, 'maria'),
(2, 1, 'lefas'),
(2, 2, 'maria'),
(2, 3, 'tasos');

INSERT INTO `prosklisi` (`kodikos`, `trapezi`, `apo`, `pros`) VALUES
(1, 1, 'akis', 'akis'),
(2, 1, 'akis', 'panos'),
(3, 1, 'panos', 'maria'),
(4, 1, 'panos', 'tasos');

INSERT INTO `sizitisi` (`pektis`, `trapezi`, `sxolio`, `pote`) VALUES
('panos', NULL, 'Καλημέρα σε όλους! Σας καλωσορίζω σε μια ακόμη νέα version του «Πρεφαδόρου»', '2014-01-28 11:49:55'),
('maria', NULL, 'Καλημέρα κι από μένα. Ελπίζω αυτή η version να είναι καλύτερη από τις προηγούμενες.', '2014-01-28 11:49:55'),
('panos', 1, 'Καλημέρα στο τραπέζι νούμερο 1!', '2014-01-28 11:49:55'),
('panos', NULL, 'Εννοείται! Με προσβάλλεις.', '2014-01-28 11:49:55'),
('manos', NULL, 'Τι είναι ρε παιδιά αυτός ο «Πρεφαδόρος»; Ας μου εξηγήσει κάποιος.', '2014-01-28 11:49:55'),
('akis', 1, 'Καλώς σας βρήκα.', '2014-01-28 11:49:55'),
('lakis', NULL, 'Είναι ένα παιχνίδι, αλλά αν δεν ξέρεις πρέφα μην κάνεις τον κόπο, είναι δύσκολο. Εγώ παίζω 50 χρόνια κι ακόμη δεν το έχω μάθει.', '2014-01-28 11:49:55'),
('maria', 2, 'Πώς μπαίνει κάποιος στο τραπέζι;', '2014-01-28 11:49:55'),
('tasos', 2, 'Πρέπει να σου στείλουν πρόσκληση.', '2014-01-28 11:49:55'),
('maria', 2, 'Θα μου στείλεις μια πρόσκληση;', '2014-01-28 11:49:55'),
('tasos', 2, 'Βεβαίως!', '2014-01-28 11:49:55'),
('panos', 2, 'Τάσο, μην κουράζεσαι έστειλα εγώ.', '2014-01-28 11:49:55');

INSERT INTO `sinedria` (`pektis`, `klidi`, `ip`, `isodos`, `poll`, `trapezi`, `thesi`, `simetoxi`) VALUES
('akis', '', '127.0.0.1', '2014-01-13 10:30:04', '2014-01-13 10:30:04', 1, 1, 'ΠΑΙΚΤΗΣ'),
('panos', '', '127.0.0.1', '2014-01-13 10:30:04', '2014-01-13 10:30:04', 2, 3, 'ΘΕΑΤΗΣ'),
('maria', '', '127.0.0.1', '2014-01-13 10:30:04', '2014-01-13 10:30:04', 1, 3, 'ΠΑΙΚΤΗΣ'),
('manos', '', '127.0.0.1', '2014-01-13 10:30:31', '2014-01-13 10:30:31', 2, 1, 'ΠΑΙΚΤΗΣ'),
('sakis', '', '127.0.0.1', '2014-01-13 10:30:31', '2014-01-13 10:30:31', 2, 3, 'ΠΑΙΚΤΗΣ'),
('zoi', '', '127.0.0.1', '2014-01-13 10:31:57', '2014-01-13 10:31:57', 1, 2, 'ΘΕΑΤΗΣ'),
('aris', '', '127.0.0.1', '2014-01-13 10:31:57', '2014-01-13 10:31:57', 1, 3, 'ΘΕΑΤΗΣ'),
('sotos', '', '127.0.0.1', '2014-01-13 10:31:57', '2014-01-13 10:31:57', NULL, NULL, NULL),
('lakis', '', '127.0.0.1', '2014-01-13 10:31:57', '2014-01-13 10:31:57', NULL, NULL, NULL),
('sofia', '', '127.0.0.1', '2014-01-13 10:31:57', '2014-01-13 10:31:57', NULL, NULL, NULL),
('nikos', '', '127.0.0.1', '2014-01-13 10:31:57', '2014-01-13 10:31:57', 1, 2, 'ΘΕΑΤΗΣ'),
('aleka', '', '127.0.0.1', '2014-01-13 10:31:57', '2014-01-13 10:31:57', 1, 1, 'ΘΕΑΤΗΣ'),
('rania', '', '127.0.0.1', '2014-01-13 10:31:57', '2014-01-13 10:31:57', 1, 1, 'ΘΕΑΤΗΣ'),
('fenia', '', '127.0.0.1', '2014-01-13 10:31:57', '2014-01-13 10:31:57', 1, 3, 'ΘΕΑΤΗΣ'),
('lefas', '', '127.0.0.1', '2014-01-13 10:31:57', '2014-01-13 10:31:57', 2, 1, 'ΠΑΙΚΤΗΣ');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
