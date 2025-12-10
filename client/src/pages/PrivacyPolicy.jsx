import React from 'react';
import { motion } from 'framer-motion';
import { Shield as ShieldIcon, Lock as LockIcon, Eye as EyeIcon, FileText as FileTextIcon } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
           <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6">
              <ShieldIcon className="w-8 h-8 text-blue-600" />
           </div>
           <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
           <p className="text-gray-600 text-lg">Last Updated: December 2025</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-10">
            
            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <EyeIcon className="w-6 h-6 text-gray-400" /> 1. Information We Collect
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                    We collect information to provide better services to all our users. This includes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li><strong>Personal Information:</strong> Name, email address, phone number, and professional details when you apply for a job or request services.</li>
                    <li><strong>Usage Data:</strong> Information about how you interact with our website, such as IP address, browser type, and pages visited.</li>
                    <li><strong>Cookies:</strong> Small data files stored on your device to improve site functionality.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <LockIcon className="w-6 h-6 text-gray-400" /> 2. How We Use Your Data
                </h2>
                <p className="text-gray-600 leading-relaxed">
                    We use the information we collect for the following purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
                    <li>To provide and maintain our Service.</li>
                    <li>To notify you about changes to our Service.</li>
                    <li>To allow you to participate in interactive features when you choose to do so.</li>
                    <li>To provide customer support and process job applications.</li>
                    <li>To gather analysis or valuable information so that we can improve our Service.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileTextIcon className="w-6 h-6 text-gray-400" /> 3. Data Protection
                </h2>
                <p className="text-gray-600 leading-relaxed">
                    Alanxa takes the security of your data seriously. We implement variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet is 100% secure.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Third-Party Disclosure</h2>
                <p className="text-gray-600 leading-relaxed">
                    We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Contact Us</h2>
                <p className="text-gray-600 leading-relaxed">
                    If there are any questions regarding this privacy policy, you may contact us at <a href="mailto:privacy@alanxa.com" className="text-blue-600 hover:underline">privacy@alanxa.com</a>.
                </p>
            </section>

        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
