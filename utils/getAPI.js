/**
 *
 * @param {string} url get de captura de datos
 * @returns
 */



export function getAPI(url) {
    return fetch(url).then((result) => result.json());
}