//production server
const baseUrl='https://rndserver.rndprosoft.com'


// Testing server
// const baseUrl='http://65.1.111.97:3000'


// localhost server
// const baseUrl='http://localhost:3000'

const apiName={
    // for management
    getAdminLogin:"api/management/login",
    forgotPassword:"api/management/mgmt/forget/password",
    updatePassword:"api/management/mgmt/update/password",
    addManagement:"api/management/add/management",
    addDeveloper:'api/management/add/developer',
    addTowers:'api/management/add/towers',
    getTowerdetails:'api/management/all/towers',
    getDeveloperdetails:"api/management/all/developers",
    insertGst:"api/management/insert/settings",
    updateGst:"api/management/update/settings",
    getGst:"api/management/get/gst/details",
    visibleTowers:"api/management/tower/isvisible",
    addCustomer:"api/user/registration",
    addProjects:"api/management/add/project",
    getCompanydetails:"api/management/get/company/details",
    getProjectdetails:'api/management/get/project/details',
    getParticularbasedontowers:"api/management/get/particular/block/data",
    addFlats:"api/management/add/flats",
    // for towers block details
     getParticularTowerDetailsformanagement: "api/management/get/particular/block/data?towerId=",
     getTowerdetailsformanagement:"api/management/tower/details/filter?page=1&limit=50&city=",

    //  for individual tower details
    getindividualtowerdetails:"api/management/get/particular/tower/details?towerId=",
    getStateandcitiesformanagement:"api/management/all/cities/states",

    // editing customer details
    updateCustomerdetails:"api/management/update/user/details",

    // update project details
    updateProjectdetails:"api/management/update/tower/details",

    // get partner details
    getPartnerdetails:"api/management/get/project/details",

    // getparticularpartnerdetails
    getParticularPartnerdetails: "api/management/particular/project/details?projectId",

    // updatePartnerdetails
    updatePartnerdetails:"api/management/update/project/details",


    // get customer details
    getCustomerdetails: "api/management/user/list",


    // getparticularcustomerdetails
    getParticularCustomerdetails:"api/management/particular/user/details?userId=",

    // update about details
    updateAboutdetails:"api/management/update/about/details",


    // updatepartcicularblock details
    updateBlockdetails:"api/management/update/block/details",


    // update flat details
    updateFlatdetails:"api/management/update/flat/details",

    // createemiplan
    createEmiPlan:"api/management/create/emi/plans",

    // getAllEmiplans
    getAllEmiPlans:"api/management/emi/plans",


    // updateEmiplan
    updateEmiPlan:"api/management/update/emi/plans",


    // getimagesforproject
    getImagesforProject:"api/management/images/particular/tower?towerId=",


    // updateImage
    deleteImageproject:"api/management/delete/image",

    //  ISprojectisvisbleforuser
    isProjectIsvisble:"api/management/tower/isvisible",
   
    // get all flat details for booking
    getAllFlatsDetailsForBooking:"api/management/all/flats/for/booking?towerId=",


      // get particular flat details for booking
      getParticularFlatsDetailsForBooking:"api/management/particular/flat/details?flatId=",


    // add images
    AddIMages:"api/management/update/images",

    // create estimaiton form
    createEstimationForm:"api/management/create/estimation",


    // bookingflats
    bookingFlats:"api/management/book/flats",

   

// userdetailsforbooking
userdetailsforbooking: "api/management/get/user/details?phoneNumber=",  // Make the phoneNumber dynamic

// advancePayment
advancePayment:"api/management/make/payment",

        // flathistory
        getFlatHistory:"api/management/get/booked/flats/history",


        // paymentHistory
        getPaymentHistory:"api/management/get/payment/history",


        // superadmin login
        // getControlsForAdmin:"api/management/mgmt/controls?mgmtId=681b56d54ae8910decaad729",
           getControlsForAdmin: "api/management/mgmt/controls",


        //get management list
          getManagementList:"api/management/mgmt/list",

        // Edit management details
        postParticularManagementDetails:"api/management/modify/mgmt/details",


        // emidetailsforpaymentpage
     getEmiDetailsForPaymentPage: "api/management/emi/schedulers",






    // for user
    getStateandcities:"api/user/all/cities/states",
    enquiryForm:"api/user/enquery/form",
    getallprojectsforuser:"api/user/get/all/project/details",
    getTowerdetailsforUser: "api/user/tower/details/filter?page=1&limit=10&city=",
    getParticularTowerDetailsforser: "api/user/particular/tower/details?towerId=",
   

        


}

const config= {
    baseUrl,
    apiName
}


export default config;



