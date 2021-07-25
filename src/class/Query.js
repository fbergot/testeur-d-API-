import axios from 'axios';

/**
 * Singleton ; to do ajax query with axios
 */
export default class QueryInit {

  static _instance = null;

  constructor(axios) {
    this.axios = axios;
  }

  /**
   * Return evr same QueryInit instance
   * @returns ever same instance of QueryInit (singleton)
   */
  static getInstance() {
    if (this._instance === null) {
      this._instance = new QueryInit(axios);
    }
    return this._instance;
  }
 
  /**
   * Select good method according to method
   * @param {{url : String , method : String}} objQuery 
   * @param {{fields : String}} dataBody
   * @throws Error if method is not in the list(get, post, put , delete) 
   * @returns {Any} result of query
   */
  dispatchAccordingToMethod(objQuery, dataBody) {
    let result;
    switch (objQuery.method) {
      case 'GET':
        result =  this.getOrDelete(objQuery, dataBody);
        break;
      case 'DELETE':
        result = this.getOrDelete(objQuery, dataBody);
        break;
      case 'POST':
       result = this.post(objQuery, dataBody);
        break;
      case 'PUT':
       result = this.put(objQuery, dataBody);
        break;      
      default:
        throw new Error("La méthode n'est pas prise en charge");
    }
    return result;
  }


     async getOrDelete(obj_query , dataBody) {
        console.log(obj_query , dataBody);
        let response;
        try {
            if (obj_query.method === "GET") {
              response = await this.axios.get(obj_query.url);
            } else if (obj_query.method === "DELETE") {
              response = await this.axios.delete(obj_query.url);
            }               
            
        } catch (error) {
             if (error.response) {
               /*
                * The request was made and the server responded with a
                * status code that falls out of the range of 2xx
                */
               console.log(error.response.data);
               console.log("StatusCode :" + error.response.status);
               console.log(error.response.headers);
             } else if (error.request) {
               /*
                * The request was made but no response was received, `error.request`
                * is an instance of XMLHttpRequest in the browser and an instance
                * of http.ClientRequest in Node.js
                */
                 console.log(error.request);
             } else {
               // Something happened in setting up the request and triggered an Error
               console.log("Error", error.message);
             }
            
        }
        if (response) {
            if (response.request.readyState === 4 && response.status >= 200 && response.status < 300) {
              console.log('in query ok');
                return response;
            }
            return undefined
        }
        return undefined      
    }

  async put(objQuery, dataBody) {
    let response;
     try {
        response = axios.put(objQuery.url, dataBody);
     } catch (error) {
       if (error.response) {
         console.log(error.response.data);
         console.log("StatusCode :" + error.response.status);
         console.log(error.response.headers);
       } else if (error.request) {
         console.log(error.request);
       } else {
         console.log("Error", error.message);
       }
     }
     if (response) {
       if (response.request.readyState === 4 && response.status >= 200 && response.status < 300) {
         return response;
       }
       return undefined;
     }
     return undefined;      
  }

  async post(objQuery, dataBody) {
     let response;
     try {
          response = await this.axios.post(objQuery.url, dataBody);
     } catch (error) {
       if (error.response) {
         console.log(error.response.data);
         console.log("StatusCode :" + error.response.status);
         console.log(error.response.headers);
       } else if (error.request) {
         console.log(error.request);
       } else {
         console.log("Error", error.message);
       }
     }
     if (response) {
       if (response.request.readyState === 4 && response.status >= 200 && response.status < 300) {
         return response;
       }
       return undefined;
     }
     return undefined; 
  }
}