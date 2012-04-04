function PlayerProxy()
{
    //variable 
    this.name = PROXY_NAME_PREFIX + 'PLAYER';
    this.score = undefined;
    this.money = undefined;
    this.scenarios = undefined;
    this.scenarioID = undefined;
    this.towerTypes = undefined;
    this.bulletTypes = undefined;
    this.gameOn = undefined;
    this.gameID = undefined;

    this.proxy = null;

    //method
    this.init = function(scenarios, towerTypes, bulletTypes) {
        this.score = 0;
        this.money = 0;
        this.scenarios = scenarios;
        this.scenarioID = 0;
        this.towerTypes = towerTypes;
        this.bulletTypes = bulletTypes;
        this.gameOn = false;
        this.gameID = -1;
        this.proxy = new Proxy(this.name, this);
    }
    this.get = function (property) {
        return this[property];
    }
    this.set = function (property, value) {
        if (property == 'new') {
            assert (!this.gameOn);
            this.gameOn = true;
            ++this.gameID;
            assert (this.gameID >= 0);
            assert (this.gameID < this.scenarios.length);
            var game = new GameProxy(this.gameID);
            game.init(this.scenarios[this.gameID], this.towerTypes, this.bulletTypes);
        }
        else if (property == 'commit') {
            this.gameOn = false;
        }
        else  {
            this[property] = value;
        }
    }
    this.add = function () {
        assert (false && 'not implement yet');
    }
    this.remove = function () {
        assert (false && 'not implement yet');
    }
}
