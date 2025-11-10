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
                  <h2>${item.title}</h2>
                  <p>${item.text.replace(
                    /\n/g,
                    "<br>"
                  )}</p> 
                  
                  <!-- Converts newlines to <br> -->
                  <div class="buttons">
                      <button class="edit-btn" onclick="showEditForm(${
                        item.id
                      }, '${item.title}', \`${
          item.text
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

  // Handle form submission to add new data
  dataForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const newData = { text: dataInput.value };

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
      body: JSON.stringify({ title: noteTitle, description: noteDescription }),
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
      body: JSON.stringify({ title: newTitle, description: newDescription }),
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
