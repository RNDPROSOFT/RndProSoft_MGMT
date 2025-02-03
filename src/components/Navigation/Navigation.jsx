import React from 'react'
// React Router v6
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../screens/Home/Home';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Ourproject from '../screens/Ourprojects/Ourproject';
import Aboutus from '../screens/Aboutus/Aboutus';
import Contactus from '../screens/Contactus/Contactus';
import Blogs from '../screens/Blogs/Blogs';
import Loginpage from '../Loginpage/Loginpage';
import Dashhome from '../Dashboard/Dashhome/Dashhome';
import Addusers from '../Dashboard/Addusers/Addusers';
import Dashheader from '../Dashboard/Dashheader/Dashheader';



const Navigation = () => {
  return (
   <>
        <Router>
            {/* <Header/> */}
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/ourprojects' element={<Ourproject/>} />
                <Route path='/aboutus' element={<Aboutus/>} />

                <Route path='/contactus' element={<Contactus/>} />
                <Route path='/blogs' element={<Blogs/>} />



                {/* for management */}
                <Route path='/login' element={<Loginpage/>} />
                <Route path='/login/dashboard' element={<Dashhome/>} />
                <Route path='/dashboard/addusers' element={<Addusers/>} />
                <Route path="/dashboard/:mgmtId" element={<Dashheader/>} />

            </Routes>
            {/* <Footer/> */}
        </Router>

   </>
  )
}

export default Navigation