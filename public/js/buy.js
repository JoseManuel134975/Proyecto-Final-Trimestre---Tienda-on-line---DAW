const btn = document.getElementById('button');

/**
 * Aplica el listener al botón de confirmación
 * Y envia el correo
 */
document.getElementById('form')
    .addEventListener('submit', function (event) {
        event.preventDefault();

        btn.value = 'Confirmando...';

        const serviceID = 'default_service';
        const templateID = 'template_99ztf6k';
        // Parámetros del formulario
        const templateParams = {
            to_email: document.getElementById('to_email').value,
            to_name: document.getElementById('to_name').value
        }

        // Envio
        emailjs.send(serviceID, templateID, templateParams)
            .then(() => {
                btn.value = 'Confirmar pedido';
                alert('¡Confirmado! Comprueba tu correo electrónico...');
                // Vacío el carrito por completo (borro)
                localStorage.removeItem('cart')
                // Cambio de ventana
                location.href = '../views/cart.html'
                // Vuelvo a crear el carrito pero vacío
                localStorage.setItem('cart', JSON.stringify([]));
            }, (err) => {
                btn.value = 'Confirmar pedido';
                alert(JSON.stringify(err));
            });
    });