<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { 
    Store, Monitor, Users, MapPin, Gamepad2, 
    Loader2, CheckCircle2, Wifi, Image as ImageIcon 
  } from 'lucide-svelte';
  import { NAIROBI_LOCATIONS } from '$lib/constants';

  // 1. Form State (Using Svelte 5 Runes)
  let shopName = $state('');
  let selectedConstituency = $state('');
  let selectedWard = $state('');
  let ps5Count = $state(1);
  let hasStableInternet = $state(false);
  
  // 2. UI State
  let isSubmitting = $state(false);
  let isSuccess = $state(false);

  // 3. Derived Logic (Calculates automatically)
  let availableWards = $derived(selectedConstituency ? NAIROBI_LOCATIONS[selectedConstituency] : []);
  let isValid = $derived(
    shopName.trim().length > 2 && 
    selectedWard && 
    hasStableInternet && 
    ps5Count > 0
  );

  async function handleShopSubmit() {
    isSubmitting = true;
    
    const payload = {
      shopName: shopName.trim(),
      location: {
        constituency: selectedConstituency,
        ward: selectedWard
      },
      equipment: {
        ps5s: ps5Count,
        internet: hasStableInternet
      },
      timestamp: new Date().toISOString()
    };

    try {
      // API call simulation
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Shop Data Registered:", payload);
      isSuccess = true;
    } catch (error) {
      alert("Submission failed. Check your connection.");
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="max-w-2xl mx-auto bg-slate-900 p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden" in:fly={{ y: 30 }}>
  
  {#if isSuccess}
    <div class="py-12 flex flex-col items-center justify-center text-center space-y-6" in:fade>
      <div class="w-24 h-24 bg-safaricom-green/10 rounded-full flex items-center justify-center text-safaricom-green border border-safaricom-green/20">
        <CheckCircle2 size={56} />
      </div>
      <div>
        <h2 class="text-4xl font-black text-white uppercase italic tracking-tighter">Venue <span class="text-safaricom-green">Pending</span></h2>
        <p class="text-gray-400 mt-4 text-sm leading-relaxed">
          The Safaricom technical team will visit <br/> 
          <span class="text-white font-bold underline decoration-safaricom-green underline-offset-4">{shopName}</span> <br/>
          for onsite verification within 48 hours.
        </p>
      </div>
      <button 
        onclick={() => { isSuccess = false; shopName = ''; }}
        class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-safaricom-green transition-colors mt-8"
      >
        Register another branch
      </button>
    </div>
  {:else}
    {#if isSubmitting}
      <div class="absolute inset-0 bg-black/80 z-50 backdrop-blur-md flex flex-col items-center justify-center gap-4" transition:fade>
        <Loader2 class="animate-spin text-safaricom-green" size={48} />
        <p class="text-white font-black uppercase tracking-widest text-xs">Uploading Shop Profile...</p>
      </div>
    {/if}

    <div class="text-left mb-10 border-b border-white/5 pb-6">
      <h2 class="text-4xl font-black text-white uppercase italic tracking-tighter">Host <span class="text-safaricom-green">Registration</span></h2>
      <p class="text-gray-500 text-xs font-medium uppercase tracking-widest mt-1">Official Tournament Venue Partnership</p>
    </div>

    <form class="space-y-7 text-left" onsubmit={(e) => { e.preventDefault(); handleShopSubmit(); }}>
      
      <div class="space-y-3">
        <label for="shopName" class="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
          <Store size={14} class="text-safaricom-green" /> Shop / Business Name
        </label>
        <input 
          id="shopName"
          bind:value={shopName}
          type="text" 
          required
          placeholder="e.g., SmartPhoneHub Gaming Center" 
          class="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-white focus:ring-2 focus:ring-safaricom-green transition-all" 
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-3">
          <label for="shopConstituency" class="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
            <MapPin size={14} class="text-safaricom-green" /> Constituency
          </label>
          <select id="shopConstituency" bind:value={selectedConstituency} class="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-white focus:ring-2 focus:ring-safaricom-green text-sm">
            <option value="">Choose Area...</option>
            {#each Object.keys(NAIROBI_LOCATIONS) as consty}
              <option value={consty}>{consty}</option>
            {/each}
          </select>
        </div>
        <div class="space-y-3">
          <label for="shopWard" class="text-[10px] font-black uppercase tracking-widest text-gray-500">Ward</label>
          <select id="shopWard" bind:value={selectedWard} disabled={!selectedConstituency} class="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-white disabled:opacity-20 focus:ring-2 focus:ring-safaricom-green text-sm">
            <option value="">Select Ward...</option>
            {#each availableWards as ward}
              <option value={ward}>{ward}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="p-6 bg-black/40 rounded-[2rem] border border-white/5">
        {#if ps5Count < 1}
          <div class="flex flex-col items-center justify-center py-6 border-2 border-dashed border-white/5 rounded-2xl" in:fade>
            <Gamepad2 class="text-white/5 mb-3" size={40} />
            <p class="text-gray-500 text-[9px] uppercase font-black tracking-[0.2em] text-center">Equipment Warning: <br/> Minimum 1 PS5 unit required</p>
          </div>
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8" in:fade>
            <div class="space-y-3">
              <label for="ps5Count" class="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <Monitor size={14} class="text-safaricom-green" /> PS5 Units
              </label>
              <input 
                id="ps5Count"
                bind:value={ps5Count}
                type="number" 
                min="1"
                class="w-full bg-slate-900 border-none rounded-xl p-4 text-white font-bold focus:ring-2 focus:ring-safaricom-green" 
              />
            </div>

            <div class="space-y-2 flex flex-col justify-center">
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 italic">Hub Potential</label>
              <div class="flex items-center gap-3 text-xs text-white font-bold bg-white/5 p-3 rounded-xl border border-white/5">
                 <Users size={18} class="text-safaricom-green" />
                 <span>Capacity: {ps5Count * 2}+ Gamers</span>
              </div>
            </div>
          </div>
        {/if}
      </div>

      <div class="flex items-center gap-4 p-5 bg-safaricom-green/5 border border-safaricom-green/10 rounded-[1.5rem] transition-all hover:bg-safaricom-green/10">
          <input 
              type="checkbox" 
              bind:checked={hasStableInternet}
              id="internet"
              class="w-7 h-7 rounded-lg border-none bg-black text-safaricom-green focus:ring-safaricom-green cursor-pointer" 
          />
          <label for="internet" class="text-xs font-black uppercase tracking-tight cursor-pointer select-none flex items-center gap-2 text-white">
              <Wifi size={16} class={hasStableInternet ? 'text-safaricom-green' : 'text-gray-600'} />
              Stable Fibre / 5G Connection Confirmed
          </label>
      </div>

      <div class="space-y-3">
        <label for="photos" class="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
          <ImageIcon size={14} /> Shop Gallery (Interior & Exterior)
        </label>
        <div class="relative group">
          <input 
            id="photos"
            type="file" 
            accept="image/*" 
            multiple
            class="w-full text-[10px] text-gray-500 file:mr-6 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-safaricom-green file:text-black hover:file:brightness-110 cursor-pointer bg-white/5 p-2 rounded-2xl border border-dashed border-white/10 group-hover:border-safaricom-green/50 transition-all" 
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={!isValid || isSubmitting}
        class="w-full bg-safaricom-green text-black font-black py-6 rounded-[2rem] shadow-[0_15px_30px_rgba(0,230,0,0.2)] hover:scale-[1.02] active:scale-95 transition-all uppercase text-sm tracking-widest disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
      >
        {#if isSubmitting}
          <Loader2 class="animate-spin" size={24} /> Validating...
        {:else}
          Submit Host Application
        {/if}
      </button>
    </form>
  {/if}
</div>

<style>
  :global(.text-safaricom-green) { color: #00e600; }
  :global(.bg-safaricom-green) { background-color: #00e600; }
  
  /* Hide arrows on number input */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    opacity: 1;
  }
</style>