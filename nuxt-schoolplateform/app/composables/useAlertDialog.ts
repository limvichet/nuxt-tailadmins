// Define the structure for the dialog's options
interface AlertDialogOptions {
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
}

// A reactive object to hold the current dialog state singleton (shared state)
const dialogState = reactive({
  open: false,
  title: "តើអ្នកប្រាកដថាធ្វើសកម្មភាពនេះមែនទេ?",
  description: "សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយបានឡើយ!",
  cancelText: "បោះបង់",
  confirmText: "Continue",
  resolve: (value: boolean) => {},
});

export const useAlertDialog = () => {
  /**
   * Opens the alert dialog with custom options.
   * @param options - The configuration for the dialog.
   * @returns A promise that resolves to `true` if confirmed, or `false` if canceled.
   */
  const open = (options: AlertDialogOptions = {}): Promise<boolean> => {
    // Set the state with new options or defaults
    dialogState.open = true;
    dialogState.title = options.title || "Are you absolutely sure?";
    dialogState.description =
      options.description || "This action cannot be undone.";
    dialogState.cancelText = options.cancelText || "Cancel";
    dialogState.confirmText = options.confirmText || "Continue";

    // Return a new promise that will be resolved/rejected by the component's events
    return new Promise<boolean>((resolve) => {
      dialogState.resolve = resolve;
    });
  };

  const onCancel = () => {
    dialogState.open = false;
    dialogState.resolve(false); // Resolve the promise with false
  };

  const onConfirm = () => {
    dialogState.open = false;
    dialogState.resolve(true); // Resolve the promise with true
  };

  return {
    state: dialogState,
    open,
    onCancel,
    onConfirm,
  };
};
