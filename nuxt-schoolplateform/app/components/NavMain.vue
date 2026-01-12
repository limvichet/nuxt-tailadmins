<script setup lang="ts">
import { ChevronRight, type LucideIcon } from "lucide-vue-next";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "~/components/ui/sidebar";
import type {
  EachMenu,
  SidebarEachMenu,
  SidebarEachSubMenu,
} from "~/types/appSidebar";

defineProps<{
  partTitle: string;
  items: {
    title: string;
    icon: LucideIcon;
    isActive: boolean;
    items: SidebarEachMenu["items"];
  }[];
}>();

const { isMobile, state, setOpen } = useSidebar();
const clickToOpenSidebar = () => {
  if (!isMobile.value && state.value === "collapsed") {
    setOpen(true);
  }
};
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>{{ partTitle }}</SidebarGroupLabel>
    <SidebarMenu>
      <Collapsible
        v-for="item in items"
        :key="item.title"
        as-child
        :default-open="item.isActive"
        class="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger as-child>
            <SidebarMenuButton
              @click="clickToOpenSidebar"
              :tooltip="item.title"
              :class="item.isActive && 'sidebar-button-active'"
            >
              <component :is="item.icon" v-if="item.icon" />
              <span class="text-nowrap">{{ item.title }}</span>
              <ChevronRight
                class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub
              :class="item.isActive && 'border-sidebar-primary/50'"
            >
              <SidebarMenuSubItem
                v-for="subItem in item.items"
                :key="subItem.title"
              >
                <!-- normal item -->
                <template
                  v-if="
                    typeof subItem === 'object' &&
                    Object.keys(subItem).length <= 2
                  "
                >
                  <SidebarMenuSubButton as-child>
                    <NuxtLink
                      active-class="sidebar-sub-button-active"
                      :to="(subItem as EachMenu).url"
                    >
                      <span>{{ (subItem as EachMenu).title }}</span>
                    </NuxtLink>
                  </SidebarMenuSubButton>
                </template>

                <!-- sub item -->
                <template
                  v-else-if="
                    typeof subItem === 'object' &&
                    Object.keys(subItem).length > 2
                  "
                >
                  <Collapsible
                    as-child
                    :default-open="(subItem as SidebarEachSubMenu).isActive"
                    class="group/sub-collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger as-child>
                        <SidebarMenuButton
                          :tooltip="(subItem as SidebarEachSubMenu).title"
                          :class="(subItem as SidebarEachSubMenu).isActive && 'sidebar-sub-button-active'"
                        >
                          <span class="text-nowrap">{{
                            (subItem as SidebarEachSubMenu).title
                          }}</span>
                          <ChevronRight
                            class="ml-auto transition-transform duration-200 group-data-[state=open]/sub-collapsible:rotate-90"
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub
                          :class="(subItem as SidebarEachSubMenu).isActive && 'border-sidebar-primary/50'"
                        >
                          <SidebarMenuSubItem
                            v-for="subSubItem in (subItem as SidebarEachSubMenu).items"
                          >
                            <SidebarMenuSubButton as-child>
                              <NuxtLink
                                active-class="sidebar-sub-button-active"
                                :to="subSubItem.url"
                              >
                                <span>{{ subSubItem.title }}</span>
                              </NuxtLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                </template>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  </SidebarGroup>
</template>
