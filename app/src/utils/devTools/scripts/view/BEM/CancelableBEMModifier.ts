import BEMComponent from './BEMComponent';

/**
 *  Switchable BEM modifier class
 */
abstract class CancelableBEMModifier<
  TBEMComponent extends BEMComponent<
    HTMLElement,
    Record<string, Record<string, unknown>>
  >
> {
  protected component: TBEMComponent;

  constructor(component: TBEMComponent, modifierName: string) {
    this.component = component;

    if (this.component[modifierName] !== undefined) {
      this.component[modifierName].cancel();
    }

    this.component[modifierName] = this;
  }

  abstract cancel(): this;
}

export { CancelableBEMModifier as default };
