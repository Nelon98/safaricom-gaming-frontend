<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly, slide } from 'svelte/transition';
  import { 
    ArrowRight, User, MapPin, Phone, Store, 
    Gamepad2, AlertCircle, Loader2, Camera, X 
  } from 'lucide-svelte';
  
  // Internal Imports
  import { NAIROBI_LOCATIONS } from '$lib/constants';
  import { saveToOutbox } from '$lib/offlineStore';
  import SelfieCapture from '$lib/components/SelfieCapture.svelte';
  import ShopRegister from '$lib/components/ShopRegister.svelte';

  // 1. Navigation & Global UI State
  let isStarted = $state(false);
  let userRole = $state<'gamer' | 'shop'>('gamer'); 
  let currentStep = $state(1); 
  let isSubmitting = $state(false);
  let errorMessage = $state<string | null>(null);
  let successMessage = $state<string | null>(null);

  // 2. Gamer Form Data State
  let gamerName = $state('');
  let selectedConstituency = $state('');
  let selectedWard = $state('');
  let mpesaNumber = $state('');
  let selfieImage = $state<string | null>(null);

  // 3. Derived Wards List
  let availableWards = $derived(selectedConstituency ? NAIROBI_LOCATIONS[selectedConstituency] : []);

  // Reset ward if constituency changes
  $effect(() => {
    if (selectedConstituency) selectedWard = '';
  });

  // Helper: Image Compression
  async function compressImage(base64Str: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
  }

  // Helper: Normalize M-Pesa (07... -> 254...)
  function normalizeMpesa(phone: string) {
    let clean = phone.replace(/\s+/g, '');
    if (clean.startsWith('0')) return '254' + clean.slice(1);
    if (clean.startsWith('+')) return clean.replace('+', '');
    return clean;
  }

  function handleCapture(imgData: string) {
    selfieImage = imgData;
  }

  async function handleSubmit() {
    if (!selfieImage) return;
    
    isSubmitting = true;
    errorMessage = null;

    // 1. Compress Image before saving/sending
    const compressedSelfie = await compressImage(selfieImage);

    const payload = {
      role: userRole,
      name: gamerName.trim(),
      location: {
        constituency: selectedConstituency,
        ward: selectedWard
      },
      phone: normalizeMpesa(mpesaNumber),
      image: compressedSelfie,
      timestamp: new Date().toISOString()
    };

    try {
      // 2. Attempt Live Upload
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Server unreachable');

      successMessage = "Registration Successful!";
      resetForm();
    } catch (err) {
      // 3. BACKUP: Offline Save
      await saveToOutbox(payload);
      errorMessage = "Network weak! Data saved locally and will upload when you're back online.";
      
      // Still reset form so the user can continue their day
      setTimeout(() => {
          resetForm();
          errorMessage = null;
      }, 4000);
    } finally {
      isSubmitting = false;
    }
  }

  function resetForm() {
    isStarted = false;
    currentStep = 1;
    gamerName = '';
    mpesaNumber = '';
    selfieImage = null;
    selectedConstituency = '';
    selectedWard = '';
  }
</script>

{#if errorMessage}
  <div 
    class="fixed top-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-[100] w-[90%] md:w-96"
    transition:fly={{ y: -20, duration: 300 }}
  >
    <div class="bg-red-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/20">
      <AlertCircle size={24} />
      <p class="text-sm font-bold">{errorMessage}</p>
      <button onclick={() => errorMessage = null} class="ml-auto opacity-50 hover:opacity-100 text-2xl">×</button>
    </div>
  </div>
{/if}

{#if successMessage}
  <div 
    class="fixed top-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-[100] w-[90%] md:w-96"
    transition:fly={{ y: -20, duration: 300 }}
  >
    <div class="bg-safaricom-green text-black p-4 rounded-2xl shadow-2xl flex items-center gap-4">
      <div class="bg-black/10 p-1 rounded-full text-black"><ArrowRight size={20} /></div>
      <p class="text-sm font-black uppercase tracking-tight">{successMessage}</p>
    </div>
  </div>
{/if}

<main class="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center overflow-x-hidden">
  
  {#if !isStarted}
    <div class="max-w-4xl w-full space-y-10" in:fade={{ duration: 800 }} out:fly={{ y: -50, duration: 500 }}>
      <h1 class="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter">
        SAFARICOM <span class="text-safaricom-green">GAMING HUB</span>
      </h1>

      <div class="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/5 group bg-zinc-900">
        <div class="w-full aspect-video flex items-center justify-center relative">
           <img 
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200" 
              alt="Gaming Hub" 
              class="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            />
           <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
           <div class="absolute bottom-8 left-8 text-left">
              <span class="bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Nairobi Circuit Live</span>
              <h2 class="text-white text-2xl font-black mt-2 uppercase italic tracking-tighter">Kayole • Embakasi • Langata</h2>
           </div>
        </div>
      </div>

      <div class="pt-6">
        <button 
          onclick={() => isStarted = true}
          class="group relative inline-flex items-center gap-4 bg-safaricom-green text-black text-xl md:text-3xl font-black py-7 px-16 rounded-[2rem]
                 hover:scale-105 transition-all duration-300 uppercase tracking-tighter shadow-[0_20px_40px_rgba(0,230,0,0.25)]"
        >
          Get Started <ArrowRight size={32} class="group-hover:translate-x-2 transition-transform" />
        </button>
        <p class="mt-10 text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">One Circuit • One Beast • One Hub</p>
      </div>
    </div>

  {:else}
    <div class="max-w-xl w-full flex flex-col gap-6" in:fly={{ y: 50, duration: 800 }}>
      
      <div class="flex gap-2 bg-slate-900 p-1.5 rounded-[1.5rem] border border-white/5 {isSubmitting ? 'opacity-30 pointer-events-none' : ''}">
        <button 
          onclick={() => { userRole = 'gamer'; currentStep = 1; }}
          class="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all
          {userRole === 'gamer' ? 'bg-safaricom-green text-black shadow-lg' : 'text-gray-500 hover:text-white'}"
        >
          <Gamepad2 size={16} /> Gamer
        </button>
        <button 
          onclick={() => { userRole = 'shop'; }}
          class="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all
          {userRole === 'shop' ? 'bg-safaricom-green text-black shadow-lg' : 'text-gray-500 hover:text-white'}"
        >
          <Store size={16} /> Shop Owner
        </button>
      </div>

      {#if userRole === 'gamer'}
        <div class="bg-slate-900 p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
          
          {#if isSubmitting}
            <div class="absolute inset-0 bg-black/80 z-20 backdrop-blur-md flex flex-col items-center justify-center gap-4" transition:fade>
              <Loader2 size={48} class="text-safaricom-green animate-spin" />
              <p class="text-white font-black uppercase tracking-widest text-xs">Processing Identity...</p>
            </div>
          {/if}

          <div class="flex justify-between mb-10 px-4">
            <div class="flex flex-col items-center gap-2">
                <div class="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm {currentStep === 1 ? 'bg-safaricom-green text-black' : 'bg-slate-800 text-gray-500'}">01</div>
                <span class="text-[9px] uppercase font-black tracking-widest text-gray-500">Info</span>
            </div>
            <div class="h-[1px] flex-1 bg-white/5 mt-5 mx-4"></div>
            <div class="flex flex-col items-center gap-2">
                <div class="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm {currentStep === 2 ? 'bg-safaricom-green text-black' : 'bg-slate-800 text-gray-500'}">02</div>
                <span class="text-[9px] uppercase font-black tracking-widest text-gray-500">Identity</span>
            </div>
          </div>

          {#if currentStep === 1}
            <div class="text-left mb-8" in:fade>
              <h2 class="text-4xl font-black text-white uppercase italic tracking-tighter">Gamer <span class="text-safaricom-green">Info</span></h2>
              <p class="text-gray-500 text-sm font-medium">Please provide your official registration details.</p>
            </div>

            <div class="space-y-6 text-left" in:fade>
              <div class="space-y-2">
                <label for="gamerName" class="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><User size={12} /> Full Name</label>
                <input id="gamerName" bind:value={gamerName} type="text" placeholder="Enter Full Name" class="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-white focus:ring-2 focus:ring-safaricom-green transition-all" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label for="constituency" class="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><MapPin size={12} /> Constituency</label>
                  <select id="constituency" bind:value={selectedConstituency} class="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-white text-sm">
                    <option value="">Choose...</option>
                    {#each Object.keys(NAIROBI_LOCATIONS) as consty}
                      <option value={consty}>{consty}</option>
                    {/each}
                  </select>
                </div>
                <div class="space-y-2">
                  <label for="ward" class="text-[10px] font-black uppercase tracking-widest text-gray-500">Ward</label>
                  <select id="ward" bind:value={selectedWard} disabled={!selectedConstituency} class="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-white text-sm disabled:opacity-20">
                    <option value="">Select Ward...</option>
                    {#each availableWards as ward}
                      <option value={ward}>{ward}</option>
                    {/each}
                  </select>
                </div>
              </div>

              <div class="space-y-2">
                <label for="mpesa" class="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><Phone size={12} /> M-Pesa Number</label>
                <input id="mpesa" bind:value={mpesaNumber} type="tel" placeholder="07XXXXXXXX" class="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-white focus:ring-2 focus:ring-safaricom-green" />
              </div>

              <button 
                onclick={() => currentStep = 2}
                disabled={!gamerName || !selectedWard || !mpesaNumber}
                class="w-full bg-safaricom-green text-black font-black py-6 rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all uppercase text-sm tracking-widest disabled:opacity-30 mt-4"
              >
                Proceed to Verification
              </button>
            </div>

          {:else}
            <div class="text-left mb-8" in:fade>
              <h2 class="text-4xl font-black text-white uppercase italic tracking-tighter">Selfie <span class="text-safaricom-green">Verify</span></h2>
              <p class="text-gray-500 text-sm">Position your face within the frame.</p>
            </div>
            
            <SelfieCapture onCapture={handleCapture} />

            <div class="mt-10 space-y-4">
                <button 
                  onclick={handleSubmit} 
                  disabled={!selfieImage || isSubmitting} 
                  class="w-full bg-safaricom-green text-black font-black py-6 rounded-2xl shadow-xl uppercase tracking-widest disabled:opacity-30 flex items-center justify-center gap-3 text-sm"
                >
                  {#if isSubmitting}
                    <Loader2 class="animate-spin" size={20} /> Encrypting...
                  {:else}
                    Complete Registration
                  {/if}
                </button>
                <button 
                  onclick={() => currentStep = 1} 
                  disabled={isSubmitting}
                  class="text-gray-500 text-[10px] font-black uppercase w-full hover:text-white transition-colors"
                >
                  Change Info
                </button>
            </div>
          {/if}
        </div>

      {:else}
        <div class="relative">
          {#if isSubmitting}
             <div class="absolute inset-0 bg-black/80 z-20 backdrop-blur-md flex flex-col items-center justify-center gap-4 rounded-[2.5rem]" transition:fade>
              <Loader2 size={48} class="text-safaricom-green animate-spin" />
              <p class="text-white font-black uppercase tracking-widest text-xs">Finalizing Business Profile...</p>
            </div>
          {/if}
          <ShopRegister />
        </div>
      {/if}

      <button 
        onclick={() => isStarted = false} 
        disabled={isSubmitting}
        class="mt-4 text-gray-700 text-[10px] font-black uppercase tracking-[0.3em] hover:text-safaricom-red transition-colors disabled:opacity-0"
      >
        Discard & Exit
      </button>
    </div>
  {/if}
</main>

<style>
  :global(.text-safaricom-green) { color: #00e600; }
  :global(.bg-safaricom-green) { background-color: #00e600; }
  :global(.bg-safaricom-red) { background-color: #e40404; }

  /* Smooth scroll for the entire app */
  :global(html) {
    scroll-behavior: smooth;
    background: #020617;
  }
</style>