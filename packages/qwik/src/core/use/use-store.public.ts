import { createProxy, QObjectRecursive } from '../object/q-object';
import { getInvokeContext, useRenderContext } from './use-core';
import { useHostElement } from './use-host-element.public';
import { getContext } from '../props/props';
import { assertEqual } from '../assert/assert';
import { RenderEvent } from '../util/markers';
import { isFunction } from '../util/types';

export interface UseStoreOptions {
  recursive?: boolean;
}

// <docs markdown="../readme.md#useStore">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useStore instead)
/**
 * Creates a object that Qwik can track across serializations.
 *
 * Use `useStore` to create state for your application. The return object is a proxy which has a
 * unique ID. The ID of the object is used in the `QRL`s to refer to the store.
 *
 * ## Example
 *
 * Example showing how `useStore` is used in Counter example to keep track of count.
 *
 * ```tsx
 * const Stores = component$(() => {
 *   const counter = useCounter(1);
 *
 *   // Reactivity happens even for nested objects and arrays
 *   const userData = useStore({
 *     name: 'Manu',
 *     address: {
 *       address: '',
 *       city: '',
 *     },
 *     orgs: [],
 *   });
 *
 *   // useStore() can also accept a function to calculate the initial value
 *   const state = useStore(() => {
 *     return {
 *       value: expensiveInitialValue(),
 *     };
 *   });
 *
 *   return (
 *     <Host>
 *       <div>Counter: {counter.value}</div>
 *       <Child userData={userData} state={state} />
 *     </Host>
 *   );
 * });
 *
 * function useCounter(step: number) {
 *   // Multiple stores can be created in custom hooks for convenience and composability
 *   const counterStore = useStore({
 *     value: 0,
 *   });
 *   useClientEffect$(() => {
 *     // Only runs in the client
 *     const timer = setInterval(() => {
 *       counterStore.value += step;
 *     }, 500);
 *     return () => {
 *       clearInterval(timer);
 *     };
 *   });
 *   return counterStore;
 * }
 * ```
 *
 * @public
 */
// </docs>
export const useStore = <STATE extends object>(
  initialState: STATE | (() => STATE),
  opts?: UseStoreOptions
): STATE => {
  const [store, setStore] = useSequentialScope();
  if (store != null) {
    return store;
  }
  const containerState = useRenderContext().$containerState$;
  const value = isFunction(initialState) ? (initialState as Function)() : initialState;
  const recursive = opts?.recursive ?? false;
  const flags = recursive ? QObjectRecursive : 0;
  const newStore = createProxy(value, containerState, flags, undefined);
  setStore(newStore);
  return newStore;
};

/**
 * @alpha
 */
export interface Ref<T> {
  current?: T;
}

// <docs markdown="../readme.md#useRef">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useRef instead)
/**
 * It's a very thin wrapper around `useStore()` including the proper type signature to be passed
 * to the `ref` property in JSX.
 *
 * ```tsx
 * export function useRef<T = Element>(current?: T): Ref<T> {
 *   return useStore({ current });
 * }
 * ```
 *
 * ## Example
 *
 * ```tsx
 * const Cmp = component$(() => {
 *   const input = useRef<HTMLInputElement>();
 *
 *   useClientEffect$((track) => {
 *     const el = track(input, 'current')!;
 *     el.focus();
 *   });
 *
 *   return (
 *     <Host>
 *       <input type="text" ref={input} />
 *     </Host>
 *   );
 * });
 *
 * ```
 *
 * @public
 */
// </docs>
export const useRef = <T = Element>(current?: T): Ref<T> => {
  return useStore({ current });
};

/**
 * @alpha
 */
export const useSequentialScope = (): [any, (prop: any) => void, number] => {
  const ctx = getInvokeContext();
  assertEqual(ctx.$event$, RenderEvent);
  const index = ctx.$seq$;
  const hostElement = useHostElement();
  const elementCtx = getContext(hostElement);
  ctx.$seq$++;
  const updateFn = (value: any) => {
    elementCtx.$seq$[index] = value;
  };
  return [elementCtx.$seq$[index], updateFn, index];
};