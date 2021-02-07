<?php
require_once "../lib/selida.php";

Selida::head();
Selida::stylesheet("xrisi/xrisi");
Selida::javascript("xrisi/xrisi");

Selida::body();
Selida::toolbar();
Selida::fyi_pano();

Selida::ofelimo_begin();
require "xrisi.html";
Selida::ofelimo_end();

Selida::fyi_kato();
Selida::ribbon();
Selida::telos();
?>
