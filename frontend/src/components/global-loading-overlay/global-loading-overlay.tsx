import type { GlobalLoadingOverlayProps } from './global-loading-overlay.types';
import { GLOBAL_LOADING_OVERLAY_LABEL, GLOBAL_LOADING_OVERLAY_MESSAGE } from './global-loading-overlay.utils';

export function GlobalLoadingOverlay({ isVisible }: GlobalLoadingOverlayProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="global-loading-overlay" role="status" aria-live="polite" aria-label={GLOBAL_LOADING_OVERLAY_LABEL}>
      <div className="global-loading-overlay__backdrop" />
      <div className="global-loading-overlay__panel">
        <span className="global-loading-overlay__spinner" aria-hidden="true" />
        <p className="global-loading-overlay__text">{GLOBAL_LOADING_OVERLAY_MESSAGE}</p>
      </div>
    </div>
  );
}
