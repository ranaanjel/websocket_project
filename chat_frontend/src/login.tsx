import { useNavigate } from "react-router-dom"
import { useRef } from "react"

export function Login({setId, setUser}:{setId:(arg0: string) => void, setUser:(arg0:string) => void}) {

    const navigate = useNavigate();

    const reference = useRef<HTMLInputElement| null>(null)


    return <div className="h-screen w-width bg-black flex justify-center items-center">
        <div className="m-auto w-1/5 flex flex-col gap-2">
        
            <input className="py-4 px-2" ref={reference} type="text"placeholder="user name" required/>
            <input onClick={function() {
                if(reference.current?.value == "" ) {
                    alert("requires the username")
                    return ;
                }
                var random = String(Math.floor(Math.random()*10000));
                setId(random)
                setUser(reference.current?.value as string)
                navigate("/dashboard")
                

            }} className="text-white py-2 px-4 border cursor-pointer border-gray-600 cursor" type="submit" value="create room for chat" />
            
        </div>
    </div>
}