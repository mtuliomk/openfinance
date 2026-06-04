import type { ReactNode } from 'react';
import type { HomeFeatureKey } from '../../routes/home/home.types';

export interface AppShellNavItem {
  feature: HomeFeatureKey;
  label: string;
  children?: AppShellNavItem[];
}

export interface AppShellProps {
  title: string;
  displayName: string;
  avatarUrl: string | null;
  firstName: string;
  activeFeature: HomeFeatureKey;
  onFeatureChange: (feature: HomeFeatureKey) => void;
  onLogout: () => void;
  onSearch: () => void;
  children: ReactNode;
}
