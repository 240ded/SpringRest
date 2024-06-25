const userTableButton = document.getElementById('user_table_button');
const newUserButton = document.getElementById('new_user_button');
const adminTableDiv = document.getElementById('admin_table_div');
const userTableDiv = document.getElementById('add_new_user_div');
const rolesElement = document.getElementById('roles');
const rolesSelect = document.querySelector('#roles');
const urlForRefresh = 'api/users';

userTableButton.addEventListener('click', function() {
    userTableButton.className = 'nav-link active'
    newUserButton.className = 'nav-link';
    adminTableDiv.style.display = 'block';
    userTableDiv.style.display = 'none';
});

newUserButton.addEventListener('click', function() {
    userTableButton.className = 'nav-link';
    newUserButton.className = 'nav-link active';
    adminTableDiv.style.display = 'none';
    userTableDiv.style.display = 'block';
});

async function updateUsersTable(url) {
    try {
        const response = await fetch(urlForRefresh);
        if (!response.ok) {
            throw new Error(`Server returned ${response.status} ${response.statusText}`);
        }

        const listUsers = await response.json();
        const tableBody = document.getElementById('admintbody');
        let dataHtml = '';

        listUsers.forEach(user => {
            let roles = [];
            for (let role of user.roles) {
                if (role.name) {
                    roles.push(" " + role.name.toString().replaceAll("ROLE_", ""));
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
                        <button type="button" class="btn btn-primary" data-bs-toogle="modal" data-bs-target="#editModal" 
                        onclick="loadDataForEditModal(${user.id})">Edit</button>
                    </td>
                    <td>
                        <button class="btn btn-danger" data-bs-toogle="modal" data-bs-target="#deleteModal" 
                        onclick="deleteModalData(${user.id})">Delete</button>
                    </td>
                </tr>`;
        });
        tableBody.innerHTML = dataHtml;
    } catch (error) {
        console.error('Ошибка при обновлении таблицы пользователей:', error.message);
    }
    console.log('Успешное обновление')
}

function saveUser(user) {
    const xhr = new XMLHttpRequest();
    const url = '/api/users'; // Укажите свой URL для сохранения пользователя

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            console.log('User saved successfully!');
            // updateUsersTable(urlForRefresh);
        }
    };

    var userJson = JSON.stringify(user);
    xhr.send(userJson);
}

async function getRoles() {
    try {
        const response = await fetch('/api/roles');
        if (!response.ok) {
            throw new Error(`Server returned ${response.status} ${response.statusText}`);
        }

        const roles = await response.json();

        rolesElement.innerHTML = '';

        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id;
            option.text = role.name.toString().replaceAll("ROLE_", "");
            rolesElement.appendChild(option);
        });
    } catch (error) {
        console.error('Произошла ошибка при получении ролей:', error.message);
    }
}

document.getElementById('closeCreateButton').addEventListener('click', function() {
    let listOfRoles = [];
    for (let i = 0; i < rolesSelect.selectedOptions.length; i++) {
        listOfRoles.push({
            id: rolesSelect.selectedOptions[i].value
        });
    }

    const newUser = {
        firstName: userTableDiv.querySelector('[name="firstName"]').value,
        lastName: userTableDiv.querySelector('[name="lastName"]').value,
        age: userTableDiv.querySelector('[name="age"]').value,
        username: userTableDiv.querySelector('[name="username"]').value,
        password: userTableDiv.querySelector('[name="password"]').value,
        roles: listOfRoles
    };

    saveUser(newUser);

    updateUsersTable(urlForRefresh);

    userTableButton.className = 'nav-link active'
    newUserButton.className = 'nav-link';
    adminTableDiv.style.display = 'block';
    userTableDiv.style.display = 'none';
});

getRoles();


