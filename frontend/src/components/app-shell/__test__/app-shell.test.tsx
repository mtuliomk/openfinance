import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AppShell } from '../app-shell';

describe('AppShell', () => {
  it('renders shell structure', () => {
    const html = renderToStaticMarkup(
      <AppShell
        title="Transactions"
        displayName="Alex Sterling"
        avatarUrl={null}
        firstName="Alex"
        activeFeature="home"
        onFeatureChange={() => undefined}
        onLogout={() => undefined}
        onSearch={() => undefined}
      >
        <div>content</div>
      </AppShell>,
    );

    expect(html).toContain('Transactions');
    expect(html).toContain('Dashboard');
    expect(html).toContain('content');
  });
});
