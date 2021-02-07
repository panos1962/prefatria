<?php
require_once "../lib/selida.php";

Selida::head();
Selida::stylesheet("prive/prive");
Selida::javascript("prive/prive");

Selida::body();
Selida::toolbar();
Selida::fyi_pano();

Selida::ofelimo_begin();
require "prive.html";
Selida::ofelimo_end();

Selida::fyi_kato();
Selida::ribbon();
Selida::telos();
?>
