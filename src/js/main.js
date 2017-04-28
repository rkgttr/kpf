import Router from 'Router';
import Modal from 'Modal';
import throttle from 'throttle';
import slugify from 'slug';
import * as Helpers from 'Helpers';

import * as Q from 'rkgttr-q';
import Publisher from 'rkgttr-publisher';
import uuid from 'rkgttr-uuid';
import Prng from 'rkgttr-prng';

// Uncomment the following if you wish to use the Elements module, add the elements you want to unlock in the {}
import { img, div, article, a, h2 } from 'rkgttr-elements';

// uncomment the following line if script fails in Internet Explorer, or other, due to ES6 features that need the Babel Polyfill
// import 'babel-polyfill';

// uncomment some of the following lines if you wish to use some specific polyfills
// import 'rkgttr-weakmappolyfill';
// import 'rkgttr-mutationobserverpolyfill';
// import 'rkgttr-matchespolyfill';
import 'rkgttr-consolepolyfill';
import 'rkgttr-classlistpolyfill';
// import 'rkgttr-arrayincludespolyfill';
// import 'rkgttr-arrayfrompolyfill';

/**
 *
 * Main Application
 *
 **/
{
  const texture = Q.id('texture');
  const textureCtx = texture.getContext('2d');
  const body = Q.one('body');
  const modalBuilder = data => {
    return div(
      {
        className: 'modal',
        id: `modal/${slugify(data.title)}`,
        dataset: {
          title: slugify(data.title)
        }
      },
      div(
        {
          className: 'modal-wrapper'
        },
        div({ className: 'modal-content' }, h2(), article()),
        a({ className: 'modal-close', href: '#' }, 'Fermer')
      )
    );
  };
  const handleResize = throttle(e => {
    scale = Math.max(1400, body.offsetHeight, body.offsetWidth);
    texture.width = scale;
    texture.height = scale;
    offsetLeft = ((body.offsetWidth - scale) >> 1) / scale;
    offsetTop = ((body.offsetHeight - scale) >> 1) / scale;
    fillTexture(true);
  });
  const handleMousedown = e => {
    if (!body.classList.contains('modal-opened')) {
      clickTime = Date.now();
      body.classList.add('grabbing');
      grabbing = true;
      mx = e.pageX / scale;
      my = e.pageY / scale;
    }
  };
  const handleMousemove = e => {
    if (!body.classList.contains('modal-opened')) {
      if (grabbing) {
        let difx = e.pageX / scale - mx, dify = e.pageY / scale - my;
        dx += difx;
        dy += dify;
      }
      mx -= x;
      my -= y;
      let index = dataSet.find(
        el =>
          mx > el.area.left &&
          mx < el.area.right &&
          my > el.area.top &&
          my < el.area.bottom
      );
      body.classList[index ? 'add' : 'remove']('hover');
      mx = e.pageX / scale;
      my = e.pageY / scale;
    }
  };
  const handleMouseup = e => {
    if (!body.classList.contains('modal-opened')) {
      mx = e.pageX / scale - x;
      my = e.pageY / scale - y;
      if (Date.now() - clickTime < 150) {
        let index = dataSet
          .reverse()
          .find(
            el =>
              mx > el.area.left &&
              mx < el.area.right &&
              my > el.area.top &&
              my < el.area.bottom
          );

        if (index) {
          document.location.href = `#modal/${index.slug}`;
        }
        dataSet.reverse();
      }
      grabbing = false;
      body.classList.remove('grabbing');
    }
  };
  const touchDown = e => {
    handleMousedown({
      pageX: e.touches[0].pageX,
      pageY: e.touches[0].pageY
    });
  };
  const touchMove = e => {
    handleMousemove({
      pageX: e.touches[0].pageX,
      pageY: e.touches[0].pageY
    });
  };
  const touchEnd = e => {
    handleMouseup({
      pageX: e.touches[0].pageX,
      pageY: e.touches[0].pageY
    });
  };
  const handleKeydown = e => {
    if (!body.classList.contains('modal-opened')) {
      switch (e.keyCode) {
        case 38:
          dy += 0.1;
          break;
        case 40:
          dy -= 0.1;
          break;
        case 39:
          dx -= 0.1;
          break;
        case 37:
          dx += 0.1;
          break;
        case 9:
          if (selectedKnowledge === undefined) {
            selectedKnowledge = 0;
          } else {
            selectedKnowledge += e.shiftKey ? -1 : 1;
            if (selectedKnowledge < 0) {
              selectedKnowledge = dataSet.length - 1;
            }
            if (selectedKnowledge > dataSet.length - 1) {
              selectedKnowledge = 0;
            }
          }
          console.log(dataSet[selectedKnowledge].area.width);
          dx =
            0.5 +
            offsetLeft -
            dataSet[selectedKnowledge].area.left -
            dataSet[selectedKnowledge].area.width * 0.5;
          dy =
            0.5 +
            offsetTop -
            dataSet[selectedKnowledge].area.top -
            dataSet[selectedKnowledge].area.height * 0.5;
          break;
        case 32:
        case 13:
          document.location.href = `#modal/${dataSet[selectedKnowledge || 0].slug}`;
          break;
      }
      e.preventDefault();
      e.stopPropagation();
    }
  };
  const addListeners = all => {
    if (!all) {
      window.addEventListener('resize', handleResize);
    } else {
      body.addEventListener('mousedown', handleMousedown);
      body.addEventListener('mousemove', handleMousemove);
      body.addEventListener('mouseup', handleMouseup);
      body.addEventListener('touchstart', touchDown, false);
      body.addEventListener('touchmove', touchMove, false);
      body.addEventListener('touchend', touchEnd, false);
      body.addEventListener('keydown', handleKeydown);
    }
  };
  const drawSpiral = () => {
    let sx = 0, sy = 0, d = 1, m = 1, qty = imgsLoaded, i = 0, n = 0;
    while (i < qty) {
      while (2 * sx * d < m) {
        if (n >= imgsLoaded) {
          break;
        }
        sx = sx + d;
        drawImage(n, sx, sy);
        n++;
      }
      while (2 * sy * d < m) {
        if (n >= imgsLoaded) {
          break;
        }
        sy = sy + d;
        drawImage(n, sx, sy);
        n++;
      }
      if (n >= imgsLoaded) {
        break;
      }
      d = -1 * d;
      m = m + 1;
      i++;
    }
  };
  const drawImage = (n, sx, sy) => {
    sx *= 0.3;
    sy *= 0.3;
    textureCtx.save();
    textureCtx.translate(sx * scale + x * scale, sy * scale + y * scale);
    dataSet[n].area = {
      left: sx,
      top: sy,
      right: sx + dataSet[n].imageData.width / scale,
      bottom: sy + dataSet[n].imageData.height / scale,
      width: dataSet[n].imageData.width / scale,
      height: dataSet[n].imageData.height / scale
    };
    textureCtx.drawImage(
      dataSet[n].imageData,
      0,
      0,
      dataSet[n].imageData.width,
      dataSet[n].imageData.height
    );
    textureCtx.restore();
  };
  const initApp = () => {
    loadData().then(loadImages, logError);
    loadTexture();
  };
  const loadData = () => {
    return new Promise((resolve, reject) => {
      let req = new XMLHttpRequest();
      req.open('GET', 'data/data.json', true);
      req.onload = () => {
        if (req.status === 200) {
          resolve(JSON.parse(req.responseText));
        } else {
          reject(Error(req.statusText));
        }
      };

      req.onerror = function() {
        reject(Error('Network Error'));
      };
      req.send();
    });
  };
  const logError = error => console.log(error);
  const initData = data => {
    dataSet = data;
    imgsQty = data.length;
    dataSet.forEach((data, i) => {
      data.slug = slugify(data.title);
      data.index = i;
      data.area = { left: 0, top: 0, right: 0, bottom: 0 };
      body.appendChild(modalBuilder(data));
    });
  };
  const initModalAndRouter = () => {
    Modal();
    new Router().dispatch().extendRoute('#modal/:modalId', (modalId, e) => {
      let index = dataSet.find(el => el.slug === modalId);
      if (index) {
        Q.one(`[data-title="${index.slug}"] h2`).textContent = index.title;
        Q.one(`[data-title="${index.slug}"] article`).innerHTML = index.text;
        selectedKnowledge = index.index;
        if (index.media) {
          let el = img({ src: index.media });
          Q.one(`[data-title="${index.slug}"] article`).insertBefore(
            el,
            Q.one(`[data-title="${index.slug}"] article`).firstChild
          );
        }
      }
    });
  };
  const loadImages = data => {
    if (data) {
      initData(data);
      initModalAndRouter();
    }
    let image = new Image();
    image.onload = e => {
      dataSet[imgsLoaded].imageData = e.target;
      imgsLoaded++;
      if (imgsLoaded < imgsQty) {
        loadImages();
      }
      if (imgsLoaded === 1) {
        addListeners(true);
      }
    };
    image.src = dataSet[imgsLoaded].image;
  };
  const loadTexture = () => {
    let img = new Image();
    img.onload = () => {
      texturePattern = textureCtx.createPattern(img, 'repeat');
      fillTexture(true);
      render();
    };
    img.src = 'img/texture.jpg';
  };
  const fillTexture = reset => {
    if (reset) {
      textureCtx.fillStyle = texturePattern;
    }
    textureCtx.fillRect(-(x * scale), -(y * scale), scale, scale);
    // textureCtx.fill();
  };
  const render = () => {
    requestAnimationFrame(render);
    renderTexture();
    drawSpiral();
  };

  const renderTexture = () => {
    x += (dx - x) * 0.1;
    y += (dy - y) * 0.1;
    textureCtx.save();
    textureCtx.translate(x * scale, y * scale);
    fillTexture();
    textureCtx.restore();
  };

  let texturePattern,
    imgsQty,
    dataSet,
    selectedKnowledge,
    imgsLoaded = 0,
    images = [],
    scale,
    offsetTop,
    offsetLeft,
    grabbing = false,
    dx = 0,
    dy = 0,
    x = 0,
    y = 0,
    mx,
    my,
    clickTime;

  handleResize();
  addListeners();
  initApp();
}
