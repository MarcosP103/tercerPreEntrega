async function addToCart(cid, pid, quantity = 1) {
    const url = `http://localhost:8080/api/carts/${cid}/products/${pid}`;
    console.log(`Adding to cart: ${cid}, product: ${pid}, quantity: ${quantity}`); 

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
        } else {
            throw new Error('Error al agregar el producto al carrito');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al agregar el producto al carrito');
    }
}

