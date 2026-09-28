/**
 * Toast notification helper using Ionic's ion-toast.
 */

/**
 * Show a toast notification.
 * @param {string} message
 * @param {'success'|'warning'|'error'|'info'} [type='info']
 * @param {number} [duration=3000]
 */
export function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('ion-toast');
  toast.message = message;
  toast.duration = duration;
  toast.position = 'bottom';

  const colorMap = {
    success: 'success',
    warning: 'warning',
    error: 'danger',
    info: 'medium',
  };
  toast.color = colorMap[type] || 'medium';

  document.body.appendChild(toast);
  return toast.present();
}
