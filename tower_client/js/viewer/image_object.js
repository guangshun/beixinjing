function ImageObject(img, elementWidth, elementHeight)
{
    //variables
    this.img = img;
    this.elementHeight = elementHeight;
    this.elementWidth = elementWidth;

    //methods
    this.draw = function (canvas, x, y, id, alter) {
        assert (alter == 0 || alter == 1);
        retrieveFacade().graphics.drawImg(canvas.getContext('2d'), this.img, id * this.elementWidth, alter * this.elementHeight, this.elementWidth,this.elementHeight, x, y,this.elementWidth,this.elementHeight);
    }

    this.getElementWidth = function() {
        return this.elementWidth;
    }
    this.getElementHeight = function() {
        return this.elementHeight;
    }
}
