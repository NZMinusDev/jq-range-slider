import { DifferentArguments } from './types';

const eachOfDifferentArguments = <TArgs extends unknown[]>(
  differentArguments: DifferentArguments<TArgs>,
  callbackEach: (
    key: string,
    concreteDifferentArgs: TArgs[],
    index: number,
    isRequiredArgs: boolean,
    isValidArgs: boolean
  ) => void
) => {
  let counter = 0;

  Object.entries(differentArguments).forEach(
    ([key, arrayOfConcreteDifferentArgs]) => {
      (arrayOfConcreteDifferentArgs as TArgs[][] | undefined)?.forEach(
        (concreteDifferentArgs, index) => {
          callbackEach(
            key,
            concreteDifferentArgs,
            index,
            key === 'validRequiredArguments' ||
              key === 'invalidRequiredArguments',
            key === 'validRequiredArguments' ||
              key === 'partialOptionalArguments' ||
              key === 'fullOptionalArguments'
          );

          counter += 1;
        }
      );
    }
  );

  return counter;
};

export { eachOfDifferentArguments as default };
