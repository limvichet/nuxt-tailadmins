<script setup lang="ts">
// Define the props this component will accept
const props = defineProps<{
  open: boolean;
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
}>();

// Define the events it can emit
const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "cancel"): void;
  (e: "confirm"): void;
}>();

function onCancel() {
  emit("cancel");
  emit("update:open", false);
}

function onConfirm() {
  emit("confirm");
  emit("update:open", false);
}
</script>

<template>
  <AlertDialog :open="props.open" @update:open="$emit('update:open', $event)">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{
          props.title || "Are you absolutely sure?"
        }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ props.description || "This action cannot be undone." }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="onCancel">
          {{ props.cancelText || "Cancel" }}
        </AlertDialogCancel>
        <AlertDialogAction @click="onConfirm">
          {{ props.confirmText || "Continue" }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
