<script setup lang="ts">
const headerButtons: {
  name: string;
  url: string;
  classes: string;
}[] = [
  {
    name: "ចូលគណនី",
    url: "/login",
    classes:
      "bg-transparent py-3 px-4 rounded-lg transition duration-200 hover:bg-gray-200",
  },
  {
    name: "ប្រើប្រាស់ឥឡូវនេះ",
    url: "/app/dashboard",
    classes:
      "text-white bg-public-red py-3 px-4 rounded-lg transition duration-200 hover:bg-public-red/60",
  },
];
</script>

<template>
  <!-- header -->
  <header
    class="w-full h-fit sticky! bg-zinc-100/70 shadow top-0 right-0 left-0 z-50 backdrop-blur-lg animate-height-25%"
  >
    <!-- header container -->
    <nav
      class="py-6 flex flex-col gap-4 md:flex-row md:justify-between max-w-public-prefer mx-auto px-4 md:px-4 public-prefer:px-0 transition-all duration-300"
    >
      <!-- logo -->
      <div class="flex justify-between items-center md:w-max">
        <NuxtLink
          to="/"
          class="aspect-[5.08/1.76] w-16 md:w-20 text-public-red text-2xl font-semibold"
        >
          <PublicFullLogo class="w-full h-full object-cover" />
        </NuxtLink>
        <!-- burger menu -->
        <LazySheet hydrate-on-media-query="(width <= 768px)">
          <SheetTrigger as-child>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="select-none size-6 md:hidden text-black transition duration-200 hover:text-secondary"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 6h18M3 12h18M3 18h18"
                />
              </svg>
            </button>
          </SheetTrigger>
          <SheetContent
            class="bg-zinc-100 [&_*:has(+.sr-only)]:text-public-red [&_*:has(+.sr-only)]:size-6 p-4"
          >
            <SheetHeader>
              <SheetTitle class="sr-only">All nav links</SheetTitle>
              <SheetDescription class="sr-only">
                These are all the links from the navigation bar created for
                mobile screen!
              </SheetDescription>
              <!-- nav links - mobile only -->
              <ul
                class="flex flex-col gap-4 *:text-zinc-900 *:font-semibold *:text-lg *:text-center"
              >
                <li v-for="item in headerItems" :key="item.name">
                  <NuxtLink :to="item.url">{{ item.name }}</NuxtLink>
                </li>
              </ul>
            </SheetHeader>
            <SheetFooter>
              <!-- nav button - mobile only -->
              <ul
                class="flex flex-col gap-4 *:text-zinc-900 *:font-semibold *:text-lg *:text-center"
              >
                <li v-for="b in headerButtons" :key="b.name">
                  <NuxtLink :class="b.classes" :to="b.url">{{
                    b.name
                  }}</NuxtLink>
                </li>
              </ul>
            </SheetFooter>
          </SheetContent>
        </LazySheet>
      </div>
      <!-- nav links -->
      <ul
        class="hidden md:border-none md:p-0 md:flex md:flex-row md:items-center md:gap-4 lg:gap-8 *:text-gray-600 *:font-semibold *:transition *:duration-200 *:hover:text-public-red *:text-[1rem]"
      >
        <li v-for="item in headerItems" :key="item.name">
          <NuxtLink :to="item.url">{{ item.name }}</NuxtLink>
        </li>
      </ul>
      <!-- buttons -->
      <ul
        class="hidden md:flex md:flex-row gap-6 *:text-gray-600 *:font-semibold *:transition *:duration-200 *:text-[1rem] pb-4 md:pb-0"
      >
        <li v-for="b in headerButtons">
          <NuxtLink :to="b.url" :class="b.classes">{{ b.name }}</NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>
