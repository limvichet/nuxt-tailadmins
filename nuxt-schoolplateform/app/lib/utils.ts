import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { formatDate } from "@vueuse/core";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAvatarInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function getParam(name: string, url: string) {
  return name ? new URL(url).searchParams.get(name) : null;
}

export const noQueries = (route: ReturnType<typeof useRoute>) => {
  return Object.keys(route.query).length <= 0;
};

export const tableIndex = (
  search_string: Ref<string>,
  index: number,
  current_page: number,
  per_page: number
) => {
  if (!!search_string.value) {
    return index + 1;
  }
  if (current_page > 1) {
    return (current_page - 1) * per_page + (index + 1);
  }
  return index + 1;
};

export const formattedDate = (date: string, format: string = "DD/MM/YYYY") =>
  formatDate(parseDate(date).toDate(getLocalTimeZone()), format);
