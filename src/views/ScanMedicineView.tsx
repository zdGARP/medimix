import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Plus,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { VoiceButton } from '../components/ui/VoiceButton';

export const ScanMedicineView: React.FC = () => {
  const { setCurrentRoute, accessibility, addCapturedPhoto } = useApp();
  const isTa = accessibility.language === 'ta';

  const [activeAngle, setActiveAngle] = useState<'Front' | 'Back' | 'Close-up' | 'Expiry'>('Front');
  const [capturedAngles, setCapturedAngles] = useState<string[]>(['Front']);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const initCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        setCameraError(err.message || 'Camera permission denied or unavailable.');
      }
    };
    initCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const guideTextEn = "Place your medicine strip inside the frame. We will guide you. Hold the camera steady and make sure the lighting is bright.";
  const guideTextTa = "மருந்து அட்டையை நடு சதுரப் பெட்டிக்குள் வைக்கவும். வெளிச்சம் நன்றாக இருக்கிறதா என்று பார்த்து, கேமராவை அசையாமல் பிடித்து ஸ்கேன் பொத்தானை அழுத்தவும்.";

  const sampleMockPhotos = [
    { title: 'Front', src: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80' },
    { title: 'Back', src: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80' },
    { title: 'Close-up', src: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=600&auto=format&fit=crop&q=80' },
    { title: 'Expiry', src: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80' }
  ];

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && !cameraError) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          addCapturedPhoto(dataUrl);
          setCurrentRoute('analysis');
          return;
        }
      }
    }
    
    // Fallback if camera not working
    const currentPhoto = sampleMockPhotos.find(p => p.title === activeAngle)?.src || sampleMockPhotos[0].src;
    addCapturedPhoto(currentPhoto);
    setCurrentRoute('analysis');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          addCapturedPhoto(event.target.result as string);
          setCurrentRoute('analysis');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAngle = (angle: 'Front' | 'Back' | 'Close-up' | 'Expiry') => {
    setActiveAngle(angle);
    if (!capturedAngles.includes(angle)) {
      setCapturedAngles(prev => [...prev, angle]);
    }
  };

  const angleLabels = [
    { id: 'Front' as const, num: '1', title: 'Front of strip', desc: 'Main title & dosage' },
    { id: 'Back' as const, num: '2', title: 'Back of strip', desc: 'Composition details' },
    { id: 'Expiry' as const, num: '3', title: 'Expiry close-up', desc: 'Date stamp & batch' },
    { id: 'Close-up' as const, num: '4', title: 'Tablet / logo', desc: 'Shape & branding' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Page Heading (Matching Reference Screenshot 2) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E9E8E5] p-5 sm:p-6 rounded-[22px] shadow-xs">
        <div>
          <h1 className="text-3xl font-medium text-slate-800 flex items-center gap-2.5">
            <Camera className="w-7 h-7 text-[#2FA89B]" />
            <span>{isTa ? 'மருந்தை ஸ்கேன் செய்' : 'Scan medicine'}</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-normal">
            {isTa ? 'மருந்து அட்டையை சட்டகத்திற்குள் வைக்கவும்.' : 'Place the medicine strip inside the frame. We\'ll guide you.'}
          </p>
        </div>

        <VoiceButton 
          textToSpeak={isTa ? guideTextTa : guideTextEn}
          label={isTa ? '🔊 வழிகாட்டு' : '🔊 "Guide me"'}
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
              <span className="w-2.5 h-2.5 rounded-full bg-[#2FA89B] animate-pulse"></span>
              <span className="font-bold text-slate-700">● Camera ready</span>
            </div>

            <span className="px-3 py-1 rounded-full bg-[#F6F7F5] border border-[#E9E8E5] text-slate-600 font-mono font-bold">
              {capturedAngles.length} / 4 photos
            </span>
          </div>

          {/* Camera Preview Box with Soft Mint Background & White Brackets */}
          <div className="relative bg-[#E6F4EF] border border-[#C6EADF] rounded-[20px] overflow-hidden min-h-[360px] sm:min-h-[420px] flex flex-col items-center justify-center p-4">
            
            {/* Real Camera Feed */}
            {cameraError ? (
              <img 
                src={sampleMockPhotos.find(p => p.title === activeAngle)?.src} 
                alt="Medicine Strip Scan Target" 
                className="absolute inset-0 w-full h-full object-cover opacity-75 filter contrast-105"
              />
            ) : (
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute inset-0 bg-[#E6F4EF]/30 backdrop-blur-[0.5px]"></div>

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

            {/* Status Chips Overlay at Bottom of Preview */}
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
          </div>

          {/* Action Buttons Below Camera Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              onClick={handleCapture}
              className="py-3.5 px-6 rounded-[14px] bg-[#2FA89B] hover:bg-[#287F78] text-white font-bold text-base shadow-xs flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              <Camera className="w-5 h-5" />
              <span>Capture photo</span>
            </button>

            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-3.5 px-6 rounded-[14px] bg-white hover:bg-slate-50 text-slate-700 border border-[#E9E8E5] font-bold text-base flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Upload className="w-4 h-4 text-[#2FA89B]" />
              <span>+ Upload photo</span>
            </button>
          </div>

        </div>

        {/* Right-Side Desktop Multi-Photo Panel & Rescue Callout */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Multi-Photo Panel (Reference Screenshot 2 Style) */}
          <div className="bg-white border border-[#E9E8E5] rounded-[24px] p-5 space-y-3 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
              Multi-Photo Evidence
            </h3>

            <div className="space-y-2.5">
              {angleLabels.map((item) => {
                const isCaptured = capturedAngles.includes(item.id);
                const isActive = activeAngle === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleAddAngle(item.id)}
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-[#E6F4EF] border-[#C6EADF] shadow-xs'
                        : isCaptured
                        ? 'bg-white border-[#E9E8E5]'
                        : 'bg-[#F6F7F5] border-[#E9E8E5] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center border ${
                        isCaptured
                          ? 'bg-[#2FA89B] text-white border-[#2FA89B]'
                          : 'bg-white text-slate-500 border-[#E9E8E5]'
                      }`}>
                        {item.num}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{item.title}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{item.desc}</p>
                      </div>
                    </div>

                    {isCaptured ? (
                      <CheckCircle2 className="w-5 h-5 text-[#2FA89B]" />
                    ) : (
                      <Plus className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rescue Callout Panel (Soft Peach/Amber) */}
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
    </div>
  );
};
