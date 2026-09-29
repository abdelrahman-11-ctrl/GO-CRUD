const API = "http://localhost:3000";
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "../auth/login.html";
}
async function request(path, options = {}, skipAuthRedirect = false) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 401 && !skipAuthRedirect) {
    localStorage.removeItem("token");
    window.location.href = "../auth/login.html";
  }
  return res;
}
let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");
let search = document.getElementById("search");
//create or update mode
let mode = "create";
//id of the product being updated
let tmp;
//for total
function getTotal() {
  if (price.value != "") {
    let result = +price.value + +taxes.value + +ads.value - discount.value;
    total.innerHTML = result;
    total.style.background = "#00a136";
  } else {
    total.innerHTML = "0";
    total.style.background = "rgba(11, 13, 69, 0.703)";
  }
}

let datapro = [];
async function loadProducts() {
  const res = await request("/products");
  if (!res.ok) return;
  datapro = await res.json();
  showdata();
}
loadProducts();

async function loadUser() {
  const res = await request("/users/me");
  if (!res.ok) return;
  const user = await res.json();
  document.getElementById("userName").textContent = user.name;
  document.getElementById("userEmail").textContent = user.email;
  document.getElementById("userJoined").textContent = new Date(
    user.createdAt,
  ).toDateString();
  document.getElementById("userAvatar").textContent = user.name.charAt(0);
}
loadUser();

function logOut() {
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "../auth/login.html";
  });
}
logOut();
submit.onclick = async function () {
  if (
    title.value === "" ||
    price.value === "" ||
    category.value === "" ||
    count.value > 100
  ) {
    return;
  }

  let newpro = {
    title: title.value.trim().toLowerCase(),
    price: Number(price.value),
    category: category.value.trim().toLowerCase(),
  };

  if (taxes.value !== "") newpro.taxes = Number(taxes.value);
  if (ads.value !== "") newpro.ads = Number(ads.value);
  if (discount.value !== "") newpro.discount = Number(discount.value);
  if (count.value !== "") newpro.quantity = Number(count.value);

  const isUpdate = mode === "update";
  const res = await request(isUpdate ? `/products/${tmp}` : "/products", {
    method: isUpdate ? "PATCH" : "POST",
    body: JSON.stringify(newpro),
  });

  if (!res.ok) {
    const data = await res.json();
    alert(Array.isArray(data.message) ? data.message.join(", ") : data.message);
    return;
  }

  if (isUpdate) {
    mode = "create";
    submit.innerHTML = "create";
  }

  cleardata();
  await loadProducts();
};

//clear data when submit
function cleardata() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  count.value = "";
  category.value = "";
  total.style.background = "rgba(11, 13, 69, 0.703)";
}
//read
function showdata() {
  let table = "";
  for (let i = 0; i < datapro.length; i++) {
    table += `
    <tr>
     <td>${i + 1}</td>
     <td>${datapro[i].title}</td>
     <td>${datapro[i].price}</td>
     <td>${datapro[i].taxes}</td>
     <td>${datapro[i].ads}</td>
     <td>${datapro[i].discount}</td>
     <td>${datapro[i].total}</td>
     <td>${datapro[i].quantity}</td>
     <td>${datapro[i].category}</td>
     <td><button onclick="update('${datapro[i]._id}')" id="update">Update</button></td>
     <td><button onclick="deletedata('${datapro[i]._id}')" id="delete">delete</button></td>
    </tr>`;
  }
  document.getElementById("tbody").innerHTML = table;
  let deleteall = document.getElementById("deleteAll");
  if (datapro.length > 0) {
    deleteall.innerHTML = `<button onclick='deleteall()'>delete all (${datapro.length})</button></td>
    `;
  } else {
    deleteall.innerHTML = "";
  }
}

//delete
async function deletedata(id) {
  const res = await request(`/products/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json();
    alert(Array.isArray(data.message) ? data.message.join(", ") : data.message);
    return;
  }
  await loadProducts();
}

//delete all
function deleteall() {
  document.getElementById("confirmDeleteBox").style.display = "flex";
}

document.getElementById("cancelDeleteBtn").onclick = function () {
  document.getElementById("confirmDeleteBox").style.display = "none";
  document.getElementById("deletePasswordInput").value = "";
  document.getElementById("deleteError").textContent = "";
};

document.getElementById("confirmDeleteBtn").onclick = async function () {
  const password = document.getElementById("deletePasswordInput").value;
  if (!password) {
    document.getElementById("deleteError").textContent = "password required";
    return;
  }

  const res = await request(
    "/products",
    {
      method: "DELETE",
      body: JSON.stringify({ password }),
    },
    true,
  );

  if (!res.ok) {
    const data = await res.json();
    document.getElementById("deleteError").textContent = Array.isArray(
      data.message,
    )
      ? data.message.join(", ")
      : data.message;
    return;
  }

  document.getElementById("confirmDeleteBox").style.display = "none";
  document.getElementById("deletePasswordInput").value = "";
  document.getElementById("deleteError").textContent = "";
  await loadProducts();
};

//update
function update(id) {
  const product = datapro.find((p) => p._id === id);
  if (!product) return;

  title.value = product.title;
  price.value = product.price;
  taxes.value = product.taxes;
  ads.value = product.ads;
  discount.value = product.discount;
  count.value = product.quantity;
  category.value = product.category;
  getTotal();
  submit.innerHTML = "update";
  mode = "update";
  tmp = id;
  scroll({
    top: 0,
    behavior: "smooth",
  });
}

//search
let searchmode = "title"; //default

function getsearchmode(id) {
  if (id == "searchtitle") {
    searchmode = "title";
  } else {
    searchmode = "category";
  }
  search.placeholder = "search by " + searchmode;
  search.focus();
  search.value = "";
  showdata();
}

function searchinput(value) {
  let table = "";
  for (let i = 0; i < datapro.length; i++) {
    if (searchmode == "title") {
      if (datapro[i].title.includes(value.toLowerCase())) {
        table += `
    <tr>
     <td>${i + 1}</td>
     <td>${datapro[i].title}</td>
     <td>${datapro[i].price}</td>
     <td>${datapro[i].taxes}</td>
     <td>${datapro[i].ads}</td>
     <td>${datapro[i].discount}</td>
     <td>${datapro[i].total}</td>
     <td>${datapro[i].quantity}</td>
     <td>${datapro[i].category}</td>
     <td><button onclick="update('${datapro[i]._id}')" id="update">Update</button></td>
     <td><button onclick="deletedata('${datapro[i]._id}')" id="delete">delete</button></td>
    </tr>`;
      }
    } else {
      if (datapro[i].category.includes(value.toLowerCase())) {
        table += `
    <tr>
     <td>${i + 1}</td>
     <td>${datapro[i].title}</td>
     <td>${datapro[i].price}</td>
     <td>${datapro[i].taxes}</td>
     <td>${datapro[i].ads}</td>
     <td>${datapro[i].discount}</td>
     <td>${datapro[i].total}</td>
     <td>${datapro[i].quantity}</td>
     <td>${datapro[i].category}</td>
     <td><button onclick="update('${datapro[i]._id}')" id="update">Update</button></td>
     <td><button onclick="deletedata('${datapro[i]._id}')" id="delete">delete</button></td>
    </tr>`;
      }
    }
  }

  document.getElementById("tbody").innerHTML = table;
}