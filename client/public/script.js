console.log("The site is loaded!");

const url = 'http://127.0.0.1:3000/users';

const userHTML = user => `<div class="user"><span class="user-id">${user.id}</span> ${user.name}</div>`;
const usersHTML = users => `<div id="users">${users.map(user => userHTML(user)).join("")}</div>`;

const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error(error);
    }
};

const main = async _ => {
    const root = document.getElementById("root");
    const users = await fetchData(url);
    root.insertAdjacentHTML("beforeend", usersHTML(users));
};

window.addEventListener("load", main);