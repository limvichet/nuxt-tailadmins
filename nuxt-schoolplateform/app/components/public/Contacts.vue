<script setup lang="ts">
const contactCards: {
  iconName: string;
  title: string;
  info: string;
  infoUrl: string;
}[] = [
  {
    iconName: "lucide:mail",
    title: "តាមរយៈ E-mail",
    info: "limvichet917@gmail.com",
    infoUrl: "mailto:limvichet917@gmail.com",
  },
  {
    iconName: "lucide:phone",
    title: "តាមរយៈលេខទូរសព្ទ",
    info: "(855) 12 856 917",
    infoUrl: "tel:012856917",
  },
  {
    iconName: "lucide:map-pin",
    title: "តាមរយៈអាសយដ្ឋាន",
    info: "ផ្ទះលេខ123,\nសង្កាត់ភ្នំពេញថ្មី,\nខណ្ឌដង្កោ,\nរាជធានីភ្នំពេញ",
    infoUrl: "",
  },
];

const submitForm = () => {
  alert("Please contact through telephone or email instead!");
};
</script>

<template>
  <section id="contact" class="bg-white py-16">
    <!-- pricing container -->
    <div
      class="px-4 md:px-4 public-prefer:px-0 mx-auto max-w-public-prefer grid grid-cols-1 justify-items-center gap-5"
    >
      <span class="small-public-highlight">ទំនាក់ទំនងមកកាន់ពួកយើង</span>
      <!-- title -->
      <h2
        class="text-black text-center text-xl font-bold text-balance md:text-3xl lg:w-[90%]"
      >
        តើអ្នកបានពិចារណារួចរាល់
        នូវរបៀបក្នុងការរៀបចំកិច្ចការរដ្ឋបាលរបស់អ្នកហើយឬនៅ?
      </h2>
      <!-- subtitle -->
      <h3 class="text-center text-gray-600 text-lg md:text-xl mb-8">
        អ្នកអាចទំនាក់ទំនងមកកាន់ពួកយើងឥឡូវនេះ តាមរយៈព័ត៌មានខាងក្រោមនេះ ៖
      </h3>
      <!-- all cards -->
      <div
        class="w-full h-max grid grid-cols-1 md:grid-cols-[1fr_1.65fr] gap-4 md:gap-6 lg:gap-8"
      >
        <!-- left side -->
        <div class="flex flex-col gap-4 mx-auto md:mx-0">
          <!-- card title -->
          <h3 class="font-bold text-2xl text-black/80">
            ព័ត៌មានសម្រាប់ទំនាក់ទំនង
          </h3>
          <!-- small contact card -->
          <div
            v-for="card in contactCards"
            :key="card.title"
            class="flex flex-row gap-3 items-start"
          >
            <!-- card icon -->
            <div class="shrink-0 *:size-6 *:text-public-red">
              <Icon :name="card.iconName" class="text-xl" />
            </div>
            <!-- card info -->
            <div class="flex flex-col gap-1">
              <h4 class="text-lg text-black leading-tight">
                {{ card.title }}
              </h4>
              <NuxtLink
                :to="card.infoUrl"
                class="text-lg text-gray-600 font-normal"
                >{{ card.info }}</NuxtLink
              >
            </div>
          </div>
        </div>
        <!-- right side -->
        <div
          class="bg-light p-4 md:p-6 lg:p-8 rounded-xl border border-public-red/10 shadow"
        >
          <!-- form title -->
          <h3
            class="text-center md:text-left font-bold text-2xl text-black/80 mb-4 md:mb-6"
          >
            ផ្ញើសារមកកាន់ពួកយើង
          </h3>
          <!-- form body -->
          <form
            @submit.prevent="submitForm"
            method="POST"
            class="w-full h-max p-0 m-0 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6 [&_label]:text-zinc-900 [&_*:is(input,textarea)]:outline-2 [&_*:is(input,textarea)]:outline-public-red/20"
          >
            <!-- form row -->
            <div class="input-row flex flex-col gap-1 col-span-2 lg:col-span-1">
              <label for="name" class="text-lg">ឈ្មោះរបស់អ្នក</label>
              <input
                class="bg-white py-2 px-3 rounded-lg border border-public-red/10 text-black text-lg focus:outline-public-red dark:focus:outline-public-red"
                type="text"
                name="name"
                id="name"
                placeholder="ឧ. ស៊ឺ សាមីត"
                required
              />
            </div>
            <!-- form row -->
            <div class="input-row flex flex-col gap-1 col-span-2 lg:col-span-1">
              <label for="email" class="text-lg">Email របស់អ្នក</label>
              <input
                class="bg-white py-2 px-3 rounded-lg border border-public-red/10 text-black text-lg focus:outline-public-red dark:focus:outline-public-red"
                type="email"
                name="email"
                id="email"
                placeholder="ឧ. seusamith@gmail.com"
                required
              />
            </div>
            <!-- form row -->
            <div class="input-row flex flex-col gap-1 col-span-2">
              <label for="school" class="text-lg">សាលារបស់អ្នក</label>
              <input
                class="bg-white py-2 px-3 rounded-lg border border-public-red/10 text-black text-lg focus:outline-public-red dark:focus:outline-public-red"
                type="text"
                name="school"
                id="school"
                placeholder="ឧ. វិទ្យាល័យកំពង់ស្ពឺ"
                required
              />
            </div>
            <!-- form row -->
            <div class="input-row flex flex-col gap-1 col-span-2">
              <label for="message" class="text-lg">អត្ថបទសារ</label>
              <textarea
                class="resize-y min-h-28 bg-white py-2 px-3 rounded-lg border border-public-red/10 text-black text-lg focus:outline-public-red dark:focus:outline-public-red"
                name="message"
                id="message"
                placeholder="ឧ. ប្រាប់ពួកយើងអំពីអ្វីដែលអ្នកត្រូវការ..."
                required
              ></textarea>
            </div>
            <!-- form row -->
            <div class="input-row flex flex-col gap-1 col-span-2">
              <button
                class="font-bold text-white bg-public-red py-2 px-3 rounded-lg border border-public-red/10 text-lg focus:outline-public-red dark:focus:outline-public-red cursor-pointer hover:bg-public-red/80 transition duration-200"
              >
                ផ្ញើសារ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
