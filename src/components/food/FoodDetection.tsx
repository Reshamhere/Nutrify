import { useState, useRef, useEffect } from 'react';
import { Upload, Camera, RefreshCw, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import NutritionCard from './NutritionCard';
import { initModel, classifyImage } from '../../utils/foodRecognition';

interface FoodData {
  name: string;
  confidence: number;
}

const FoodDetection = () => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [detectedFood, setDetectedFood] = useState<FoodData | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const loadModel = async () => {
      try {
        await initModel();
        setIsModelLoading(false);
        toast.success('AI model loaded successfully');
      } catch (error) {
        console.error('Failed to load model:', error);
        toast.error('Failed to load AI model. Please refresh the page.');
      }
    };
    
    loadModel();
    
    return () => {
      stopCamera();
    };
  }, []);
  
  useEffect(() => {
    if (activeTab === 'camera' && !isCameraActive && !isModelLoading) {
      startCamera();
    } else if (activeTab === 'upload' && isCameraActive) {
      stopCamera();
    }
  }, [activeTab, isCameraActive, isModelLoading]);
  
  const startCamera = async () => {
    try {
      stopCamera();
      
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment'
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Unable to access camera. Please check permissions.');
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };
  
  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current || isCapturing) return;
    
    setIsCapturing(true);
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) return;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setPreviewImage(imageDataUrl);
      
      const result = await classifyImage(canvas);
      
      if (result) {
        setDetectedFood(result);
        toast.success(`Detected: ${result.name}`);
      } else {
        toast.error('Unable to identify food. Please try again.');
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      toast.error('Failed to process image. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }
    
    setIsCapturing(true);
    
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          setPreviewImage(event.target.result);
          
          const img = new Image();
          img.onload = async () => {
            if (!canvasRef.current) return;
            
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) return;
            
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            const result = await classifyImage(canvas);
            
            if (result) {
              setDetectedFood(result);
              toast.success(`Detected: ${result.name}`);
            } else {
              toast.error('Unable to identify food. Please try again.');
            }
            
            setIsCapturing(false);
          };
          
          img.src = event.target.result;
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing uploaded image:', error);
      toast.error('Failed to process image. Please try again.');
      setIsCapturing(false);
    }
  };
  
  const resetDetection = () => {
    setDetectedFood(null);
    setPreviewImage(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    if (activeTab === 'camera') {
      startCamera();
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-card rounded-xl overflow-hidden border border-border/40 shadow-subtle">
        <div className="flex border-b border-border/60">
          <button
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'camera' 
                ? 'bg-primary/5 text-primary border-b-2 border-primary' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
            }`}
            onClick={() => {
              setActiveTab('camera');
              resetDetection();
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <Camera className="h-4 w-4" />
              Camera
            </div>
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'upload' 
                ? 'bg-primary/5 text-primary border-b-2 border-primary' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
            }`}
            onClick={() => {
              setActiveTab('upload');
              stopCamera();
              resetDetection();
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </div>
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <div className="relative rounded-lg overflow-hidden bg-muted/30 aspect-[4/3] flex items-center justify-center border border-border/60">
                {isModelLoading ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="flex space-x-2 mb-4">
                      <div className="h-3 w-3 rounded-full bg-primary loading-dot"></div>
                      <div className="h-3 w-3 rounded-full bg-primary loading-dot"></div>
                      <div className="h-3 w-3 rounded-full bg-primary loading-dot"></div>
                    </div>
                    <p className="text-muted-foreground">Loading AI model...</p>
                  </div>
                ) : activeTab === 'camera' ? (
                  <>
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Captured food" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                        onLoadedMetadata={() => {
                          videoRef.current?.play();
                        }}
                      ></video>
                    )}
                  </>
                ) : (
                  <>
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Uploaded food" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <ImageIcon className="h-12 w-12 mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground mb-2">Upload a food image to analyze</p>
                        <p className="text-xs text-muted-foreground">Supports JPG, PNG, WebP</p>
                      </div>
                    )}
                  </>
                )}
                
                {isCapturing && (
                  <div className="absolute inset-0 bg-foreground/10 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <RefreshCw className="h-8 w-8 text-white animate-spin mb-2" />
                      <p className="text-white text-sm font-medium">Analyzing...</p>
                    </div>
                  </div>
                )}
                
                <canvas ref={canvasRef} className="hidden"></canvas>
              </div>
              
              <div className="mt-4 flex gap-4">
                {activeTab === 'camera' ? (
                  <button
                    onClick={captureImage}
                    disabled={isCapturing || !isCameraActive || isModelLoading}
                    className="flex-1 py-2 px-4 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                  >
                    Capture & Analyze
                  </button>
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isCapturing || isModelLoading}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isCapturing || isModelLoading}
                      className="flex-1 py-2 px-4 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                    >
                      Select Image
                    </button>
                  </>
                )}
                
                {previewImage && (
                  <button
                    onClick={resetDetection}
                    disabled={isCapturing}
                    className="py-2 px-4 rounded-lg border border-border bg-secondary text-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/80 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex flex-col">
              {detectedFood ? (
                <NutritionCard foodData={detectedFood} />
              ) : (
                <div className="flex flex-col h-full items-center justify-center p-8 text-center bg-muted/10 rounded-lg border border-border/60">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Camera className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Food Detected Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    {activeTab === 'camera' 
                      ? 'Take a picture of your food to analyze its nutritional content'
                      : 'Upload a food image to analyze its nutritional content'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetection;
