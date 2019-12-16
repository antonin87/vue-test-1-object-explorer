import _ from 'lodash';
import $ from 'jquery';
import babelPolyfill from 'babel-polyfill';

let obj = {
  nested: {
    object: {
      object: {
        hello: 'world'
      }
    },
    other: 'universe'
  },
  bye: 'bye'
}

let objDom = '';

/**
 * Construct DOM structure from object
 * @param {*} obj 
 */
const constructDOMFromObj = (obj) => {
  Object.keys(obj).forEach( key => {
    if (typeof obj[key] === 'object') {
      objDom += '<div data-id="object">';
      objDom += `<input name="${key}" data-id="${key}" class="block nested" type="text" value="${key}" />`;
      constructDOMFromObj(obj[key]);
      objDom += '</div>';
    } else {
      objDom += '<div data-id="pair">';
      objDom += `<input name="${key}" data-id="${key}" type="text" value="${key}" />`;
      objDom += `<input data-id="${obj[key]}" type="text" value="${obj[key]}" />`;
      objDom += '</div>';
    }
  })
  return objDom;
}

/**
 * Retrieve object from DOM structure
 * @param {*} element 
 * @param {*} result 
 */
const constructObjFromDOM = (element, result = {}) => {
  const divs = element.querySelectorAll(':scope > div');
  const inputs = element.querySelectorAll(':scope > input');
  const [key, value] = [...inputs].map(e => e.value);
  if (element.dataset.id == 'pair') {
    result[key] = value
  }
  divs.forEach(div => {
     if (!result[key]) {
      result[key] = {}
    }
    constructObjFromDOM(div, result[key])
  })

  return result;
}


const init =  () => {
  const formElement = $('#app .form');
  const preElement = $('#app pre');
  const DomObj = constructDOMFromObj(obj);
  formElement.append(DomObj);
  document.querySelector('.button').addEventListener('click', () => {
    const body = formElement[0];
    const result = constructObjFromDOM(body);
    preElement
        .empty()
        .append(JSON.stringify(result));
  });
}

init();