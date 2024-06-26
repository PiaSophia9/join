const STORAGE_TOKEN = "GTAZ0ATDKSDLRLK4EUABFP3GKTDE3BGQA495KQ4A";
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";

/**
 * Sets an item in the storage with the given key and value.
 *
 * @param {string} key - The key of the item to be set.
 * @param {any} value - The value of the item to be set.
 * @return {Promise<any>} A promise that resolves to the response from the server.
 */
async function setItem(key, value) {
  const payload = {key, value, token: STORAGE_TOKEN};
  return fetch(STORAGE_URL, {method: "POST", body: JSON.stringify(payload)}).then((res) => res.json());
}

/**
 * Retrieves an item from the storage with the given key.
 *
 * @param {string} key - The key of the item to retrieve.
 * @return {Promise<any>} A promise that resolves to the value of the item, or throws an error if the item is not found.
 */
async function getItem(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (res.data) {
        return res.data.value;
      }
      throw `Could not find data with key "${key}".`;
    });
}
