let _alert;

function setAlert(alert) {
  _alert = alert;
}

const info = (message, title = '') => _alert.alertWithType('info', title, message);
const warn = (message, title = '') => _alert.alertWithType('warn', title, message);
const error = (message, title = '') => _alert.alertWithType('error', title, message);
const success = (message, title = '') => _alert.alertWithType('success', title, message);

const dismiss = (onDismiss, action) => _alert.dismiss(onDismiss, action);

export default {
  setAlert,
  info,
  warn,
  error,
  success,
  dismiss,
};
