import {
  RequiredTupleValues,
  OptionalTupleValues,
} from '@shared/utils/scripts/types/utility';

type InstancePropsExpecter<TArgs extends unknown[], TInstance> = (parts: {
  passedArgs: TArgs;
  instance: TInstance;
}) => void;

type DifferentArguments<TArgs extends unknown[]> = {
  validRequiredArguments?: RequiredTupleValues<TArgs>[];
  invalidRequiredArguments?: RequiredTupleValues<TArgs>[];
  invalidOptionalArguments?: OptionalTupleValues<TArgs>[];
  partialOptionalArguments?: OptionalTupleValues<TArgs>[];
  fullOptionalArguments?: OptionalTupleValues<TArgs>[];
};

type InstanceMethodExpecter<TArgs extends unknown[], TInstance> = (parts: {
  mock: jest.Mock;
  passedArgs: TArgs;
  instance: TInstance;
}) => void;

type PathToPropInInstance = string;
type PropToGet = PathToPropInInstance;
type PropsToSet<TArgValue> = Map<PathToPropInInstance, TArgValue>;
type ResetPropsTo<TDefaultValue> = Map<PathToPropInInstance, TDefaultValue>;
type MethodOfInstanceToRun<
  TMethodArgs extends unknown[],
  TMethod extends (...args: TMethodArgs) => unknown,
  TInstance
> = {
  methodReference: TMethod | string;
  argsToPass: TMethodArgs;
  returns?: PropToGet;
  expecter: InstanceMethodExpecter<TMethodArgs, TInstance>;
};
type MethodOfInstanceToTest<
  TMethodArgs extends unknown[],
  TMethod extends (...args: TMethodArgs) => unknown,
  TInstance
> = {
  methodReference: TMethod | string;
  expecter: InstanceMethodExpecter<TMethodArgs, TInstance>;
  differentArguments?: DifferentArguments<TMethodArgs>;
  returns?: PropToGet;
};

export {
  InstancePropsExpecter,
  DifferentArguments,
  InstanceMethodExpecter,
  PropToGet,
  PropsToSet,
  ResetPropsTo,
  MethodOfInstanceToRun,
  MethodOfInstanceToTest,
};
