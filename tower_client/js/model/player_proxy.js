function PlayerProxy()
{
    //variable 
    this.name = PROXY_NAME_PLAYER;
    this.score = undefined;
    this.money = undefined;
    this.scenarios = undefined;
    this.scenarioID = undefined;
    this.towerTypes = undefined;
    this.gameOn = undefined;
    this.gameID = undefined;
    this.game = undefined;

    this.proxy = null;

    //method
    this.init = function(scenarios, towerTypes) {
        this.score = 0;
        this.money = PLAYER_INIT_MONEY;
        this.scenarios = scenarios;
        this.scenarioID = 0;
        this.towerTypes = towerTypes;
        this.gameOn = false;
        this.gameID = -1;
        this.game = undefined;
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
            this.game = new GameProxy(this.gameID);
            this.game.init(this.scenarios[this.gameID], this.towerTypes);
        }
        else if (property == 'commit') {
            assert (this.gameOn);
            this.gameOn = false;
            this.game = undefined;
            retrieveFacade().sendNotification(EVENT_COMMIT_GAME_ACK, null);
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
