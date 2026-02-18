
import React, { useState, useRef, useCallback } from 'react';
import { analyzePlantDisease } from '../services/geminiService';
import { ScanResult } from '../types';

const Diagnosis: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!selectedImage) return;
    
    setLoading(true);
    setError(null);
    try {
      const diagnosisResult = await analyzePlantDisease(selectedImage);
      setResult(diagnosisResult);
    } catch (err) {
      setError("Analysis failed. Please try a clearer image or check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Plant Diagnosis Engine</h1>
        <p className="text-slate-500">Upload a high-quality photo of the affected leaf for real-time analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Upload Section */}
        <div className="space-y-6">
          <div 
            onClick={() => !loading && fileInputRef.current?.click()}
            className={`aspect-square relative rounded-3xl border-4 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden ${
              selectedImage ? 'border-emerald-500' : 'border-slate-300 hover:border-emerald-400 bg-white'
            }`}
          >
            {selectedImage ? (
              <>
                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                {!loading && !result && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                    <p className="text-white font-bold">Change Image</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center p-8 space-y-4">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-3xl">
                  <i className="fas fa-camera"></i>
                </div>
                <div>
                  <p className="text-lg font-bold">Click to Upload</p>
                  <p className="text-sm text-slate-400">or drag and drop JPG/PNG</p>
                </div>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={startAnalysis}
              disabled={!selectedImage || loading}
              className={`flex-1 py-4 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center space-x-2 ${
                !selectedImage || loading 
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
              }`}
            >
              {loading ? (
                <>
                  <i className="fas fa-circle-notch fa-spin"></i>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-wand-magic-sparkles"></i>
                  <span>Analyze Leaf</span>
                </>
              )}
            </button>
            
            {selectedImage && !loading && (
              <button onClick={reset} className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-colors">
                <i className="fas fa-trash-can"></i>
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl flex items-start space-x-3">
              <i className="fas fa-triangle-exclamation mt-1"></i>
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {loading ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 animate-pulse space-y-6">
              <div className="h-8 bg-slate-100 rounded w-3/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-100 rounded"></div>
                <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                <div className="h-4 bg-slate-100 rounded w-4/6"></div>
              </div>
              <div className="h-40 bg-slate-100 rounded"></div>
            </div>
          ) : result ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{result.diseaseName}</h2>
                  <p className="text-emerald-600 font-semibold">{result.cropType} Plant</p>
                </div>
                <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                  result.severity === 'Low' ? 'bg-green-100 text-green-700' :
                  result.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                  result.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {result.severity} Severity
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl">
                <div className="flex-1">
                  <div className="text-sm text-slate-500 mb-1">Confidence Score</div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-lg font-bold text-emerald-600">{(result.confidence * 100).toFixed(1)}%</div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold border-b pb-2">Treatment Guide</h3>
                <ul className="space-y-3">
                  {result.treatment.map((step, i) => (
                    <li key={i} className="flex items-start space-x-3 text-slate-600">
                      <i className="fas fa-check-circle text-emerald-500 mt-1"></i>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold border-b pb-2 text-slate-700">Prevention Measures</h3>
                <div className="grid grid-cols-1 gap-3">
                  {result.prevention.map((item, i) => (
                    <div key={i} className="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-sm border border-emerald-100">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center space-x-2">
                <i className="fas fa-download"></i>
                <span>Download PDF Report</span>
              </button>
            </div>
          ) : (
            <div className="bg-slate-100 rounded-3xl p-12 text-center border border-dashed border-slate-300">
              <div className="text-slate-400 space-y-4">
                <i className="fas fa-microscope text-5xl"></i>
                <p>Result will appear here after analysis.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Diagnosis;
