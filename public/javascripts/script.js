var $create = $('.create')
var $browse = $('.browse')
var $createBoard = $('.create-board')
var $browseBoard = $('.browse-board')
var map1 = document.getElementById('map1')

$create.click(function(){
	$createBoard.css('display','block')
	$browseBoard.css('display','none')


})
$browse.click(function(){
	$createBoard.css('display','none')
	$browseBoard.css('display','block')
})

