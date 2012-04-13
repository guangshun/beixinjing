function BattleMediator(canvas, enemyImage, bulletImage)
{
    //variables
    this.name = MEDIATOR_NAME_BATTLE;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.enemies = undefined;
    this.intervalHandle = undefined;
    this.enemyImage = enemyImage;
    this.bulletImage = bulletImage;
    this.mediator = undefined;
    this.bullets = undefined;

    //methods
    this.construct = function (canvas, enemyImage) {
        this.intervalHandle = setInterval(this.onRefresh, VIEW_REFRESH_TIME_OUT);
        this.mediator = new Mediator(this.name, this);
    }
    this.destruct = function () {
        if (this.intervalHandle != undefined)
            clearInterval(this.intervalHandle);
        this.intervalHandle = undefined;
    }
    this.init = function() {
        this.enemies = new Array();
        this.bullets = new Array();
        var game = retrieveFacade().retrieveInstance(PROXY_NAME_PLAYER).game;
        var es = game.enemies;
        for (var i = 0; i < es.length; ++i) {
            var enemy = new EnemyMediatorObject(this.canvas, this.enemyImage, es[i], (i+1)*ENEMY_LAZY_INTERLEAVE+ENEMY_LAZY, game.scenario.map);
            this.enemies.push(enemy);
        }
    }

    this.refresh = function() {
        retrieveFacade().graphics.clear(this.ctx, this.canvas.width, this.canvas.height);
        var isEnd = true;
        for (var i = 0; i < this.enemies.length; ++i) {
            var enemy = this.enemies[i];
            if (!enemy.isEnd) {
                enemy.update();
                if (enemy.isEnd) {
                    assert (enemy.life >= 0);
                    var player = retrieveFacade().retrieveInstance(PROXY_NAME_PLAYER);
                    if (enemy.life > 0) {
                        --player.life;
                        assert (player.life >= 0);
                    }
                    else {
                        player.money += enemy.type.cost * UPGRADE_COST_RATIO;
                    }
                    if (player.life == 0) {
                        retrieveFacade().resetViewer();
                        alert("you fail");
                    }
                }
                isEnd = false;
            }
        }
        if (isEnd) {
            retrieveFacade().sendNotification(EVENT_COMMIT_WAVE, null);
            clearInterval(this.intervalHandle);
        }
        else {
            var newBullets = new Array();
            for (var i = 0; i < this.bullets.length; ++i) {
                this.bullets[i].refresh();
                if (!this.bullets[i].over) {
                    this.bullets[i].draw(this.canvas, this.bulletImage);
                    newBullets.push(this.bullets[i]);
                }
            }
            this.bullets = newBullets;
        }
    }

    this.onRefresh = function () {
        var bm = retrieveFacade().retrieveInstance(MEDIATOR_NAME_BATTLE);
        bm.refresh.call(bm);
    }
    this.attack = function (dataObject) {
        this.bullets.push(new BulletMediatorObject(dataObject.tower, dataObject.enemy, this.enemies));
    }
    this.construct(canvas, enemyImage);

}
