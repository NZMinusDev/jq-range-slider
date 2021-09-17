import isPlainObject from 'lodash-es/isPlainObject';

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
): unknown | null => path.split('.').reduce((prev, curr) => (prev ? prev[curr] : null), obj);

/**
 * Recursively iterates iterable properties by deep-first algorithm
 * @param subject is either an array or an object
 * @param fn callback for each item
 * @param path is the iteration deep path, e.g.: 'prop4.2.prop5' - prop5 of the third item of the array prop4
 * @example
 * {
 *   prop1: 'foo',
 *   prop2: ['foo', 'bar'],
 *   prop3: ['foo', 'foo'],
 *   prop4: {
 *     prop5: 'foo',
 *     prop6: 'bar',
 *   },
 * }, ({value, key, subject, path}) => { console.log(`${path}:`, value); }
 *
 * prop1: foo
 * prop2: [ 'foo', 'bar' ]
 * prop2.0: foo
 * prop2.1: bar
 * prop3: [ 'foo', 'foo' ]
 * prop3.0: foo
 * prop3.1: foo
 * prop4: { prop5: 'foo', prop6: 'bar' }
 * prop4.prop5: foo
 * prop4.prop6: bar
 */
const eachDeep = <TSubject>(
  subject: TSubject,
  fn: ({
    value,
    key,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    subject,
    path,
  }: {
    value: unknown;
    key: string;
    subject: TSubject;
    path: string;
  }) => void,
  path?: string
) => {
  let deepPath;
  Object.entries(subject).forEach(([key, value]) => {
    deepPath = path ? `${path}.${key}` : key;

    fn({ value, key, subject, path: deepPath });

    if (isPlainObject(value) || Array.isArray(value)) {
      eachDeep(value, fn, deepPath);
    }
  });
};

export { eachDeep, resolveLongBracketNotation };
