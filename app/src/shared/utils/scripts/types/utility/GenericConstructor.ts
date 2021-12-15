/**
 * @example
 * class Class {
 *  constructor(a:number,b?:string) {}
 * }
 * type T = GenericConstructor<typeof Class>
 * // type T = new (a: number, b?: string | undefined) => typeof Class
 */
type GenericConstructor<TCreator extends new (...args: unknown[]) => unknown> =
  new (...args: ConstructorParameters<TCreator>) => TCreator;

export { GenericConstructor as default };
