import { InstancePropsExpecter } from './types';
import expectValidInstanceProps from './_expectValidInstanceProps';

/**
 * Testing(expect non undefined bounded(by instancePropsExpecter) properties) of arguments of constructor by creating the instance with argsOfCreator
 * @param Creator A Class or Function
 * @param argsOfCreator default arguments for constructor
 * @param instancePropsExpecter callback with expect calls
 */
const testDefaultOptions = <
  TCreatorArgs extends unknown[],
  TInstance,
  TCreator extends new (...args: TCreatorArgs) => TInstance
>(
  Creator: TCreator,
  argsOfCreator: TCreatorArgs,
  instancePropsExpecter: InstancePropsExpecter<TCreatorArgs, TInstance>
) => {
  describe('DEFAULT_OPTIONS', () => {
    expectValidInstanceProps(
      argsOfCreator,
      instancePropsExpecter,
      new Creator(...argsOfCreator)
    );
  });
};

export { testDefaultOptions as default };
