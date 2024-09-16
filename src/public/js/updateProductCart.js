document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('form[id^="updateForm-"]').forEach(form => {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            const formData = new FormData(this);
            const quantity = formData.get('quantity');
            const productId = this.id.split('-')[1]; 
            const cartId = document.getElementById('cartId').value;

            try {
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ quantity: parseInt(quantity) }),
                });

                if (response.ok) {
                    alert("Producto actualizado correctamente");
                    location.reload(); 
                } else {
                    console.error("Error al actualizar el producto.");
                }
            } catch (error) {
                console.error("Error en la solicitud:", error);
            }
        });
    });
});
