function startup()
{
    //load resource
    
    var backgroundCanvas = document.getElementById("background");
    retrieveFacade().resource['backgroundCanvas'] = backgroundCanvas;
    var battleCanvas = document.getElementById("battle");
    retrieveFacade().resource['battleCanvas'] = battleCanvas;
    var towerCanvas  = document.getElementById("tower");
    retrieveFacade().resource['towerCanvas'] = towerCanvas;
    var planCanvas = document.getElementById("plan");
    retrieveFacade().resource['planCanvas'] = planCanvas;
    var controlCanvas = document.getElementById("control");
    retrieveFacade().resource['controlCanvas'] = controlCanvas;

    var enemyImage  = document.getElementById("enemy_img");
    retrieveFacade().resource['enemyImage'] = new ImageObject(enemyImage, ENEMY_IMAGE_BLOCK_SIZE, ENEMY_IMAGE_BLOCK_SIZE);
    towerImage  = document.getElementById("tower_img");
    retrieveFacade().resource['towerImage'] = new ImageObject(towerImage, TOWER_IMAGE_BLOCK_SIZE, TOWER_IMAGE_BLOCK_SIZE);
    bulletImage = document.getElementById("bullet_img");
    retrieveFacade().resource['bulletImage'] = new ImageObject(bulletImage, BULLET_IMAGE_BLOCK_SIZE, BULLET_IMAGE_BLOCK_SIZE);
    btnImage    = document.getElementById("btn_img");
    retrieveFacade().resource['btnImage'] = new ImageObject(btnImage, BUTTON_IMAGE_BLOCK_SIZE, BUTTON_IMAGE_BLOCK_SIZE);

    //init model
    new PlayerProxy();

    //init controller
    new CommitCommand();
    new EmbattleCommand();
    var sc = new StartCommand();
    new UnembattleCommand();
    new UpgradeCommand();

    //init viewer 
    sc.init();
    retrieveFacade().sendNotification(EVENT_START, null);
    
}

function startGame() 
{
}

$(document).ready(startup);
