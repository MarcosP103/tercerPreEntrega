document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('form[id^="deleteForm-"]').forEach(form => {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            const productId = this.querySelector('input[name="productId"]').value;
            const cartId = document.getElementById('cartId').value;

            try {
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert("Producto eliminado correctamente");
                    location.reload();
                } else {
                    console.error("Error al eliminar el producto.");
                }
            } catch (error) {
                console.error("Error en la solicitud:", error);
            }
        });
    });
});
