
// Clear the canvas context using the canvas width and height
function clearCanvas_touch() {
	context.clearRect(0, 0, canvas.width, canvas.height);
    e.preventDefault();
    }

// e references the event object which give us the ablity to work with its properties
var putPoint_touch = function (e) {

	if(e.touches)
	{
		 var touch = e.touches[0]; // Get the information for finger #1
		 x=touch.pageX-touch.target.offsetLeft;
         y=touch.pageY-touch.target.offsetTop;
	}

	if(dragging){

		context.lineTo(x, y);
		context.stroke(); // draw a line

		//start a new drawing
		context.beginPath();
		context.arc(x, y, radius ,0, 2*Math.PI);
		context.fill();

		//start a new drawing
		context.beginPath();
		// ancher the mouse position
		context.moveTo(x, y);
		}
		e.preventDefault();
}

var engage_touch = function (e) {
	
	context.lineWidth =radius *2;
	if(!dragging)
	{
		context.beginPath();
	}
	dragging = true;
	putPoint_touch(e);
	e.preventDefault();
}

var disenage_touch =function(e){
	dragging = false;
	context.beginPath();
	e.preventDefault();
}



canvas.addEventListener('touchstart', engage_touch);
canvas.addEventListener('touchmove', putPoint_touch);
window.addEventListener('touchend', disenage_touch); // Attatch this event to the `window` to capture it if it is fired outside the canvas 
clearBtnElm.addEventListener('touchstart', clearCanvas_touch)



save.addEventListener('touchstart', function(ev) {
    link.href = canvas.toDataURL();
    link.download = "rasm.png";
    e.preventDefault();
}, false);









