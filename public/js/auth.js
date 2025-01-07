import { getAPI, postAPI } from "../utils/api.js";


/**
 * Comprueba si el usuario que ha iniciado sesión existe en el JSON
 * Devuelve el propio objeto del usuario
 * @param {String} user 
 * @param {String} email 
 * @param {Promise} promise 
 * @returns {Object}
 */
const validateUser = (user, email, promise) => {
    let exist

    promise.then((arr) => {
        exist = arr.find((item) => item.username == user && item.email == email)

        if (exist != undefined) {
            localStorage.setItem('token', exist.username)
            localStorage.setItem('cart', JSON.stringify([]) )
            location.href = './views/shop.html'
        } else {
            alert('El usuario no existe.')
        }
    })

    return exist
}

/**
 * Añade el usuario registrado al JSON de usuarios (como un INSERT en BD)
 * @param {String} user 
 * @param {String} email 
 * @param {Array} arr 
 * @return {void}
 */
const registerUser = (user, email, arr) => {
    const length = arr.length
    let userObj = {
        id: length + 1,
        username: user,
        email: email,
    };
    
    if(user != '' && email != '') {
        postAPI("http://localhost:3000/users", userObj).then((datos) => {
            console.log(datos)
        });        
        alert('Usuario registrado correctamente.')
    } else {
        alert('No puedes dejar campos en blanco.')
    }
}

/**
 * Devuelve el objeto (string) guardado al iniciar sesión que se le pase por parámetro (key): username || carrito de la compra
 * @param {String} key
 * @returns {String}
 */
export const getSession = (key) => localStorage.getItem(key)

const eventListeners = (login, register) => {

    login.addEventListener("click", (event) => {
        const user = document.getElementById('user').value
        const email = document.getElementById('email').value
        const json = getAPI('http://localhost:3000/users')

        event.preventDefault()

        validateUser(user, email, json)
    })

    register.addEventListener("click", async (event) => {
        const user = document.getElementById('user').value
        const email = document.getElementById('email').value
        const json = await getAPI('http://localhost:3000/users')

        event.preventDefault()

        registerUser(user, email, json)
    })
}

const main = () => {
    const login = document.getElementById('login')
    const register = document.getElementById('register')

    eventListeners(login, register)
}

document.addEventListener("DOMContentLoaded", main)