document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('clearCartButton').addEventListener('click', async function () {
        const cartId = document.getElementById('cartId').value;

        try {
            const response = await fetch(`/api/carts/${cartId}/clear`, {
                method: 'POST',
            });

            if (response.ok) {
                alert("Carrito vaciado correctamente");
                location.reload();
            } else {
                console.error("Error al vaciar el carrito.");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    });
});
