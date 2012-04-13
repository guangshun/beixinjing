function PlanMediator(canvas, towerImage)
{
    //variables
    this.name = MEDIATOR_NAME_PLAN;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.towerImage = towerImage;
    this.intervalHandle = undefined;
    this.towerSelectID = -1;
    this.towerQuery = undefined;
    this.mediator = undefined;
    //methods
    this.construct = function (canvas, towerImage) {
        this.towerSelectID = -1;
        this.mediator = new Mediator(this.name, this);
    }
    this.destruct = function() {

        if (this.intervalHandle != undefined) 
        {
            clearInterval(this.intervalHandle);
            this.intervalHandle = undefined;
        }
        this.canvas.onmouseup = null;
        this.canvas.onmousemove = null;
        this.canvas.onmouseout = null;
    }
    this.init = function () {
        assert (this.intervalHandle == undefined);
        this.intervalHandle = setInterval(this.onRefresh, VIEW_REFRESH_TIME_OUT);
        this.canvas.onmouseup = this.onMouseUp;
        this.canvas.onmousemove = this.onMouseMove;
        this.canvas.onmouseout = this.onMouseOut;
    }
    this.mouseUp = function (x, y) {
        var position = getGridXY(x, y);
        var game = retrieveFacade().retrieveInstance(PROXY_NAME_PLAYER).game;
        var tower = game.towers[position.x+'_'+position.y];
        if (tower == undefined) {
            if (this.towerSelectID >= 0) {
                dataObject = {towerTypeID: this.towerSelectID, level: 0, position:position};
                retrieveFacade().sendNotification(EVENT_EMBATTLE, dataObject);
            }
        }
        else {
            var scope;
            scope = tower.type.scope;
            var screenXY = getScreenXY(position.x, position.y);
            retrieveFacade().graphics.fillArc(this.ctx, screenXY.x + MAP_BLOCK_SIZE/2, screenXY.y + MAP_BLOCK_SIZE/2, scope, "rgba(25,174,70,0.5)");
        }
        this.towerQuery = tower;
    }

    this.onMouseUp = function (e) {
        var x = e.offsetX || e.layerX;
        var y = e.offsetY || e.layerY;
        retrieveFacade().retrieveInstance(MEDIATOR_NAME_PLAN).mouseUp(x,y);
    }
    this.mouseMove = function (x, y) {
        var position = getGridXY(x, y);
        var game = retrieveFacade().retrieveInstance(PROXY_NAME_PLAYER).game;
        var tower = game.towers[position.x+'_'+position.y];
        if (tower != undefined) {
            if (tower == this.towerQuery) {
                //do nothing for existing tower, allow upgrade/remove tower
            }
            else {
                retrieveFacade().graphics.clear(this.ctx, this.canvas.width, this.canvas.height);
            }
        }
        else {
            retrieveFacade().graphics.clear(this.ctx, this.canvas.width, this.canvas.height);
            var data = game.scenario.map.getData(position);
            if (game.scenario.map.isDefendable(data)) {
                this.towerSelectID = retrieveFacade().retrieveInstance(MEDIATOR_NAME_CONTROL).towerSelectID;
                if (this.towerSelectID >= 0) {
                    var screenXY = getScreenXY(position.x, position.y);
                    var scope = game.towerTypes[this.towerSelectID].scope;
                    this.towerImage.draw(this.canvas, screenXY.x, screenXY.y, this.towerSelectID, 0);
                    retrieveFacade().graphics.fillArc(this.ctx, screenXY.x + MAP_BLOCK_SIZE/2, screenXY.y + MAP_BLOCK_SIZE/2, scope, "rgba(25,174,70,0.5)");
                    retrieveFacade().graphics.drawRect(this.ctx, screenXY.x, screenXY.y, MAP_BLOCK_SIZE, MAP_BLOCK_SIZE, 'black');
                }
            }
        }
        this.towerQuery = tower;
    }

    this.onMouseMove = function (e) {
        var x = e.offsetX || e.layerX;
        var y = e.offsetY || e.layerY;
        retrieveFacade().retrieveInstance(MEDIATOR_NAME_PLAN).mouseMove(x,y);
    }
    this.mouseOut = function () {
        retrieveFacade().graphics.clear(this.ctx, this.canvas.width, this.canvas.height);
        this.towerSelectID = -1;
    }
    this.onMouseOut = function(e) {
        retrieveFacade().retrieveInstance(MEDIATOR_NAME_PLAN).mouseOut();
    }

    this.refresh = function () {

    }
    this.onRefresh = function() {
        retrieveFacade().retrieveInstance(MEDIATOR_NAME_PLAN).refresh();
    }
    this.construct(canvas, towerImage);
}
