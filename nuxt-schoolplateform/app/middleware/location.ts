import { toast } from "vue-sonner";

export default defineNuxtRouteMiddleware(async (to) => {
  const { user } = useAuth();

  if (!user.value?.location_code) {
    if (import.meta.server) {
      return navigateTo("/app/dashboard", { replace: true });
    } else {
      toast.error("ERROR: សូមទំនាក់ទំនងទៅកាន់ admin ដើម្បីកំណត់លេខកូដអង្គភាព!");
      return abortNavigation();
    }
  }
});
