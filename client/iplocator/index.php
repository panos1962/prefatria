<?php
$locator_list = array(
	"http://www.infosniper.net/index.php?ip_address=",
	"https://db-ip.com/",
	"http://ipinfo.io/",
	"http://whatismyipaddress.com/ip/",
	"https://www.ip2location.com/demo/"
);
?>
<html>
<head>
<meta http-equiv="refresh"
content="0; URL=<?php print $locator_list[array_rand($locator_list)] . $_REQUEST["ip"]; ?>" />
</head>
</html>
