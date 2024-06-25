const adminurl = 'api/users';

const userurl = 'api/userAuth';

const buttonAdmin = document.getElementById('button_admin_view');
const buttonUser = document.getElementById('button_user_view');

const adminPage = document.getElementById('admin_page_div');
const userPage = document.getElementById('user_page_div');

buttonAdmin.addEventListener('click', function() {
    buttonAdmin.className = 'btn btn-primary active'
    buttonUser.className = 'btn btn-nonactive';
    adminPage.style.display = 'block';
    userPage.style.display = 'none';
});

buttonUser.addEventListener('click', function() {
    buttonAdmin.className = 'btn btn-nonactive';
    buttonUser.className = 'btn btn-primary active';
    adminPage.style.display = 'none';
    userPage.style.display = 'block';
});

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

async function getAdminPage() {
    let page = await fetch(adminurl);
    if(page.ok) {
        let listAllUser = await page.json();
        loadTableData(listAllUser);
    } else {
        alert(`Error, ${page.status}`)
    }
}

function loadTableData(listAllUser) {
    const tableBody = document.getElementById('admintbody');
    let dataHtml = '';
    for (let user of listAllUser) {
        let roles = [];
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
                <td>
                    <button type="button" class="btn btn-primary" data-bs-toogle="modal"
                    data-bs-target="#editModal" 
                    onclick="loadDataForEditModal(${user.id})">Edit</button>
                </td>
                <td>
                    <button class="btn btn-danger" data-bs-toogle="modal"
                    data-bs-target="#deleteModal" 
                    onclick="deleteModalData(${user.id})">Delete</button>
                </td>
            </tr>`
    }
    tableBody.innerHTML = dataHtml;
}
getAdminPage();