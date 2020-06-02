
export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function printRightSide(res) {
  const resPlace = document.getElementById('res');
  const p = document.createElement('p');
  p.innerHTML = res;
  resPlace.prepend(p);
  const length = resPlace.querySelectorAll('p').length;
  if (length > 5) {
    resPlace.removeChild(resPlace.querySelectorAll('p')[length - 1]);
  }
}
