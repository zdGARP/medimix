// Declare cv globally for TypeScript
declare global {
  interface Window {
    cv: any;
  }
}

export type ImageQuality = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ImageQualityResult {
  score: number; // 0 to 100
  quality: ImageQuality;
  reasons: string[];
}

/**
 * Check if OpenCV is loaded and available
 */
export const isCvLoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.cv !== 'undefined' && typeof window.cv.Mat !== 'undefined';
};

/**
 * Wait for OpenCV to initialize
 */
const waitForCv = async (timeoutMs = 5000): Promise<boolean> => {
  if (isCvLoaded()) return true;

  return new Promise((resolve) => {
    const start = Date.now();
    const interval = setInterval(() => {
      if (isCvLoaded()) {
        clearInterval(interval);
        resolve(true);
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(interval);
        resolve(false);
      }
    }, 100);
  });
};

/**
 * Loads a base64 image into an HTMLImageElement
 */
const loadImage = (base64: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = base64;
  });
};

/**
 * Analyzes the quality of an image (blur, brightness, etc.)
 */
export const analyzeImageQuality = async (imageBase64: string): Promise<ImageQualityResult> => {
  const isReady = await waitForCv();
  if (!isReady) {
    console.warn('[OpenCV Service] OpenCV not loaded, falling back to default HIGH quality.');
    return { score: 100, quality: 'HIGH', reasons: [] };
  }

  let src: any;
  let gray: any;
  let laplacian: any;
  
  try {
    const imgElement = await loadImage(imageBase64);
    const cv = window.cv;

    src = cv.imread(imgElement);
    gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

    // 1. Blur Detection (Laplacian Variance)
    laplacian = new cv.Mat();
    cv.Laplacian(gray, laplacian, cv.CV_64F);
    const mean = new cv.Mat();
    const stddev = new cv.Mat();
    cv.meanStdDev(laplacian, mean, stddev);
    
    // Variance is standard deviation squared
    const blurVariance = stddev.data64F[0] * stddev.data64F[0];
    
    mean.delete();
    stddev.delete();

    // 2. Brightness Analysis
    const meanBrightnessMat = new cv.Mat();
    const stdBrightnessMat = new cv.Mat();
    cv.meanStdDev(gray, meanBrightnessMat, stdBrightnessMat);
    const brightness = meanBrightnessMat.data64F[0];
    meanBrightnessMat.delete();
    stdBrightnessMat.delete();

    // Analyze results
    const reasons: string[] = [];
    let score = 100;
    let quality: ImageQuality = 'HIGH';

    // Thresholds (empirically chosen)
    if (blurVariance < 50) {
      score -= 50;
      reasons.push('Image is too blurry');
    } else if (blurVariance < 100) {
      score -= 20;
      reasons.push('Image is slightly blurry');
    }

    if (brightness < 40) {
      score -= 40;
      reasons.push('Image is too dark');
    } else if (brightness > 220) {
      score -= 30;
      reasons.push('Image is too bright / glare detected');
    }

    if (score < 40) {
      quality = 'LOW';
    } else if (score < 80) {
      quality = 'MEDIUM';
    }

    return { score, quality, reasons };
  } catch (err) {
    console.error('[OpenCV Service] Error analyzing image quality:', err);
    return { score: 100, quality: 'HIGH', reasons: ['Error during analysis, fallback to HIGH'] };
  } finally {
    // Explicitly release memory
    if (src) src.delete();
    if (gray) gray.delete();
    if (laplacian) laplacian.delete();
  }
};

/**
 * Preprocesses the image to improve text readability
 * Enhances contrast if the image is dark or slightly blurry
 */
export const preprocessImage = async (imageBase64: string): Promise<string> => {
  const isReady = await waitForCv();
  if (!isReady) {
    console.warn('[OpenCV Service] OpenCV not loaded, skipping preprocessing.');
    return imageBase64;
  }

  let src: any;
  let gray: any;
  let hsv: any;
  let hsvChannels: any;
  let enhanced: any;
  let dst: any;

  try {
    const imgElement = await loadImage(imageBase64);
    const cv = window.cv;

    src = cv.imread(imgElement);
    
    // Check if image is dark to decide on CLAHE
    gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    const meanBrightnessMat = new cv.Mat();
    const stdBrightnessMat = new cv.Mat();
    cv.meanStdDev(gray, meanBrightnessMat, stdBrightnessMat);
    const brightness = meanBrightnessMat.data64F[0];
    meanBrightnessMat.delete();
    stdBrightnessMat.delete();
    
    dst = new cv.Mat();
    
    // Apply contrast enhancement if it's somewhat dark or washed out, but not totally pitch black
    if (brightness > 20 && brightness < 150) {
      hsv = new cv.Mat();
      cv.cvtColor(src, hsv, cv.COLOR_RGBA2RGB); // Use RGB as intermediary for HSV
      cv.cvtColor(hsv, hsv, cv.COLOR_RGB2HSV);
      
      hsvChannels = new cv.MatVector();
      cv.split(hsv, hsvChannels);
      
      // Apply CLAHE to the Value channel
      const clahe = new cv.CLAHE(2.0, new cv.Size(8, 8));
      const vChannel = hsvChannels.get(2);
      enhanced = new cv.Mat();
      clahe.apply(vChannel, enhanced);
      clahe.delete();
      
      // Merge back
      hsvChannels.set(2, enhanced);
      cv.merge(hsvChannels, hsv);
      
      cv.cvtColor(hsv, dst, cv.COLOR_HSV2RGBA);
    } else {
      // Just copy if we don't want to over-process
      src.copyTo(dst);
    }

    // Convert dst back to base64
    const canvas = document.createElement('canvas');
    cv.imshow(canvas, dst);
    return canvas.toDataURL('image/jpeg', 0.9);
  } catch (err) {
    console.error('[OpenCV Service] Error preprocessing image:', err);
    // Graceful fallback
    return imageBase64;
  } finally {
    if (src) src.delete();
    if (gray) gray.delete();
    if (hsv) hsv.delete();
    if (hsvChannels) hsvChannels.delete();
    if (enhanced) enhanced.delete();
    if (dst) dst.delete();
  }
};
