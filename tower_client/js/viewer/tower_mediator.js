function TowerMediator(canvas, towerImage)
{
    //variables
    this.name = MEDIATOR_NAME_TOWER;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.towerImage = towerImage;
    this.towers = new Array();
    this.intervalHandle = undefined;
    this.mediator = undefined;
    //methods
    this.construct = function (canvas, towerImage) {
        this.mediator = new Mediator(this.name, this);
    }
    this.init = function() {
        this.intervalHandle = setInterval(this.onRefresh, VIEW_REFRESH_TIME_OUT);
    }
    this.destruct = function() {
        if (this.intervalHandle) {
            clearInterval(this.intervalHandle);
            this.intervalHandle = undefined;
        }
        this.towers = new Array();
        
    }
    this.update = function () {
        retrieveFacade().graphics.clear(this.ctx, this.canvas.width, this.canvas.height);
        for (var m in this.towers) {
            this.towers[m].draw(this.canvas, this.towerImage);
        }
    }
    this.refresh = function () {
        var enemies = retrieveFacade().retrieveInstance(MEDIATOR_NAME_BATTLE).enemies;
        for (var t in this.towers) {
            var tower = this.towers[t];
            tower.refresh(enemies);
        }
    }
    this.onRefresh = function () {
        retrieveFacade().retrieveInstance(MEDIATOR_NAME_TOWER).refresh();
    }
    this.addTower = function(dataObject) {
        var game = retrieveFacade().retrieveInstance(PROXY_NAME_PLAYER).game;
        tower = game.towers[dataObject.position.x + '_' + dataObject.position.y];
        assert (tower != undefined);
        this.towers.push(new TowerMediatorObject(tower));
        this.update();
    }
    this.removeTower = function(dataObject) {
        var idx;
        for (idx = 0; idx < this.towers.length; ++idx) {
            if (this.towers[i].position.x == dataObject.position.x && 
                this.towers[i].position.y == dataObject.position.y)
                break;
        }
        assert (idx < this.towers.length);
        this.towers.splice(idx, 1);
        this.update();
    }

    this.construct(canvas, towerImage);
}
