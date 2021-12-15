import type BEMComponent from './BEMComponent';

/**
 * BEM modifier class
 */
abstract class BEMModifier<
  TBEMComponent extends BEMComponent<
    HTMLElement,
    Record<string, Record<string, unknown>>
  >
> {
  protected component: TBEMComponent;

  constructor(component: TBEMComponent, modifierName: string) {
    this.component = component;

    this.component.setModifier(modifierName, this);
  }
}

export { BEMModifier as default };
