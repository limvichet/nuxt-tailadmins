<script setup lang="ts">
import HeroServer from "~/components/public/Hero.server.vue";
import FeaturesServer from "~/components/public/Features.server.vue";
import TestimonialsServer from "~/components/public/Testimonials.server.vue";
import PricingsServer from "~/components/public/Pricings.server.vue";

use1EZSeo({
  title: `${defaultSeo.title} - Home`,
  description:
    "Welcome to 1EZ School Homepage. Here you can find all the information about our platform and more!",
});
</script>

<template>
  <main>
    <!-- hero section -->
    <HeroServer />
    <!-- features section -->
    <FeaturesServer />
    <!-- testimonials section -->
    <TestimonialsServer />
    <!-- pricing section -->
    <PricingsServer />
    <!-- contact section -->
    <LazyPublicContacts hydrate-on-visible />
  </main>
</template>
