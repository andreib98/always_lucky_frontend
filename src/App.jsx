import './App.css'
import Navbar from '../components/Navbar'
import Main from '../components/Main'
import Footer from '../components/Footer'
import Play from '../components/Play'
import Shop from '../components/Shop'
import Contact from '../components/Contact'
import Home from '../components/Home'
import { Route, Routes } from "react-router-dom"
import io from 'socket.io-client'
import { useEffect, useState } from 'react'

const socket = io.connect("http://34.16.151.166:8081")

function App() {


  return (
    <>

      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Play" element={<Play />} />
          <Route path="/Shop" element={<Shop />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Main" element={<Main />} />
        </Routes>
        <Footer />
      </div>
      
    </>
    
  )
}

export default App;
