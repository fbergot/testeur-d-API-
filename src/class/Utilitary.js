export default class Utilitary {
  /**
   * Take objConfig and return array with configName and objConf stringify
   * @param {Array<String>} paramsConfig configNameForlocalStorage , configName , url , method , listFields(key-value)
   * @returns {Array<String>} configName and objString
   */
  static makeObjConfig(paramsConfig) {
    const objConf = {};
    objConf.localStorageName = paramsConfig[0];
    objConf.name = paramsConfig[1];
    objConf.url = paramsConfig[2];
    objConf.method = paramsConfig[3];
    objConf.listFields = paramsConfig[4];

    return [paramsConfig[0], JSON.stringify(objConf)];
  }

  /**
   * Take params and make object for query(url , method)
   * @param {Array<String>} params
   * @returns {Array<{url : String, method : String} , {key : String , value : String} >} objUrlMethod for query , objField for query
   */
  static makeObjQuery(params, listFields) {
    const objUrlMethod = {};
    objUrlMethod.url = params[0];
    objUrlMethod.method = params[1];
      const objListFields = {};
      if (listFields.length) {
          for (let i = 0; i < listFields.length; i++) {
            objListFields[listFields[i][0]] = listFields[i][1];
          }         
      }

    return [objUrlMethod, objListFields];
  }
}