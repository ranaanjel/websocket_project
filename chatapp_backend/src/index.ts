import WebSocket  from "ws"; 
import {WebSocketServer} from "ws";

const wss = new WebSocketServer({port:8080})

// interface User {
//     socket:WebSocket,
//     room : string
// }

// const socketArr:User[] = []

const socketArr:Map<string, WebSocket[]> = new Map();
const socketName:Map<string, string[]> = new Map();

//schema for the join
// {type: "join", payload:{roomId:string, name:string}}
//schema for the chat
// {type: "chat", payload:{roomId:string, name:string, data:string}}

wss.on("connection", function (socket) {
    socket.on("message", function(data, isBinary){

        console.log(socketArr)

        let message = JSON.parse(data.toString());

        let roomNumber = message.payload.roomId;
        let name = message.payload.user;

        console.log(roomNumber, name, "-------------------------------------")

        if(message.type == "join") {
            //checking if the room is available if then then adding the socket to the array and if not then 
            //creating new one.
            if(socketArr.has(roomNumber)) {
                socketArr.get(roomNumber)?.push(socket)
                socketName.get(roomNumber)?.push(name)

                console.log(socketName.get(roomNumber), " what is going on", Object.keys(socketName))

                //whenever a user joins we check for dead connection - i think this should checked on the close server
                //hack works here
                socketArr.get(roomNumber)?.forEach(function (m, index) {
                    console.log(m.readyState, roomNumber)
                    if(m.readyState == WebSocket.CLOSED) {
                        console.log("closed value")
                        const value  = socketName.get(roomNumber)?.filter((m,i) => i != index) as string[];
                        console.log(value)
                       socketName.set(roomNumber,value);
                    }
                })
                socketArr.get(roomNumber)?.forEach(function(m) {
                     m.send(JSON.stringify({
                    type:"currentUser",
                    payload:{
                        users:socketName.get(roomNumber)
                    }
                }))
                })

                return;
            }else {
                socketArr.set(roomNumber, [socket]);
                socketName.set(roomNumber, [name]);
                socketArr.get(roomNumber)?.forEach(function (m) {
                   m.send(JSON.stringify({
                    type:"currentUser",
                    payload:{
                        users:socketName.get(roomNumber)
                    }
                }))
                })
            }
        }
        if(message.type == "chat") { //sending the 
            //assuming the person already connected to the room and socket in the room alloted.
            //console.log(message.payload.data)
            socketArr.get(roomNumber)?.forEach(soc => {
                if(soc !== socket) {
                    soc.send(JSON.stringify({type:"chat", payload:{
                        user:message.payload.user,
                        data:message.payload.data
                    }}))
                }
            })
        }



    })

    //in case of disconnect removing the socket and name from the map

   // socket.send('message')
   //console.log(socketArr)
})