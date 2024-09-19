async function addToCart( cartId, pid, quantity = 1 ) {
    const url = `http://localhost:8080/api/carts/${cartId}/products/${pid}`;
    console.log(`Adding to cart: ${cartId}, product: ${pid}, quantity: ${quantity}`); 

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Producto agregado al carrito:', data);
            alert('Producto agregado al carrito con éxito');
            //Redirigir a pagina principal
            const userChoice = window.confirm('Quieres ir al carrito o seguir comprando? Ok para el carrito cancelar para ver más productos')
            if(userChoice) {
                window.location.href = `/api/carts/${cartId}`
            } else {
                window.location.href = '/'
            }
        } else {
            throw new Error('Error al agregar el producto al carrito');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al agregar el producto al carrito');
    }
}

