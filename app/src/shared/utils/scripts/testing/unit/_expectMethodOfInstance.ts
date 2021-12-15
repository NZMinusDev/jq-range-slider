import { InstanceMethodExpecter } from './types';

const expectMethodOfInstance = <TArgs extends unknown[], TInstance>(
  describeSentence: string,
  mock: jest.Mock,
  passedArgs: TArgs,
  expecter: InstanceMethodExpecter<TArgs, TInstance>,
  instance: TInstance
) => {
  test(describeSentence, () => {
    expecter({ mock, passedArgs, instance });
  });
};

export { expectMethodOfInstance as default };
