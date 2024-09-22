document.addEventListener("DOMContentLoaded", function () {
    const checkoutButton = document.getElementById('checkoutButton');
    if (!checkoutButton) {
        console.error('Elemento "checkoutButton" no encontrado');
        return;
    }

    checkoutButton.addEventListener('click', async function () {
        const cartId = document.getElementById('cartId')?.value;
        if (!cartId) {
            console.error('CartId no encontrado');
            alert('Error: No se pudo obtener el ID del carrito');
            return;
        }

        console.log("Cart ID:", cartId);

        const productElements = document.querySelectorAll('#cart-products li');
        if (productElements.length === 0) {
            console.error('No se encontraron productos en el carrito');
            alert('Error: El carrito está vacío');
            return;
        }
        
        const products = Array.from(productElements).map(item => ({
            product: item.getAttribute('data-product-id'),
            title: item.getAttribute('data-product-title'),
            price: parseFloat(item.getAttribute('data-product-price')),
            quantity: parseInt(item.getAttribute('data-product-quantity'))
        }));

        try {
            const response = await fetch(`/api/carts/${cartId}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ products }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error del servidor: ${response.status}`);
            }

            const result = await response.json();
            alert('Compra finalizada con éxito. Ticket generado.');

            // Vaciar el carrito después de la compra
            const clearResponse = await fetch(`/api/carts/${cartId}/clear`, {
                method: 'DELETE',
            });

            if (!clearResponse.ok) {
                throw new Error('Error al vaciar el carrito');
            }

            window.location.reload();

        } catch (error) {
            console.error('Error en la compra:', error);
            alert('Error en la compra: ' + error.message);
        }
    });
});
