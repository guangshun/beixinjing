function assert(exp, message) {
  if (!exp) {
    throw new AssertException(message);
  }
}

function Graphics()
{
   this.clear = function(cxt,x,y) {
        cxt.clearRect(0,0,x,y);
   }

   this.clearRect = function(cxt,x,y,width,height){
		cxt.clearRect(x,y,width,height);
   }

   this.drawImg = function(cxt,img,x,y,sw,sh,dx,dy,dw,dh){
         if(!sw) cxt.drawImage(img,x,y);
		 else cxt.drawImage(img,x,y,sw,sh,dx,dy,dw,dh);
    }
   this.drawText = function(cxt,string,x,y,color){
         cxt.fillStyle = color;
         //FIXME: need remove font
         cxt.font = 'bold 12px sans-serif';
         cxt.fillText(string,x,y);
    }
	this.fillRect = function(cxt,x,y,width,height,color){
		cxt.fillStyle = color;
		cxt.fillRect(x,y,width,height);
	}
	this.drawRect = function(cxt,x,y,width,height,color){
		cxt.strokeStyle = color;
		cxt.lineWidth = 1;
		cxt.strokeRect(x,y,width,height);
	}
	this.fillArc = function(cxt,x,y,radius,color){
		cxt.fillStyle = color;
		cxt.beginPath();
		cxt.arc(x,y,radius,0,Math.PI*2,true);
		cxt.closePath();
		cxt.fill();
	}

	this.pointInRect = function(point,rect){
		if(point.x >= rect.x && point.x <= (rect.x+rect.width)
			&& point.y >= rect.y && point.y <= (rect.y + rect.height))
            return true;
		return false;
	}
	this.circleInCircle = function(cir1,cir2){
		if(Math.sqrt(Math.pow(cir1.x-cir2.x,2)+Math.pow(cir1.y-cir2.y,2)) < (cir1.radius+cir2.radius))
            return true;
		return false;
	}
	this.rectInCircle = function(rect,cir){
		var x1 = rect.x,y1 = rect.y, x2 = rect.x+rect.width,y2= rect.y+rect.height;
		if(Math.sqrt(Math.pow(x1-cir.x,2)+Math.pow(y1-cir.y,2)) < cir.radius ||
			Math.sqrt(Math.pow(x1-cir.x,2)+Math.pow(y2-cir.y,2)) < cir.radius ||
			Math.sqrt(Math.pow(x2-cir.x,2)+Math.pow(y2-cir.y,2)) < cir.radius ||
			Math.sqrt(Math.pow(x2-cir.x,2)+Math.pow(y1-cir.y,2)) < cir.radius)
			return true;
		return false;
	}
	this.loadImg = function(imgs,callback,context) {
		var count = imgs.length;
		function loaded() {
			count--;
			if(count <= 0)
                callback.call(context);
		}
		for(var i=0,l=imgs.length;i<l;i++) {
			var img = new Image();
			img.onload = loaded;
			img.src = imgs[i];
		}
	}
}

/*
Array.prototype.index = function(obj){
	for(var i=0,l=this.length;i<l;i++){
		if(obj == this[i]) {
			return i;
		}
	}
	return -1;
}
Array.prototype.remove = function(obj){
	for(var i=0,l=this.length;i<l;i++){
		if(obj == this[i]) {
			this.splice(i,1);
			break;
		}
}
*/
