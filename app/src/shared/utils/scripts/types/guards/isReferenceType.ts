/**
 * Identify whether the value is a reference
 * @param any A value
 * @returns true if value is Reference, false otherwise
 */
const isReferenceType = (any: unknown) => any instanceof Object;

export { isReferenceType as default };
