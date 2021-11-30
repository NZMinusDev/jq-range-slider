import { render } from 'lit-html';

import { testDOM } from '@shared/utils/scripts/UnitTestingHelper';

import RangeSliderView from './RangeSliderView';
import { RangeSliderViewOptions, RangeSliderViewState } from './types';

const options: RangeSliderViewOptions = {
  intervals: { min: -1250, '80%': -500, '90%': 400, max: 1500 },
  padding: [0, 0],
  start: [-1250, -600, 1500],
  connect: [false, false, false],
  orientation: 'horizontal',
  steps: ['none', 'none', 'none'],
  formatter: (val) => val.toFixed(2),
  tooltips: [true, (val) => val.toFixed(0), true],
  pips: {
    mode: 'intervals',
    density: 1,
    values: [-1250, -500, 400, 1500],
    isHidden: false,
  },
};
const state: RangeSliderViewState = {
  value: [-1250, -600, 1500],
  thumbs: [{ isActive: false }, { isActive: false }, { isActive: false }],
};

testDOM({
  Creator: RangeSliderView,
  constructorsArgs: [[options, state]],
  templatesArgs: [],
  callbacksWithTest: [
    ({ container, instance }) => {
      const { intervals, start } = options;
      const [infimumThumbStart, , supremumThumbStart] = start;
      const trackValueSize = intervals.max - intervals.min;
      const trackPXSize = 100;
      const trackPercent = 100;
      const trackRatio = trackValueSize / trackPercent;
      const valuePerPX = trackValueSize / trackPXSize;

      const trackElem = container.querySelector<HTMLElement>(
        '.js-range-slider__track'
      ) as HTMLElement;
      const thumbsElements = container.querySelectorAll<HTMLElement>(
        '.js-range-slider__thumb'
      );
      const originsElements = Array.from(thumbsElements, (thumbElem) => {
        const originElem = thumbElem.closest(
          '.js-range-slider__thumb-origin'
        ) as HTMLElement;

        // https://github.com/jsdom/jsdom/pull/2666
        originElem.setPointerCapture = function setPointerCapture() {
          // it's noop
        };

        return originElem;
      });
      const pipsElement = container.querySelector(
        '.js-range-slider__pips'
      ) as HTMLElement;
      const pipsValueElements = pipsElement.querySelectorAll<HTMLElement>(
        '.js-range-slider__pips-value'
      );

      const [infimumThumb, innerThumb, supremumThumb] = thumbsElements;
      const [infimumOriginThumb, innerOriginThumb, supremumOriginThumb] =
        originsElements;
      const theMostLeftPipValue = pipsValueElements.item(0);
      const theMostRightPipValue = pipsValueElements.item(3);

      trackElem.getBoundingClientRect = () => ({
        width: trackPXSize,
        height: trackPXSize,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        x: 0,
        y: 0,
        toJSON: () => ``,
      });

      const slideEventCallbackMock = jest.fn();
      const templateMock = jest.fn(instance.template);

      instance.on('slide', slideEventCallbackMock);

      beforeEach(() => {
        instance.set(options, state);
      });

      afterEach(() => {
        slideEventCallbackMock.mockClear();
        templateMock.mockClear();
      });

      test('vertical orientation should be supported', () => {
        instance.set({ ...options, orientation: 'vertical' }, state);

        infimumThumb.dispatchEvent(
          new PointerEvent('pointerdown', {
            pointerId: 1,
            bubbles: true,
          })
        );
        infimumThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 1,
            movementY: 10,
            clientY: 10,
            bubbles: true,
          })
        );

        expect(slideEventCallbackMock.mock.calls[0][0].newValue).not.toBe(
          infimumThumbStart
        );

        infimumThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 1,
            movementY: -10,
            clientY: 0,
            bubbles: true,
          })
        );

        expect(slideEventCallbackMock.mock.calls[1][0].newValue).toBe(
          infimumThumbStart
        );

        templateMock();

        expect(templateMock).toHaveReturned();

        infimumThumb.dispatchEvent(
          new PointerEvent('lostpointercapture', {
            pointerId: 1,
            bubbles: true,
          })
        );
      });

      test('value should be calculated with taking into account non linear intervals', () => {
        infimumThumb.dispatchEvent(
          new PointerEvent('pointerdown', {
            pointerId: 1,
            bubbles: true,
          })
        );
        supremumThumb.dispatchEvent(
          new PointerEvent('pointerdown', {
            pointerId: 3,
            bubbles: true,
          })
        );

        let movementX = 1;
        let range = intervals['80%'] - intervals.min;
        let percentSize = 80;

        infimumThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 1,
            movementX,
            clientX: movementX,
            bubbles: true,
          })
        );

        expect(slideEventCallbackMock).toBeCalledWith(
          expect.objectContaining({
            newValue:
              intervals.min +
              (range / percentSize / trackRatio) * valuePerPX * movementX,
          })
        );

        range = intervals.max - intervals['90%'];
        percentSize = 10;
        movementX = -1;

        supremumThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 3,
            movementX,
            clientX: trackPXSize + movementX,
            bubbles: true,
          })
        );

        expect(slideEventCallbackMock).toBeCalledWith(
          expect.objectContaining({
            newValue:
              intervals.max +
              (range / percentSize / trackRatio) * valuePerPX * movementX,
          })
        );

        infimumThumb.dispatchEvent(
          new PointerEvent('lostpointercapture', {
            pointerId: 1,
            bubbles: true,
          })
        );
        supremumThumb.dispatchEvent(
          new PointerEvent('lostpointercapture', {
            pointerId: 3,
            bubbles: true,
          })
        );
      });

      test('thumb move through several intervals should calculated with proper factor for each interval', () => {
        innerThumb.dispatchEvent(
          new PointerEvent('pointerdown', {
            pointerId: 2,
            bubbles: true,
          })
        );

        innerThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 2,
            movementX: trackPXSize,
            clientX: trackPXSize,
            bubbles: true,
          })
        );
        innerThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 2,
            movementX: -trackPXSize,
            clientX: 0,
            bubbles: true,
          })
        );
        expect(slideEventCallbackMock.mock.calls[1][0].newValue).toBe(
          infimumThumbStart
        );

        innerThumb.dispatchEvent(
          new PointerEvent('lostpointercapture', {
            pointerId: 2,
            bubbles: true,
          })
        );
      });

      test('step options should work', () => {
        const steps = [50, 1, 300];
        instance.set({ ...options, steps }, state);

        infimumThumb.dispatchEvent(
          new PointerEvent('pointerdown', {
            pointerId: 1,
            bubbles: true,
          })
        );
        supremumThumb.dispatchEvent(
          new PointerEvent('pointerdown', {
            pointerId: 3,
            bubbles: true,
          })
        );

        let movementX = 1;
        let range = intervals['80%'] - intervals.min;
        let intervalPXSize = trackPXSize * 0.8;
        let amountOfSteps = Math.floor(range / steps[0]);
        let enoughMovementXForStep = intervalPXSize / amountOfSteps;

        infimumThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 1,
            movementX,
            clientX: movementX,
            bubbles: true,
          })
        );
        infimumThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 1,
            movementX: enoughMovementXForStep,
            clientX: enoughMovementXForStep + movementX,
            bubbles: true,
          })
        );

        expect(slideEventCallbackMock.mock.calls[0][0].newValue).toBe(
          infimumThumbStart
        );
        expect(slideEventCallbackMock.mock.calls[1][0].newValue).toBe(
          infimumThumbStart + steps[0]
        );

        movementX = -1;
        range = intervals.max - intervals['90%'];
        intervalPXSize = trackPXSize * 0.1;
        amountOfSteps = Math.floor(range / steps[2]);
        enoughMovementXForStep = intervalPXSize / amountOfSteps;
        const thePenultimateStepValue =
          intervals['90%'] + steps[2] * amountOfSteps;

        supremumThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 3,
            movementX,
            clientX: trackPXSize + movementX,
            bubbles: true,
          })
        );
        supremumThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 3,
            movementX: enoughMovementXForStep,
            clientX: trackPXSize - enoughMovementXForStep,
            bubbles: true,
          })
        );

        expect(slideEventCallbackMock.mock.calls[2][0].newValue).toBe(
          supremumThumbStart
        );
        expect(slideEventCallbackMock.mock.calls[3][0].newValue).toBe(
          thePenultimateStepValue
        );

        instance.set(
          { ...options, steps },
          { ...state, value: [-1200, -600, 1500] }
        );

        infimumThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 1,
            movementX: -trackPXSize,
            clientX: -trackPXSize,
            bubbles: true,
          })
        );
        supremumThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 3,
            movementX: trackPXSize,
            clientX: trackPXSize,
            bubbles: true,
          })
        );

        expect(slideEventCallbackMock.mock.calls[4][0].newValue).toBe(
          infimumThumbStart
        );
        expect(slideEventCallbackMock.mock.calls[5][0].newValue).toBe(
          supremumThumbStart
        );

        infimumThumb.dispatchEvent(
          new PointerEvent('lostpointercapture', {
            pointerId: 1,
            bubbles: true,
          })
        );
        supremumThumb.dispatchEvent(
          new PointerEvent('lostpointercapture', {
            pointerId: 3,
            bubbles: true,
          })
        );
      });

      test('z-indexes of close to each other thumbs should be swapped for user friendly usage', () => {
        instance.set(options, {
          ...state,
          value: [intervals.min, intervals.max, intervals.max],
        });

        render(instance.template(), container);

        expect(Number(innerOriginThumb.style.zIndex)).toBeGreaterThan(
          Number(supremumOriginThumb.style.zIndex)
        );

        instance.set(options, {
          ...state,
          value: [intervals.min, intervals.min, intervals.max],
        });

        render(instance.template(), container);

        expect(Number(innerOriginThumb.style.zIndex)).toBeGreaterThan(
          Number(infimumOriginThumb.style.zIndex)
        );
      });

      test('each thumb should be limited by sibling thumb or end of track', () => {
        const indentation = 10;

        infimumThumb.dispatchEvent(
          new PointerEvent('pointerdown', {
            pointerId: 1,
            bubbles: true,
          })
        );
        innerThumb.dispatchEvent(
          new PointerEvent('pointerdown', {
            pointerId: 2,
            bubbles: true,
          })
        );
        supremumThumb.dispatchEvent(
          new PointerEvent('pointerdown', {
            pointerId: 3,
            bubbles: true,
          })
        );

        innerThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 2,
            movementX: trackPXSize,
            clientX: trackPXSize + indentation,
            bubbles: true,
          })
        );
        innerThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 2,
            movementX: -trackPXSize - indentation,
            clientX: 0,
            bubbles: true,
          })
        );

        expect(
          slideEventCallbackMock.mock.calls[0][0].newValue
        ).toBeLessThanOrEqual(state.value[2]);
        expect(
          slideEventCallbackMock.mock.calls[1][0].newValue
        ).toBeGreaterThanOrEqual(state.value[0]);

        infimumThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 1,
            movementX: -trackPXSize - indentation,
            clientX: 0,
            bubbles: true,
          })
        );
        supremumThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 3,
            movementX: trackPXSize + indentation,
            bubbles: true,
          })
        );

        expect(
          slideEventCallbackMock.mock.calls[2][0].newValue
        ).toBeGreaterThanOrEqual(intervals.min);
        expect(
          slideEventCallbackMock.mock.calls[3][0].newValue
        ).toBeLessThanOrEqual(intervals.max);

        infimumThumb.dispatchEvent(
          new PointerEvent('lostpointercapture', {
            pointerId: 1,
            bubbles: true,
          })
        );
        innerThumb.dispatchEvent(
          new PointerEvent('lostpointercapture', {
            pointerId: 2,
            bubbles: true,
          })
        );
        supremumThumb.dispatchEvent(
          new PointerEvent('lostpointercapture', {
            pointerId: 3,
            bubbles: true,
          })
        );
      });

      test("click on track should be handled when thumb isn't clicked", () => {
        trackElem.dispatchEvent(
          new PointerEvent('click', {
            clientX: trackPXSize * 0.5,
            bubbles: true,
          })
        );

        innerThumb.dispatchEvent(new PointerEvent('click', { bubbles: true }));

        expect(slideEventCallbackMock).toBeCalledTimes(1);
      });

      test('click on stepped interval on track should move nearest thumb to nearest stepped value', () => {
        instance.set({ ...options, steps: [50, 'none', 'none'] }, state);

        trackElem.dispatchEvent(
          new PointerEvent('click', {
            clientX: trackPXSize * 0.01,
            bubbles: true,
          })
        );
        trackElem.dispatchEvent(
          new PointerEvent('click', {
            clientX: trackPXSize * 0.79,
            bubbles: true,
          })
        );

        expect(slideEventCallbackMock).toBeCalledWith(
          expect.objectContaining({
            thumbIndex: 0,
            newValue: infimumThumbStart,
          })
        );
        expect(slideEventCallbackMock).toBeCalledWith(
          expect.objectContaining({
            thumbIndex: 1,
            newValue: intervals['80%'],
          })
        );
      });

      test('click on text of "valuable pip" should be handled', () => {
        instance.set(options, { ...state, value: [-1000, -600, 1300] });

        theMostLeftPipValue.dispatchEvent(
          new PointerEvent('click', { bubbles: true })
        );
        theMostRightPipValue.dispatchEvent(
          new PointerEvent('click', { bubbles: true })
        );

        expect(slideEventCallbackMock).toBeCalledWith(
          expect.objectContaining({
            thumbIndex: 0,
          })
        );
        expect(slideEventCallbackMock).toBeCalledWith(
          expect.objectContaining({
            thumbIndex: 2,
          })
        );
      });

      test('click on marker of pips should not be handled', () => {
        (
          pipsElement.querySelector(
            '.js-range-slider__pips-marker'
          ) as HTMLElement
        ).dispatchEvent(new PointerEvent('click', { bubbles: true }));

        expect(slideEventCallbackMock).not.toBeCalled();
      });

      test('nearest thumb should be calculated by distance with taking into account the order (if thumbs have the same values)', () => {
        instance.set(options, { ...state, value: [-1000, -1000, -1000] });

        theMostLeftPipValue.dispatchEvent(
          new PointerEvent('click', { bubbles: true })
        );
        theMostRightPipValue.dispatchEvent(
          new PointerEvent('click', { bubbles: true })
        );

        expect(slideEventCallbackMock).toBeCalledWith(
          expect.objectContaining({
            thumbIndex: 0,
          })
        );
        expect(slideEventCallbackMock).toBeCalledWith(
          expect.objectContaining({
            thumbIndex: 2,
          })
        );
      });

      test('should be able to be rendered with different pips mode', () => {
        instance.set(
          {
            ...options,
            pips: { mode: 'count', values: 3, density: 1, isHidden: false },
          },
          state
        );

        templateMock();

        instance.set(
          {
            ...options,
            pips: { mode: 'count', values: 0, density: 1, isHidden: false },
          },
          state
        );

        templateMock();

        instance.set(
          {
            ...options,
            pips: {
              mode: 'positions',
              values: [0, 100],
              density: 1,
              isHidden: false,
            },
          },
          state
        );

        templateMock();

        instance.set(
          {
            ...options,
            pips: {
              mode: 'values',
              values: [0, 100],
              density: 1,
              isHidden: false,
            },
          },
          state
        );

        templateMock();

        expect(templateMock).toHaveReturned();
      });

      test("if movement === 0 slide event shouldn't be emitted ", () => {
        innerThumb.dispatchEvent(
          new PointerEvent('pointerdown', {
            pointerId: 2,
            bubbles: true,
          })
        );

        innerThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 2,
            movementX: 0,
            bubbles: true,
          })
        );
        innerThumb.dispatchEvent(
          new PointerEvent('pointermove', {
            pointerId: 2,
            movementY: 0,
            bubbles: true,
          })
        );

        innerThumb.dispatchEvent(
          new PointerEvent('lostpointercapture', {
            pointerId: 2,
            bubbles: true,
          })
        );

        expect(slideEventCallbackMock).not.toBeCalled();
      });
    },
  ],
});
