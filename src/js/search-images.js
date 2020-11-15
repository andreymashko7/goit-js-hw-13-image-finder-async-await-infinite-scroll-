import GaleryApiService from './apiService';
import imageTpl from '../templates/img-card.hbs';
import getRefs from './get-refs';
import { onOpenModal } from './modal.js';
import { emptyInput, Error } from './notify.js';

const refs = getRefs();
// let currentPosition = 0;
const galeryApiService = new GaleryApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.imageContainer.addEventListener('click', onOpenModal);

async function onSearch(e) {
  e.preventDefault();

  try {
    galeryApiService.query = e.currentTarget.elements.query.value;

    if (galeryApiService.query === '') {
      clearMarkup();
      emptyInput();
      return;
    } else {
      galeryApiService.resetPage();
      clearMarkup();
      fetchFotos();
    }
  } catch (error) {
    console.log(error);
  }
}

async function fetchFotos() {
  // currentPosition = refs.imageContainer.offsetHeight;

  try {
    const response = await galeryApiService.fetchFotos();
    renderImagesMarcup(response);
  } catch (error) {
    console.log('ошибка');
  }
}

function renderImagesMarcup(images) {
  refs.imageContainer.insertAdjacentHTML('beforeend', imageTpl(images));
}

function clearMarkup() {
  refs.imageContainer.innerHTML = '';
}

const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && galeryApiService.query !== '') {
      galeryApiService.fetchFotos().then(images => {
        renderImagesMarcup(images);
      });
    }
  });
};

const options = {
  rootMargin: '200px',
};

const observer = new IntersectionObserver(onEntry, options);
observer.observe(refs.sentinel);

// -----------------------------На промисах ---------------------------------------------

// function onSearch(e) {
//   e.preventDefault();
//   galeryApiService.query = e.currentTarget.elements.query.value;

//   if (galeryApiService.query === '') {
//     clearMarkup();
//     loadMoreBtn.hide();
//     emptyInput();
//     return;
//   } else {
//     loadMoreBtn.show();
//     galeryApiService.resetPage();
//     clearMarkup();
//     fetchFotos();
//   }
// }

// function fetchFotos() {
//   loadMoreBtn.show();
//   loadMoreBtn.disable();

//   currentPosition = refs.imageContainer.offsetHeight;

//   galeryApiService.fetchFotos().then(images => {
//     renderImagesMarcup(images);
//     loadMoreBtn.enable();
//   });
// }
