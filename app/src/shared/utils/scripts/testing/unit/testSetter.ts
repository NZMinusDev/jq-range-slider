import runMethodOfInstanceWithDifferentArguments from './_runMethodOfInstanceWithDifferentArguments';
import testInstance from './_testInstance';
import {
  DifferentArguments,
  InstanceMethodExpecter,
  InstancePropsExpecter,
  MethodOfInstanceToRun,
  MethodOfInstanceToTest,
  PropsToSet,
  ResetPropsTo,
} from './types';

/**
 * Testing(expect non undefined bounded(by instancePropsExpecter) properties of instance. Also expects the method sets targeted property, resets property to default if undefined is passed and returns this. Expects passed arguments are immutable and deep cloned).
 * @param Creator A Class or Function
 * @param constructorArgs arguments to pass to constructor, should be full(with optional arguments) if you use resetPropsTo with the same default options as in constructor for reset testing purpose
 * @param instancePropsExpecter callback with expect calls for instance state
 * @param methodOfInstanceToTest data about tested method
 * @param propsToSet association of valid method's args with properties of instance, for example: new Map().set("_options", 0).set("taxes.3", 1).set("payout","2.doc.payout") - It means the first arg set this._options property and the second one set this.taxes[3] property, the third one set this.payout as doc.payout property of 2 argument
 * @param resetPropsTo association of properties of instance with reset to values, for example: new Map().set("_options", DEFAULT_OPTIONS) - It means this._options should be DEFAULT_OPTIONS after resetting
 */
const testSetter = <
  TCreatorArgs extends unknown[],
  TMethod extends (...args: any) => any,
  TInstance,
  TCreator extends new (...args: TCreatorArgs) => TInstance
>({
  Creator,
  constructorArgs,
  instancePropsExpecter,
  methodOfInstanceToTest,
  propsToSet,
  resetPropsTo,
}: {
  Creator: TCreator;
  constructorArgs: TCreatorArgs;
  instancePropsExpecter: InstancePropsExpecter<TCreatorArgs, TInstance>;
  methodOfInstanceToTest: MethodOfInstanceToTest<
    Parameters<TMethod>,
    TMethod,
    TInstance
  >;
  propsToSet: PropsToSet<number | string>;
  resetPropsTo: ResetPropsTo<unknown>;
}) => {
  const argsToReset =
    methodOfInstanceToTest.differentArguments?.validRequiredArguments !==
    undefined
      ? methodOfInstanceToTest.differentArguments.validRequiredArguments[0]
      : [];

  const makeDefaultSetterExpecter =
    (
      expecter: InstanceMethodExpecter<Parameters<TMethod>, TInstance>
    ): InstanceMethodExpecter<Parameters<TMethod>, TInstance> =>
    ({ mock, passedArgs, instance }) => {
      expect(mock).toHaveReturnedWith(instance);

      // reset when undefined is passed
      if (Object.is(passedArgs, argsToReset)) {
        resetPropsTo.forEach((defaultValue, pathToPropInInstance) => {
          expect((instance as any)[pathToPropInInstance]).toEqual(defaultValue);
        });
      }

      expecter({ mock, passedArgs, instance });
    };

  // eslint-disable-next-line no-param-reassign
  methodOfInstanceToTest.expecter = makeDefaultSetterExpecter(
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
    propsToSet,
  });

  // reset when undefined is passed
  const methodOfInstanceToRun = {
    methodReference: methodOfInstanceToTest.methodReference,
    argsToPass: argsToReset as unknown as Parameters<TMethod>,
    expecter: methodOfInstanceToTest.expecter,
  } as MethodOfInstanceToRun<Parameters<TMethod>, TMethod, TInstance>;
  describe(`${
    typeof methodOfInstanceToTest.methodReference === 'string'
      ? methodOfInstanceToTest.methodReference
      : methodOfInstanceToTest.methodReference.name
  }`, () => {
    testInstance({
      describeSentence: 'reset (undefined is passed)',
      Creator,
      constructorArgs,
      instancePropsExpecter: instancePropsExpecter as InstancePropsExpecter<
        TCreatorArgs | Parameters<TMethod>,
        TInstance
      >,
      methodOfInstanceToRun,
    });
  });
};

export { testSetter as default };
