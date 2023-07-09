export const base_url = "http://localhost:3013/api/";

const getTokenLocalStorage = localStorage.getItem("customer")
    ? JSON.parse(localStorage.getItem("customer")) : null;

export const config = {
    headers: {
        Authorization: `Bearer ${
            getTokenLocalStorage!==null?getTokenLocalStorage.token:""
            }`,
        Accept:"application/json "
    }
}