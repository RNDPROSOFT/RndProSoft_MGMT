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
import Addtowers from '../Dashboard/Addtowers/Addtowers';
import AddTowersStep2 from '../Dashboard/Addtowers/Addtowerstep2';
import AddTowersStep3 from '../Dashboard/Addtowers/Addtowerstep3';
import Addtowerstep4 from '../Dashboard/Addtowers/Addtowerstep4';
import AddTowersStep5 from '../Dashboard/Addtowers/Addtowerstep5';



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
                <Route path="/dashboard/addtowers" element={<Addtowers/>} />
                <Route path="/addtowers/step2" element={<AddTowersStep2 />} />
                <Route path="/addtowers/step3" element={<AddTowersStep3 />} />
                <Route path="/addtowers/step4" element={<Addtowerstep4 />} />
                <Route path="/addtowers/step5" element={<AddTowersStep5 />} />


            </Routes>
            {/* <Footer/> */}
        </Router>

   </>
  )
}

export default Navigation