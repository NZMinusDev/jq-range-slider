/**
 *
 * @param path - path to value for example "document.body.style.width"
 * @param obj - root object, globalThis is default
 * @returns value of the last property
 * @example
 * resolveLongBracketNotation("document.body.style.width")
 * // or
 * resolveLongBracketNotation("style.width", document.body)
 * // or even use array indexes
 * // (someObject has been defined in the question)
 * resolveLongBracketNotation("part.0.size", someObject)
 * // returns null when intermediate properties are not defined:
 * resolveLongBracketNotation('properties.that.do.not.exist', {hello:'world'})
 */
const resolveLongBracketNotation = (
  path: string,
  obj: Record<string, any> = globalThis
): unknown | null =>
  path
    .split('.')
    .reduce((prev, curr) => (prev !== undefined ? prev[curr] : null), obj);

export { resolveLongBracketNotation as default };
