import { Unpacked } from '@shared/utils/scripts/TypingHelper';

interface JQuery {
  initRangeSlider(
    options?: Unpacked<
      NonNullable<
        ConstructorParameters<typeof import('./RangeSliderPlugin').default>[1]
      >['options']
    >,
    facadeModel?: Unpacked<
      NonNullable<
        ConstructorParameters<typeof import('./RangeSliderPlugin').default>[1]
      >['facadeModel']
    >
  ): import('./presenter/RangeSliderPresenter').default[];
}
