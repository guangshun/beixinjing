var facade = undefined;

function Facade()
{
    //variables
    this.model = undefined;
    this.viewer = undefined;
    this.controller = undefined;
    this.notifiers = new Object;
    this.graphics = new Graphics();
    this.resource = new Object();

    //method
    this.registerNotifier = registerNotifier;
    this.sendNotification = sendNotification;
    this.retrieveInstance = retrieveInstance;
    this.resetViewer = resetViewer;

    this.construct = function () {
        this.model = new Model();
        this.viewer = new Viewer();
        this.controller = new Controller();
    }

    this.construct();

}

function resetViewer()
{
    assert (this.viewer);
    //FIXME: how to iterate all?
    for (var m in this.viewer.mediators) {
        if (this.viewer.mediators[m].destruct != undefined) 
            this.viewer.mediators[m].destruct();
    }
    this.viewer = new Viewer();
}

function resetFacade()
{
    assert (facade);
    facade = new Facade();
}

function retrieveFacade()
{
    if (facade == undefined)
        facade = new Facade();
    return facade;
}

function registerNotifier(notification)
{
    if (this.notifiers[notification.e] == undefined)
        this.notifiers[notification.e] = new Array();
    this.notifiers[notification.e].push(notification);
}

function sendNotification(e, dataObject)
{
    assert (this.notifiers[e] != undefined);
    var notifications = this.notifiers[e];
    for (var i = 0; i < notifications.length; ++i)
    {
        assert (notifications[i].e == e);
        notifications[i].dataObject = dataObject;
        notifications[i].callback.call(notifications[i].instance, notifications[i]);
    }
}

function retrieveInstance(name)
{
    if (this.model.proxies[name]) {
        assert (this.controller.commands[name] == undefined)
        assert (this.viewer.mediators[name] == undefined)
        return this.model.proxies[name];
    }
    if (this.viewer.mediators[name]) {
        assert (this.controller.commands[name] == undefined)
        return this.viewer.mediators[name];
    }
    assert (this.controller.commands[name])
    return this.controller.commands[name];
}



