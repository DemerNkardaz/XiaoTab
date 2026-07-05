import { ref, shallowRef, onScopeDispose } from 'vue';
import { liveQuery, type Subscription } from 'dexie';

export function useLiveQuery<T>(querier: () => Promise<T> | T, initial: T) {
  const data = shallowRef<T>(initial);
  const error = ref<unknown>(null);

  const observable = liveQuery(querier);
  let sub: Subscription;

  sub = observable.subscribe({
    next: (value) => {
      data.value = value;
      error.value = null;
    },
    error: (err) => {
      error.value = err;
    },
  });

  onScopeDispose(() => sub.unsubscribe());

  return { data, error };
}
