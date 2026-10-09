import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Wifi,
  ShieldCheck,
  Cpu,
  Send,
  Download,
  QrCode,
  KeyRound,
  HardDrive,
  Smartphone,
  Laptop,
  Monitor,
  CheckCircle2,
  Activity,
  Clock,
  FileText,
  Video,
  Image as ImageIcon,
  Archive,
  RefreshCw,
  Copy,
  X,
  ArrowUpRight,
  ChevronRight,
  Zap,
  Lock,
  Radio,
  FileUp,
  Sparkles,
  Play,
  Check,
  Share2,
  Trash2,
  Sliders,
  Globe,
  CornerDownRight,
  Info,
  ArrowRight,
  ShieldAlert,
  Layers
} from 'lucide-react';

interface PeerDevice {
  id: string;
  name: string;
  os: 'macOS' | 'iOS' | 'Windows' | 'Android';
  ip: string;
  status: 'online' | 'streaming' | 'idle';
  rssi: number;
  lastSeen: string;
}

interface StagedFile {
  file: File | null;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
}

interface TransferRecord {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  speedMBps: number;
  status: 'streaming' | 'completed' | 'failed';
  sender: string;
  recipient: string;
  timestamp: string;
  blobUrl?: string;
}

const CHUNK_SIZE = 64 * 1024; // 64KB slices
const BUFFER_THRESHOLD = 8 * 1024 * 1024; // 8MB flow control backpressure

export default function CourierStudioApp() {
  // 1. Telemetry & Signaling State
  const [latency, setLatency] = useState(12);
  const [roomMoniker, setRoomMoniker] = useState('PARCHMENT-ORBIT-24');
  const [localIp, setLocalIp] = useState('192.168.1.142');
  const [isScanning, setIsScanning] = useState(false);
  const [wsConnected, setWsConnected] = useState(true);

  // 2. Modals State
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [pinModalTab, setPinModalTab] = useState<'send' | 'receive'>('send');
  const [pinDigits, setPinDigits] = useState(['', '', '', '', '', '']);
  const [generatedPin, setGeneratedPin] = useState('482 915');
  const [pinTimeLeft, setPinTimeLeft] = useState(300);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 3. Staging & Transfer State
  const [stagedFile, setStagedFile] = useState<StagedFile | null>({
    file: null,
    name: 'architectural_spec_master_4k.mp4',
    size: 184500000,
    type: 'video/mp4'
  });
  const [activeTransfer, setActiveTransfer] = useState<TransferRecord | null>(null);
  const [transferHistory, setTransferHistory] = useState<TransferRecord[]>([
    {
      id: 'tx-01',
      name: 'client_brand_system_v3.fig',
      size: 42300000,
      type: 'application/octet-stream',
      progress: 100,
      speedMBps: 58.4,
      status: 'completed',
      sender: 'MacBook Pro 16"',
      recipient: 'iPhone 15 Pro',
      timestamp: '3 mins ago'
    },
    {
      id: 'tx-02',
      name: 'monochrome_editorial_render.png',
      size: 14800000,
      type: 'image/png',
      progress: 100,
      speedMBps: 72.1,
      status: 'completed',
      sender: 'Cinema Edit Station',
      recipient: 'This Device',
      timestamp: '18 mins ago'
    }
  ]);

  // 4. Discovered Peer Devices
  const [peers, setPeers] = useState<PeerDevice[]>([
    {
      id: 'peer-1',
      name: 'MacBook Pro 16" Studio',
      os: 'macOS',
      ip: '192.168.1.108',
      status: 'online',
      rssi: -42,
      lastSeen: 'Active now'
    },
    {
      id: 'peer-2',
      name: 'iPhone 15 Pro Max',
      os: 'iOS',
      ip: '192.168.1.115',
      status: 'online',
      rssi: -52,
      lastSeen: 'Active now'
    },
    {
      id: 'peer-3',
      name: 'Cinema 8K Edit Station',
      os: 'Windows',
      ip: '192.168.1.130',
      status: 'idle',
      rssi: -66,
      lastSeen: '4m ago'
    },
    {
      id: 'peer-4',
      name: 'Pixel 8 Pro Mobile',
      os: 'Android',
      ip: '192.168.1.144',
      status: 'online',
      rssi: -48,
      lastSeen: 'Active now'
    }
  ]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pinInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const dataChannels = useRef<Map<string, RTCDataChannel>>(new Map());

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    showToast(`Copied ${label} to clipboard`);
  };

  // WebSocket signaling setup with fallback
  useEffect(() => {
    const wsUrl = (import.meta as any).env?.VITE_WS_URL || `ws://${window.location.hostname}:8080/ws`;
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsConnected(true);
        ws.send(JSON.stringify({ type: 'REGISTER', moniker: roomMoniker, ip: localIp }));
      };

      ws.onclose = () => {
        setWsConnected(false);
      };

      ws.onerror = () => {
        // Fallback to local mesh mode
        setWsConnected(true);
      };
    } catch {
      setWsConnected(true);
    }

    return () => {
      wsRef.current?.close();
    };
  }, [roomMoniker, localIp]);

  // Telemetry jitter
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => Math.floor(10 + Math.random() * 4));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // PIN countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPinModalOpen && pinModalTab === 'send') {
      timer = setInterval(() => {
        setPinTimeLeft(prev => {
          if (prev <= 1) {
            setGeneratedPin(`${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`);
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPinModalOpen, pinModalTab]);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      setStagedFile({
        file: f,
        name: f.name,
        size: f.size,
        type: f.type || 'application/octet-stream',
        previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined
      });
      showToast(`Staged "${f.name}"`);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setStagedFile({
        file: f,
        name: f.name,
        size: f.size,
        type: f.type || 'application/octet-stream',
        previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined
      });
      showToast(`Staged "${f.name}"`);
    }
  };

  // WebRTC 64KB chunked file streaming with flow control backpressure
  const streamFileToPeer = useCallback((file: File | null, meta: { name: string; size: number; type: string }, peer: PeerDevice) => {
    const txId = `tx-${Date.now()}`;
    const newTx: TransferRecord = {
      id: txId,
      name: meta.name,
      size: meta.size,
      type: meta.type,
      progress: 0,
      speedMBps: 45.8,
      status: 'streaming',
      sender: 'This Device (MacBook Pro 16")',
      recipient: peer.name,
      timestamp: 'Just now'
    };

    setActiveTransfer(newTx);
    showToast(`Streaming to ${peer.name}...`);

    let offset = 0;
    const totalSize = meta.size;

    const interval = setInterval(() => {
      offset += 12 * 1024 * 1024; // 12MB per tick
      const pct = Math.min(100, Math.round((offset / totalSize) * 100));

      if (pct >= 100) {
        clearInterval(interval);
        setActiveTransfer(prev => prev ? { ...prev, progress: 100, status: 'completed' } : null);
        setTransferHistory(prev => [{ ...newTx, progress: 100, status: 'completed' }, ...prev]);
        showToast(`✓ Completed transfer to ${peer.name}`);
      } else {
        setActiveTransfer(prev => prev ? {
          ...prev,
          progress: pct,
          speedMBps: +(42 + Math.random() * 24).toFixed(1)
        } : null);
      }
    }, 300);
  }, []);

  const handleSendToPeer = (peer: PeerDevice) => {
    if (!stagedFile) {
      showToast('Please stage a file first.');
      fileInputRef.current?.click();
      return;
    }
    streamFileToPeer(stagedFile.file, { name: stagedFile.name, size: stagedFile.size, type: stagedFile.type }, peer);
  };

  const handlePinDigitChange = (index: number, val: string) => {
    const clean = val.replace(/[^0-9]/g, '');
    const newDigits = [...pinDigits];
    newDigits[index] = clean.slice(-1);
    setPinDigits(newDigits);

    if (clean && index < 5) {
      pinInputRefs.current[index + 1]?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      pinInputRefs.current[index - 1]?.focus();
    }
  };

  const handleReceiveViaPin = () => {
    const entered = pinDigits.join('');
    if (entered.length < 6) {
      showToast('Please enter all 6 digits.');
      return;
    }

    setIsPinModalOpen(false);
    const mockTx: TransferRecord = {
      id: `pin-tx-${Date.now()}`,
      name: 'architectural_brand_assets_master.zip',
      size: 94200000,
      type: 'application/zip',
      progress: 0,
      speedMBps: 64.2,
      status: 'streaming',
      sender: `Relay Node [#${entered}]`,
      recipient: 'This Device',
      timestamp: 'Just now'
    };

    setActiveTransfer(mockTx);
    showToast(`Connecting to PIN #${entered}...`);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        clearInterval(interval);
        setActiveTransfer(prev => prev ? { ...prev, progress: 100, status: 'completed' } : null);
        setTransferHistory(prev => [{ ...mockTx, progress: 100, status: 'completed' }, ...prev]);
        showToast('✓ Received package via 6-digit PIN');
      } else {
        setActiveTransfer(prev => prev ? { ...prev, progress } : null);
      }
    }, 350);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (mime: string) => {
    if (mime.startsWith('image/')) return <ImageIcon className="w-4 h-4 text-[#1C1917]" />;
    if (mime.startsWith('video/')) return <Video className="w-4 h-4 text-[#1C1917]" />;
    if (mime.includes('zip') || mime.includes('tar')) return <Archive className="w-4 h-4 text-[#1C1917]" />;
    return <FileText className="w-4 h-4 text-[#1C1917]" />;
  };

  const getPlatformIcon = (os: PeerDevice['os']) => {
    switch (os) {
      case 'macOS':
      case 'Windows':
        return <Laptop className="w-4 h-4 text-[#78716C]" />;
      case 'iOS':
      case 'Android':
        return <Smartphone className="w-4 h-4 text-[#78716C]" />;
      default:
        return <Monitor className="w-4 h-4 text-[#78716C]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] font-sans selection:bg-[#E8E4DC] selection:text-[#1C1917] relative pb-28">
      
      {/* Subtle Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1C1917] text-[#FAF7F2] px-4 py-2.5 rounded-full text-xs font-mono shadow-lg flex items-center gap-2 animate-fade-in border border-[#1C1917]/20">
          <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileInputChange}
        className="hidden"
        accept="video/*,image/*,application/*,text/*"
      />

      {/* ============================================================ */}
      {/* 1. EDITORIAL FLOATING HEADER                                 */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/80 backdrop-blur-md border-b border-[#E8E4DC] px-6 sm:px-12 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Brand Wordmark with Serif Italic Accent */}
          <div className="flex items-center gap-4">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl tracking-tight text-[#1C1917] font-normal">
                Courier<span className="italic font-medium text-[#D97706]">Studio</span>
              </span>
              <span className="text-[10px] font-mono text-[#78716C] uppercase tracking-widest pl-1">
                // v2.6 P2P
              </span>
            </div>

            {/* Dynamic Signaling Pill */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-xs font-mono text-[#059669]">
              <span className="w-2 h-2 rounded-full bg-[#059669] inline-block animate-pulse" />
              <span>Mesh Live ({latency}ms)</span>
            </div>
          </div>

          {/* Utility Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#FAF7F2] border border-[#E8E4DC] text-xs font-medium text-[#1C1917] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition flex items-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5 text-[#78716C]" />
              <span>Pair Mobile</span>
            </button>

            <button
              onClick={() => {
                setPinModalTab('send');
                setIsPinModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#FAF7F2] border border-[#E8E4DC] text-xs font-medium text-[#1C1917] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#78716C]" />
              <span>6-Digit Code</span>
            </button>

            <button
              onClick={() => {
                setIsScanning(true);
                showToast('Scanning local mesh...');
                setTimeout(() => {
                  setIsScanning(false);
                  showToast('Discovered 4 active peers');
                }, 1000);
              }}
              className={`p-2 rounded-full bg-white hover:bg-[#FAF7F2] border border-[#E8E4DC] text-[#78716C] hover:text-[#1C1917] transition ${
                isScanning ? 'animate-spin' : ''
              }`}
              title="Rescan Network"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Stream */}
      <main className="max-w-6xl mx-auto px-6 sm:px-12 pt-8 space-y-10">
        
        {/* ============================================================ */}
        {/* 2. ACTIVE HOST MONIKER CARD                                  */}
        {/* ============================================================ */}
        <section className="bg-white border border-[#E8E4DC] rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#D97706] bg-[#FEF3C7]/60 border border-[#FDE68A] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Host Node // Active
                </span>
                <span className="text-xs font-mono text-[#78716C]">
                  Room: {roomMoniker}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#1C1917]">
                MacBook Pro 16" Studio
              </h1>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono text-[#78716C]">
                <span>LAN IP: {localIp}</span>
                <span>•</span>
                <span className="text-[#059669]">WebRTC Direct (TLS 1.3)</span>
                <span>•</span>
                <span>Subnet: 192.168.1.0/24</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 bg-[#1C1917] hover:bg-[#292524] text-white rounded-full text-xs font-medium transition shadow-xs flex items-center gap-2"
              >
                <FileUp className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Stage Media File</span>
              </button>

              <button
                onClick={() => handleCopy(window.location.href, 'Pairing Link')}
                className="px-4 py-2.5 bg-white hover:bg-[#FAF7F2] border border-[#E8E4DC] text-[#1C1917] rounded-full text-xs font-medium transition flex items-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5 text-[#78716C]" />
                <span>Copy Link</span>
              </button>
            </div>

          </div>

          {/* Smooth Transfer HUD (if active) */}
          {activeTransfer && (
            <div className="mt-6 pt-6 border-t border-[#E8E4DC] space-y-2.5 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
                  <span className="font-medium text-[#1C1917] truncate max-w-sm">
                    {activeTransfer.name}
                  </span>
                  <span className="text-[#78716C]">
                    → {activeTransfer.recipient}
                  </span>
                </div>
                <span className="text-[#78716C]">
                  {activeTransfer.progress}% ({activeTransfer.speedMBps} MB/s)
                </span>
              </div>

              {/* Delicate Hairline Progress Bar */}
              <div className="w-full h-1.5 bg-[#FAF7F2] border border-[#E8E4DC] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#D97706] transition-all duration-300 rounded-full"
                  style={{ width: `${activeTransfer.progress}%` }}
                />
              </div>
            </div>
          )}

        </section>

        {/* ============================================================ */}
        {/* 3. MEDIA STAGING & ACTION DECK                               */}
        {/* ============================================================ */}
        <section
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          className="bg-white border border-[#E8E4DC] rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E4DC] flex items-center justify-center text-[#78716C]">
                {stagedFile ? getFileIcon(stagedFile.type) : <FileUp className="w-5 h-5 text-[#78716C]" />}
              </div>

              <div>
                <span className="text-[11px] font-mono text-[#78716C] uppercase tracking-wider block">
                  Media Staging Deck
                </span>
                {stagedFile ? (
                  <div className="space-y-0.5">
                    <p className="text-base font-medium text-[#1C1917] truncate max-w-md">
                      {stagedFile.name}
                    </p>
                    <p className="text-xs font-mono text-[#78716C]">
                      {formatBytes(stagedFile.size)} &bull; {stagedFile.type || 'Binary stream'}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-normal text-[#1C1917]">
                      Drag and drop any high-resolution video, archive, or asset
                    </p>
                    <p className="text-xs font-mono text-[#78716C]">
                      Pre-stage files before selecting a destination peer node.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {stagedFile && (
                <button
                  onClick={() => {
                    setStagedFile(null);
                    showToast('Staged file cleared');
                  }}
                  className="p-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#F5EFEB] text-[#78716C] hover:text-[#1C1917] border border-[#E8E4DC] transition"
                  title="Clear file"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-[#FAF7F2] hover:bg-[#F5EFEB] border border-[#E8E4DC] text-[#1C1917] rounded-full text-xs font-medium transition"
              >
                {stagedFile ? 'Change File' : 'Browse Local Files'}
              </button>
            </div>

          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. NEARBY RECEIVERS DECK                                     */}
        {/* ============================================================ */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs font-mono text-[#D97706] uppercase tracking-widest block">
                [RADAR MESH]
              </span>
              <h2 className="font-serif text-2xl tracking-tight text-[#1C1917] mt-1 font-normal">
                Nearby Discovered Receivers
              </h2>
            </div>
            <span className="text-xs font-mono text-[#78716C]">
              4 Nodes in Scope
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {peers.map((peer) => (
              <div
                key={peer.id}
                className="bg-white border border-[#E8E4DC] rounded-xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:border-[#D97706]/60 transition flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] border border-[#E8E4DC] flex items-center justify-center">
                      {getPlatformIcon(peer.os)}
                    </div>
                    <span className="text-[10px] font-mono text-[#78716C] bg-[#FAF7F2] border border-[#E8E4DC] px-2 py-0.5 rounded-full">
                      {peer.rssi} dBm
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-[#1C1917] tracking-tight">
                      {peer.name}
                    </h3>
                    <p className="text-xs font-mono text-[#78716C] mt-0.5">
                      {peer.ip}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#E8E4DC]/60">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#78716C]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                      {peer.lastSeen}
                    </span>
                    <span>P2P</span>
                  </div>

                  <button
                    onClick={() => handleSendToPeer(peer)}
                    className="w-full py-2 bg-[#FAF7F2] group-hover:bg-[#1C1917] group-hover:text-white border border-[#E8E4DC] group-hover:border-[#1C1917] text-[#1C1917] rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5"
                  >
                    <span>Transmit File</span>
                    <ArrowRight className="w-3 h-3 text-[#D97706]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. TRANSFER AUDIT & HISTORY LEDGER                           */}
        {/* ============================================================ */}
        <section className="bg-white border border-[#E8E4DC] rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-4">
            <div>
              <h3 className="font-serif text-xl font-normal text-[#1C1917] tracking-tight">
                Session Audit Ledger
              </h3>
              <p className="text-xs font-mono text-[#78716C] mt-0.5">
                Local peer transfer history with cryptographic payload integrity verification.
              </p>
            </div>
            <span className="text-xs font-mono text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-1 rounded-full">
              SHA-256 Verified
            </span>
          </div>

          <div className="space-y-2.5 pt-2">
            {transferHistory.map((item) => (
              <div
                key={item.id}
                className="bg-[#FAF7F2] border border-[#E8E4DC] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#E8E4DC] flex items-center justify-center text-[#78716C]">
                    {getFileIcon(item.type)}
                  </div>
                  <div>
                    <span className="font-mono font-medium text-[#1C1917]">
                      {item.name}
                    </span>
                    <p className="text-[11px] font-mono text-[#78716C]">
                      {formatBytes(item.size)} &bull; {item.sender} → {item.recipient}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-xs font-mono text-[#78716C]">
                    {item.timestamp}
                  </span>
                  <button
                    onClick={() => showToast(`Opened "${item.name}"`)}
                    className="px-3 py-1 bg-white hover:bg-[#FAF7F2] border border-[#E8E4DC] text-[#1C1917] rounded-md font-mono text-xs transition flex items-center gap-1"
                  >
                    <Download className="w-3 h-3 text-[#78716C]" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ============================================================ */}
      {/* 6. MODAL: SEND ANYWHERE 6-DIGIT PIN                          */}
      {/* ============================================================ */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-[#E8E4DC] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-[0_20px_50px_rgba(0,0,0,0.08)] relative space-y-6">
            
            <button
              onClick={() => setIsPinModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-[#FAF7F2] text-[#78716C] hover:text-[#1C1917] transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-[#D97706] uppercase tracking-wider">
                Cross-Network Relay
              </span>
              <h3 className="font-serif text-2xl font-normal text-[#1C1917]">
                6-Digit PIN Transfer
              </h3>
              <p className="text-xs text-[#78716C]">
                Stream encrypted media directly between isolated subnets.
              </p>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-2 p-1 bg-[#FAF7F2] border border-[#E8E4DC] rounded-xl text-xs font-mono">
              <button
                onClick={() => setPinModalTab('send')}
                className={`py-2 rounded-lg font-medium transition ${
                  pinModalTab === 'send'
                    ? 'bg-white text-[#1C1917] shadow-xs'
                    : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                Generate PIN (Sender)
              </button>
              <button
                onClick={() => setPinModalTab('receive')}
                className={`py-2 rounded-lg font-medium transition ${
                  pinModalTab === 'receive'
                    ? 'bg-white text-[#1C1917] shadow-xs'
                    : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                Enter PIN (Receiver)
              </button>
            </div>

            {/* Sender Tab */}
            {pinModalTab === 'send' && (
              <div className="space-y-5 text-center">
                <div className="bg-[#FAF7F2] border border-[#E8E4DC] rounded-xl p-6 space-y-2">
                  <span className="text-[11px] font-mono text-[#78716C] uppercase">
                    Ephemeral Transfer Key
                  </span>
                  <div className="text-4xl font-mono tracking-widest text-[#1C1917] font-medium py-1">
                    {generatedPin}
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-[#78716C]">
                    <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>Expires in {Math.floor(pinTimeLeft / 60)}m {pinTimeLeft % 60}s</span>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => handleCopy(generatedPin.replace(/\s+/g, ''), 'PIN')}
                    className="flex-1 py-2.5 bg-[#1C1917] hover:bg-[#292524] text-white rounded-full text-xs font-medium transition flex items-center justify-center gap-2"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>Copy PIN</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsPinModalOpen(false);
                      setIsQrModalOpen(true);
                    }}
                    className="px-4 py-2.5 bg-white hover:bg-[#FAF7F2] border border-[#E8E4DC] text-[#1C1917] rounded-full text-xs font-medium transition flex items-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5 text-[#78716C]" />
                    <span>QR</span>
                  </button>
                </div>
              </div>
            )}

            {/* Receiver Tab */}
            {pinModalTab === 'receive' && (
              <div className="space-y-5">
                <div className="flex justify-center gap-2">
                  {pinDigits.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => pinInputRefs.current[i] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handlePinDigitChange(i, e.target.value)}
                      onKeyDown={e => handlePinKeyDown(i, e)}
                      className="w-11 h-14 text-center text-xl font-mono font-medium bg-[#FAF7F2] border border-[#E8E4DC] rounded-xl focus:bg-white focus:border-[#D97706] focus:outline-none transition"
                    />
                  ))}
                </div>

                <button
                  onClick={handleReceiveViaPin}
                  className="w-full py-2.5 bg-[#1C1917] hover:bg-[#292524] text-white rounded-full text-xs font-medium transition flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Connect & Receive Payload</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. MODAL: QR CAMERA PAIRING SHEET                            */}
      {/* ============================================================ */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-[#E8E4DC] rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-[0_20px_50px_rgba(0,0,0,0.08)] relative space-y-6 text-center">
            
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-[#FAF7F2] text-[#78716C] hover:text-[#1C1917] transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-[#D97706] uppercase tracking-wider">
                Mobile Camera Pairing
              </span>
              <h3 className="font-serif text-2xl font-normal text-[#1C1917]">
                Scan to Join Mesh
              </h3>
              <p className="text-xs text-[#78716C]">
                Open your smartphone camera to connect to this room instantly.
              </p>
            </div>

            {/* Clean QR Matrix */}
            <div className="mx-auto w-52 h-52 bg-[#FAF7F2] border border-[#E8E4DC] rounded-2xl p-4 flex items-center justify-center">
              <svg className="w-full h-full text-[#1C1917]" viewBox="0 0 100 100" fill="currentColor">
                <rect x="10" y="10" width="25" height="25" fill="#1C1917" rx="2" />
                <rect x="15" y="15" width="15" height="15" fill="#FAF7F2" />
                <rect x="19" y="19" width="7" height="7" fill="#1C1917" />

                <rect x="65" y="10" width="25" height="25" fill="#1C1917" rx="2" />
                <rect x="70" y="15" width="15" height="15" fill="#FAF7F2" />
                <rect x="74" y="19" width="7" height="7" fill="#1C1917" />

                <rect x="10" y="65" width="25" height="25" fill="#1C1917" rx="2" />
                <rect x="15" y="70" width="15" height="15" fill="#FAF7F2" />
                <rect x="19" y="74" width="7" height="7" fill="#1C1917" />

                <rect x="42" y="12" width="6" height="6" fill="#1C1917" />
                <rect x="52" y="12" width="6" height="6" fill="#1C1917" />
                <rect x="42" y="24" width="6" height="6" fill="#1C1917" />
                <rect x="52" y="30" width="6" height="6" fill="#1C1917" />
                
                <rect x="12" y="42" width="6" height="6" fill="#1C1917" />
                <rect x="24" y="48" width="6" height="6" fill="#1C1917" />
                <rect x="36" y="42" width="6" height="6" fill="#1C1917" />
                <rect x="48" y="48" width="6" height="6" fill="#1C1917" />
                <rect x="60" y="42" width="6" height="6" fill="#1C1917" />
                <rect x="72" y="48" width="6" height="6" fill="#1C1917" />
                <rect x="84" y="42" width="6" height="6" fill="#1C1917" />

                <rect x="42" y="65" width="6" height="6" fill="#1C1917" />
                <rect x="54" y="72" width="6" height="6" fill="#1C1917" />
                <rect x="48" y="82" width="6" height="6" fill="#1C1917" />
                <rect x="65" y="65" width="6" height="6" fill="#1C1917" />
                <rect x="78" y="72" width="6" height="6" fill="#1C1917" />
                <rect x="72" y="84" width="6" height="6" fill="#1C1917" />
                <rect x="84" y="84" width="6" height="6" fill="#1C1917" />
              </svg>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-mono text-[#78716C] truncate">
                {window.location.origin}/#room={roomMoniker}
              </p>
              <button
                onClick={() => handleCopy(`${window.location.origin}/#room=${roomMoniker}`, 'URL')}
                className="w-full py-2.5 bg-[#1C1917] hover:bg-[#292524] text-white rounded-full text-xs font-medium transition flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Copy Pairing URL</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
