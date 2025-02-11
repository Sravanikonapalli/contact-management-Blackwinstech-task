const cors = require('cors');
const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const { error } = require("console");

const dbPath = path.join(__dirname, "database.db");
const app = express();

app.use(express.json());
app.use(cors());
let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

   
    app.listen(3000, () => {
      console.log("Server started at http://localhost:3000");
    });
  } catch (e) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

// API to Get All Contacts
app.get("/contacts", async (req, res) => {
  try {
    const fetchAllContacts = `SELECT * FROM contact`;
    const dbResponse = await db.all(fetchAllContacts);
    res.send(dbResponse);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//API to add new contact
app.post("/contacts", async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const insertQuery = `
      INSERT INTO contact (name, email, phone, address, createdAt)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`;
    await db.run(insertQuery, [name, email, phone, address]);
    res.status(200).json({ message: "Contact added successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//update the existing contact
app.put('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;
    if (!name || !email || !phone || !address) {
      return res.status(400).json({ error: "All fields (name, email, phone, address) are required" });
    }
    const updateQuery = `
      UPDATE contact 
      SET name = ?, email = ?, phone = ?, address = ?
      WHERE id = ?;
    `;
    const dbResponse = await db.run(updateQuery, [name, email, phone, address, id]);
    if (dbResponse.changes === 0) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.status(200).json({ message: "Contact Updated Successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//delete contact 
app.delete('/contacts/:id',async(req,res)=>{
  try{
    const {id}=req.params
    const deleteQuery=`DELETE from contact WHERE id=?;`;
    await db.run(deleteQuery,[id])
    res.status(200).json({message:"Contact Deleted Succesfully"})
  } catch (e) {
    res.status(500).json({error:e.message})
  }
  
})

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

