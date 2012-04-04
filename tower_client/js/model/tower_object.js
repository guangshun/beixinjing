var TOWER_LEVEL_DAMAGE = 10;
function TowerObject(type, level, position)
{
    //variables
    this.type = type;
    this.level = level;
    this.position = position;

    //methods
    this.getBullet = function () {
        return {bulletID: this.type.bulletID, damage: this.type.damage + this.level * TOWER_LEVEL_DAMAGE, scope: this.type.bulletScope, speed: this.type.bulletSpeed};
    }
    this.getChangeCost = function () {
        return this.type.cost / 2;
    }
}
