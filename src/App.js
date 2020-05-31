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
        this.setState({ username: user.displayName });
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
      user: this.state.user.displayName,
    };
    itemsRef.push(item);
    this.setState({
      currentItem: "",
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
        {this.state.user ? (
          <div>
            <div className="user-profile">
              <img src={this.state.user.photoURL} alt="user" />
            </div>
          </div>
        ) : (
          <div className="wrapper">
            <p>
              You must be logged in to see the potluck list and submit to it.
            </p>
          </div>
        )}
        <div className="container">
          <section className="add-item">
            <form onSubmit={this.handleSubmit}>
              <input value={this.state.username} onChange={this.handleChange} />
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
                {this.state.items.map((item) => {
                  return (
                    <li key={item.id}>
                      <h3>{item.title}</h3>
                      <p>
                        brought by: {item.user}
                        {item.user === this.state.username ? (
                          <button onClick={() => this.removeItem(item.id)}>
                            Remove Item
                          </button>
                        ) : null}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
export default App;
