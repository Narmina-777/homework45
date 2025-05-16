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
