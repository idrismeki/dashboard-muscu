<template>
  <div>
    <header class="site-header">
      <div class="container header-inner">
        <NuxtLink to="/" class="logo">Dashboard Muscu</NuxtLink>
        <nav class="nav">
          <NuxtLink to="/">Tableau de bord</NuxtLink>
          <NuxtLink to="/seance/nouvelle">Nouvelle séance</NuxtLink>
          <NuxtLink to="/historique">Historique</NuxtLink>
        </nav>
      </div>
    </header>
    <main class="container">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.site-header {
  background: var(--ink);
  color: #fff;
}
.header-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.logo {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.3rem;
  text-transform: uppercase;
  text-decoration: none;
  border-left: 6px solid var(--plate-25);
  padding-left: 0.6rem;
}
.nav {
  display: flex;
  gap: 1rem;
}
.nav a {
  color: #d5d7db;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 0.25rem 0;
}
.nav a.router-link-active {
  color: #fff;
  border-bottom: 2px solid var(--plate-25);
}
</style>
