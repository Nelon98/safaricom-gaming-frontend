<script lang="ts">
  import { Search, Users, ShieldCheck, Download, Trash2, Eye, Camera, X, MapPin } from 'lucide-svelte';
  import { fade, slide } from 'svelte/transition';

  // 1. Mock Data (Includes Location & Ward now)
  let gamers = $state([
    { 
      id: 1, 
      name: "Dennis Nelon", 
      phone: "254712345678", 
      role: "Gamer", 
      status: "Verified", 
      date: "2026-04-24", 
      location: "Embakasi Central", 
      ward: "Kayole North",
      photo: null 
    },
    { 
      id: 2, 
      name: "Sarah Wanjiku", 
      phone: "254788990011", 
      role: "Shop Owner", 
      status: "Pending", 
      date: "2026-04-23", 
      location: "Embakasi Central", 
      ward: "Matopeni",
      photo: "https://via.placeholder.com/150" 
    },
    { 
      id: 3, 
      name: "Kevin Otieno", 
      phone: "254112233445", 
      role: "Gamer", 
      status: "Verified", 
      date: "2026-04-24", 
      location: "Embakasi Central", 
      ward: "Kayole South",
      photo: null 
    },
  ]);

  // 2. State Management
  let searchQuery = $state('');
  let selectedUser = $state(null);

  // 3. Reactive Search Logic
  let filteredGamers = $derived(
    gamers.filter(gamer => 
      gamer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      gamer.phone.includes(searchQuery) ||
      gamer.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // 4. Action Handlers
  function openDetails(user) {
    selectedUser = user;
  }

  function closeDetails() {
    selectedUser = null;
  }

  function deleteGamer(id: number) {
    if(confirm("Are you sure? This cannot be undone.")) {
        gamers = gamers.filter(g => g.id !== id);
    }
  }
</script>

<div class="min-h-screen bg-slate-950 text-white p-4 md:p-8 font-sans">
  <header class="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 class="text-4xl font-black uppercase tracking-tighter italic">
        Admin <span class="text-safaricom-green">Console</span>
      </h1>
      <p class="text-gray-400 font-medium tracking-wide text-sm">Safaricom Gaming Hub Circuit Management</p>
    </div>
    
    <div class="flex items-center gap-3">
      <button class="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2 transition-all text-xs font-bold uppercase">
        <Download size={14} /> Export CSV
      </button>
      <div class="bg-safaricom-green/10 text-safaricom-green px-4 py-2 rounded-xl border border-safaricom-green/20 flex items-center gap-2 text-xs font-bold uppercase">
        <ShieldCheck size={14} /> Authenticated
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-slate-900 p-6 rounded-3xl border border-white/5 shadow-xl">
        <p class="text-gray-500 text-[10px] font-black uppercase tracking-widest">Total Registrations</p>
        <h3 class="text-5xl font-black mt-2 tracking-tighter">{gamers.length}</h3>
      </div>
      <div class="bg-slate-900 p-6 rounded-3xl border border-white/5 shadow-xl">
        <p class="text-gray-500 text-[10px] font-black uppercase tracking-widest text-blue-500">Active Gamers</p>
        <h3 class="text-5xl font-black mt-2 tracking-tighter text-blue-500">248</h3>
      </div>
      <div class="bg-slate-900 p-6 rounded-3xl border border-white/5 shadow-xl">
        <p class="text-gray-500 text-[10px] font-black uppercase tracking-widest text-yellow-500">Pending Shops</p>
        <h3 class="text-5xl font-black mt-2 tracking-tighter text-yellow-500">12</h3>
      </div>
    </div>

    <div class="relative group">
      <Search class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-safaricom-green transition-colors" size={20} />
      <input 
        bind:value={searchQuery}
        type="text" 
        placeholder="Search name, phone, or location (e.g. Kayole)..." 
        class="w-full bg-slate-900 border-none rounded-2xl py-5 pl-14 pr-6 text-white focus:ring-2 focus:ring-safaricom-green shadow-2xl transition-all"
      />
    </div>

    <div class="bg-slate-900 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-white/5 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
              <th class="p-6">User Details</th>
              <th class="p-6">Location</th>
              <th class="p-6 text-center">Type</th>
              <th class="p-6">Verification</th>
              <th class="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            {#each filteredGamers as gamer (gamer.id)}
              <tr class="hover:bg-white/[0.02] transition-colors group" in:fade>
                <td class="p-6">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-gray-500 overflow-hidden">
                      {#if gamer.photo}
                        <img src={gamer.photo} alt="User" class="w-full h-full object-cover" />
                      {:else}
                        <Camera size={18} />
                      {/if}
                    </div>
                    <div class="flex flex-col">
                        <span class="font-bold text-base tracking-tight">{gamer.name}</span>
                        <span class="text-xs text-gray-500 font-mono">{gamer.phone}</span>
                    </div>
                  </div>
                </td>
                <td class="p-6">
                    <div class="flex flex-col">
                        <span class="text-sm font-bold">{gamer.location}</span>
                        <span class="text-[10px] text-gray-500 uppercase">{gamer.ward}</span>
                    </div>
                </td>
                <td class="p-6 text-center">
                  <span class="px-3 py-1 rounded-lg text-[10px] font-black uppercase {gamer.role === 'Gamer' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-purple-500/10 text-purple-500 border border-purple-500/20'}">
                    {gamer.role}
                  </span>
                </td>
                <td class="p-6">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full {gamer.status === 'Verified' ? 'bg-safaricom-green shadow-[0_0_8px_rgba(0,255,0,0.5)]' : 'bg-yellow-500 shadow-[0_0_8px_rgba(255,165,0,0.5)]'} animate-pulse"></div>
                    <span class="text-[10px] font-black uppercase tracking-widest">{gamer.status}</span>
                  </div>
                </td>
                <td class="p-6 text-right">
                    <div class="flex justify-end gap-2">
                        <button onclick={() => openDetails(gamer)} class="p-2 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white" title="View Details">
                            <Eye size={18} />
                        </button>
                        <button onclick={() => deleteGamer(gamer.id)} class="p-2 hover:bg-red-500/10 rounded-xl transition-all text-red-500/70 hover:text-red-500" title="Delete">
                            <Trash2 size={18} />
                        </button>
                    </div>
                </td>
              </tr>
            {:else}
              <tr>
                <td colspan="5" class="p-32 text-center text-gray-600 font-black uppercase tracking-widest text-xs">
                  No matching data found
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </main>
</div>

{#if selectedUser}
  <div 
    class="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
    transition:fade
    onclick={closeDetails}
  >
    <div 
      class="bg-slate-900 border border-white/10 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl"
      transition:slide={{ duration: 300 }}
      onclick={(e) => e.stopPropagation()}
    >
      <div class="relative h-72 bg-slate-800">
        {#if selectedUser.photo}
          <img src={selectedUser.photo} alt="Selfie" class="w-full h-full object-cover" />
        {:else}
          <div class="w-full h-full flex flex-col items-center justify-center text-gray-700">
            <Camera size={64} />
            <p class="text-[10px] font-black uppercase mt-4 tracking-widest">No Identity Photo</p>
          </div>
        {/if}
        <button 
          onclick={closeDetails}
          class="absolute top-6 right-6 bg-black/60 hover:bg-black p-3 rounded-full text-white transition-all border border-white/10"
        >
          <X size={20} />
        </button>
      </div>

      <div class="p-8 space-y-8">
        <div class="flex justify-between items-start">
          <div>
            <span class="text-safaricom-green text-[10px] font-black uppercase tracking-[0.3em]">Official Profile</span>
            <h2 class="text-4xl font-black tracking-tighter mt-1">{selectedUser.name}</h2>
          </div>
          <div class="bg-safaricom-green/10 px-4 py-1 rounded-full border border-safaricom-green/20">
            <span class="text-safaricom-green text-[10px] font-black uppercase">{selectedUser.role}</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-8">
          <div class="space-y-1">
            <p class="text-gray-500 text-[10px] font-black uppercase tracking-widest">Contact</p>
            <p class="font-mono text-xl">{selectedUser.phone}</p>
          </div>
          <div class="space-y-1">
            <p class="text-gray-500 text-[10px] font-black uppercase tracking-widest">Registered On</p>
            <p class="font-bold text-xl">{selectedUser.date}</p>
          </div>
          
          <div class="col-span-2 space-y-3 bg-white/5 p-5 rounded-3xl border border-white/5">
             <div class="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                <MapPin size={12} /> Registered Area
             </div>
             <p class="text-xl font-bold">
                {selectedUser.location} <span class="text-safaricom-green/50 mx-2">—</span> {selectedUser.ward}
             </p>
          </div>
        </div>

        <div class="pt-2 flex gap-4">
          <button 
            onclick={closeDetails}
            class="flex-1 bg-safaricom-green text-black font-black py-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase text-sm tracking-tight shadow-[0_10px_20px_rgba(0,230,0,0.2)]"
          >
            Approve Registration
          </button>
          <button class="px-8 bg-red-500/10 text-red-500 font-black rounded-2xl hover:bg-red-500/20 transition-all uppercase text-[10px] tracking-widest border border-red-500/20">
            Flag
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Custom Safaricom Color if not in Tailwind config */
  :global(.text-safaricom-green) {
    color: #00e600;
  }
  :global(.bg-safaricom-green) {
    background-color: #00e600;
  }
</style>