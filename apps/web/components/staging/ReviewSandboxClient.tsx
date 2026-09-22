'use client';

import React, { useState, useRef, useEffect } from 'react';
import DeviceToolbar, { DEVICE_CONFIGS, CreativeOsMode } from '@/components/staging/DeviceToolbar';
import PinDetailDrawer from '@/components/staging/PinDetailDrawer';
import VisualMutationDock from '@/components/staging/VisualMutationDock';
import BezierCurveEditor from '@/components/staging/BezierCurveEditor';
import HandoffVaultView from '@/components/staging/HandoffVaultView';
import { DevicePreset, StagingPin } from '@/types/staging';
import {
  VisualVariantItem,
  VisualMutation,
  MotionPresetItem,
  BezierPoints,
  HandoffVaultItem,
} from '@studio-orbit/types';
import { createQaPinAction, QaPinItem } from '@/app/actions/deliverables';
import {
  getOrCreateProjectAction,
  saveVisualVariantAction,
  createVisualVariantAction,
  saveMotionPresetAction,
} from '@/app/actions/creativeOs';

export interface ReviewSandboxClientProps {
  deliverable: {
    id: string;
    title: string;
    systemTag: string;
    description: string | null;
    stagingUrl: string;
    companyName: string;
  };
  initialPins: QaPinItem[];
  initialTab?: string;
}

export default function ReviewSandboxClient({
  deliverable,
  initialPins,
  initialTab,
}: ReviewSandboxClientProps) {
  const [device, setDevice] = useState<DevicePreset>('desktop');
  const [stagingUrl, setStagingUrl] = useState(deliverable.stagingUrl);
  const [zoom, setZoom] = useState(1.0);
  const [activePinId, setActivePinId] = useState<string | null>(null);
  const [iframeError, setIframeError] = useState(false);
  const [proxyKey, setProxyKey] = useState(0);

  // Creative OS 3-Mode State
  const initialMode: CreativeOsMode =
    initialTab === 'motion' ? 'motion' : initialTab === 'vault' ? 'handoff' : 'mutations';
  const [currentMode, setCurrentMode] = useState<CreativeOsMode>(initialMode);

  // Creative Engineering Data State
  const [projectId, setProjectId] = useState<string>('');
  const [variants, setVariants] = useState<VisualVariantItem[]>([]);
  const [activeVariantId, setActiveVariantId] = useState<string>('');
  const [presets, setPresets] = useState<MotionPresetItem[]>([]);
  const [vault, setVault] = useState<HandoffVaultItem | null>(null);

  // Selected DOM element telemetry from iframe
  const [selectedElement, setSelectedElement] = useState<{
    selector: string;
    tag: string;
    text: string;
    background: string;
    padding: string;
  } | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeContainerRef = useRef<HTMLDivElement>(null);

  // Load or initialize Project records from PostgreSQL
  useEffect(() => {
    let isMounted = true;
    getOrCreateProjectAction(stagingUrl, deliverable.title).then((res) => {
      if (!isMounted) return;
      setProjectId(res.projectId);
      setVariants(res.variants);
      if (res.variants.length > 0) {
        const active = res.variants.find((v) => v.isActive) || res.variants[0];
        setActiveVariantId(active.id);
      }
      setPresets(res.presets);
      setVault(res.vault);
    });
    return () => {
      isMounted = false;
    };
  }, [stagingUrl, deliverable.title]);

  // Reset iframe error when stagingUrl changes
  useEffect(() => {
    setIframeError(false);
  }, [stagingUrl]);

  const proxiedUrl = stagingUrl
    ? `/api/proxy?url=${encodeURIComponent(stagingUrl)}&_k=${proxyKey}`
    : '';

  const handleRetryProxy = () => {
    setIframeError(false);
    setProxyKey((prev) => prev + 1);
  };

  const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    try {
      const iframe = e.currentTarget;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        const title = doc.title || '';
        const bodyText = doc.body?.innerText || '';
        if (
          title.toLowerCase().includes('error') ||
          bodyText.includes('Proxy Connection Error') ||
          bodyText.includes('Failed to load staging preview')
        ) {
          setIframeError(true);
        }
      }
    } catch {
      // Cross-origin host loaded without direct access
    }

    // Inform harness about active inspect mode
    sendIframeMessage({
      type: 'ORBIT_SET_INSPECT',
      enabled: currentMode === 'mutations',
    });
  };

  // Cross-frame message sender
  const sendIframeMessage = (msg: any) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(msg, '*');
    }
  };

  // Listen for messages from injected iframe harness
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'ORBIT_ELEMENT_SELECTED') {
        setSelectedElement({
          selector: data.selector,
          tag: data.tag,
          text: data.text,
          background: data.background,
          padding: data.padding,
        });
      }

      if (data.type === 'ORBIT_HARNESS_READY') {
        sendIframeMessage({
          type: 'ORBIT_SET_INSPECT',
          enabled: currentMode === 'mutations',
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentMode]);

  // Sync inspect mode to iframe when mode changes
  useEffect(() => {
    sendIframeMessage({
      type: 'ORBIT_SET_INSPECT',
      enabled: currentMode === 'mutations',
    });
  }, [currentMode]);

  // QA Pins state
  const mappedInitialPins: StagingPin[] = initialPins.map((p, idx) => ({
    id: p.id,
    xPercent: p.xPercent,
    yPercent: p.yPercent,
    status: p.status === 'RESOLVED' ? 'RESOLVED' : 'OPEN',
    device: 'desktop',
    viewportWidth: 1440,
    viewportHeight: 900,
    author: `${p.authorName} (${deliverable.companyName})`,
    comment: p.comment || p.title,
    createdAt: new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    scopeType: 'IN_SCOPE',
    pinCategory: (p.pinType as any) || 'BUG',
    selectorPath: `div.sandbox-frame > div:nth-of-type(${idx + 1})`,
    domSnippet: p.comment?.slice(0, 40) || p.title,
  }));

  const [pins, setPins] = useState<StagingPin[]>(mappedInitialPins);
  const [draftPin, setDraftPin] = useState<{ xPercent: number; yPercent: number } | null>(null);
  const [draftComment, setDraftComment] = useState('');

  const currentDeviceConfig = DEVICE_CONFIGS[device];

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only drop pins when not selecting DOM elements for mutations
    if (currentMode === 'mutations') return;
    if (!iframeContainerRef.current) return;
    const rect = iframeContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const xPercent = Number(((clickX / rect.width) * 100).toFixed(1));
    const yPercent = Number(((clickY / rect.height) * 100).toFixed(1));

    setActivePinId(null);
    setDraftPin({ xPercent, yPercent });
    setDraftComment('');
  };

  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftPin || !draftComment.trim()) return;

    const commentText = draftComment.trim();
    const tempId = `pin-${Date.now()}`;
    const newPin: StagingPin = {
      id: tempId,
      xPercent: draftPin.xPercent,
      yPercent: draftPin.yPercent,
      status: 'OPEN',
      device,
      viewportWidth: currentDeviceConfig.width,
      viewportHeight: currentDeviceConfig.height,
      author: `Reviewer (${deliverable.companyName})`,
      comment: commentText,
      createdAt: 'Just now',
      scopeType: 'IN_SCOPE',
      pinCategory: 'BUG',
      selectorPath: `div.sandbox-frame`,
      domSnippet: commentText.slice(0, 30),
    };

    setPins((prev) => [...prev, newPin]);
    setDraftPin(null);
    setDraftComment('');

    try {
      const res = await createQaPinAction({
        deliverableId: deliverable.id,
        xPercent: draftPin.xPercent,
        yPercent: draftPin.yPercent,
        title: commentText.slice(0, 50),
        comment: commentText,
        pinType: 'BUG',
      });
      if (res && res.success && res.pin) {
        setPins((prev) => prev.map((p) => (p.id === tempId ? { ...p, id: res.pin.id } : p)));
      }
    } catch (err) {
      console.error('Failed to save QA pin to PostgreSQL:', err);
    }
  };

  // Variant Switcher Handler
  const handleSelectVariant = (variantId: string) => {
    setActiveVariantId(variantId);
    const target = variants.find((v) => v.id === variantId);
    if (!target) return;

    if (target.name.toLowerCase().includes('base')) {
      sendIframeMessage({ type: 'ORBIT_RESET_MUTATIONS' });
    } else {
      sendIframeMessage({ type: 'ORBIT_RESET_MUTATIONS' });
      target.mutations.forEach((m) => {
        sendIframeMessage({
          type: 'ORBIT_APPLY_MUTATION',
          selector: m.selector,
          newText: m.newText,
          newBackground: m.newBackground,
          newPadding: m.newPadding,
        });
      });
    }
  };

  const handleApplyMutation = (mutation: VisualMutation) => {
    sendIframeMessage({
      type: 'ORBIT_APPLY_MUTATION',
      selector: mutation.selector,
      newText: mutation.newText,
      newBackground: mutation.newBackground,
      newPadding: mutation.newPadding,
    });
  };

  const handleSaveVariantMutations = async (variantId: string, mutationsList: VisualMutation[]) => {
    if (!projectId) return;
    await saveVisualVariantAction(projectId, variantId, mutationsList);
    setVariants((prev) =>
      prev.map((v) => (v.id === variantId ? { ...v, mutations: mutationsList } : v))
    );
  };

  const handleCreateVariant = async (name: string) => {
    if (!projectId) return;
    const res = await createVisualVariantAction(projectId, name);
    if (res.success && res.variant) {
      setVariants((prev) => [...prev, res.variant!]);
      setActiveVariantId(res.variant.id);
    }
  };

  const handleTestMotion = (bezierPoints: BezierPoints, durationMs: number, delayMs: number) => {
    sendIframeMessage({
      type: 'ORBIT_TEST_MOTION',
      selector: selectedElement?.selector || '',
      bezierPoints,
      durationMs,
      delayMs,
    });
  };

  const handleSavePreset = async (presetData: {
    selector: string;
    curveName: string;
    bezierPoints: BezierPoints;
    durationMs: number;
    delayMs: number;
  }) => {
    if (!projectId) return;
    const res = await saveMotionPresetAction(
      projectId,
      presetData.selector,
      presetData.curveName,
      presetData.bezierPoints,
      presetData.durationMs,
      presetData.delayMs
    );
    if (res.success && res.preset) {
      setPresets((prev) => [res.preset!, ...prev]);
    }
  };

  const openPinsCount = pins.filter((p) => p.status === 'OPEN').length;
  const activePin = pins.find((p) => p.id === activePinId);

  return (
    <div className="flex flex-col min-h-screen bg-[#08090A] text-[#FFFFFF] select-none overflow-x-hidden font-mono">
      {/* Viewport Header: Segmented 3-Mode Tab Pill & Device Controls */}
      <DeviceToolbar
        currentDevice={device}
        onDeviceChange={setDevice}
        stagingUrl={stagingUrl}
        onStagingUrlChange={setStagingUrl}
        currentZoom={zoom}
        onZoomChange={setZoom}
        openPinsCount={openPinsCount}
        currentMode={currentMode}
        onModeChange={setCurrentMode}
      />

      {/* VIEWPORT MODE 3: Executive Client Handoff Vault */}
      {currentMode === 'handoff' ? (
        <HandoffVaultView
          projectId={projectId || deliverable.id}
          stagingUrl={stagingUrl}
          initialVault={vault}
        />
      ) : (
        /* VIEWPORT MODES 1 & 2: Interactive Staging Canvas */
        <div className="flex-1 flex flex-col items-center justify-start p-4 lg:p-6 overflow-auto">
          {/* Viewport Card Container */}
          <div
            style={{
              width: currentDeviceConfig.width * zoom,
              height: currentDeviceConfig.height * zoom,
              transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="relative bg-[#111315] rounded-2xl shadow-2xl border border-[#22252A] overflow-hidden flex flex-col"
          >
            {/* Viewport Top Bar */}
            <div className="h-7 bg-[#08090A] border-b border-[#22252A] px-3 flex items-center justify-between text-xs text-[#828892]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#22252A]" />
                <span className="w-2 h-2 rounded-full bg-[#22252A]" />
                <span className="w-2 h-2 rounded-full bg-[#22252A]" />
                <span className="ml-2 font-mono text-[10px] text-[#FFFFFF]">
                  {deliverable.title} &bull; {currentDeviceConfig.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {currentMode === 'mutations' && (
                  <span className="text-[10px] font-mono text-[#CCFF00] bg-[#CCFF00]/10 px-2 py-0.5 rounded-full border border-[#CCFF00]/20 font-bold">
                    ✦ Visual Overrides Active
                  </span>
                )}
                {currentMode === 'motion' && (
                  <span className="text-[10px] font-mono text-[#CCFF00] bg-[#CCFF00]/10 px-2 py-0.5 rounded-full border border-[#CCFF00]/20 font-bold">
                    ∿ Kinetic Motion Inspector Docked
                  </span>
                )}
              </div>
            </div>

            {/* Interactive Canvas Body */}
            <div
              ref={iframeContainerRef}
              onClick={handleContainerClick}
              className="relative flex-1 w-full h-full overflow-hidden bg-[#08090A]"
            >
              {/* QA Pin Overlay Markers */}
              <div className="absolute inset-0 pointer-events-none z-20">
                {pins.map((pin, i) => (
                  <button
                    key={pin.id}
                    type="button"
                    style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePinId(pin.id);
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-black transition shadow-lg ${
                      pin.status === 'RESOLVED'
                        ? 'bg-[#16181B] text-[#828892] border border-[#22252A]'
                        : activePinId === pin.id
                        ? 'bg-[#CCFF00] text-black scale-125 ring-4 ring-[#CCFF00]/40 shadow-[0_0_16px_rgba(204,255,0,0.8)]'
                        : 'bg-[#CCFF00] text-black hover:scale-110 shadow-[0_0_10px_rgba(204,255,0,0.5)]'
                    }`}
                  >
                    #{i + 1}
                  </button>
                ))}

                {/* Draft Pin Composer */}
                {draftPin && (
                  <div
                    style={{ left: `${draftPin.xPercent}%`, top: `${draftPin.yPercent}%` }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-40 w-80 bg-[#111315] border border-[#CCFF00] rounded-2xl p-4 shadow-2xl text-white pointer-events-auto"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-mono uppercase text-[#CCFF00] font-bold">
                        New QA Pin ({draftPin.xPercent}%, {draftPin.yPercent}%)
                      </span>
                      <button onClick={() => setDraftPin(null)} className="text-neutral-400 hover:text-white text-xs">
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleSavePin} className="space-y-3">
                      <textarea
                        rows={2}
                        required
                        autoFocus
                        value={draftComment}
                        onChange={(e) => setDraftComment(e.target.value)}
                        placeholder="Describe visual defect or feedback..."
                        className="w-full p-2.5 bg-[#0D1117] border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-[#C85A32] resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setDraftPin(null)}
                          className="px-3 py-1 border border-white/20 text-neutral-400 text-xs rounded-lg hover:bg-white/10"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3.5 py-1 bg-[#C85A32] hover:bg-[#d9673d] text-white text-xs font-semibold rounded-lg shadow-sm"
                        >
                          Save Pin
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* Dynamic Viewport Iframe */}
              <div className="w-full h-full relative">
                {!iframeError && proxiedUrl ? (
                  <iframe
                    ref={iframeRef}
                    key={proxyKey}
                    src={proxiedUrl}
                    title={deliverable.title}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    onLoad={handleIframeLoad}
                    onError={() => setIframeError(true)}
                    className={`w-full h-full border-none ${
                      currentMode === 'mutations' ? 'pointer-events-auto' : 'pointer-events-auto'
                    }`}
                  />
                ) : null}

                {/* Host Error Fallback Overlay */}
                {iframeError && (
                  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-8 text-center bg-[#111315] border border-[#22252A] text-[#FFFFFF]">
                    <div className="w-14 h-14 rounded-2xl bg-[#08090A] border border-[#22252A] flex items-center justify-center text-2xl mb-4 text-[#CCFF00] shadow-[0_0_12px_rgba(204,255,0,0.2)]">
                      <svg className="w-7 h-7 text-[#CCFF00]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-mono font-bold uppercase text-[#FFFFFF] mb-2 max-w-md">
                      Unable to embed preview URL directly
                    </h3>
                    <p className="text-xs font-mono text-[#828892] max-w-md mb-4">
                      The target address could not be reached or has frame restrictions. Verify or adjust the URL below:
                    </p>

                    {stagingUrl.includes('staging.') && (
                      <button
                        type="button"
                        onClick={() => {
                          const fixed = stagingUrl.replace('staging.', '');
                          setStagingUrl(fixed);
                          setIframeError(false);
                          setProxyKey((prev) => prev + 1);
                        }}
                        className="mb-4 px-4 py-2 rounded-xl bg-[#16181B] hover:bg-[#22252A] border border-[#22252A] text-[#FFFFFF] text-xs font-mono transition inline-flex items-center gap-2 shadow-sm"
                      >
                        <span>Remove &ldquo;staging.&rdquo; prefix &amp; reload:</span>
                        <span className="underline font-bold text-[#CCFF00]">{stagingUrl.replace('staging.', '')}</span>
                      </button>
                    )}

                    <div className="w-full max-w-md flex items-center gap-2 mb-6">
                      <input
                        type="text"
                        value={stagingUrl}
                        onChange={(e) => setStagingUrl(e.target.value)}
                        placeholder="https://miidaystudio.online"
                        className="flex-1 bg-[#08090A] border border-[#22252A] rounded-xl px-3.5 py-2 text-xs font-mono text-[#FFFFFF] focus:outline-none focus:border-[#CCFF00]"
                      />
                      <button
                        type="button"
                        onClick={handleRetryProxy}
                        className="px-4 py-2 bg-[#16181B] hover:bg-[#22252A] border border-[#22252A] hover:border-[#CCFF00] text-[#FFFFFF] text-xs font-mono rounded-xl transition shadow-sm"
                      >
                        Reload
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleRetryProxy}
                        className="px-5 py-2.5 bg-[#16181B] hover:bg-[#22252A] border border-[#22252A] hover:border-[#CCFF00] text-[#FFFFFF] text-xs font-mono font-bold uppercase rounded-xl transition shadow-sm"
                      >
                        Retry via Proxy
                      </button>
                      <a
                        href={stagingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 bg-[#CCFF00] hover:bg-[#b8e600] text-black text-xs font-mono font-black uppercase rounded-xl transition shadow-[0_0_12px_rgba(204,255,0,0.3)] inline-flex items-center gap-1.5"
                      >
                        Open URL in New Tab ↗
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* DOCKED TOOL 1: Visual Mutation Dock */}
          {currentMode === 'mutations' && (
            <div className="w-full max-w-7xl mt-4">
              <VisualMutationDock
                projectId={projectId || deliverable.id}
                variants={variants}
                activeVariantId={activeVariantId}
                onSelectVariant={handleSelectVariant}
                onCreateVariant={handleCreateVariant}
                onSaveVariantMutations={handleSaveVariantMutations}
                selectedElement={selectedElement}
                onApplyMutationToIframe={handleApplyMutation}
                onResetIframe={() => sendIframeMessage({ type: 'ORBIT_RESET_MUTATIONS' })}
              />
            </div>
          )}

          {/* DOCKED TOOL 2: Kinetic Motion Bézier Curve Editor */}
          {currentMode === 'motion' && (
            <div className="w-full max-w-4xl mt-4">
              <BezierCurveEditor
                projectId={projectId || deliverable.id}
                initialPreset={presets[0]}
                onSavePreset={handleSavePreset}
                onTestMotion={handleTestMotion}
              />
            </div>
          )}
        </div>
      )}

      {/* QA Pin Detail Drawer */}
      {activePin && (
        <PinDetailDrawer
          pin={activePin}
          onClose={() => setActivePinId(null)}
          onToggleStatus={(pinId) => {
            setPins((prev) =>
              prev.map((p) =>
                p.id === pinId ? { ...p, status: p.status === 'RESOLVED' ? 'OPEN' : 'RESOLVED' } : p
              )
            );
          }}
          onSyncGitHub={() => {}}
          onUpdateScope={() => {}}
        />
      )}
    </div>
  );
}
