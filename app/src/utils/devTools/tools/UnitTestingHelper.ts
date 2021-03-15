import { eachDeep } from "./ObjectHelper";

/**
 * Testing(expect non undefined bounded(by instancePropsExpecter) properties) of arguments of constructor by creating the instance with argsOfCreator
 * @param Creator A Class or Function
 * @param argsOfCreator default arguments for constructor
 * @param instancePropsExpecter callback with expect calls
 */
export function testInitDEFAULT_OPTIONS<
  TCreator extends new (...args: TCreatorArgs) => TInstance,
  TCreatorArgs extends unknown[],
  TInstance extends object
>(
  Creator: TCreator,
  argsOfCreator: TCreatorArgs,
  instancePropsExpecter: InstancePropsExpecter<TCreatorArgs, TInstance>
) {
  describe("DEFAULT_OPTIONS", () => {
    expectValidInstanceProps(argsOfCreator, instancePropsExpecter, new Creator(...argsOfCreator));
  });
}

export type InstancePropsExpecter<TArgs extends unknown[], TInstance> = (parts: {
  passedArgs: TArgs;
  instance: TInstance;
}) => void;

function expectValidInstanceProps<
  TInstance,
  TCreatorArgs extends unknown[],
  TMethodArgs extends unknown[]
>(
  passedArgs: TCreatorArgs | TMethodArgs,
  expecter: InstancePropsExpecter<TCreatorArgs | TMethodArgs, TInstance>,
  instance: TInstance
): void {
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
}
