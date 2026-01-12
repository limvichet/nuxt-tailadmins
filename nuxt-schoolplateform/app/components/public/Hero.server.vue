<script setup lang="ts">
const quickOptions: string[] = [
  "ងាយស្រួលប្រើប្រាស់",
  "មានការ support 24/7",
  "មានសុវត្ថិភាព",
];
</script>
<template>
  <section class="mt-14">
    <!-- hero container -->
    <div
      class="px-4 md:px-4 public-prefer:px-0 mx-auto max-w-public-prefer grid grid-cols-1 lg:grid-cols-2 items-center gap-4"
    >
      <!-- left side -->
      <div class="flex flex-col gap-5 items-center lg:items-start">
        <span class="small-public-highlight">លំហូរនៃកិច្ចការរដ្ឋបាល</span>
        <h2
          class="lg:text-left text-3xl md:text-5xl font-bold leading-10 md:leading-14 text-center text-zinc-900"
        >
          សម្រួលរាល់កិច្ចការ <br />
          <span class="text-public-red">រដ្ឋបាលរបស់សាលារៀន</span>
        </h2>
        <p class="lg:text-left text-xl text-balance text-gray-600 text-center">
          តើលោកគ្រូ អ្នកគ្រូចំណាយពេលវេលាច្រើនលើកិច្ចការរដ្ឋបាលមែនទេ?
          អស់បារម្មណ៍ទៀតហើយជាមួយនឹងកម្មវិធីរបស់ពួកយើង!
        </p>
        <div
          class="flex flex-col md:flex-row items-center gap-4 w-full md:w-max md:mx-auto lg:m-0"
        >
          <NuxtLink
            to="/app/dashboard"
            class="group w-full md:w-max md:px-6 h-max flex justify-center items-center gap-1 bg-public-red rounded-lg py-2 text-white font-bold cursor-pointer lg:hover:bg-public-red/80 transition duration-200 shrink-0"
          >
            <span>ប្រើប្រាស់ឥឡូវនេះ</span>
            <span class="group-hover:translate-x-1.5 transition duration-300"
              >&rightarrow;</span
            >
          </NuxtLink>
          <NuxtLink
            to="#contact"
            class="text-center md:px-6 py-2 rounded-lg border border-public-red/30 font-bold w-full md:w-max cursor-pointer bg-transparent lg:hover:bg-public-red/10 transition duration-200 shrink-0 text-zinc-900"
          >
            កក់នូវសេវាកម្ម
          </NuxtLink>
        </div>
        <ul class="flex flex-col items-start gap-2 mb-6 md:flex-row lg:gap-6">
          <li
            v-for="opt in quickOptions"
            :key="opt"
            class="flex items-center gap-2 *:first:text-public-red *:first:text-lg"
          >
            <Icon name="lucide:check" />
            <span class="text-gray-700">{{ opt }}</span>
          </li>
        </ul>
      </div>
      <!-- right side -->
      <div
        class="md:w-3/4 md:mx-auto lg:w-full p-4 border-2 border-primary/30 rounded-md shadow-sm shadow-primary/10 relative mask-[linear-gradient(to_bottom,white_50%,transparent_100%)] animate-slide-up duration-600 transition-[translate,opacity] starting:translate-y-6 starting:opacity-0"
      >
        <LazyPublicHeroImage
          hydrate-on-visible
          class="aspect-[6.63/3.57] object-cover w-full h-full"
        />
      </div>
    </div>
  </section>
</template>
