import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import { proseStyles } from '../styles/proseStyles';
import { useScrollOnRouteChange } from '../hooks/useScrollOnRouteChange';
import TrustBadges from '../components/TrustBadges';

const PrivacyPolicy: React.FC = () => {
  useScrollOnRouteChange('/privacy-policy');

  return (
    <>
    <style>{proseStyles}</style>
    <div className="bg-slate-950 text-white font-sans animate-content-fade-in">
      <ParticleBackground />
      <Header />
      
      <main id="top" className="relative z-10 pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white text-center mb-8">
              Privacy <span className="text-blue-400">Policy</span>
            </h1>
            <div className="prose-custom bg-slate-900/50 border border-slate-800 rounded-lg p-6 md:p-10 leading-relaxed">
              <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

              <h2>1. Introduction</h2>
              <p>Welcome to Prevaledge ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services, including our AI Toolkit.</p>

              <h2>2. Information We Collect</h2>
              <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
              <ul>
                <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, organization, email address, and telephone number, that you voluntarily give to us when you fill out our contact form.</li>
                <li><strong>Usage Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
                <li><strong>AI Tool Inputs:</strong> Data you provide when using our free AI tools, such as business ideas, website URLs, and marketing copy details. This information is processed in real-time to provide the tool's functionality and is not stored, saved, or linked to your personal data.</li>
              </ul>
              
              <h2>3. How We Use Your Information</h2>
              <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
              <ul>
                  <li>Respond to your comments, inquiries, and questions and provide customer service.</li>
                  <li>Improve our website, products, and services.</li>
                  <li>Monitor and analyze trends, usage, and activities in connection with our Site.</li>
                  <li>Compile anonymous statistical data and analysis for use internally. Our AI tool usage statistics (e.g., "Strategy Generator was used 10 times") are aggregated and anonymous.</li>
              </ul>

              <h2>4. Information Sharing and Disclosure</h2>
              <p>We do not share, sell, rent, or trade your personal information with third parties for their commercial purposes.</p>
              
              <h2>5. Data Security</h2>
              <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>

              <h2>6. Your Rights and Choices</h2>
              <p>You have the right to request access to the personal data we hold about you and to ask that your personal data be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.</p>

              <h2>7. Third-Party Services</h2>
              <p>Our website uses Google Analytics to help us understand how our customers use the Site. You can read more about how Google uses your Personal Information here: <a href="https://www.google.com/intl/en/policies/privacy/" target="_blank" rel="noopener noreferrer">https://www.google.com/intl/en/policies/privacy/</a>. You can also opt-out of Google Analytics here: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">https://tools.google.com/dlpage/gaoptout</a>.</p>

              <h2>8. Changes to This Privacy Policy</h2>
              <p>We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

              <h2>9. Contact Us</h2>
              <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
              <p>
                Prevaledge<br />
                C 1 To 26 Vardhman Grandeur, Andheri West<br />
                Mumbai, India 400058<br />
                Email: info@prevaledge.com
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <TrustBadges />
    </div>
    </>
  );
};

export default PrivacyPolicy;
