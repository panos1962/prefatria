////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Το παρόν service ονομάζεται "stop" και σκοπό έχει τη διακοπή της λειτουργίας
// του Node server, και συνεπώς όλου του ιστοτόπου.

Log.print('service module: stop');

Service.stop = function(nodereq) {
	nodereq.end();
	console.log('stop request (IP: ' + nodereq.ipGet() + ')');
	process.kill(process.pid, 'SIGTERM');
}
