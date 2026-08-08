import React from 'react';
import { ShieldCheck, ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Verification({ amount }: { amount: number }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 mb-6">
          <ShieldCheck className="h-8 w-8 text-blue-900" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Verification Step</h2>
        <p className="text-slate-600 mb-8">
          You are proceeding with the verification for your selected loan amount of <strong className="text-slate-900">₹{amount.toLocaleString('en-IN')}</strong>.
        </p>

        <div className="bg-slate-50 rounded-lg p-5 mb-8 border border-slate-100 text-left">
          <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Clock size={16} className="text-blue-600" /> Next Steps
          </h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span>Identity Verification (KYC)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span>Bank Account Validation</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span>Final Approval & E-Sign</span>
            </li>
          </ul>
        </div>

        <div className="text-sm text-slate-500 mb-8 p-4 bg-amber-50 text-amber-800 rounded-md border border-amber-200">
          <strong>Note:</strong> This verification functionality is currently blank as it will be developed separately. No actual verification is performed in this demo.
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full flex justify-center items-center gap-2 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 px-4 py-2.5 rounded-md text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Return to Home
        </button>
      </div>
    </div>
  );
}
