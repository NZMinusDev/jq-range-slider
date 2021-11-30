import { AbstractViewEvents } from '@shared/utils/scripts/components/MVP/AbstractView';

type ThumbViewOptions = {};

type ThumbViewState = {
  ariaOrientation: 'horizontal' | 'vertical';
  ariaValueMin: number;
  ariaValueMax: number;
  ariaValueNow: number;
  ariaValueText: string;
};

type ThumbViewIsolatedEvents = AbstractViewEvents & {};

export { ThumbViewOptions, ThumbViewState, ThumbViewIsolatedEvents };
