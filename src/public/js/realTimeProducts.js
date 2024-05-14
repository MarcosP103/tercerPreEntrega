const socket = io();
const productList = document.getElementById("productList");
const messageDiv = document.createElement("div");
const btnSend = document.getElementById("btnSend");

btnSend.addEventListener("click", () => {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const code = document.getElementById("code").value;
  const price = document.getElementById("price").value;
  const status = document.getElementById("status").value;
  const stock = document.getElementById("stock").value;
  const category = document.getElementById("category").value;
  const thumbnails = document.getElementById("thumbnails").value;
  socket.emit("newProduct", {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  });
});

socket.on("products", products => {
  productList.innerHTML = ``;
  products.forEach((product) => {
    const div = document.createElement("div");
    const p = document.createElement("p");
    const btnDel = document.createElement("button");

    btnDel.innerHTML = "Eliminar";
    btnDel.addEventListener("click", () => {
      socket.emit("delProduct", product.id);
    });
    p.innerHTML = ` 
    <strong>Title: </strong>${product.title}<br> 
    <strong>Description: </strong>${product.description}<br> 
    <strong></strong>Code: </strong>${product.code}<br> 
    <strong>Price: </strong>${product.price}<br>
    <strong>Status: </strong>${product.status}<br> 
    <strong>Stock: </strong>${product.stock}<br>
    <strong>Category: </strong>${product.category}
    `;

    div.appendChild(p);
    div.appendChild(btnDel);
    productList.appendChild(div);
  });
});

socket.on("resAdd", (message) => {
  const p = document.createElement("p");
  p.textContent = message;
  messageDiv.appendChild(p);
  productList.appendChild(messageDiv);
});

socket.on("resDel", (message) => {
  const p = document.createElement("p");
  p.textContent = message;
  messageDiv.appendChild(p);
  productList.appendChild(messageDiv);
});
