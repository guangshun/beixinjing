function TowerMediatorObject(tower)
{
    //variables
    this.tower = tower;
    this.lastAttackTime = 0;
    //methods
    this.refresh = function (enemies) {
        var date = new Date();
        var t = date.getTime();
        if (t - this.lastAttackTime > this.tower.type.cold) {
            var burst = this.tower.type.burst;
            for (var i = 0; i < enemies.length; ++i) {
                if (enemies[i].isEnd) 
                    continue;
                var p = enemies[i].getMiddle();
                if (this.canHit(p.x, p.y)) {
                    var dataObject = {tower: tower, enemy:enemies[i]};
                    retrieveFacade().retrieveInstance(MEDIATOR_NAME_BATTLE).attack(dataObject);
                    this.lastAttackTime = t;
                    --burst;
                    if (--burst == 0) {
                        break;
                    }
                }
            }
        }
    }
    this.canHit = function (px, py) {
        var screenXY = getScreenXY(this.tower.position.x, this.tower.position.y);
        return Math.sqrt(Math.pow(screenXY.x + MAP_BLOCK_SIZE/2 - px,2) + Math.pow(screenXY.y + MAP_BLOCK_SIZE/2 - py,2)) <= this.tower.type.scope;
    }
    this.draw = function (canvas, image) {
        var screenXY = getScreenXY(this.tower.position.x, this.tower.position.y);
        image.draw(canvas, screenXY.x, screenXY.y, this.tower.type.id, 0);
    }
}
