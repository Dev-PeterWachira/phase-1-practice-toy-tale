// let addToy = false;

// document.addEventListener("DOMContentLoaded", () => {
//   const addBtn = document.querySelector("#new-toy-btn");
//   const toyFormContainer = document.querySelector(".container");
//   addBtn.addEventListener("click", () => {
//     // hide & seek with the form
//     addToy = !addToy;
//     if (addToy) {
//       toyFormContainer.style.display = "block";
//     } else {
//       toyFormContainer.style.display = "none";
//     }
//   });
// });


const toyCollection = document.getElementById("toy-header");
const toyForm = document.getElementById("toy-form");

document.addEventListener("DOMContentLoaded", () => {
    fetchToys();
});

function fetchToys() {
    fetch("http://localhost:3000/toys")
        .then(response => response.json())
        .then(toys => {
            toys.forEach(toy => {
                createToyCard(toy);
            });
        })
        .catch(error => console.error("Error fetching toys:", error));
}

function createToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <h2>${toy.name}</h2>
        <img src="${toy.image}" class="toy-avatar" />
        <p>${toy.likes} Likes</p>
        <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;
    toyCollection.appendChild(card);

    const likeButton = card.querySelector('.like-btn');
    likeButton.addEventListener('click', () => increaseLikes(toy.id, toy.likes));
}

toyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("toy-name").value;
    const image = document.getElementById("toy-image").value;

    const newToy = {
        name: name,
        image: image,
        likes: 0
    };

    fetch("http://localhost:3000/toys", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(newToy)
    })
        .then(response => response.json())
        .then(toy => {
            createToyCard(toy);
            toyForm.reset();
        })
        .catch(error => console.error("Error adding toy:", error));
});

function increaseLikes(toyId, currentLikes) {
    const newNumberOfLikes = currentLikes + 1;

    fetch(`http://localhost:3000/toys/${toyId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({ likes: newNumberOfLikes })
    })
        .then(response => response.json())
        .then(updatedToy => {
            const card = document.querySelector(`#toy-collection .card button[id="${toyId}"]`).parentElement;
            card.querySelector("p").innerText = `${updatedToy.likes} Likes`;
        })
        .catch(error => console.error("Error updating likes:", error));
}
