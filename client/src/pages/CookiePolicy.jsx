import React from 'react';
import { Cookie as CookieIcon } from 'lucide-react';

const CookiePolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
           <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-6">
              <CookieIcon className="w-8 h-8 text-blue-500" />
           </div>
           <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
           <p className="text-gray-600 text-lg">Understanding how we use cookies</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-8">
            
            <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
                <p className="text-gray-600 leading-relaxed">
                    Cookies are small text files that are placed on your computer or mobile device by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">How We Use Cookies</h2>
                <ul className="list-disc pl-6 space-y-3 text-gray-600">
                    <li><strong>Essential Cookies:</strong> These are necessary for the website to function responsibly.</li>
                    <li><strong>Analytics Cookies:</strong> We use these to measure how you interact with our website to improve your experience.</li>
                    <li><strong>Functional Cookies:</strong> These allow the website to remember choices you make (such as your user name, language or the region you are in).</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Managing Cookies</h2>
                <p className="text-gray-600 leading-relaxed">
                    Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit www.aboutcookies.org or www.allaboutcookies.org.
                </p>
            </section>

        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
