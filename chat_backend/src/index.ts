import WebSocket , {WebSocketServer} from "ws";

const wss = new WebSocketServer({port:8080})

wss.on("connection", function (socket) {
    console.log("connection established - bring on the game")

    socket.on("error", console.error);
    socket.on("message", function(data, isBinary) {
        // clients 
        wss.clients.forEach(function (client) {
            console.log(client)
            if(client.readyState == WebSocket.OPEN) {
                client.send(data, {binary:isBinary})
            }

        })
        console.log(data.toString());
    })
    socket.send("hello there i see you being persistent")

})