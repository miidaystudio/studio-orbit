'use client';

import React, { useState } from 'react';
import { completeOnboardingAction } from '@/app/actions/onboarding';

// --- Tactical Brutalist Corner Crosshairs ---
function CornerCrosshairs() {
  return (
    <>
      <span className="absolute -top-1.5 -left-1.5 text-[11px] font-mono text-[#828892]/50 select-none pointer-events-none leading-none">+</span>
      <span className="absolute -top-1.5 -right-1.5 text-[11px] font-mono text-[#828892]/50 select-none pointer-events-none leading-none">+</span>
      <span className="absolute -bottom-1.5 -left-1.5 text-[11px] font-mono text-[#828892]/50 select-none pointer-events-none leading-none">+</span>
      <span className="absolute -bottom-1.5 -right-1.5 text-[11px] font-mono text-[#828892]/50 select-none pointer-events-none leading-none">+</span>
    </>
  );
}

export default function OnboardingWizardPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    companyName: 'miidayStudio',
    website: 'https://miidaystudio.online',
    projectTitle: 'Brand System & Client Portal',
    stagingUrl: 'https://miidaystudio.online',
    systemTag: '[DEV-SYSTEM-01]',
    description: 'Tactile design architectures, kinetic viewport telemetry, and bespoke design systems.',
    allocatedHours: 40,
    nextMilestone: 'Due Oct 15',
  });

  // Step 1 Validation
  const isStep1Valid = formData.companyName.trim().length > 0 && formData.website.trim().length > 0;
  // Step 2 Validation
  const isStep2Valid = formData.projectTitle.trim().length > 0 && formData.stagingUrl.trim().length > 0;
  // Step 3 Validation
  const isStep3Valid = formData.allocatedHours > 0 && formData.nextMilestone.trim().length > 0;

  const handleNextStep = () => {
    if (currentStep === 1 && isStep1Valid) {
      setCurrentStep(2);
    } else if (currentStep === 2 && isStep2Valid) {
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 2) setCurrentStep(1);
    else if (currentStep === 3) setCurrentStep(2);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentStep === 1 && isStep1Valid) {
        setCurrentStep(2);
      } else if (currentStep === 2 && isStep2Valid) {
        setCurrentStep(3);
      } else if (currentStep === 3 && isStep3Valid && !isSubmitting) {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isStep3Valid || isSubmitting) return;

    setIsSubmitting(true);

    const data = new FormData();
    data.append('companyName', formData.companyName);
    data.append('website', formData.website);
    data.append('projectTitle', formData.projectTitle);
    data.append('stagingUrl', formData.stagingUrl);
    data.append('systemTag', formData.systemTag);
    data.append('description', formData.description);
    data.append('allocatedHours', formData.allocatedHours.toString());
    data.append('nextMilestone', formData.nextMilestone);

    await completeOnboardingAction(data);
  };

  return (
    <div className="min-h-screen bg-[#08090A] text-[#FFFFFF] flex flex-col justify-center items-center p-6 selection:bg-[#CCFF00] selection:text-black font-mono">
      <div className="w-full max-w-2xl bg-[#111315] border border-[#22252A] rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden space-y-8 text-[#FFFFFF]">
        <CornerCrosshairs />

        {/* Subtle dot pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Header & Step Counter Bar */}
        <div className="relative z-10 space-y-4">
          <div className="flex justify-between items-center border-b border-[#22252A] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#08090A] border border-[#22252A] flex items-center justify-center p-1 shadow-sm">
                <img src="/favicon.jpg" alt="Logo" className="w-full h-full object-cover rounded-lg" />
              </div>
              <span className="text-xs font-bold tracking-tight text-[#FFFFFF] uppercase">
                StudioOrbit Setup
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className={`px-3 py-1 rounded-full border transition-all cursor-pointer font-bold ${
                  currentStep === 1
                    ? 'bg-[#CCFF00] text-black border-[#CCFF00] shadow-[0_0_10px_rgba(204,255,0,0.3)]'
                    : currentStep > 1
                    ? 'bg-[#16181B] text-[#CCFF00] border-[#22252A]'
                    : 'bg-[#08090A] text-[#828892] border-[#22252A]'
                }`}
              >
                Step 1 of 3
              </button>
              <button
                type="button"
                onClick={() => isStep1Valid && setCurrentStep(2)}
                disabled={!isStep1Valid}
                className={`px-3 py-1 rounded-full border transition-all font-bold ${
                  currentStep === 2
                    ? 'bg-[#CCFF00] text-black border-[#CCFF00] shadow-[0_0_10px_rgba(204,255,0,0.3)]'
                    : currentStep > 2
                    ? 'bg-[#16181B] text-[#CCFF00] border-[#22252A]'
                    : 'bg-[#08090A] text-[#828892] border-[#22252A]'
                } ${isStep1Valid ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              >
                Step 2 of 3
              </button>
              <button
                type="button"
                onClick={() => isStep1Valid && isStep2Valid && setCurrentStep(3)}
                disabled={!isStep1Valid || !isStep2Valid}
                className={`px-3 py-1 rounded-full border transition-all font-bold ${
                  currentStep === 3
                    ? 'bg-[#CCFF00] text-black border-[#CCFF00] shadow-[0_0_10px_rgba(204,255,0,0.3)]'
                    : 'bg-[#08090A] text-[#828892] border-[#22252A]'
                } ${isStep1Valid && isStep2Valid ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              >
                Step 3 of 3
              </button>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#CCFF00] font-bold">
              [SYS-INIT // ONBOARDING WIZARD]
            </span>
            <h1 className="text-3xl font-mono font-black uppercase text-[#FFFFFF] mt-1 tracking-tight">
              {currentStep === 1
                ? 'Brand & Studio Identity'
                : currentStep === 2
                ? 'Active Deliverable & Staging Sandbox'
                : 'Retainer Hours & Milestone Target'}
            </h1>
            <p className="text-xs text-[#828892] mt-1 font-mono">
              {currentStep === 1
                ? 'Set up your studio name and primary website domain.'
                : currentStep === 2
                ? 'Define your active client project, staging preview URL, and scope brief.'
                : 'Configure retainer budget hours and next milestone deadline.'}
            </p>
          </div>
        </div>

        {/* Wizard Content Container */}
        <div className="relative z-10 space-y-6" onKeyDown={handleKeyDown}>
          {/* STEP 1: Brand & Studio Identity */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-[#FFFFFF] font-mono uppercase tracking-wider text-[11px]">
                  Company / Brand Name <span className="text-[#CCFF00]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      companyName: name,
                    }));
                  }}
                  placeholder="e.g. Lumina Tech"
                  className="w-full bg-[#08090A] border border-[#22252A] rounded-xl p-3.5 text-xs font-mono text-[#FFFFFF] placeholder-[#828892] focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#FFFFFF] font-mono uppercase tracking-wider text-[11px]">
                  Official Website URL <span className="text-[#CCFF00]">*</span>
                </label>
                <input
                  type="text"
                  inputMode="url"
                  value={formData.website}
                  onChange={(e) => {
                    const site = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      website: site,
                      stagingUrl: (!prev.stagingUrl || prev.stagingUrl === prev.website) ? site : prev.stagingUrl,
                    }));
                  }}
                  placeholder="https://miidaystudio.online"
                  className="w-full bg-[#08090A] border border-[#22252A] rounded-xl p-3.5 text-xs font-mono text-[#FFFFFF] placeholder-[#828892] focus:outline-none focus:border-[#CCFF00]"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Active Deliverable & Staging Sandbox */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-[#FFFFFF] font-mono uppercase tracking-wider text-[11px]">
                  Deliverable Title <span className="text-[#CCFF00]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                  placeholder="e.g. Brand System & Client Portal"
                  className="w-full bg-[#08090A] border border-[#22252A] rounded-xl p-3.5 text-xs font-mono text-[#FFFFFF] placeholder-[#828892] focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#FFFFFF] font-mono uppercase tracking-wider text-[11px]">
                    Staging / Preview URL <span className="text-[#CCFF00]">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="url"
                    value={formData.stagingUrl}
                    onChange={(e) => setFormData({ ...formData, stagingUrl: e.target.value })}
                    placeholder="https://miidaystudio.online"
                    className="w-full bg-[#08090A] border border-[#22252A] rounded-xl p-3.5 text-xs font-mono text-[#FFFFFF] placeholder-[#828892] focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#FFFFFF] font-mono uppercase tracking-wider text-[11px]">
                    System Tag
                  </label>
                  <input
                    type="text"
                    value={formData.systemTag}
                    onChange={(e) => setFormData({ ...formData, systemTag: e.target.value })}
                    className="w-full bg-[#08090A] border border-[#22252A] rounded-xl p-3.5 text-xs font-mono text-[#FFFFFF] focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#FFFFFF] font-mono uppercase tracking-wider text-[11px]">
                  Scope Brief / Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe key deliverable scope..."
                  className="w-full bg-[#08090A] border border-[#22252A] rounded-xl p-3.5 text-xs font-mono text-[#FFFFFF] placeholder-[#828892] focus:outline-none focus:border-[#CCFF00] resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Retainer Hours & Milestone Target */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#FFFFFF] font-mono uppercase tracking-wider text-[11px]">
                    Allocated Retainer Hours <span className="text-[#CCFF00]">*</span>
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={500}
                    value={formData.allocatedHours}
                    onChange={(e) => setFormData({ ...formData, allocatedHours: Number(e.target.value) })}
                    className="w-full bg-[#08090A] border border-[#22252A] rounded-xl p-3.5 text-xs font-mono text-[#FFFFFF] focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#FFFFFF] font-mono uppercase tracking-wider text-[11px]">
                    Next Milestone Target <span className="text-[#CCFF00]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nextMilestone}
                    onChange={(e) => setFormData({ ...formData, nextMilestone: e.target.value })}
                    placeholder="e.g. Due Oct 15"
                    className="w-full bg-[#08090A] border border-[#22252A] rounded-xl p-3.5 text-xs font-mono text-[#FFFFFF] placeholder-[#828892] focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-[#08090A] border border-[#22252A] rounded-xl p-5 space-y-2 font-mono text-xs mt-4">
                <div className="flex justify-between border-b border-[#22252A] pb-2">
                  <span className="text-[#828892]">Company:</span>
                  <span className="font-bold text-[#FFFFFF]">{formData.companyName} ({formData.website})</span>
                </div>
                <div className="flex justify-between border-b border-[#22252A] pb-2">
                  <span className="text-[#828892]">Deliverable:</span>
                  <span className="font-bold text-[#FFFFFF]">{formData.projectTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#828892]">Retainer & Target:</span>
                  <span className="font-bold text-[#CCFF00]">{formData.allocatedHours} hrs • {formData.nextMilestone}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Footer Controls */}
          <div className="flex justify-between items-center pt-6 border-t border-[#22252A]">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-full border border-[#22252A] hover:bg-white/5 text-xs font-mono font-medium text-[#FFFFFF] transition cursor-pointer"
              >
                ← Back
              </button>
            ) : (
              <span />
            )}

            {currentStep === 1 && (
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!isStep1Valid}
                className="px-6 py-2.5 rounded-full bg-[#CCFF00] hover:bg-[#b8e600] text-black text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-[0_0_12px_rgba(204,255,0,0.3)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                CONTINUE TO PROJECT SETUP →
              </button>
            )}

            {currentStep === 2 && (
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!isStep2Valid}
                className="px-6 py-2.5 rounded-full bg-[#CCFF00] hover:bg-[#b8e600] text-black text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-[0_0_12px_rgba(204,255,0,0.3)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                SET RETAINER & MILESTONES →
              </button>
            )}

            {currentStep === 3 && (
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!isStep3Valid || isSubmitting}
                className="px-6 py-2.5 rounded-full bg-[#CCFF00] hover:bg-[#b8e600] text-black text-xs font-mono uppercase tracking-wider font-black transition-all shadow-[0_0_16px_rgba(204,255,0,0.4)] active:scale-95 disabled:opacity-40 flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>LAUNCHING COCKPIT...</span>
                  </>
                ) : (
                  <span>COMPLETE SETUP & LAUNCH COCKPIT →</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
