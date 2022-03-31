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
print (Globals::perastike("url") ? $_REQUEST["url"] : Globals::$server);
?>" />
</body>
</html>
