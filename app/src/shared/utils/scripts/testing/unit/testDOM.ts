import { render, TemplateResult } from 'lit-html';

// FIXME: TTemplateArgs typing
/**
 * It runs tests with corresponding constructor and its template arguments and provides rendered container, also uses toMatchSnapshot
 * @param Creator A Class or Function
 * @param constructorsArgs arguments of constructors
 * @param templatesArgs arguments of templates
 * @param callbacksWithTest callback which runs test
 */
const testDOM = <
  TCreator extends new (...args: any) => InstanceType<TCreator>,
  TInstance extends InstanceType<TCreator> & { template(): TemplateResult }
>({
  Creator,
  constructorsArgs,
  callbacksWithTest,
}: {
  Creator: TCreator;
  constructorsArgs: ConstructorParameters<TCreator>[];
  templatesArgs: Parameters<TInstance['template']>[];
  callbacksWithTest: (({
    container,
    instance,
  }: {
    container: DocumentFragment;
    instance: InstanceType<TCreator>;
  }) => void)[];
}) => {
  describe('DOM manipulation', () => {
    let container: DocumentFragment;
    let instance: TInstance;

    callbacksWithTest.forEach((testCallback, index) => {
      const passedConstructorsArgs: [] =
        constructorsArgs[index] === undefined ? [] : constructorsArgs[index];

      container = new DocumentFragment();
      instance = new Creator(...passedConstructorsArgs);

      render(instance.template(), container);

      testCallback({ container, instance });
    });

    const passedConstructorsArgs: [] = constructorsArgs[0] ?? [];

    container = new DocumentFragment();
    instance = new Creator(...passedConstructorsArgs);

    render(instance.template(), container);

    test('can to be rendered correctly', () => {
      expect(container).toMatchSnapshot();
    });
  });
};

export { testDOM as default };
