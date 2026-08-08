import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShieldCheck, MapPin, Phone, Mail } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Loans', path: '/#loans' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'About Us', path: '/#about' },
    { name: 'FAQs', path: '/#faqs' },
    { name: 'Contact', path: '/#contact' },
  ];

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
      {/* Top Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-500" /> NBFC-Registered Finance Company</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone size={14} /> 18002697572</span>
            <span className="flex items-center gap-1"><Mail size={14} /> support@bharatloan.com</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <img className="h-8 w-8 rounded-full object-cover" src="https://i.ibb.co/RGpbDfnX/bharatpe-logo.jpg" alt="Bharat Loan Logo" />
                <span className="text-xl font-bold tracking-tight text-black">BHARAT<span className="font-light">LOAN</span></span>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className="text-slate-600 hover:text-blue-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <a href="/#apply" className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2.5 rounded-md text-sm font-semibold transition-colors">
                Apply Now
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={handleNavClick}
                  className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-900 hover:bg-slate-50 rounded-md"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="/#apply"
                onClick={handleNavClick}
                className="block w-full text-center mt-4 bg-blue-900 text-white px-4 py-3 rounded-md text-base font-medium"
              >
                Apply Now
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <img className="h-10 w-10 rounded-full object-cover" src="https://i.ibb.co/RGpbDfnX/bharatpe-logo.jpg" alt="Bharat Loan Logo" />
                <span className="text-xl font-bold tracking-tight text-white">BHARAT<span className="font-light opacity-80">LOAN</span></span>
              </div>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                Bharat Loan is an NBFC-registered finance company committed to providing transparent, accessible, and quick financial solutions to empower individuals across India.
              </p>
              <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium">
                <ShieldCheck size={16} />
                <span>RBI Registered NBFC</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-white text-sm font-bold tracking-wider uppercase mb-4">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="/#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="/#loans" className="hover:text-white transition-colors">Loans</a></li>
                <li><a href="/#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="/#faqs" className="hover:text-white transition-colors">FAQs</a></li>
                <li><a href="/#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-sm font-bold tracking-wider uppercase mb-4">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Loan Agreement</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Key Facts Statement</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fair Practices Code</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Grievance Redressal</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-sm font-bold tracking-wider uppercase mb-4">Contact Us</h3>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="shrink-0 text-slate-500 mt-0.5" />
                  <span>Bussines complex hari nagar delhi</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="shrink-0 text-slate-500" />
                  <span>18002697572</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="shrink-0 text-slate-500" />
                  <span>support@bharatloan.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 mt-8">
            <div className="text-xs text-slate-500 space-y-4 text-justify">
              <p>
                <strong>Disclaimer:</strong> Bharat Loan operates as an NBFC-registered finance company. All loans are subject to credit appraisal and applicable company policies. 
                The interest rates, processing fees, and other charges are determined based on the applicant's credit profile and are subject to change.
              </p>
              <p>
                <strong>Important Information:</strong> Registration Number: [CIN/RBI Registration Placeholder]. 
                Interest Rate (APR): [Placeholder]% to [Placeholder]%. Processing Fee: [Placeholder]% to [Placeholder]%. 
                Tenure: [Placeholder] Days to [Placeholder] Months. Please read the Key Facts Statement (KFS) carefully before applying.
              </p>
              <p className="text-center mt-8 text-[10px] uppercase tracking-[2px]">
                &copy; {new Date().getFullYear()} Bharat Loan Finance. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
