
import React from 'react';
import { AppRoute } from './types';

export const NAV_ITEMS = [
  { label: 'Home', path: AppRoute.HOME, icon: <i className="fas fa-home"></i> },
  { label: 'Dashboard', path: AppRoute.DASHBOARD, icon: <i className="fas fa-chart-line"></i> },
  { label: 'Diagnosis', path: AppRoute.DIAGNOSIS, icon: <i className="fas fa-microscope"></i> },
  { label: 'History', path: AppRoute.HISTORY, icon: <i className="fas fa-history"></i> },
  { label: 'Resources', path: AppRoute.RESOURCES, icon: <i className="fas fa-book"></i> },
  { label: 'Profile', path: AppRoute.PROFILE, icon: <i className="fas fa-user-circle"></i> },
];

export const CROP_TYPES = [
  'Tomato', 'Potato', 'Apple', 'Corn', 'Grape', 'Pepper', 'Strawberry', 'Rice', 'Wheat'
];

export const APP_THEME = {
  primary: 'emerald-600',
  primaryDark: 'emerald-700',
  secondary: 'slate-600',
  accent: 'orange-500',
};
