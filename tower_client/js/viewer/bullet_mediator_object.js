function BulletMediatorObject(tower, enemy, enemies) 
{
    //variables
    this.tower = tower;
    this.enemy = enemy;
    this.enemies = enemies;
    this.x = undefined;
    this.y = undefined;
    this.over = false;
    this.bullet = undefined;
    //methods
    this.construct = function (tower, enemy, enemies) {
        var screenXY = getScreenXY(tower.position.x, tower.position.y);
        this.x = screenXY.x;
        this.y = screenXY.y
        this.bullet = this.tower.getBullet();
    }
    this.refresh = function () {
        assert (!this.over);
        var dx, dy;
        var spx, spy;
        dx = this.enemy.x - this.x;
        dy = this.enemy.y - this.y;
        if (Math.abs(dx) > Math.abs(dy)) {
            assert (dx != 0);
            spx = this.bullet.speed * ((dx > 0) ? 1 : -1);
            spy = dy/Math.abs(dx) * this.bullet.speed;
        }
        else {
            assert (dy != 0);
            spx = dx/Math.abs(dy) * this.bullet.speed;
            spy = this.bullet.speed * ((dy > 0) ? 1 : -1);
        }
        if (Math.abs(spx) > Math.abs(dx)) {
            spx = dx;
        }
        if (Math.abs(spy) > Math.abs(dy)) {
            spy = dy;
        }
        this.x += spx;
        this.y += spy;
        var es = this.getHitEnemies();
        for (var m in es) {
            es[m].hurt(this.bullet.damage);
            this.over = true;
        }
    }
    this.getHitEnemies = function () {
        var es = new Array();
        for (var m in this.enemies) {
            if (this.enemies[m].isEnd) 
                continue;
            var p = this.enemies[m].getMiddle();
            if (Math.sqrt(Math.pow(this.x - p.x, this.y - p.y)) <= this.bullet.scope)
            {
                es.push(this.enemies[m]);
            }
        }
        return es;
    }
    this.draw = function(canvas, image) {
        image.draw(canvas, this.x, this.y, this.bullet.bulletID, 0);
    }
    this.construct(tower, enemy, enemies);
}
