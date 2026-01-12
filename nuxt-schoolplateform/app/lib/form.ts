export function toApiPayload<T>(data: T) {
  const payload: any = {};
  for (const key in data) {
    const item = data[key];
    if (
      item &&
      typeof item === "object" &&
      !Array.isArray(item) &&
      "id" in item &&
      "value" in item
    ) {
      payload[key] = item.id;
    } else {
      payload[key] = item;
    }
  }
  return payload;
}
