import { useState , useRef, useEffect} from 'react'
import './App.css'

import { useNavigate } from 'react-router-dom'

 function Dashboard({id}:{id:string}) {
    const navigate = useNavigate()
    const reference2 = useRef<HTMLInputElement| null>(null)
    if(id == "") {
        navigate("/");
        //return <>redirecting to the create room page</>
    }
  const [message, setMessage] = useState<string[]>([])
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const reference= useRef<HTMLInputElement | null>(null);
  const chatScroll = useRef<HTMLDivElement | null>(null)

  function sendMessage() {

    setMessage(m => [...m, reference.current?.value as string])
    //socket?.send("some message");
    if(!chatScroll.current?.childNodes) return;
    const lastValue:number = chatScroll.current?.childNodes.length - 1 ;
    //a delay once the rendering if happened
    // setTimeout(function() {
    //       chatScroll.current?.children[lastValue].scrollIntoView(true)
    // },1000)
  }
  

  useEffect(function () {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = (function (event) {
        ws.send(JSON.stringify({
            type:"join",
            payload:{
                roomId:id
            }
        }))
    })
    ws.onmessage = function(event) {
      setMessage(function (messages) {
        return [...messages, event.data]
      })
    }
    setSocket(ws)
    return () => ws.close()
  },[])



  return (
    <div className='h-screen w-screen fixed top-0 left-0 bg-slate-900 text-white px-[200px]'>
      <h2 className='text-5xl font-serif border-b border-gray-400 w-2/4 my-6 pb-4 text-left'>Chat Application</h2>
      <h3 className='w-2/4 text-2xl text-left'>Room no : #{id}</h3>
     <div className='chatBox w-2/3 bg-gray-950 h-3/5 rounded-sm relative m-auto mb-4'>
      <div className='flex flex-col border border-gray-500 border-b-0 h-[92%] overflow-y-scroll message' ref={chatScroll} >
        {/* //all the message here */}
        {message.map(function (item, index) {
          return <span className='inline my-[1px] py-2 px-1 bg-gray-600 self-start' key={index}> {item}</span>
        })}
        
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
            }} className="text-white py-2 px-4 border cursor-pointer border-gray-600 cursor rounded">join another room</button>
      </div> 

    </div>
  )
}

export default Dashboard
