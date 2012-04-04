function Model()
{
    this.proxies = new Object;
    this.registerProxy = registerProxy;
    this.unregisterProxy = unregisterProxy;
}

function registerProxy(name, instance)
{
    assert (this.proxies[name] == undefined);
    this.proxies[name] = instance;
}

function unregisterProxy(name, instance)
{
    assert (this.proxies[name] == instance);
    this.proxies[name] = undefined;
}

function Proxy(name, realInstance)
{
    this.name = name;

    retrieveFacade().model.registerProxy(name, realInstance);
    var notification = {e: PROXY_EVENT_UPDATE, callback: realInstance.onUpdate, instance: realInstance, dataObject: null};
    retrieveFacade().registerNotifier(notification);
}

function Game(scenario)
{
    //variables
    this.name = PROXY_NAME_GAME;
    this.enemyList = new Array();
    this.defenderList = new Array();
    this.scenario = scenario;

    this.Info = {'money': 100, 'life': 10, 'bout': 1};
    for (var i = 0; i < 20; ++i)
    {
        this.enemyList.push({'speed':50, 'life': 100, 'id': 0, 'diedAt': undefined});
    }
    
    //methods
    this.refresh = function () {
        //FIXME: request to server
        this.onRefresh();
    }

    this.onRefresh = function() {
    }

    this.play = function () {
        this.onPlayAck();
    }


    this.onPlayAck = function () {
        retrieveFacade().sendNotification(COMMAND_EVENT_PLAY_SNAPSHOT);
    }

    this.commit = function() {
        //FIXME:
        this.onCommitAck();
    }

    this.onCommitAck = function() {
        this.Info['money'] += 100;
        for (var i = 0; i < 20; ++i)
        {
            this.enemyList = new Array();
            this.enemyList.push({'speed': 50, 'life': (this.Info.bout+1) * 100, 'id': this.Info.bout % 4 , 'diedAt': undefined});
        }
        retrieveFacade().sendNotification(COMMAND_EVENT_COMMIT_ACK, null);
    }

    this.addDefender = function (dataObject) {
        
        var dts = this.scenario.defenderType[dataObject.id];
        var dt = dts[dataObject.level];
        var bt = this.scenario.bulletType[dataObject.id];
        var defender = new Defender(dataObject.id, dataObject.position, dataObject.positionX, dts, dt, bt);
        this.defenderList.push(defender);
        this.Info.money -= defender.cost;
        assert (this.Info.money >= 0);
        retrieveFacade().sendNotification(COMMAND_EVENT_EMBATTLE_ACK, dataObject);
    }

    this.removeDefender = function(dataObject) {
        var idx = this.getDefenderIndexAt(dataObject.position.x, dataObject.position.y);
        assert (idx >= 0);
        retrieveFacade().model.unregisterProxy(this.defenderList[idx].name, this.defenderList[idx]);
        if (idx == 0) 
            this.defenderList.shift();
        else if (idx == this.defenderList.length-1)
            this.defenderList.pop();
        else
            this.defenderList = this.defenderList.slice(0, idx).concat(this.defenderList.slice(idx+1));
        this.Info.money += this.defenderList[idx].cost/2;
        retrieveFacade().sendNotification(COMMAND_EVENT_REMOVE_DEFENDER_ACK, dataObject);
    }

    this.upgradeDefender = function(dataObject) {
        var defender = dataObject.defender;
        this.Info.money -= defender.defenderTypes[defender.level+1].cost;
        assert (this.Info.money >= 0);
        dataObject.defender.upgrade(notification.dataObject);
    }

    this.getDefenderIndexAt = function (x, y) {
        for (var i = 0; i < this.defenderList.length; ++i) {
            var defender = this.defenderList[i];
            if (defender.position.x == x && defender.position.y == y)
                return i;
        }
        return -1;
    }

    this.getDefenderAt = function (x, y) {
        var i = this.getDefenderIndexAt(x, y);
        if (i >= 0)
            return this.defenderList[i];
        return null;
    }

    //have to put at the last
    this.proxy = new Proxy(this.name, this);
}

function Scenario()
{
    //variables
    this.name = PROXY_NAME_SCENARIO;
    this.map = null;
    this.blockSize = 0; //px
    this.col = 0; //block per col
    this.row = 0; //block per row
    this.directions = new Array();
    this.start = undefined;
    this.finish = undefined;
    this.defenderType = undefined;
    this.bulletType = undefined;



    //methods
    this.init = function () {
        this.blockSize = 50; //px
        this.col = 10; //block per col
        this.row = 10; //block per row
        this.map = [[MAP_NOTHING, MAP_START + MAP_RIGHT, MAP_NOTHING, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_NOTHING], 
                        [MAP_DEFENDABLE, MAP_PASS_ROAD, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DOWN, MAP_PASS_ROAD, MAP_PASS_ROAD, MAP_PASS_ROAD, MAP_FINISH + MAP_DOWN], 
                        [MAP_DEFENDABLE, MAP_PASS_ROAD, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_PASS_ROAD, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_NOTHING], 
                        [MAP_DEFENDABLE, MAP_PASS_ROAD, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_PASS_ROAD, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE], 
                        [MAP_DEFENDABLE, MAP_PASS_ROAD, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_PASS_ROAD, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE], 
                        [MAP_DEFENDABLE, MAP_PASS_ROAD, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_PASS_ROAD, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE], 
                        [MAP_DEFENDABLE, MAP_PASS_ROAD, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_PASS_ROAD, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE], 
                        [MAP_DEFENDABLE, MAP_PASS_ROAD, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_PASS_ROAD, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE], 
                        [MAP_DEFENDABLE, MAP_DOWN, MAP_PASS_ROAD, MAP_PASS_ROAD, MAP_PASS_ROAD, MAP_LEFT, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE], 
                        [MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE, MAP_DEFENDABLE]];

        for (var i = 0; i < this.map.length; ++i)
            for (var j = 0; j < this.map[i].length; ++j) {
                var type = this.map[i][j];
                if (!isRoad(type))
                    continue;
                if (isDirection(type)) {
                    this.directions.push({'x': i, 'y': j, 'direction': type});
                }
                if (isStart(type)) {
                    assert (this.start == undefined);
                    this.start = {'x': i, 'y': j, 'direction': type};
                }
                if (isFinish(type)) {
                    assert (this.finish == undefined);
                    this.finish = {'x': i, 'y': j, 'direction': type};
                }
            }

        this.defenderType = [
        [
            { level: 0, scope:100,cost:50,bullet:1,cold:20*VIEW_REFRESH_TIME_OUT, numBullet:1},
            { level: 1, scope:110,cost:50,bullet:1,cold:18*VIEW_REFRESH_TIME_OUT, numBullet:1}, 
            { level: 2, scope:120,cost:50,bullet:1,cold:12*VIEW_REFRESH_TIME_OUT, numBullet:1},
        ],
        [
            {level: 0, scope:120,cost:75,bullet:1,cold:18*VIEW_REFRESH_TIME_OUT, numBullet:1},
            {level: 1, scope:130,cost:75,bullet:1,cold:15*VIEW_REFRESH_TIME_OUT, numBullet:1},
            {level: 2, scope:140,cost:75,bullet:2,cold:12*VIEW_REFRESH_TIME_OUT, numBullet:1},
        ],
        [
            {level:0, scope:140,cost:100,bullet:3,cold:18*VIEW_REFRESH_TIME_OUT, numBullet:3},
            {level:1, scope:150,cost:100,bullet:4,cold:15*VIEW_REFRESH_TIME_OUT, numBullet:3},
            {level:2, scope:160,cost:100,bullet:5,cold:12*VIEW_REFRESH_TIME_OUT, numBullet:3},
        ],
        [
            {level:0, scope:130,cost:125,bullet:1,cold:50*VIEW_REFRESH_TIME_OUT, numBullet:1},
            {level:1, scope:140,cost:125,bullet:1,cold:40*VIEW_REFRESH_TIME_OUT, numBullet:1},
            {level:2, scope:150,cost:125,bullet:1,cold:30*VIEW_REFRESH_TIME_OUT, numBullet:1},
        ],
        [
            {level:0, scope:150,cost:150,bullet:1,cold:20*VIEW_REFRESH_TIME_OUT, numBullet:1},
            {level:1, scope:160,cost:150,bullet:1,cold:15*VIEW_REFRESH_TIME_OUT, numBullet:1},
            {level:2, scope:170,cost:150,bullet:1,cold:12*VIEW_REFRESH_TIME_OUT, numBullet:1},
        ]
        ];

        this.bulletType = [
        [
            {
                level: 0, hurt:10, steal:0, frozen:0, kill:0, autoTarget: true, imgID: 0
            },
            {
                level: 1, hurt:12, steal:0, frozen:0, kill:0, autoTarget: true, imgID: 0
            },
            {
                level: 2, hurt:12, steal:1, frozen:0, kill:0, autoTarget: true, imgID: 0
            }
        ],
        [
            {
                level: 0, hurt:5, frozen:3000, steal:0, kill:0, autoTarget: true, imgID: 1
            },
            {
                level: 1, hurt:8, frozen:4000, steal:0, kill:0, autoTarget: true, imgID: 1
            },
            {
                level: 2, hurt:10, frozen:4000, steal:0, kill:0, autoTarget: true, imgID: 1
            }
        ],
        [
            {
                level:0, hurt:12, steal:0, frozen:0, kill:0, autoTarget: true, imgID: 2
            },
            {
                level:1, hurt:15, steal:0, frozen:0, kill:0, autoTarget: true, imgID: 2
            },
            {
                level: 2, hurt:20, steal:0, frozen:0, kill:0, autoTarget: true, imgID: 2
            }
        ],
        [
            {
                level:0, hurt:100, steal:0, frozen:0, kill:0, autoTarget: false, imgID: 3
            },
            {
                level: 1, hurt:200, steal:0, frozen:0, kill:0, autoTarget: false, imgID: 3
            },
            {
                level: 2, hurt:300, steal:0, frozen:0, kill:0, autoTarget: false, imgID: 3
            }
        ],
        [
            {
                level: 0, hurt:15, kill:5, steal:0, frozen:0, autoTarget: true, imgID: 4
            },
            {
                level: 1, hurt:20, kill:8, steal:0, frozen:0, autoTarget: true, imgID: 4
            },
            {
                level: 2, hurt:30, kill:10, steal:0, frozen:0, autoTarget: true, imgID: 4
            }
        ]
        ];

    }

    this.refresh = function () {
        //FIXME:
        this.onRefreshAck();
    }

    this.onRefreshAck = function() {
    }

    this.getStart = function() {
        return this.start;
    }

    this.isDefendable = function(x, y) {
        assert (x >= 0 && x < this.map.length && y >= 0 && y < this.map[0].length);
        return this.map[x][y] == MAP_DEFENDABLE;
    }


    //have to put at the last
    this.proxy = new Proxy(this.name, this);

    //initialize
    this.init();
}

function Defender(id, position, positionX, defenderTypes, defenderType, bulletType)
{
    //variables
    this.name = PROXY_NAME_DEFENDER + '_' + position['x'] + '_' + position['y'];
    this.position = position;
    this.positionX = positionX;
    this.id = id;
    this.level = defenderType.level;
    this.scope = defenderType.scope;
    this.cost = defenderType.cost;
    this.bulletType = bulletType;
    this.cold = defenderType.cold
    this.maxCold = defenderType.cold;
    this.numBullet = defenderType.numBullet;
    this.defenderTypes = defenderTypes;
    this.lastAttackTime = 0;

    //methods
    this.refresh = function () {
        //FIXME:
        this.onRefreshAck();
    }

    this.onRefreshAck = function() {
    }

    this.upgrade = function(dataObject) {
        //FIXME:
        this.onUpgradeAck();
    }

    this.onUpgradeAck = function() {
        this.level += 1;
        assert (this.level < this.defenderTypes.length);
        this.scope = this.defenderTypes[this.level].scope;
        this.cold = this.defenderTypes[this.level].cold;
        this.maxCold = this.defenderTypes[this.level].cold;
        this.numBullet = this.defenderTypes[this.level].numBullet;
        retrieveFacade().sendNotification(COMMAND_EVENT_UPGRADE_DEFENDER_ACK, {defender: this});
    }

    this.remove = function() {
        this.onRemoveAck();
    }

    this.onRemoveAck = function() {
        retrieveFacade().sendNotification(COMMAND_EVENT_REMOVE_DEFENDER_ACK, this);
    }

    this.isCold = function() {
        var d = new Date();
        var t = d.getTime();
        return t - this.lastAttackTime >= this.maxCold;
    }

    this.canHit = function(px, py) {
       if (Math.sqrt(Math.pow(this.positionX.x - px,2)+Math.pow(this.positionX.y - py,2)) <= this.scope)
            return true;
        return false;
    }

    this.attack = function() {
        var d = new Date();
        this.lastAttackTime = d.getTime();
        assert (this.numBullet > 0);
    }

    //have to put at the last
    this.proxy = new Proxy(this.name, this);
}

function isDirection (type) {
        return (type & MAP_LEFT || type & MAP_RIGHT || type & MAP_UP || type & MAP_DOWN);
}

function isRoad(type) {
        if (this.isDirection(type) || (type == MAP_PASS_ROAD))
        {
            assert ((type & MAP_DEFENDABLE) == 0);
            return true;
        }
        else
        {
            assert (type & MAP_DEFENDABLE || (type == MAP_NOTHING));
            return false;
        }
}

function isStart(type) {
    return type & MAP_START;
}

function isFinish(type) {
    return type & MAP_FINISH;
}

function isDefendable(type) {
    assert (!isRoad(type) || !(type & MAP_DEFENDABLE));
    return type & MAP_DEFENDABLE;
}

function isNothing(type) {
    return type == MAP_NOTHING;
}

function getDirection(type) {
    assert (isDirection(type));
    var direction = {'x':0, 'y':0};
    if (type & MAP_DOWN) {
        direction.x = 0;
        direction.y = +1;
    }
    else if (type & MAP_UP) {
        direction.x = 0;
        direction.y = -1;
    }
    else if (type & MAP_LEFT) {
        direction.x = -1;
        direction.y = 0;
    }
    else if (type & MAP_RIGHT) {
        direction.x = +1;
        direction.y = 0;
    }
    assert (direction.x != 0 ||  direction.y != 0);
    return direction;
}
