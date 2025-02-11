const express = require("express");
const cors = require("cors");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "database.db");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });

    await db.run(`
      CREATE TABLE IF NOT EXISTS contact (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL,
        address TEXT,
        createdAt TEXT DEFAULT (datetime('now')) 
      );
    `);

    app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

// Get All Contacts
app.get("/contacts", async (req, res) => {
  try {
    const fetchAllContacts = `SELECT * FROM contact`;
    const contacts = await db.all(fetchAllContacts);
    res.json(contacts);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Add New Contact
app.post("/contacts", async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const createdAt = new Date().toISOString(); // UTC format

    const insertQuery = `INSERT INTO contact (name, email, phone, address, createdAt) VALUES (?, ?, ?, ?, ?)`;
    await db.run(insertQuery, [name, email, phone, address, createdAt]);

    res.status(201).json({ message: "Contact added successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update Contact
app.put("/contacts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    const updateQuery = `UPDATE contact SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?`;
    const result = await db.run(updateQuery, [name, email, phone, address, id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.status(200).json({ message: "Contact updated successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete Contact
app.delete("/contacts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteQuery = `DELETE FROM contact WHERE id = ?`;
    await db.run(deleteQuery, [id]);

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


//fetch single contact based on id
app.get('/contacts/:id',async(req,res)=>{
  try {
    const {id}=req.params
    const getSingleContact=`SELECT * FROM contact WHERE id=?;`;
    const dbResponse=await db.get(getSingleContact,[id])
    if (!dbResponse){
      return res.status(404).json({error:"Contact not found"})
    }
    res.status(200).json(dbResponse)
  } catch(e) {
    res.status(500).json({error:e.message})
  }
})
module.exports = app;

