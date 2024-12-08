import { useState , useRef, useEffect} from 'react'
import './App.css'

import { useNavigate } from 'react-router-dom'

interface MessageSchema {
    payload:{
        data:string |undefined,
        side:string,
        user:string
    }
}

function Dashboard({id,name, setId}:{id:string, name:string, setId:(arg0:string) => void}) {
    const navigate = useNavigate()
    const reference2 = useRef<HTMLInputElement| null>(null)
    if(id == "") {
        navigate("/");
        //return <>redirecting to the create room page</>
    }
  const [message, setMessage] = useState<MessageSchema[]>([])
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const reference= useRef<HTMLInputElement | null>(null);
  const chatScroll = useRef<HTMLDivElement | null>(null);
  const [currentUser, setCurrentUser] = useState("")

  function sendMessage() {

    setMessage(m => [...m, {payload:{
        data:reference.current?.value,
        side:"client",
        user:name
    }} ])

    socket?.send(JSON.stringify({
        type:"chat",
        payload:{
            data:reference.current?.value,
            roomId:id,
            user:name
        }
    }))
    //socket?.send("some message");
    //if(!chatScroll.current?.childNodes) return;
    //const lastValue:number = chatScroll.current?.childNodes.length - 1 ; // using the smooth scroll
    //a delay once the rendering if happened
    // setTimeout(function() {
    //       chatScroll.current?.children[lastValue].scrollIntoView(true)
    // },1000)
  }
  

  useEffect(function () {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = (function () {
        ws.send(JSON.stringify({
            type:"join",
            payload:{
                roomId:id,
                user:name
            }
        }))
        console.log("connected to the ws")
        setCurrentUser(name)
    })
    ws.onmessage = function(event) {
        const data = JSON.parse(event.data)


        if(data.type == "chat") {
      setMessage((messages)=> [...messages, {
            payload:{
                data:JSON.parse(event.data).payload.data,
                side:"server",
                user:JSON.parse(event.data).payload.user}
    }])
    
        }
    if(data.type =="currentUser") {
        const value = data.payload.users.join(" ")
        setCurrentUser(value)
    }

    console.log(message)

    }
    setSocket(ws)
    return () => ws.close()
  },[])



  return (
    <div className='h-screen w-screen fixed top-0 left-0 bg-slate-900 text-white px-[200px]'>
      <h2 className='text-5xl font-serif border-b border-gray-400 w-2/4 my-6 pb-4 text-left'>Chat Application</h2>
      <h3 className='w-2/4 text-2xl text-left'>Room no : #{id} <br/> User: {name}</h3>
     <div className='chatBox w-2/3 bg-gray-950 h-3/5 rounded-sm relative m-auto mb-4'>
      <div className='flex flex-col border border-gray-500 h-[92%] overflow-scroll p-2 justify-between' ref={chatScroll} >
        {/* //all the message here */}
        <div>
        </div>
        <div className='flex flex-col overflow-y-scroll'>
             {message.map(function (item, index) {

                console.log(item)

                if(item.payload.side =="client"){
                    return   <div key={index} className=' my-[1px] py-2 px-1  self-end client min-w-[20%] max-w-[70%] flex gap-2'>
            <span className='h-[50px] w-[50px] rounded-full bg-green-600 order-2 flex justify-center items-center self-end'> 
                    {item.payload.user[0].toUpperCase()}
            </span>
            <span className='-translate-y-2 rounded-lg bg-green-600 flex justify-center items-center flex-1 relative after:content-[""] after:absolute after:right-[-8px] after:bottom-0 after:text-white after:border-solid after:border-green-600 after:border-8 after:border-r-transparent after:border-t-transparent p-2'>
                {item.payload.data}
            </span>
        </div>
                }

                if(item.payload.side == "server") {
                    return   <div className=' my-[1px] py-2 px-1 self-start server w-[70%] flex gap-2'>
            <span className='h-[50px] w-[50px] rounded-full bg-blue-600 flex justify-center items-center self-end'>
                {item.payload.user[0].toUpperCase()}
            </span>
            <span className='-translate-y-2 rounded-md bg-blue-600 flex justify-center items-center flex-1 relative before:content-[""] before:absolute before:left-[-8px] before:bottom-0 before:text-white before:border-solid before:border-blue-600 before:border-8 before:border-l-transparent before:border-t-transparent p-2'>{item.payload.data}</span>
        </div>
                }
                return <div>
                    Error
                </div>
        })}
      
      
        </div>
        
      </div>

     <div className='absolute bottom-0 w-full flex gap-1 '> 
          <input type="text" className='flex-1 focus:outline-none focus:border-none bg-slate-600 px-2' ref={reference}/>
          <button className='py-2 px-6 bg-slate-700' onClick={sendMessage}>send</button> 
     </div>
     
     </div>
     <div className='m-auto w-2/4  flex justify-center gap-4 text-black'>
        <input placeholder='roomid : #4-digits' ref={reference2} type="number" maxLength={4} className="py-4 px-2 textfield" />
            <button onClick={function(){
                 if(reference2.current?.value == "") {
                    alert("provide the room id")
                    return;
                }
                // sorry
                // alert("to add this feature -> simply putting the current client socket to the given room")
                socket?.send(JSON.stringify({
                    type:"join",
                    payload:{
                        roomId:reference2.current?.value.trim(),
                        user:name
                    }
                }))
                setId(reference2.current?.value.trim() as string)
                setMessage([])

            }} className="text-white py-2 px-4 border cursor-pointer border-gray-600 cursor rounded">join another room</button>
      </div> 

      <div>
        currentUsers : {currentUser}
      </div>

    </div>
  )
}

export default Dashboard
