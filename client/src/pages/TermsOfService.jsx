import React from 'react';
import { Scale as ScaleIcon, AlertCircle as AlertIcon } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
           <div className="inline-flex items-center justify-center p-3 bg-gray-200 rounded-full mb-6">
              <ScaleIcon className="w-8 h-8 text-gray-700" />
           </div>
           <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
           <p className="text-gray-600 text-lg">Last Updated: December 2025</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-10">
            
            <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-600 leading-relaxed">
                    By accessing and using the Alanxa website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">2. Service Description</h2>
                <p className="text-gray-600 leading-relaxed">
                    Alanxa provides AI training data services, including but not limited to data annotation, transcription, and localization. We reserve the right to modify or discontinue the service with or without notice to you.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">3. Intellectual Property</h2>
                <p className="text-gray-600 leading-relaxed">
                    All content included on this site, such as text, graphics, logos, images, and software, is the property of Alanxa or its content suppliers and protected by international copyright laws.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">4. Limitation of Liability</h2>
                <p className="text-gray-600 leading-relaxed">
                    In no event shall Alanxa, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">5. Governing Law</h2>
                <p className="text-gray-600 leading-relaxed">
                    These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                </p>
            </section>

        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
