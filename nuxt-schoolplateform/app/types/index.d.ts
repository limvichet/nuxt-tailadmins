declare module "#app" {
  interface PageMeta {
    requiresAuth?: boolean;
    requiresLocation?: boolean;
    guestOnly?: boolean;
  }
}

export {};
