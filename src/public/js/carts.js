const socket = io();
const cartsContainer = document.querySelector('.productos');

socket.emit('carts');
console.log('Conexión con  carts');


socket.on('carts', carts => {
    cartsContainer.innerHTML = '';
    carts.forEach(cart => {
        const products = cart.products.map(product => `Product: ${product.product}, Quantity: ${product.quantity}`).join(', ');
        cartsContainer.innerHTML += `
        <tr class="table">
        <th scope="row" class="col mx-6 text-center table2">${cart.id}</th>
        <td class="mx-6 text-left title-product table2">${products}</td>
    </tr>
        `;
    });
});