function EnemyMediatorObject(canvas, img, enemy, stageDelayCount, map)
{
    //variables
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.img = img;
    this.speed = enemy.speed;
    this.maxLife = enemy.life;
    this.life = enemy.life;
    this.type = enemy.type;
    this.id = enemy.id;
    this.stageDelayCount = stageDelayCount;
    this.diedAt = enemy.diedAt;
    this.map = map;
    this.x = 0;
    this.y = 0;
    this.width = img.getElementWidth();
    this.height = img.getElementHeight();
    this.dx = 0;
    this.dy = 0;
    this.slow = false;
    this.slowCnt = ENEMY_SLOW_COUNT;
    this.isEnd = false;

    //method
    this.hurt = function (x) {
        assert (this.life > 0);
        if (this.life < x) {
            this.life = 0;
            this.isEnd = true;
        }
        else
            this.life -= x;
        
        if (this.life <= 0 && this.diedAt != undefined) {
            assert (this.x == this.diedAt.x && this.y == this.diedAt.y);
        }
    }

    this.update = function () {
        assert (!this.isEnd);
        if (this.stageDelayCount > 0) {
            --this.stageDelayCount;
            var start = this.map.getStart(this.id);
            var position = getScreenXY(start.x, start.y);
            this.x = position.x;
            this.y = position.y;
        }
        else {
            //update x, y and draw the image
            if (isHitBlockMiddle(this.x+this.width/2, this.y+this.height/2)) {
                var position = getGridXY(this.x, this.y);
                var data = this.map.getData(position);
                if (this.map.isFinish(data)) {
                    this.isEnd = true;
                }
                else if (this.map.isDirection(data)) {
                    var direction = this.map.getDirection(data, this.id);
				    this.dx = direction.x * this.speed;
					this.dy = direction.y * this.speed;
                }
            }
            this.x += this.dx;
            this.y += this.dy;
            //draw the image
            this.img.draw(this.canvas, this.x, this.y, this.type.id, this.slow);
            var lifeX = Math.floor(this.life / this.maxLife * this.width);
            retrieveFacade().graphics.fillRect(this.ctx, this.x, this.y-5, lifeX, 3, "rgba(255, 0, 0, 0.8)");
        }
    }
    this.getMiddle = function () {
        return {x: this.x + this.width/2, y: this.y + this.height/2};
    }
}

