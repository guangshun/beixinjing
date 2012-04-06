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


