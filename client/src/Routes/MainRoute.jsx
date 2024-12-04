import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../Pages/Login/Login'
import SignUp from '../Pages/SignUp/SignUp'
import { HomePage } from '../Pages/HomePage/HomePage'
import { useZustand } from '../Zustand/useZustand'


const MainRoute = () => {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route   path='/signup' element={<SignUp/>}/>
        <Route path="/home"  element={<HomePage/>}  />
      </Routes>
    </div>
  )
}

export default MainRoute
