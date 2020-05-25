import React, { Component } from "react";

import firebase, { auth, provider } from "./firebase";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      currentItem: "",
      items: [],
      user: null,
    };
  }

  componentDidMount = () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      }
    });

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

  logout = () => {
    auth.signOut().then(() => {
      this.setState({ user: null });
    });
  };
  login = () => {
    auth.signInWithPopup(provider).then((result) => {
      const user = result.user;
      this.setState({
        user,
      });
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
            {this.state.user ? (
              <button onClick={this.logout}>Log Out</button>
            ) : (
              <button onClick={this.login}>Log In</button>
            )}
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
