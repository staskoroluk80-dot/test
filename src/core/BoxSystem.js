const TITLES = require('./Titles');
class BoxSystem {
    static openBox() {
        const rand = Math.random() * 100;
        let cumulative = 0;
        for (const key in TITLES) {
            cumulative += TITLES[key].chance;
            if (rand <= cumulative) return { id: key, ...TITLES[key] };
        }
        return TITLES.COMMON;
    }
}
module.exports = BoxSystem;
