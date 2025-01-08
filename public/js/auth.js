import { getAPI, postAPI } from "../utils/api.js";

/**
 * Comprueba si el usuario que ha iniciado sesión existe en el JSON
 * Devuelve el propio objeto del usuario
 * @param {String} user 
 * @param {String} email 
 * @returns {Promise<Object | undefined>}
 */
const validateUser = async (user, email) => {
    try {
        const users = await getAPI('http://localhost:3000/users');
        const exist = users.find(item => item.username === user && item.email === email);

        if (exist) {
            localStorage.setItem('token', exist.username);
            localStorage.setItem('cart', JSON.stringify([]));
            location.href = './views/shop.html';
        } else {
            alert('El usuario no existe.');
        }
        return exist;
    } catch (error) {
        console.error('Error al validar usuario:', error);
    }
};

/**
 * Añade el usuario registrado al JSON de usuarios (como un INSERT en BD)
 * @param {String} user 
 * @param {String} email 
 * @returns {Promise<void>}
 */
const registerUser = async (user, email) => {
    if (user === '' || email === '') {
        alert('No puedes dejar campos en blanco.');
        return;
    }

    try {
        const users = await getAPI('http://localhost:3000/users');
        const exist = users.find(item => item.username === user && item.email === email);

        if (!exist) {
            const userObj = {
                id: users.length + 1,
                username: user,
                email: email,
            };

            const response = await postAPI("http://localhost:3000/users", userObj);
            console.log('Usuario registrado:', response);
            alert('Usuario registrado correctamente.');
        } else {
            alert('El usuario ya está registrado, inicia sesión.');
        }
    } catch (error) {
        console.error('Error al registrar usuario:', error);
    }
};

/**
 * Devuelve el objeto (string) guardado al iniciar sesión que se le pase por parámetro (key): username || carrito de la compra
 * @param {String} key
 * @returns {String | null}
 */
export const getSession = (key) => localStorage.getItem(key);

const eventListeners = () => {
    const login = document.getElementById('login');
    const register = document.getElementById('register');

    login.addEventListener("click", async (event) => {
        event.preventDefault();
        const user = document.getElementById('user').value;
        const email = document.getElementById('email').value;

        await validateUser(user, email);
    });

    register.addEventListener("click", async (event) => {
        event.preventDefault();
        const user = document.getElementById('user').value;
        const email = document.getElementById('email').value;

        await registerUser(user, email);
    });
};

const main = () => {
    const login = document.getElementById('login')
    const register = document.getElementById('register')

    eventListeners(login, register)
}

document.addEventListener("DOMContentLoaded", main)