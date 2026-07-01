import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/images/planning_poker_white_p_logo_1782837649464.jpg';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0A0A0B] text-zinc-300 min-h-screen flex flex-col items-center py-12 px-6 font-sans">
      <div className="w-full max-w-3xl bg-[#0E0E10] border border-zinc-800 p-8 md:p-12 rounded-2xl shadow-2xl relative">
        <button
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 text-zinc-500 hover:text-white transition-colors"
          title="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col items-center mb-10 mt-8 md:mt-0">
          <img 
            src={logoImage} 
            alt="Planning Poker Logo" 
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-xl object-cover shadow-lg border border-zinc-700/50 mb-4"
          />
          <h1 className="text-3xl font-medium tracking-tight text-white text-center">Terms of Use</h1>
          <p className="text-zinc-500 mt-2 text-sm">Last updated: {new Date().toLocaleDateString('en-US')}</p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-zinc-400">
          <section>
            <h2 className="text-lg font-medium text-white mb-2">1. Acceptance of Terms</h2>
            <p>By using Planning Poker, you agree to these Terms of Use. Currently, the platform is provided 100% free of charge, with no registration or account creation required. By accessing the service, you agree to comply with all applicable local and international laws.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-2">2. Open Source Nature and Licensing</h2>
            <p>Planning Poker is currently provided as open-source software. However, the maintainers reserve the right, at any time and at their sole discretion, to alter the project's licensing model, close the source code for future versions, or transition to a commercial and proprietary model, without prior notice to current users.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-2">3. Free Usage and Advertising</h2>
            <p>The service is offered for free and currently does not display advertisements. However, we reserve the right to introduce advertisements, promotional banners, or sponsored content on the platform in the future to support maintenance, infrastructure, and development costs, without this constituting a breach of this agreement.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-2">4. Data Privacy and International Compliance (GDPR)</h2>
            <p>We are committed to data minimization and user privacy. We do not require user registration, and session data is transient and temporarily processed in-memory or stored locally. We adhere to international data protection principles, including those set forth by the European Union's General Data Protection Regulation (GDPR). We do not track users or sell personal data. Any future changes involving data collection will be strictly compliant with GDPR and other relevant international data privacy laws.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-2">5. Room Lifecycle and Expiration</h2>
            <p>To ensure optimal performance and resource management, each created room has a strict lifetime limit. A room and all its associated data will be automatically and permanently deleted 24 hours after its creation. Additionally, if all users leave a room, it will be immediately deleted. We do not store historical room data after deletion.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-2">6. Modifications to the Service</h2>
            <p>We may modify, suspend, or discontinue any aspect of the service at any time, including the availability of any feature. We may also impose limits on certain features or restrict your access to parts or all of the service without prior notice or liability.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-2">7. Disclaimer of Warranties</h2>
            <p>The service is provided on an "as-is" and "as available" basis. We do not guarantee that the platform will be uninterrupted, error-free, or entirely secure. Your use of the platform is at your own sole risk. We expressly disclaim any warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
          </section>
          
          <section>
            <h2 className="text-lg font-medium text-white mb-2">8. Changes to the Terms</h2>
            <p>These terms may be updated or modified at any time. Your continued use of the service after any changes constitutes your unreserved acceptance of the new Terms of Use.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
