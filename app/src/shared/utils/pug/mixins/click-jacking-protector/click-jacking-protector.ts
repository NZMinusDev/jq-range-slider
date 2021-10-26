import BEMComponent, {
  HTMLElementWithComponent,
} from '@shared/utils/scripts/view/BEM/BEMComponent';

type ClickJackingProtectorElement = HTMLDivElement;

type ClickJackingProtectorCustomEvents = {};

class ClickJackingProtector extends BEMComponent<
  ClickJackingProtectorElement,
  ClickJackingProtectorCustomEvents
> {
  constructor(clickJackingProtectorElement: ClickJackingProtectorElement) {
    super(clickJackingProtectorElement);

    this._initDisplay();
  }

  protected _initDisplay() {
    if (window.top.document.domain === document.domain) {
      this.element.remove();
    }

    return this;
  }
}

type ClickJackingProtectorElementWithComponent = HTMLElementWithComponent<
  ClickJackingProtectorElement,
  ClickJackingProtectorCustomEvents,
  ClickJackingProtector
>;

const clickJackingProtectors = Array.from(
  document.querySelectorAll<ClickJackingProtectorElement>(
    '.js-click-jacking-protector'
  ),
  (clickJackingProtectorElement) =>
    new ClickJackingProtector(clickJackingProtectorElement)
);

export type {
  ClickJackingProtectorCustomEvents,
  ClickJackingProtector,
  ClickJackingProtectorElementWithComponent,
};

export { clickJackingProtectors as default };
