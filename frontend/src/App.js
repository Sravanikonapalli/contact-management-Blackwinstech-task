import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import moment from "moment-timezone";
import { MdEdit , MdDelete} from "react-icons/md";

const API_URL = "https://contact-management-backend-w8r3.onrender.com/contacts";

class App extends Component {
  state = {
    contacts: [],
    name: "",
    email: "",
    phone: "",
    address: "",
    editingId: null,
    searchQuery: "",
    loading: false,
  };

  componentDidMount() {
    this.fetchContacts();
  }

  fetchContacts = async () => {
    this.setState({ loading: true });
    try {
      const response = await axios.get(API_URL);
      this.setState({ contacts: response.data, loading: false });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      this.setState({ loading: false });
    }
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSearchChange = (e) => {
    this.setState({ searchQuery: e.target.value });
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

      await this.fetchContacts(); 
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
      editingId: contact.id,
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
    const { name, email, phone, address, editingId, contacts, searchQuery, loading } = this.state;

    const filteredContacts = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="container">
        <h1>Contact Management</h1>
        <input
          type="text"
          className="searchbar"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={this.handleSearchChange}
        />
        <form onSubmit={this.handleSubmit}>
          <input name="name" placeholder="Name" value={name} onChange={this.handleInputChange} required />
          <input name="email" type="email" placeholder="Email" value={email} onChange={this.handleInputChange} required />
          <input name="phone" placeholder="Phone" value={phone} onChange={this.handleInputChange} required />
          <input name="address" placeholder="Address" value={address} onChange={this.handleInputChange} />
          <button type="submit">{editingId ? "Update" : "Add"} Contact</button>
        </form>

        {loading ? (
          <p>Loading contacts...</p>
        ) : (
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
              {filteredContacts.map((contact) => (
                <tr key={contact.id}>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.phone}</td>
                  <td>{contact.address}</td>
                  <td>{moment(contact.createdAt).tz("Asia/Kolkata").format("DD/MM/YYYY, hh:mm A")}</td>
                  <td className="buttons">
                    <button className="edit-btn" onClick={() => this.handleEdit(contact)}><MdEdit size={25}/></button>
                    <button className="delete-btn" onClick={() => this.handleDelete(contact.id)}>< MdDelete size={25}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

export default App;
