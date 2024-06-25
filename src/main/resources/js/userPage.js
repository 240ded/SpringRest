const userurl = 'api/userAuth';

fetch(userurl)
    .then(res => res.json())
    .then(user => {
        console.log('Полученные данные пользователя:', user);
        if (user && user.username && user.roles && Array.isArray(user.roles)) {
            let roles = '';
            user.roles.forEach(role => {
                roles += ' ';
                roles += role.name.toString().replaceAll("ROLE_", "");
            });
            document.getElementById('navbar-username').textContent = user.username;
            document.getElementById('navbar-roles').textContent = roles;
        } else {
            console.error('Некорректные данные пользователя или роли не найдены.');
        }
    })
    .catch(error => console.error('Ошибка загрузки данных:', error));

const tableBody = document.getElementById('usertbody');
let dataHtml = '';
let roles = [];
fetch(userurl)
    .then(res => res.json())
    .then(user => {
        for (let role of user.roles) {
            if (role.name) {
                roles.push(" " + role.name.toString()
                    .replaceAll("ROLE_", ""));
            }
        }
        dataHtml +=
            `<tr>
                <td>${user.id}</td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.age}</td>
                <td>${user.username}</td>
                <td>${roles}</td>
            </tr>`
        tableBody.innerHTML = dataHtml;
    })
