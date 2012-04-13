function EmbattleCommand()
{
    //variables
    this.name = COMMAND_NAME_EMBATTLE;


    //methods
    this.onEmbattle = function (notification) {
        assert (notification.e == EVENT_EMBATTLE);
        if (this.canEmbattle(notification)) {
            retrieveFacade().retrieveInstance(PROXY_NAME_PLAYER).get('game').add(notification.dataObject);
        }
    }

    this.canEmbattle = function (notification) {
        var player = retrieveFacade().retrieveInstance(PROXY_NAME_PLAYER);
        if (player.get('towerTypes')[notification.dataObject.towerTypeID].cost < player.get('money')) {
            return true;
        }
        return false;
    }

    this.onEmbattleAck = function (notification) {
        assert (notification.e == EVENT_EMBATTLE_ACK);
        retrieveFacade().retrieveInstance(MEDIATOR_NAME_TOWER).addTower(notification.dataObject);
    }

    var notification = {e: EVENT_EMBATTLE, callback: this.onEmbattle, instance: this, dataObject: null};
    retrieveFacade().registerNotifier(notification);

    var notification = {e: EVENT_EMBATTLE_ACK, callback: this.onEmbattleAck, instance: this, dataObject: null};
    retrieveFacade().registerNotifier(notification);

    this.command = new Command(this.name, this);

}

