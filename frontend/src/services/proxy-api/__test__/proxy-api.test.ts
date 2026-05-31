import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { listAccounts } from '../proxy-api';
import { AUTH_SESSION_STORAGE_KEY } from '../../../state/auth-session/auth-session.types';

describe('proxy-api unauthorized handler', () => {
  beforeEach(() => {
    window.localStorage.setItem(
      AUTH_SESSION_STORAGE_KEY,
      JSON.stringify({ isAuthenticated: true, displayName: 'User', avatarUrl: null }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it('desloga quando o proxy responde 401', async () => {
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState');
    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 401 })));

    await expect(listAccounts()).rejects.toThrow('Failed to load accounts');

    expect(window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY)).toBeNull();
    expect(replaceStateSpy).toHaveBeenCalledWith({}, '', '/');
    expect(dispatchEventSpy).toHaveBeenCalled();
  });
});
