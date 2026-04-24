<script lang="ts">
  import { onMount } from 'svelte';
  import { Camera, RefreshCw, CheckCircle, AlertCircle } from 'lucide-svelte';

  // Svelte 5 Props (Replaces createEventDispatcher)
  let { onCapture } = $props<{ onCapture: (img: string) => void }>();

  // Reactive State and Bindings
  let videoElement = $state<HTMLVideoElement | null>(null);
  let canvasElement = $state<HTMLCanvasElement | null>(null);
  let stream: MediaStream | null = null;
  let capturedImage = $state<string | null>(null);
  let isCameraReady = $state(false);
  let cameraError = $state<string | null>(null);

  // Start the camera
  async function startCamera() {
    cameraError = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user', 
          width: { ideal: 640 }, 
          height: { ideal: 640 } 
        }, 
        audio: false 
      });
      
      if (videoElement) {
        videoElement.srcObject = stream;
        isCameraReady = true;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      cameraError = "Access Denied. Please enable camera permissions.";
    }
  }

  function capture() {
    if (!videoElement || !canvasElement) return;
    
    const context = canvasElement.getContext('2d');
    if (context) {
      // Set canvas to match the video's actual stream size
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      
      // Mirror the capture to match the mirrored preview
      context.translate(canvasElement.width, 0);
      context.scale(-1, 1);
      
      context.drawImage(videoElement, 0, 0);
      
      // Convert to Base64 (JPEG at 70% quality for optimal size)
      capturedImage = canvasElement.toDataURL('image/jpeg', 0.7);
      
      // Send to parent component (+page.svelte)
      onCapture(capturedImage);
      
      stopCamera();
    }
  }

  function retake() {
    capturedImage = null;
    startCamera();
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }
    isCameraReady = false;
  }

  onMount(() => {
    startCamera();
    return () => stopCamera();
  });
</script>

<div class="flex flex-col items-center gap-6 p-6 bg-black/20 rounded-[2.5rem] border border-white/5 backdrop-blur-sm">
  
  <div class="relative w-64 h-64 md:w-80 md:h-80 overflow-hidden rounded-full border-4 border-safaricom-green shadow-[0_0_40px_rgba(0,230,0,0.15)] bg-slate-800">
    
    {#if cameraError}
      <div class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-900">
        <AlertCircle class="text-red-500 mb-2" size={32} />
        <p class="text-[10px] font-black uppercase text-gray-400">{cameraError}</p>
      </div>
    {:else if !capturedImage}
      <video 
        bind:this={videoElement} 
        autoplay 
        playsinline 
        class="w-full h-full object-cover scale-x-[-1]"
      ></video>
      
      <div class="absolute inset-0 border-[30px] border-slate-900/40 pointer-events-none rounded-full"></div>
    {:else}
      <img src={capturedImage} alt="Captured Selfie" class="w-full h-full object-cover" />
    {/if}

    <canvas bind:this={canvasElement} class="hidden"></canvas>
  </div>

  <div class="flex items-center gap-4">
    {#if !capturedImage}
      <button 
        type="button"
        onclick={capture}
        disabled={!isCameraReady}
        class="bg-safaricom-green text-black p-5 rounded-full hover:scale-110 active:scale-90 transition-all disabled:opacity-30 shadow-lg"
      >
        <Camera size={28} />
      </button>
    {:else}
      <button 
        type="button"
        onclick={retake}
        class="bg-white/10 text-white px-8 py-3 rounded-2xl flex items-center gap-2 hover:bg-white/20 transition-all font-black uppercase text-xs tracking-widest"
      >
        <RefreshCw size={16} /> Retake
      </button>
      <div class="flex items-center gap-2 text-safaricom-green bg-safaricom-green/10 px-4 py-3 rounded-2xl border border-safaricom-green/20">
        <CheckCircle size={18} />
        <span class="text-[10px] font-black uppercase tracking-widest">Image Set</span>
      </div>
    {/if}
  </div>
  
  <div class="text-center">
    <p class="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] leading-relaxed">
      Center your face in the hub circle <br/>
      <span class="text-white/40 italic">Ensure lighting is clear (No-Mix Rule)</span>
    </p>
  </div>
</div>

<style>
  /* Local color definition if not using a global tailwind theme */
  :global(.text-safaricom-green) {
    color: #00e600;
  }
  :global(.border-safaricom-green) {
    border-color: #00e600;
  }
</style>