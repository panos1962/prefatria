<?php
require_once "../lib/selida.php";

Selida::head("Πρεφαδόρος - Funchat");
Selida::stylesheet("funchat/funchat");
Selida::javascript("common/prefadoros");
Selida::javascript("funchat/common");
Selida::javascript("funchat/funchat");

Selida::body();
Selida::ofelimo_begin();
Selida::ofelimo_end();
Selida::telos();
?>
