


// Testing server
const baseUrl='http://65.1.111.97:3000'


const apiName={
    getAdminLogin:"api/management/login",
    forgotPassword:"api/management/mgmt/forget/password",
    updatePassword:"api/management/mgmt/update/password",
    addManagement:"api/management/add/management",
    addDeveloper:'api/management/add/developer',
    addTowers:'api/management/add/towers',
    getTowerdetails:'api/management/all/towers',
    getDeveloperdetails:"api/management/all/developers",
    getStateandcities:"api/user/all/cities/states",
    enquiryForm:"api/user/enquery/form",
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
    getallprojectsforuser:"api/user/get/all/project/details",
    getTowerdetailsforUser: "api/user/tower/details/filter?page=1&limit=10&city="


}

const config= {
    baseUrl,
    apiName
}


export default config;



