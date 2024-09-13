document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('checkoutButton').addEventListener('click', async function () {
        const cartId = document.getElementById('cart-id').value;

        try {
            const response = await fetch(`/api/carts/${cartId}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (result.success) {
                alert('Compra finalizada con éxito. Ticket generado.');
                window.location.reload();
            } else {
                alert('Error al finalizar la compra: ' + result.message);
            }
        } catch (error) {
            alert('Error en la compra: ' + error.message);
        }
    });
});
