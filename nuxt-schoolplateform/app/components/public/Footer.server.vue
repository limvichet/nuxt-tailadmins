<script setup lang="ts"></script>

<template>
  <footer class="bg-zinc-900 py-8">
    <div
      class="px-4 md:px-4 public-prefer:px-0 mx-auto max-w-public-prefer flex flex-col gap-4 md:flex-row md:justify-between items-center"
    >
      <h3 class="text-white">
        &copy; 2025 រក្សាសិទ្ធិគ្រប់យ៉ាងដោយ
        <span class="text-public-red">1EZ</span>.
      </h3>
      <ul
        class="flex items-center gap-4 md:gap-6 text-white *:duration-200 *:hover:text-public-red"
      >
        <li v-for="item in headerItems" :key="item.url">
          <NuxtLink :to="item.url">{{ item.name }}</NuxtLink>
        </li>
      </ul>
    </div>
  </footer>
</template>
