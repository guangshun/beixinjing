function ControlMediator(canvas, towerImage)
{
    //variables
    this.name = MEDIATOR_NAME_CONTROL;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.towerSelectID = -1;
    this.towerImage = towerImage;
    this.mediator = undefined;
    this.intervalHandle = undefined;
    //methods
    this.construct = function (canvas, towerImage) {
        this.towerSelectID = -1;
        this.mediator = new Mediator(this.name, this);
    }
    this.destruct = function() {
        if (this.intervalHandle != undefined)
            clearInterval(this.intervalHandle);
        this.intervalHandle = undefined;
        this.canvas.onmouseup = null;
    }

    this.init = function () {
        assert (this.intervalHandle == undefined);
        this.intervalHandle = setInterval(this.onRefresh, VIEW_REFRESH_TIME_OUT);
        this.canvas.onmouseup = this.onMouseUp;
    }

    this.mouseUp = function (x, y) {
        var idx = -1;
        var game = retrieveFacade().retrieveInstance(PROXY_NAME_PLAYER).game;
        if (x > 25 && x < 25 + 50) {
            var i = parseInt((y - 100) / 70, 10);
            if ((y % 70) % 50 < 50) {
                idx = game.towerTypes[i].id;
            }
        }
        this.towerSelectID = this.towerSelectID == idx ? -1 : idx;
    }

    this.onMouseUp = function (e) {
        var x = e.offsetX || e.layerX;
        var y = e.offsetY || e.layerY;
        retrieveFacade().retrieveInstance(MEDIATOR_NAME_CONTROL).mouseUp(x,y);
    }
    this.refresh = function () {
        var game = retrieveFacade().retrieveInstance(PROXY_NAME_PLAYER).game;
        var ts = game.towerTypes;
        retrieveFacade().graphics.clear(this.ctx, this.canvas.width, this.canvas.height);
        for (var i = 0; i < ts.length; ++i) {
            this.towerImage.draw(this.canvas, 25, 100 + i * (MAP_BLOCK_SIZE + CONTROL_BLANK_WIDTH), ts[i].id, 0);
            retrieveFacade().graphics.drawText(this.ctx, ts[i].cost, 25, 100 + (i+1) * (MAP_BLOCK_SIZE + CONTROL_BLANK_WIDTH) - 10, 'orange');
        }
        if (this.towerSelectID >= 0) {
            retrieveFacade().graphics.drawRect(this.ctx, 25, 100 + this.towerSelectID * 70, 50, 50, 'red');
        }
    }
    this.onRefresh = function() {
        retrieveFacade().retrieveInstance(MEDIATOR_NAME_CONTROL).refresh();
    }
    this.construct(canvas, towerImage);
}
