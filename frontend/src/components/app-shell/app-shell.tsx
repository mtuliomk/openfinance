import type { AppShellProps } from './app-shell.types';
import { APP_SHELL_NAV_ITEMS } from './app-shell.utils';

function isSidebarItemActive(feature: AppShellProps['activeFeature'], candidate: string): boolean {
  return feature === candidate;
}

function isSidebarGroupActive(
  feature: AppShellProps['activeFeature'],
  item: (typeof APP_SHELL_NAV_ITEMS)[number],
): boolean {
  return item.feature === feature || Boolean(item.children?.some((child) => child.feature === feature));
}

export function AppShell({
  title,
  displayName,
  avatarUrl,
  firstName,
  activeFeature,
  onFeatureChange,
  onLogout,
  onSearch,
  children,
}: AppShellProps) {
  const showAvatar = Boolean(avatarUrl);

  return (
    <div className="app-shell">
      <aside className="app-shell__sidebar" aria-label="Menu lateral">
        <div className="app-shell__profile">
          {showAvatar ? (
            <img className="app-shell__avatar" src={avatarUrl ?? undefined} alt={`Avatar de ${displayName}`} />
          ) : (
            <span className="app-shell__avatar-fallback" aria-hidden="true">
              {firstName.charAt(0).toUpperCase()}
            </span>
          )}

          <div className="app-shell__profile-copy">
            <p className="app-shell__profile-name">{displayName}</p>
            <p className="app-shell__profile-subtitle">Premium Account</p>
            <span className="app-shell__verified" aria-label="Conta verificada">
              VERIFIED
            </span>
          </div>
        </div>

        <nav className="app-shell__nav" aria-label="Funcionalidades">
          {APP_SHELL_NAV_ITEMS.map((item) => {
            if (item.children) {
              return (
                <div key={item.feature} className="app-shell__nav-group" data-open={isSidebarGroupActive(activeFeature, item)}>
                  <button
                    type="button"
                    className="app-shell__nav-item"
                    data-active={isSidebarItemActive(activeFeature, item.feature)}
                    onClick={() => onFeatureChange(item.feature)}
                    aria-expanded={isSidebarGroupActive(activeFeature, item)}
                  >
                    <span className="app-shell__nav-icon" aria-hidden="true">
                      <ShellIcon feature={item.feature} />
                    </span>
                    <span className="app-shell__nav-label">{item.label}</span>
                    <span className="app-shell__nav-chevron" aria-hidden="true">
                      v
                    </span>
                  </button>

                  <div className="app-shell__submenu">
                    {item.children.map((child) => (
                      <button
                        key={`${item.feature}-${child.feature}-${child.label}`}
                        type="button"
                        className="app-shell__submenu-item"
                        data-active={isSidebarItemActive(activeFeature, child.feature)}
                        onClick={() => onFeatureChange(child.feature)}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <button
                key={item.feature}
                type="button"
                className="app-shell__nav-item"
                data-active={isSidebarItemActive(activeFeature, item.feature)}
                onClick={() => onFeatureChange(item.feature)}
              >
                <span className="app-shell__nav-icon" aria-hidden="true">
                  <ShellIcon feature={item.feature} />
                </span>
                <span className="app-shell__nav-label">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <button type="button" className="app-shell__logout" onClick={onLogout}>
          Logout
        </button>
      </aside>

      <div className="app-shell__content">
        <header className="app-shell__header">
          <div className="app-shell__header-title-wrap">
            <span className="app-shell__header-icon" aria-hidden="true">
              <ShellHeaderIcon />
            </span>
            <h1 className="app-shell__header-title">{title}</h1>
          </div>

          <button type="button" className="app-shell__search" onClick={onSearch} aria-label="Buscar">
            <ShellSearchIcon />
          </button>
        </header>

        <main className="app-shell__main">{children}</main>
      </div>
    </div>
  );
}

function ShellIcon({ feature }: { feature: string }) {
  if (feature === 'home') {
    return <span>DB</span>;
  }
  if (feature === 'contas') {
    return <span>AC</span>;
  }
  if (feature === 'transactions') {
    return <span>TX</span>;
  }
  if (feature === 'investimentos') {
    return <span>IV</span>;
  }
  if (feature === 'cartoes') {
    return <span>CC</span>;
  }
  if (feature === 'analise') {
    return <span>BD</span>;
  }
  return <span>ST</span>;
}

function ShellHeaderIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" />
    </svg>
  );
}

function ShellSearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M10.5 4a6.5 6.5 0 1 0 4.1 11.53l4.18 4.17 1.42-1.42-4.17-4.18A6.5 6.5 0 0 0 10.5 4Zm0 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z" />
    </svg>
  );
}
