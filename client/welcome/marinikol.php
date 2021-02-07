<?php
Globals::diavase("lib/selida.php");

Selida::head();
Selida::stylesheet("welcome/welcome");
Selida::javascript("welcome/welcome");

Selida::body();
Selida::toolbar();

Selida::ofelimo_begin();
require "marinikol.html";
Selida::ofelimo_end();

Selida::fyi_kato();
Selida::ribbon();
Selida::telos();
?>
