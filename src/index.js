const http = require('http');
const { Server } = require('socket.io');
const engine = require('./core/GameEngine');
const shop = require('./core/Shop');
const boxes = require('./core/BoxSystem');

const httpServer = http.createServer();
const io = new Server(httpServer, {
    cors: { origin: "*" },
    pingInterval: 2000,
    pingTimeout: 5000
});

io.on('connection', (socket) => {
    const playerName = socket.handshake.query.name || "Guest";
    const player = engine.connectPlayer(socket.id, playerName);
    socket.emit('init', player);

    socket.on('click', () => {
        engine.processClick(socket.id);
        socket.emit('update_player', player);
    });

    socket.on('buy_upgrade', (type) => {
        if (shop.buy(player, type)) {
            engine.savePlayer(player);
            socket.emit('update_player', player);
        }
    });

    socket.on('open_box', () => {
        if (player.coins >= 100) {
            player.coins -= 100;
            player.title = boxes.openBox().name;
            engine.savePlayer(player);
            socket.emit('box_result', { name: player.title });
            socket.emit('update_player', player);
        }
    });

    socket.on('disconnect', () => {
        const p = engine.players.get(socket.id);
        if (p) {
            engine.savePlayer(p);
            engine.players.delete(socket.id);
        }
    });
});

setInterval(() => {
    engine.updateAll();
    io.emit('sync', engine.getGameState());
}, 1000);

// ШВИДКИЙ АВТО-СЕЙВ: кожні 15 секунд
setInterval(() => {
    if (engine.players.size > 0) {
        console.log(`[Auto-Save] Збереження ${engine.players.size} гравців...`);
        engine.players.forEach(p => engine.savePlayer(p));
    }
}, 15000);

httpServer.listen(3000, '192.168.0.249', () => {
    console.log("SERVER ONLINE | Auto-save: 15s");
});
