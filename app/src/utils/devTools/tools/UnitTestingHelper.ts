interface TestInitOptions<V, O> {
  invalidOptions?: O[];
  partialOptions?: O[];
  fullOptions?: O[];
  nameOfOptionsProperty?: NameOfOptionsProperty;
  expectValidProperties?: (parts: { viewOptions: Required<O>; passedOptions: O; view: V }) => void;
}
export function testInit<V, O>(
  View: { new (container: HTMLElement, options?: O): V },
  DEFAULT_OPTIONS: Required<O>,
  {
    invalidOptions = [],
    partialOptions = [],
    fullOptions = [],
    nameOfOptionsProperty = "_options",
    expectValidProperties = ({ viewOptions, passedOptions, view }) => {
      expect(1).toBe(1);
    },
  }: TestInitOptions<V, O> = {}
): void {
  const CONTAINER_TAG = "div";

  let view: V;
  let viewOptions: Required<O>;
  let passedOptions: O;

  describe("init", () => {
    describe("with undefined options", () => {
      beforeEach(() => {
        view = new View(document.createElement(CONTAINER_TAG));
        viewOptions = (view as any)[`${nameOfOptionsProperty}`];
      });

      checkViewProperties();
    });

    describe("with empty options", () => {
      beforeEach(() => {
        view = new View(document.createElement(CONTAINER_TAG), (passedOptions = {} as O));
        viewOptions = (view as any)[`${nameOfOptionsProperty}`];
      });

      checkViewProperties();
    });

    invalidOptions.forEach((invalidOptions, index) => {
      describe(`with ${index + 1} invalid options`, () => {
        beforeEach(() => {
          view = new View(document.createElement(CONTAINER_TAG), (passedOptions = invalidOptions));
          viewOptions = (view as any)[`${nameOfOptionsProperty}`];
        });

        checkViewProperties();
      });
    });

    partialOptions.forEach((partialOptions, index) => {
      describe(`with ${index + 1} partial options`, () => {
        beforeEach(() => {
          view = new View(document.createElement(CONTAINER_TAG), (passedOptions = partialOptions));
          viewOptions = (view as any)[`${nameOfOptionsProperty}`];
        });

        checkViewProperties();
      });
    });

    describe("with the same as default options", () => {
      beforeEach(() => {
        view = new View(document.createElement(CONTAINER_TAG), (passedOptions = DEFAULT_OPTIONS));
        viewOptions = (view as any)[`${nameOfOptionsProperty}`];
      });

      checkViewProperties();
    });

    fullOptions.forEach((fullOptions, index) => {
      describe(`with ${index + 1} full valid options: `, () => {
        beforeEach(() => {
          view = new View(document.createElement(CONTAINER_TAG), (passedOptions = fullOptions));
          viewOptions = (view as any)[`${nameOfOptionsProperty}`];
        });

        checkViewProperties();
      });
    });

    function checkViewProperties(): void {
      test("all properties are defined", () => {
        (function testPropertiesAreDefined(object: object) {
          for (const key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
              expect(object[key]).toBeDefined();

              if (object[key] instanceof Object) {
                testPropertiesAreDefined(object[key]);
              }
            }
          }
        })(view as any);
      });

      test("properties should be correct", () => {
        expectValidProperties({ viewOptions, passedOptions, view });
      });

      test("correct user's options should be applied", () => {
        if (Object.is(passedOptions, partialOptions) || Object.is(passedOptions, fullOptions)) {
          for (const optionName in passedOptions) {
            expect(view[nameOfOptionsProperty][optionName]).toEqual(passedOptions[optionName]);
          }
        }
      });
    }
  });
}
type NameOfOptionsProperty = string;
