<script>
  import { onMount } from "svelte";
  let todayStats = { requests: 0, limit: 200, remaining: 200, percentage: 0 };
  let recentRequests = [];
  let loading = true;
  let hasError = false;
  let data = { isReal: false };

  onMount(async () => {
    try {
      const res = await fetch("/API/newsdata-today");
      data = await res.json();

      if (data.error) {
        hasError = true;
      }

      todayStats = data.today;
      recentRequests = data.recentRequests || [];
    } catch (e) {
      hasError = true;
    } finally {
      loading = false;
    }
  });
</script>

<div class="bg-white rounded-2xl shadow p-6">
  <div class="flex items-center justify-between mb-4">
    <div class="bg-orange-100 p-2 rounded-full">
      <svg
        class="w-6 h-6 text-orange-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    </div>
    {#if hasError || !data.isReal}
      <span class="text-xs text-orange-500 bg-orange-100 px-2 py-1 rounded"
        >Demo</span
      >
    {:else}
      <span class="text-xs text-green-500 bg-green-100 px-2 py-1 rounded"
        >Live</span
      >
    {/if}
  </div>

  <div class="text-gray-500 text-xs uppercase mb-3">NewsData.io - Hoy</div>

  <div class="space-y-3">
    <div class="flex justify-between items-center">
      <span class="text-sm text-gray-600">Peticiones:</span>
      <span class="text-2xl font-bold text-orange-600">
        {loading ? "..." : todayStats.requests}
      </span>
    </div>

    <div class="flex justify-between items-center">
      <span class="text-sm text-gray-600">de {todayStats.limit}</span>
      <span class="text-sm font-medium text-gray-500">
        {loading ? "..." : `${todayStats.remaining} restantes`}
      </span>
    </div>

    <!-- Barra de progreso -->
    <div class="w-full bg-gray-200 rounded-full h-2">
      <div
        class="bg-orange-500 h-2 rounded-full transition-all duration-300"
        style="width: {loading ? 0 : todayStats.percentage}%"
      ></div>
    </div>

    <div class="text-center text-xs text-gray-500">
      {loading ? "..." : `${todayStats.percentage}% usado`}
    </div>
  </div>

  {#if recentRequests.length > 0}
    <div class="mt-4 pt-4 border-t border-gray-100">
      <div class="text-xs text-gray-500 mb-2">Peticiones recientes</div>
      <div class="space-y-1 max-h-20 overflow-y-auto">
        {#each recentRequests.slice(0, 3) as request}
          <div class="flex justify-between text-xs">
            <span class="text-gray-600">{request.time}</span>
            <span class="text-gray-500">{request.query}</span>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
