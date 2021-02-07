<?php
require_once "../lib/standard.php";
Globals::diavase("lib/selida.php");

Selida::head("Αρχείο");

Selida::stylesheet("arena/arena");
Selida::stylesheet("arxio/arxio");
Selida::javascript("common/prefadoros");
Selida::javascript("common/skiniko");
Selida::javascript("common/partida");
Selida::javascript("common/energia");
Selida::javascript("lib/skiniko");
Selida::javascript("arxio/arxio");
Arxio::kritiria();

Selida::body();
Selida::toolbar();
Selida::fyi_pano();

Selida::ofelimo_begin();
Selida::ofelimo_end();

Selida::fyi_kato();
Selida::ribbon();
Selida::telos();

class Arxio {
	// Η μέθοδος "kritiria" ελέγχει αν έχουν δοθεί κριτήρια στο URL και εφόσον
	// αυτά έχουν δοθεί, τα περνάμε στα αντίστοιχα πεδία της φόρμας κριτηρίων
	// και τα κρατάμε ως data στα αντίστοιχα πεδία για το reset.

	public static function kritiria() {
		// Εάν έχουν δοθεί κριτήρια στο URL, τότε προτιθέμεθα να προχωρήσουμε
		// σε αυτόματη εύρεση των σχετικών παρτίδων. Η flag "kritiria" τίθεται
		// TRUE εφόσον δόθηκαν κριτήρια στο URL.

		$kritiria = FALSE;

		// Δημιουργούμε javascript function η οποία καλείται ΑΦΟΥ σχηματιστεί
		// η σελίδα επισκόπησης αρχειοθετημένων παρτίδων (ΣΕΑΠ). Στα input πεδία
		// προσαρτούμε data που αφορούν στα κριτήρια που παρέχονται στο URL.

		?>
		<script type="text/javascript">
		//<![CDATA[
		Arxio.setupPost = function() {
			$('input').data('url', '');
			<?php
			if (Globals::perastike("pektis")) {
				?>Arxio.pektisInputDOM.data('url', '<?php print $_REQUEST["pektis"]; ?>');<?php
				$kritiria = TRUE;
			}

			// Αν δεν δόθηκε κριτήριο παίκτη στο URL, φροντίζουμε να θέσουμε
			// κριτήριο που αφορά στον χρήστη που τρέχει το πρόγραμμα, εφόσον
			// έχουμε επώνυμη χρήση. Σ' αυτή την περίπτωση όμως δεν προχωρούμε
			// σε αυτόματη αναζήτηση.

			else if (Globals::is_pektis()) {
				?>Arxio.pektisInputDOM.data('url', '<?php print $_SESSION["pektis"]; ?>');<?php
			}

			if (Globals::perastike("apo")) {
				?>Arxio.apoInputDOM.data('url', '<?php print $_REQUEST["apo"]; ?>');<?php
				$kritiria = TRUE;
			}

			if (Globals::perastike("eos")) {
				?>Arxio.eosInputDOM.data('url', '<?php print $_REQUEST["eos"]; ?>');<?php
				$kritiria = TRUE;
			}

			if (Globals::perastike("partida")) {
				?>Arxio.partidaInputDOM.data('url', '<?php print $_REQUEST["partida"]; ?>');<?php
				$kritiria = TRUE;
			}

			// Προετοιμάζουμε την αναζήτηση, είτε έχουν δοθεί κριτήρια στο URL.
			// είτε όχι.

			?>Arxio.anazitisiReset();<?php

			// Αν έχουν δοθεί κριτήρια στο URL, προχωρούμε σε αναζήτηση των
			// σχετικών παρτίδων.

			if ($kritiria) {
				?>Arxio.goButtonDOM.trigger('click');<?php
			}
			?>
		};
		//]]>
		</script>
		<?php
	}
}
?>
