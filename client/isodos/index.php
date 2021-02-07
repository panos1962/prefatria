<?php
require_once "../lib/selida.php";

Selida::head();
Selida::javascript("isodos/isodos");

Selida::body();
Selida::toolbar();
Selida::fyi_pano();

Selida::ofelimo_begin();
Isodos::forma();
Selida::ofelimo_end();

Selida::fyi_kato();
Selida::ribbon();
Selida::telos();

class Isodos {
	public static function forma() {
		// Εφόσον τα στοιχεία εισόδου είναι ορθά γίνεται εσωτερικό submit και ως σελίδα
		// υποδοχής χρησιμοποιείται ψευδοσελίδα που απλώς μας περνά στην αρχική σελίδα
		// της εφαρμογής. Όλο αυτό γίνεται για να αποφύγουμε τη χρήση της μεθόδου POST
		// που μας δημιουργεί προβλήματα κατά τις επαναφορτώσεις, αλλά παράλληλα θέλουμε
		// να αποφύγουμε την εμφάνιση των στοιχείων εισόδου στο url μέσω της μεθόδου
		// GET.
		?>
		<form class="forma" method="get" action="isodos.php" onsubmit="return Isodos.submit(this);">
			<div class="formaSoma">
				<div class="formaTitlos">
					Φόρμα εισόδου
				</div>
				<table>
				<tr>
					<td class="formaPrompt">
						Login
					</td>
					<td>
						<input name="login" class="formaPedio" type="text" value=""
							maxlength="64" size="16" />
					</td>
				</tr>
				<tr>
					<td class="formaPrompt">
						Κωδικός
					</td>
					<td>
						<input name="kodikos" class="formaPedio" type="password" value=""
							maxlength="16" size="16" />
					</td>
				</tr>
				<tr>
					<td class="formaPrompt" style="display: table-cell;">
						Είστε άνω των 18 ετών
					</td>
					<td>
						<select id="ilikia">
						<option value="1">ΝΑΙ</option>
						<option value="0">ΟΧΙ</option>
						</select>
					</td>
				</tr>
				<tr>
					<td class="formaPrompt" style="display: table-cell; max-width: 10em;">
						<a href="<?php Globals::url("xrisi"); ?>" target="xrisi">
							Έχετε ήδη διαβάσει και συμφωνείτε με τους όρους χρήσης</a>
					</td>
					<td>
						<select id="xrisi">
						<option value="1">ΝΑΙ</option>
						<option value="0">ΟΧΙ</option>
						</select>
					</td>
				</tr>
				</table>
			</div>
			<div class="formaPanel">
				<input class="formaButton" type="submit" value="Αποδοχή & Είσοδος" />
				<input class="formaButton" type="reset" value="Reset" />
				<input class="formaButton" type="button" value="Άκυρο" onclick="Isodos.akiro();" />
			</div>
			<input name="klidi" type="hidden" value="" />
		</form>
		<?php
	}
}
?>
