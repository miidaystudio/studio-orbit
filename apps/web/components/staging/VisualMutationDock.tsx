'use client';

import React, { useState, useEffect } from 'react';
import { VisualVariantItem, VisualMutation } from '@studio-orbit/types';

interface SelectedElementPayload {
  selector: string;
  tag: string;
  text: string;
  background: string;
  padding: string;
}

interface VisualMutationDockProps {
  projectId: string;
  variants: VisualVariantItem[];
  activeVariantId: string;
  onSelectVariant: (variantId: string) => void;
  onCreateVariant: (name: string) => void;
  onSaveVariantMutations: (variantId: string, mutations: VisualMutation[]) => void;
  selectedElement: SelectedElementPayload | null;
  onApplyMutationToIframe: (mutation: VisualMutation) => void;
  onResetIframe: () => void;
}

export default function VisualMutationDock({
  projectId,
  variants,
  activeVariantId,
  onSelectVariant,
  onCreateVariant,
  onSaveVariantMutations,
  selectedElement,
  onApplyMutationToIframe,
  onResetIframe,
}: VisualMutationDockProps) {
  const currentVariant = variants.find((v) => v.id === activeVariantId) || variants[0];
  const [mutations, setMutations] = useState<VisualMutation[]>(currentVariant?.mutations || []);

  const [overrideText, setOverrideText] = useState('');
  const [overrideBackground, setOverrideBackground] = useState('');
  const [overridePadding, setOverridePadding] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newVariantName, setNewVariantName] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  // Sync mutations whenever active variant changes
  useEffect(() => {
    if (currentVariant) {
      setMutations(currentVariant.mutations || []);
    }
  }, [currentVariant?.id]);

  // When an element is clicked in the iframe, populate the editor fields
  useEffect(() => {
    if (selectedElement) {
      const existing = mutations.find((m) => m.selector === selectedElement.selector);
      setOverrideText(existing?.newText ?? selectedElement.text);
      setOverrideBackground(existing?.newBackground ?? selectedElement.background);
      setOverridePadding(existing?.newPadding ?? selectedElement.padding);
    }
  }, [selectedElement]);

  const handleApply = () => {
    if (!selectedElement) return;

    const newMutation: VisualMutation = {
      selector: selectedElement.selector,
      originalText: selectedElement.text,
      newText: overrideText,
      originalBackground: selectedElement.background,
      newBackground: overrideBackground,
      originalPadding: selectedElement.padding,
      newPadding: overridePadding,
      appliedAt: new Date().toISOString(),
    };

    const updated = mutations.filter((m) => m.selector !== selectedElement.selector);
    updated.push(newMutation);
    setMutations(updated);

    onApplyMutationToIframe(newMutation);
  };

  const handleSaveToDatabase = async () => {
    if (!currentVariant) return;
    onSaveVariantMutations(currentVariant.id, mutations);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleCreateVariant = () => {
    if (!newVariantName.trim()) return;
    onCreateVariant(newVariantName.trim());
    setNewVariantName('');
    setIsCreatingNew(false);
  };

  return (
    <div className="w-full bg-[#111315] border border-[#22252A] rounded-2xl p-4 text-[#FFFFFF] shadow-2xl transition-all font-mono">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        {/* Top Control Bar: Variant Switcher & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#22252A]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] shadow-[0_0_8px_rgba(204,255,0,0.8)] animate-pulse" />
            <span className="font-mono font-bold text-sm tracking-wide text-[#FFFFFF] uppercase">
              ✦ [MUTATION_DOCK // LIVE DOM OVERRIDES]
            </span>
          </div>

          {/* Variant Switcher Pills */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[#828892] uppercase">Variant:</span>
            <div className="flex items-center gap-1 bg-[#08090A] border border-[#22252A] p-1 rounded-xl">
              {variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    onSelectVariant(v.id);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition uppercase font-bold ${
                    v.id === activeVariantId
                      ? 'bg-[#16181B] text-[#CCFF00] border border-[#22252A] shadow-[0_0_8px_rgba(204,255,0,0.2)]'
                      : 'text-[#828892] hover:text-[#FFFFFF] hover:bg-white/[0.04]'
                  }`}
                >
                  {v.name}
                  {v.mutations?.length > 0 && (
                    <span className="ml-1.5 px-1 py-0.2 rounded-full text-[9px] bg-[#22252A] text-[#CCFF00]">
                      {v.mutations.length}
                    </span>
                  )}
                </button>
              ))}

              {!isCreatingNew ? (
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(true)}
                  className="px-2 py-1 rounded-lg text-xs font-mono text-[#CCFF00] hover:bg-[#CCFF00]/10 transition font-bold"
                  title="Create New Variant"
                >
                  + ADD
                </button>
              ) : (
                <div className="flex items-center gap-1 pl-1">
                  <input
                    type="text"
                    value={newVariantName}
                    onChange={(e) => setNewVariantName(e.target.value)}
                    placeholder="Variant name..."
                    className="bg-[#111315] border border-[#22252A] rounded px-2 py-0.5 text-xs font-mono text-white focus:outline-none focus:border-[#CCFF00]"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleCreateVariant}
                    className="px-2 py-0.5 bg-[#CCFF00] text-black rounded text-[11px] font-mono font-bold"
                  >
                    OK
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreatingNew(false)}
                    className="text-[11px] text-[#828892] hover:text-white px-1"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleSaveToDatabase}
              className="px-3.5 py-1.5 bg-[#CCFF00] hover:bg-[#b8e600] text-black text-xs font-mono font-bold uppercase rounded-xl transition shadow-[0_0_12px_rgba(204,255,0,0.3)]"
            >
              {saveToast ? '✓ SAVED!' : 'SAVE VARIANT'}
            </button>
          </div>
        </div>

        {/* Selected Element Inline Mutation Controls */}
        {selectedElement ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#08090A] border border-[#22252A] p-3 rounded-xl animate-in fade-in">
            {/* Target Element Tag & Selector Badge */}
            <div className="md:col-span-3">
              <div className="text-[10px] font-mono uppercase text-[#828892] mb-1">
                Selected Element
              </div>
              <div className="font-mono text-xs text-[#CCFF00] font-bold truncate" title={selectedElement.selector}>
                &lt;{selectedElement.tag}&gt; {selectedElement.selector}
              </div>
            </div>

            {/* Override Text Input */}
            <div className="md:col-span-4">
              <div className="text-[10px] font-mono uppercase text-[#828892] mb-1">
                Live Text Content
              </div>
              <input
                type="text"
                value={overrideText}
                onChange={(e) => setOverrideText(e.target.value)}
                placeholder="Type new copy..."
                className="w-full bg-[#111315] border border-[#22252A] rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#CCFF00]"
              />
            </div>

            {/* Override Background & Padding */}
            <div className="md:col-span-3 flex items-center gap-2">
              <div className="flex-1">
                <div className="text-[10px] font-mono uppercase text-[#828892] mb-1">Background</div>
                <input
                  type="text"
                  value={overrideBackground}
                  onChange={(e) => setOverrideBackground(e.target.value)}
                  placeholder="e.g. #08090A"
                  className="w-full bg-[#111315] border border-[#22252A] rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#CCFF00]"
                />
              </div>
              <div className="w-24">
                <div className="text-[10px] font-mono uppercase text-[#828892] mb-1">Padding</div>
                <input
                  type="text"
                  value={overridePadding}
                  onChange={(e) => setOverridePadding(e.target.value)}
                  placeholder="16px"
                  className="w-full bg-[#111315] border border-[#22252A] rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#CCFF00]"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="md:col-span-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleApply}
                className="px-3 py-1.5 rounded-lg bg-[#CCFF00] hover:bg-[#b8e600] text-black text-xs font-mono font-bold uppercase transition shadow-[0_0_10px_rgba(204,255,0,0.3)]"
              >
                APPLY LIVE
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#08090A] border border-dashed border-[#22252A] p-3 rounded-xl text-center text-xs font-mono text-[#828892] flex items-center justify-center gap-2">
            <span className="text-[#CCFF00]">✦</span>
            <span>Click any headline, button, or container in the preview frame above to inspect and mutate in real-time.</span>
          </div>
        )}
      </div>
    </div>
  );
}
