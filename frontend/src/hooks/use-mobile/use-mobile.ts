import { MOBILE_MAX_WIDTH } from './use-mobile.utils';
import type { UseMobileResult } from './use-mobile.types';

export function useMobile(): UseMobileResult {
  return { isMobile: window.innerWidth <= MOBILE_MAX_WIDTH };
}
