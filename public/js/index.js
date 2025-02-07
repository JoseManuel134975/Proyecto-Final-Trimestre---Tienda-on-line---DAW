import { getAPI } from "../utils/api.js";
import { getSession } from "./auth.js";



// Para no usar variables globales*
const state = {
    loading: false,
    limit: 8,
    currentPage: 1,
    contId: 0
}

/**
 * Limpia la sesión al pulsar el enlace del menú 'salir'
 */
export const destroySessionStorage = () => {
    sessionStorage.clear()
}

/**
 * Función que pasa a la siguiente página
 * @return {void}
 */
function nextPage() {
    // Incrementar "currentPage"
    state.currentPage = state.currentPage + 1;
    // Redibujar
    renderData(getNextData());
}

/**
 * Función que retrocedea la página anterior
 * @return {void}
 */
function previousPage() {
    // Disminuye "currentPage"
    state.currentPage = state.currentPage - 1;
    // Redibujar
    renderData(getNextData());
}

/**
 * Crea el select para filtrar por categorías
 * @returns {void}
 */
const createDropdown = () => {
    const data = getAPI('https://fortnite-api.com/v2/shop')
    const select = document.createElement('select')
    select.className = 'categories'
    const categories = []
    let cont = 0

    data.then((json) => {
        json.data.entries.forEach((item) => {
            // const option = document.createElement('option')
            if(!categories.includes(item.layout.category) && item.layout.category !== undefined){
                categories.push(item.layout.category)
                const option = document.createElement('option')
                option.textContent = categories[cont]
                select.appendChild(option)
                cont++
            }
        })
    })

    document.getElementById('submitFilter').insertAdjacentElement('beforebegin', select)
}

/**
 * Filtra los productos según lo que escriba el usuario en el input
 * @param {Promise} promise 
 * @param {String} value 
 * @returns {Promise}
 */
const filterByCategory = (promise, value) => {
    value = value.toLowerCase().replace(/\s+/g, '')
    const filter = promise.then((arr) => {
        return arr.filter((item) => "layout" in item && "category" in item.layout && item.layout.category.toLowerCase().replace(/\s+/g, '') === value)
    })
    return filter
}

/**
 * Aplica eventListeners a los botones de filtro
 */
const eventFilters = () => {
    document.getElementById('submitFilter').addEventListener("click", (event) => {
        event.preventDefault()

        const categoryValue = document.querySelector('.categories').options[document.querySelector('.categories').selectedIndex].value
        console.log(categoryValue);
        const sliceShop = getNextData()
        const newArr = filterByCategory(sliceShop, categoryValue)
        state.contId -= state.limit
        renderData(newArr)
    })

    document.getElementById('submitSort').addEventListener("click", (event) => {
        event.preventDefault()

        const selectedValue = document.getElementById('order').options[document.getElementById('order').selectedIndex].value
        console.log(selectedValue);
        const sliceShop = getNextData()
        const newArr = sortBy(sliceShop, selectedValue)
        state.contId -= state.limit
        renderData(newArr)
    })
}

/**
 * Ordena los productos según el valor seleccionado del select
 * @param {Promise} promise 
 * @param {String} value 
 * @returns {Array}
 */
const sortBy = (promise, value) => {
    value = value.toLowerCase().replace(/\s+/g, '')
    let sort = []

    if (value === 'ascendente') {
        sort = promise.then((arr) => {
            return arr.sort((a, b) => a.regularPrice - b.regularPrice)
        })
        return sort
    } else {
        sort = promise.then((arr) => {
            return arr.sort((a, b) => b.regularPrice - a.regularPrice)
        })
        return sort
    }
}

/**
 * Función que devuelve los datos de la página deseada
 * @return {Array<JSON>}
 */
function getNextData() {
    const startIndex = (state.currentPage - 1) * state.limit;
    const endIndex = startIndex + state.limit;
    const data = getAPI('https://fortnite-api.com/v2/shop')
    return data.then((json) => {
        return json.data.entries.slice(startIndex, endIndex);
    })
}

/**
 * Función que devuelve el número total de páginas disponibles
 * @return {Int}
 */
const getAllPages = () => getAPI('https://fortnite-api.com/v2/shop').then((data) => Math.ceil(data.data.entries.length / state.limit));

/**
 * Función que gestiona los botones del paginador habilitando o
 * desactivando dependiendo de si nos encontramos en la primera
 * página o en la última.
 * @return {void}
*/
function manageBtns() {
    // Comprobar que no se pueda retroceder
    if (state.currentPage === 1) {
        document.getElementById('previous').setAttribute("disabled", true);
    } else {
        document.getElementById('previous').removeAttribute("disabled");
    }
    // Comprobar que no se pueda avanzar
    const data = getAllPages()
    data.then((result) => {
        if (state.currentPage === result) {
            document.getElementById('next').setAttribute("disabled", true);
        } else {
            document.getElementById('next').removeAttribute("disabled");
        }

        document.getElementById('pageOfPages').innerHTML = `${state.currentPage}/${result}`
    })
}

/**
 * Limpia el HTML cada vez que se cambia de página
 * @return void
 */
export const clearHTML = () => {
    document.querySelector('.products').innerHTML = ''
}

/**
 * Muestra los productos y devuelve el fragmento 
 * Aplica eventListeners para comprobar si el producto ya está agregado al carrito
 * Y aplica un setTimeOut para simular el efecto de carga (tuve problemas con el asincronismo...)
 * @param {Promise} promise 
 * @return {DocumentFragment}
 */
const renderData = (promise) => {
    clearHTML()

    state.loading = true
    const fragment = document.createDocumentFragment()
    const cart = JSON.parse(getSession('cart'))

    manageBtns()

    promise.then((json) => {
        json.forEach((item) => {
            Object.assign(item, { id: state.contId })

            const product = document.createElement('article')
            product.className = 'products__product'
            product.style.backgroundColor = 'transparent'
            product.style.boxShadow = 'none'

            const button = document.createElement('button')
            const img = document.createElement('img')
            const name = document.createElement('h3')
            const price = document.createElement('h4')
            const id = document.createElement('p')

            button.textContent = 'Añadir al carrito'
            button.className = 'addToCart'

            img.style.opacity = 0;
            name.style.opacity = 0;
            price.style.opacity = 0;
            id.style.opacity = 0;
            button.style.opacity = 0;

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
            id.textContent = state.contId

            product.appendChild(img)
            product.appendChild(name)
            product.appendChild(price)
            product.appendChild(id)
            product.appendChild(button)

            fragment.appendChild(product)

            if (state.loading) {
                const gif = document.createElement('img')
                gif.src = '../images/load-32_256.gif'
                gif.id = 'load'

                product.appendChild(gif)

                setTimeout(function () {
                    gif.remove()
                    product.style.backgroundColor = 'lightgray'
                    product.style.boxShadow = '0 0 15px white'
                    img.style.opacity = 1;
                    name.style.opacity = 1;
                    price.style.opacity = 1;
                    id.style.opacity = 1;
                    button.style.opacity = 1;
                }, 1000)
            }

            document.querySelector('.products').appendChild(fragment)

            img.addEventListener("click", () => {
                showInfo(item)
            })

            button.addEventListener("click", () => {
                const existingProduct = cart.find(product => product.id === item.id);
                if (existingProduct) {
                    existingProduct.quantity++;
                    alert('Ya tienes el producto agregado, se sumará a la cantidad.');
                } else {
                    Object.assign(item, { quantity: 1 });
                    cart.push(item);
                    alert('¡Producto agregado a tu carrito!');
                }
                localStorage.setItem('cart', JSON.stringify(cart));
            })

            state.contId++
        })

        state.loading = false
    })

    return fragment
}

/**
 * Muestra la información de la API al clicar sobre el producto
 * @return {void}
 */
const showInfo = (obj) => {
    if ("brItems" in obj) {
        alert(`Category: ${obj.layout.category} \nFinal price: ${obj.finalPrice} V-Bucks \nDescription: ${obj.brItems[0].description} \nRarity: ${obj.brItems[0].rarity.value} \nAdded: ${obj.brItems[0].added} \nType: ${obj.brItems[0].type.value} \nIntroduction: ${obj.brItems[0].introduction.text}`)
    } else {
        alert(`Category: ${obj.layout.category} \nFinal price: ${obj.finalPrice} V-Bucks`)
    }
}

/**
 * Aplica eventListeners a los botones de paginación
 */
const eventPagination = () => {
    document.getElementById('next').addEventListener("click", nextPage)
    document.getElementById('previous').addEventListener("click", previousPage)
}

const readData = () => {
    document.getElementById('logout').addEventListener("click", destroySessionStorage)
    renderData(getNextData())
}

const main = () => {
    readData()
    eventPagination()
    createDropdown()
    eventFilters()
}

document.addEventListener("DOMContentLoaded", main)