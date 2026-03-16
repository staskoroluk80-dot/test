class Shop {
    constructor() {
        this.upgrades = {
            click_upgrade: { basePrice: 10, multiplier: 1.5, powerAdd: 1 },
            passive_upgrade: { basePrice: 50, multiplier: 1.8, incomeAdd: 2 }
        };
    }
    buy(player, type) {
        const upg = this.upgrades[type];
        if (!upg) return false;
        const price = Math.floor(upg.basePrice * Math.pow(upg.multiplier, player[type + "_lvl"] || 0));
        
        if (player.coins >= price) {
            player.coins -= price;
            player[type + "_lvl"] = (player[type + "_lvl"] || 0) + 1;
            if (type === 'click_upgrade') player.clickPower += upg.powerAdd;
            if (type === 'passive_upgrade') player.passiveIncome += upg.incomeAdd;
            return true;
        }
        return false;
    }
}
module.exports = new Shop();
