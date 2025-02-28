import React from 'react'
// React Router v6
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Loginpage from '../Loginpage/Loginpage';
import Dashhome from '../Dashboard/Dashhome/Dashhome';
import Addusers from '../Dashboard/Addusers/Addusers';
import Dashheader from '../Dashboard/Dashheader/Dashheader';
import Addtowers from '../Dashboard/Addtowers/Addtowers';
import AddTowersStep2 from '../Dashboard/Addtowers/Addtowerstep2';
import AddTowersStep3 from '../Dashboard/Addtowers/Addtowerstep3';
import Addtowerstep4 from '../Dashboard/Addtowers/Addtowerstep4';
import AddTowersStep5 from '../Dashboard/Addtowers/Addtowerstep5';
import Addcustomer from '../Dashboard/Addcustomer/Addcustomer';
import Addproject from '../Dashboard/Addproject/Addproject';
import Addtowerstep6 from '../Dashboard/Addtowers/Addtowerstep6';
import Individualtowermanagement from '../Dashboard/Dashhome/Individualtowermanagament';
import Addtowersstep7 from '../Dashboard/Addtowers/Addtowersstep7';
import Editcustomer from '../Dashboard/Addcustomer/Editcustomer/Editcustomer';
import EditPartner from '../Dashboard/Addproject/Editpartner/EditPartner';



const Navigation = () => {
  return (
   <>
        <Router>
            {/* <Header/> */}
            <Routes>
                {/* for management */}
                <Route path='/' element={<Loginpage/>} />
                <Route path='/login/dashboard' element={<Dashhome/>} />
                <Route path='/dashboard/addusers' element={<Addusers/>} />
                {/* <Route path="/dashboard/:mgmtId" element={<Dashheader/>} /> */}
                <Route path="/dashboard/addtowers" element={<Addtowers/>} />
                <Route path="/addtowers/step2" element={<AddTowersStep2 />} />
                <Route path="/addtowers/step3" element={<AddTowersStep3 />} />
                <Route path="/addtowers/step4" element={<Addtowerstep4 />} />
                <Route path="/addtowers/step5" element={<AddTowersStep5 />} />
                <Route path="/addtowers/step6" element={<Addtowerstep6 />} />
                <Route path="/addtowers/step7" element={<Addtowersstep7 />} />
                <Route path="/individualtowermanagement/:towerName" element={<Individualtowermanagement />} />




                <Route path="/dashboard/addcustomer" element={<Addcustomer />} />
                <Route path="/dashboard/editcustomer"  element={<Editcustomer />} />

                <Route path="/dashboard/Addproject" element={<Addproject />} />
                <Route path="/dashboard/editpartner" element={<EditPartner />} />


            </Routes>
            {/* <Footer/> */}
        </Router>

   </>
  )
}

export default Navigation