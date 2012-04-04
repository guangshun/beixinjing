function Controller()
{
    this.commands = new Object();
    this.registerCommand = registerCommand;
}

function registerCommand(name, instance)
{
    assert (this.commands[name] == undefined);
    this.commands[name] = instance;
}

function Command(name, realInstance)
{
    this.name = name;

    retrieveFacade().controller.registerCommand(this.name, realInstance);
}

function Start()
{
    this.isStarted = false;
    this.name = COMMAND_NAME_START;

    var notification = {e: COMMAND_EVENT_START, callback: this.onStart, instance: this, dataObject: null};
    retrieveFacade().registerNotifier(notification);


    this.onStart = function (notification) {
        assert (notification.e == COMMAND_EVENT_START);
        assert (!this.isStarted);
        this.isStarted = true;
        this.refresh();
        setInterval(this.refresh, REFRESH_TIME_OUT);
    }
    this.refresh = function () {
        retrieveFacade().sendNotification(COMMAND_EVENT_REFRESH, null);
    }

    this.command = new Command(this.name, this);
}

function Play()
{
    this.name = COMMAND_NAME_PLAY;

    var notification = {e: COMMAND_EVENT_PLAY, callback: this.onPlay, instance: this, dataObject: null};
    retrieveFacade().registerNotifier(notification);


    this.onPlay = function (notification) {
        assert (notification.e == COMMAND_EVENT_PLAY);
        retrieveFacade().retrieveInstance(PROXY_NAME_GAME).play();
    }

    this.command = new Command(this.name, this);

}

function PlaySnapshot()
{
    this.name = COMMAND_NAME_PLAY_SNAPSHOT;

    var notification = {e: COMMAND_EVENT_PLAY_SNAPSHOT, callback: this.onPlaySnapshot, instance: this, dataObject: null};
    retrieveFacade().registerNotifier(notification);


    this.onPlaySnapshot = function (notification) {
        assert (notification.e == COMMAND_EVENT_PLAY_SNAPSHOT);
        //NYI
        setTimeout(onTimer, VIEW_REFRESH_TIME_OUT);
        
    }
    this.onTimer = function (e) {
        retrieveFacade().retrieveInstance(MEDIATOR_NAME_ENEMIES).onRefresh();
    }

    this.command = new Command(this.name, this);
}

function Commit()
{
    this.name = COMMAND_NAME_COMMIT;

    var notification = {e: COMMAND_EVENT_COMMIT, callback: this.onCommit, instance: this, dataObject: null};
    retrieveFacade().registerNotifier(notification);


    this.onCommit = function (notification) {
        assert (notification.e == COMMAND_EVENT_COMMIT);
        retrieveFacade().retrieveInstance(PROXY_NAME_GAME).commit();
    }
    this.command = new Command(this.name, this);
}

function Embattle()
{
    this.name = COMMAND_NAME_EMBATTLE;



    this.onEmbattle = function (notification) {
        assert (notification.e == COMMAND_EVENT_EMBATTLE);
        if (canEmbattle(notification)) {
            retrieveFacade().retrieveInstance(PROXY_NAME_GAME).addDefender(notification.dataObject);
        }
    }

    this.onEmbattleAck = function (notification) {
        assert (notification.e == COMMAND_EVENT_EMBATTLE_ACK);
        retrieveFacade().retrieveInstance(MEDIATOR_NAME_TOWERVIEW).addTower(notification.dataObject);
    }


    var notification = {e: COMMAND_EVENT_EMBATTLE, callback: this.onEmbattle, instance: this, dataObject: null};
    retrieveFacade().registerNotifier(notification);


    var notification = {e: COMMAND_EVENT_EMBATTLE_ACK, callback: this.onEmbattleAck, instance: this, dataObject: null};
    retrieveFacade().registerNotifier(notification);


    this.command = new Command(this.name, this);

}

function canEmbattle (notification) {
    var scenario = retrieveFacade().retrieveInstance(PROXY_NAME_SCENARIO);
    assert (scenario.isDefendable(notification.dataObject.position.x, notification.dataObject.position.y));
    var game = retrieveFacade().retrieveInstance(PROXY_NAME_GAME);
    if (scenario.defenderType[notification.dataObject.id][notification.dataObject.level].cost <= game.Info.money) {
        return true;
    }
    return false;
}

function RemoveDefender()
{
    this.name = COMMAND_NAME_REMOVE_DEFENDER;


    this.onRemoveDefender = function (notification) {
        assert (notification.e == COMMAND_EVENT_REMOVE_DEFENDER);
        retrieveFacade().retrieveInstance(PROXY_NAME_GAME).removeDefender(notification.dataObject);
    }

    this.onRemoveDefenderAck = function (notification) {
        assert (notification.e == COMMAND_EVENT_REMOVE_DEFENDER_ACK);
        retrieveFacade().retrieveInstance(MEDIATOR_NAME_TOWERVIEW).removeTower(notification.dataObject);
    }


    var notification = {e: COMMAND_EVENT_REMOVE_DEFENDER, callback: this.onRemoveDefender, instance: this, dataObject: null};
    retrieveFacade().registerNotifier(notification);


    var notification = {e: COMMAND_EVENT_REMOVE_DEFENDER_ACK, callback: this.onRemoveDefenderAck, instance: this, dataObject: null};
    retrieveFacade().registerNotifier(notification);


    this.command = new Command(this.name, this);


}

function UpgradeDefender()
{
    this.name = COMMAND_NAME_UPGRADE_DEFENDER;

    this.onUpgradeDefender = function (notification) {
        assert (notification.e == COMMAND_EVENT_UPGRADE_DEFENDER);
        if (canUpgradeDefender(notification))
            retrieveFacade().retrieveInstance(PROXY_NAME_GAME).upgradeDefender(notification.dataObject);
    }

    this.onUpgradeDefenderAck = function (notification) {
        assert (notification.e == COMMAND_EVENT_UPGRADE_DEFENDER_ACK);
    }


    var notification = {e: COMMAND_EVENT_UPGRADE_DEFENDER, callback: this.onUpgradeDefender, instance: this, dataObject: null};
    retrieveFacade().registerNotifier(notification);


    var notification = {e: COMMAND_EVENT_UPGRADE_DEFENDER_ACK, callback: this.onUpgradeDefenderAck, instance: this, dataObject: null};
    retrieveFacade().registerNotifier(notification);


    this.command = new Command(this.name, this);


}

function canUpgradeDefender (notification) {
    var scenario = retrieveFacade().retrieveInstance(PROXY_NAME_SCENARIO);
    var game = retrieveFacade().retrieveInstance(PROXY_NAME_GAME);
    assert (notification.dataObject.defender.level < scenario.defenderType[notification.dataObject.defender.id].length);
    if (scenario.defenderType[notification.dataObject.defender.id][notification.dataObject.defender.level+1].cost <= game.Info.money) {
        return true;
    }
    return false;
}


