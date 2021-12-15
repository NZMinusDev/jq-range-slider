import isPlainObject from 'lodash-es/isPlainObject';

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
    subjectRef,
    path,
  }: {
    value: unknown;
    key: string;
    subjectRef: TSubject;
    path: string;
  }) => void,
  path?: string
) => {
  Object.entries(subject).forEach(([key, value]) => {
    const deepPath = path !== undefined ? `${path}.${key}` : key;

    fn({ value, key, subjectRef: subject, path: deepPath });

    if (isPlainObject(value) || Array.isArray(value)) {
      eachDeep(value, fn, deepPath);
    }
  });
};

export { eachDeep as default };
