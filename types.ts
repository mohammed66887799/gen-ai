
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Farmer' | 'Agronomist' | 'Admin';
  farmLocation?: string;
}

export interface DiseaseDiagnosis {
  id: string;
  timestamp: number;
  cropName: string;
  diseaseName: string;
  confidence: number;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  recommendations: string[];
  imageUrl: string;
  description: string;
  preventativeMeasures: string[];
}

export interface ScanResult {
  diseaseName: string;
  confidence: number;
  cropType: string;
  description: string;
  treatment: string[];
  prevention: string[];
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
}

export enum AppRoute {
  HOME = '/',
  DASHBOARD = '/dashboard',
  DIAGNOSIS = '/diagnosis',
  HISTORY = '/history',
  PROFILE = '/profile',
  RESOURCES = '/resources'
}
