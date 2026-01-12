<script setup lang="ts">
import { getAvatarInitials } from "~/lib/utils";
import {
  BadgeCheck,
  Bell,
  CreditCard,
  LogOut,
  Settings,
} from "lucide-vue-next";
import { cloneVNode, type VNode } from "vue";

const { user, logout } = useAuth();
const route = useRoute();
const loggingOut = () => logout();

const slots = useSlots();
const modifiedSlotContent = computed<VNode[]>(() => {
  const children = slots.default ? slots.default() : [];

  const firstElementIndex = children.findIndex(
    (vnode) => typeof vnode.type === "string" || typeof vnode.type === "object"
  );

  // If no element is found in the slot, return the children as-is.
  if (firstElementIndex === -1) {
    return children;
  }

  // Get the original VNode for the first element
  const originalVNode = children[firstElementIndex];
  const clonedVNode = cloneVNode(originalVNode!, {
    id: "content-area", // closing sidebar by this id
    class: "flex-1 p-4 pt-0 increased",
  });

  const newChildren = [...children];
  newChildren[firstElementIndex] = clonedVNode;

  return newChildren;
});
// for breadcrumb
const segments = computed(() => {
  const paths = route.path.split("/").filter(Boolean);
  const crumbs = [];
  for (let i = 2; i < paths.length; i++) {
    crumbs.push({
      name: decodeURIComponent(paths[i]!.replace(/-/g, " ")).replace(
        /\b\w/g,
        (l) => l.toUpperCase()
      ), // format nicely
      to: "/" + paths.slice(0, i + 1).join("/"),
    });
  }
  return crumbs;
});
</script>

<template>
  <SidebarProvider>
    <AppSidebar class="shadow" />
    <SidebarInset>
      <header
        class="flex h-12.5 shrink-0 items-center gap-2 transition-[width] sticky top-0 z-10 right-0 backdrop-blur-md bg-linear-to-b from-background/80 to-background/20 border-b mb-4"
      >
        <div class="flex items-center gap-2 px-4 w-full">
          <SidebarTrigger class="-ml-1" />
          <div class="overflow-x-auto scrollbar-none mask-right-side-8 w-full">
            <Breadcrumb>
              <BreadcrumbList class="flex-nowrap">
                <BreadcrumbItem>
                  <BreadcrumbLink as-child>
                    <NuxtLink to="/app/dashboard">Home</NuxtLink>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <template v-for="(crumb, index) in segments" :key="crumb.to">
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink v-if="index < segments.length - 1" as-child>
                      <NuxtLink class="text-muted-foreground" :to="crumb.to">{{
                        crumb.name
                      }}</NuxtLink>
                    </BreadcrumbLink>
                    <BreadcrumbPage
                      class="font-semibold text-secondary-foreground"
                      v-else
                      >{{ crumb.name }}</BreadcrumbPage
                    >
                  </BreadcrumbItem>
                </template>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <!-- user profile -->
          <DropdownMenu>
            <DropdownMenuTrigger
              data-allow-mismatch
              class="ms-auto cursor-pointer"
            >
              <Avatar class="h-8 w-8 rounded-lg">
                <!-- <AvatarImage :src="user.avatar" :alt="user.name!" /> -->
                <AvatarFallback class="rounded-lg">{{
                  getAvatarInitials(user!.name)
                }}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              class="w-(--reka-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side="bottom"
              align="end"
              :side-offset="4"
            >
              <DropdownMenuLabel class="p-0 font-normal">
                <div
                  class="flex items-center gap-2 px-1 py-1.5 text-left text-sm"
                >
                  <Avatar class="h-8 w-8 rounded-lg">
                    <!-- <AvatarImage :src="user.avatar" :alt="user.name" /> -->
                    <AvatarFallback class="rounded-lg">{{
                      getAvatarInitials(user!.name)
                    }}</AvatarFallback>
                  </Avatar>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold"
                      >{{ user!.name }} ({{ user?.id }})</span
                    >
                    <span class="truncate text-xs">{{ user!.email }}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <NuxtLink to="/app/dashboard/account">
                  <DropdownMenuItem>
                    <BadgeCheck />
                    គណនី
                  </DropdownMenuItem>
                </NuxtLink>
                <DropdownMenuItem>
                  <CreditCard />
                  ការបង់ប្រាក់
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  សេចក្ដីជូនដំណឹង
                </DropdownMenuItem>
                <NuxtLink to="/app/dashboard/settings">
                  <DropdownMenuItem>
                    <Settings />
                    ការកំណត់
                  </DropdownMenuItem>
                </NuxtLink>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="loggingOut">
                <LogOut />
                ចាកចេញពីគណនី
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <!-- <slot /> -->
      <component
        :is="vnode"
        v-for="(vnode, index) in modifiedSlotContent"
        :key="index"
      />
    </SidebarInset>
  </SidebarProvider>
</template>
