import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { getStaticTranslation } from '../services/translationService';
import type { AngleType, CapturedPhoto } from '../types';
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Plus,
  Sparkles,
  ArrowRight,
  Pill,
  Volume2,
  ShieldCheck,
  Calendar,
  RotateCcw,
  CameraOff,
  Lock,
  RefreshCw
} from 'lucide-react';
import { VoiceButton } from '../components/ui/VoiceButton';

export const HomeView: React.FC = () => {
  const { setCurrentRoute, savedMedicines, addCapturedPhoto } = useApp();
  const { selectedLanguage } = useLanguage();
  const lang = selectedLanguage.code;

  // Refs for camera stream & upload
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Active angle state
  const [activeAngle, setActiveAngle] = useState<AngleType>('Front');

  // Camera State: 'initializing' | 'active' | 'captured' | 'denied' | 'unavailable'
  const [cameraState, setCameraState] = useState<'initializing' | 'active' | 'captured' | 'denied' | 'unavailable'>('initializing');

  // Multi-Photo Store Map
  const [capturedPhotosMap, setCapturedPhotosMap] = useState<Record<AngleType, CapturedPhoto | null>>({
    Front: null,
    Back: null,
    'Close-up': null,
    Expiry: null
  });

  const guideTextEn = "Place your medicine strip inside the frame. We will guide you. Hold the camera steady and make sure the lighting is bright.";

  // Stop camera stream tracks cleanly
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Start browser camera stream
  const startCamera = async () => {
    stopCamera();
    setCameraState('initializing');

    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraState('unavailable');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(e => console.warn('Video play deferred:', e));
      }
      setCameraState('active');
    } catch (err: any) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraState('denied');
      } else {
        setCameraState('unavailable');
      }
    }
  };

  // Monitor angle changes and start/stop camera stream accordingly
  useEffect(() => {
    const photoForAngle = capturedPhotosMap[activeAngle];

    if (photoForAngle) {
      stopCamera();
      setCameraState('captured');
    } else {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [activeAngle]);

  // Capture canvas frame
  const handleCapturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const previewUrl = canvas.toDataURL('image/jpeg', 0.92);

      stopCamera();

      const typeMap: Record<AngleType, 'front' | 'back' | 'expiry' | 'tablet'> = {
        Front: 'front',
        Back: 'back',
        Expiry: 'expiry',
        'Close-up': 'tablet'
      };

      const newPhoto: CapturedPhoto = {
        id: `photo_${Date.now()}_${activeAngle}`,
        type: typeMap[activeAngle],
        angleLabel: activeAngle,
        previewUrl,
        timestamp: Date.now()
      };

      setCapturedPhotosMap(prev => ({
        ...prev,
        [activeAngle]: newPhoto
      }));

      addCapturedPhoto(previewUrl);
      setCameraState('captured');
    }
  };

  // Retake photo for active angle
  const handleRetakePhoto = () => {
    setCapturedPhotosMap(prev => ({
      ...prev,
      [activeAngle]: null
    }));
    startCamera();
  };

  // Upload photo from device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const previewUrl = event.target?.result as string;
      if (previewUrl) {
        stopCamera();

        const typeMap: Record<AngleType, 'front' | 'back' | 'expiry' | 'tablet'> = {
          Front: 'front',
          Back: 'back',
          Expiry: 'expiry',
          'Close-up': 'tablet'
        };

        const newPhoto: CapturedPhoto = {
          id: `upload_${Date.now()}_${activeAngle}`,
          type: typeMap[activeAngle],
          angleLabel: activeAngle,
          file,
          previewUrl,
          timestamp: Date.now()
        };

        setCapturedPhotosMap(prev => ({
          ...prev,
          [activeAngle]: newPhoto
        }));

        addCapturedPhoto(previewUrl);
        setCameraState('captured');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input
  };

  // Continue to Scan Analysis
  const handleProceedToAnalysis = () => {
    stopCamera();
    setCurrentRoute('analysis');
  };

  // Count captured photos
  const countCaptured = Object.values(capturedPhotosMap).filter(Boolean).length;

  const angleLabels = [
    { id: 'Front' as const, num: '1', title: 'Front of strip', desc: 'Main title & dosage' },
    { id: 'Back' as const, num: '2', title: 'Back of strip', desc: 'Composition details' },
    { id: 'Expiry' as const, num: '3', title: 'Expiry close-up', desc: 'Date stamp & batch' },
    { id: 'Close-up' as const, num: '4', title: 'Tablet / logo', desc: 'Shape & branding' },
  ];

  // Key Capabilities
  const features = [
    {
      icon: <Camera className="w-5 h-5 text-[#2FA89B]" />,
      bg: 'bg-[#E6F4EF] border-[#C6EADF]',
      title: 'Smart Scan',
      desc: getStaticTranslation('featSmartScan', lang, 'Read medicine information directly from packaging.')
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#9E5D24]" />,
      bg: 'bg-[#F8EFE7] border-[#F2D7C2]',
      title: 'MedMatch Rescue',
      desc: getStaticTranslation('featRescue', lang, 'Recover clues from damaged or partially readable strips.')
    },
    {
      icon: <Volume2 className="w-5 h-5 text-[#6B5A94]" />,
      bg: 'bg-[#F1EFF7] border-[#DDD8EC]',
      title: 'Voice First',
      desc: getStaticTranslation('featVoice', lang, 'Hear results in spoken voice.')
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#287F78]" />,
      bg: 'bg-[#E6F4EF] border-[#C6EADF]',
      title: 'Confidence',
      desc: getStaticTranslation('featConfidence', lang, 'See exactly why a medicine match was made.')
    },
    {
      icon: <Calendar className="w-5 h-5 text-[#9F2E40]" />,
      bg: 'bg-[#F7EDEF] border-[#F3CDD4]',
      title: 'Expiry & Reminders',
      desc: getStaticTranslation('featExpiry', lang, 'Track printed expiry information and daily dose reminders.')
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileUpload} 
      />
      
      {/* ========================================== */}
      {/* 1. TOP SECTION: SCAN MEDICINE HERO          */}
      {/* ========================================== */}
      <section className="space-y-6">
        {/* Page Heading Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E9E8E5] p-5 sm:p-6 rounded-[22px] shadow-xs">
          <div>
            <h1 className="text-3xl font-medium text-slate-800 flex items-center gap-2.5">
              <Camera className="w-7 h-7 text-[#2FA89B]" />
              <span>{getStaticTranslation('scanMedicine', lang, 'Scan medicine')}</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-normal">
              {getStaticTranslation('cameraGuide', lang, 'Place the medicine strip inside the frame. We\'ll guide you.')}
            </p>
          </div>

          <VoiceButton 
            textToSpeak={getStaticTranslation('cameraGuide', lang, guideTextEn)}
            label="🔊"
            size="md"
            variant="primary"
          />
        </div>

        {/* Grid: Camera Viewport + Multi-photo Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Camera Card (Soft Mint/Green Background) */}
          <div className="lg:col-span-8 bg-white border border-[#E9E8E5] rounded-[24px] p-5 space-y-4 shadow-xs">
            
            {/* Camera Card Header Bar */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 px-1">
              <div className="flex items-center gap-2">
                {cameraState === 'active' && (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2FA89B] animate-pulse"></span>
                    <span className="font-bold text-slate-700">● Camera ready</span>
                  </>
                )}
                {cameraState === 'captured' && (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#2FA89B]" />
                    <span className="font-bold text-[#287F78]">✓ Photo captured ({activeAngle})</span>
                  </>
                )}
                {cameraState === 'initializing' && (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-[#2FA89B] animate-spin" />
                    <span className="font-bold text-slate-600">Starting camera...</span>
                  </>
                )}
                {cameraState === 'denied' && (
                  <span className="font-bold text-amber-700 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Permission needed
                  </span>
                )}
                {cameraState === 'unavailable' && (
                  <span className="font-bold text-slate-600 flex items-center gap-1">
                    <CameraOff className="w-3.5 h-3.5 text-slate-400" /> Camera unavailable
                  </span>
                )}
              </div>

              <span className="px-3 py-1 rounded-full bg-[#F6F7F5] border border-[#E9E8E5] text-slate-600 font-mono font-bold">
                {countCaptured} / 4 photos
              </span>
            </div>

            {/* Camera Preview Box */}
            <div className="relative bg-[#E6F4EF] border border-[#C6EADF] rounded-[20px] overflow-hidden min-h-[360px] sm:min-h-[420px] flex flex-col items-center justify-center p-4">
              
              {/* LIVE CAMERA STREAM VIEW */}
              {(cameraState === 'active' || cameraState === 'initializing') && (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#E6F4EF]/20 backdrop-blur-[0.5px]"></div>

                  {/* Laser Scan Animation Line */}
                  <div className="absolute inset-x-6 h-0.5 bg-gradient-to-r from-transparent via-[#2FA89B] to-transparent shadow-[0_0_8px_#2FA89B] animate-laser-scan z-20"></div>

                  {/* White Scanning Alignment Frame */}
                  <div className="relative z-10 w-72 h-72 sm:w-80 sm:h-80 border-2 border-dashed border-white/90 rounded-[24px] flex items-center justify-center p-4 shadow-xs">
                    {/* White Brackets Corners */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl shadow-xs"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl shadow-xs"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl shadow-xs"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl shadow-xs"></div>

                    {/* Center Target Badge */}
                    <div className="text-center bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl border border-[#C6EADF] shadow-xs">
                      <span className="text-xs font-bold text-[#287F78] uppercase tracking-widest block">
                        ALIGN STRIP HERE
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono font-medium">
                        {activeAngle} Side Photo
                      </span>
                    </div>
                  </div>

                  {/* Status Chips Overlay at Bottom of Live Preview */}
                  <div className="absolute bottom-4 inset-x-4 z-20 flex flex-wrap items-center justify-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/95 border border-[#C6EADF] text-[#287F78] text-xs font-bold flex items-center gap-1.5 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2FA89B]" />
                      Good lighting
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/95 border border-[#C6EADF] text-[#287F78] text-xs font-bold flex items-center gap-1.5 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2FA89B]" />
                      Strip detected
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/95 border border-[#FDE6B5] text-[#9A6200] text-xs font-bold flex items-center gap-1.5 shadow-xs">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />
                      Move closer
                    </span>
                  </div>
                </>
              )}

              {/* CAPTURED PHOTO STATIC PREVIEW VIEW */}
              {cameraState === 'captured' && capturedPhotosMap[activeAngle] && (
                <div className="absolute inset-0 w-full h-full">
                  <img 
                    src={capturedPhotosMap[activeAngle]?.previewUrl} 
                    alt={`Captured ${activeAngle}`} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#C6EADF] text-[#287F78] text-xs font-bold shadow-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#2FA89B]" />
                    <span>Captured: {activeAngle} Photo</span>
                  </div>
                </div>
              )}

              {/* PERMISSION DENIED VIEW */}
              {cameraState === 'denied' && (
                <div className="z-20 bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-[#FDE6B5] text-center max-w-sm space-y-4 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">
                      Camera access is needed to scan your medicine.
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Please allow camera permissions in your browser or choose to upload a photo instead.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      onClick={startCamera}
                      className="w-full min-h-[48px] py-2.5 px-4 rounded-xl bg-[#2FA89B] hover:bg-[#287F78] text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2"
                      aria-label="Try camera again"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Try camera again</span>
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full min-h-[48px] py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-[#E9E8E5] font-bold text-xs flex items-center justify-center gap-2"
                      aria-label="Upload a photo instead"
                    >
                      <Upload className="w-4 h-4 text-[#2FA89B]" />
                      <span>Upload a photo instead</span>
                    </button>
                  </div>
                </div>
              )}

              {/* CAMERA UNAVAILABLE VIEW */}
              {cameraState === 'unavailable' && (
                <div className="z-20 bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-[#E9E8E5] text-center max-w-sm space-y-4 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-500">
                    <CameraOff className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">
                      Camera isn't available on this device.
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      You can still upload a photo of your medicine strip from your device files to proceed.
                    </p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full min-h-[48px] py-2.5 px-4 rounded-xl bg-[#2FA89B] hover:bg-[#287F78] text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2"
                    aria-label="Upload medicine photo"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload a photo</span>
                  </button>
                </div>
              )}

            </div>

            {/* Action Buttons Below Camera Card */}
            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cameraState === 'captured' ? (
                  <>
                    <button
                      onClick={handleRetakePhoto}
                      className="min-h-[48px] py-3.5 px-6 rounded-[14px] bg-white hover:bg-slate-50 text-slate-700 border border-[#E9E8E5] font-bold text-base shadow-xs flex items-center justify-center gap-2 transition-transform active:scale-98"
                      aria-label="Retake photo"
                    >
                      <RotateCcw className="w-5 h-5 text-slate-500" />
                      <span>Retake photo</span>
                    </button>

                    <button
                      onClick={handleProceedToAnalysis}
                      className="min-h-[48px] py-3.5 px-6 rounded-[14px] bg-[#2FA89B] hover:bg-[#287F78] text-white font-bold text-base shadow-xs flex items-center justify-center gap-2 transition-transform active:scale-98"
                      aria-label="Use this photo"
                    >
                      <span>Use this photo</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleCapturePhoto}
                      disabled={cameraState !== 'active'}
                      className="min-h-[48px] py-3.5 px-6 rounded-[14px] bg-[#2FA89B] hover:bg-[#287F78] disabled:opacity-50 text-white font-bold text-base shadow-xs flex items-center justify-center gap-2 transition-transform active:scale-98"
                      aria-label="Capture medicine photo"
                    >
                      <Camera className="w-5 h-5" />
                      <span>Capture photo</span>
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="min-h-[48px] py-3.5 px-6 rounded-[14px] bg-white hover:bg-slate-50 text-slate-700 border border-[#E9E8E5] font-bold text-base flex items-center justify-center gap-2 transition-colors shadow-xs"
                      aria-label="Upload medicine photo"
                    >
                      <Upload className="w-4 h-4 text-[#2FA89B]" />
                      <span>+ Upload photo</span>
                    </button>
                  </>
                )}
              </div>

              {/* Local Privacy Guarantee Note */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium pt-1">
                <Lock className="w-3 h-3 text-[#2FA89B]" />
                <span>Your photo stays on this device until you continue.</span>
              </div>
            </div>

          </div>

          {/* Right-Side Desktop Multi-Photo Panel & Rescue Callout */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Multi-Photo Panel */}
            <div className="bg-white border border-[#E9E8E5] rounded-[24px] p-5 space-y-3 shadow-xs">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                MULTI-PHOTO EVIDENCE
              </h3>

              <div className="space-y-2.5">
                {angleLabels.map((item) => {
                  const capturedPhoto = capturedPhotosMap[item.id];
                  const isCaptured = Boolean(capturedPhoto);
                  const isActive = activeAngle === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => setActiveAngle(item.id)}
                      className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        isActive 
                          ? 'bg-[#E6F4EF] border-[#C6EADF] shadow-xs'
                          : isCaptured
                          ? 'bg-white border-[#E9E8E5]'
                          : 'bg-[#F6F7F5] border-[#E9E8E5] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center border shrink-0 ${
                          isCaptured
                            ? 'bg-[#2FA89B] text-white border-[#2FA89B]'
                            : 'bg-white text-slate-500 border-[#E9E8E5]'
                        }`}>
                          {item.num}
                        </span>
                        <div className="min-w-0 truncate">
                          <p className="text-xs font-bold text-slate-800 truncate">{item.title}</p>
                          <p className="text-[10px] text-slate-500 font-medium truncate">{item.desc}</p>
                        </div>
                      </div>

                      {isCaptured ? (
                        <CheckCircle2 className="w-5 h-5 text-[#2FA89B] shrink-0" />
                      ) : (
                        <Plus className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rescue Callout Panel */}
            <div className="bg-[#F8EFE7] border border-[#F2D7C2] rounded-[24px] p-5 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-[#9E5D24] font-bold text-sm">
                <Sparkles className="w-4 h-4 text-[#9E5D24]" />
                <span>⚡ Strip damaged or faded?</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                MedMatch Rescue can work with partial clues even when packaging is torn or difficult to read.
              </p>
              <button
                onClick={() => setCurrentRoute('rescue')}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-[#9E5D24] border border-[#F2D7C2] font-bold text-xs shadow-xs flex items-center justify-between"
              >
                <span>Learn about Rescue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================== */}
      {/* 2. MIDDLE SECTION: KEY CAPABILITIES        */}
      {/* ========================================== */}
      <section className="space-y-4 pt-4 border-t border-[#E9E8E5]">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Pill className="w-5 h-5 text-[#2FA89B]" />
          <span>Key Capabilities</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div 
              key={i}
              className="bg-white border border-[#E9E8E5] hover:border-[#2FA89B] rounded-[18px] p-5 space-y-3 transition-all hover:shadow-xs group"
            >
              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${f.bg} group-hover:scale-105 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-base text-slate-800">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* 3. BOTTOM SECTION: YOUR SAVED MEDICINES     */}
      {/* ========================================== */}
      <section className="space-y-4 pt-4 border-t border-[#E9E8E5]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Pill className="w-5 h-5 text-[#287F78]" />
            <span>{getStaticTranslation('savedMedicines', lang, 'Your Saved Medicines')}</span>
          </h2>
          <button
            onClick={() => setCurrentRoute('cabinet')}
            className="text-xs font-bold text-[#2FA89B] hover:underline flex items-center gap-1"
          >
            <span>View All ({savedMedicines.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {savedMedicines.length === 0 ? (
          <div className="bg-white border border-[#E9E8E5] rounded-[18px] p-8 text-center space-y-4 shadow-xs">
            <Pill className="w-12 h-12 text-slate-400 mx-auto" />
            <p className="text-slate-600 text-sm font-medium">Your medicine cabinet is empty.</p>
            <button
              onClick={() => setCurrentRoute('home')}
              className="py-3 px-6 rounded-xl bg-[#2FA89B] hover:bg-[#287F78] text-white font-bold text-sm shadow-xs"
            >
              Scan your first medicine
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedMedicines.slice(0, 3).map(med => (
              <div 
                key={med.id}
                onClick={() => setCurrentRoute('details')}
                className="bg-white border border-[#E9E8E5] hover:border-[#2FA89B] rounded-[18px] p-5 cursor-pointer transition-all hover:shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#287F78] px-2.5 py-0.5 rounded-full bg-[#E6F4EF] border border-[#C6EADF]">
                    {med.strength}
                  </span>
                  <span className="text-[11px] text-[#287F78] font-mono font-bold">
                    Expiry: {med.expiryDate}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{med.name}</h3>
                  <p className="text-xs text-slate-500">{med.manufacturer}</p>
                </div>
                <div className="pt-2 border-t border-[#E9E8E5] flex items-center justify-between">
                  <VoiceButton 
                    textToSpeak={med.name + " " + med.strength}
                    label="Listen"
                    size="sm"
                    variant="secondary"
                  />
                  <span className="text-xs font-semibold text-slate-500 hover:text-[#2FA89B]">
                    Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
