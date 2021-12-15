import isPlainObject from 'lodash-es/isPlainObject';

import {
  eachDeep,
  resolveLongBracketNotation,
} from '@shared/utils/scripts/object';
import { isReferenceType } from '@shared/utils/scripts/types/guards';

import { PropsToSet } from './types';

const expectPropsAreApplied = <TInstance>(
  propsToSet: PropsToSet<unknown>,
  instance: TInstance
): void => {
  test("correct user's arguments should be applied", () => {
    propsToSet.forEach((argValue, pathToPropInInstance) => {
      if (argValue !== undefined) {
        if (isPlainObject(argValue)) {
          expect(
            resolveLongBracketNotation(`${pathToPropInInstance}`, instance)
          ).toMatchObject(argValue as any);
        } else {
          expect(
            resolveLongBracketNotation(`${pathToPropInInstance}`, instance)
          ).toEqual(argValue);
        }
      }
    });
  });

  propsToSet.forEach((argValue, pathToPropInInstance) => {
    if (isReferenceType(argValue)) {
      test(`passed referenced argument setting ${pathToPropInInstance} instance's property should be cloned deep`, () => {
        expect(
          resolveLongBracketNotation(`${pathToPropInInstance}`, instance)
        ).not.toBe(argValue);
        expect(
          resolveLongBracketNotation(`${pathToPropInInstance}`, instance)
        ).toMatchObject(argValue as any);

        eachDeep(argValue, ({ value, path }) => {
          if (isReferenceType(value) && typeof value !== 'function') {
            expect(
              resolveLongBracketNotation(
                `${pathToPropInInstance}.${path}`,
                instance
              )
            ).not.toBe(value);
            expect(
              resolveLongBracketNotation(
                `${pathToPropInInstance}.${path}`,
                instance
              )
            ).toMatchObject(value as any);
          }
        });
      });
    }
  });
};

export { expectPropsAreApplied as default };
