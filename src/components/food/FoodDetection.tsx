import { useState, useRef, useEffect } from 'react';
import { Upload, Camera, RefreshCw, ImageIcon, Play, StopCircle } from 'lucide-react';
import { toast } from 'sonner';
import NutritionCard from './NutritionCard';
import { analyzeFoodImageWithNutrition } from '../../services/visionService';

interface FoodItem {
  name: string;
  quantity?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface FoodDetectionResult {
  foods: FoodItem[];
  primaryFood: FoodItem;
}

const FoodDetection = () => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<FoodDetectionResult | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [inventoryUpdated, setInventoryUpdated] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inventoryUpdated) {
      // You could trigger a refresh here if needed
      setInventoryUpdated(false);
    }
  }, [inventoryUpdated]);
  
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
      setPreviewImage(null);
      setDetectionResult(null);
    }
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current || isCapturing) return;

    setIsCapturing(true);
    
    try {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      
      if (!context) throw new Error('Could not get canvas context');

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // Store the preview image
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setPreviewImage(imageDataUrl);

      // Classify using new API
      const result = await analyzeFoodImageWithNutrition(
        imageDataUrl, 
        import.meta.env.VITE_AZURE_VISION_API_KEY
      );
      
      setDetectionResult(result);
      toast.success(`Detected ${result.foods.length} food item${result.foods.length > 1 ? 's' : ''}`);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Detection failed');
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
        // Add type guard to ensure we have a string result
        if (!event.target?.result || typeof event.target.result !== 'string') {
          throw new Error('Failed to read image file');
        }
        
        const imageDataUrl = event.target.result;
        setPreviewImage(imageDataUrl);
        
        const img = new Image();
        img.onload = async () => {
          if (!canvasRef.current) return;
          
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          
          if (!ctx) return;
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          try {
            // Now we're sure imageDataUrl is a string
            const result = await analyzeFoodImageWithNutrition(
              imageDataUrl, 
              import.meta.env.VITE_AZURE_VISION_API_KEY
            );
            
            setDetectionResult(result);
            toast.success(`Detected ${result.foods.length} food item${result.foods.length > 1 ? 's' : ''}`);
          } catch (error) {
            console.error('API Error:', error);
            toast.error('Failed to analyze image');
          }
        };
        
        img.src = imageDataUrl;
      };
      
      // Read as Data URL which will give us a string result
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing uploaded image:', error);
      toast.error('Failed to process image. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };
  
  const resetDetection = () => {
    setDetectionResult(null);
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
                {activeTab === 'camera' ? (
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
                  <>
                    {!isCameraActive ? (
                      <button
                        onClick={startCamera}
                        disabled={isCapturing}
                        className="flex-1 py-2 px-4 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Start Camera
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={captureImage}
                          disabled={isCapturing || !isCameraActive}
                          className="flex-1 py-2 px-4 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                        >
                          Capture & Analyze
                        </button>
                        <button
                          onClick={stopCamera}
                          disabled={isCapturing}
                          className="py-2 px-4 rounded-lg border border-border bg-secondary text-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
                        >
                          <StopCircle className="h-4 w-4" />
                          Stop Camera
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isCapturing}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isCapturing}
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
              {detectionResult ? (
                <NutritionCard 
                  foodData={detectionResult.foods} 
                  primaryFood={detectionResult.primaryFood} 
                  onAddToInventory={() => setInventoryUpdated(true)}
                />
              ) : (
                <div className="flex flex-col h-full items-center justify-center p-8 text-center bg-muted/10 rounded-lg border border-border/60">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Camera className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Food Detected Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    {activeTab === 'camera' 
                      ? isCameraActive 
                        ? 'Camera is ready. Capture an image to analyze its nutritional content.'
                        : 'Start the camera to begin food detection'
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