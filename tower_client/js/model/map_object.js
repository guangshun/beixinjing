var MAP_NOTHING = 0;
var MAP_PASS_ROAD   = 1;
var MAP_DOWN   = 2;
var MAP_UP     = 4;
var MAP_LEFT   = 8;
var MAP_RIGHT  = 16;
var MAP_START  = 32;
var MAP_FINISH = 64;
var MAP_DEFENDABLE = 128;

var MAP_DIRECTION_MASK = MAP_DOWN + MAP_UP + MAP_LEFT + MAP_RIGHT;

function MapObject(mapData)
{
    //variables
    this.mapData = mapData;
    this.starts = null;
    this.finishes = null;
    
    //method
    this.init = function (mapData) {
        assert (!this.starts);
        assert (!this.finishes);
        this.starts = new Array();
        this.finishes = new Array();
        for (var i = 0; i < mapData.length; ++i) {
            for (var j = 0; j < mapData[i].length; ++j) {
                var position = {x:i, y:j};
                var data = this.getData(position);
                assert (this.isValid(data));
                if (this.isStart(data))
                    this.starts.push(position);
                if (this.isFinish(data))
                    this.finishes.push(position);
            }
        }
        assert (this.starts.length || !mapData.length);
        assert (this.finishes.length || !mapData.length);
    }

    this.getData = function (position) {
        assert (position.x < this.mapData.length && position.y < this.mapData[0].length);
        return this.mapData[position.x][position.y];
    }
    this.isDirection = function(data) {
        return (data & MAP_DIRECTION_MASK) != 0
    }

    this.isStart = function(data) {
        return data & MAP_START;
    }
    
    this.isFinish = function(data) {
        return data & MAP_FINISH;
    }

    this.isRoad = function (data) {
        return this.isStart(data) || this.isFinish(data) || this.isDirection(data) || data == MAP_PASS_ROAD;
    }

    this.isNothing = function (data) {
        return data == MAP_NOTHING;
    }

    this.isDefendable = function(data) {
        return data & MAP_DEFENDABLE;
    }

    this.getStart = function(id) {
        if (id == undefined) {
            return this.starts;
        }
        else {
            return this.starts[id % this.starts.length];
        }
    }

    this.getFinish = function () {
        return this.finishes;
    }

    this.getDirection = function(data, id) {
        var d = data & MAP_DIRECTION_MASK;
        var directions = new Array();
        if (d & MAP_DOWN)
            directions.push({x:0, y:1});
        if (d & MAP_UP)
            directions.push({x:0, y:-1});
        if (d & MAP_LEFT)
            directions.push({x:-1, y:0});
        if (d & MAP_RIGHT)
            directions.push({x:1, y:0});
        assert (directions.length);
        return directions[id % directions.length];
    }

    this.isValid = function (data) {
        assert (!this.isRoad(data) || !this.isDefendable(data) || data == this.MAP_NOTHING);
        return true;
    }

    this.getNumRow = function (){
        return this.mapData.length;
    }

    this.getNumCol = function() {
        return this.mapData[0].length;
    }

    this.init(this.mapData);
}
