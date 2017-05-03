import Router from 'Router';
import Modal from 'Modal';
import throttle from 'throttle';
import slugify from 'slug';
import * as Helpers from 'Helpers';
import * as Q from 'rkgttr-q';
import Publisher from 'rkgttr-publisher';
import {search} from 'fuzzy';
// import uuid from 'rkgttr-uuid';
// import Prng from 'rkgttr-prng';



// Uncomment the following if you wish to use the Elements module, add the elements you want to unlock in the {}
import { img, div, article, a, h2, input, label } from 'rkgttr-elements';

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
  const filterBuilder = string => {
    return div(
      { className: 'filter' },
      input({
        type: 'checkbox',
        checked: true,
        id: slugify(string),
        dataset: {
          filter: string
        },
        onmousedown: e => e.stopPropagation(),
        onmouseup: e => e.stopPropagation(),
        onchange: e => {
          if (
            e.target.getAttribute('data-filter') === 'Toutes les catégories' &&
            e.target.checked
          ) {
            Q.all('.filter input:not(:checked)').forEach(
              cb => (cb.checked = true)
            );
          } else if (
            e.target.getAttribute('data-filter') === 'Toutes les catégories' &&
            !e.target.checked
          ) {
            e.target.checked = true;
          } else if (Q.all('.filter input:checked').length === 0) {
            e.target.checked = true;
          } else {
            if (
              Q.all(
                '.filter input:checked:not([data-filter="Toutes les catégories"])'
              ).length <
              Q.all('.filter input:not([data-filter="Toutes les catégories"])')
                .length
            ) {
              Q.one('[data-filter="Toutes les catégories"]').checked = false;
            } else {
              Q.one('[data-filter="Toutes les catégories"]').checked = true;
            }
          }
          filterData();
        }
      }),
      label(
        {
          for: slugify(string),
          onmousedown: e => e.stopPropagation(),
          onmouseup: e => e.stopPropagation()
        },
        string
      )
    );
  };
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
    if (!body.classList.contains('modal-opened') && e.which === 1) {
      clickTime = Date.now();
      body.classList.add('grabbing');
      grabbing = true;
      mx = e.pageX / scale;
      my = e.pageY / scale;
    }
  };
  const handleMousemove = e => {
    if (!body.classList.contains('modal-opened') && e.which === 1) {
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
    if (!body.classList.contains('modal-opened') && e.which === 1) {
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
      pageY: e.touches[0].pageY,
      which: 1
    });
  };
  const touchMove = e => {
    handleMousemove({
      pageX: e.touches[0].pageX,
      pageY: e.touches[0].pageY,
      which: 1
    });
  };
  const touchEnd = e => {
    handleMouseup({
      pageX: e.touches[0].pageX,
      pageY: e.touches[0].pageY,
      which: 1
    });
  };
  const handleKeydown = e => {
    if (!body.classList.contains('modal-opened') && e.target.getAttribute('id') !== 'search') {
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
  const HandleShowFilter = e => {
    e.stopPropagation();
    let filters = Q.one('.filters'), button = Q.one('.filters-show');
    if (filters.classList.contains('filters-shown')) {
      filters.classList.remove('filters-shown');
      button.classList.remove('filters-show--close');
    } else {
      filters.classList.add('filters-shown');
      button.classList.add('filters-show--close');
    }
  };
  const searchHandler = e => {
    e.preventDefault();
    initData(fullData);
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
      Q.one('.filters-show').addEventListener('click', HandleShowFilter);
      Q.one('.filters-show').addEventListener('mousedown', e =>
        e.stopPropagation()
      );
      Q.one('.filters-show').addEventListener('mouseup', e =>
        e.stopPropagation()
      );
      Q.one('.search').addEventListener('mousedown', e =>
        e.stopPropagation()
      );
      Q.one('.search').addEventListener('mouseup', e =>
        e.stopPropagation()
      );
      Q.one('.search').addEventListener('submit', searchHandler);
    }
  };
  const distance = (ax, ay, bx, by) => {
    let distx = ax - bx, disty = ay - by;
    return Math.sqrt(distx * distx + disty * disty);
  };
  const drawSpiral = () => {
    dataSet.forEach((data, i) => {
      drawImage(i, data.sx, data.sy);
    });
  };
  const drawImage = (n, sx, sy) => {
    if (distance(sx, sy, -x, -y) < minDistanceDisplay && dataSet[n].imageData) {
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
    }
  };
  const initApp = () => {
    loadData().then(processData, logError);
    loadTexture();
  };
  const loadData = () => {
    return new Promise((resolve, reject) => {
      let req = new XMLHttpRequest();
      req.open('GET', 'data/data.json', true);
      req.onload = () => {
        if (req.status === 200) {
          fullData = JSON.parse(req.responseText);
          fullData.forEach(d => d.categories.push('Toutes les catégories'));
          resolve(fullData);
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
  const filterData = () => {
    initData(
      fullData,
      Q.all('.filter input:checked').map(f => f.getAttribute('data-filter'))
    );
  };
  const initData = (data, filter = ['Toutes les catégories']) => {
    dataSet = data.filter(
      d => filter.filter(f => ~d.categories.indexOf(f)).length
    );
    if(Q.id('search').value.length){
      dataSet = search(Q.id('search').value, dataSet, {keySelector: obj => obj.title});
    }
    imgsQty = data.length;
    dataSet.forEach((data, i) => {
      data.slug = slugify(data.title);
      data.index = i;
      data.area = { left: 0, top: 0, right: 0, bottom: 0 };
      body.appendChild(modalBuilder(data));
    });
    let sx = 0,
      sy = 0,
      d = 1,
      m = 1,
      qty = dataSet.length * 2,
      i = 0,
      n = 0,
      dataI;
    while (i < qty) {
      while (2 * sx * d < m) {
        if (n === dataSet.length) {
          break;
        }
        sx = sx + d;
        dataI = dataSet[n];
        dataI.sx = sx * 0.3;
        dataI.sy = sy * 0.3;
        n++;
      }
      while (2 * sy * d < m) {
        if (n === dataSet.length) {
          break;
        }
        sy = sy + d;
        dataI = dataSet[n];
        dataI.sx = sx * 0.3;
        dataI.sy = sy * 0.3;
        n++;
      }
      if (n === dataSet.length) {
        break;
      }
      d = -1 * d;
      m = m + 1;
      i++;
    }
    console.log('-----', search("esanc", dataSet, {keySelector: obj => obj.title}));
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
  const loadImagesBasedOnDistance = throttle(() => {
    dataSet.forEach(data => {
      if (
        distance(data.sx, data.sy, -x, -y) < minDistanceLoad &&
        !data.imageData
      ) {
        let image = new Image();
        image.onload = e => {
          data.imageData = e.target;
        };
        image.src = data.image;
      } else if (
        distance(data.sx, data.sy, -x, -y) >= minDistanceLoad &&
        data.imageData
      ) {
        data.imageData = null;
      }
    });
  }, 200);
  const processData = data => {
    setFilters(data);
    initData(data);
    initModalAndRouter();
    loadImagesBasedOnDistance();
    addListeners(true);
  };
  const setFilters = data => {
    data
      .map(d => d.categories)
      .reduce((a, b) => a.concat(b))
      .filter((e, i, a) => a.indexOf(e) === i)
      .sort()
      .forEach(e => Q.one('.filters').appendChild(filterBuilder(e)));
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
  };
  const render = () => {
    requestAnimationFrame(render);
    renderTexture();
    loadImagesBasedOnDistance();
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

  const minDistanceDisplay = 1;
  const minDistanceLoad = minDistanceDisplay * 2;

  let texturePattern,
    imgsQty,
    fullData,
    dataSet,
    selectedKnowledge,
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
