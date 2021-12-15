import { isReferenceType } from '@shared/utils/scripts/types/guards';

const expectPassedArgsAreImmutable = <TArgs extends unknown[]>(
  passedArgs: TArgs,
  immutableCopyOfPassedArgs: TArgs
): void => {
  passedArgs.forEach((passedArgValue, index) => {
    if (isReferenceType(passedArgValue)) {
      test(`${index + 1} argument should be immutable`, () => {
        expect(passedArgValue).not.toBe(immutableCopyOfPassedArgs[index]);
        expect(passedArgValue).toStrictEqual(immutableCopyOfPassedArgs[index]);
      });
    }
  });
};

export { expectPassedArgsAreImmutable as default };
