<?php
session_start();
unset($_SESSION["pektis"]);
unset($_SESSION["klidi"]);
?>
<html>
<head>
</head>
<body>
<meta http-equiv="refresh" content="0; URL=<?php
print ((isset($_REQUEST) && is_array($_REQUEST) &&
	array_key_exists("url", $_REQUEST)) ?
	$_REQUEST["url"] : "http://prefadoros.gr");
?>" />
</body>
</html>
