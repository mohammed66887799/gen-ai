
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const activityData = [
    { name: 'Mon', scans: 12 },
    { name: 'Tue', scans: 19 },
    { name: 'Wed', scans: 15 },
    { name: 'Thu', scans: 22 },
    { name: 'Fri', scans: 30 },
    { name: 'Sat', scans: 25 },
    { name: 'Sun', scans: 18 },
  ];

  const cropDistribution = [
    { name: 'Tomato', value: 45 },
    { name: 'Potato', value: 25 },
    { name: 'Apple', value: 20 },
    { name: 'Others', value: 10 },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Field Overview</h1>
          <p className="text-slate-500">Welcome back, your farm health is looking <span className="text-emerald-600 font-bold">Stable</span>.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-medium shadow-sm hover:bg-slate-50 transition-colors">
            Last 30 Days
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium shadow-md hover:bg-emerald-700 transition-colors">
            Download Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Scans', value: '1,284', change: '+12%', icon: 'fa-search', color: 'emerald' },
          { label: 'Diseases Detected', value: '42', change: '-5%', icon: 'fa-virus-slash', color: 'red' },
          { label: 'Healthy Crops', value: '96%', change: '+2%', icon: 'fa-heart-pulse', color: 'blue' },
          { label: 'Treatment Success', value: '88%', change: '+1%', icon: 'fa-circle-check', color: 'orange' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center`}>
              <i className={`fas ${stat.icon}`}></i>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <div className="flex items-end space-x-2">
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold">Detection Trends</h3>
            <div className="flex space-x-2">
              <span className="flex items-center text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                Disease incidence
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  cursor={{ stroke: '#10b981', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="scans" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorScans)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold mb-8">Crop Health Split</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cropDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {cropDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {cropDistribution.map((item, i) => (
              <div key={i} className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></span>
                <span className="text-xs text-slate-600 font-medium">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-bold">Recent Diagnoses</h3>
          <button className="text-emerald-600 font-bold text-sm hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left text-xs text-slate-400 font-bold uppercase tracking-wider">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Crop</th>
                <th className="px-6 py-4">Disease</th>
                <th className="px-6 py-4">Confidence</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { id: 'SCN-120', crop: 'Tomato', disease: 'Late Blight', conf: '94%', status: 'Active', severity: 'High' },
                { id: 'SCN-119', crop: 'Apple', disease: 'Scab', conf: '98%', status: 'Resolved', severity: 'Moderate' },
                { id: 'SCN-118', crop: 'Corn', disease: 'Common Rust', conf: '87%', status: 'Active', severity: 'Low' },
                { id: 'SCN-117', crop: 'Potato', disease: 'Healthy', conf: '99%', status: 'Completed', severity: 'Healthy' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-slate-400">{row.id}</td>
                  <td className="px-6 py-4 font-semibold">{row.crop}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{row.disease}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-emerald-600">{row.conf}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                      row.status === 'Active' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-slate-400 hover:text-emerald-600 transition-colors">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
