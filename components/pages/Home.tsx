
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="space-y-12">
      <section className="relative rounded-3xl overflow-hidden bg-emerald-600 text-white p-8 md:p-16">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <i className="fas fa-leaf text-[20rem] rotate-12"></i>
        </div>
        <div className="relative z-10 max-w-2xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Next-Gen Crop Health <span className="text-emerald-200">AI Intelligence</span>
          </h1>
          <p className="text-lg md:text-xl text-emerald-50">
            Identify 100+ plant diseases instantly. Save your crops with precision AI analysis and expert-vetted treatment protocols.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/diagnosis" className="bg-white text-emerald-700 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-emerald-50 transition-colors">
              Start Free Diagnosis
            </Link>
            <Link to="/resources" className="bg-emerald-700 text-white px-8 py-3 rounded-full font-bold border border-emerald-500 hover:bg-emerald-800 transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: 'fa-bolt', title: 'Instant Detection', desc: 'Get results in under 5 seconds using MobileNetV2 optimized neural networks.' },
          { icon: 'fa-file-medical', title: 'Expert Protocols', desc: 'Actionable treatment plans curated by top agronomists and AI research.' },
          { icon: 'fa-shield-halved', title: 'Crop Protection', desc: 'Predict potential outbreaks in your region with community-shared data.' },
        ].map((feat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
              <i className={`fas ${feat.icon}`}></i>
            </div>
            <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
            <p className="text-slate-600 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </section>

      <section className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <h2 className="text-3xl font-bold">Trusted by 50,000+ Farmers</h2>
          <p className="text-slate-400 text-lg">
            "AgroDetect saved my tomato plantation this season. I caught Blight early and followed the AI's organic treatment guide."
          </p>
          <div className="flex items-center justify-center md:justify-start space-x-2">
            {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star text-yellow-500"></i>)}
            <span className="ml-2 font-semibold">4.9/5 Rating</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="bg-slate-800 p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-emerald-400">98%</div>
            <div className="text-sm text-slate-400">Accuracy</div>
          </div>
          <div className="bg-slate-800 p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-emerald-400">12s</div>
            <div className="text-sm text-slate-400">Avg Response</div>
          </div>
          <div className="bg-slate-800 p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-emerald-400">40+</div>
            <div className="text-sm text-slate-400">Crops Supported</div>
          </div>
          <div className="bg-slate-800 p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-emerald-400">24/7</div>
            <div className="text-sm text-slate-400">AI Support</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
