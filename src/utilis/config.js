


// Testing server
const baseUrl='http://65.1.111.97:3000'


const apiName={
    getAdminLogin:"api/management/login",
    forgotPassword:"api/management/mgmt/forget/password",
    updatePassword:"api/management/mgmt/update/password",
    addManagement:"api/management/add/management",
    addDeveloper:'api/management/add/developer'
}

const config= {
    baseUrl,
    apiName
}


export default config;



