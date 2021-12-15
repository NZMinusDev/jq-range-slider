import { eachDeep } from '@shared/utils/scripts/object';

import { InstancePropsExpecter } from './types';

const expectValidInstanceProps = <
  TInstance,
  TCreatorArgs extends unknown[],
  TMethodArgs extends unknown[]
>(
  passedArgs: TCreatorArgs | TMethodArgs,
  expecter: InstancePropsExpecter<TCreatorArgs | TMethodArgs, TInstance>,
  instance: TInstance
): void => {
  test("instance's properties should be defined", () => {
    eachDeep(instance, ({ value }) => {
      expect(value).toBeDefined();
    });
  });

  test("instance's properties should be bounded", () => {
    expecter({
      passedArgs,
      instance,
    });
  });
};

export { expectValidInstanceProps as default };
