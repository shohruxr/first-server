const userUl = document.getElementById("usersUl");
const getUsers = document.getElementById("getUsers");
const ismInput = document.getElementById("ism");
const yoshInput = document.getElementById("yosh");
const shaharInput = document.getElementById("shahar");
const addUser = document.getElementById("addUser");

let editUserId = null;

const fetchUsers = () => {
  fetch("http://localhost:1234/users")
    .then((javob) => javob.json())
    .then((data) => {
      if (!Array.isArray(data)) {
        console.log("xatolik yuz berdi ", data);
        return;
      }
      userUl.innerHTML = "";
      data.forEach((user) => {
        const li = document.createElement("li");
        li.textContent = `ismim ${user.ism}, yoshim ${user.yosh}, ${user.shahar}da yashayman`;
        userUl.appendChild(li);

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        li.appendChild(editButton);
        editButton.addEventListener("click", () => {
          ismInput.value = user.ism;
          yoshInput.value = user.yosh;
          shaharInput.value = user.shahar;
          editUserId = user.id;
          addUser.textContent = "Update";
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "X";
        li.appendChild(deleteButton);
        deleteButton.addEventListener("click", () => {
          if (confirm("Dangal ochirasizmi?")) {
            fetch(`http://localhost:1234/users/${user.id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((javob) => javob.json())
              .then((data) => {
                if(data.status === 'success'){
                    fetchUsers()
                    alert('ochirvardiz foydalanuvchini')
                } else{
                    alert('nimadir yemay qoldi ochirishda')
                }
              });
          }
        });
      });
    })
    .catch((err) => {
      console.log("error topildi ", err);
    });
};

getUsers.addEventListener("click", fetchUsers);

addUser.addEventListener("click", () => {
  const userArray = {
    ism: ismInput.value,
    yosh: yoshInput.value,
    shahar: shaharInput.value,
  };

  if (editUserId) {
    fetch(`http://localhost:1234/users/${editUserId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userArray),
    })
      .then((javob) => javob.json())
      .then((data) => {
        if (data.status === "success") {
          fetchUsers();
          ismInput.value = "";
          yoshInput.value = "";
          shaharInput.value = "";
          editUserId = null;
          addUser.textContent = "Add User";

          alert("editing has been completed");
        } else {
          alert("error occured while editing");
        }
      })
      .catch((err) => {
        console.log("ozgartirishda xatolik yuz berdi ", err);
      });
  } else {
    fetch("http://localhost:1234/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userArray),
    })
      .then((javob) => javob.json())
      .then((data) => {
        if (data.status === "success") {
          fetchUsers();
          ismInput.value = "";
          yoshInput.value = "";
          shaharInput.value = "";

          alert("user is added");
        } else {
          alert("error occured");
        }
      })
      .catch((err) => {
        console.log("xatolik yuz berdi ", err);
      });
  }
});
