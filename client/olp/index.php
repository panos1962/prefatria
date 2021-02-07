<?php
require_once "../lib/standard.php";
Globals::diavase("lib/selida.php");

Selida::head("Online παίκτες");

Selida::stylesheet("arena/arena");
Selida::stylesheet("olp/olp");
Selida::javascript("olp/olp");
anazitisi_setup();

Selida::body();
Selida::ofelimo_begin();
Selida::ofelimo_end();
Selida::telos();

// Αν δοθεί παίκτης προς αναζήτηση ήδη στο URL, τότε αυτό το στοιχείο
// θα πρέπει να το περάσουμε στο javascript περιβάλλον της σελίδας και
// ως όχημα χρησιμοποιούμε την property "anazitisiURL" του global "olp".

function anazitisi_setup() {
	if (!Globals::perastike("pektis"))
	return;

	Selida::javascript_begin();
	?>
	olp.anazitisiURL = <?php print Globals::asfales_json($_REQUEST["pektis"]); ?>;
	<?php
	Selida::javascript_end();
}
?>
