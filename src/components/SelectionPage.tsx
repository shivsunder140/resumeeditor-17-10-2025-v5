import { Upload, Plus, CheckCircle, ArrowRight, Shield, TrendingUp, Target, Brain } from 'lucide-react';

interface SelectionPageProps {
  onImport: () => void;
  onStartFromScratch: () => void;
}

export function SelectionPage({ onImport, onStartFromScratch }: SelectionPageProps) {
  return (
    <div className="p-6 lg:p-8 w-full h-screen mx-auto bg-gradient-to-br from-slate-50 to-blue-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Smart Resume Studio</h1>
          <p className="text-lg text-slate-600">Create professional resumes with AI-powered optimization</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <div
            className="rounded-2xl p-8 border text-center hover:transform hover:scale-105 transition-all duration-300 cursor-pointer bg-white shadow-lg hover:shadow-xl"
            onClick={onImport}
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">Import Existing Resume</h2>
            <p className="text-lg mb-6 text-slate-600">
              Load your existing resume and enhance it with professional templates
            </p>
            <div className="space-y-3 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Upload PDF, DOCX, DOC, or TXT</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>AI content extraction and formatting</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Professional template application</span>
              </div>
            </div>
            <button className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto">
              Select Files <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div
            className="rounded-2xl p-8 border text-center hover:transform hover:scale-105 transition-all duration-300 cursor-pointer bg-white shadow-lg hover:shadow-xl"
            onClick={onStartFromScratch}
          >
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">Start from Scratch</h2>
            <p className="text-lg mb-6 text-slate-600">
              Create a new resume from scratch with AI guidance and professional templates
            </p>
            <div className="space-y-3 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>AI-powered content suggestions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Step-by-step guidance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Professional formatting</span>
              </div>
            </div>
            <button className="mt-6 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto">
              Create New Resume <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-16 max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8 text-slate-900">
            What You'll Get with Smart Resume Studio
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-white shadow-md">
              <Shield className="w-8 h-8 text-blue-500 mb-4" />
              <h4 className="font-semibold mb-2 text-slate-800">ATS Optimization</h4>
              <p className="text-sm text-slate-600">
                Beat applicant tracking systems with AI-powered formatting
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white shadow-md">
              <TrendingUp className="w-8 h-8 text-green-500 mb-4" />
              <h4 className="font-semibold mb-2 text-slate-800">Impact Enhancement</h4>
              <p className="text-sm text-slate-600">
                Transform job duties into quantifiable achievements
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white shadow-md">
              <Target className="w-8 h-8 text-orange-500 mb-4" />
              <h4 className="font-semibold mb-2 text-slate-800">Job Targeting</h4>
              <p className="text-sm text-slate-600">
                Create tailored resumes for specific opportunities
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white shadow-md">
              <Brain className="w-8 h-8 text-purple-500 mb-4" />
              <h4 className="font-semibold mb-2 text-slate-800">AI Copilot</h4>
              <p className="text-sm text-slate-600">
                Get intelligent suggestions and gap justification
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
