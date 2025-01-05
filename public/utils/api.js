/**
 *
 * @param {string} url get de captura de datos
 * @returns
 */



export function getAPI(url) {
    return fetch(url).then((result) => result.json());
}

/**
 *
 * @param {String} url para realización de petición post
 * @param {Object} producto
 * @returns
 */
export function postAPI(url, producto) {
    return fetch(url, {
        method: "POST",
        body: JSON.stringify(producto),
    }).then((res) => res.json());
}