let token = localStorage.getItem("token");
let page = 1;
let result = document.querySelector("#result");
let section = document.querySelector("section .container-fluid");
let paginationParent = document.querySelector("#pagination-parent");
let pagination = document.querySelector(".pagination");
let nextPagination = document.querySelector(".next");
let previousPagination = document.querySelector(".previous");
let paginationLinks = document.querySelectorAll(".page-link");
let sliceStartIndex = 0;
let slicelimit = 8;
let plussing = 7;
let bookSearch = document.querySelector("#book-search");
let bookMark = document.querySelector("#bookmark");
let modal = document.querySelector("section.modal");
let dataModal = [];
let searchBtn = document.querySelector("#searchBtn");
let search = bookSearch.value;

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  search = bookSearch.value;
  getData(search, 0, 24);
});
let news = document.querySelector("#news");
if (!token) {
  window.location.replace("index.html");
}
let bookMarkProducts = JSON.parse(localStorage.getItem("bookMark")) || [];
for (let i = 0; i < bookMarkProducts.length; i++) {
  addToBookmark(
    bookMarkProducts[i].volumeInfo.title,
    bookMarkProducts[i].volumeInfo.authors,
    bookMarkProducts[i].volumeInfo.previewLink
  );
}
const logoutBtn = document.querySelector("#logout");
let dropdown = document.querySelector(".my-dropdown");
let books = document.querySelector(".navbarSupportedContent");

logoutBtn.addEventListener("click", (e) => {
  localStorage.removeItem("token");
});

async function getData(search, startIndex, limit) {
  let respone = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=(${search})&startIndex=${startIndex}&maxResults=${limit}&orderBy=newest`
  ).catch((error) => {
    alert("error");
  });
  let Ddata = await respone.json();
  let data = Ddata.items;
  let slicedData = data.slice(sliceStartIndex, slicelimit);
  for (let i = 0; i < slicedData.length; i++) {
    createCard(
      data[i].volumeInfo.title,
      data[i].volumeInfo.publishedDate,
      data[i].volumeInfo.authors,
      data[i].volumeInfo.imageLinks.smallThumbnail,
      data[i].volumeInfo.previewLink
    );
  }
  console.log(slicedData);
  section.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-outline-primary")) {
      let card = e.target.parentElement.parentElement.parentElement;
      let cardID = card.getAttribute("data-id");
      let findedCard = data.find((b) => b.volumeInfo.title == cardID);
      dataModal.push(findedCard);
      modal.style.transform = "translateX(0px)";
      for (let i = 0; i < dataModal.length; i++) {
        modal.innerHTML = "";
        bookModal(
          dataModal[i].volumeInfo.title,
          dataModal[i].volumeInfo.imageLinks.smallThumbnail,
          dataModal[i].volumeInfo.description,
          dataModal[i].volumeInfo.authors,
          dataModal[i].volumeInfo.publishedDate,
          dataModal[i].volumeInfo.publisher,
          dataModal[i].volumeInfo.categories
        );
      }
      let close = document.querySelector(".fa-xmark");
      close.addEventListener("click", (e) => {
        modal.style.transform = "translateX(2000px)";
      });
    } else if (e.target.classList.contains("book-mark")) {
      let card = e.target.parentElement.parentElement.parentElement;
      let cardID = card.getAttribute("data-id");
      let findedCard = data.find((b) => b.volumeInfo.title == cardID);

      bookMarkProducts.push(findedCard);
      localStorage.setItem("bookMark", JSON.stringify(bookMarkProducts));
      bookMark.innerHTML = "";
      for (let i = 0; i < bookMarkProducts.length; i++) {
        addToBookmark(
          bookMarkProducts[i].volumeInfo.title,
          bookMarkProducts[i].volumeInfo.authors,
          bookMarkProducts[i].volumeInfo.previewLink
        );
      }
    }
  });
  bookMark.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-delete-left")) {
      let card = e.target.parentElement.parentElement.parentElement;
      let cardID = card.getAttribute("data-id");
      card.remove();
      bookMarkProducts = bookMarkProducts.filter((b) => {
        return b.volumeInfo.title !== cardID;
      });
      localStorage.setItem("bookMark", JSON.stringify(bookMarkProducts));
    }
  });

  paginationParent.classList.add("true");
  result.innerText = `Showing ${limit} Result(s)`;
}

function createCard(title, year, authors, image, info) {
  let card = document.createElement("div");
  card.setAttribute("data-id", title);
  section.append(card);
  card.className = "card";
  let card_body = document.createElement("div");
  let card_img_top = document.createElement("img");
  card_img_top.className = "card-img-top";
  card_body.className = "card-body";
  card_img_top.setAttribute("src", image);
  card_img_top.setAttribute("alt", title);
  card.append(card_img_top);
  card.append(card_body);
  let cardTitle = document.createElement("h5");
  cardTitle.innerText = title;
  let author = document.createElement("p");
  let years = document.createElement("p");
  author.innerText = authors;
  years.innerText = year;
  card_body.append(cardTitle);
  card_body.append(author);
  card_body.append(years);
  let btns = document.createElement("btns");
  let link1 = document.createElement("a");
  let link2 = document.createElement("a");
  let link3 = document.createElement("a");
  btns.className = "btns";
  card_body.append(btns);
  link3.classList.add("fw-bold", "btn", "btn-secondary", "read");
  link2.classList.add("fw-bold", "btn", "btn-outline-primary", "more-info");
  link1.classList.add("fw-bold", "btn", "btn-warning", "book-mark");
  link1.innerText = "BookMark";
  link2.innerText = "More Info";
  link3.href = info;
  link3.setAttribute("target", "_blanck");
  link3.innerText = "Read";
  btns.append(link1, link2, link3);
  return card;
}
function addToBookmark(title, authors, info) {
  let markCard = document.createElement("div");
  bookMark.append(markCard);
  markCard.className = "books-card";
  markCard.setAttribute("data-id", title);
  let text = document.createElement("div");
  text.className = "my-text";
  let h3 = document.createElement("h3");
  h3.innerText = title;
  let p = document.createElement("p");
  p.innerText = authors;
  markCard.append(text);
  text.append(h3);
  text.append(p);
  let icons = document.createElement("div");
  icons.classList.add("my-icons", "fs-3");
  markCard.append(icons);
  let a1 = document.createElement("a");
  let a2 = document.createElement("a");
  a1.setAttribute("href", info);
  let bookIcon = document.createElement("i");
  let removeIcon = document.createElement("i");
  bookIcon.classList.add("fa-solid", "fa-book-open");
  removeIcon.classList.add(
    "fa-solid",
    "fa-delete-left",
    "text-warning-emphasis"
  );
  a1.append(bookIcon);
  a2.append(removeIcon);
  icons.append(a1, a2);
  return markCard;
}
function bookModal(
  title,
  image,
  subtitle,
  author,
  year,
  publisher,
  catigoriyes
) {
  let modalContainer = document.createElement("aside");
  modalContainer.className = "container-fluid";
  modal.append(modalContainer);
  let modalTop = document.createElement("div");
  modalContainer.append(modalTop);
  modalTop.className = "modal-top";
  let h2 = document.createElement("h2");
  let a = document.createElement("a");
  let icon = document.createElement("i");
  icon.classList.add("fa-solid", "fa-xmark");
  h2.innerText = title;
  a.append(icon);
  modalTop.append(h2);
  modalTop.append(a);
  let modalBody = document.createElement("div");
  modalBody.className = "modal-body";
  modalContainer.append(modalBody);
  let img = document.createElement("img");
  img.setAttribute("src", image);
  modalBody.append(img);
  let p = document.createElement("p");
  p.innerText = subtitle;
  modalBody.append(p);
  let modalBottom = document.createElement("div");
  modalContainer.append(modalBottom);
  modalBottom.className = "modal-bottom";
  let authors = document.createElement("span");
  let years = document.createElement("span");
  let publishers = document.createElement("span");
  let catigoriye = document.createElement("span");
  authors.innerText = `Authors:    ${author}`;
  years.innerText = `Published:    ${year} date`;
  publishers.innerText = `Publisher:    ${publisher}`;
  catigoriye.innerText = `Catigories:    ${catigoriyes}`;
  modalBottom.append(authors, years, publishers, catigoriye);
  return modalContainer;
}

paginationLinks.forEach((paginationLink) => {
  paginationLink.addEventListener("click", (e) => {
    let clickedPage = e.target.innerText;
    let activeLink = document.querySelector(".page-item.active");
    if (page !== 3) {
      nextPagination.removeAttribute("disabled");
    }
    if (page !== 1) {
      previousPagination.removeAttribute("disabled");
    }

    if (clickedPage === "Next") {
      page++;
      sliceStartIndex += plussing + 1;
      slicelimit += plussing + 1;
      activeLink.classList.remove("active");
      paginationLinks[page].parentElement.classList.add("active");
    } else if (clickedPage === "Previous") {
      page--;
      sliceStartIndex -= plussing + 1;
      slicelimit -= plussing + 1;
      activeLink.classList.remove("active");
      paginationLinks[page].parentElement.classList.add("active");
    } else {
      page = +clickedPage;
      if (page % 2) {
        sliceStartIndex += 8;
        slicelimit = page * 2 + plussing + 7;
      } else {
        sliceStartIndex += 8;
        slicelimit = page * 2 + plussing + 5;
      }
      console.log(sliceStartIndex);
      activeLink.classList.remove("active");
      paginationLinks[page].parentElement.classList.add("active");
    }

    if (page === 3) {
      nextPagination.setAttribute("disabled", true);
    }
    if (page === 1) {
      previousPagination.setAttribute("disabled", true);
    }
    section.innerHTML = "";
    getData(search, sliceStartIndex, slicelimit);
  });
});
