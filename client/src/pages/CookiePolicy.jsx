import React from 'react';
import { Cookie as CookieIcon } from 'lucide-react';

const CookiePolicy = () => {
  return (
    <div className="bg-black min-h-screen pt-32 pb-20 font-sans text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
           <div className="inline-flex items-center justify-center p-3 bg-indigo-900/20 rounded-full mb-6 border border-indigo-500/20 ring-4 ring-indigo-500/10">
              <CookieIcon className="w-8 h-8 text-indigo-400" />
           </div>
           <h1 className="text-4xl font-bold text-white mb-4">Cookie Policy</h1>
           <p className="text-white text-lg">Understanding how we use cookies</p>
        </div>

        <div className="bg-[#0A0F1C] rounded-3xl shadow-2xl border border-gray-800 p-8 md:p-12 space-y-8">
            
            <section>
                <h2 className="text-xl font-bold text-white mb-4">What Are Cookies?</h2>
                <p className="text-white leading-relaxed text-base">
                    Cookies are small text files that are placed on your computer or mobile device by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-4">How We Use Cookies</h2>
                <ul className="list-disc pl-6 space-y-3 text-white text-base">
                    <li><strong className="text-white">Essential Cookies:</strong> These are necessary for the website to function responsibly.</li>
                    <li><strong className="text-white">Analytics Cookies:</strong> We use these to measure how you interact with our website to improve your experience.</li>
                    <li><strong className="text-white">Functional Cookies:</strong> These allow the website to remember choices you make (such as your user name, language or the region you are in).</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-4">Managing Cookies</h2>
                <p className="text-white leading-relaxed text-base">
                    Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit www.aboutcookies.org or www.allaboutcookies.org.
                </p>
            </section>

        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
