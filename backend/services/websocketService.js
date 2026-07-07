const WebSocket = require('ws');

let wss;

function initializeWebSocket(server) {
    wss = new WebSocket.Server({ server });

    wss.on('connection', () => {
        console.log('🟢 WebSocket Client Connected');
    });

    console.log('✅ WebSocket Server Started');
}

function broadcastTheatreStatus(data) {
    if (!wss) return;

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

module.exports = {
    initializeWebSocket,
    broadcastTheatreStatus
};