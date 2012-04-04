function GameProxy () 
{
    //variable
    this.name = PROXY_NAME_PREFIX + 'GAME';
    this.scenario = null;
    this.waveID = -1;
    this.enemies = null;
    this.towers = null;
    this.proxy = null;

    //method
    this.init = function(scenario) {
        this.scenario = scenario;
        this.waveID = 0;
        this.enemies = new Array();
        this.towers = new Array();
        this.proxy = new Proxy(this.name, this);

        //init enemies
    }
    this.get = function(property) {
        return this[property];
    }

    this.set = function(property, value) {
        this[property] = value;
    }
    this.add = function(dataObject) {
        //add tower
    }
    this.remove = function () {
        //remove tower
    }
}
