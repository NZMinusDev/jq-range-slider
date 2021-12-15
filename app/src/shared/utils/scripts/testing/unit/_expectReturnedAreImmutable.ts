import {
  eachDeep,
  resolveLongBracketNotation,
} from '@shared/utils/scripts/object';
import { isReferenceType } from '@shared/utils/scripts/types/guards';

import { PropToGet } from './types';

const expectReturnedAreImmutable = <TInstance>(
  returned: unknown,
  returns: PropToGet,
  instance: TInstance
): void => {
  const propOfInstanceValue = resolveLongBracketNotation(returns, instance);

  if (isReferenceType(propOfInstanceValue)) {
    test(`returned referenced property should be cloned deep`, () => {
      expect(returned).not.toBe(propOfInstanceValue);
      expect(returned).toStrictEqual(propOfInstanceValue);

      eachDeep(returned, ({ value, path }) => {
        if (isReferenceType(value) && typeof value !== 'function') {
          expect(
            resolveLongBracketNotation(`${returns}.${path}`, instance)
          ).not.toBe(value);
          expect(
            resolveLongBracketNotation(`${returns}.${path}`, instance)
          ).toMatchObject(value as any);
        }
      });
    });
  }
};

export { expectReturnedAreImmutable as default };
