function GameProxy (id) 
{
    //variable
    this.id = id;
    this.name = PROXY_NAME_GAME + '_' + id;
    this.scenario = undefined;
    this.waveID = undefined;
    this.enemies = undefined;
    this.towers = undefined;
    this.towerTypes = undefined;
    this.isFinish = undefined;
    this.proxy = undefined;

    //method
    this.init = function(scenario, towerTypes) {
        this.scenario = scenario;
        this.waveID = 0;
        this.initEnemies();
        this.towers = new Object();
        this.towerTypes = towerTypes;
        this.isFinish = false;
        this.proxy = new Proxy(this.name, this);
    }

    this.initEnemies = function () {
        this.enemies = new Array();
        for (var i = 0; i < this.scenario.enemies[this.waveID].length; ++i) {
            var obj = this.scenario.enemies[this.waveID][i];
            var enemy = new EnemyObject(obj.type, obj.level);
            this.enemies.push(enemy);
        }
    }

    this.get = function(property) {
        if (property == 'result') {
            //based on current towers, calculate the result for current wave

            //FIXME: for web game, it should be set based on server result
            /*
            for (var i = 0; i < this.enemies; ++i)
                this.enemies[i].setDiedAt(null);
            }
            */
            return null;
        }
        else {
            assert (this[property] != undefined);
            return this[property];
        }
    }

    this.set = function(property, value) {
        if (property == 'commit') {
            //commit the result for the wave
            ++this.waveID;
            if (this.waveID == this.scenario.enemies.length) {
                retrieveFacade().sendNotification(EVENT_COMMIT_GAME, null);
            }
            else {
                this.initEnemies();
                retrieveFacade().sendNotification(EVENT_COMMIT_WAVE_ACK, null);
            }
        }
        else {
            assert (this[property] != undefined);
            this[property] = value;
        }
    }
    this.add = function(dataObject) {
        var tower = new TowerObject(this.towerTypes[dataObject.towerTypeID], dataObject.level, dataObject.position);
        assert (this.towers[dataObject.position.x + '_' + dataObject.position.y] == undefined);
        this.towers[dataObject.position.x + '_' + dataObject.position.y] = tower;
        retrieveFacade().sendNotification(EVENT_EMBATTLE_ACK, dataObject);
    }
    this.remove = function (dataObject) {
        assert (this.towers[dataObject.position.x + '_' + dataObject.position.y] != undefined);
        this.towers[dataObject.position.x + '_' + dataObject.position.y] = undefined;
        retrieveFacade().sendNotification(EVENT_UNEMBATTLE_ACK, dataObject);
    }
    this.upgrade = function (dataObject) {
        assert (this.towers[dataObject.position.x + '_' + dataObject.position.y] != undefined);
        ++this.towers[dataObject.position.x + '_' + dataObject.position.y].level;
        retrieveFacade().sendNotification(EVENT_UPGRADE_ACK, dataObject);
    }
}
