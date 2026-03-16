class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.coins = 0;
        this.clickPower = 1;
        this.passiveIncome = 0; // Монет за секунду
        this.lastUpdate = Date.now();
    }

    addClick() {
        this.coins += this.clickPower;
        return this.coins;
    }

    updatePassive() {
        const now = Date.now();
        const delta = (now - this.lastUpdate) / 1000; // Час у секундах
        this.coins += this.passiveIncome * delta;
        this.lastUpdate = now;
        return this.coins;
    }
}
module.exports = Player;
