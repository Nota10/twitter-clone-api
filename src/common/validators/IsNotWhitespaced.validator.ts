/* eslint-disable @typescript-eslint/ban-types */
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsNotWhitespaced(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string): void {
    registerDecorator({
      name: 'IsNotWhitespaced',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string) {
          return typeof value === 'string' && !/\s/.test(value);
        },
      },
    });
  };
}
