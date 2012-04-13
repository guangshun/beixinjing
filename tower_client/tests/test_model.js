function ModelTest() 
{
    this.tests = new Array();
    this.addTest = function (test) {
        this.tests.push(test);
    }

    this.getScenarios = function() {
        var scenarios = new Array();
        for (var n = 0; n < 2; ++n) {
            var map = new MapObject(new Array());
            var enemies = new Array();
            //insert 2 waves enemies
            for (var i = 0; i < 2; ++i) {
                enemies.push(new Array());
                for (var j = 0; j < 20; ++j) {
                    enemies[i].push({type: 1, level: 1});
                }
            }
            var scenario = new ScenarioObject(map, enemies);
            scenarios.push(scenario);
        }
        return scenarios;
    }

    this.getTowerTypes = function() {
        return [{name: 'tower_0', id: 0, life: 100, cost: 50, speed: 2, cold: 100, damage: 20, scope: 50, burst: 1, slow: 0, steal: 0, bulletID: 1, bulletScope: 0, bulletSpeed: 5},
                {name: 'tower_1', id: 1, life: 150, cost: 100, speed: 2, cold: 100, damage: 30, scope: 70, burst: 1, slow: 0, steal: 0, bulletID: 2, bulletScope: 0, bulletSpeed: 5}
        ];
    }

    this.init = function () {
        this.addTest(this.testRegisterProxy);
        this.addTest(this.testUnregisterProxy);
        this.addTest(this.testEnemyObject);
        this.addTest(this.testGameProxy);
        this.addTest(this.testPlayerProxy);
    }
    this.setUp = function () {
    }
    this.tearDown = function () {
        resetFacade();
    }
    this.testRegisterProxy = function () {
        var model = retrieveFacade().model;
        var inst1 = 123;
        model.registerProxy('hello', inst1);

        var inst2 = retrieveFacade().retrieveInstance('hello');
        assert (inst1 == inst2);
        return true;
    }
    this.testUnregisterProxy = function () {
        var model = retrieveFacade().model;
        var inst1 = 123;
        model.registerProxy('hello', inst1);

        var inst2 = retrieveFacade().retrieveInstance('hello');
        assert (inst1 == inst2);
        model.unregisterProxy('hello', inst1);
        return true;
    }
    this.testEnemyObject = function() {
        var name = 'enemy1';
        var id = 0;
        var life = 100;
        var cost = 100;
        var speed = 10;
        var cold = 100;
        var damage = 100;
        var scope = 10;
        var burst = 1;
        var slow = 0;
        var steal = 0;
        var bulletID = 0;
        var bulletSpeed = 20;
        var characterTypeObject = new CharacterTypeObject(name, id, life, 
                cost, speed, cold, damage, scope, burst, slow, steal, bulletID, bulletSpeed);
        var enemyObject = new EnemyObject(characterTypeObject, 1);
        var diedAt = {x:0, y:0};
        enemyObject.setDiedAt(diedAt);
        assert (diedAt.x == enemyObject.diedAt.x && diedAt.y == enemyObject.diedAt.y);
        return true;
    }

    this.testGameProxy = function () {
        var gameProxy = new GameProxy(0);
        var scenarios = this.getScenarios();
        var scenario = scenarios[0];
        var towerTypes = this.getTowerTypes();
        this.getNotification = false;
        this.dummyCallback = function (notification) {
            this.getNotification = true;
        }
        retrieveFacade().registerNotifier({e:EVENT_COMMIT_GAME, callback: this.dummyCallback, instance: this});
        retrieveFacade().registerNotifier({e:EVENT_EMBATTLE_ACK, callback: this.dummyCallback, instance: this});
        retrieveFacade().registerNotifier({e:EVENT_UNEMBATTLE_ACK, callback: this.dummyCallback, instance: this});
        retrieveFacade().registerNotifier({e:EVENT_COMMIT_WAVE_ACK, callback: this.dummyCallback, instance: this});


        gameProxy.init(scenario, towerTypes);
        var scenario2 = scenarios[1];
        gameProxy.set('scenario', scenario2);
        assert (gameProxy.get('scenario') ==  scenario2);

        assert (gameProxy.get('result') == null);

        //test add/remove 
        var dataObject =  {towerTypeID: 0, level: 1234, position: {x: 10, y: 10}};
        assert (!this.getNotification);
        assert (gameProxy.towers['10_10'] == undefined);
        gameProxy.add(dataObject);
        assert (this.getNotification);
        assert (gameProxy.towers['10_10'].level = 1234);
        this.getNotification = false;
        assert (gameProxy.towers['10_10'].type.id == 0);
        gameProxy.remove({position: {x:10, y:10}});
        assert (gameProxy.towers['10_10'] == undefined);
        assert (this.getNotification);
        this.getNotification = false;

        //test commit
        this.getNotification = false;
        assert (!this.getNotification);
        assert (gameProxy.get('waveID') == 0);
        gameProxy.set('commit', null);
        assert (gameProxy.get('waveID') == 1);
        assert (this.getNotification);
        this.getNotification = false;

        gameProxy.set('commit', null);
        assert (gameProxy.get('waveID') == scenario2.enemies.length);
        assert (gameProxy.get('waveID') == 2);
        return true;
    }

    this.testPlayerProxy = function() {
        this.getNotification = false;
        this.dummyCallback = function (notification) {
            this.getNotification = true;
        }
        retrieveFacade().registerNotifier({e:EVENT_COMMIT_GAME_ACK, callback: this.dummyCallback, instance: this});

        var playerProxy = new PlayerProxy();
        var scenarios = this.getScenarios();
        var towerTypes = this.getTowerTypes();
        playerProxy.init(scenarios, towerTypes);
        assert (playerProxy.get('score') == 0);
        assert (!playerProxy.get('gameOn'));

        assert (playerProxy.get('money') == PLAYER_INIT_MONEY);
        playerProxy.set('money', 100);
        assert (playerProxy.get('money') == 100);

        assert (playerProxy.get('gameID') == -1);
        playerProxy.set('new', null);
        assert (playerProxy.get('gameID') == 0);
        assert (retrieveFacade().retrieveInstance(PROXY_NAME_GAME + '_' + 0));

        assert (!this.getNotification);
        playerProxy.set('commit', null);
        assert (playerProxy.get('gameOn') == false);
        assert (playerProxy.get('gameID') == 0);
        assert (this.getNotification);

        return true;
    }

    this.testProxy = function () {
    }

    this.init();
}

