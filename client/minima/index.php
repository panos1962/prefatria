<?php
require_once "../lib/standard.php";
Globals::diavase("lib/selida.php");

Selida::head("Αλληλογραφία");
Globals::pektis_must();

Selida::stylesheet("minima/minima");
Selida::javascript("common/skiniko");
Selida::javascript("minima/minima");

Selida::body();
Selida::toolbar();
Selida::fyi_pano();

Selida::ofelimo_begin();
Minima::controls();
Minima::minimata();
Minima::controlsGo();
Selida::ofelimo_end();

Selida::fyi_kato();
Selida::ribbon();
Selida::telos();

Class Minima {
	public static function controls() {
		?>
		<table id="minimaControls">
		<tr>
		<td>
			<button id="minimaNeoButton" class="formaButton minimaButton" type="button">Νέο μήνυμα</button>
		</td>
		<td>
			<div class="minimaCheckboxButton">
				<div class="formaPrompt minimaPrompt">
					Όλα
				</div>
				<input id="minimaOlaButton" class="minimaCheckbox" type="checkbox" />
			</div>
		</td>
		<td>
			<div class="minimaCheckboxButton">
				<div class="formaPrompt minimaPrompt">
					Εξερχόμενα
				</div>
				<input id="minimaExerxomenaButton" class="minimaCheckbox" type="checkbox" />
			</div>
			<div class="minimaCheckboxButton">
				<div class="formaPrompt minimaPrompt">
					Εισερχόμενα
				</div>
				<input id="minimaIserxomenaButton" class="minimaCheckbox" type="checkbox" />
			</div>
			<div class="minimaCheckboxButton">
				<div class="formaPrompt minimaPrompt">
					Οίκοθεν
				</div>
				<input id="minimaIkothenButton" class="minimaCheckbox" type="checkbox" />
			</div>
		</td>
		</tr>
		<tr>
		<td>
			<button id="minimaAnaneosiButton" class="formaButton minimaButton" type="button">Ανανέωση</button>
		</td>
		<td>
		</td>
		<td>
			<div class="minimaCheckboxButton">
				<div class="formaPrompt minimaPrompt">
					Διαβασμένα
				</div>
				<input id="minimaDiavasmenaButton" class="minimaCheckbox" type="checkbox" />
			</div>
			<div class="minimaCheckboxButton">
				<div class="formaPrompt minimaPrompt">
					Αδιάβαστα
				</div>
				<input id="minimaAdiavastaButton" class="minimaCheckbox" type="checkbox" />
			</div>
			<div class="minimaCheckboxButton">
				<div class="formaPrompt minimaPrompt">
					Κρατημένα
				</div>
				<input id="minimaKratimenaButton" class="minimaCheckbox" type="checkbox" />
			</div>
		</td>
		</tr>
		</table>
		<?php
	}

	public static function minimata() {
		?>
		<table id="minimata" style="width: 100%;"></table>
		<div id="minimaEditForma">
			<div id="minimaEditFormaPros">
				<span class="formaPrompt">Προς</span>
				<input id="minimaEditFormaParaliptisLogin"
					class="formaPedio" style="width: 200px;" />
			</div>
			<textarea id="minimaEditFormaKimeno"></textarea>
			<div id="minimaEditFormaPanel"></div>
		</div>
		<?php
	}

	public static function controlsGo() {
		?>
		<div class="minimaControlsGo" style="left: 0;">
			<img class="minimaControlsGoIcon" style="left: 0;" />
		</div>
		<div class="minimaControlsGo" style="right: 0;">
			<img class="minimaControlsGoIcon" style="right: 0;" />
		</div>
		<?php
	}
}
?>
