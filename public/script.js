document.addEventListener("DOMContentLoaded", () => {
  const dataList = document.getElementById("data-list");
  const dataForm = document.getElementById("data-form");
  const dataInput = document.getElementById("data-input");
  const dataDesc = document.getElementById("data-description");
  const addNote = document.getElementById("addNote");

  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
      const response = await fetch("/data");
      const data = await response.json();
      dataList.innerHTML = ""; // Clear the list before rendering
      data.forEach((item) => {
        const div = document.createElement("div");
        div.innerHTML = `
                  <h2>${item.text}</h2>
                  <p>${item.description.replace(
                    /\n/g,
                    "<br>"
                  )}</p> 
                  
                  <!-- Converts newlines to <br> -->
                  <div class="buttons">
                      <button class="edit-btn" onclick="showEditForm(${
                        item.id
                      }, '${item.text}', \`${
          item.description
        }\`)"><i class="fa-solid fa-pen-to-square">Edit</i></button>
                      <button class="delete-btn" onclick="deleteNote(${
                        item.id
                      })"><i class="fa-solid fa-trash">Delete</i></button>
                  </div>
              `;
        dataList.appendChild(div);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

// Function onclick edit form 
  function showEditForm(id, currentTitle, currentDescription) {
  const existingForm = document.querySelector(".edit-form");
  if (existingForm) existingForm.remove();

  document
    .querySelectorAll("button")
    .forEach((button) => (button.disabled = true));

  const editForm = document.createElement("div");
  editForm.classList.add("edit-form");
  editForm.innerHTML = `
      <div class="edit-card">
          <h3>Edit Note</h3>
          <input type="text" id="data-input" value="${currentTitle}" />
          <textarea id="data-description">${currentDescription}</textarea>
          <div class="buttons">
              <button class="update-btn" onclick="updateNote(${id})"><i">Update</i></button>
          </div>
      </div>
  `;
  document.body.appendChild(editForm);
}


function updateNote(id) {
  const newTitle = document.getElementById("data-input").value;
  const newDescription = document.getElementById("data-description").value;
  if (newTitle && newDescription) {
    fetch(`/data/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newTitle, description: newDescription }),
    }).then(() => {
      cancelEdit();
      loadNotes();
    });
  }
}

  // Handle form submission to add new data
  dataForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const newData = { description: dataInput.value };

    try {
      const response = await fetch("/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        dataInput.value = ""; // Clear input field
        fetchData(); // Refresh the list
      }
    } catch (error) {
      console.error("Error adding data:", error);
    }
  });

  addNote.addEventListener("click", () => {
  const noteTitle = dataInput.value.trim();
  const noteDescription = dataDesc
    .value.trim();
  if (noteTitle && noteDescription) {
    fetch("/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: noteTitle, description: noteDescription }),
    })
      .then((res) => res.json())
      .then(() => {
        dataInput.value = "";
        dataDesc.value = "";
        fetchData();
      });
  }
});
// Edit button function by ID
function updateNote(id) {
  const newTitle = document.getElementById("editTitle").value;
  const newDescription = dataDesc.value;
  if (newTitle && newDescription) {
    fetch(`/data/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newTitle, description: newDescription }),
    }).then(() => {
      cancelEdit();
      fetchData();
    });
  }
}

  // Delete button function by ID
  function deleteNote(id) {
  fetch(`/data/${id}`, { method: "DELETE" }).then(() => fetchData());
}

  // Fetch data on page load
  fetchData();
});
