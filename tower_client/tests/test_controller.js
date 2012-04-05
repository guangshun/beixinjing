function ControllerTest() 
{
    this.tests = new Array();
    this.addTest = function (test) {
        this.tests.push(test);
    }

    this.init = function () {
        this.addTest(this.testStartCommand);
    }
    this.setUp = function () {
        assert (facade == undefined);
        var model = new Model();
        var viewer = new Viewer();
        var controller = new Controller();
        initFacade(model, viewer, controller);
    }
    this.tearDown = function () {
        resetFacade();
    }
    this.testStartCommand = function () {
        var start = new StartCommand();
        start.init();
        assert (!start.player.gameOn);
        assert (start.player.gameID == -1);
        retrieveFacade().sendNotification(COMMAND_EVENT_START, null);
        assert (start.player.gameID == 0);
        assert (start.player.gameOn);
        return true;
    }
    
    this.init();
}
