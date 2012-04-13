function CommitCommand()
{
    //variables
    this.name = COMMAND_NAME_COMMIT;


    //methods
    this.onCommit = function (notification) {
        assert (notification.e == EVENT_COMMIT_WAVE);
        retrieveFacade().retrieveInstance(PROXY_NAME_PLAYER).get('game').set('commit', null);
    }

    this.onCommitAck = function (notification) {
        assert (notification.e == EVENT_COMMIT_WAVE_ACK);
        retrieveFacade().sendNotification(EVENT_START, null);
    }

    this.onCommitGame = function (notification) {
        assert (notification.e == EVENT_COMMIT_GAME);
        retrieveFacade().retrieveInstance(PROXY_NAME_PLAYER).set('commit', null);
        retrieveFacade().retrieveInstance(PROXY_NAME_PLAYER).set('new', null);
    }

    this.onCommitGameAck = function (notification) {
        assert (notification.e == EVENT_COMMIT_GAME_ACK);
        if (retrieveFacade().retrieveInstance(PROXY_NAME_PLAYER).gameOver()) {
            alert('you win');
            retrieveFacade().resetViewer();
        }
    }

    var notification = {e: EVENT_COMMIT_WAVE, callback: this.onCommit, instance: this, dataObject: null};
    retrieveFacade().registerNotifier(notification);

    var notification = {e: EVENT_COMMIT_WAVE_ACK, callback: this.onCommitAck, instance: this, dataObject: null};
    retrieveFacade().registerNotifier(notification);


    var notification = {e: EVENT_COMMIT_GAME, callback: this.onCommitGame, instance: this, dataObject: null};
    retrieveFacade().registerNotifier(notification);

    var notification = {e: EVENT_COMMIT_GAME_ACK, callback: this.onCommitGameAck, instance: this, dataObject: null};
    retrieveFacade().registerNotifier(notification);

    this.command = new Command(this.name, this);

}

