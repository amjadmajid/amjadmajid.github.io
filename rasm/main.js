// Clear the canvas context using the canvas width and height
function clearCanvas() {
	context.clearRect(0, 0, canvas.width, canvas.height);
    }

// e references the event object which give us the ablity to work with its properties
var putPoint = function (e) {

	var x,y;
	x =e.offsetX;
	y =e.offsetY;

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
}

var engage = function (e) {
	
	event.preventDefault();

	context.lineWidth =radius *2;
	if(!dragging)
	{
		context.beginPath();
	}
	dragging = true;
	putPoint(e);
}

var disenage =function(e){
	dragging = false;
	context.beginPath();
}

var ctxBufSize = 100;
var ctxBuf = [];
var undoBuf = [];
var ctxBufIdx = -1;

var saveContex = function(){
	ctxBuf.push( context.getImageData(0,0,canvas.width, canvas.height)) ;
	// empty the undo buffer
	undoBuf=[];

	if(ctxBuf.length > ctxBufSize){
		ctxBuf.shift();
		console.log('must not run')
	}
	
	// console.log('sxl'+ctxBuf.length);

}

// This unredo function save the `entire` canvas context
// this make
var unredo = function(e){
  var evtobj = window.event? event : e;
  if (evtobj.keyCode == 90 && evtobj.ctrlKey && !evtobj.shiftKey) {
 		if(ctxBuf.length > 1){
	  	var ctxImg = ctxBuf.pop();
	  	if(ctxImg){
	  		undoBuf.push(ctxImg);
	  		ctxImg =  ctxBuf[ ctxBuf.length-1];
		  	context.putImageData(ctxImg, 0,0);
		  	// console.log('undo');
	  }
	}

  } else if (evtobj.keyCode == 90 && evtobj.ctrlKey && evtobj.shiftKey) {
  		if(undoBuf.length > 0)
  		{
  			// console.log('redo');
  			var ctxImg = undoBuf.pop();
  			context.putImageData(ctxImg, 0,0);
  		}
	}
}


canvas.addEventListener('mousedown', engage);
canvas.addEventListener('mousemove', putPoint);
window.addEventListener('mouseup', disenage); // Attatch this event to the `window` to capture it if it is fired outside the canvas 
window.addEventListener('mouseup', saveContex);
clearBtnElm.addEventListener('mousedown', clearCanvas)
document.onkeydown = unredo;

var onlyOnceFlag = true;
window.onload = function(){
	if(onlyOnceFlag){
	saveContex();
	onlyOnceFlag = false;
	}

}



save.addEventListener('click', function(ev) {
    link.href = canvas.toDataURL();
    link.download = "rasm.png";
}, false);








