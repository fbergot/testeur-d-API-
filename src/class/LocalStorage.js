export default
class LocalStorage {
  static setOne(name, item) {
    localStorage.setItem(name, item);
  }

  static getOne(name) {
    return localStorage.getItem(name);
  }

  static getLength() {
    return localStorage.length;
  }

  /**
   * Get all key when start with "config"
   * @returns {Array<String>} arrayKey
   */
  static getAllKey() {
    const arrayKey = [];
    for (let i = 0; i < LocalStorage.getLength(); i++) {
      const key = localStorage.key(i);
      if (key.startsWith("config")) {
        arrayKey.push(localStorage.key(i));
      }
    }
    return arrayKey;
  }

  /**
   * Return all configs in localStorage
   * @returns {Array<String>} configs
   */
  static getConfig() {
    const configs = [];
    for (let i = 0; i < LocalStorage.getAllKey().length; i++) {
      configs.push(LocalStorage.getOne(localStorage.key(i)));
    }
    return configs;
  }

  /**
   * Remove one or all item(s) in localStorage
   * @param {String} key key of element 
   * @param {Boolean} all true for all remove
   */
  static removeOneOrAll(key , all) {
    if (all) {
      localStorage.clear();
    } else {
      localStorage.removeItem(key);
    }
  }
}