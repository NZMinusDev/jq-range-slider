import { resolveLongBracketNotation } from '@shared/utils/scripts/object';

import {
  DifferentArguments,
  InstanceMethodExpecter,
  InstancePropsExpecter,
  MethodOfInstanceToTest,
} from './types';
import runMethodOfInstanceWithDifferentArguments from './_runMethodOfInstanceWithDifferentArguments';

/**
 * Testing(expect non undefined bounded(by instancePropsExpecter) properties of instance. Calls toHaveReturnedWith expecter for the method, returned value is expected be cloned)
 * @param Creator A Class or Function
 * @param constructorArgs arguments to pass to constructor
 * @param instancePropsExpecter callback with expect calls for instance state
 * @param methodOfInstanceToTest data about tested method
 */
const testGetter = <
  TCreatorArgs extends unknown[],
  TMethod extends (args: any) => any,
  TInstance,
  TCreator extends new (...args: TCreatorArgs) => TInstance
>({
  Creator,
  constructorArgs,
  instancePropsExpecter,
  methodOfInstanceToTest,
}: {
  Creator: TCreator;
  constructorArgs: TCreatorArgs;
  instancePropsExpecter: InstancePropsExpecter<TCreatorArgs, TInstance>;
  methodOfInstanceToTest: MethodOfInstanceToTest<
    Parameters<TMethod>,
    TMethod,
    TInstance
  >;
}) => {
  const makeDefaultGetterExpecter =
    (
      expecter: InstanceMethodExpecter<Parameters<TMethod>, TInstance>
    ): InstanceMethodExpecter<Parameters<TMethod>, TInstance> =>
    ({ mock, passedArgs, instance }) => {
      if (methodOfInstanceToTest.returns) {
        expect(mock).toHaveReturnedWith(
          resolveLongBracketNotation(methodOfInstanceToTest.returns, instance)
        );
      }

      expecter({ mock, passedArgs, instance });
    };

  // eslint-disable-next-line no-param-reassign
  methodOfInstanceToTest.expecter = makeDefaultGetterExpecter(
    methodOfInstanceToTest.expecter
  );

  runMethodOfInstanceWithDifferentArguments({
    Creator,
    differentConstructorArgs: {
      validRequiredArguments: [constructorArgs],
    } as DifferentArguments<TCreatorArgs>,
    instancePropsExpecter: instancePropsExpecter as InstancePropsExpecter<
      TCreatorArgs | Parameters<TMethod>,
      TInstance
    >,
    methodOfInstanceToTest,
  });
};

export { testGetter as default };
