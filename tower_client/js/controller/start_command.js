function StartCommand()
{
    //variables
    this.name = COMMAND_NAME_START;
    this.player = null;

    //methods
    this.init = function() {
        this.player = new PlayerProxy();
        var scenarios = new Array();
        for (var i = 0; i < SCENARIO_MAP.length; ++i) {
            var map = new MapObject(SCENARIO_MAP[i]);
            var enemies = new Array();
            for (var j = 0; j < 10; ++j) {
                enemies.push(new Array());
                for (var m = 0; m < 20; ++m) {
                    enemies[j].push({type: ENEMY_TYPES[j % ENEMY_TYPES.length], level : i + j / 5 + 1});
                }
            }
            var scenario = new ScenarioObject(map, enemies);
            scenarios.push(scenario);
        }
        this.player.init(scenarios, TOWER_TYPES);
    }

    this.onStart = function (notification) {
        assert (notification.e == EVENT_START);
        this.player.set('new', null);
        
        //this.refresh();
        //setInterval(this.refresh, REFRESH_TIME_OUT);
    }
    /*
    this.refresh = function () {
        retrieveFacade().sendNotification(EVENT_REFRESH, null);
    }
    */

    var notification = {e: EVENT_START, callback: this.onStart, instance: this, dataObject: null};
    retrieveFacade().registerNotifier(notification);


    this.command = new Command(this.name, this);
}

