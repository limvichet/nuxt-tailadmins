import type { LucideIcon } from "lucide-vue-next";
import type { RouteLocationRaw } from "vue-router";

export interface EachMenu {
  title: string;
  url: RouteLocationRaw;
}

export interface SidebarEachSubMenu {
  isActive: boolean;
  title: string;
  url: RouteLocationRaw;
  items: Array<EachMenu>;
}

export interface SidebarEachMenu {
  isActive: boolean;
  title: string;
  icon: LucideIcon;
  url: RouteLocationRaw | null;
  items: Array<EachMenu | SidebarEachSubMenu>;
}

export interface SidebarMenu {
  partTitle: string;
  menus: Array<SidebarEachMenu>;
}
