import cloneDeep from 'lodash-es/cloneDeep';

import expectMethodOfInstance from './_expectMethodOfInstance';
import expectPassedArgsAreImmutable from './_expectPassedArgsAreImmutable';
import expectPropsAreApplied from './_expectPropsAreApplied';
import expectReturnedAreImmutable from './_expectReturnedAreImmutable';
import expectValidInstanceProps from './_expectValidInstanceProps';
import {
  InstancePropsExpecter,
  PropsToSet,
  MethodOfInstanceToRun,
} from './types';

const testInstance = <
  TCreatorArgs extends unknown[],
  TMethodArgs extends unknown[],
  TMethod extends (...args: TMethodArgs) => unknown,
  TInstance,
  TCreator extends new (...args: TCreatorArgs) => TInstance
>({
  describeSentence,
  Creator,
  constructorArgs,
  instancePropsExpecter,
  methodOfInstanceToRun,
  propsToSet,
}: {
  describeSentence: string;
  Creator: TCreator;
  constructorArgs: TCreatorArgs;
  instancePropsExpecter: InstancePropsExpecter<
    TCreatorArgs | TMethodArgs,
    TInstance
  >;
  methodOfInstanceToRun?: MethodOfInstanceToRun<
    TMethodArgs,
    TMethod,
    TInstance
  >;
  propsToSet?: PropsToSet<unknown>;
}) => {
  describe(describeSentence, () => {
    const copyOfConstructorArgs = cloneDeep(constructorArgs);
    const instance: TInstance = new Creator(...constructorArgs);
    let passedArgs: TCreatorArgs | TMethodArgs = constructorArgs;

    if (!methodOfInstanceToRun) {
      expectPassedArgsAreImmutable(constructorArgs, copyOfConstructorArgs);
    } else {
      const methodOfInstanceMock = jest.fn(
        // just js trick
        (instance as any)[
          typeof methodOfInstanceToRun.methodReference === 'string'
            ? methodOfInstanceToRun.methodReference
            : methodOfInstanceToRun.methodReference.name
        ]
      );
      passedArgs = methodOfInstanceToRun.argsToPass;
      const copyOfPassedArgs = cloneDeep(passedArgs);

      const mockReturned = methodOfInstanceMock.apply(instance, passedArgs);

      expectPassedArgsAreImmutable(passedArgs, copyOfPassedArgs);
      if (methodOfInstanceToRun.returns) {
        expectReturnedAreImmutable(
          mockReturned,
          methodOfInstanceToRun.returns,
          instance
        );
      }

      expectMethodOfInstance(
        `method ${
          typeof methodOfInstanceToRun.methodReference === 'string'
            ? methodOfInstanceToRun.methodReference
            : methodOfInstanceToRun.methodReference.name
        } should pass methodOfInstanceToTest.expecter checks (possibly decorated)`,
        methodOfInstanceMock,
        passedArgs as TMethodArgs,
        methodOfInstanceToRun.expecter,
        instance
      );
    }

    if (propsToSet) {
      expectPropsAreApplied(propsToSet, instance);
    }

    expectValidInstanceProps(passedArgs, instancePropsExpecter, instance);
  });
};

export { testInstance as default };
