const fs = require('fs');
const path = require('path');
const Player = require('../models/Player');

class GameEngine {
    constructor() {
        this.players = new Map();
        this.DATA_DIR = path.join(__dirname, '../../data/players');
    }

    // Завантаження або створення нового гравця
    loadOrCreatePlayer(id, name) {
        const filePath = path.join(this.DATA_DIR, `${name}.json`);
        
        if (fs.existsSync(filePath)) {
            try {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                // Створюємо об'єкт Player на основі збережених даних
                const player = new Player(id, data.name);
                Object.assign(player, data); // Копіюємо всі властивості
                player.id = id; // Оновлюємо сокет-ID
                this.players.set(id, player);
                console.log(`[Engine] Завантажено гравця: ${name}`);
                return player;
            } catch (e) {
                console.error(`[Error] Помилка завантаження файлу ${name}.json:`, e);
            }
        }

        // Якщо файлу немає або помилка, створюємо нового
        const player = new Player(id, name);
        this.players.set(id, player);
        this.savePlayer(player); // Одразу зберігаємо
        console.log(`[Engine] Створено нового гравця: ${name}`);
        return player;
    }

    // Збереження даних гравця
    savePlayer(player) {
        if (!player) return;
        const filePath = path.join(this.DATA_DIR, `${player.name}.json`);
        // Не зберігаємо тимчасові дані (наприклад, lastUpdate)
        const dataToSave = { ...player };
        delete dataToSave.lastUpdate;
        
        fs.writeFileSync(filePath, JSON.stringify(dataToSave, null, 2));
    }

    connectPlayer(id, name) {
        // Тепер ми використовуємо loadOrCreatePlayer
        return this.loadOrCreatePlayer(id, name);
    }

    processClick(playerId) {
        const player = this.players.get(playerId);
        if (player) {
            player.addClick();
            this.savePlayer(player); // Зберігаємо після кожного кліку (або рідше)
            return player.coins;
        }
        return null;
    }

    updateAll() {
        this.players.forEach(player => {
            player.updatePassive();
        });
        // Зберігати всіх кожну секунду - занадто часто.
        // Краще зберігати при відключенні або важливих подіях.
    }

    getGameState() {
        return Array.from(this.players.values());
    }
}

module.exports = new GameEngine();