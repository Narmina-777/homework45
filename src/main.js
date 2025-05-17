import "./style.css";
import axios from "axios";
import "izitoast/dist/css/iziToast.min.css";
import iziToast from "izitoast";

const input = document.querySelector("#input");
const form = document.querySelector("#form");
const list = document.querySelector("#list");
const modal = document.querySelector("#imageModal");
const modalImg = document.querySelector("#modalImage");
const closeBtn = document.querySelector("#modalCloseBtn");

axios.defaults.baseURL = "https://pixabay.com";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  list.innerHTML = "";

  const searchTerm = input.value.trim();
  if (!searchTerm) return;

  axios
    .get("/api/", {
      params: {
        key: "50347346-db2d02a6938fe00c79cc7c3f1",
        q: searchTerm,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
      },
    })
    .then(({ data }) => {
      const images = data.hits;

      if (!images.length) {
        iziToast.error({
          title: "УПС!",
          message: "Изображения не найдены. Попробуйте что-нибудь другое.",
          position: "topRight",
        });
        return;
      }

      iziToast.success({
        title: "Найдено!",
        message: "Вот ваши фотографии🎉",
        position: "topRight",
      });

      images.forEach((img) => {
        const item = document.createElement("li");

        const pic = document.createElement("img");
        pic.className = "image-card";
        pic.src = img.webformatURL;
        pic.alt = img.tags;

        pic.addEventListener("click", () => {
          modalImg.src = "";
          modalImg.alt = "";

          modal.style.display = "block";
          document.body.style.overflow = "hidden";

          closeBtn.style.display = "none";

          modalImg.src = img.largeImageURL;
          modalImg.alt = img.tags;

          modalImg.onload = () => {
            closeBtn.style.display = "block";
          };
        });

        const info = document.createElement("div");
        info.className = "image-info";
        info.innerHTML = `
          <p class="info-text">Likes: ${img.likes}</p>
          <p class="info-text">Views: ${img.views}</p>
          <p class="info-text">Comments: ${img.comments}</p>
          <p class="info-text">Downloads: ${img.downloads}</p>
        `;

        item.append(pic, info);
        list.prepend(item);
      });
    })
    .catch(() => {
      iziToast.error({
        title: "Ошибка",
        message: "Что-то пошло не так. Попробуйте еще раз позже.",
        position: "topRight",
      });
    });

  input.value = "";
});

const closeModal = () => {
  modal.style.display = "none";
};

closeBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
