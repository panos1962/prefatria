<?php
define('DOREA_PAGE', true);
require_once "../lib/selida.php";

Selida::head();
Selida::stylesheet("dorea/dorea");
Selida::javascript("dorea/dorea");

Selida::body();
Selida::toolbar();
Selida::fyi_pano();

Selida::ofelimo_begin();
require "dorea.html";
Selida::ofelimo_end();

Selida::fyi_kato();
Selida::ribbon();
Selida::telos();
?>
