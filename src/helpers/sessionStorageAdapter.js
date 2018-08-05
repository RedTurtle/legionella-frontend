export default {
  /**
   * Stores the given data as a string at the given namespace.
   *
   * @param  {String}
   * @param  {*}
   */
  set(name, data) {
    window.sessionStorage.setItem(name + '.root', JSON.stringify(data));
  },

  /**
   * Returns the data stored at the given namespace.
   *
   * @param  {String} name
   * @return {*}
   */
  get(name) {
    return JSON.parse(window.sessionStorage.getItem(name + '.root'));
  },

  /**
   * Returns true if data is stored at the given namespace.
   *
   * @param  {String} name
   * @return {Boolean}
   */
  has(name) {
    return !!window.sessionStorage.getItem(name + '.root');
  },

  /**
   * Removes the item stored at the given namespace.
   *
   * @param  {String} name
   */
  clear(name) {
    window.sessionStorage.removeItem(name + '.root');
  },
};
