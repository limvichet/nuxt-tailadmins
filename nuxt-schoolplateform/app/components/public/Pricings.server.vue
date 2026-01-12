<script setup lang="ts">
const pricingCards: {
  badge?: string;
  title: string;
  subTitle: string;
  price: number;
  features: string[];
}[] = [
  {
    title: "កម្រិតធម្មតា",
    subTitle: "ល្អសម្រាប់សាលាដែលមានទំហំតូច និងកិច្ចការរដ្ឋបាលបន្តិចបន្តួច",
    price: 5,
    features: [
      "Form ជាទម្រង់ឌីជីថលចាប់ពី 20ឡើងទៅ",
      "ការបញ្ជូនឯកសារតាមប្រព័ន្ធ online",
      "អាចចុះហត្ថលេខាជាទម្រង់ជីឌីថលបាន",
      "អាចរក្សាឯកសារបានបន្តិចបន្តួច (50MB)",
    ],
  },
  {
    badge: "ពេញនិយមជាងគេ",
    title: "កម្រិតមធ្យម",
    subTitle: "ល្អសម្រាប់សាលាដែលមានទំហំតូច និងកិច្ចការរដ្ឋបាលបន្តិចបន្តួច",
    price: 10,
    features: [
      "Form ជាទម្រង់ឌីជីថលឥតដែនកំណត់",
      "ការបញ្ជូនឯកសារតាមប្រព័ន្ធ online",
      "អាចចុះហត្ថលេខាជាទម្រង់ជីឌីថលបាន",
      "អាចរក្សាឯកសារបានឥតដែនកំណត់",
      "អាចបញ្ចូន Email ទៅកាន់អ្នកប្រើប្រាស់ផ្សេងៗ",
    ],
  },
  {
    title: "កម្រិតអាជីវកម្ម",
    subTitle: "ល្អសម្រាប់សាលាដែលមានទំហំធំ ឬតំបន់ភូមិសាស្ត្រណាមួយ",
    price: 25,
    features: [
      "Form ជាទម្រង់ឌីជីថលឥតដែនកំណត់",
      "ការបញ្ជូនឯកសារតាមប្រព័ន្ធ online",
      "អាចចុះហត្ថលេខាជាទម្រង់ជីឌីថលបាន",
      "អាចរក្សាឯកសារបានឥតដែនកំណត់",
      "អាចបញ្ចូន Email ទៅកាន់អ្នកប្រើប្រាស់ផ្សេងៗ",
      "មានសិទ្ធិក្នុងការប្រើប្រាស់ API",
      "ការ support ដែលមានអាទិភាព",
    ],
  },
];
</script>

<template>
  <section id="pricing" class="bg-light py-16">
    <!-- pricing container -->
    <div
      class="px-4 md:px-4 public-prefer:px-0 mx-auto max-w-public-prefer grid grid-cols-1 justify-items-center gap-5"
    >
      <span class="small-public-highlight">តម្លៃនៃសេវាកម្មរបស់ពួកយើង</span>
      <!-- title -->
      <h2
        class="text-black text-center text-xl font-bold text-balance md:text-3xl lg:w-[90%]"
      >
        ការចំណាយសម្រាប់ប្រើប្រាស់សេវាកម្មរបស់ពួកយើង
      </h2>
      <!-- subtitle -->
      <h3 class="text-center text-gray-600 text-lg md:text-xl mb-8">
        អ្នកអាចធ្វើការជ្រើសរើសនូវ គម្រោងណាមួយដែលត្រូវនឹងតម្រូវការរបស់អ្នក
        ថែមទាំងទទួលបានការប្រើប្រាស់ដោយឥតគិតថ្លៃរយៈពេល 14 ថ្ងៃ៖
      </h3>
      <!-- all cards -->
      <div
        class="w-full h-max grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
      >
        <!-- each card -->
        <div
          v-for="(card, index) in pricingCards"
          :key="index"
          :data-badge="card.badge"
          :class="
            !!card.badge &&
            `relative after:content-[attr(data-badge)] after:z-40 after:w-full after:h-max after:text-lg after:font-bold after:top-0 after:absolute after:left-0 after:bg-public-red after:py-1 pt-14`
          "
          class="card bg-white rounded-xl p-6 border border-public-red/10 shadow-md transition duration-200 hover:shadow-2xl overflow-hidden text-white after:text-center"
        >
          <!-- card title -->
          <h3 class="font-bold text-xl text-black mb-2">{{ card.title }}</h3>
          <!-- card subtitle -->
          <p class="text-gray-600 text-lg line-clamp-2 font-light">
            {{ card.subTitle }}
          </p>
          <!-- card price -->
          <h3
            class="text-black my-4 font-bold text-4xl relative after:content-['/ខែ'] after:text-lg after:text-gray-500"
          >
            ${{ card.price }}
          </h3>
          <!-- card detail -->
          <ul class="*:flex *:items-center *:gap-2 *:text-lg *:text-gray-500">
            <li v-for="feat in card.features" :key="feat" class="not-last:mb-1">
              <Icon name="lucide:check" class="text-public-red" />
              <span>{{ feat }}</span>
            </li>
          </ul>
          <!-- card button -->
          <button
            class="w-full h-max bg-public-red mt-4 text-xl cursor-pointer text-white py-2 rounded-lg transition duration-200 hover:bg-public-red/80"
          >
            ជ្រើសរើស
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
