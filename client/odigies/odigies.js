
/*
	public static function odigies() {
Page::epikefalida(Globals::perastike('pedi'), '<div id="tutorialVideos" ' .
	'class="odigiesTutorialVideos">[&nbsp;<a target="_self" ' .
	'href="http://www.youtube.com/playlist?list=PL07F1583FEB191C3D&amp;feature=mh_lolz">' .
	'Εκπαιδευτικά βίντεο</a>&nbsp;]</div>');
?>
<script type="text/javascript">
//<![CDATA[
function kouniseTutorialVideo(div, i) {
	if (notSet(div)) { return; }
	if (i > 10) {
		div.setAttribute('class', 'odigiesTutorialVideos');
		return;
	}

	div.setAttribute('class', 'odigiesTutorialVideos' + (i % 2));
	setTimeout(function() {
		kouniseTutorialVideo(div, i + 1);
	}, 100);
}
*/

$(document).ready(function() {
	Client.tabKlisimo();
	Client.tabPektis();
	$('#odigiesEnimerotiko').append(Client.klisimo()).siromeno({
		top: '20px',
		right: '20px',
	}).finish().delay(1000).fadeIn(500);
	//kouniseTutorialVideo(getelid('tutorialVideos'), 0);
});
