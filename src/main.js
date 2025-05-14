import "./style.css";
import axios from "axios";
import "izitoast/dist/css/iziToast.min.css";
import iziToast from "izitoast";

const searchInput = document.querySelector("#input");
const searchButton = document.querySelector("#search-btn");
const searchForm = document.querySelector("#form");
const galleryList = document.querySelector("#list");
const modalWindow = document.querySelector("#imageModal");
const modalImage = document.querySelector("#modalImage");
const modalCloseBtn = document.querySelector(".close-button");

axios.defaults.baseURL = "https://pixabay.com";

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  galleryList.innerHTML = "";

  if (!searchInput.value) return;

  axios
    .get("/api/", {
      params: {
        key: "50136722-5844e52b964210bda2ded8792",
        q: searchInput.value,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
      },
    })
    .then((response) => {
      const images = response.data.hits;

      if (images.length === 0) {
        iziToast.error({
          title: "Error",
          message:
            "Sorry, there are no images matching your search query. Please try again!",
          position: "topRight",
        });
        return;
      }

      iziToast.success({
        title: "Success!",
        message: "We have found you some beautiful pictures!",
        position: "topRight",
      });

      images.forEach((image) => {
        const listItem = document.createElement("li");

        const imageEl = document.createElement("img");
        imageEl.classList.add("card-image");
        imageEl.src = image.webformatURL;
        imageEl.alt = image.tags;

        imageEl.addEventListener("click", () => {
          modalImage.src = image.largeImageURL;
          modalImage.alt = image.tags;
          modalWindow.style.display = "block";
          document.body.style.overflow = "hidden";
        });

        const statsBlock = document.createElement("div");
        statsBlock.classList.add("card-stats");

        const likes = document.createElement("p");
        likes.classList.add("card-text");
        likes.textContent = `Likes: ${image.likes}`;

        const views = document.createElement("p");
        views.classList.add("card-text");
        views.textContent = `Views: ${image.views}`;

        const comments = document.createElement("p");
        comments.classList.add("card-text");
        comments.textContent = `Comments: ${image.comments}`;

        const downloads = document.createElement("p");
        downloads.classList.add("card-text");
        downloads.textContent = `Downloads: ${image.downloads}`;

        statsBlock.append(likes, views, comments, downloads);
        listItem.append(imageEl, statsBlock);
        galleryList.insertAdjacentElement("afterbegin", listItem);
      });
    })
    .catch((error) => {
      console.error(error.message);
      iziToast.error({
        title: "Error",
        message: "Something went wrong! Please try again later.",
        position: "topRight",
      });
    });

  searchInput.value = "";
});

modalCloseBtn.addEventListener("click", () => {
  modalWindow.style.display = "none";
  document.body.style.overflow = "auto";
});

modalWindow.addEventListener("click", (event) => {
  if (event.target === modalWindow) {
    modalWindow.style.display = "none";
    document.body.style.overflow = "auto";
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modalWindow.style.display === "block") {
    modalWindow.style.display = "none";
    document.body.style.overflow = "auto";
  }
});
