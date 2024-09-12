document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('checkoutButton').addEventListener('click', async function () {
        const cartId = document.getElementById('cart-id').value;

        try {
            const response = await fetch(`/api/carts/${cartId}/purchase`, {
                method: 'POST',
            });

            if (response.ok) {
                window.location.href = '/checkout-confirmation';
            } else {
                console.error("Error al finalizar la compra.");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    });
});
