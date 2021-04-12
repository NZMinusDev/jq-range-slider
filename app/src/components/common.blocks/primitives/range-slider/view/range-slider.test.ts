import RangeSliderView, { DEFAULT_OPTIONS } from "./range-slider.view";

import {
  InstancePropsExpecter,
  testInit,
  testInitDEFAULT_OPTIONS,
  testGetter,
  testSetter,
  DifferentArguments,
  testDOM,
} from "@utils/devTools/tools/UnitTestingHelper";

const viewPropertiesExpecter: InstancePropsExpecter<
  ConstructorParameters<typeof RangeSliderView>,
  RangeSliderView
> = function ({ instance, passedArgs }) {
  expect(instance["_options"].connect.length).toBe(instance["_options"].start.length + 1);
  expect(instance["_options"].tooltips.length).toBe(instance["_options"].start.length);

  instance["_options"].start.forEach((startValue, index) => {
    expect(startValue).toBeGreaterThanOrEqual(instance["_options"].intervals.min);
    expect(startValue).toBeLessThanOrEqual(instance["_options"].intervals.max);

    if (index > 0) {
      expect(startValue).toBeGreaterThanOrEqual(instance["_options"].start[index - 1]);
    }
  });

  switch (instance["_options"].pips.mode) {
    case "count": {
      expect(instance["_options"].pips.values).toBeGreaterThanOrEqual(0);

      break;
    }
    case "positions": {
      expect(instance["_options"].pips.values).toStrictEqual(
        (instance["_options"].pips.values as number[]).filter((value) => value >= 0 && value <= 100)
      );

      break;
    }
    case "values": {
      expect(instance["_options"].pips.values).toStrictEqual(
        (instance["_options"].pips.values as number[]).filter(
          (value) =>
            value >= instance["_options"].intervals.min &&
            value <= instance["_options"].intervals.max
        )
      );
      break;
    }
  }
};

const differentOptionsArg: DifferentArguments<Parameters<
  typeof RangeSliderView.prototype.setOptions
>> = {
  invalidOptionalArguments: [
    [{ intervals: { min: -100, max: 100, "50%": 50 }, start: [-50, 0, 75], connect: [] }],
    [{ intervals: { min: -100, max: 100, "50%": 50 }, start: [-50, 0, 75], connect: [true] }],
    [
      {
        intervals: { min: -100, max: 100, "50%": 50 },
        start: [-50, 0, 75],
        connect: [true, false, true, true, true, false],
      },
    ],
    [{ intervals: { min: -100, max: 100, "50%": 50 }, start: [-50, 0, 75], tooltips: [] }],
    [
      {
        intervals: { min: -100, max: 100, "50%": 50 },
        start: [-50, 0, 75],
        tooltips: [true, false],
      },
    ],
    [
      {
        intervals: { min: -100, max: 100, "50%": 50 },
        start: [-50, 0, 75],
        tooltips: [true, false, true, true, true, false],
      },
    ],
    [{ intervals: { min: -100, max: 100, "50%": 50 }, start: [] }],
    [{ intervals: { min: -100, max: 100, "50%": 50 }, start: [-101] }],
    [{ intervals: { min: -100, max: 100, "50%": 50 }, start: [101] }],
    [{ intervals: { min: -100, max: 100, "50%": 50 }, start: [50, -50, -75, 0, 10] }],
    [{ pips: { mode: "intervals", values: 5 } }],
    [{ pips: { mode: "intervals", values: [0, 0, -10, 50, -99] } }],
    [{ pips: { mode: "count", values: -3 } }],
    [{ pips: { mode: "count", values: [0, 50, 100] } }],
    [{ pips: { mode: "positions", values: 10 } }],
    [{ pips: { mode: "positions", values: [-50, -1, 0, 99, 100, 101] } }],
    [{ pips: { mode: "values", values: 2 } }],
    [
      {
        intervals: { min: -100, max: 100, "50%": 50 },
        pips: { mode: "values", values: [-101, -100, 50, 99, 101] },
      },
    ],
  ],
  partialOptionalArguments: [
    [
      {
        intervals: { min: -100, max: 100, "50%": 25 },
        start: [0, 75],
        steps: [10, 5],
        connect: [true, false, true],
        padding: [10, 5],
        tooltips: [true, false],
      },
    ],
  ],
  fullOptionalArguments: [
    [
      {
        intervals: { min: -100, max: 100, "50%": 50 },
        start: [0, 75],
        steps: [10, 5],
        connect: [false, true, false],
        orientation: "vertical",
        padding: [10, 5],
        formatter: (number: number) => `${number.toFixed(2).toLocaleString()}$`,
        tooltips: [true, (number: number) => `${number.toFixed(4).toLocaleString()}%`],
        pips: { mode: "count", values: 4, density: 5 },
        animate: (timeFraction: number) => timeFraction ** 3,
      },
    ],
  ],
};

testInitDEFAULT_OPTIONS(RangeSliderView, [DEFAULT_OPTIONS], viewPropertiesExpecter);

testInit({
  Creator: RangeSliderView,
  differentConstructorArgs: {
    validRequiredArguments: [[]],
    ...(differentOptionsArg as DifferentArguments<ConstructorParameters<typeof RangeSliderView>>),
  },
  instancePropsExpecter: viewPropertiesExpecter,
  propsToSet: new Map().set("_options", 1),
});
describe("init", () => {
  describe("with start, tooltips, connect options aren't array", () => {
    test("the instance's options should be correct arrays", () => {
      const sliderOptions = (new RangeSliderView({
        intervals: { min: -200, max: 200, "50%": -100 },
        start: -100,
        tooltips: false,
        connect: true,
      }) as any)._options as typeof DEFAULT_OPTIONS;

      expect(sliderOptions.start).toStrictEqual([-100]);
      expect(sliderOptions.tooltips).toStrictEqual([false]);
      expect(sliderOptions.connect).toStrictEqual([true, true]);
    });
  });
});
describe("init", () => {
  describe("with default options", () => {
    test("the instance's func options should be to have returned", () => {
      const instance = new RangeSliderView();

      const formatterMock = jest.fn(instance["_options"].formatter);
      formatterMock(10);
      expect(formatterMock).toHaveReturned();

      const animateMock = jest.fn(instance["_options"].animate);
      animateMock(10);
      expect(animateMock).toHaveReturned();
    });
  });
});

testGetter({
  Creator: RangeSliderView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderView.prototype.getOptions,
    expecter: ({ mock, passedArgs, instance }) => {},
    returns: "_options",
  },
});
testGetter({
  Creator: RangeSliderView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderView.prototype.get,
    expecter: ({ mock, passedArgs, instance }) => {},
    returns: "_state.value",
  },
});
testSetter({
  Creator: RangeSliderView,
  constructorArgs: [],
  instancePropsExpecter: viewPropertiesExpecter,
  methodOfInstanceToTest: {
    methodReference: RangeSliderView.prototype.setOptions,
    expecter: ({ mock, passedArgs, instance }) => {},
    differentArguments: differentOptionsArg,
  },
  propsToSet: new Map().set("_options", 0),
  resetPropsTo: new Map().set("_options", DEFAULT_OPTIONS),
});
describe("setOptions", () => {
  describe("with start, tooltips, connect options aren't array", () => {
    test("the instance's options should be correct arrays", () => {
      const sliderOptions = (new RangeSliderView({
        intervals: { min: -2000, max: 2000, "50%": -1000, "75%": 1800 },
        start: [-100, -50, 0, 50],
        tooltips: [true, false, true, false],
        connect: [true, false, true, false, true],
      }).setOptions({
        start: -100,
        tooltips: false,
        connect: true,
      }) as any)._options as typeof DEFAULT_OPTIONS;

      expect(sliderOptions.start).toStrictEqual([-100, -100, -100, -100]);
      expect(sliderOptions.tooltips).toStrictEqual([false, false, false, false]);
      expect(sliderOptions.connect).toStrictEqual([true, true, true, true, true]);
    });
  });
});

testDOM({
  Creator: RangeSliderView,
  constructorsArgs: [
    [
      {
        intervals: { min: -1250, "80%": -500, "90%": 400, max: 1500 },
        start: [-1250, -600, 1500],
      },
    ],
  ],
  templatesArgs: [],
  callbacksWithTest: [
    ({ container, instance }) => {
      const MIN_TRACK_VALUE = -1250;
      const MAX_TRACK_VALUE = 1500;
      const TRACK_VALUE_SIZE = MAX_TRACK_VALUE - MIN_TRACK_VALUE;
      const TRACK_PX_SIZE = 100;
      const TRACK_RATIO = TRACK_VALUE_SIZE / 100;
      const VALUE_PER_PX = TRACK_VALUE_SIZE / TRACK_PX_SIZE;
      const MOVEMENT_TO_INCLUDE_ALL_INTERVALS_FOR_INNER_THUMB = 30;

      const thumbsElements = container.querySelectorAll<HTMLElement>(".range-slider__thumb");
      const originsElements = Array.from<HTMLElement>(thumbsElements).map((thumbElem) => {
        const originElem = thumbElem.closest(".range-slider__thumb-origin") as HTMLElement;
        //https://github.com/jsdom/jsdom/pull/2666
        originElem.setPointerCapture = function (pointerId: number) {};
        return originElem;
      });
      const infimumThumb = thumbsElements.item(0);
      const innerThumb = thumbsElements.item(1);
      const supremumThumb = thumbsElements.item(2);

      jest.spyOn(instance as any, "_getThumbConstants").mockReturnValue({
        thumbIndex: 1,
        trackValueSize: TRACK_VALUE_SIZE,
        getCalculated() {
          const valuePerPx = TRACK_VALUE_SIZE / TRACK_PX_SIZE;

          return {
            valuePerPx,
          };
        },
      });

      test("should be only one render for each pointermove", () => {
        const renderMock = jest.spyOn(instance as any, "_render");

        innerThumb.dispatchEvent(
          new PointerEvent("pointerdown", {
            pointerId: 1,
            bubbles: true,
          })
        );

        innerThumb.dispatchEvent(
          new PointerEvent("pointermove", {
            pointerId: 1,
            movementX: 10,
            bubbles: true,
          })
        );
        innerThumb.dispatchEvent(
          new PointerEvent("pointermove", {
            pointerId: 1,
            movementX: -10,
            bubbles: true,
          })
        );

        innerThumb.dispatchEvent(
          new PointerEvent("lostpointercapture", {
            pointerId: 1,
            bubbles: true,
          })
        );

        expect(renderMock).toBeCalledTimes(2);

        renderMock.mockRestore();
      });

      test("value should be calculated with taking into account non linear intervals", () => {
        innerThumb.dispatchEvent(
          new PointerEvent("pointerdown", {
            pointerId: 1,
            bubbles: true,
          })
        );

        const movementTO = 1;
        for (let index = 0; index < MOVEMENT_TO_INCLUDE_ALL_INTERVALS_FOR_INNER_THUMB; index++) {
          const valueBefore = +(innerThumb.getAttribute("aria-valuenow") as string);
          innerThumb.dispatchEvent(
            new PointerEvent("pointermove", {
              pointerId: 1,
              movementX: movementTO,
              bubbles: true,
            })
          );
          const newValue = +(innerThumb.getAttribute("aria-valuenow") as string);

          if (valueBefore >= -1250 && valueBefore < -500 && newValue < -500) {
            expect(newValue - valueBefore).toBeCloseTo(
              ((-500 - -1250) / 80 / TRACK_RATIO) * VALUE_PER_PX * movementTO
            );
          }
          if (valueBefore >= -500 && valueBefore < 400 && newValue < 400) {
            expect(newValue - valueBefore).toBeCloseTo(
              ((400 - -500) / 10 / TRACK_RATIO) * VALUE_PER_PX * movementTO
            );
          }
          if (valueBefore >= 400 && valueBefore < 1500 && newValue < 1500) {
            expect(newValue - valueBefore).toBeCloseTo(
              ((1500 - 400) / 10 / TRACK_RATIO) * VALUE_PER_PX * movementTO
            );
          }
        }
        const movementFrom = -1;
        for (let index = 0; index < MOVEMENT_TO_INCLUDE_ALL_INTERVALS_FOR_INNER_THUMB; index++) {
          const valueBefore = +(innerThumb.getAttribute("aria-valuenow") as string);
          innerThumb.dispatchEvent(
            new PointerEvent("pointermove", {
              pointerId: 1,
              movementX: movementFrom,
              bubbles: true,
            })
          );
          const newValue = +(innerThumb.getAttribute("aria-valuenow") as string);

          if (newValue >= -1250 && newValue < -500 && valueBefore < -500) {
            expect(newValue - valueBefore).toBeCloseTo(
              ((-500 - -1250) / 80 / TRACK_RATIO) * VALUE_PER_PX * movementFrom
            );
          }
          if (newValue >= -500 && newValue < 400 && valueBefore < 400) {
            expect(newValue - valueBefore).toBeCloseTo(
              ((400 - -500) / 10 / TRACK_RATIO) * VALUE_PER_PX * movementFrom
            );
          }
          if (newValue >= 400 && newValue < 1500 && valueBefore < 1500) {
            expect(newValue - valueBefore).toBeCloseTo(
              ((1500 - 400) / 10 / TRACK_RATIO) * VALUE_PER_PX * movementFrom
            );
          }
        }

        innerThumb.dispatchEvent(
          new PointerEvent("lostpointercapture", {
            pointerId: 1,
            bubbles: true,
          })
        );
      });

      test("thumb move through several intervals should calculated with proper factor for each interval", () => {
        innerThumb.dispatchEvent(
          new PointerEvent("pointerdown", {
            pointerId: 1,
            bubbles: true,
          })
        );

        innerThumb.dispatchEvent(
          new PointerEvent("pointermove", {
            pointerId: 1,
            movementX: MOVEMENT_TO_INCLUDE_ALL_INTERVALS_FOR_INNER_THUMB,
            bubbles: true,
          })
        );
        innerThumb.dispatchEvent(
          new PointerEvent("pointermove", {
            pointerId: 1,
            movementX: -MOVEMENT_TO_INCLUDE_ALL_INTERVALS_FOR_INNER_THUMB,
            bubbles: true,
          })
        );
        expect(+(innerThumb.getAttribute("aria-valuenow") as string)).toBe(-600);

        innerThumb.dispatchEvent(
          new PointerEvent("lostpointercapture", {
            pointerId: 1,
            bubbles: true,
          })
        );
      });

      test("z-indexes of close to each other thumbs should be swapped for user friendly usage", () => {
        innerThumb.dispatchEvent(
          new PointerEvent("pointerdown", {
            pointerId: 1,
            bubbles: true,
          })
        );

        innerThumb.dispatchEvent(
          new PointerEvent("pointermove", {
            pointerId: 1,
            movementX: TRACK_PX_SIZE,
            bubbles: true,
          })
        );
        expect(+originsElements[1].style.zIndex).toBeGreaterThan(+originsElements[2].style.zIndex);
        innerThumb.dispatchEvent(
          new PointerEvent("pointermove", {
            pointerId: 1,
            movementX: -TRACK_PX_SIZE,
            bubbles: true,
          })
        );
        expect(+originsElements[1].style.zIndex).toBeGreaterThan(+originsElements[0].style.zIndex);

        innerThumb.dispatchEvent(
          new PointerEvent("lostpointercapture", {
            pointerId: 1,
            bubbles: true,
          })
        );
      });

      test("each thumb should be limited by sibling thumb or end of track", () => {
        innerThumb.dispatchEvent(
          new PointerEvent("pointerdown", {
            pointerId: 1,
            bubbles: true,
          })
        );
        infimumThumb.dispatchEvent(
          new PointerEvent("pointerdown", {
            pointerId: 2,
            bubbles: true,
          })
        );
        supremumThumb.dispatchEvent(
          new PointerEvent("pointerdown", {
            pointerId: 3,
            bubbles: true,
          })
        );

        infimumThumb.dispatchEvent(
          new PointerEvent("pointermove", {
            pointerId: 2,
            movementX: 1,
            bubbles: true,
          })
        );
        supremumThumb.dispatchEvent(
          new PointerEvent("pointermove", {
            pointerId: 3,
            movementX: -1,
            bubbles: true,
          })
        );

        innerThumb.dispatchEvent(
          new PointerEvent("pointermove", {
            pointerId: 1,
            movementX: TRACK_PX_SIZE,
            bubbles: true,
          })
        );
        expect(+(innerThumb.getAttribute("aria-valuenow") as string)).toBe(
          +(supremumThumb.getAttribute("aria-valuenow") as string)
        );
        innerThumb.dispatchEvent(
          new PointerEvent("pointermove", {
            pointerId: 1,
            movementX: -TRACK_PX_SIZE,
            bubbles: true,
          })
        );
        expect(+(innerThumb.getAttribute("aria-valuenow") as string)).toBe(
          +(infimumThumb.getAttribute("aria-valuenow") as string)
        );

        infimumThumb.dispatchEvent(
          new PointerEvent("pointermove", {
            pointerId: 2,
            movementX: -TRACK_PX_SIZE,
            bubbles: true,
          })
        );
        expect(+(infimumThumb.getAttribute("aria-valuenow") as string)).toBe(MIN_TRACK_VALUE);

        supremumThumb.dispatchEvent(
          new PointerEvent("pointermove", {
            pointerId: 3,
            movementX: TRACK_PX_SIZE,
            bubbles: true,
          })
        );
        expect(+(supremumThumb.getAttribute("aria-valuenow") as string)).toBe(MAX_TRACK_VALUE);

        innerThumb.dispatchEvent(
          new PointerEvent("lostpointercapture", {
            pointerId: 1,
            bubbles: true,
          })
        );
        infimumThumb.dispatchEvent(
          new PointerEvent("lostpointercapture", {
            pointerId: 2,
            bubbles: true,
          })
        );
        supremumThumb.dispatchEvent(
          new PointerEvent("lostpointercapture", {
            pointerId: 3,
            bubbles: true,
          })
        );
      });
    },
    ({ container, instance }) => {
      test("_getThumbConstants method should calculate correctly", () => {
        const _getThumbConstantsMock = jest.spyOn(instance as any, "_getThumbConstants");

        const fakeThumbOriginElem = container.querySelector(
          ".range-slider__thumb-origin"
        ) as HTMLElement;
        jest
          .spyOn(
            fakeThumbOriginElem.closest(".range-slider__track") as HTMLElement,
            "getBoundingClientRect"
          )
          .mockImplementation(() => {
            return {
              width: 2000,
              height: 0,
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              x: 0,
              y: 0,
              toJSON: () => ``,
            };
          });

        const thumbConstants = instance["_getThumbConstants"](fakeThumbOriginElem);

        expect(_getThumbConstantsMock).toHaveReturnedWith({
          thumbIndex: 0,
          trackValueSize: 200,
          getCalculated: expect.any(Function),
        });
        expect(thumbConstants.getCalculated()).toMatchObject({ valuePerPx: 200 / 2000 });

        _getThumbConstantsMock.mockRestore();
      });
    },
  ],
});
