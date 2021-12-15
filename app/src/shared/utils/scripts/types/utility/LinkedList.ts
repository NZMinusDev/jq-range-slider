/**
 * @example
 * let people = getDriversLicenseQueue(); // return LinkedList<Person>
 * people.name;
 * people.next.name;
 * people.next.next.name;
 * people.next.next.next.name;
 */
type LinkedList<TType> = TType & { next: LinkedList<TType> };

export { LinkedList as default };
