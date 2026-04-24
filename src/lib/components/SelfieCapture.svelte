<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { Camera, RefreshCw, CheckCircle } from 'lucide-svelte';

  const dispatch = createEventDispatcher();
  
  let videoElement: HTMLVideoElement;
  let canvasElement: HTMLCanvasElement;
  let stream: MediaStream | null = null;
  let capturedImage = $state<string | null>(null);
  let isCameraReady = $state(false);

  // Start the camera
  async function startCamera() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 640 }, 
        audio: false 
      });
      videoElement.srcObject = stream;
      isCameraReady = true;
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Please allow camera access to register.");
    }
  }

  function capture() {
    if (!videoElement || !canvasElement) return;
    
    const context = canvasElement.getContext('2d');
    if (context) {
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      context.drawImage(videoElement, 0, 0);
      
      // Convert to Base64/Blob
      capturedImage = canvasElement.toDataURL('image/jpeg', 0.8);
      dispatch('capture', { image: capturedImage });
      
      // Stop the camera to save battery/data
      stopCamera();
    }
  }

  function retake() {
    capturedImage = null;
    startCamera();
  }

  function stopCamera() {
    stream?.getTracks().forEach(track => track.stop());
    isCameraReady = false;
  }

  onMount(() => {
    startCamera();
    return () => stopCamera();
  });
</script>

<div class="flex flex-col items-center gap-6 p-4 bg-slate-900/50 rounded-3xl border border-white/5">
  <div class="relative w-64 h-64 md:w-80 md:h-80 overflow-hidden rounded-full border-4 border-safaricom-green shadow-[0_0_30px_rgba(0,150,57,0.2)]">
    
    {#if !capturedImage}
      <video 
        bind:this={videoElement} 
        autoplay 
        playsinline 
        class="w-full h-full object-cover scale-x-[-1]"
      ></video>
      
      <div class="absolute inset-0 border-[40px] border-slate-900/40 pointer-events-none rounded-full"></div>
    {:else}
      <img src={capturedImage} alt="Captured Selfie" class="w-full h-full object-cover scale-x-[-1]" />
    {/if}

    <canvas bind:this={canvasElement} class="hidden"></canvas>
  </div>

  <div class="flex gap-4">
    {#if !capturedImage}
      <button 
        type="button"
        onclick={capture}
        disabled={!isCameraReady}
        class="bg-safaricom-green text-white p-4 rounded-full hover:scale-105 transition-transform disabled:opacity-50"
      >
        <Camera size={24} />
      </button>
    {:else}
      <button 
        type="button"
        onclick={retake}
        class="bg-slate-700 text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-600 transition-colors"
      >
        <RefreshCw size={18} /> Retake
      </button>
      <div class="flex items-center gap-2 text-safaricom-green font-bold">
        <CheckCircle size={18} /> Ready
      </div>
    {/if}
  </div>
  
  <p class="text-xs text-gray-500 font-bold uppercase tracking-widest text-center">
    Position your face in the circle <br/> Ensure good lighting (No-Mix Rule)
  </p>
</div>