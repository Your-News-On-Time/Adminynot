<script>
  import { onMount } from "svelte";
  let users = [];
  let stats = {};
  let loading = true;
  let hasError = false;

  onMount(async () => {
    try {
      const res = await fetch("/API/usuarios-lista");
      const data = await res.json();

      if (!data.success || data.data.mode === "demo") {
        hasError = true;
      }

      users = data.data.users || [];
      stats = {
        total: data.data.totalUsers || 0,
        mode: data.data.mode || "demo",
      };
    } catch (e) {
      hasError = true;
    } finally {
      loading = false;
    }
  });

  function formatDate(dateString) {
    if (!dateString) return "Nunca";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Hoy";
    if (diffDays === 2) return "Ayer";
    if (diffDays <= 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString("es-ES");
  }

  function getProviderIcon(providerId) {
    switch (providerId) {
      case "google.com":
        return "🔍";
      case "facebook.com":
        return "📘";
      case "twitter.com":
        return "🐦";
      case "github.com":
        return "🐙";
      case "apple.com":
        return "🍎";
      default:
        return "📧";
    }
  }
</script>

<div class="bg-white rounded-2xl shadow p-6">
  <div class="flex items-center justify-between mb-6">
    <h3 class="text-lg font-semibold text-gray-800">Lista de Usuarios</h3>
    {#if hasError || stats.mode === "demo"}
      <span class="text-xs text-orange-500 bg-orange-100 px-2 py-1 rounded"
        >Demo</span
      >
    {:else}
      <span class="text-xs text-green-500 bg-green-100 px-2 py-1 rounded"
        >Live</span
      >
    {/if}
  </div>

  {#if loading}
    <div class="flex justify-center py-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
      ></div>
    </div>
  {:else}
    <!-- Estadísticas rápidas -->
    <div class="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
      <div class="text-center">
        <div class="text-2xl font-bold text-blue-600">{stats.total}</div>
        <div class="text-xs text-gray-500">Total Usuarios</div>
      </div>
      <div class="text-center">
        <div class="text-xl font-bold text-green-600">
          {users.filter((u) => u.emailVerified).length}
        </div>
        <div class="text-xs text-gray-500">Verificados</div>
      </div>
    </div>

    <!-- Lista de usuarios -->
    <div class="space-y-3 max-h-96 overflow-y-auto">
      {#each users as user}
        <div
          class="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
        >
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              {#if user.photoURL}
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  class="w-10 h-10 rounded-full"
                />
              {:else}
                <div
                  class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
                >
                  <span class="text-gray-500 text-sm font-medium">
                    {user.displayName
                      ? user.displayName.charAt(0).toUpperCase()
                      : "?"}
                  </span>
                </div>
              {/if}
            </div>
            <div>
              <div class="text-sm font-medium text-gray-900">
                {user.displayName || "Sin nombre"}
                {#if user.emailVerified}
                  <span class="text-green-500 text-xs">✓</span>
                {:else}
                  <span class="text-orange-500 text-xs">⚠</span>
                {/if}
              </div>
              <div class="text-xs text-gray-500">{user.email}</div>
              <div class="flex items-center space-x-2 mt-1">
                {#each user.providerData as provider}
                  <span class="text-xs" title={provider.providerId}>
                    {getProviderIcon(provider.providerId)}
                  </span>
                {/each}
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-xs text-gray-500">Último acceso</div>
            <div class="text-xs font-medium text-gray-700">
              {formatDate(user.lastSignInTime)}
            </div>
          </div>
        </div>
      {/each}
    </div>

    {#if users.length === 0}
      <div class="text-center py-8 text-gray-500">
        No se encontraron usuarios
      </div>
    {/if}
  {/if}
</div>
