import type { NetworkLoadingState } from './network-loading.types';
import { initialNetworkLoadingState } from './network-loading.utils';

type Listener = (state: NetworkLoadingState) => void;

const listeners = new Set<Listener>();
let state = initialNetworkLoadingState;

function emit(): void {
  for (const listener of listeners) {
    listener(state);
  }
}

export function subscribeNetworkLoading(listener: Listener): () => void {
  listeners.add(listener);
  listener(state);

  return () => {
    listeners.delete(listener);
  };
}

export function startNetworkLoading(): () => void {
  state = {
    activeCount: state.activeCount + 1,
  };
  emit();

  let completed = false;
  return () => {
    if (completed) {
      return;
    }

    completed = true;
    state = {
      activeCount: Math.max(0, state.activeCount - 1),
    };
    emit();
  };
}
