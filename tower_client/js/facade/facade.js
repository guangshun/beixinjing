var facade = undefined;

function Facade(model, viewer, controller)
{
    this.model = model;
    this.viewer = viewer;
    this.controller = controller;
    this.notifiers = new Object;
    this.graphics = new Graphics();
    this.registerNotifier = registerNotifier;
    this.sendNotification = sendNotification;
    this.retrieveInstance = retrieveInstance;
}

function initFacade(model, viewer, controller)
{
    assert (facade == undefined);
    facade = new Facade(model, viewer, controller);
}

function resetFacade()
{
    assert (facade);
    facade = undefined;
}

function retrieveFacade()
{
    assert(facade);
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

