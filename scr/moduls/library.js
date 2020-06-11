//config
import CONFIG from '../../config.js';
const ID = CONFIG.id;

export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function printRightSide(res) {
  const resPlace = document.getElementById(ID.lastSessionRes_div);
  const p = document.createElement('p');
  p.innerHTML = res;
  p.classList.add('parRes');
  resPlace.prepend(p);
  const length = resPlace.querySelectorAll('.parRes').length;
  if (length > 5) {
    resPlace.removeChild(resPlace.querySelectorAll('.parRes')[length - 1]);
  }
}

export function byField(field) {
  return (a, b) => (a[field] > b[field] ? 1 : -1);
}

export function regCellBorderColor(color = 'white') {
  const pass = document.getElementById(ID.password_input);
  const login = document.getElementById(ID.login_input);
  const mail = document.getElementById(ID.mail_input);
  mail.style.borderColor = color;
  pass.style.borderColor = color;
  login.style.borderColor = color;
  if (color === 'green') {
    pass.value = '';
    login.value = '';
    mail.value = '';
  }
  setTimeout(() => {
    pass.style.borderColor = 'white';
    login.style.borderColor = 'white';
    mail.style.borderColor = 'white';
  }, 1000);
}

export function regMsg(text, color = 'green') {
  const msg = document.getElementById(ID.regFormMsg);
  msg.style.color = color;
  msg.innerText = text;
  msg.style.display = 'block';
  setTimeout(() => {
    msg.style.display = 'none';
  }, 4000);
}
