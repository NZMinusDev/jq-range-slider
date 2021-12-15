import { resolveLongBracketNotation } from '@shared/utils/scripts/object';

import eachOfDifferentArguments from './_eachOfDifferentArguments';
import testInstance from './_testInstance';
import {
  DifferentArguments,
  InstancePropsExpecter,
  MethodOfInstanceToRun,
  MethodOfInstanceToTest,
  PropsToSet,
} from './types';

const runMethodOfInstanceWithDifferentArguments = <
  TCreatorArgs extends unknown[],
  TMethodArgs extends unknown[],
  TMethod extends (...args: TMethodArgs) => unknown,
  TInstance,
  TCreator extends new (...args: TCreatorArgs) => TInstance
>({
  Creator,
  differentConstructorArgs,
  instancePropsExpecter,
  methodOfInstanceToTest,
  propsToSet,
}: {
  Creator: TCreator;
  differentConstructorArgs: DifferentArguments<TCreatorArgs>;
  instancePropsExpecter: InstancePropsExpecter<
    TCreatorArgs | TMethodArgs,
    TInstance
  >;
  methodOfInstanceToTest?: MethodOfInstanceToTest<
    TMethodArgs,
    TMethod,
    TInstance
  >;
  propsToSet?: PropsToSet<number | string>;
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const requiredConstructorArgs = (
    differentConstructorArgs.validRequiredArguments
      ? differentConstructorArgs.validRequiredArguments[0]
      : []
  ) as TCreatorArgs;
  const requiredMethodArgs = (
    methodOfInstanceToTest?.differentArguments?.validRequiredArguments
      ? methodOfInstanceToTest.differentArguments.validRequiredArguments[0]
      : []
  ) as TMethodArgs;

  let constructorArgs = requiredConstructorArgs;
  let differentArguments: DifferentArguments<TCreatorArgs | TMethodArgs> =
    differentConstructorArgs;
  let methodOfInstanceToRun:
    | MethodOfInstanceToRun<TMethodArgs, TMethod, TInstance>
    | undefined;

  describe(`${
    typeof methodOfInstanceToTest?.methodReference === 'string'
      ? methodOfInstanceToTest?.methodReference
      : methodOfInstanceToTest?.methodReference.name || 'init'
  }`, () => {
    if (methodOfInstanceToTest) {
      methodOfInstanceToRun = {
        methodReference: methodOfInstanceToTest.methodReference,
        argsToPass: requiredMethodArgs,
        returns: methodOfInstanceToTest.returns,
        expecter: methodOfInstanceToTest.expecter,
      };

      differentArguments = methodOfInstanceToTest.differentArguments || {};
    }

    let propsToSetWithValues: PropsToSet<unknown> | undefined;

    const amountOfDifferentArgs = eachOfDifferentArguments(
      differentArguments,
      (key, concreteDifferentArgs, index, isRequiredArgs, isValidArgs) => {
        if (methodOfInstanceToRun) {
          methodOfInstanceToRun.argsToPass = isRequiredArgs
            ? (concreteDifferentArgs as TMethodArgs)
            : (requiredMethodArgs.concat(concreteDifferentArgs) as TMethodArgs);
        } else {
          constructorArgs = isRequiredArgs
            ? (concreteDifferentArgs as TCreatorArgs)
            : (requiredConstructorArgs.concat(
                concreteDifferentArgs
              ) as TCreatorArgs);
        }

        if (propsToSet !== undefined && isValidArgs) {
          propsToSetWithValues = new Map();

          propsToSet.forEach((referenceOfArgToSet, pathToPropInInstance) => {
            propsToSetWithValues?.set(
              pathToPropInInstance,
              resolveLongBracketNotation(
                `${referenceOfArgToSet}`,
                methodOfInstanceToRun?.argsToPass || constructorArgs
              )
            );
          });
        } else {
          propsToSetWithValues = undefined;
        }

        testInstance({
          describeSentence: `with ${index + 1} ${key} arguments`,
          Creator,
          constructorArgs,
          instancePropsExpecter,
          methodOfInstanceToRun,
          propsToSet: propsToSetWithValues,
        });
      }
    );

    if (amountOfDifferentArgs === 0) {
      testInstance({
        describeSentence: `without arguments`,
        Creator,
        constructorArgs,
        instancePropsExpecter,
        methodOfInstanceToRun,
        propsToSet: propsToSetWithValues,
      });
    }
  });
};

export { runMethodOfInstanceWithDifferentArguments as default };
