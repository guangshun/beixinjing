function BackGroundMediator(canvas)
{
    //variables
    this.name = MEDIATOR_NAME_BACKGROUND;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    //methods
    this.draw = function (map) {
        for (var i = 0; i < map.getNumRow(); ++i) {
            for (var j = 0; j < map.getNumCol(); ++j) {
                var data = map.getData({x: i, y:j});
                if (map.isRoad(data)) {
                    retrieveFacade().graphics.fillRect(this.ctx, i * MAP_BLOCK_SIZE, j * MAP_BLOCK_SIZE, MAP_BLOCK_SIZE, MAP_BLOCK_SIZE, 'black');
                }
                else if (map.isDefendable(data)) {
                    retrieveFacade().graphics.drawRect(this.ctx, i * MAP_BLOCK_SIZE, j * MAP_BLOCK_SIZE, MAP_BLOCK_SIZE, MAP_BLOCK_SIZE, 'red');
                }
                else {
                    assert (map.isNothing(data));
                    retrieveFacade().graphics.fillRect(this.ctx, i * MAP_BLOCK_SIZE, j * MAP_BLOCK_SIZE, MAP_BLOCK_SIZE, MAP_BLOCK_SIZE, 'gray');
                }
            }
        }
    }
    this.mediator = new Mediator(this.name, this);
}
