/**
 * Confirmation dialog component using ion-alert.
 * Creates and presents a native-style alert dialog.
 */

let dialogCounter = 0;

/**
 * Show a confirmation dialog.
 * @param {object} params
 * @param {string} params.title - Dialog title
 * @param {string} params.message - Dialog message body
 * @param {string} [params.confirmLabel] - Confirm button label
 * @param {string} [params.cancelLabel] - Cancel button label
 * @param {Function} [params.onConfirm] - Called when user confirms
 * @param {Function} [params.onCancel] - Called when user cancels
 * @returns {Promise} Resolves when dialog is dismissed
 */
export async function renderConfirmationDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel
}) {
  dialogCounter++;
  const dialogId = `confirm-dialog-${dialogCounter}`;

  const alert = document.createElement('ion-alert');
  alert.id = dialogId;
  alert.header = title;
  alert.message = message;
  alert.buttons = [
    {
      text: cancelLabel,
      role: 'cancel',
      handler: () => {
        if (onCancel) onCancel();
      }
    },
    {
      text: confirmLabel,
      role: 'confirm',
      handler: () => {
        if (onConfirm) onConfirm();
      }
    }
  ];

  document.body.appendChild(alert);
  await alert.present();

  const { role } = await alert.onDidDismiss();
  alert.remove();

  return role === 'confirm';
}

export default renderConfirmationDialog;
