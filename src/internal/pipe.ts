export interface Pipeable {
  pipe<A>(this: A): A;
  pipe<A, B>(this: A, ab: (_: A) => B): B;
  pipe<A, B, C>(this: A, ab: (_: A) => B, bc: (_: B) => C): C;
  pipe<A, B, C, D>(this: A, ab: (_: A) => B, bc: (_: B) => C, cd: (_: C) => D): D;
  pipe<A, B, C, D, E>(
    this: A,
    ab: (_: A) => B,
    bc: (_: B) => C,
    cd: (_: C) => D,
    de: (_: D) => E,
  ): E;
  pipe<A, B, C, D, E, F>(
    this: A,
    ab: (_: A) => B,
    bc: (_: B) => C,
    cd: (_: C) => D,
    de: (_: D) => E,
    ef: (_: E) => F,
  ): F;
}

export function pipeArguments<A>(self: A, args: IArguments): unknown {
  let result: unknown = self;

  for (let index = 0; index < args.length; index++) {
    result = (args[index] as (_: unknown) => unknown)(result);
  }

  return result;
}

export function pipe<A>(value: A): A;
export function pipe<A, B>(value: A, ab: (_: A) => B): B;
export function pipe<A, B, C>(value: A, ab: (_: A) => B, bc: (_: B) => C): C;
export function pipe<A, B, C, D>(value: A, ab: (_: A) => B, bc: (_: B) => C, cd: (_: C) => D): D;
export function pipe<A, B, C, D, E>(
  value: A,
  ab: (_: A) => B,
  bc: (_: B) => C,
  cd: (_: C) => D,
  de: (_: D) => E,
): E;
export function pipe(value: unknown, ...fns: ReadonlyArray<(_: unknown) => unknown>): unknown {
  return fns.reduce((current, fn) => fn(current), value);
}

export function dual<
  Curried extends (...args: ReadonlyArray<any>) => any,
  Uncurried extends (...args: ReadonlyArray<any>) => any,
>(arity: number, body: (...args: ReadonlyArray<any>) => any): Curried & Uncurried {
  return ((...args: ReadonlyArray<any>) => {
    if (args.length >= arity) {
      return body(...args);
    }

    return (self: unknown) => body(self, ...args);
  }) as Curried & Uncurried;
}
