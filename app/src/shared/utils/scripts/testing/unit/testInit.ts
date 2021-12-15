import runMethodOfInstanceWithDifferentArguments from './_runMethodOfInstanceWithDifferentArguments';
import { DifferentArguments, InstancePropsExpecter, PropsToSet } from './types';

/**
 * Testing(expect non undefined, bounded(by instancePropsExpecter), setting up(by propsToSet), immutable(deep cloned) properties of instance after init and immutable passed args)
 * @param Creator A Class or Function
 * @param differentConstructorArgs different arguments for constructor: validRequiredArguments - the first will be used as shim for optional args, invalidRequiredArguments, invalidOptionalArguments, partialOptionalArguments - part of valid optional args, fullOptionalArguments - full valid optional args
 * @param instancePropsExpecter callback with expect calls
 * @param propsToSet association of valid constructor's args with properties of instance, for example: new Map().set("_options", 0).set("taxes.3", 1).set("payout","2.doc.payout") - It means the first arg set this._options property and the second one set this.taxes[3] property, the third one set this.payout as doc.payout property of 2 argument
 */
const testInit = <
  TCreatorArgs extends unknown[],
  TInstance,
  TCreator extends new (...args: TCreatorArgs) => TInstance
>({
  Creator,
  differentConstructorArgs,
  instancePropsExpecter,
  propsToSet,
}: {
  Creator: TCreator;
  differentConstructorArgs: DifferentArguments<TCreatorArgs>;
  instancePropsExpecter: InstancePropsExpecter<TCreatorArgs, TInstance>;
  propsToSet?: PropsToSet<number | string>;
}) => {
  runMethodOfInstanceWithDifferentArguments({
    Creator,
    differentConstructorArgs,
    instancePropsExpecter,
    propsToSet,
  });
};

export { testInit as default };
