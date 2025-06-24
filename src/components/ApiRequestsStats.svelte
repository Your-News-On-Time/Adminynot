<script>
  import { onMount } from "svelte";
  let requests = 0;
  let loading = true;
  let hasError = false;
  let dailyAvg = 0;

  onMount(async () => {
    try {
      const res = await fetch("/API/newsdata-logs");
      const data = await res.json();

      if (data.error) {
        hasError = true;
      }

      requests = data.count;

      // Calcular promedio diario si tenemos estadísticas
      if (data.dailyStats) {
        const days = Object.keys(data.dailyStats).length;
        dailyAvg = days > 0 ? Math.round(requests / days) : 0;
      }
    } catch (e) {
      requests = "—";
      hasError = true;
    } finally {
      loading = false;
    }
  });
</script>

<div class="bg-white rounded-2xl shadow p-6">
  <div class="flex items-center justify-between mb-4">
    <div class="bg-blue-100 p-2 rounded-full">
      <svg
        class="w-6 h-6 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    </div>
    {#if hasError}
      <span class="text-xs text-orange-500 bg-orange-100 px-2 py-1 rounded"
        >Demo</span
      >
    {:else}
      <span class="text-xs text-blue-500 bg-blue-100 px-2 py-1 rounded"
        >Live</span
      >
    {/if}
  </div>

  <div class="text-gray-500 text-xs uppercase mb-2">NewsData.io API</div>

  <div class="space-y-2">
    <div class="flex justify-between items-center">
      <span class="text-sm text-gray-600">Total (30d):</span>
      <span class="text-2xl font-bold text-gray-800">
        {loading ? "..." : requests}
      </span>
    </div>

    <div class="flex justify-between items-center">
      <span class="text-sm text-gray-600">Promedio/día:</span>
      <span class="text-xl font-semibold text-blue-600">
        {loading ? "..." : dailyAvg}
      </span>
    </div>
  </div>
</div>
