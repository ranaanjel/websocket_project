import {BrowserRouter, Routes, Route} from "react-router-dom"
import './App.css'
import Dashboard from './chatroom'
import { Login } from './login'
import { useState } from "react"

function App() {
  const [id, setID] = useState<string>("")

  return <BrowserRouter>
    <Routes>
      <Route index element={<Login setId={setID} />}></Route>
      <Route path="/dashboard" element={<Dashboard id={id}/>}></Route>
    </Routes>
  </BrowserRouter>
}

export default App
