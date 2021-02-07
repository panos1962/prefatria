Peripolos = {};

// Στο αντικείμενο "ergasia" περιέχονται οι θεσμοθετημένες εργασίες
// ελέγχου. Κάθε εργασία έχει τη δική της περίοδο ελέγχου και τη μέθοδο
// ελέγχου ως function.
//
// Οι χρόνοι περιόδου καθορίζονται σε milliseconds.

Peripolos.ergasia = {
	pektis:			{ period: 59 * 60 * 1000, action: 'Service.pektis.check' },
	sizitisiKontema:	{ period:  7 * 61 * 1000, action: 'Service.sizitisi.kontema' },
	trapezi:		{ period:  1 * 31 * 1000, action: 'Service.trapezi.check' },
	sinedria:		{ period:  1 * 19 * 1000, action: 'Service.sinedria.check' },
	fortos:			{ period:  1 * 17 * 1000, action: 'Service.fortos.ananeosi' },
	dbconn:			{ period:  1 * 13 * 1000, action: 'DB.check' },
	feredata:		{ period:  1 * 11 * 1000, action: 'Service.feredata.check' },
	trapeziKlidoma:		{ period:  1 *  7 * 1000, action: 'Service.trapezi.klidomaCheck' },
	fortosCPU:		{ period:  1 *  3 * 1000, action: 'Service.fortos.ananeosiCPU' },
};

// Η μέθοδος "setup" στήνει τους βασικούς κύκλους ελέγχου.

Peripolos.setup = function() {
	var i;

	Log.fasi.nea('Setting up patrol jobjs');
	Log.print('Calculating session timeouts');
	Log.level.push();

	// Αν κάποια συνεδρία δεν έχει υποβάλει αίτημα feredata μέσα σε εύλογο χρονικό
	// διάστημα, ο skiser θεωρεί ότι η συνεδρία έχει διακοπεί και την καταργεί.

	Peripolos.sinedriaTimeout = (2 * Service.feredata.timeout) + parseInt(Peripolos.ergasia.feredata.period / 1000) + 2;
	Log.print('timeout for "sinedria" set to ' + Peripolos.sinedriaTimeout + ' seconds');

	// Αν κάποια συνεδρία δεν έχει υποβάλει κάποιο άλλο αίτημα πλην των αυτόματων
	// τακτικών αιτημάτων ενημέρωσης, ο skiser την καταργεί για να αποδεσμεύσει
	// πόρους.

	Peripolos.inactiveTimeout = 3600;
	Log.print('timeout for "inactive" set to ' + Peripolos.inactiveTimeout + ' seconds');

	Log.level.pop();
	Log.print('initializing patrol jobs');
	Log.level.push();
	for (i in Peripolos.ergasia) {
		Log.print('initializing "' + i + '" check (every ' + Peripolos.ergasia[i].period + ' ms)');
		eval('setInterval(' + Peripolos.ergasia[i].action + ', ' + Peripolos.ergasia[i].period + ');');
	}
	Log.level.pop();
}
