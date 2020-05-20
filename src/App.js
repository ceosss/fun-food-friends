import React, { Component } from "react";

import firebase from "./firebase";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      currentItem: "",
      items: [],
    };
  }

  componentDidMount = () => {
    const itemsRef = firebase.database().ref("items");
    itemsRef.on("value", (snapshot) => {
      let items = snapshot.val();
      let array = [];
      for (let key in items) {
        const item = {
          id: key,
          ...items[key],
        };
        array.push(item);
      }
      this.setState({ items: array });
    });
  };

  removeItem = (id) => {
    let itemRef = firebase.database().ref(`/items/${id}`);
    itemRef.remove();
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const itemsRef = firebase.database().ref("items");
    const item = {
      title: this.state.currentItem,
      user: this.state.username,
    };
    itemsRef.push(item);
    this.setState({
      currentItem: "",
      username: "",
    });
  };

  render() {
    return (
      <div className="app">
        <header>
          <div className="wrapper">
            <h1>Fun Food Friends</h1>
          </div>
        </header>
        <div className="container">
          <section className="add-item">
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="What's your name?"
                value={this.state.username}
                onChange={this.handleChange}
              />
              <input
                type="text"
                name="currentItem"
                placeholder="What are you bringing?"
                value={this.state.currentItem}
                onChange={this.handleChange}
              />
              <button>Add Item</button>
            </form>
          </section>
          <section className="display-item">
            <div className="wrapper">
              <ul>
                {this.state.items.map((item, key) => (
                  <li key={item.id}>
                    <h3>{item.title}</h3>
                    <p>brought by: {item.user}</p>
                    <button onClick={() => this.removeItem(item.id)}>
                      Remove Item
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
export default App;
