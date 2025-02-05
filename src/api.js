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
                // headers: {
                //     authToken: localStorage.getItem(utilis.string.localStorage.sessionId),
                //    },
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
                // headers:{

                // }
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
                // headers:{

                // }
            })
    }catch(e){
                return e.response;
    }
}


async function addTowers(body) {
    try{
            return await axiosinstance.post(utilis.config.apiName.addTowers,body,{
                headers: { 
                    'Content-Type': 'multipart/form-data'
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
    addTowers
}




export default api;