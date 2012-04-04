function EnemyObject(type, level)
{
    //variables
    this.type = type;
    this.diedAt = null;
    this.life = 0;
    this.speed = 0;
    this.level = level;
    //method
    this.init = function () {
        this.life = this.type.life * this.level;
        this.speed = this.type.speed * this.level;
    }
    this.setDiedAt = function (diedAt) {
        this.diedAt = diedAt;
    }
    this.init();
}
