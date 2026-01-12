import type { LoginREQ, RegisterREQ, User } from "~/schemas/auth";

const useUser = () => useState<User | null>("user", () => null);

export const useAuth = () => {
  const user = useUser();
  const isAuthenticated = computed(() => !!user.value);
  const loading = ref<boolean>(false);

  const register = async (credentials: RegisterREQ) => {
    try {
      loading.value = true;
      await $fetch("/api/auth/register", { method: "POST", body: credentials });
      await fetchUser();
    } catch (error: any) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const login = async (credentials: LoginREQ) => {
    try {
      loading.value = true;
      await $fetch("/api/auth/login", { method: "POST", body: credentials });
      await fetchUser();
    } catch (error: any) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    await $fetch("/api/auth/logout", { method: "POST" });
    user.value = null;
    // Redirect to login page after logout
    await navigateTo("/login");
  };

  const fetchUser = async (headers: HeadersInit = {}) => {
    try {
      loading.value = true;
      // pass the headers from the plugin here.
      const fetchedUser = await $fetch<User>("/api/auth/user", {
        headers,
      });

      user.value = fetchedUser;
    } catch (error) {
      user.value = null;
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    fetchUser,
  };
};
