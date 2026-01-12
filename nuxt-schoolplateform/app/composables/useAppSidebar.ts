import {
  Award,
  Building,
  Calendar,
  Code,
  Database,
  HeartHandshake,
  Info,
  UserCog2,
} from "lucide-vue-next";
import type { SidebarEachSubMenu, SidebarMenu } from "~/types/appSidebar";

export const useAppSidebar = () => {
  const allMenus = ref<SidebarMenu[]>([]);
  allMenus.value = [
    {
      partTitle: "ព័ត៌មានសាលារៀន",
      menus: [
        {
          isActive: false,
          title: "ព័ត៌មានបុគ្គលិក",
          icon: UserCog2,
          url: "/app/dashboard/staff",
          items: [
            {
              title: "ស្វែងរកព័ត៌មានបុគ្គលិក",
              url: "/app/dashboard/staff/search",
            },
            {
              title: "បង្កើតព័ត៌មានបុគ្គលិកថ្មី",
              url: "/app/dashboard/staff/create",
            },
          ],
        },
        {
          isActive: false,
          title: "កាលវិភាគសាលា",
          icon: Calendar,
          url: "/app/dashboard/school",
          items: [
            {
              title: "គ្រប់គ្រងថ្នាក់រៀន",
              url: "/app/dashboard/school/class",
            },
            {
              title: "គ្រប់គ្រងបុគ្គលិកបង្រៀន",
              url: "/app/dashboard/school/staff-teaching",
            },
            {
              title: "បន្ថែម/កែមុខវិជ្ជា",
              url: "#",
            },
            {
              title: "បង្កើតកាលវិភាគ",
              url: "#",
            },
            {
              title: "ទាញយកកាលវិភាគចាស់ៗ",
              url: "#",
            },
          ],
        },
        {
          isActive: false,
          title: "លិខិតសរសើរចំពោះសិស្ស",
          icon: Award,
          url: null,
          items: [
            {
              title: "បញ្ចូលឈ្មោះសម្រាប់លិខិតសរសើរ",
              url: "#",
            },
          ],
        },
        {
          isActive: false,
          title: "លិខិតថ្លែងអំណរគុណសប្បុរសជន",
          icon: HeartHandshake,
          url: null,
          items: [
            {
              title: "បញ្ចូលឈ្មោះលិខិតថ្លែងអំណរគុណ",
              url: "#",
            },
          ],
        },
        {
          isActive: false,
          title: "ឧបត្ថម្ភអ្នកអភិវឌ្ឍកម្មវិធី",
          icon: Code,
          url: null,
          items: [
            {
              title: "តាមរយៈ KHQR",
              url: "#",
            },
          ],
        },
      ],
    },
    {
      partTitle: "ព័ត៌មានផ្សេងៗ",
      menus: [
        {
          isActive: false,
          title: "មុខងារផ្សេងៗ",
          icon: Info,
          url: null,
          items: [
            {
              title: "គណនី",
              url: "/app/dashboard/account",
            },
            {
              title: "ការកំណត់",
              url: "/app/dashboard/settings",
            },
          ],
        },
      ],
    },
    {
      partTitle: "Administrative tools",
      menus: [
        {
          isActive: false,
          title: "គ្រប់គ្រងទិន្នន័យទូទៅ",
          icon: Database,
          url: "/app/dashboard/other",
          items: [
            {
              title: "អាសយដ្ឋាន",
              url: "/app/dashboard/other",
              isActive: false,
              items: [
                {
                  title: "ខេត្ត/រាជធានី",
                  url: "/app/dashboard/other/province",
                },
                {
                  title: "ស្រុក/ក្រុង/ខណ្ឌ",
                  url: "/app/dashboard/other/district",
                },
                {
                  title: "ឃុំ/សង្កាត់",
                  url: "/app/dashboard/other/commune",
                },
                { title: "ភូមិ", url: "/app/dashboard/other/village" },
              ],
            },
            {
              title: "ផ្សេងៗ",
              url: "/app/dashboard/other/more",
            },
          ],
        },
        {
          isActive: false,
          title: "ព័ត៌មានអង្គភាព",
          icon: Building,
          url: "/app/dashboard/location",
          items: [
            {
              title: "ស្វែងរកព័ត៌មានអង្គភាព",
              url: "/app/dashboard/location/search",
            },
            {
              title: "បង្កើតព័ត៌មានអង្គភាពថ្មី",
              url: "/app/dashboard/location/create",
            },
          ],
        },
      ],
    },
  ];

  const route = useRoute();

  watchEffect(() => {
    const currentPath = route.path;

    // Iterate over all menu parts and their menus
    for (const part of allMenus.value) {
      for (const menu of part.menus) {
        // Update the isActive property
        menu.isActive =
          (!!menu.url && currentPath.startsWith(menu.url?.toString())) ||
          menu.items.some((item) => item.url === currentPath);

        // Update the isActive property for sub menus
        for (const subMenu of menu.items as SidebarEachSubMenu[]) {
          if (Object.keys(subMenu).length > 2) {
            subMenu.isActive = subMenu.items.some(
              (item) => item.url === currentPath
            );
          }
        }
      }
    }
  });

  return { allMenus };
};
