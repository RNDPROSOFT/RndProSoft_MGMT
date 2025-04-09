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
import Partnerdetails from '../Dashboard/Addproject/Partnerdetails/Partnerdetails';
import Getcustomerlist from '../Dashboard/Addcustomer/Getcustomerlist/Getcustomerlist';
import Updateblocks from '../Dashboard/Dashhome/UpdateBlocks/Updateblocks';
import Updateflats from '../Dashboard/Dashhome/Updateflats/Updateflats';
import UpdateImages from '../Dashboard/Dashhome/Updateimages/UpdateImages';
import Flatdetails from '../Dashboard/Dashhome/FlatDetails/Flatdetails';
import Bookingflat from '../Dashboard/Dashhome/BookingFlat/Bookingflat';
import AdvancePayment from '../Dashboard/Dashhome/AdvancePayment/AdvancePayment';
import Checkhistory from '../Checkhistory/Checkhistory';




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


                <Route path="/dashboard/Flatdetails" element={<Flatdetails />} />
                <Route path="/dashboard/updateblocks" element={<Updateblocks />} />
                <Route path="/dashboard/updateflats" element={<Updateflats />} />
                <Route path="/dashboard/updateimages" element={<UpdateImages />} />


                <Route path="/dashboard/addcustomer" element={<Addcustomer />} />
                <Route path="/dashboard/editcustomer/:id"  element={<Editcustomer />} />
                <Route path="/dashboard/getcustomerlist"  element={<Getcustomerlist />} />

                <Route path="/dashboard/Addproject" element={<Addproject />} />
                <Route path="/dashboard/editpartner/:id" element={<EditPartner />} />

                <Route path="/dashboard/partnerdetails" element={<Partnerdetails />} />

                <Route path="/dashboard/bookingflats" element={<Bookingflat />} />
                <Route path="/dashboard/advancepayment" element={<AdvancePayment/>} />
                <Route path="/dashboard/history" element={<Checkhistory/>} />

             


            </Routes>
            {/* <Footer/> */}
        </Router>

   </>
  )
}

export default Navigation