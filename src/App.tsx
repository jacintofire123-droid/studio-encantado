import React, { useState, useEffect } from 'react';
import { Character, MessageOccasion, OrderData, PromoFlowStep } from './types';
import { Header } from './components/Header';
import { UrgencyBanner } from './components/PromoFlow/UrgencyBanner';
import { PromoHero } from './components/PromoFlow/PromoHero';
import { CharacterSelector } from './components/PromoFlow/CharacterSelector';
import { ChildNameStep } from './components/PromoFlow/ChildNameStep';
import { GeneratingStep } from './components/PromoFlow/GeneratingStep';
import { VideoPlayerStep } from './components/PromoFlow/VideoPlayerStep';
import { OfferStep } from './components/PromoFlow/OfferStep';
import { CheckoutModal } from './components/PromoFlow/CheckoutModal';
import { VideoShowcase } from './components/VideoShowcase';
import { HowItWorks } from './components/HowItWorks';
import { ImpactSection } from './components/ImpactSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { PricingSection } from './components/PricingSection';
import { FAQSection } from './components/FAQSection';
import { TeamSection } from './components/TeamSection';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/Admin/AdminPanel';
import { recordLeadVideoGenerated } from './services/adminStore';

export default function App() {
  const [currentView, setCurrentView] = useState<'promocao' | 'institucional' | 'admin'>('promocao');
  const [promoStep, setPromoStep] = useState<PromoFlowStep>('escolha');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [childName, setChildName] = useState('');
  const [occasion, setOccasion] = useState<MessageOccasion>('elogio');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerData, setCustomerData] = useState({
    email: '',
    whatsapp: '',
    birthYear: ''
  });
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isFromN8N, setIsFromN8N] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderData | null>(null);

  // Sync with browser URL / hash and secret keyboard shortcut
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('admin')) {
        setCurrentView('admin');
      } else if (
        hash.includes('como-funciona') ||
        hash.includes('exemplos') ||
        hash.includes('depoimentos') ||
        hash.includes('faq') ||
        hash.includes('preco')
      ) {
        setCurrentView('institucional');
        const element = document.querySelector(hash);
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret key combination: Ctrl+Shift+A or Cmd+Shift+A to toggle admin panel
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setCurrentView((prev) => (prev === 'admin' ? 'promocao' : 'admin'));
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setGeneratedVideoUrl(null);
    setIsFromN8N(false);
    setPromoStep('nome');
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  const handleNameSubmitted = () => {
    setCustomerData((prev) => ({ ...prev, whatsapp: customerPhone }));
    setPromoStep('gerando');
  };

  const handleGenerationCompleted = (videoUrl: string, fromN8n: boolean) => {
    setGeneratedVideoUrl(videoUrl);
    setIsFromN8N(fromN8n);
    setPromoStep('pronto');
    // Automatically capture lead when video is generated
    if (selectedCharacter && childName.trim()) {
      recordLeadVideoGenerated(childName, selectedCharacter, {
        videoUrl,
        n8nStatus: fromN8n ? 'success' : 'mock',
        parentWhatsApp: customerPhone
      });
    }
  };

  const handleProceedToOffer = () => {
    setPromoStep('oferta');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleInitiateCheckout = (data: { email: string; whatsapp: string; birthYear: string }) => {
    setCustomerData(data);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (order: OrderData) => {
    setCompletedOrder(order);
  };

  const handleNavigate = (view: 'promocao' | 'institucional' | 'admin', sectionId?: string) => {
    setCurrentView(view);
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStartCreating = () => {
    setCurrentView('promocao');
    setPromoStep('escolha');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPlan = (planId: '1-video' | '2-videos') => {
    setCurrentView('promocao');
    setPromoStep('escolha');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in Admin Panel view, render the AdminPanel dashboard
  if (currentView === 'admin') {
    return (
      <AdminPanel
        onBackToSite={() => {
          setCurrentView('promocao');
          window.location.hash = '';
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#120c24] text-[#f4f2fb] flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Urgency Bar */}
      <UrgencyBanner />

      {/* Top Minimal Header */}
      <Header onNavigate={handleNavigate} />

      {/* Main Flow Content */}
      <main className="flex-1">
        {currentView === 'promocao' ? (
          <div>
            {/* Promo Hero only visible on character selection */}
            {promoStep === 'escolha' && <PromoHero />}

            {/* Step 1: Character Selector */}
            {promoStep === 'escolha' && (
              <CharacterSelector
                onSelectCharacter={handleSelectCharacter}
                selectedCharacter={selectedCharacter}
              />
            )}

            {/* Step 2: Child's Name Input & Occasion */}
            {promoStep === 'nome' && selectedCharacter && (
              <ChildNameStep
                character={selectedCharacter}
                childName={childName}
                occasion={occasion}
                customerPhone={customerPhone}
                onNameChange={setChildName}
                onOccasionChange={setOccasion}
                onPhoneChange={setCustomerPhone}
                onBack={() => setPromoStep('escolha')}
                onSubmit={handleNameSubmitted}
              />
            )}

            {/* Step 3: Magic Generation Screen */}
            {promoStep === 'gerando' && selectedCharacter && (
              <GeneratingStep
                character={selectedCharacter}
                childName={childName}
                occasion={occasion}
                customerPhone={customerPhone}
                onComplete={handleGenerationCompleted}
              />
            )}

            {/* Step 4: Video Player & Audio Preview */}
            {(promoStep === 'pronto' || promoStep === 'assistindo') && selectedCharacter && (
              <VideoPlayerStep
                character={selectedCharacter}
                childName={childName}
                videoUrl={generatedVideoUrl || undefined}
                isFromN8N={isFromN8N}
                onProceedToOffer={handleProceedToOffer}
              />
            )}

            {/* Step 5: Launch Offer & Checkout Trigger */}
            {promoStep === 'oferta' && selectedCharacter && (
              <OfferStep
                character={selectedCharacter}
                childName={childName}
                initialPhone={customerPhone}
                onInitiateCheckout={handleInitiateCheckout}
              />
            )}

            {/* Secondary Showcase Sections below the promo to reassure parents */}
            <div className="border-t border-white/5 mt-16">
              <HowItWorks onStartCreating={handleStartCreating} />
              <VideoShowcase onStartCreating={handleStartCreating} />
              <FAQSection />
            </div>
          </div>
        ) : (
          /* Institutional Showcase Page View */
          <div>
            <PromoHero />
            <VideoShowcase onStartCreating={handleStartCreating} />
            <HowItWorks onStartCreating={handleStartCreating} />
            <ImpactSection />
            <TestimonialsSection onStartCreating={handleStartCreating} />
            <PricingSection onSelectPlan={handleSelectPlan} />
            <FAQSection />
            <TeamSection />
          </div>
        )}
      </main>

      {/* Checkout Modal with Pix & Credit Card Simulator */}
      {selectedCharacter && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          character={selectedCharacter}
          childName={childName}
          occasion={occasion}
          customerData={customerData}
          generatedVideoUrl={generatedVideoUrl || undefined}
          onOrderCompleted={handleOrderCompleted}
        />
      )}

      {/* Footer */}
      <Footer onOpenAdmin={() => setCurrentView('admin')} />
    </div>
  );
}
