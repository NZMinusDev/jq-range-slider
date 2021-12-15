/**
 * typeof on steroids reads [Symbol.toStringTag] for more controlled result of comparison
 * @param obj - any value
 * @returns type
 * @example
 * console.log(typeOf(123)) // Number
 * console.log(typeOf(null)) // Null
 * console.log(typeOf(undefined)) // Undefined
 * console.log(typeOf([])) // Array
 * console.log(typeOf(alert)) // Function
 * console.log(typeOf(window)) // Window
 * console.log(new XMLHttpRequest()) // XMLHttpRequest
 *
 * let user = {};
 * console.log(user) // Object
 * user = { [Symbol.toStringTag]: "User" };
 * console.log(user) // User
 */
const typeOf = (obj: unknown): string => {
  const type = Object.prototype.toString.call(obj);

  return type.slice(type.indexOf(' ') + 1, type.indexOf(']'));
};

export { typeOf as default };
