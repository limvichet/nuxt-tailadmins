<script setup lang="ts">
import type { SidebarProps } from "~/components/ui/sidebar";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "~/components/ui/sidebar";

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: "icon",
});

const { isMobile, state } = useSidebar();
const { allMenus } = useAppSidebar();
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader class="h-12.5 border-b justify-center">
      <Tooltip>
        <TooltipTrigger class="relative isolate">
          <LazyPublicIconLogo
            :class="state === 'collapsed' ? 'opacity-100' : 'opacity-0'"
            class="absolute size-5 transition-opacity opacity-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
          />
          <h1
            :class="state === 'collapsed' ? 'opacity-0' : 'opacity-100'"
            class="transition-[opacity,width] text-primary truncate text-center text-nowrap font-moul leading-loose"
          >
            ប្រព័ន្ធជួយការងារសាលារៀន
          </h1>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          :hidden="state !== 'collapsed' || isMobile"
        >
          <p>ប្រព័ន្ធជួយការងារសាលារៀន</p>
        </TooltipContent>
      </Tooltip>
    </SidebarHeader>
    <SidebarContent class="scroll-width-thin">
      <LazyNavMain
        hydrate-on-visible
        v-for="menu in allMenus"
        :key="menu.partTitle"
        :part-title="menu.partTitle"
        :items="menu.menus"
      />
    </SidebarContent>
    <SidebarRail />
  </Sidebar>
</template>
