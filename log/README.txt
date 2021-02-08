Στο παρόν directory κρατάμε τυχόν log files που παράγονται
από το shell script "skiser.sh". Το συγκεκριμένο πρόγραμμα
παράγει log files "skiser.out" και "skiser.err" στο "log"
directory. Πριν εκκινήσει νέος server σκηνικού κρατάμε τα
τρέχοντα log files σε αντίστοιχα files στο ίδιο directory
με επίθεμα το timestamp.

Αν, π.χ. η εκκίνηση δίνεται στις 29/10/2014, 08:33:12,
τότε τα τρέχοντα log files θα κρατηθούν ως:
skiser.out.20141029083312 και skiser.err.20141029083312.
