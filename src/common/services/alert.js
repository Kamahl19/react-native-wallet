let _alert;

function setAlert(alert) {
  _alert = alert;
}

const error = (message, title = '') => _alert.alertWithType('error', title, message);
const success = (message, title = '') => _alert.alertWithType('success', title, message);

export default {
  setAlert,
  error,
  success,
};
