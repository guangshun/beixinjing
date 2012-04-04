function Model()
{
    this.proxies = new Object;
    this.registerProxy = registerProxy;
    this.unregisterProxy = unregisterProxy;
}

function registerProxy(name, instance)
{
    assert (this.proxies[name] == undefined);
    this.proxies[name] = instance;
}

function unregisterProxy(name, instance)
{
    assert (this.proxies[name] == instance);
    this.proxies[name] = undefined;
}

function Proxy(name, realInstance)
{
    this.name = name;

    retrieveFacade().model.registerProxy(name, realInstance);
    //FIXME: need implement it for web game
    /*
    var notification = {e: PROXY_EVENT_UPDATE, callback: realInstance.onUpdate, instance: realInstance, dataObject: null};
    retrieveFacade().registerNotifier(notification);
    */
}

