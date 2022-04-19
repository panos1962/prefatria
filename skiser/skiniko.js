//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Στο παρόν περιγράφουμε μεθόδους που αφορούν μόνο στον server σκηνικού (skiser).
// Τέτοιες μέθοδοι είναι, π.χ. το κλείδωμα ενός τραπεζιού, το μοίρασμα μιας νέας
// διανομής κλπ.
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Ακολουθεί μέθοδος με την οποία στήνεται ένα σκηνικό, ή καλύτερα ΤΟ σκηνικό στον
// skiser. Η μέθοδος αποτελεί ουσιαστικά το σημείο εκκίνησης της διαδικασίας, καθώς
// υπάρχει πληθώρα επιμέρους διαδικασιών που καλούνται αλυσιδωτά προκειμένου να
// στηθεί το σκηνικό. Περιττό να πούμε ότι το στήσιμο του σκηνικού στον skiser
// γίνεται με βάση τα στοιχεία που υπάρχουν κρατημένα στην database.  

Skiniko.prototype.stisimo = function() {
	Log.fasi.nea('Στήσιμο σκηνικού');
	Log.print('Τραπέζια');
	this.stisimoTrapezi(DB.connection());
	return this;
};

// Διαβάζουμε τα ενεργά τραπέζια από την database και τα εντάσσουμε στο σκηνικό.

Skiniko.prototype.stisimoTrapezi = function(conn) {
	var skiniko = this, query;

	this.izepart = {};	// λίστα τραπεζιών
	this.sitkep = {};	// λίστα συμμετεχόντων παικτών

	this.trapezi = {};
	query = 'SELECT ' + Trapezi.projection + ' FROM `trapezi` WHERE `arxio` IS NULL ORDER BY `kodikos`';
	conn.query(query, function(conn, rows) {
		Globals.awalk(rows, function(i, trapezi) {
			trapezi = new Trapezi(trapezi).trapeziPollSet();
			skiniko.skinikoTrapeziSet(trapezi);

			// Κρατάμε τα ενεργά τραπέζια στη λίστα "izepart".

			skiniko.izepart[trapezi.kodikos] = trapezi;

			// Κρατάμε όλους τους εμπλεκόμενους παίκτες στη λίστα "sitkep".
			// Ενδεχομένως να κρατήσουμε και κενή εγγραφή, αλλά αργότερα
			// θα διαγράψουμε την κενή εγγραφή. Εκμεταλλευόμαστε αυτή τη
			// λίστα για να κρατήσουμε και τα πιο φρέσκα στοιχεία θέσης
			// του παίκτη, καθώς επισκεπτόμαστε τα τραπέζι κατ' αύξουσα
			// σειρά.

			trapezi.trapeziThesiWalk(function(thesi) {
				skiniko.sitkep[this.trapeziPektisGet(thesi)] = {
					trapezi: trapezi.kodikos,
					thesi: thesi,
				};
			});
		});

		delete skiniko.sitkep[null];
		Log.print('Παράμετροι τραπεζιών');
		skiniko.izepart2 = {};		// δευτερεύουσα λίστα τραπεζιών
		skiniko.stisimoTrparam(conn);
	});

	return this;
};

// Διαβάζουμε τις παραμέτρους των ενεργών τραπεζιών και τις εντάσσουμε στο σκηνικό.

Skiniko.prototype.stisimoTrparam = function(conn) {
	var skiniko = this, kodikos, trapezi, query;

	for (kodikos in this.izepart) {
		trapezi = this.izepart[kodikos];
		delete this.izepart[kodikos];
		this.izepart2[kodikos] = trapezi;

		query = 'SELECT ' + Trparam.projection + ' FROM `trparam` WHERE `trapezi` = ' + kodikos;
		conn.query(query, function(conn, rows) {
			Globals.awalk(rows, function(i, trparam) {
				trapezi.trapeziTrparamSet(new Trparam(trparam));
			});

			// Συνεχίζουμε με τα υπόλοιπα στοιχεία της λίστας τραπεζιών.

			skiniko.stisimoTrparam(conn);
		});

		// Διακόπτουμε τη διαδικασία στο πρώτο τραπέζι εφόσον λειτουργούμε
		// αναδρομή.

		return this;
	}

	// Έχει εξαντληθεί η λίστα τραπεζιών, οπότε προχωρούμε στην επόμενη φάση
	// που αφορά στις συμμετοχές.

	Log.print('Μητρώο συμμετοχών');
	this.stisimoSimetoxi(conn);
	return this;
};

// Διαβάζουμε τον πίνακα συμμετοχών που δείχνει τη θέση που κάθησε κάθε παίκτης
// που συμμετείχε σε κάποιο τραπέζι, είτε ως παίκτης είτε ως θεατής.

// TODO
// Πρέπει να φροντίσουμε ώστε κατά την αρχειοθέτηση του τραπεζιού να διαγράφονται
// οι εγγραφές συμμετοχής και τελευταίου παίκτη (ακολουθεί).

Skiniko.prototype.stisimoSimetoxi = function(conn) {
	var skiniko = this, kodikos, trapezi, query;

	for (kodikos in this.izepart2) {
		trapezi = this.izepart2[kodikos];
		delete this.izepart2[kodikos];
		this.izepart[kodikos] = trapezi;

		query = 'SELECT ' + Simetoxi.projection + ' FROM `simetoxi` WHERE `trapezi` = ' + kodikos;
		conn.query(query, function(conn, rows) {
			Globals.awalk(rows, function(i, simetoxi) {
				trapezi.trapeziSimetoxiSet(new Simetoxi(simetoxi));
			});

			skiniko.stisimoSimetoxi(conn);
		});

		return this;
	}

	Log.print('Μητρώο παικτών');
	this.stisimoTelefteos(conn);
	return this;
};

// Διαβάζουμε τον πίνακα πρώην συμμετοχών που δείχνει ποιος παίκτης κάθησε τελευταίος
// στις θέσεις των ενεργών τραπεζιών.

Skiniko.prototype.stisimoTelefteos = function(conn) {
	var skiniko = this, kodikos, trapezi, query;

	for (kodikos in this.izepart) {
		trapezi = this.izepart[kodikos];
		delete this.izepart[kodikos];
		this.izepart2[kodikos] = trapezi;

		query = 'SELECT ' + Telefteos.projection + ' FROM `telefteos` WHERE `trapezi` = ' + kodikos;
		conn.query(query, function(conn, rows) {
			Globals.awalk(rows, function(i, telefteos) {
				trapezi.trapeziTelefteosSet(new Telefteos(telefteos));
			});

			skiniko.stisimoTelefteos(conn);
		});

		return this;
	}

	Log.print('Αποκλεισμοί');
	this.stisimoArvila(conn);
	return this;
};

// Διαβάζουμε τον πίνακα αποκλεισμών παικτών από τραπέζια.

Skiniko.prototype.stisimoArvila = function(conn) {
	var skiniko = this, kodikos, trapezi, query;

	for (kodikos in this.izepart2) {
		trapezi = this.izepart2[kodikos];
		delete this.izepart2[kodikos];
		this.izepart[kodikos] = trapezi;

		query = 'SELECT ' + Arvila.projection + ' FROM `arvila` WHERE `trapezi` = ' + kodikos;
		conn.query(query, function(conn, rows) {
			Globals.awalk(rows, function(i, arvila) {
				trapezi.trapeziArvilaSet(new Arvila(arvila));
			});

			skiniko.stisimoArvila(conn);
		});

		return this;
	}

	Log.print('Διανομές');
	this.stisimoDianomi(conn);
	return this;
};

// Διαβάζουμε τις διανομές των ενεργών τραπεζιών και τις εντάσσουμε στο σκηνικό.

Skiniko.prototype.stisimoDianomi = function(conn) {
	var skiniko = this, kodikos, trapezi, query;

	for (kodikos in this.izepart) {
		trapezi = this.izepart[kodikos];
		delete this.izepart[kodikos];

		query = 'SELECT ' + Dianomi.projection + ' FROM `dianomi` WHERE `trapezi` = ' +
			kodikos + ' ORDER BY `kodikos`';
		conn.query(query, function(conn, rows) {
			Globals.awalk(rows, function(i, dianomi) {
				trapezi.trapeziDianomiSet(dianomi = new Dianomi(dianomi));
				trapezi.dianomiArray.push(dianomi);
				skiniko.izepart2[kodikos] = dianomi;
			});

			skiniko.stisimoDianomi(conn);
		});

		return this;
	}

	delete this.izepart;
	Log.print('Ενέργειες');
	this.stisimoEnergia(conn);
	return this;
};

// Διαβάζουμε τις ενέργειες των τελευταίων διανομών των ενεργών τραπεζιών και
// τις εντάσσουμε στο σκηνικό.

Skiniko.prototype.stisimoEnergia = function(conn) {
	var skiniko = this, trapezi, dianomi, query;

	for (trapezi in this.izepart2) {
		dianomi = this.izepart2[trapezi];
		delete this.izepart2[trapezi];

		query = 'SELECT ' + Energia.projection + ' FROM `energia` WHERE `dianomi` = ' +
			dianomi.dianomiKodikosGet() + ' ORDER BY `kodikos`';
		conn.query(query, function(conn, rows) {
			Globals.awalk(rows, function(i, energia) {
				dianomi.dianomiEnergiaSet(energia = new Energia(energia));
				dianomi.energiaArray.push(energia);
			});

			skiniko.stisimoEnergia(conn);
		});

		return this;
	}

	delete this.izepart2;
	Log.print('Συζήτηση');
	this.stisimoSizitisi(conn);
	return this;
};

// Διαβάζουμε όλες τις συζητήσεις που εξελίσσονται τόσο στα διάφορα τραπέζια όσο
// και στο καφενείο.

Skiniko.prototype.stisimoSizitisi = function(conn) {
	var skiniko = this, query;

	this.sizitisi = {};
	query = 'SELECT ' + Sizitisi.projection + ' FROM `sizitisi` ORDER BY `kodikos`';
	conn.query(query, function(conn, rows) {
		Globals.awalk(rows, function(i, sizitisi) {
			var trapezi;

			// Στα πεδία του row συζήτησης υπάρχει και πεδίο τραπεζιού ως
			// αναφορά στον κωδικό τραπεζιού, ή null εφόσον πρόκειται για
			// τη συζήτηση του καφενείου. Κρατάμε την τιμή του πεδίου και
			// και το διαγράφουμε.

			trapezi = sizitisi.trapezi;
			delete sizitisi.trapezi;

			sizitisi = new Sizitisi(sizitisi);

			// Αν το πεδίο του τραπεζιού ήταν κενό, τότε πρόκειται για
			// τη συζήτηση του καφενείου.

			if (!trapezi) return skiniko.skinikoSizitisiSet(sizitisi);

			// Αλλιώς πρόκειται για τη συζήτηση του συγκεκριμένου τραπεζιού,
			// του οποίου όμως ελέγχουμε την ύπαρξη.

			trapezi = skiniko.skinikoTrapeziGet(trapezi);
			if (!trapezi) return console.error(sizitisi.sizitisiKodikosGet() + ': ορφανή συζήτηση');

			trapezi.trapeziSizitisiSet(sizitisi);
		});

		Log.print('Προσκλήσεις');
		skiniko.stisimoProsklisi(conn);
	});

	return this;
};

// Διαβάζουμε όλες τις προσκλήσεις και τις εντάσσουμε στο σκηνικό.

Skiniko.prototype.stisimoProsklisi = function(conn) {
	var skiniko = this, query;

	this.prosklisi = {};
	query = 'SELECT ' + Prosklisi.projection + ' FROM `prosklisi` ORDER BY `kodikos`';
	conn.query(query, function(conn, rows) {
		Globals.awalk(rows, function(i, prosklisi) {
			var trapezi;

			prosklisi = new Prosklisi(prosklisi);
			trapezi = skiniko.skinikoTrapeziGet(prosklisi.prosklisiTrapeziGet());
			if (!trapezi) return console.error(prosklisi.prosklisiKodikosGet() + ': ορφανή πρόσκληση');
			skiniko.skinikoProsklisiSet(prosklisi);
		});

		Log.print('Συνεδρίες');
		skiniko.stisimoSinedria(conn);
	});

	return this;
};

Skiniko.prototype.stisimoSinedria = function(conn) {
	var skiniko = this, query;

	this.sinedria = {};
	query = 'SELECT ' + Sinedria.projection + ' FROM `sinedria` ORDER BY `isodos`';
	conn.query(query, function(conn, rows) {
		Globals.awalk(rows, function(i, sinedria) {
			var pektis, trapezi, thesi;

			sinedria = new Sinedria(sinedria);
			sinedria.
			sinedriaPollSet().
			feredataPollSet().
			feredataResetSet();

			// Ελέγχουμε και διορθώνουμε τα στοιχεία θέσης της συνεδρίας.

			pektis = sinedria.sinedriaPektisGet();
			trapezi = skiniko.skinikoTrapeziGet(sinedria.sinedriaTrapeziGet());
			if (trapezi) {
				thesi = trapezi.trapeziThesiPekti(pektis);
				if (thesi) {
					sinedria.thesi = thesi;
					sinedria.simetoxi = 'ΠΑΙΚΤΗΣ';
				}
				else {
					if (Prefadoros.oxiThesi(sinedria.thesi)) sinedria.thesi = 1;
					sinedria.simetoxi = 'ΘΕΑΤΗΣ';
				}
			}
			else if (skiniko.sitkep[pektis]) {
				sinedria.trapezi = skiniko.sitkep[pektis].trapezi;
				sinedria.thesi = skiniko.sitkep[pektis].thesi;
				sinedria.simetoxi = 'ΠΑΙΚΤΗΣ';
			}
			else {
				delete sinedria.trapezi;
				delete sinedria.thesi;
				delete sinedria.simetoxi;
			}

			// Εντάσσουμε τη συνεδρία στο σκηνικό.

			skiniko.skinikoSinedriaSet(sinedria);

			// Κρατάμε τον παίκτη στη λίστα "sitkep". Μπορεί να χαλάσουμε
			// τα ήδη κρατημένα στοιχεία θέσης, αλλά αυτά δεν μας ενδιαφέρουν
			// πια. Αυτό που μας ενδιαφέρει είναι να έχουμε λίστα εμπλεκομένων
			// παικτών.

			skiniko.sitkep[sinedria.sinedriaPektisGet()] = true;
		});

		Log.print('Παίκτες');
		skiniko.sitkep2 = {};		// δευτερεύουσα λίστα παικτών
		skiniko.pektis = {};
		skiniko.stisimoPektis(conn);
	});

	return this;
};

Skiniko.prototype.stisimoPektis = function(conn) {
	var skiniko = this, login, query;

	for (login in this.sitkep) {
		delete this.sitkep[login];
		this.sitkep2[login] = true;
		query = 'SELECT ' + Pektis.projection + ' FROM `pektis` WHERE `login` = ' + login.json();
		conn.query(query, function(conn, rows) {
			Globals.awalk(rows, function(i, pektis) {
				pektis.poll = Globals.tora();
				skiniko.skinikoPektisSet(new Pektis(pektis));
			});

			skiniko.stisimoPektis(conn);
		});

		return this;
	}

	Log.print('Παράμετροι παικτών');
	this.stisimoPeparam(conn);
	return this;
};

Skiniko.prototype.stisimoPeparam = function(conn) {
	var skiniko = this, login, pektis, query;

	for (login in this.sitkep2) {
		delete skiniko.sitkep2[login];
		skiniko.sitkep[login] = true;

		pektis = this.skinikoPektisGet(login);
		query = 'SELECT ' + Peparam.projection + ' FROM `peparam` WHERE `pektis` = ' + login.json();
		conn.query(query, function(conn, rows) {
			Globals.awalk(rows, function(i, peparam) {
				pektis.pektisPeparamSet(new Peparam(peparam));
			});

			skiniko.stisimoPeparam(conn);
		});

		return this;
	}

	Log.print('Σχέσεις');
	this.stisimoSxesi(conn);
	return this;
};

Skiniko.prototype.stisimoSxesi = function(conn) {
	var skiniko = this, login, pektis, query;

	for (login in this.sitkep) {
		delete skiniko.sitkep[login];
		skiniko.sitkep2[login] = true;

		pektis = this.skinikoPektisGet(login);
		query = 'SELECT ' + Sxesi.projection + ' FROM `sxesi` WHERE `pektis` = ' + login.json();
		conn.query(query, function(conn, rows) {
			Globals.awalk(rows, function(i, sxesi) {
				pektis.pektisSxesiSet(sxesi['sxetizomenos'], sxesi['sxesi']);
			});

			skiniko.stisimoSxesi(conn);
		});

		return this;
	}

	Log.print('Πληροφορίες προφίλ');
	this.stisimoProfinfo(conn);
	return this;
};

Skiniko.prototype.stisimoProfinfo = function(conn) {
	var skiniko = this, login, pektis, query;

	for (login in this.sitkep2) {
		delete skiniko.sitkep2[login];
		skiniko.sitkep[login] = true;

		pektis = this.skinikoPektisGet(login);
		pektis.profinfo = {};
		query = 'SELECT ' + Profinfo.projection + ' FROM `profinfo` WHERE `pektis` = ' + login.json();
		conn.query(query, function(conn, rows) {
			Globals.awalk(rows, function(i, profinfo) {
				pektis.pektisProfinfoSet(profinfo['sxoliastis'], profinfo['kimeno']);
			});

			skiniko.stisimoProfinfo(conn);
		});

		return this;
	}

	conn.free();
	delete this.sitkep2;

	Log.print('Φωτογραφίες παικτών');
	this.stisimoPhoto();

	return this;
};

// Η function "stisimoPhoto" εμπλουτίζει τους παίκτες με τυχόν αρχεία εικόνας
// που τους αφορούν ως φωτογραφίες προφίλ που έχουν ανεβάσει οι ίδιοι.

Skiniko.prototype.stisimoPhoto = function() {
	var login, skiniko = this, pektis;

	for (login in this.sitkep) {
		delete this.sitkep[login];
		pektis = this.skinikoPektisGet(login);
		if (!pektis) continue;

		pektis.pektisSeekPhoto(function() {
			skiniko.stisimoPhoto();
		});
		return;

	}

	delete this.sitkep;
	this.stisimoTelos();
	return this;
};

// Ακολουθεί η τελευταία μέθοδος που καλείται κατά το στήσιμο του σκηνικού.

Skiniko.prototype.stisimoTelos = function() {
	// Κάνουμε replay όλες τις παρτίδες με βάση τα στοιχεία που έχουμε
	// ήδη φορτώσει.

	Log.print('Replay παρτίδων');
	this.skinikoTrapeziWalk(function() {
		this.partidaReplay();
	});

	// Ετοιμάζουμε το transaction log, ήτοι ένα array κινήσεων μέσω των
	// οποίων γίνονται αλλαγές στο σκηνικό.

	this.kinisi = [];

	// Κάνουμε μια πρώτη εκτίμηση του φόρτου με τα μέχρι στιγμής δεδομένα
	// πριν εκκινήσουμε τις τακτικές εκτιμήσεις φόρτου μέσω περιπόλου.

	Service.fortos.ananeosi();

	// Δρομολογούμε διάφορες περιοδικές εργασίες.

	Peripolos.setup();

	// Εκκινούμε τον skiser. Από εδώ και πέρα ο skiser «ακούει» στην
	// προκαθορισμένη πόρτα και οι παίκτες μπορούν να παραλάβουν δεδομένα
	// και να κάνουν διάφορους χειρισμούς.

	Server.ekinisi(this);

	Log.fasi.nea('Node server is up and running');
	return this;
};

Skiniko.prototype.idioIpCheck = function(login) {
	var sinedria, ip, trapezi, theatis, plist, sxolio, i, kinisi;

	sinedria = this.skinikoSinedriaGet(login);
	if (!sinedria)
	return this;

	ip = sinedria.sinedriaIpGet();
	if (!ip)
	return this;

	trapezi = sinedria.sinedriaTrapeziGet();
	if (!trapezi)
	return this;

	theatis = sinedria.sinedriaIsTheatis();
	plist = [];

	this.skinikoSinedriaWalk(function() {
		if (this === sinedria)
		return;

		if (this.sinedriaTrapeziGet() !== trapezi)
		return;

		if (theatis && this.sinedriaIsTheatis())
		return;

		if (this.sinedriaIpGet() !== ip)
		return;

		plist.push(this.sinedriaPektisGet());
	});

	if (!plist.length)
	return this;

	sxolio = 'Ο παίκτης #B' + login + '#b ίσως βρίσκεται στον ίδιο φυσικό χώρο με ';

	if (plist.length < 2)
	sxolio += 'τον παίκτη #B' + plist[0] + '#b';

	else {
		sxolio += 'τους παίκτες #B' + plist[0] + '#b';

		for (i = plist.length - 1; i > 1; i--)
		sxolio += ', #B' + plist[i] + '#b';

		sxolio += ' και #B' + plist[i] + '#b';
	}

	kinisi = new Kinisi('ER');
	kinisi.data = {
		trapezi: trapezi,
		error: sxolio,
	};

	Server.skiniko.
	kinisiAdd(kinisi, false);

	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Η μέθοδος "pektisSeekPhoto" εντοπίζει τυχόν αρχείο εικόνας προφίλ του ανά
// χείρας παίκτη και θέτει ανάλογα τα σχετικά properties. Η διαδικασία είναι
// ασύγχρονη, μπορούμε όμως τελειώνοντας να καλέσουμε callback function που
// περνάμε ως παράμετρο.

Pektis.prototype.pektisSeekPhoto = function(callback) {
	var login;

	login = this.pektisLoginGet();
	if (!login) {
		this.pektisPhotoSet();
		return this;
	}

	this.pektisSeekPhoto2(login.substr(0, 1).toLowerCase() + '/' + login, callback);
	return this;
}

Pektis.prototype.pektisSeekPhoto2 = function(fname, callback) {
	var pektis = this;

	FS.stat('../client/photo/' + fname, function(err, stats) {
		if (err) pektis.pektisPhotoSet();
		else pektis.pektisPhotoSet(fname, parseInt(stats.mtime.getTime() / 1000));
		if (callback) callback();
	});

	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Η μέθοδος "trapeziKlidoma" θέτει ένα κλείδωμα στο τραπέζι και όσο το κλείδωμα
// είναι σε ισχύ κάθε άλλη απόπειρα κλειδώματος αποτυγχάνει. Η μέθοδος επιστρέφει
// τη χρονική στιγμή του κλειδώματος εφόσον το κλείδωμα είναι επιτυχημένο, αλλιώς
// επιστρέφει false.

Trapezi.prototype.trapeziKlidoma = function(logos) {
	if (this.klidoma) return false;

	this.klidoma = Globals.torams();
	if (logos) this.klidomaLogos = logos;
	else delete this.klidomaLogos;

	return this.klidoma;
};

// Κρατάμε κάπου (globally) τον μέγιστο χρόνο ξεκλειδώματος ο οποίος πρέπει να
// κυμαίνεται σε διαστήματα κλασμάτων του δευτερολέπτου. Αν παρουσιαστούν μεγάλα
// διαστήματα σημαίνει ότι κάπου έχουμε ξεχάσει να ξεκλειδώσουμε και θα πρέπει να
// διορθώσουμε το πρόγραμμα.

Trapezi.xeklidomaMax = 0;

Trapezi.prototype.trapeziXeklidoma = function() {
	var dt;

	if (this.trapeziXeklidoto()) return this;

	dt = Globals.torams() - this.klidoma;
	delete this.klidoma;

	if (dt <= Trapezi.xeklidomaMax) return this;

	Trapezi.xeklidomaMax = dt;
	console.log('Trapezi.xeklidomaMax = ', dt + 'ms (reason: ' +
		(this.klidomaLogos ? this.klidomaLogos : 'unknown') + ')');
	return this;
};

Trapezi.prototype.trapeziKlidomaGet = function() {
	return this.klidoma;
};

Trapezi.prototype.trapeziKlidomeno = function() {
	return this.klidoma;
};

Trapezi.prototype.trapeziXeklidoto = function() {
	return !this.trapeziKlidomeno();
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Η μέθοδος "trapeziNeaDianomi" δημιουργεί νέα διανομή για το ανά χείρας τραπέζι.
// Ως παραμέτρους δέχεται μια database connection στα πλαίσια της οποίας θα γίνει
// η διανομή και άλλες σχετικές κινήσεις στην database, μια callback function που
// θα κληθεί σε περίπτωση επιτυχίας και μια callback function που θα κληθεί στην
// περίπτωση που τα πράγματα δεν εξελιχθούν ομαλά. Οι callback functions καλούνται
// ως μέθοδοι του τραπεζιού με τις εξής παραμέτρους:
//
// Επιτυχία: database connection, κίνηση διανομής, ενέργεια διανομής
//
// Αποτυχία: database connection

Trapezi.prototype.trapeziNeaDianomi = function(conn, success, fail) {
	var telefteaDianomi;

	// Αν δεν καθοριστεί callback function αποτυχίας, ακυρώνουμε την
	// database transaction και ξεκλειδώνουμε το τραπέζι.

	if (!fail)
	fail = function(conn) {
		conn.rollback();
		this.trapeziXeklidoma();
	};

	telefteaDianomi = this.trapeziTelefteaDianomi();

	if (telefteaDianomi)
	return this.trapeziNeaDianomi0(conn, telefteaDianomi, success, fail);

	return this.trapeziNeaDianomi1(conn, 1, success, fail);
};

// Η μέθοδος "trapeziNeaDianomi0" καλείται με σκοπό το «κλείσιμο» της τελευταίας
// διανομής πριν μοιραστεί η νέα διανομή.
//
// ΠΡΟΣΟΧΗ!!!
// Η τελευταία διανομή ίσως έχει κλείσει ήδη, καθώς κλείσιμο επέρχεται και με την
// πληρωμή. Υπάρχουν όμως περιπτώσεις κατά τις οποίες δεν γίνεται πληρωμή, π.χ.
// όταν οι παίκτες δεν έχουν αγοράσει και δεν παίζεται το πάσο.

Trapezi.prototype.trapeziNeaDianomi0 = function(conn, telefteaDianomi, success, fail) {
	var trapezi = this, query;

	query = 'UPDATE `dianomi` SET `telos` = NOW() ' +
		'WHERE (`kodikos` = ' + telefteaDianomi.dianomiKodikosGet() + ') ' +
		'AND (`telos` IS NULL)';
	conn.query(query, function(conn, res) {
		// Δεν ελέγχουμε τυχόν αποτυχία της ενημέρωσης, καθώς δεν είναι τόσο
		// σημαντικό να «κλείσει» η τελευταία διανομή. Απλώς προχωρούμε στη
		// νέα διανομή.

		trapezi.trapeziNeaDianomi1(conn, telefteaDianomi.dianomiDealerGet().epomeniThesi(), success, fail);
	});

	return this;
};

// Η μέθοδος "trapeziDianomi1" είναι αυτή που εισάγει στην database νέα διανομή
// για το ανά χείρας τραπέζι. Σημαντική παράμετρος είναι η θέση του dealer.

Trapezi.prototype.trapeziNeaDianomi1 = function(conn, dealer, success, fail) {
	var trapezi = this, query;

	query = 'INSERT INTO `dianomi` (`trapezi`, `dealer`) ' +
		'VALUES (' + this.trapeziKodikosGet() + ', ' + dealer + ')';
	conn.query(query, function(conn, res) {
		if (conn.affectedRows != 1) {
			console.error('αποτυχία εισαγωγής διανομής στην database');
			return fail.call(trapezi, conn);
		}

		trapezi.trapeziNeaDianomi2(conn, new Dianomi({
			kodikos: res.insertId,
			dealer: dealer,
		}), success, fail);
	});

	return this;
};

Trapezi.prototype.trapeziNeaDianomi2 = function(conn, dianomi, success, fail) {
	var trapezi = this, dianomiKodikos, idos, trapoula, data, query;

	dianomiKodikos = dianomi.dianomiKodikosGet();
	idos = 'ΔΙΑΝΟΜΗ';
	trapoula = (new Trapoula()).trapoulaAnakatema().trapoulaXartosiaGet();
	this.trapeziEpidotisi(trapoula);
	data = trapoula.xartosia2string();

	query = "INSERT INTO `energia` (`dianomi`, `pektis`, `idos`, `data`) VALUES (" +
		dianomiKodikos + ", " + dianomi.dianomiDealerGet() + ", " +
		idos.json() + ", " + data.json() + ")";
	conn.query(query, function(conn, res) {
		if (conn.affectedRows != 1) {
			console.error('αποτυχία εισαγωγής ενέργειας διανομής στην database');
			return fail.call(trapezi, conn);
		}

		trapezi.trapeziNeaDianomi3(conn, dianomi, new Energia({
			kodikos: res.insertId,
			dianomi: dianomiKodikos,
			idos: idos,
			data: data,
		}), success);
	});

	return this;
};

Trapezi.prototype.trapeziEpidotisi = function(trapoula) {
	var tixeros, pektis, asos, asosCount, rigas, rigasCount, xromaCount,
		fila, i, filo, xroma, makriCount, makriXroma,
		apo, eos, limo, orio, alagi, vima;

	// Επιλέγουμε στην τύχη έναν από τους παίκτες του τραπεζιού.

	tixeros = (Globals.random() % Prefadoros.thesiMax) + 1;
	pektis = this.trapeziPektisGet(tixeros);
	if (!pektis) return;

	// Εντοπίζουμε τον παίκτη στο σκηνικό και αν δεν είναι επιδοτούμενος
	// αφήνουμε τα φύλλα ως έχουν.

	pektis = Server.skiniko.skinikoPektisGet(pektis);
	if (!pektis) return;

	if (pektis.pektisOxiEpidotisi())
	return;

	// XXX
	// Τετάρτη, 13 Σεπτεμβρίου 2017
	// ----------------------------
	// Αφαιρέθηκε η δυαντότητα επιδότησης λόγω χακέματος και σχετικών
	// παραπόνων

	return;

	// Θα καταμετρήσουμε τους άσους, τους ρηγάδες και τη χρωματική κατανομή
	// των φύλλων του επιδοτουμένου.

	asos = {};
	asosCount = 0;

	rigas = {};
	rigasCount = 0;

	xromaCount = {
		'S': 0,
		'C': 0,
		'D': 0,
		'H': 0,
	};

	fila = trapoula.xartosiaXartosia((tixeros - 1) * 10, 10).xartosiaFilaGet();
	for (i = 0; i < fila.length; i++) {
		filo = fila[i];

		xroma = filo.filoXromaGet();
		xromaCount[xroma]++;

		switch (filo.filoAxiaGet()) {
		case 'A':
			asos[xroma] = true;
			asosCount++;
			break;
		case 'K':
			rigas[xroma] = true;
			rigasCount++;
			break;
		}
	}

	// Εντοπίζουμε το μακρύ χρώμα του επιδοτουμένου με σκοπό να το ενισχύσουμε
	// περαιτέρω αργότερα.

	makriCount = 0;

	for (xroma in xromaCount) {
		if (xromaCount[xroma] <= makriCount)
		continue;

		makriXroma = xroma;
		makriCount = xromaCount[xroma];
	}

	// Θα διατρέξουμε όλα τα φύλλα της τράπουλας και θα επιχειρήσουμε εναλλαγές
	// με βολικά φύλλα.

	fila = trapoula.xartosiaFilaGet();

	// Τα όρια "apo" και "eos" είναι το πρώτο φύλλο του επιδοτουμένου και το φύλλο
	// μετά το τελευταίο του επιδοτουμένου.

	apo = (tixeros - 1) * 10;
	eos = apo + 10;

	// Στο array "limo" θα τοποθετήσουμε δείκτες από τα λιμά φύλλα του επιδοτουμένου
	// τα οποία αργότερα θα αλλάξουμε με βολικότερα φύλλα. Ωστόσο, περιορίζουμε το
	// πλήθος των φύλλων που θα αλλαχθούν σε κάποιο τυχαίο νούμερο από 2 έως 4 φύλλα,
	// προκειμένου η επιδότηση να μην είναι υπερβολική.

	limo = [];
	orio = Globals.random(2, 4);

	for (i = apo; i < eos; i++) {
		filo = fila[i];

		// Εξαιρούμε τα φύλλα από το μακρύ χρώμα ώστε να μην τα αλλάξουμε.

		if (filo.filoXromaGet() === makriXroma)
		continue;

		// Εξαιρούμε, επίσης, άσους και ρηγάδες.

		switch (filo.filoAxiaGet()) {
		case 'A':
		case 'K':
			continue;
		}

		// Αν τα λιμά που έχουμε ήδη επιλέξει είναι αρκετά διακόπτουμε τη
		// διαδικασία επιλογής περαιτέρω λιμών φύλλων.

		if (limo.push(i) >= orio)
		break;
	}

	// Θα διατρέξουμε τώρα τα φύλλα της τράπουλας εκτός των φύλλων του επιδοτουμένου
	// προκειμένου να αλλάξουμε με βολικότερα φύλλα τα λιμά που έχουμε επιλέξει.
	// Η φορά με την οποία θα διατρέξουμε τα φύλλα επιλέγεται στην τύχη, ώστε να
	// μην αδικείται περισσότερο ένας εκ των δύο ήδη αδικημένων παικτών.

	if (Globals.random() % 2) {
		alagi = 0;
		vima = 1;
	}
	else {
		alagi = fila.length - 1;
		vima = -1;
	}

	for (i = 0; (i < fila.length) && (limo.length > 0); i++, alagi += vima) {
		if ((alagi >= apo) && (alagi < eos))
		continue;

		filo = fila[alagi];
		xroma = filo.filoXromaGet();

		if ((xroma === makriXroma) && (makriCount < 6)) {
			trapoula.xartosiaEnalagiFila(limo.pop(), alagi);
			makriCount++;
			continue;
		}

		switch (filo.filoAxiaGet()) {
		case 'A':
			if (asosCount < 3) {
				trapoula.xartosiaEnalagiFila(limo.pop(), alagi);
				asosCount++;
			}
			break;
		case 'K':
			if (rigasCount < 3) {
				trapoula.xartosiaEnalagiFila(limo.pop(), alagi);
				rigasCount++;
			}
			break;
		}
	}

	console.log(pektis.pektisLoginGet() + ': επιδότηση: ' + orio + ' φύλλα');
};

Trapezi.prototype.trapeziNeaDianomi3 = function(conn, dianomi, energia, callback) {
	var trapeziKodikos, dianomiKodikos, dealer, fila, kinisiDianomi, kinisiEnergia;

	trapeziKodikos = this.trapeziKodikosGet();
	dianomiKodikos = dianomi.dianomiKodikosGet();
	dealer = dianomi.dianomiDealerGet();
	fila = energia.energiaDataGet();

	kinisiDianomi = new Kinisi({
		idos: 'DN',
		data: {
			kodikos: dianomiKodikos,
			trapezi: trapeziKodikos,
			dealer: dealer,
		},
	});

	kinisiEnergia = new Kinisi({
		idos: 'EG',
		data: {
			kodikos: energia.energiaKodikosGet(),
			trapezi: trapeziKodikos,
			dianomi: dianomiKodikos,
			pektis: dealer,
			idos: energia.energiaIdosGet(),
			data: energia.energiaDataGet(),
		},
	});

	callback.call(this, conn, kinisiDianomi, kinisiEnergia);
	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Η μέθοδος "trapeziFilaSaveSet" κρατά τα φύλλα της τρέχουσας διανομής στη
// λίστα "filaSave" δεικοτοδοτημένα με τη θέση του παίκτη. Αν δεν καθοριστεί
// θέση καλείται αναδρομικά για όλες τις θέσεις. Τα φύλλα κρατούνται όχι ως
// χαρτωσιές, αλλά ως strings διότι αλλιώς κρατούνται by reference και στην
// πορεία αλλάζουν.

Trapezi.prototype.trapeziFilaSaveSet = function(thesi) {
	var trapezi = this, fila;

	if (thesi === undefined) {
		this.filaSave = {};
		this.trapeziThesiWalk(function(thesi) {
			trapezi.trapeziFilaSaveSet(thesi);
		});

		return this;
	}

	fila = this.partidaFilaGet(thesi);
	if (fila) this.filaSave[thesi] = fila.xartosia2string();

	return this;
};

// Η μέθοδος "trapeziFilaPrevSet" αντιγράφει τα κρατημένα φύλλα της διανομής
// από τη λίστα "filaSave" στη λίστα "filaPrev". Αν δεν καθοριστεί θέση καλείται
// αναδρομικά για όλες τις θέσεις.

Trapezi.prototype.trapeziFilaPrevSet = function(thesi) {
	var trapezi = this, fila;

	if (thesi === undefined) {
		this.filaPrev = {};
		this.trapeziThesiWalk(function(thesi) {
			trapezi.trapeziFilaPrevSet(thesi);
		});

		return this;
	}

	if (!this.hasOwnProperty('filaSave')) return this;
	fila = this.filaSave[thesi];
	if (fila) this.filaPrev[thesi] = fila;

	return this;
};

// Η function "parisaktosPektis" ελέγχει την απόπειρα κατάληψης θέσης παίκτη
// από άσχετο παίκτη μετά το τέλος της παρτίδας.

Trapezi.prototype.parisaktosPektis = function(pektis, thesi) {
	// Αν η ελεγχόμενη θέση είναι ακαθόριστη, θεωρούμε ότι δεν έχουμε
	// πρόβλημα.

	if (!thesi)
	return false;

	// Αν η παρτίδα δεν έχει τελειώσει, δεν έχουμε πρόβλημα. Ο έλεγχος έχει
	// νόημα μετά το τέλος της παρτίδας και τηναποχώρηση των παικτών.

	if (this.trapeziIpolipoGet() > 0)
	return false;

	// Αν ο παίκτης είναι αυτός που κατείχε τελευταίος την ελεγχόμενη θέση,
	// δεν έχουμε πρόβλημα.

	if (pektis == this.trapeziTelefteosGet(thesi))
	return false;

	// Η ελεγχόμενη θέση είναι καθορισμένη και ο παίκτης που επιχειρεί
	// να καταλάβει τη θέση δεν είναι αυτός που κατείχε τελευταίος τη
	// θέση, ενώ η παρτίδα έχει ήδη τελειώσει. Πρόκειται για κατάσταση
	// «κούκου», όπου ο παίκτης θα καρπωθεί τα καπίκια της συγκεκριμένης
	// θέσης χωρίς να τα έχει κερδίσει ο ίδιος.

	return true;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Η μέθοδος "kinisiPliromi" δημιουργεί κίνηση πληρωμής διανομής. Τέτοιες
// κινήσεις χρειάζονται σε αρκετές περιπτώσεις, π.χ. μετά από μη συμμετοχή
// των αμυνομένων στην αγορά, μετά από αποδεκτό claim, μετά το τέλος της
// εκτέλεσης του συμβολαίου κλπ.

Dianomi.prototype.kinisiPliromi = function() {
	var dianomi = this, kinisi;

	kinisi = new Kinisi({
		idos: 'PD',
		data: {
			trapezi: this.dianomiTrapeziGet(),
			dianomi: this.dianomiKodikosGet(),
		}
	});

	Prefadoros.thesiWalk(function(thesi) {
		kinisi.data['kasa' + thesi] = dianomi.dianomiKasaGet(thesi);
		kinisi.data['metrita' + thesi] = dianomi.dianomiMetritaGet(thesi);
	});

	return kinisi;
};

// Η μέθοδος "queryPliromi" επιστρέφει query ενημέρωσης της database με τα
// στοιχεία πληρωμής της διανομής.

Dianomi.prototype.queryPliromi = function() {
	var dianomi = this, query;

	query = 'UPDATE `dianomi` SET ';
	Prefadoros.thesiWalk(function(thesi) {
		query += '`kasa' + thesi + '` = ' + dianomi.dianomiKasaGet(thesi) + ', ';
		query += '`metrita' + thesi + '` = ' + dianomi.dianomiMetritaGet(thesi) + ', ';
	});
	query += '`telos` = NOW() WHERE `kodikos` = ' + this.dianomiKodikosGet();

	return query;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Η function "databaseUpdate" καλείται μετά την πληρωμή που ακολουθεί
// οποιαδήποτε παιγμένη διανομή, και σκοπό έχει την ενημέρωση της απόδοσης
// των παικτών στην database. Πρόκειται για function που καλείται εκτός
// transaction καθώς δεν θεωρείται ότι το στοιχείο αυτό είναι σημαντικό.

Apodosi.databaseUpdate = function(trapezi) {
	var skiniko = Server.skiniko;

	if (!skiniko.hasOwnProperty('pektis'))
	return;

	if (trapezi === undefined)
	return;

	if (typeof(trapezi) !== 'object')
	return;

	DB.connection().transaction(function(conn) {
		const comma = ', ';
		var ante = 'REPLACE INTO `peparam` (`pektis`, `param`, `timi`) VALUES ';
		var query = '';

		Prefadoros.thesiWalk(function(thesi) {
			var pektis;

			pektis = 'pektis' + thesi;

			if (!trapezi.hasOwnProperty(pektis))
			return;

			pektis = trapezi[pektis];

			if (pektis === undefined)
			return;

			if (!skiniko.pektis.hasOwnProperty(pektis))
			return;

			pektis = Server.skiniko.pektis[pektis];

			if (!pektis.hasOwnProperty('peparam'))
			return;

			if (!pektis.peparam.hasOwnProperty(Apodosi.peparamIdx))
			return;

			query += ante + '(';
			query += conn.escape(pektis.login) + ', ';
			query += conn.escape(Apodosi.peparamIdx) + ', ';
			query += conn.escape(pektis.peparam[Apodosi.peparamIdx]) + ')';

			ante = comma;
		});

		if (ante !== comma) {
			conn.rollback();
			return;
		}

		conn.query(query, function(conn, res) {
			conn.commit();
		});
	});
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Η κλάση "CPUtimes" περιγράφει αντικείμενο με τον συνολικό χρόνο λειτουργίας
// της CPU ("total") και τον συνολικό χρόνο αδρανείας της CPU ("idle"). Μπορούμε
// να περάσουμε και παράμετρο με την οποία θα εκτυπωθούν στοιχεία για τους πυρήνες
// της CPU κατά τη στιγμή της καταμέτρησης.

CPUtimes = function(print) {
	var obj = this;

	obj.total = 0;
	obj.idle = 0;

	Globals.awalk(OS.cpus(), function(i, cpu) {
		var t;

		if (print)
		Log.print(cpu.model);

		// Στο property "idle" αθροίζουμε τα idle times όλων
		// των πυρήνων της CPU.

		obj.idle += cpu.times.idle;

		// Στο property "total" αθροίζουμε όλους τους χρόνους
		// κάθε πυρήνα της CPU, συμπεριλαμβανομένων και των
		// χρόνων αδρανείας.

		for (t in cpu.times) {
			obj.total += cpu.times[t];
		}
	});
};

CPUtimes.prototype.CPUtimesTotalGet = function() {
	return this.total;
};

CPUtimes.prototype.CPUtimesIdleGet = function() {
	return this.idle;
};

// Η μέθοδος "CPUtimesLoadCalc" υπολογίζει τον φόρτο της CPU ως ποσοστό τού
// ενεργού χρόνου προς τον συνολικού χρόνο, συγκρίνοντας τα ανά χείρας data
// με data προηγούμενης καταμέτρησης την οποία περνάμε ως παράμετρο.

CPUtimes.prototype.CPUtimesLoadCalc = function(prev) {
	var total, idle;

	total = this.CPUtimesTotalGet() - prev.CPUtimesTotalGet();
	if (total <= 0) return 100;

	idle = this.CPUtimesIdleGet() - prev.CPUtimesIdleGet();
	return Math.floor(100 * ((total - idle) / total));
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Ακολουθούν projection lists των πεδίων των πινάκων που διαβάζουμε από την
// database για την επανακατασκευή του σκηνικού.

Trapezi.projection =
	'`kodikos`, ' +
	'UNIX_TIMESTAMP(`stisimo`) AS `stisimo`, ' +
	'`pektis1`, `apodoxi1`, ' +
	'`pektis2`, `apodoxi2`, ' +
	'`pektis3`, `apodoxi3`, ' +
	'UNIX_TIMESTAMP(`poll`) AS `poll`';

Trparam.projection =
	'`param`, ' +
	'`timi`';

Simetoxi.projection =
	'`trapezi`, ' +
	'`pektis`, ' +
	'`thesi`';

Telefteos.projection =
	'`trapezi`, ' +
	'`thesi`, ' +
	'`pektis`';

Arvila.projection =
	'`apo`, ' +
	'`pros`';

Dianomi.projection =
	'`kodikos`, ' +
	'`trapezi`, ' +
	'UNIX_TIMESTAMP(`enarxi`) AS `enarxi`, ' +
	'`dealer`, ' +
	'`kasa1`, `metrita1`, ' +
	'`kasa2`, `metrita2`, ' +
	'`kasa3`, `metrita3`, ' +
	'UNIX_TIMESTAMP(`telos`) AS `telos`';

Energia.projection =
	'`kodikos`, ' +
	'`dianomi`, ' +
	'`pektis`, ' +
	'`idos`, ' +
	'`data`, ' +
	'UNIX_TIMESTAMP(`pote`) AS `pote`';

Sizitisi.projection =
	'`kodikos`, ' +
	'`trapezi`, ' +
	'`pektis`, ' +
	'`sxolio`, ' +
	'UNIX_TIMESTAMP(`pote`) AS `pote`';

Sinedria.projection =
	'`pektis`, ' +
	'`klidi`, ' +
	'`ip`, ' +
	'UNIX_TIMESTAMP(`isodos`) AS `isodos`, ' +
	'`trapezi`, `thesi`, `simetoxi`';

Pektis.projection =
	'`login`, ' +
	'UNIX_TIMESTAMP(`egrafi`) AS `egrafi`, ' +
	'`onoma`, ' +
	'`email`, ' +
	'UNIX_TIMESTAMP(`poll`) AS `poll`';

Peparam.projection =
	'`param`, ' +
	'`timi`';

Sxesi.projection =
	'`sxetizomenos`, ' +
	'`sxesi`';

Profinfo.projection =
	'`sxoliastis`, ' +
	'`kimeno`';

Prosklisi.projection =
	'`kodikos`, ' +
	'`trapezi`, ' +
	'`apo`, ' +
	'`pros`, ' +
	'UNIX_TIMESTAMP(`epidosi`) AS `epidosi`';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
