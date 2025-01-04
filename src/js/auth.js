import { getAPI } from "../../utils/getAPI.js";


const validateUser = (user, email, promise) => {
    let exist

    promise.then((arr) => {
        exist = arr.find((item) => item.username == user && item.email == email)

        if (exist != undefined) {
            localStorage.setItem('token', exist.username)
            location.href = '../src/views/shop.html'
        } else {
            alert('El usuario no existe.')
        }
    })

    return exist
}

export const getToken = () => localStorage.getItem('token')

const eventListeners = (login) => {
    login.addEventListener("click", (event) => {
        event.preventDefault()

        const user = document.getElementById('user').value
        const email = document.getElementById('email').value
        const json = getAPI('../data/db.json')

        validateUser(user, email, json)
        console.log(getToken());
    })
}

const main = () => {
    const login = document.getElementById('login')

    eventListeners(login)
}

document.addEventListener("DOMContentLoaded", main)