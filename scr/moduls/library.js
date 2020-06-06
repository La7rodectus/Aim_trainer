
export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function printRightSide(res) {
  const resPlace = document.getElementById('res');
  const p = document.createElement('p');
  p.innerHTML = res;
  p.classList.add('parRes');
  resPlace.prepend(p);
  const length = resPlace.querySelectorAll('.parRes').length;
  if (length > 5) {
    resPlace.removeChild(resPlace.querySelectorAll('.parRes')[length - 1]);
  }
}
