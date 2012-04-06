function UnembattleCommand()
{
    //variables
    this.name = COMMAND_NAME_UNEMBATTLE;

    //methods
    this.onUnembattle = function (notification) {
        assert (notification.e == EVENT_UNEMBATTLE);
        retrieveFacade().retrieveInstance(PROXY_NAME_PLAYER).get('game').remove(notification.dataObject);
    }

    this.onUnembattleAck = function (notification) {
        assert (notification.e == EVENT_UNEMBATTLE_ACK);
        //retrieveFacade().retrieveInstance(MEDIATOR_NAME_TOWERVIEW).removeTower(notification.dataObject);
    }


    var notification = {e: EVENT_UNEMBATTLE, callback: this.onUnembattle, instance: this, dataObject: null};
    retrieveFacade().registerNotifier(notification);


    var notification = {e: EVENT_UNEMBATTLE_ACK, callback: this.onUnembattleAck, instance: this, dataObject: null};
    retrieveFacade().registerNotifier(notification);


    this.command = new Command(this.name, this);

}

