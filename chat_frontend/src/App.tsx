import {BrowserRouter, Routes, Route} from "react-router-dom"
import './App.css'
import Dashboard from './chatroom'
import { Login } from './login'
import { useState } from "react"

function App() {
  const [id, setID] = useState<string>("");
  const [userName, setUser] = useState<string>("")

  return <BrowserRouter>
    <Routes>
      <Route index element={<Login setUser={setUser} setId={setID} />}></Route>
      <Route path="/dashboard" element={<Dashboard setId={setID} id={id} name={userName}/>}></Route>
    </Routes>
  </BrowserRouter>
}

export default App
