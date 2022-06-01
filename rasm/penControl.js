var step = 2;

var penSize_h= document.getElementById("radcontroler");
var radval_h= document.getElementById("radval");
// COLOR Control
var swatches = document.getElementsByClassName("swatch");

for(var i= 0, n=swatches.length; i<n; i++)
{
	swatches[i].addEventListener('mousedown', setSwatch, false);
	swatches[i].addEventListener('touchstart', setSwatch_touch, false);
}

var penSize = function( step ){
	radius=step;
	radval_h.innerHTML = radius;
}


penSize_h.addEventListener('input', function(){ 
	penSize(penSize_h.value); 
});


var setColor = function(c){
	context.strokeStyle=c;
	context.fillStyle=c;
}


function setSwatch(e) // the here is the event object, it is passed back to the function by the eventLitener
{
	// identify swatch
	var swatch = e.target;
	var color= swatch.style.backgroundColor;
	setColor(color);
	var prevActive =  document.querySelector('.swatch.active');
	prevActive.className = "swatch"; 
	swatch.className = "swatch active";
}

function setSwatch_touch(e)
{
	e.preventDefault();
	setSwatch(e);
	console.log("touched the button");

} 


setColor('black');