<?php
Globals::diavase("lib/selida.php");

Selida::head();
Selida::stylesheet("welcome/welcome");
Selida::javascript("welcome/welcome");

Selida::body();
Selida::motd(TRUE);
Selida::toolbar();
Selida::fyi_pano();

Selida::ofelimo_begin();
require "welcome.html";
if (Globals::is_prive())
require "prive.html";
Selida::ofelimo_end();

Selida::fyi_kato();
Selida::ribbon();
Selida::telos();
?>
