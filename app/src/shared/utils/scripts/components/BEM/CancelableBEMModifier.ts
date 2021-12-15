import type BEMComponent from './BEMComponent';

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

    const currentModifier = this.component.getModifier(modifierName);

    if (currentModifier !== undefined && 'cancel' in currentModifier) {
      currentModifier.cancel();
    }

    this.component.setModifier(modifierName, this);
  }

  abstract cancel(): this;
}

export { CancelableBEMModifier as default };
