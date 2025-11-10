// Import the required modules
const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Create an instance of an Express application
const app = express();

// Define the port the server will listen on
const PORT = 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
// Define the path to the JSON file
const dataFilePath = path.join(__dirname, "data.json");

// Function to read data from the JSON file
const readData = () => {
  if (!fs.existsSync(dataFilePath)) {
    return [];
  }
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};

// Function to write data to the JSON file
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Handle GET request at the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle GET request to retrieve stored data
app.get("/data", (req, res) => {
  const data = readData();
  res.json(data);
});

// Handle POST request to save new data with a unique ID
app.post("/data", (req, res) => {
  const newData = { id: uuidv4(), ...req.body };
  const currentData = readData();
  currentData.push(newData);
  writeData(currentData);
  res.json({ message: "Note saved successfully", data: newData });
  res.status(201).json(newNote);
  console.log("Note saved successfully");
});

app.post("/data", (req, res) => {
  const notes = readData();
  const newNote = {
    id: uuidv4(),
    title: req.body.title,
    description: req.body.description,
  };
  notes.push(newNote);
  writeData(notes);
  res.status(201).json(newNote);
});

// Handle POST request at the /echo route
app.post("/echo", (req, res) => {
  // Respond with the same data that was received in the request body
  res.json({ received: req.body });
});

// Handle Update note for unique ID
app.put("/data/:id", (req, res) => {
  let notes = readData();
  const noteIndex = notes.findIndex((n) => n.id == req.params.id);
  if (noteIndex !== -1) {
    notes[noteIndex].title = req.body.title;
    notes[noteIndex].description = req.body.description;
    writeData(notes);
    res.json(notes[noteIndex]);
    console.log("Note updated");

  } else {
    res.status(404).json({ message: "Note not found" });
      console.log("Note not found");

  }
});

// Handle DELETE for unique ID
app.delete("/data/:id", (req, res) => {
  let notes = readData();
  const filteredNotes = notes.filter((n) => n.id != req.params.id);
  writeData(filteredNotes);
  res.json({ message: "Note deleted" });
  console.log("Note deleted");
});

// Wildcard route to handle undefined routes
// app.all("*", (req, res) => {
//   res.status(404).send("Route not found");
// });

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
