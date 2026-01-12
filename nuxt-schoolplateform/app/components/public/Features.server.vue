<script setup lang="ts">
const featureCards: { iconName: string; title: string; description: string }[] =
  [
    {
      iconName: "lucide:file-chart-column-increasing",
      title: "ឯកសារតាមបែបឌីជីថល",
      description:
        "រាល់ឯកសារ និងលិខិតស្នាមផ្សេងៗនឹងត្រូវធ្វើឡើងក្នុងទម្រងឌីជីថល ដែលផ្ដល់ភាពងាយស្រួលក្នុងការស្វែងរក។",
    },
    {
      iconName: "lucide:alarm-clock-check",
      title: "សន្សំសំចៃពេលវេលា",
      description:
        "ពួកយើងខិតខំស្វែងរកមុខងារទាំងឡាយដែលធ្វើឱ្យបុគ្គលិកអប់រំអាចចំណេញពេលវេលាក្នុងការបង្រៀន។",
    },
    {
      iconName: "lucide:shield-check",
      title: "ព័ត៌មានមានសុវត្ថិភាព",
      description:
        "រាល់ផ្នែកនៃព័ត៌មានទាំងឡាយសុទ្ធតែត្រូវការព៏ត៌មានផ្ទាល់ខ្លួនតាមរយៈការ Login ទើបអាចចូលប្រើប្រាស់បាន។",
    },
    {
      iconName: "lucide:users-round",
      title: "កំណត់អត្តសញ្ញាណត្រឹមត្រូវ",
      description:
        "រាល់ការចុះឈ្មោះរបស់អ្នកប្រើប្រាស់ ត្រូវតែមាន email ផ្ទៀតផ្ទាត់ ត្រឹមត្រូវ សម្រាប់ verification code។",
    },
    {
      iconName: "lucide:chart-no-axes-combined",
      title: "សោភណភាពរបាយការណ៍",
      description:
        "របាយការណ៍មានសោភណភាពស្រស់ស្អាត ងាយយល់ ងាយទទួលបានទិន្នន័យសម្រាប់គណៈគ្រប់គ្រងគ្រប់រូប។",
    },
    {
      iconName: "lucide:message-circle-more",
      title: "ងាយស្រួលទំនាក់ទំនង",
      description:
        "យើងនឹងបន្ថែមមុខងារទំនាក់ទំនង សម្រាប់បុគ្គលិកអប់រំប្រើប្រាស់ក្នុងកម្មវិធីផ្ទាល់ (upcoming feature)។",
    },
    {
      iconName: "lucide:table-2",
      title: "កំណត់កម្មវិធីសិក្សាប្រចាំឆ្នាំ",
      description:
        "អ្នកប្រើប្រាស់អាចបង្កើតថ្នាក់រៀន និងកាលវិភាគក្នុងកម្មវិធីដើម្បីបង្កើតជាកាលវិភាគទាំងមូលរបស់សាលា។",
    },
    {
      iconName: "lucide:settings",
      title: "Customize តាមតម្រូវការ",
      description:
        "ផ្ទាំងបង្ហាញ (UI) អនុញ្ញាតឱ្យអ្នកប្រើប្រាស់ប្ដូរពណ៌ (Dark & Light modes) និងមានការកំណត់ផ្សេងៗទៀត។",
    },
  ];
</script>

<template>
  <section id="features" class="mt-36">
    <!-- features container -->
    <div
      class="px-4 md:px-4 public-prefer:px-0 mx-auto max-w-public-prefer grid grid-cols-1 justify-items-center gap-5"
    >
      <span class="small-public-highlight">រាល់លក្ខណៈពិសេសរបស់ប្រព័ន្ធ</span>
      <!-- feature title -->
      <h2
        class="text-black text-center text-xl font-bold text-balance md:text-3xl lg:w-[90%]"
      >
        រាល់កិច្ចការសម្រាប់ផ្នែកអប់រំទាំងឡាយគឺអាចដោះស្រាយបានជាមួយប្រព័ន្ធរបស់យើង
      </h2>
      <!-- feature subtitle -->
      <h3 class="text-center text-gray-600 text-lg md:text-xl mb-8">
        ចំណុចពិសេសខាងក្រោមនេះអាចធ្វើឱ្យអ្នកជ្រើសរើសយកពួកយើង៖
      </h3>
      <!-- all cards -->
      <div
        class="w-full h-max grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
      >
        <!-- each card -->
        <div
          v-for="card in featureCards"
          :key="card.title"
          class="card bg-white rounded-xl p-6 shadow lg:shadow-lg transition duration-200 hover:-translate-y-2"
        >
          <!-- card icon -->
          <div
            class="w-max h-max bg-public-red/10 rounded-lg p-2 grid place-items-center mb-3 *:size-7 *:text-public-red"
          >
            <Icon :name="card.iconName" class="text-2xl" />
          </div>
          <!-- card title -->
          <h3 class="text-2xl text-black/80 font-semibold mb-2 line-clamp-1">
            {{ card.title }}
          </h3>
          <!-- card description -->
          <p class="text-gray-600 text-lg line-clamp-3 font-light">
            {{ card.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
