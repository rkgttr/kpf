export function getType(value) {
  if (value === undefined) {
    return 'Undefined';
  } else {
    return Object.prototype.toString.call(value).slice(8, -1);
  }
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export function delegate(match, listener) {
  return function(e) {
    let el = e.target;
    do {
      if (!el.matches) {
        return;
      }
      if (!el.matches(match)) {
        continue;
      }
      e.delegatedTarget = el;
      listener.apply(this, arguments);
      return;
    } while ((el = el.parentNode));
  };
}

export function whichAnimationEvent() {
  let t,
    el = document.createElement('div'),
    animations = {
      animation: 'animationend',
      OAnimation: 'oAnimationEnd',
      MozAnimation: 'Animationend',
      WebkitAnimation: 'webkitAnimationEnd'
    };

  for (t in animations) {
    if (el.style[t] !== undefined) {
      return animations[t];
    }
  }
}
