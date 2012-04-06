function UpgradeCommand()
{
    //variables
    this.name = COMMAND_NAME_UPGRADE;


    //methods
    this.onUpgrade = function (notification) {
        assert (notification.e == EVENT_UPGRADE);
        if (this.canUpgrade(notification)) {
            retrieveFacade().retrieveInstance(PROXY_NAME_PLAYER).get('game').upgrade(notification.dataObject);
        }
    }

    this.canUpgrade = function (notification) {
        var player = retrieveFacade().retrieveInstance(PROXY_NAME_PLAYER);
        if (player.get('game').towers[notification.dataObject.position.x + '_' + notification.dataObject.position.y].type.cost * UPGRADE_COST_RATIO < player.get('money')) {
            return true;
        }
        return false;
    }

    this.onUpgradeAck = function (notification) {
        assert (notification.e == EVENT_UPGRADE_ACK);
        //retrieveFacade().retrieveInstance(MEDIATOR_NAME_TOWERVIEW).addTower(notification.dataObject);
    }


    var notification = {e: EVENT_UPGRADE, callback: this.onUpgrade, instance: this, dataObject: null};
    retrieveFacade().registerNotifier(notification);

    var notification = {e: EVENT_UPGRADE_ACK, callback: this.onUpgradeAck, instance: this, dataObject: null};
    retrieveFacade().registerNotifier(notification);

    this.command = new Command(this.name, this);
}

