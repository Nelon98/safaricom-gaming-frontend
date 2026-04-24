<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { Store, Monitor, Users, MapPin, Gamepad2, Loader2, CheckCircle2, Wifi } from 'lucide-svelte';
  import { NAIROBI_LOCATIONS } from '$lib/constants';

  // 1. Form State
  let shopName = $state('');
  let selectedConstituency = $state('');
  let selectedWard = $state('');
  let ps5Count = $state(1);
  let hasStableInternet = $state(false);
  
  // 2. UI State
  let isSubmitting = $state(false);
  let isSuccess = $state(false);

  // 3. Derived Logic
  let availableWards = $derived(selectedConstituency ? NAIROBI_LOCATIONS[selectedConstituency] : []);
  let isValid = $derived(shopName.trim().length > 2 && selectedWard && hasStableInternet && ps5Count > 0);

  async function handleShopSubmit() {
    isSubmitting = true;
    
    // Normalization (Trimming for the backend devs)
    const payload = {
      shopName: shopName.trim(),
      location: {
        constituency: selectedConstituency,
        ward: selectedWard
      },
      equipment: {
        ps5s: ps5Count,
        internet: hasStableInternet
      }
    };

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Shop Data Registered:", payload);
      isSuccess = true;
    } catch (error) {
      alert("Submission failed. Check connection.");
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="max-w-2xl mx-auto bg-slate-800 p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden" in:fly={{ y: 30 }}>
  
  {#if isSuccess}
    <div class="py-12 flex flex-col items-center justify-center text-center space-y-6" in:fade>
      <div class="w-20 h-20 bg-safaricom-green/20 rounded-full flex items-center justify-center text-safaricom-green">
        <CheckCircle2 size={48} />
      </div>
      <div>
        <h2 class="text-3xl font-black text-white uppercase">Application <span class="text-safaricom-green">Sent!</span></h2>
        <p class="text-gray-400 mt-2">The Safaricom technical team will visit <br/> <span class="text-white font-bold">{shopName}</span> for verification soon.</p>
      </div>
      <button 
        onclick={() => isSuccess = false}
        class="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
      >
        Register another branch
      </button>
    </div>
  {:else}
    {#if isSubmitting}
      <div class="absolute inset-0 bg-slate-900/80 z-50 backdrop-blur-sm flex flex-col items-center justify-center gap-4" transition:fade>
        <Loader2 class="animate-spin text-safaricom-green" size={40} />
        <p class="text-white font-black uppercase tracking-widest">Registering Venue...</p>
      </div>
    {/if}

    <div class="text-left mb-8 border-b border-white/5 pb-4">
      <h2 class="text-3xl font-black text-white uppercase">Host <span class="text-safaricom-green">Registration</span></h2>
      <p class="text-gray-400 text-sm italic">Register your PlayStation Shop as an official tournament venue.</p>
    </div>

    <form class="space-y-6 text-left" onsubmit={(e) => { e.preventDefault(); handleShopSubmit(); }}>
      
      <div class="space-y-2">
        <label for="shopName" class="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
          <Store size={14} /> Shop Name
        </label>
        <input 
          id="shopName"
          bind:value={shopName}
          type="text" 
          placeholder="e.g., Gaming Paradise Kayole" 
          class="w-full bg-slate-900 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-safaricom-green" 
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label for="shopConstituency" class="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <MapPin size={14} /> Constituency
          </label>
          <select id="shopConstituency" bind:value={selectedConstituency} class="w-full bg-slate-900 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-safaricom-green">
            <option value="">Choose...</option>
            {#each Object.keys(NAIROBI_LOCATIONS) as consty}
              <option value={consty}>{consty}</option>
            {/each}
          </select>
        </div>
        <div class="space-y-2">
          <label for="shopWard" class="text-xs font-bold uppercase tracking-widest text-gray-400">Ward</label>
          <select id="shopWard" bind:value={selectedWard} disabled={!selectedConstituency} class="w-full bg-slate-900 border-none rounded-xl p-4 text-white disabled:opacity-30 focus:ring-2 focus:ring-safaricom-green">
            <option value="">Choose Ward...</option>
            {#each availableWards as ward}
              <option value={ward}>{ward}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="p-6 bg-slate-900/50 rounded-2xl border border-white/5">
        {#if ps5Count < 1}
          <div class="flex flex-col items-center justify-center py-4 border-2 border-dashed border-white/10 rounded-xl" in:fade>
            <Gamepad2 class="text-white/5 mb-2" size={32} />
            <p class="text-gray-500 text-[10px] uppercase font-bold tracking-widest text-center">Minimum 1 PS5 required <br/> to be a host</p>
          </div>
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6" in:fade>
            <div class="space-y-2">
              <label for="ps5Count" class="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Monitor size={14} /> Number of PS5s
              </label>
              <input 
                id="ps5Count"
                bind:value={ps5Count}
                type="number" 
                min="1"
                class="w-full bg-slate-800 border-none rounded-xl p-3 text-white focus:ring-2 focus:ring-safaricom-green" 
              />
            </div>

            <div class="space-y-2 flex flex-col justify-center">
              <label class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Tournament Capacity</label>
              <div class="flex items-center gap-2 text-sm text-white font-medium">
                 <Users size={16} class="text-safaricom-green" />
                 <span>Fits 8+ Gamers</span>
              </div>
            </div>
          </div>
        {/if}
      </div>

      <div class="flex items-center gap-3 p-4 bg-safaricom-green/5 border border-safaricom-green/20 rounded-xl group transition-colors hover:bg-safaricom-green/10">
          <input 
              type="checkbox" 
              bind:checked={hasStableInternet}
              id="internet"
              class="w-6 h-6 rounded border-none bg-slate-900 text-safaricom-green focus:ring-safaricom-green cursor-pointer" 
          />
          <label for="internet" class="text-sm font-medium cursor-pointer select-none flex items-center gap-2">
              <Wifi size={16} class={hasStableInternet ? 'text-safaricom-green' : 'text-gray-500'} />
              We have stable Safaricom Home Fibre / 5G
          </label>
      </div>

      <div class="space-y-2">
        <label for="photos" class="text-xs font-bold uppercase tracking-widest text-gray-400">Upload Shop Setup Photos</label>
        <input 
          id="photos"
          type="file" 
          accept="image/*" 
          multiple
          class="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-safaricom-green file:text-white hover:file:bg-green-700 cursor-pointer" 
        />
      </div>

      <button 
        type="submit" 
        disabled={!isValid || isSubmitting}
        class="w-full bg-safaricom-green text-white font-black py-5 rounded-2xl shadow-lg hover:bg-green-700 transition-all uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {#if isSubmitting}
          <Loader2 class="animate-spin" size={20} /> Processing...
        {:else}
          Submit Host Application
        {/if}
      </button>
    </form>
  {/if}
</div>