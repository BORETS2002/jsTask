const list = document.querySelector(".list");
const sortSelect = document.getElementById("sort-select");
const searc = document.querySelector(".searc");

let currentPage = 0;
let data = [];

// pagination tanlab olish
const paginate = (page) => {
  currentPage = page - 1;
  fetchData(
    `https://dummyjson.com/products?limit=20&skip=${
      currentPage * 20
    }&select=title,price,images,category`,
  );
};

//  data olish funktsiyasi
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const { products } = await response.json();
    data = products.slice(0, 20); // har ehtimolga qarshi ishlatildi slice
    updatePagination();
  } catch (error) {
    console.error("Xato yuz berdi:", error);
  }
};

// DOM ga chizish
const updatePagination = () => {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  // 20 ta  page
  const totalPages = Math.ceil(data.length / 4);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.className = "page-link";
    pageButton.addEventListener("click", () => paginate(i));
    pagination.appendChild(pageButton);
  }
  const frag = new DocumentFragment();

  data.forEach((item) => {
    const temp = document.querySelector(".template").content.cloneNode(true);
    list.innerHTML = "";
    temp.querySelector(".text").textContent = item.title;
    temp.querySelector(".price").innerHTML = item.price;
    temp.querySelector(".img").src = item.images[0];

    frag.append(temp);
  });
  list.appendChild(frag);
};
fetchData(
  `https://dummyjson.com/products?limit=20&skip=${
    currentPage * 20
  }&select=title,price,images,category`,
);

// Mahsulotlarni sortlash
const sortProducts = (selectedValue) => {
  data.sort((a, b) => {
    if (selectedValue === "arzoni") {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });
  updatePagination();
};

// Select o'zgartirilganda sortlashni chaqirish
sortSelect.addEventListener("change", () => {
  const selectedValue = sortSelect.value;
  sortProducts(selectedValue);
});

// search qidirish
searc.addEventListener("change", () => {
  const Search = searc.value;
  list.innerHTML = "";
  fetchData(`https://dummyjson.com/products/search?q=${Search}`);
});

// filtr qilish
let filtr = document.getElementById("filter-select");
fetch("https://dummyjson.com/products/categories")
  .then((res) => res.json())
  .then((data) => {
    data.forEach((item) => {
      let option = document.createElement("option");
      option.text = item;
      filtr.appendChild(option);
    });
  });

filtr.addEventListener("change", () => {
  fetch(`https://dummyjson.com/products/category/${filtr.value}`)
    .then((res) => res.json())
    .then(console.log);
  fetchData(`https://dummyjson.com/products/category/${filtr.value}`);
});
