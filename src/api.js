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










async function updateProjectdetails(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.updateProjectdetails,body,{
                headers: { 
                    // 'Content-Type': 'multipart/form-data',
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                  },
            })
    }catch(e){
                return e.response;
    }
}

// get partner details for management

async function getPartnerdetails() {
    try {
        return await axiosinstance.get(utilis.config.apiName.getPartnerdetails,{
            headers: { 
               
                authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
              },
        })
    } catch (e) {
        return e.response;
    }
}

// get particular partner details for management

async function getParticularPartnerdetails(projectId) {
    try {
        const response = await axiosinstance.get(
            `${utilis.config.apiName.getParticularPartnerdetails}=${projectId}`, // Correctly append the projectId
            {
                headers: {
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                },
            }
        );
        return response; // Return the response directly
    } catch (error) {
        console.error("Error in getParticularPartnerdetails:", error.message);
        return error.response || { status: 500, message: "Internal Server Error" }; // Return a fallback response
    }
}



// update partner details for management

async function updatePartnerdetails(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.updatePartnerdetails,body,{
                headers: { 
                    // 'Content-Type': 'multipart/form-data',
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                  },
            })
    }catch(e){
                return e.response;
    }
}





// get customer details
async function getCustomerdetails(search = "", limit = 5, page = 1) {
    try {
        return await axiosinstance.get(`api/management/user/list?search=${search}&limit=${limit}&page=${page}`, {
            headers: { 
                authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
            },
        });
    } catch (e) {
        return e.response;
    }
}


// get particular customer details
// get particular partner details for management

async function getParticularCustomerdetails(userId) { // Accept userId as a parameter
    try {
        return await axiosinstance.get(`${utilis.config.apiName.getParticularCustomerdetails}${userId}`, { // Append userId to the URL
            headers: { 
                authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
            },
        });
    } catch (e) {
        return e.response;
    }
}



// update partner details for management

async function updateCustomerdetails(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.updateCustomerdetails,body,{
                headers: { 
                    // 'Content-Type': 'multipart/form-data',
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                  },
            })
    }catch(e){
                return e.response;
    }
}



// update partner details for management

async function updateAboutdetails(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.updateAboutdetails,body,{
                headers: { 
                    // 'Content-Type': 'multipart/form-data',
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                  },
            })
    }catch(e){
                return e.response;
    }
}



// update partner details for management

async function updateBlockdetails(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.updateBlockdetails,body,{
                headers: { 
                    // 'Content-Type': 'multipart/form-data',
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                  },
            })
    }catch(e){
                return e.response;
    }
}


// update partner details for management

async function updateFlatdetails(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.updateFlatdetails,body,{
                headers: { 
                    // 'Content-Type': 'multipart/form-data',
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                  },
            })
    }catch(e){
                return e.response;
    }
}
async function createEmiPlan(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.createEmiPlan,body,{
                headers: { 
                    // 'Content-Type': 'multipart/form-data',
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                  },
            })
    }catch(e){
                return e.response;
    }
}


async function getAllEmiPlans() {
    try {
        return await axiosinstance.get(utilis.config.apiName.getAllEmiPlans,{
            headers: { 
               
                authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
              },
        })
    } catch (e) {
        return e.response;
    }
}

async function updateEmiPlan(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.updateEmiPlan,body,{
                headers: { 
                    // 'Content-Type': 'multipart/form-data',
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                  },
            })
    }catch(e){
                return e.response;
    }
}

async function getImagesforProject(towerId) {
    try {
        return await axiosinstance.get(`${utilis.config.apiName.getImagesforProject}${towerId}`, {
            headers: { 
                authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
            },
        });
    } catch (e) {
        return e.response;
    }
}


async function deleteImageproject(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.deleteImageproject,body,{
                headers: { 
                    // 'Content-Type': 'multipart/form-data',
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                  },
            })
    }catch(e){
                return e.response;
    }
}


async function isProjectIsvisble(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.isProjectIsvisble,body,{
                headers: { 
                    // 'Content-Type': 'multipart/form-data',
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                  },
            })
    }catch(e){
                return e.response;
    }
}


async function getAllFlatsDetailsForBooking(towerId) {
    try {
        return await axiosinstance.get(`${utilis.config.apiName.getAllFlatsDetailsForBooking}${towerId}`, {
            headers: { 
                authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
            },
        });
    } catch (e) {
        return e.response;
    }
}





async function AddIMages(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.AddIMages,body,{
                headers: { 
                    // 'Content-Type': 'multipart/form-data',
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                  },
            })
    }catch(e){
                return e.response;
    }
}


async function createEstimationForm(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.createEstimationForm,body,{
                headers: { 
                    // 'Content-Type': 'multipart/form-data',
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                  },
            })
    }catch(e){
                return e.response;
    }
}

async function bookingFlats(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.bookingFlats,body,{
                headers: { 
                    // 'Content-Type': 'multipart/form-data',
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                  },
            })
    }catch(e){
                return e.response;
    }
}



// api.js

async function userdetailsforbooking(phoneNumber) {
    try {
        // Dynamically add the phoneNumber to the URL
        const url = `${utilis.config.apiName.userdetailsforbooking}${phoneNumber}`;
        return await axiosinstance.get(url, {
            headers: { 
                authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
            },
        });
    } catch (e) {
        return e.response;
    }
}




async function advancePayment(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.advancePayment,body,{
                headers: { 
                    // 'Content-Type': 'multipart/form-data',
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                  },
            })
    }catch(e){
                return e.response;
    }
}



async function getFlatHistory() {
    try {
        return await axiosinstance.get(utilis.config.apiName.getFlatHistory,{
            headers: { 
               
                authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
              },
        })
    } catch (e) {
        return e.response;
    }
}


async function getPaymentHistory() {
    try {
        return await axiosinstance.get(utilis.config.apiName.getPaymentHistory,{
            headers: { 
               
                authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
              },
        })
    } catch (e) {
        return e.response;
    }
}







async function getParticularFlatsDetailsForBooking(flatId) {
    try {
        return await axiosinstance.get(`${utilis.config.apiName.getParticularFlatsDetailsForBooking}${flatId}`, {
            headers: { 
                authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
            },
        });
    } catch (e) {
        return e.response;
    }
}


async function getControlsForAdmin(managementId) {
    try {
        return await axiosinstance.get(utilis.config.apiName.getControlsForAdmin, {
            params: { mgmtId: managementId },
            headers: { 
                authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
            },
        });
    } catch (e) {
        return e.response;
    }
}


async function getManagementList() {
    try {
        return await axiosinstance.get(utilis.config.apiName.getManagementList,{
            headers: { 
               
                authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
              },
        })
    } catch (e) {
        return e.response;
    }
}


// async function getParticularManagementDetails() {
//     try{
//             return await axiosinstance.post(utilis.config.apiName.getParticularManagementDetails,{
//                 headers: { 
//                     // 'Content-Type': 'multipart/form-data',
//                     authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
//                   },
//             })
//     }catch(e){
//                 return e.response;
//     }
// }



async function postParticularManagementDetails(body) {
    try{
            return await axiosinstance.patch(utilis.config.apiName.postParticularManagementDetails,body,{
                headers: { 
                    // 'Content-Type': 'multipart/form-data',
                    authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                  },
            })
    }catch(e){
                return e.response;
    }
}


async function getEmiDetailsForPaymentPage(flatId, userId) {
    try {
        return await axiosinstance.get(
            `${utilis.config.apiName.getEmiDetailsForPaymentPage}?bookedFlatId=${flatId}&userId=${userId}`,
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
    updateProjectdetails,
    getPartnerdetails,
    getParticularPartnerdetails,
    getCustomerdetails,
    updatePartnerdetails,
    getParticularCustomerdetails,
    updateAboutdetails,
    updateBlockdetails,
    updateFlatdetails,
    createEmiPlan,
    getAllEmiPlans,
    updateEmiPlan,
    getImagesforProject,
    deleteImageproject,
    isProjectIsvisble,
    getAllFlatsDetailsForBooking,
    getParticularFlatsDetailsForBooking,
    AddIMages,
    createEstimationForm,
    bookingFlats,
    userdetailsforbooking,
    advancePayment,
    getFlatHistory,
    getPaymentHistory,
    getControlsForAdmin,
    getManagementList,
    postParticularManagementDetails,
    getEmiDetailsForPaymentPage


   

}




export default api;