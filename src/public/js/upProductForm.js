document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("upProductsForm");

    if (!form) {
      console.error("El formulario no se encontró en el DOM.");
      return;
    }
  
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
  
      const pid = document.getElementById("pid").value;
      const productToUpdate = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        category: document.getElementById("category").value,
        price: parseFloat(document.getElementById("price").value),
        thumbnails: document.getElementById("thumbnails").value,
        code: document.getElementById("code").value,
        stock: parseInt(document.getElementById("stock").value),
        status: document.getElementById("status").value === "true", 
      };
  
      try {
        const response = await fetch(`http://localhost:8080/api/products/${pid}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productToUpdate),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const result = await response.json();
        console.log("Server response:", result);
  
        if (result.status === "success") {
          Swal.fire({
            icon: "success",
            title: "Producto actualizado",
            text: "El producto se ha actualizado con éxito",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: result.error || "Error desconocido",
          });
        }
      } catch (error) {
        console.error("Error al actualizar el producto:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Hubo un error al actualizar el producto: ${error.message}`,
        });
      }
    });
  });
  