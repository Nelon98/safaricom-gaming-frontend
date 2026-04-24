<script lang="ts">
  import { fade, fly, slide } from 'svelte/transition';
  import { ArrowRight, User, MapPin, Phone, Store, Gamepad2, AlertCircle, Loader2 } from 'lucide-svelte';
  import { NAIROBI_LOCATIONS } from '$lib/constants';
  import SelfieCapture from '../lib/components/SelfieCapture.svelte';
  import ShopRegister from '../lib/components/ShopRegister.svelte';

  // 1. Navigation & Global UI State
  let isStarted = $state(false);
  let userRole = $state<'gamer' | 'shop'>('gamer'); 
  let currentStep = $state(1); 
  let isSubmitting = $state(false);
  let errorMessage = $state<string | null>(null);

  // 2. Gamer Form Data State
  let gamerName = $state('');
  let selectedConstituency = $state('');
  let selectedWard = $state('');
  let mpesaNumber = $state('');
  let selfieImage = $state<string | null>(null);

  // 3. Derived Wards List
  let availableWards = $derived(selectedConstituency ? NAIROBI_LOCATIONS[selectedConstituency] : []);

  // Effect: Reset ward if constituency changes
  $effect(() => {
    if (selectedConstituency) selectedWard = '';
  });

  function handleCapture(imgData: string) {
    selfieImage = imgData;
  }

  // Helper: Normalize M-Pesa (07... -> 254...)
  function normalizeMpesa(phone: string) {
    let clean = phone.replace(/\s+/g, '');
    if (clean.startsWith('0')) return '254' + clean.slice(1);
    if (clean.startsWith('+')) return clean.replace('+', '');
    return clean;
  }

  async function handleSubmit() {
    isSubmitting = true;
    errorMessage = null;

    // Normalization & Trimming (The "Dirty Work" for the backend devs)
    const payload = {
      role: userRole,
      name: gamerName.trim(),
      location: {
        constituency: selectedConstituency,
        ward: selectedWard
      },
      phone: normalizeMpesa(mpesaNumber),
      image: selfieImage
    };

    try {
      // Simulate API call delay
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 10% chance to simulate a network error for testing
          Math.random() > 0.9 ? reject() : resolve(true);
        }, 2000);
      });

      console.log("Payload sent to backend:", payload);
      alert("Registration Successful!");
      
      // Reset flow
      isStarted = false;
      currentStep = 1;
      gamerName = '';
      mpesaNumber = '';
      selfieImage = null;

    } catch (err) {
      errorMessage = "Connection failed. Please check your internet and try again.";
      // Auto-hide error after 5 seconds
      setTimeout(() => errorMessage = null, 5000);
    } finally {
      isSubmitting = false;
    }
  }
</script>

{#if errorMessage}
  <div 
    fixed top-6 right-6 z-50
    class="fixed top-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-[100] w-[90%] md:w-96"
    transition:fly={{ y: -20, duration: 300 }}
  >
    <div class="bg-red-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/20">
      <AlertCircle size={24} />
      <p class="text-sm font-bold">{errorMessage}</p>
      <button onclick={() => errorMessage = null} class="ml-auto opacity-50 hover:opacity-100">×</button>
    </div>
  </div>
{/if}

<main class="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
  
  {#if !isStarted}
    <div class="max-w-4xl w-full space-y-10" in:fade={{ duration: 800 }} out:fly={{ y: -50, duration: 500 }}>
      <h1 class="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter">
        SAFARICOM <span class="text-safaricom-green">GAMING HUB</span>
      </h1>

      <div class="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 group bg-zinc-800">
        <div class="w-full aspect-video flex items-center justify-center relative">
           <img 
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200" 
              alt="Gaming Tournament" 
              class="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
              loading="eager" 
            />
           <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
           <div class="absolute bottom-6 left-6 text-left">
              <span class="bg-safaricom-red text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Live Finals @ Tric Cafe</span>
           </div>
        </div>
      </div>

      <div class="pt-6">
        <button 
          onclick={() => isStarted = true}
          class="inline-flex items-center gap-3 bg-safaricom-green text-white text-xl md:text-3xl font-black py-6 px-16 rounded-2xl
                 shadow-[0_10px_0_#228035] hover:translate-y-[5px] hover:shadow-[0_5px_0_#228035] 
                 active:translate-y-[10px] active:shadow-none transition-all duration-150 uppercase tracking-widest"
        >
          Get Started <ArrowRight size={32} />
        </button>
        <p class="mt-8 text-sm text-gray-400 font-bold uppercase tracking-widest">Nairobi Circuit • 17 Constituencies • One Beast</p>
      </div>
    </div>

  {:else}
    <div class="max-w-xl w-full flex flex-col gap-6" in:fly={{ y: 50, duration: 800 }}>
      
      <div class="flex gap-2 bg-slate-800 p-1 rounded-2xl border border-white/5 {isSubmitting ? 'opacity-50 pointer-events-none' : ''}">
        <button 
          onclick={() => { userRole = 'gamer'; currentStep = 1; }}
          class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all
          {userRole === 'gamer' ? 'bg-safaricom-green text-white shadow-lg' : 'text-gray-500 hover:text-white'}"
        >
          <Gamepad2 size={16} /> I'm a Gamer
        </button>
        <button 
          onclick={() => { userRole = 'shop'; errorMessage = null; }}
          class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all
          {userRole === 'shop' ? 'bg-safaricom-green text-white shadow-lg' : 'text-gray-500 hover:text-white'}"
        >
          <Store size={16} /> I'm a Shop Owner
        </button>
      </div>

      {#if userRole === 'gamer'}
        <div class="bg-slate-800 p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          
          {#if isSubmitting}
            <div class="absolute inset-0 bg-slate-900/80 z-20 backdrop-blur-sm flex flex-col items-center justify-center gap-4" transition:fade>
              <div class="w-12 h-12 border-4 border-safaricom-green border-t-transparent rounded-full animate-spin"></div>
              <p class="text-white font-black uppercase tracking-widest">Verifying Identity...</p>
            </div>
          {/if}

          <div class="flex justify-between mb-8 px-4">
            <div class="flex flex-col items-center gap-2">
                <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold {currentStep === 1 ? 'bg-safaricom-green text-white' : 'bg-green-900 text-green-300'}">1</div>
                <span class="text-[10px] uppercase font-bold text-gray-400">Info</span>
            </div>
            <div class="h-[2px] flex-1 bg-white/10 mt-4 mx-2"></div>
            <div class="flex flex-col items-center gap-2">
                <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold {currentStep === 2 ? 'bg-safaricom-green text-white' : 'bg-slate-700 text-gray-400'}">2</div>
                <span class="text-[10px] uppercase font-bold text-gray-400">Selfie</span>
            </div>
          </div>

          {#if currentStep === 1}
            <div class="text-left mb-8">
              <h2 class="text-3xl font-black text-white uppercase">Gamer <span class="text-safaricom-green">Info</span></h2>
              <p class="text-gray-400 text-sm">Join the Nairobi circuit.</p>
            </div>

            <div class="space-y-6 text-left" in:fade>
              <div class="space-y-2">
                <label for="gamerName" class="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2"><User size={14} /> Full Name</label>
                <input id="gamerName" bind:value={gamerName} type="text" placeholder="Enter Official Name" class="w-full bg-slate-900 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-safaricom-green" />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label for="constituency" class="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2"><MapPin size={14} /> Constituency</label>
                  <select id="constituency" bind:value={selectedConstituency} class="w-full bg-slate-900 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-safaricom-green">
                    <option value="">Choose...</option>
                    {#each Object.keys(NAIROBI_LOCATIONS) as consty}
                      <option value={consty}>{consty}</option>
                    {/each}
                  </select>
                </div>
                <div class="space-y-2">
                  <label for="ward" class="text-xs font-bold uppercase tracking-widest text-gray-400">Ward</label>
                  <select id="ward" bind:value={selectedWard} disabled={!selectedConstituency} class="w-full bg-slate-900 border-none rounded-xl p-4 text-white disabled:opacity-30">
                    <option value="">Choose Ward...</option>
                    {#each availableWards as ward}
                      <option value={ward}>{ward}</option>
                    {/each}
                  </select>
                </div>
              </div>

              <div class="space-y-2">
                <label for="mpesa" class="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2"><Phone size={14} /> M-Pesa Number</label>
                <input id="mpesa" bind:value={mpesaNumber} type="tel" placeholder="07XXXXXXXX" class="w-full bg-slate-900 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-safaricom-green" />
              </div>

              <button 
                onclick={() => currentStep = 2}
                disabled={!gamerName || !selectedWard || !mpesaNumber}
                class="w-full bg-safaricom-green text-white font-black py-5 rounded-2xl shadow-lg hover:bg-green-700 transition-all uppercase tracking-widest disabled:opacity-50"
              >
                Next: Identity Check
              </button>
            </div>
          {:else}
            <div class="text-left mb-8" in:fade>
              <h2 class="text-3xl font-black text-white uppercase">Selfie <span class="text-safaricom-green">Verify</span></h2>
              <p class="text-gray-400 text-sm">Face the camera in good lighting.</p>
            </div>
            
            <SelfieCapture onCapture={handleCapture} />

            <div class="mt-8 space-y-4">
                <button 
                  onclick={handleSubmit} 
                  disabled={!selfieImage || isSubmitting} 
                  class="w-full bg-safaricom-green text-white font-black py-5 rounded-2xl shadow-lg uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {#if isSubmitting}
                    <Loader2 class="animate-spin" /> Sending...
                  {:else}
                    Submit Registration
                  {/if}
                </button>
                <button 
                  onclick={() => currentStep = 1} 
                  disabled={isSubmitting}
                  class="text-gray-500 text-xs font-bold uppercase w-full hover:text-white transition-colors disabled:hidden"
                >
                  Back to Info
                </button>
            </div>
          {/if}
        </div>

      {:else}
        <div class="relative">
          {#if isSubmitting}
             <div class="absolute inset-0 bg-slate-900/80 z-20 backdrop-blur-sm flex flex-col items-center justify-center gap-4 rounded-3xl" transition:fade>
              <div class="w-12 h-12 border-4 border-safaricom-green border-t-transparent rounded-full animate-spin"></div>
              <p class="text-white font-black uppercase tracking-widest">Saving Shop Profile...</p>
            </div>
          {/if}
          <ShopRegister />
        </div>
      {/if}

      <button 
        onclick={() => isStarted = false} 
        disabled={isSubmitting}
        class="text-gray-600 text-[10px] font-bold uppercase tracking-tighter hover:text-white transition-colors disabled:opacity-0"
      >
        Exit Registration
      </button>
    </div>
  {/if}
</main>