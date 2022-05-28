import { ClassConstructor, plainToInstance } from 'class-transformer';

export function Serializer<T>(cls: ClassConstructor<T>): MethodDecorator {
  return (target, propertyKey, descriptor: TypedPropertyDescriptor<any>) => {
    const method = descriptor.value;
    descriptor.value = async function (...args: any) {
      const res = await method.apply(this, args);
      return plainToInstance(cls, res, { strategy: 'excludeAll' });
    };
  };
}
