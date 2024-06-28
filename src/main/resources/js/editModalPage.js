const role_ed = document.getElementById('edit-role');
const form_ed = document.getElementById('formForEditing');
const id_ed = document.getElementById('edit-id');
const name_ed = document.getElementById('edit-first_name');
const lastName_ed = document.getElementById('edit-last_name')
const age_ed = document.getElementById('edit-age')
const email_ed = document.getElementById('edit-email');
const editModal = document.getElementById("editModal");
const closeEditButton = document.getElementById("editClose")
const bsEditModal = new bootstrap.Modal(editModal);

async function loadDataForEditModal(id) {
    const  urlDataEd = 'api/users/' + id;
    let usersPageEd = await fetch(urlDataEd);
    if (usersPageEd.ok) {

        await usersPageEd.json().then(user => {
            console.log('userData', JSON.stringify(user))
            id_ed.value = `${user.id}`;
            name_ed.value = `${user.firstName}`;
            lastName_ed.value = `${user.lastName}`;
            age_ed.value = `${user.age}`;
            email_ed.value = `${user.username}`;

            const roleIds = user.roles.map(role => Number(role.id));
            for (const option of role_ed.options) {
                if (roleIds.includes(Number(option.value))) {
                    option.setAttribute('selected', 'selected');
                } else {
                    option.removeAttribute('selected');
                }
            }
        })
        console.log("id_ed: " + id_ed.value + " !!")
        bsEditModal.show();
    } else {
        alert(`Error, ${usersPageEd.status}`)
    }
}
async function editUser() {
    let urlEdit = 'api/users/' + id_ed.value;
    let listOfRole = [];
    console.dir(form_ed)
    for (let i=0; i<form_ed.roles.options.length; i++) {
        if (form_ed.roles.options[i].selected) {
            let tmp={};
            tmp["id"]=form_ed.roles.options[i].value
            listOfRole.push(tmp);
        }
    }
    let method = {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            firstName: form_ed.username.value,
            lastName: form_ed.lastName.value,
            age:form_ed.age.value,
            username: form_ed.email.value,
            password: form_ed.password.value,
            roles: listOfRole
        })
    }
    console.log(urlEdit,method)
    await fetch(urlEdit,method).then(() => {
        closeEditButton.click();
        getAdminPage();
    })
}