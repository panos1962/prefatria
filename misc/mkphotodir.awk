#!/usr/bin/awk -f

# Το παρόν χρησιμοποιείται μια φορά για την κατασκευή της υποδομής που απαιτείται στο
# directory structure της εφαρμογής προκειμένου να μπορούν οι χρήστες να «ανεβάζουν»
# φωτογραφίες προφίλ.
#
# Το παρόν πρέπει να αποκτήσει execute permission και να εκτελεστεί στο directory "client"
# της εφαρμογής. Θα δημιουργηθεί subdirectory "photo" και κάτω από αυτό το directory θα
# δημιουργηθούν subdirectories "a", "b", "c",… "z" με πρόσβαση για όλους τους χρήστες.

BEGIN {
	if (system("mkdir photo && chmod 755 photo"))
	exit(1)

	for (i = 97; i < 123; i++) {
		dir = sprintf("photo/%c", i)
		cmd = "mkdir " dir " && chmod 755 " dir
		system(cmd)
	}

	exit(0)
}
