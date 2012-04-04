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
            for (var j = 0; j < mapData[i]; ++j) {
                var position = {x:i, y:j};
                var data = this.getData(position);
                assert (this.isValid(data));
                if (this.isStart(data))
                    this.starts.push(position);
                if (this.isFinish(data))
                    this.finishes.push(position);
            }
        }
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

    this.isDefendable = function(data) {
        return data & MAP_DEFENDABLE;
    }

    this.getStart = function() {
        return this.starts;
    }

    this.getFinish = function () {
        return this.finishes;
    }

    this.getDirection = function(position) {
        return 
    }

    this.isValid = function (data) {
        assert (!this.isRoad(data) || !this.isDefendable(data) || data == this.MAP_NOTHING);
        return true;
    }

    this.init(this.mapData);
}
