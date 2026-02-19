
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/pages/Home';
import Dashboard from './components/pages/Dashboard';
import Diagnosis from './components/Diagnosis';
import LiveDetection from './pages/LiveDetection';
import { AppRoute } from './types';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path={AppRoute.HOME} element={<Home />} />
          <Route path={AppRoute.DASHBOARD} element={<Dashboard />} />
          <Route path={AppRoute.DIAGNOSIS} element={<Diagnosis />} />
          <Route path={AppRoute.LIVE} element={<LiveDetection />} />
          <Route path={AppRoute.HISTORY} element={<div className="p-8 text-center bg-white rounded-3xl shadow-sm"><i className="fas fa-tools text-5xl mb-4 text-emerald-500"></i><h2 className="text-2xl font-bold">History Page</h2><p className="text-slate-500">This feature is coming soon to your region.</p></div>} />
          <Route path={AppRoute.RESOURCES} element={<div className="p-8 text-center bg-white rounded-3xl shadow-sm"><i className="fas fa-graduation-cap text-5xl mb-4 text-emerald-500"></i><h2 className="text-2xl font-bold">Knowledge Hub</h2><p className="text-slate-500">Expanding our agricultural encyclopedia.</p></div>} />
          <Route path={AppRoute.PROFILE} element={<div className="p-8 text-center bg-white rounded-3xl shadow-sm"><i className="fas fa-user-cog text-5xl mb-4 text-emerald-500"></i><h2 className="text-2xl font-bold">User Profile</h2><p className="text-slate-500">Manage your farm locations and notification settings.</p></div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
