console.log("The site is loaded!");

const url = 'http://127.0.0.1:3000/users';

const userHTML = user => `<div class="user"><span class="user-id">${user.id}</span> ${user.name}</div>`;
const usersHTML = users => `<div id="users">${users.map(user => userHTML(user)).join("")}</div>`;
const inputHTML = name => `<input placeholder="Write the name here" value="${name}">`;
const buttonHTML = (text, method) => `<button type="submit" data-method="${method}">${text}</button>`;
const formHTML = (user, add) => `
  <form id="form" data-id="${user.id}">
    ${inputHTML(user.name)}
    ${add ? buttonHTML("Add", "POST") : buttonHTML("Save", "PATCH") + buttonHTML("Replace", "PUT") + buttonHTML("Remove", "DELETE")}
  </form>
`;

const fetchData = async (url, id, method = "GET", body = { name: "" }) => {
    if (id && parseInt(id) === 0 && body.name === "") {
        console.log("Empty name is not valid when creating a new user");
        return;
    }
    try {
        const response = await fetch(id !== undefined ? `${url}/${id}` : url, method === "GET" ? { method } : { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        return await response.json();

    } catch (error) {
        console.error(error);
    }
}

const handleClick = async ({ target }) => {
    const userTarget = target.classList.contains('user') ? target : target.closest('.user');

    if (userTarget) {
        const userId = userTarget.querySelector('.user-id').textContent;
        const response = await fetch(`${url}/${userId}`);
        const data = await response.json();
        const userData = await fetchData(url, userId);

        const inputElement = document.querySelector('input');
        inputElement.value = data.name;

        document.getElementById('form').dataset.id = userId;
        document.getElementById("form").outerHTML = formHTML(userData, false);
    }
}

const handleInput = ({ target }) => {
    target.setAttribute("value", target.value);
}

const handleSubmit = async e => {
    e.preventDefault();

    const method = e.submitter.getAttribute("data-method");
    const id = parseInt(e.target.getAttribute("data-id"));

    const result = await fetchData(
        url,
        id,
        method,
        method === "PATCH" ?
            { name: e.target.querySelector("input").value } :
            method === "PUT" ?
                { name: e.target.querySelector("input").value, id } :
                method === "DELETE" ?
                    { id } :
                    method === "POST" ?
                        { name: e.target.querySelector("input").value, id: 0 } :
                        { name: "" }
    );

    if (result.state === "DONE") {
        const users = await fetchData(url);
        document.getElementById("users").outerHTML = usersHTML(users);
    }
}

const main = async _ => {
    const root = document.getElementById("root");
    const users = await fetchData(url);
    root.insertAdjacentHTML("beforeend", usersHTML(users));
    root.insertAdjacentHTML("beforeend", formHTML({ id: 0, name: "" }, true));
    window.addEventListener('click', event => handleClick(event));
    window.addEventListener("input", handleInput);
    window.addEventListener("submit", handleSubmit);
}

window.addEventListener("load", main);