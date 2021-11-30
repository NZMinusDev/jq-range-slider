import { testDOM } from '@shared/utils/scripts/UnitTestingHelper';

import ThumbView from './ThumbView';

testDOM({
  Creator: ThumbView,
  constructorsArgs: [
    [
      {},
      {
        ariaOrientation: 'horizontal',
        ariaValueMin: -1,
        ariaValueNow: -1,
        ariaValueMax: -1,
        ariaValueText: '-1',
      },
    ],
  ],
  templatesArgs: [],
  callbacksWithTest: [
    ({ container, instance }) => {
      test('ondragstart should be nooped', () => {
        const target = container.querySelector(
          '.js-range-slider__thumb'
        ) as HTMLElement;
        const event = new Event('dragstart');
        const noopSpy = jest.spyOn(
          Object.getPrototypeOf(instance),
          'onDragstart'
        );

        target.dispatchEvent(event);

        expect(noopSpy).toBeCalledTimes(1);

        noopSpy.mockRestore();
      });
    },
  ],
});
