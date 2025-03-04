import axios from 'axios';
import utilis from './utilis';



const axiosinstance=axios.create({
    baseURL:utilis.config.baseUrl,
    timeout:10000,
    // headers: { 'Content-Type': 'multipart/form-data' }

})


async function getAdminLogin(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.getAdminLogin,body,{
                headers: {
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                   },
            })
    }catch(e){
                return e.response;
    }
}


async function forgotPassword(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.forgotPassword,body,{
                headers: {
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                   },
            })
    }catch(e){
                return e.response;
    }
}

async function updatePassword(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.updatePassword,body,{
                headers: {
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                   },
            })
    }catch(e){
                return e.response;
    }
}



async function addManagement(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.addManagement,body,{
                headers: {
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                   },
            })
    }catch(e){
                return e.response;
    }
}


async function logOut(
    managementId
) {
  try {
   
    return await axiosinstance.post(
      "api/management/logout" + 
         `?mgmtId=${managementId}`,
      {
        headers: {
            authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
           },
      }
    );
  } catch (e) {
    return e.response;
  }
}



async function addDeveloper(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.addDeveloper,body,{
                headers: {
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                   },
            })
    }catch(e){
                return e.response;
    }
}


async function addTowers(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.addTowers,body,{
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId)
                  },
            })
    }catch(e){
                return e.response;
    }
}

async function enquiryForm(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.enquiryForm,body,{
                headers: {
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                   },
            })
    }catch(e){
                return e.response;
    }
}
async function insertGst(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.insertGst,body,{
                headers: {
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                   },
            })
    }catch(e){
                return e.response;
    }
}

async function updateGst(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.updateGst,body,{
                headers: {
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                   },
            })
    }catch(e){
                return e.response;
    }
}

async function addCustomer(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.addCustomer,body,{
                headers: {
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                   },
            })
    }catch(e){
                return e.response;
    }
}

async function addProjects(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.addProjects,body,{
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                  },
            })
    }catch(e){
                return e.response;
    }
}

async function getProjectdetails() {
    try {
        return await axiosinstance.get(utilis.config.apiName.getProjectdetails,{
            headers: { 
               
                authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
              },
        });
        
    } catch (e) {
        return e.response;
    }
}



async function getParticularbasedontowers(towerId) {
    try {
        return await axiosinstance.get(`${utilis.config.apiName.getParticularbasedontowers}?towerId=${towerId}`,{
            headers: { 
               
                authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
              },
        })
    } catch (e) {
        return e.response;
    }
}


async function addFlats(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.addFlats,body,{
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                  },
            })
    }catch(e){
                return e.response;
    }
}




async function getallprojectsforuser() {
    try {
        return await axiosinstance.get(utilis.config.apiName.getallprojectsforuser,{
            headers: { 
               
                authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
              },
        })
    } catch (e) {
        return e.response;
    }
}

async function getTowerdetailsforUser(projectId = "", constructionStatus = "", projectType = "", state = "", page = 1) {
    try {
        const url = `${utilis.config.apiName.getTowerdetailsforUser}&projectId=${projectId}&constructionStatus=${constructionStatus}&projectType=${projectType}&state=${state}&page=${page}`;
        return await axiosinstance.get(url, {
            headers: { 
                authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
            },
        });
    } catch (e) {
        return e.response;
    }
}





async function getStateandcities() {
    try {
        return await axiosinstance.get(utilis.config.apiName.getStateandcities,{
            headers: { 
               
                authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
              },
        })
    } catch (e) {
        return e.response;
    }
}


async function getTowerdetails() {
    try {
        return await axiosinstance.get(utilis.config.apiName.getTowerdetails,{
            headers: { 
               
                authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
              },
        })
    } catch (e) {
        return e.response;
    }
}

async function getGst() {
    try {
        return await axiosinstance.get(utilis.config.apiName.getGst,{
            headers: { 
               
                authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
              },
        })
    } catch (e) {
        return e.response;
    }
}
async function getCompanydetails() {
    try {
        return await axiosinstance.get(utilis.config.apiName.getCompanydetails,{
            headers: { 
               
                authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
              },
        })
    } catch (e) {
        return e.response;
    }
}


async function getDeveloperdetails() {
    try {
        return await axiosinstance.get(utilis.config.apiName.getDeveloperdetails,{
            headers: { 
               
                authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
              },
        })
    } catch (e) {
        return e.response;
    }
}

async function getParticularTowerDetailsforser(towerId) {
    try {
        return await axiosinstance.get(`${utilis.config.apiName.getParticularTowerDetailsforser}${towerId}`, {
            headers: { 
                authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
            },
        });
    } catch (e) {
        return e.response;
    }
}

async function getParticularTowerDetailsformanagement(towerId) {
    try {
        return await axiosinstance.get(`${utilis.config.apiName.getParticularTowerDetailsformanagement}${towerId}`, {
            headers: { 
                authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
            },
        });
    } catch (e) {
        return e.response;
    }
}
async function getTowerdetailsformanagement(projectId = "", constructionStatus = "", projectType = "", state = "", page = 1) {
    try {
        const url = `${utilis.config.apiName.getTowerdetailsformanagement}&projectId=${projectId}&constructionStatus=${constructionStatus}&projectType=${projectType}&state=${state}&page=${page}`;
        return await axiosinstance.get(url, {
            headers: { 
                authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
            },
        });
    } catch (e) {
        return e.response;
    }
}



async function getindividualtowerdetails(towerId) {
    try {
        return await axiosinstance.get(`${utilis.config.apiName.getindividualtowerdetails}${towerId}`, {
            headers: { 
                authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
            },
        });
    } catch (e) {
        return e.response;
    }
}



async function getStateandcitiesformanagement() {
    try {
        return await axiosinstance.get(utilis.config.apiName.getStateandcitiesformanagement,{
            headers: { 
               
                authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
              },
        })
    } catch (e) {
        return e.response;
    }
}





// update Customer details
async function updateCustomerdetails() {
    try {
        return await axiosinstance.get(utilis.config.apiName.updateCustomerdetails,{
            headers: { 
               
                authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
              },
        })
    } catch (e) {
        return e.response;
    }
}





async function updateProjectdetails(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.updateProjectdetails,body,{
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                  },
            })
    }catch(e){
                return e.response;
    }
}
const api={
    getAdminLogin,
    forgotPassword,
    updatePassword,
    addManagement,
    logOut,
    addDeveloper,
    addTowers,
    enquiryForm,
    insertGst,
    updateGst,
    addCustomer,
    addProjects,
    getProjectdetails,
    getParticularbasedontowers,
    addFlats,
    getallprojectsforuser,
    getTowerdetailsforUser,
    getStateandcities,
    getTowerdetails,
    getGst,
    getCompanydetails,
    getDeveloperdetails,
    getParticularTowerDetailsforser,
    getParticularTowerDetailsformanagement,
    getTowerdetailsformanagement,
    getindividualtowerdetails,
    getStateandcitiesformanagement,
    updateCustomerdetails,
    updateProjectdetails
   

}




export default api;