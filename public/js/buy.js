import { getSession } from "./auth.js";



const btn = document.getElementById('button');

document.getElementById('form')
    .addEventListener('submit', function (event) {
        event.preventDefault();

        btn.value = 'Confirmando...';

        const serviceID = 'default_service';
        const templateID = 'template_99ztf6k';

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                btn.value = 'Confirmar pedido';
                alert('¡Confirmado! Comprueba tu correo electrónico...');
                localStorage.removeItem('cart')
                location.href = '../views/cart.html'
                localStorage.setItem('cart', JSON.stringify([]));
                console.log(getSession('cart'));
            }, (err) => {
                btn.value = 'Confirmar pedido';
                alert(JSON.stringify(err));
            });
    });