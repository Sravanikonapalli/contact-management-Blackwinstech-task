import React, { Component } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:3000/contacts";

class App extends Component {
  state = {
    contacts: [],
    name: "", 
    email: "", 
    phone: "", 
    address: "", 
    editingId: null,
  };

  componentDidMount() {
    this.fetchContacts();
  }

  fetchContacts = async () => {
    try {
      const response = await axios.get(API_URL);
      this.setState({ contacts: response.data });
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { name, email, phone, address, editingId } = this.state;
      const contactData = { name, email, phone, address };
      
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, contactData);
      } else {
        await axios.post(API_URL, contactData);
      }
      this.fetchContacts();
      this.setState({ name: "", email: "", phone: "", address: "", editingId: null });
    } catch (error) {
      console.error("Error saving contact:", error);
    }
  };

  handleEdit = (contact) => {
    this.setState({ 
      name: contact.name, 
      email: contact.email, 
      phone: contact.phone, 
      address: contact.address, 
      editingId: contact.id 
    });
  };

  handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      this.fetchContacts();
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  render() {
    const {name,email,phone,address,editingId}=this.state
    return (
      <div className="container">
        <h1>Contact Management</h1>
        <form onSubmit={this.handleSubmit}>
          <input name="name" placeholder="Name" value={name} onChange={this.handleInputChange} required />
          <input name="email" type="email" placeholder="Email" value={email} onChange={this.handleInputChange} required />
          <input name="phone" placeholder="Phone" value={phone} onChange={this.handleInputChange} required />
          <input name="address" placeholder="Address" value={address} onChange={this.handleInputChange} />
          <button type="submit">{editingId ? "Update" : "Add"} Contact</button>
        </form>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.contacts.map((contact) => (
              <tr key={contact.id}>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.phone}</td>
                <td>{contact.address}</td>
                <td>{new Date(contact.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => this.handleEdit(contact)}>Edit</button>
                  <button className="delete-btn" onClick={() => this.handleDelete(contact.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
