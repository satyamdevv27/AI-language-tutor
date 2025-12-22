import React from 'react'
import {Routes , Route, Navigate} from 'react-router-dom'
import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import Home from './pages/home.jsx'

function App() {
  

  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/home' element={<Home/>}/>
      </Routes>
    </div>
  )
}

export default App
