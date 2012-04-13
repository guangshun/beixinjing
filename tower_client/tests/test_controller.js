function ControllerTest() 
{
    this.tests = new Array();
    this.addTest = function (test) {
        this.tests.push(test);
    }

    this.init = function () {
        this.addTest(this.testStartCommand);
        this.addTest(this.testEmbattleCommand);
        this.addTest(this.testUnembattleCommand);
        this.addTest(this.testUpgradeCommand);
        this.addTest(this.testCommitCommand);
    }
    this.setUp = function () {
    }
    this.tearDown = function () {
        resetFacade();
    }
    this.testStartCommand = function () {
        var start = new StartCommand();
        start.initViewer = function () { }
        start.init();
        assert (!start.player.gameOn);
        assert (start.player.gameID == -1);
        retrieveFacade().sendNotification(EVENT_START, null);
        assert (start.player.gameID == 0);
        assert (start.player.gameOn);
        return true;
    }

    this.testEmbattleCommand = function() {
        var start = new StartCommand();
        start.initViewer = function () { }
        start.init();
        retrieveFacade().sendNotification(EVENT_START, null);

        this.getNotification = false;
        this.dummyCallback = function (notification) {
            this.getNotification = true;
        }

        retrieveFacade().registerNotifier({e:EVENT_EMBATTLE_ACK, callback: this.dummyCallback, instance: this});

        assert (!this.getNotification);
        var embattle = new EmbattleCommand();
        var dataObject = {towerTypeID: 0, level: 0, position:{x: 1, y: 0}};
        retrieveFacade().sendNotification(EVENT_EMBATTLE, dataObject);
        assert (this.getNotification);

        this.getNotification = false;
        start.player.set('money', 0);
        dataObject = {towerTypeID: 0, level: 0, position:{x: 1, y: 0}};
        retrieveFacade().sendNotification(EVENT_EMBATTLE, dataObject);
        assert (!this.getNotification);

        return true;
    }

    this.testUnembattleCommand = function() {
        var start = new StartCommand();
        start.initViewer = function () { }
        start.init();
        retrieveFacade().sendNotification(EVENT_START, null);

        this.getNotification = false;
        this.dummyCallback = function (notification) {
            this.getNotification = true;
        }

        retrieveFacade().registerNotifier({e:EVENT_EMBATTLE_ACK, callback: this.dummyCallback, instance: this});
        retrieveFacade().registerNotifier({e:EVENT_UNEMBATTLE_ACK, callback: this.dummyCallback, instance: this});

        assert (!this.getNotification);
        var embattle = new EmbattleCommand();
        var dataObject = {towerTypeID: 0, level: 0, position:{x: 1, y: 0}};
        retrieveFacade().sendNotification(EVENT_EMBATTLE, dataObject);
        assert (this.getNotification);

        var unembattle = new UnembattleCommand();
        this.getNotification = false;
        retrieveFacade().sendNotification(EVENT_UNEMBATTLE, dataObject);
        assert (this.getNotification);
        this.getNotification = false;

        return true;
    }

    this.testUpgradeCommand = function() {
        var start = new StartCommand();
        start.initViewer = function () { }
        start.init();
        retrieveFacade().sendNotification(EVENT_START, null);

        this.getNotification = false;
        this.dummyCallback = function (notification) {
            this.getNotification = true;
        }

        retrieveFacade().registerNotifier({e:EVENT_EMBATTLE_ACK, callback: this.dummyCallback, instance: this});
        retrieveFacade().registerNotifier({e:EVENT_UPGRADE_ACK, callback: this.dummyCallback, instance: this});

        assert (!this.getNotification);
        var embattle = new EmbattleCommand();
        var dataObject = {towerTypeID: 0, level: 0, position:{x: 1, y: 0}};
        retrieveFacade().sendNotification(EVENT_EMBATTLE, dataObject);
        assert (this.getNotification);

        this.getNotification = false;
        assert (!this.getNotification);
        assert (start.player.game.towers['1_0'].level == 0);
        var upgrade = new UpgradeCommand();
        var dataObject = {position:{x: 1, y: 0}};
        retrieveFacade().sendNotification(EVENT_UPGRADE, dataObject);
        assert (this.getNotification);
        assert (start.player.game.towers['1_0'].level == 1);

        
        start.player.set('money', 0);
        this.getNotification = false;
        retrieveFacade().sendNotification(EVENT_UPGRADE, dataObject);
        assert (!this.getNotification);
        assert (start.player.game.towers['1_0'].level == 1);

        return true;
    }

    this.testCommitCommand = function() {
        var start = new StartCommand();
        start.initViewer = function () { }
        start.init();
        retrieveFacade().sendNotification(EVENT_START, null);

        this.getNotification = false;
        this.dummyCallback = function (notification) {
            this.getNotification = true;
        }

        retrieveFacade().registerNotifier({e:EVENT_COMMIT_WAVE_ACK, callback: this.dummyCallback, instance: this});
        retrieveFacade().registerNotifier({e:EVENT_EMBATTLE_ACK, callback: this.dummyCallback, instance: this});

        assert (!this.getNotification);
        var embattle = new EmbattleCommand();
        var dataObject = {towerTypeID: 0, level: 0, position:{x: 1, y: 0}};
        retrieveFacade().sendNotification(EVENT_EMBATTLE, dataObject);
        assert (this.getNotification);


        var commit = new CommitCommand();
        this.getNotification = false;
        retrieveFacade().sendNotification(EVENT_COMMIT_WAVE, dataObject);
        assert (this.getNotification);
        this.getNotification = false;


        this.getCommitGameNotification = false;
        this.dummyCommitGameCallback = function (notification) {
            this.getCommitGameNotification = true;
        }

        retrieveFacade().registerNotifier({e:EVENT_COMMIT_GAME, callback: this.dummyCommitGameCallback, instance: this});

        for (var i = start.player.game.waveID; i < start.player.game.scenario.enemies.length - 1; ++i) {
            this.getNotification = false;
            retrieveFacade().sendNotification(EVENT_COMMIT_WAVE, null);
            assert (this.getNotification);
            this.getNotification = false;
            assert (!this.getCommitGameNotification);
        }

        this.getNotification = false;
        this.getCommitGameNotification = false;
        //retrieveFacade().sendNotification(EVENT_START, null);
        retrieveFacade().sendNotification(EVENT_COMMIT_WAVE, null);
        assert (!this.getNotification);
        //assert (this.getCommitGameNotification);
        this.getCommitGameNotification = false;
        this.getNotification = false;

        return true;
    }

    
    this.init();
}
