function Viewer()
{
    this.mediators = new Object();
    this.registerMediator = registerMediator;
}

function registerMediator(name, instance)
{
    assert (this.mediators[name] == undefined);
    this.mediators[name] = instance;
}

function Mediator(name, realInstance)
{
    this.name = name;

    retrieveFacade().viewer.registerMediator(name, realInstance);
}

/*
function Enemies(canvas, enemies)
{
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.enemyList = enemies;
    this.name = MEDIATOR_NAME_ENEMIES;
    this.lazy = ENEMY_LAZY;

    this.updateEnemies = function (enemies) {
        this.enemyList = enemies;
    }

    this.onRefresh = function () {
        retrieveFacade().graphics.clear(this.ctx, this.canvas.width, this.canvas.height);

        var isEnd = true;
        if (this.lazy > 0) {
            --this.lazy;
            return;
        }
        
        for (var i = 0; i < this.enemyList.length; ++i) {
            enemy = this.enemyList[i];
            if (!enemy.isEnd && enemy.life > 0) {
                isEnd = false;
                enemy.update();
            }
        }
        if (isEnd) {
            this.enemyList = new Array();
        }
    }

    this.mediator = new Mediator(this.name, this);

}

function Enemy(canvas, img, dataObject, width, height, stageDelayCount, scenario)
{
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.img = img;
    this.speed = dataObject.speed;
    this.maxLife = dataObject.life;
    this.life = dataObject.life;
    this.id = dataObject.id;
    this.stageDelayCount = stageDelayCount;
    this.diedAt = dataObject.diedAt;
    this.scenario = scenario;
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.speed = ENEMY_SPEED;
    this.dx = 0;
    this.dy = 0;
    this.slow = false;
    this.slowCnt = SLOW_COUNT;
    this.isEnd = false;
    this.hurt = function (x) {
        assert (this.life > 0);
        this.life -= x;
        if (this.life <= 0 && this.diedAt != undefined) {
            assert (this.x == this.diedAt.x && this.y == this.diedAt.y);
        }
    }

    this.update = function () {
        assert (!this.isEnd);
        if (this.stageDelayCount > 0) {
            --this.stageDelayCount;
            var start = this.scenario.getStart();
            var position = getScreenXY(start.x, start.y, this.scenario.blockSize);
            this.x = position.x;
            this.y = position.y;
        }
        else {
            //update x, y and draw the image
            if (isHitBlockMiddle(this.x+this.width/2, this.y+this.height/2, this.scenario.blockSize)) {
                var position = getGridXY(this.x, this.y, this.scenario.blockSize);
                var type = this.scenario.map[position.x][position.y];
                if (isFinish(type)) {
                    this.isEnd = true;
                }
                else if (isDirection(type)) {
                    var direction = getDirection(type);
				    this.dx = direction.x * this.speed;
					this.dy = direction.y * this.speed;
                }
            }
            this.x += this.dx;
            this.y += this.dy;
            //draw the image
            if (this.slow) {
                retrieveFacade().graphics.drawImg(this.ctx, this.img, this.id * ENEMY_INDEX_BLOCK, ENEMY_INDEX_BLOCK, this.width,this.height,this.x,this.y,this.width,this.height);
            }
            else {
                retrieveFacade().graphics.drawImg(this.ctx, this.img, this.id * ENEMY_INDEX_BLOCK, 0, this.width,this.height,this.x,this.y,this.width,this.height);
            }
            var lifeX = Math.floor(this.life / this.maxLife * this.width);
            retrieveFacade().graphics.fillRect(this.ctx, this.x, this.y-5, lifeX, 3, "rgba(255, 0, 0, 0.8)");
        }
    }
}






function GameView(canvas, img)
{
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.name = MEDIATOR_NAME_GAMEVIEW;
    this.img = img;
    this.selectIdx = -1;

    this.init = function() {
        for (var i = 0; i < 5; ++i)
            retrieveFacade().graphics.drawImg(this.ctx, this.img, i*50, 0, 50, 50, 25, 100+i*70, 50, 50);
        retrieveFacade().graphics.drawText(this.ctx,"50(↑50)",25,160,'orange');
        retrieveFacade().graphics.drawText(this.ctx,"75(↑75)",25,230,'orange');
        retrieveFacade().graphics.drawText(this.ctx,"100(↑100)",20,300,'orange');
        retrieveFacade().graphics.drawText(this.ctx,"125(↑125)",20,370,'orange');
        retrieveFacade().graphics.drawText(this.ctx,"150(↑150)",20,440,'orange');
    }
    this.onRefresh = function () {
        //retrieveFacade().graphics.clear(this.ctx,100,100);
        retrieveFacade().graphics.clear(this.ctx,100,500);
        var info = retrieveFacade().retrieveInstance(PROXY_NAME_GAME).Info;
        //FIXME: need get data from model
        var score = info.money;
        var mission = info.bout;
        var life = info.life;
        retrieveFacade().graphics.drawText(this.ctx, "金钱:"+ score, 20, 30, "red");
        retrieveFacade().graphics.drawText(this.ctx, "第"+ mission + "波", 20, 60, "red");
        retrieveFacade().graphics.drawText(this.ctx, "剩余:"+ life, 20, 90, "red");

        for (var i = 0; i < 5; ++i)
            retrieveFacade().graphics.drawImg(this.ctx, this.img, i*50, 0, 50, 50, 25, 100+i*70, 50, 50);
        retrieveFacade().graphics.drawText(this.ctx,"50(↑50)",25,160,'orange');
        retrieveFacade().graphics.drawText(this.ctx,"75(↑75)",25,230,'orange');
        retrieveFacade().graphics.drawText(this.ctx,"100(↑100)",20,300,'orange');
        retrieveFacade().graphics.drawText(this.ctx,"125(↑125)",20,370,'orange');
        retrieveFacade().graphics.drawText(this.ctx,"150(↑150)",20,440,'orange');

        if (this.selectIdx >= 0) {
            retrieveFacade().graphics.drawRect(this.ctx, 20, 100 + this.selectIdx * 70, 60, 50, 'red');
        }
    }

    this.onMouseDown = function (e) {
        var x = e.offsetX || e.layerX; 
        var y = e.offsetY || e.layerY; 
        var idx = retrieveFacade().retrieveInstance(MEDIATOR_NAME_GAMEVIEW).selectIdx;
        if (x > 25 && x < 25 + 50) {
            var i = parseInt((y - 100) / 70, 10);
            if ((y % 70) % 50 < 50) {
                idx = idx == i ? -1 : i;
            }
        }
        retrieveFacade().retrieveInstance(MEDIATOR_NAME_GAMEVIEW).selectIdx = idx;
    }

    this.canvas.onmousedown = this.onMouseDown;

    this.mediator = new Mediator(this.name, this);
    this.init();
}

function BattleView(canvas, img, btnImg, scenario)
{
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.name = MEDIATOR_NAME_BATTLEVIEW;
    this.img = img;
    this.btnImg = btnImg;
    this.scenario = scenario;
    this.towerList = new Array();
    this.towerCandidate = -1;
    this.towerSelect = -1;

    this.init = function() {
    }
    this.onRefresh = function () {
    }

    this.onMouseDown = function (e) {
        var x = e.offsetX || e.layerX; 
        var y = e.offsetY || e.layerY; 
        var bv = retrieveFacade().retrieveInstance(MEDIATOR_NAME_BATTLEVIEW);
        var position = getGridXY(x, y, bv.scenario.blockSize);
        if (bv.towerCandidate >= 0) {
            retrieveFacade().graphics.clear(bv.ctx, bv.canvas.width, bv.canvas.height);
            var positionX = {x: position.x * bv.scenario.blockSize + bv.scenario.blockSize/2, y: position.y * bv.scenario.blockSize + bv.scenario.blockSize/2};
            var game = retrieveFacade().retrieveInstance(PROXY_NAME_GAME);
            assert (game.getDefenderIndexAt(position.x, position.y) == -1);
            retrieveFacade().sendNotification(COMMAND_EVENT_EMBATTLE, {id: bv.towerCandidate, position: position, positionX: positionX, level: 0});
            bv.towerCandidate = -1;
        }
        else {
            var game = retrieveFacade().retrieveInstance(PROXY_NAME_GAME);
            var tower = game.getDefenderAt(position.x, position.y);
            if (tower) {
                var idx = game.getDefenderIndexAt(position.x, position.y);
                retrieveFacade().graphics.clear(bv.ctx, bv.canvas.width, bv.canvas.height);
                if (idx == bv.towerSelect) {
                    if(tower.level + 1 < tower.defenderTypes.length)  {
                        var mx, my;
                        mx = x % bv.scenario.blockSize;
                        my = y % bv.scenario.blockSize;
                        if (mx <= bv.scenario.blockSize/2 && my <= bv.scenario.blockSize/2) {
                            retrieveFacade().sendNotification(COMMAND_EVENT_UPGRADE_DEFENDER, {position: position, positionX: positionX, defender: tower});
                        }
                        else if (mx > bv.scenario.blockSize/2 && my > bv.scenario.blockSize/2) {
                            retrieveFacade().sendNotification(COMMAND_EVENT_REMOVE_DEFENDER, {position: position, positionX: positionX, defender: tower});
                        }
                    }
                    bv.towerSelect = -1;
                }
                else {
                    retrieveFacade().graphics.fillArc(bv.ctx, tower.positionX.x, tower.positionX.y, tower.scope, "rgba(25,174,70,0.5)"); 
                    if(tower.level + 1 < tower.defenderTypes.length) retrieveFacade().graphics.drawImg(bv.ctx, bv.btnImg, 0, 0, 20, 20, tower.positionX.x - bv.scenario.blockSize/2, tower.positionX.y - bv.scenario.blockSize/2, 20, 20);
                    retrieveFacade().graphics.drawImg(bv.ctx, bv.btnImg, 20, 0, 20, 20, tower.positionX.x - bv.scenario.blockSize/2 + 30, tower.positionX.y - bv.scenario.blockSize/2 + 30, 20, 20);
                    bv.towerSelect = game.getDefenderIndexAt(position.x, position.y);
                }
            }
        }
    }

    this.onMouseMove = function (e) {
        var x = e.offsetX || e.layerX; 
        var y = e.offsetY || e.layerY; 
        var bv = retrieveFacade().retrieveInstance(MEDIATOR_NAME_BATTLEVIEW);
        var position = getGridXY(x, y, bv.scenario.blockSize);
        var game = retrieveFacade().retrieveInstance(PROXY_NAME_GAME);
        var idx = game.getDefenderIndexAt(position.x, position.y);
        bv.towerCandidate = -1;
        if (idx == bv.towerSelect && bv.towerSelect >= 0) {
            //do nothing
        }
        else {
            bv.towerSelect = -1;
            retrieveFacade().graphics.clear(bv.ctx, bv.canvas.width, bv.canvas.height);
            if (idx < 0) {
                if (bv.scenario.isDefendable(position.x, position.y)) {
                    bv.towerCandidate = retrieveFacade().retrieveInstance(MEDIATOR_NAME_GAMEVIEW).selectIdx;
                    if (bv.towerCandidate >= 0) {
                        var px, py;
                        var scope;
                        px = position.x * bv.scenario.blockSize;
                        py = position.y * bv.scenario.blockSize;
                        scope = bv.scenario.defenderType[bv.towerCandidate][0].scope;
                        retrieveFacade().graphics.drawImg(bv.ctx, bv.img, bv.towerCandidate*50, 0, 50, 50, px, py, 50, 50);
                        retrieveFacade().graphics.fillArc(bv.ctx, px + bv.scenario.blockSize/2, py + bv.scenario.blockSize/2, scope, "rgba(25,174,70,0.5)"); 
                        retrieveFacade().graphics.drawRect(bv.ctx, px, py, bv.scenario.blockSize, bv.scenario.blockSize, 'black');
                    }
                }
            }
        }
    }

    this.onMouseOut = function(e) {
        var bv = retrieveFacade().retrieveInstance(MEDIATOR_NAME_BATTLEVIEW);
        bv.towerCandidate = -1;
        retrieveFacade().graphics.clear(bv.ctx, bv.canvas.width, bv.canvas.height);
    }

    this.canvas.onmousedown = this.onMouseDown;
    this.canvas.onmousemove = this.onMouseMove;
    this.canvas.onmouseout = this.onMouseOut;

    this.mediator = new Mediator(this.name, this);
    this.init();
}


function TowerView(canvas, img, scenario)
{
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.name = MEDIATOR_NAME_TOWERVIEW;
    this.img = img;
    this.scenario = scenario;
    this.towerList = new Array();

    this.init = function() {
    }
    this.onRefresh = function () {
        var enemies = retrieveFacade().retrieveInstance(MEDIATOR_NAME_ENEMIES).enemyList;
        var towers = retrieveFacade().retrieveInstance(PROXY_NAME_GAME).defenderList;
        for (var i = 0; i < towers.length; ++i) {
            var tower = towers[i];
            if (!tower.isCold())  {
                continue;
            }
            var numBullet = tower.numBullet;
            for (var j = 0; j < enemies.length; ++j) {
                if (!enemies[j].isEnd && enemies[j].life > 0) {
                    if (tower.canHit(enemies[j].x, enemies[j].y)) {
                        tower.attack();
                        retrieveFacade().retrieveInstance(MEDIATOR_NAME_BULLETVIEW).addBullet(enemies[j], tower.bulletType[tower.level], tower.positionX.x, tower.positionX.y);
                        --numBullet;
                        if (numBullet == 0) 
                            break;
                    }
                }
            }
        }
    }

    this.addTower = function (dataObject) {
        var game = retrieveFacade().retrieveInstance(PROXY_NAME_GAME);
        assert (game.getDefenderIndexAt(dataObject.position.x, dataObject.position.y) >= 0);
        var px, py;
        px = dataObject.position.x * this.scenario.blockSize;
        py = dataObject.position.y * this.scenario.blockSize;
        retrieveFacade().graphics.drawImg(this.ctx, this.img, dataObject.id*50, 0, 50, 50, px, py, 50, 50);
    }

    this.removeTower = function (dataObject) {
        var game = retrieveFacade().retrieveInstance(PROXY_NAME_GAME);
        assert (game.getDefenderIndexAt(dataObject.position.x, dataObject.position.y) == -1);
        var px, py;
        px = dataObject.position.x * this.scenario.blockSize;
        py = dataObject.position.y * this.scenario.blockSize;
        retrieveFacade().graphics.clearRect(this.ctx, px, py, this.scenario.blockSize, this.scenario.blockSize);
    }

    this.mediator = new Mediator(this.name, this);
    this.init();
}

function BulletView(canvas, img)
{
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.name = MEDIATOR_NAME_BULLETVIEW;
    this.bulletList = new Array();
    this.img = img;
    this.init = function() {
    }
    this.onRefresh = function () {
        var bulletList = new Array();
        for (var i = 0; i < this.bulletList.length; ++i) {
            var bullet = this.bulletList[i];
            if (!bullet.isOver) {
                bullet.update();
                retrieveFacade().graphics.drawImg(this.ctx, bullet.img, bullet.bulletType.imgID * 10, 0, 10, 10, bullet.x, bullet.y, 10, 10);
                bulletList.push(bullet);
            }
        }
        this.bulletList = bulletList;
    }

    this.addBullet = function(enemy, bulletType, x, y) {
        var bullet = new BulletObject(this.img, enemy, bulletType, x, y, this.canvas.width, this.canvas.height);
        this.bulletList.push(bullet);
    }

    this.mediator = new Mediator(this.name, this);
    this.init();
}

function BulletObject(img, enemy, bulletType, x, y, width, height)
{
    this.img = img;
    this.enemy = enemy;
    this.bulletType = bulletType;
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.width = width;
    this.height = height;
    this.isOver = false;
    this.speed = BULLET_SPEED;
    this.firstUpdate = true;
    this.isAutoTarget = function () {
        return this.bulletType.autoTarget;
    }

    this.update = function(){
        if (this.enemy.isEnd || this.enemy.life <= 0) {
            this.isOver = true;
            return;
        }
        if (this.isAutoTarget() || this.firstUpdate) {
            var ydif = Math.abs(this.y - this.enemy.y - 15),
                xdif = Math.abs(this.x - this.enemy.x - 15);
            
            if(ydif >= xdif){
                this.dy = this.speed;
                this.dx = Math.floor(this.speed * (xdif / ydif));
            } 
            else {
                this.dx = this.speed;
                this.dy = Math.floor(this.speed * (ydif / xdif));
            } 
            this.firstUpdate = false;
        }

        this.x += this.x >= this.enemy.x ? -this.dx: this.dx;
        this.y += this.y > this.enemy.y ? -this.dy: this.dy;
        if (this.x >= this.width || this.x <= 0 || this.y >= this.height || this.y <= 0) {
            this.isOver = true;
        }
        if (this.x >= this.enemy.x && this.x <= this.enemy.x + 50 && this.y >= this.enemy.y && this.y <= this.enemy.y + 50) {
            this.enemy.hurt(this.bulletType.hurt);
            this.isOver = true;
        }
    }
}
*/

//test if hit the middle point of the block
function isHitBlockMiddle(screenX, screenY)
{
    var blockSize = MAP_BLOCK_SIZE;
    var border = blockSize / 8;
    var middle = blockSize / 2;
    var leftoverX = screenX % blockSize;
    var leftoverY = screenY % blockSize;
    var distanceX = leftoverX < middle ? middle - leftoverX : leftoverX - middle;
    var distanceY = leftoverY < middle ? middle - leftoverY : leftoverY - middle;
    return (distanceX < border && distanceY < border);
}


function getScreenXY(x, y)
{
    var x = x * MAP_BLOCK_SIZE;
    var y = y* MAP_BLOCK_SIZE;
    return {'x': x, 'y': y};
}

//get X,Y in the grid which is composited by block.
function getGridXY(screenX, screenY)
{
    var blockSize = MAP_BLOCK_SIZE;
    var x = parseInt(screenX/blockSize, 10);
    var y = parseInt(screenY/blockSize, 10);
    return {'x': x, 'y': y};
}

