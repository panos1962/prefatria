<?php
$dlist = array(
"activeRadio"			=> array( "w" => 728, "h" => 130),
"activeGeodim"			=> array( "w" => 728, "h" => 121),
"bridgeSchoolBlue"		=> array( "w" => 728, "h" => 90),
"bridgeSchoolGreen"		=> array( "w" => 728, "h" => 130),
"carousel"			=> array( "w" => 800, "h" => 200),
"conAnima"			=> array( "w" => 728, "h" => 90),
"kelsos"			=> array( "w" => 728, "h" => 170),
"pep"				=> array( "w" => 728, "h" => 90),
"protathlima/aprilios2015"	=> array( "w" => 728, "h" => 90),
"thankYou"			=> array( "w" => 830, "h" => 390)
);

$diafimisi = "carousel";

$w = $dlist[$diafimisi]["w"];
$h = $dlist[$diafimisi]["h"];
?>
<iframe src="depo/<?php print $diafimisi; ?>" style="border-style: none; width: <?php
	print $w; ?>px; min-width: <?php print $w; ?>px; max-width: <?php print $w; ?>px; height: <?php
	print $h; ?>px; min-height: <?php print $h; ?>px; max-height: <?php print $h; ?>px;"></iframe>
