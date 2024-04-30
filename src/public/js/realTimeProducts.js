const socket = io();
const productList = document.getElementById("productsList");
const message = document.createElement("p");
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

socket.on("products", (products) => {
  productList.innerHTML = ``;
  products.forEach((product) => {
    const div = document.createElement("div")
    const p = document.createElement("p");
    const btnDel = document.createElement("button");

    btnDel.innerHTML = "Eliminar";
    btnDel.addEventListener("click", () => {
      socket.emit("delProduct", product.id);
    });
    p.innerHTML = ` 
    Title: ${product.title}<br> 
    Description: ${product.description}<br> 
    Code: ${product.code}<br> 
    Price: ${product.price}<br>
    Status: ${product.status}<br> 
    Stock: ${product.stock}<br>
    Category: ${product.category}
    `;

    div.appendChild(p)
    div.appendChild(btnDel)
    productList.appendChild(div);
  });
});

socket.on('resAdd', message => {
    message.innerHTML = `${message}`
    productList.appendChild(message)
})

socket.on('resDel', message => {
    message.innerHTML = `${message}`
    productList.appendChild(message)
})