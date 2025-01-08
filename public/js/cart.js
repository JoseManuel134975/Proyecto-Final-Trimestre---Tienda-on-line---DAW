import { getSession } from "./auth.js";
import { clearHTML, destroySessionStorage } from "../js/index.js";



/**
 * Renderiza el carrito y activa algunos listeners para su funcionamiento
 * @returns {DocumentFragment}
 */
const renderCart = () => {
    clearHTML()

    const cart = JSON.parse(getSession('cart'))
    const fragment = document.createDocumentFragment()

    if (cart && cart.length > 0) {
        cart.forEach((item, index) => {
            const article = document.createElement('article')
            article.className = 'cart__product'

            const table = document.createElement('table')
            const tbody = document.createElement('tbody')
            const tr = document.createElement('tr')

            const removeBtn = document.createElement('button')
            removeBtn.textContent = '-'
            removeBtn.id = 'remove'
            const addBtn = document.createElement('button')
            addBtn.textContent = '+'
            addBtn.id = 'add'

            const quantity = document.createElement('span')
            quantity.textContent = item.quantity
            quantity.id = 'quantity'

            const img = document.createElement('img')
            const name = document.createElement('h3')
            const price = document.createElement('h4')

            article.appendChild(table)
            table.appendChild(tbody)
            tbody.appendChild(tr)

            switch (true) {
                case "bundle" in item:
                    img.src = item.bundle.image;
                    name.textContent = item.bundle.name;
                    break;

                case "brItems" in item:
                    item.brItems.forEach((brItem) => {
                        if ("images" in brItem) {
                            img.src = brItem.images.featured || brItem.images.icon;
                            name.textContent = brItem.name;
                        }
                    });
                    break;

                case "tracks" in item:
                    item.tracks.forEach((track) => {
                        if ("albumArt" in track) {
                            img.src = track.albumArt;
                        }
                        name.textContent = track.title;
                    });
                    break;

                default:
                    item.instruments.forEach((instrument) => {
                        if ("images" in instrument) {
                            img.src = instrument.images.large;
                        }
                        name.textContent = instrument.name;
                    });
                    break;
            }

            price.textContent = item.regularPrice + ' V-Bucks'

            for (let i = 0; i < 4; i++) {
                const td = document.createElement('td')
                switch (i) {
                    case 0:
                        td.appendChild(img)
                        break;
                    case 1:
                        td.appendChild(name)
                        break;
                    case 2:
                        td.appendChild(price)
                        break;
                    default:
                        td.appendChild(removeBtn)
                        td.appendChild(quantity)
                        td.appendChild(addBtn)
                        break;
                }

                tr.appendChild(td)
            }

            fragment.appendChild(article)

            document.querySelector('.products').appendChild(fragment)

            removeBtn.addEventListener("click", () => {
                if (item.quantity > 1) {
                    item.quantity--
                    document.getElementById('quantity').innerHTML = item.quantity
                } else {
                    cart.splice(index, 1)
                }
                localStorage.setItem('cart', JSON.stringify(cart))
                renderCart()
            })

            addBtn.addEventListener("click", () => {
                item.quantity++
                document.getElementById('quantity').innerHTML = item.quantity
                localStorage.setItem('cart', JSON.stringify(cart))
                renderCart()
            })
        });
    }

    return fragment
}

const eventBtns = () => {
    document.querySelector('.buttons__button--clear').addEventListener("click", () => {
        const cart = JSON.parse(getSession('cart'))
        if (cart.length < 1) {
            alert('El carrito ya está vacío. ¡Empieza ha añadir productos!')
        }
        cart.length = 0
        localStorage.setItem('cart', JSON.stringify(cart))
        renderCart()
    })
}

const main = () => {
    renderCart()
    eventBtns()
}

document.getElementById('logout').addEventListener("click", destroySessionStorage)
document.addEventListener("DOMContentLoaded", main)