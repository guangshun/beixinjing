function PlayerProxy()
{
    //variable 
    this.name = PROXY_NAME_PREFIX + 'PLAYER';
    this.score = 0;
    this.money = 0;
    this.scenarios = null;
    this.scenarioID = -1;
    this.towerTypes = null;
    this.bulletTypes = null;
    this.proxy = null;

    //method
    this.init = function() {
        this.score = 0;
        this.money = 0;
        this.scenarios = null;
        this.scenarioID = -1;
        this.towerTypes = null;
        this.bulletTypes = null;
        this.proxy = new Proxy(this.name, this);
    }
    this.get = function (property) {
        return this[property];
    }
    this.set = function (property, value) {
        this[property] = value;
    }
    this.add = function () {
        assert (false && 'not implement yet');
    }
    this.remove = function () {
        assert (false && 'not implement yet');
    }
}
