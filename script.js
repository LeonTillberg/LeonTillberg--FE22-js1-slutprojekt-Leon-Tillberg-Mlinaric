//globala variabler:
const loadingContainer = document.getElementById('container');
let path = anime.path('path');
let quantity;
const errorH3 = document.querySelector("#error-message");
loadingContainer.style.display = 'none';

//Button eventListener:
const btn = document.querySelector("#search-btn");
btn.addEventListener("click", getPics);

function getPics(event) {
    event.preventDefault();
    document.querySelector("#picture-container").innerHTML = '';
    errorH3.innerText = "";
    const inputSearch = document.querySelector("#user-text");
    const search = inputSearch.value;

    const inputQuantity = document.querySelector("#user-quantity");
    const picsAmount = inputQuantity.value;
    if (picsAmount > 0) {
        quantity = inputQuantity.value;
    }
    else {
        errorH3.innerText = "Ops! Please define a positive amount of picture quantity.";
        document.querySelector("#picture-container").innerHTML = '';
    }

    const inputSorting = document.querySelectorAll('input[name="sort"]');
    let selectedSort;
    for (const chosenSort of inputSorting) {
        if (chosenSort.checked) {
            selectedSort = chosenSort.value;
            break;
        }
    }

    fetchPics(search, selectedSort, quantity);
}

//Fetch-then-catch:
function fetchPics(picsSearch, picsSorting, picsQuantity) {
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=596a5cee9eb38338b469b210b360248c&text=${picsSearch}&sort=${picsSorting}&per_page=${picsQuantity}&format=json&nojsoncallback=1`;

    displayLoading();

    fetch(url)
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            }
            else {
                throw 'Data could not get fetched';
            }
        })
        .then(displayPics)
        .then(hideLoading)
        .catch(handleError);
}

//Animation:
function displayLoading() {
    loadingContainer.style.display = 'block';
    const loadingAnime = anime({
        targets: '.circle',
        translateX: path('x'),
        translateY: path('y'),
        easing: 'linear',
        duration: 500,
        loop: true,
    });
    anime(loadingAnime)
}

function hideLoading() {
    loadingContainer.style.display = 'none';
}

//Visa bilder:
function displayPics(picsData) {
    if (quantity > 0 && picsData.photos.photo.length > 0) {
        for (i = 0; i < picsData.photos.photo.length; i++) {

            const divs = document.createElement('div');
            document.querySelector("#picture-container").append(divs);

            const serverId = picsData.photos.photo[i].server;

            const id = picsData.photos.photo[i].id;

            const secret = picsData.photos.photo[i].secret;

            const chooseSize = document.querySelectorAll('input[name="size"]');
            let selectedSize;
            for (const chosenSize of chooseSize) {
                if (chosenSize.checked) {
                    selectedSize = chosenSize.value;
                    break;
                }

            }
            picUrl = `https://live.staticflickr.com/${serverId}/${id}_${secret}_${selectedSize}.jpg`;

            const picImg = document.createElement("img");
            picImg.src = picUrl;

            divs.append(picImg);
        }
    }
    else {
        errorH3.innerText = "Ops! Couldn't find any images!";
    }
}

//Visa errors:
function handleError(error) {
    console.log(error);
    errorH3.innerText = error;
    if (error == "TypeError: picsData.photos is undefined") {
        errorH3.innerText = "Ops! Please fill in the search-term!";
    }
    else if (error == "TypeError: NetworkError when attempting to fetch resource.") {
        errorH3.innerText = "Ops! You need to connect to the internet to continue!";
    }
    else {
        errorH3.innerText = "Ops! Something went horribly wrong.";
    }
}
