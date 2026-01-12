<script setup lang="ts">
const testimonialCards: {
  comment: string;
  rating: number;
  name: string;
  org: string;
}[] = [
  {
    comment:
      "ប្រព័ន្ធរបស់អ្នកគឺជាប្រព័ន្ធដែលខ្ញុំប្រើប្រាស់ហើយ ពិតជាបានជួយសន្សំសំចៃពេលវេលាបានច្រើនមែនទែន។ សំខាន់គឺវាពិតជាអាចទុកចិត្តបានថែមទាំងមានល្បឿនលឿន។",
    rating: 5,
    name: "លោកគ្រូ ICT",
    org: "វិទ្យាល័យកំពង់ស្ពឺ",
  },
  {
    comment:
      "ប្រព័ន្ធរបស់អ្នកគឺជាប្រព័ន្ធដែលខ្ញុំប្រើប្រាស់ហើយ ពិតជាបានជួយសន្សំសំចៃពេលវេលាបានច្រើនមែនទែន។ សំខាន់គឺវាពិតជាអាចទុកចិត្តបានថែមទាំងមានល្បឿនលឿន។",
    rating: 5,
    name: "លោកគ្រូ គីមីវិទ្យា",
    org: "វិទ្យាល័យជំពូវន្ត",
  },
  {
    comment:
      "ប្រព័ន្ធរបស់អ្នកគឺជាប្រព័ន្ធដែលខ្ញុំប្រើប្រាស់ហើយ ពិតជាបានជួយសន្សំសំចៃពេលវេលាបានច្រើនមែនទែន។ សំខាន់គឺវាពិតជាអាចទុកចិត្តបានថែមទាំងមានល្បឿនលឿន។",
    rating: 5,
    name: "លោកគ្រូ ប្រវត្តិវិទ្យា",
    org: "វិទ្យាល័យចំបក់",
  },
];
</script>

<template>
  <section id="testimonials" class="mt-16 bg-white py-16">
    <!-- testimonials container -->
    <div
      class="px-4 md:px-4 public-prefer:px-0 mx-auto max-w-public-prefer grid grid-cols-1 justify-items-center gap-5"
    >
      <span class="small-public-highlight">រាល់ការគាំទ្រមកកាន់ពួកយើង</span>
      <!-- title -->
      <h2
        class="text-black text-center text-xl font-bold text-balance md:text-3xl lg:w-[90%]"
      >
        ទំនុកចិត្តមកកាន់ សេវាកម្មរបស់យើង
      </h2>
      <!-- subtitle -->
      <h3 class="text-center text-gray-600 text-lg md:text-xl mb-8">
        ខាងក្រោមនេះគឺជាការគាំទ្ររបស់បុគ្គលិកអប់រំមកកាន់ប្រព័ន្ធរបស់ពួកយើង៖
      </h3>
      <!-- all cards -->
      <div
        class="w-full h-max grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
      >
        <!-- each card -->
        <div
          v-for="card in testimonialCards"
          :key="card.name"
          class="card bg-white rounded-xl p-6 border border-public-red/30 transition duration-200 hover:-translate-y-2"
        >
          <!-- card icon -->
          <div
            class="w-max h-ma rounded-lg grid place-items-center mb-2 *:text-public-red/40"
          >
            <Icon name="bxs:quote-alt-right" class="text-2xl" />
          </div>
          <!-- card description -->
          <p class="text-gray-600 text-lg line-clamp-4 font-light">
            {{ card.comment }}
          </p>
          <!-- card rate -->
          <div
            class="my-4 flex items-center gap-0.5 *:size-5 *:text-public-red"
          >
            <Icon
              v-for="_ in card.rating"
              name="material-symbols:star"
              class="text-lg"
            />
          </div>
          <!-- card rater -->
          <h3 class="text-lg">
            <span class="text-black font-semibold">{{ card.name }}</span> -
            <span class="text-gray-600">{{ card.org }}</span>
          </h3>
        </div>
      </div>
    </div>
  </section>
</template>
