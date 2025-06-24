<script>
  import { onMount } from "svelte";

  let users = {
    total: 0,
    verified: 0,
    activeThisWeek: 0,
    newThisMonth: 0,
    mode: "demo",
  };
  let loading = true;
  let hasError = false;

  onMount(async () => {
    try {
      const res = await fetch("/API/usuarios");
      const data = await res.json();

      if (!data.success || data.data.mode === "demo") {
        hasError = true;
      }

      users = data.data;
    } catch (e) {
      hasError = true;
      console.error("Error fetching users:", e);
    } finally {
      loading = false;
    }
  });
</script>

<div class="bg-white rounded-2xl shadow p-6">
  <div class="flex items-center justify-between mb-4">
    <div class="bg-green-100 p-2 rounded-full">
      <svg
        class="w-6 h-6 text-green-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4
        v2h16v-2c0-2.66-5.33-4-8-4z"
          fill="currentColor"
        />
      </svg>
    </div>
    {#if hasError || users.mode === "demo"}
      <span class="text-xs text-orange-500 bg-orange-100 px-2 py-1 rounded"
        >Demo</span
      >
    {:else}
      <span class="text-xs text-green-500 bg-green-100 px-2 py-1 rounded"
        >Live</span
      >
    {/if}
  </div>

  <div class="text-gray-500 text-xs uppercase mb-2">Usuarios Firebase</div>

  <div class="space-y-2">
    <div class="flex justify-between items-center">
      <span class="text-sm text-gray-600">Total:</span>
      <span class="text-2xl font-bold text-gray-800">
        {loading ? "..." : users.total}
      </span>
    </div>

    <div class="flex justify-between items-center">
      <span class="text-sm text-gray-600">Verificados:</span>
      <span class="text-xl font-semibold text-blue-600">
        {loading ? "..." : users.verified}
      </span>
    </div>

    <div class="flex justify-between items-center">
      <span class="text-sm text-gray-600">Activos (semana):</span>
      <span class="text-lg font-semibold text-green-600">
        {loading ? "..." : users.activeThisWeek}
      </span>
    </div>

    <div class="flex justify-between items-center">
      <span class="text-sm text-gray-600">Nuevos (mes):</span>
      <span class="text-lg font-semibold text-purple-600">
        {loading ? "..." : users.newThisMonth}
      </span>
    </div>
  </div>
</div>
