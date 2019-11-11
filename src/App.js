import React, { Component } from 'react';
import Modal from './modal';
import logo from './logo.svg';
import './App.css';

const apiUrl = 'https://jsonplaceholder.typicode.com';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            todoList: [],
            isLoading: false,
            todoItemDescription: "",
            showModal: false
        };

        this.handleCompleteItemClick = this.handleCompleteItemClick.bind(this);
        this.addNewItem = this.addNewItem.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleItemDelete = this.handleItemDelete.bind(this);
    }

    getItemIndex(value, arr, prop) {
        for(let i = 0; i < arr.length; i++) {
            if(arr[i][prop] === value) {
                return i;
            }
        }
        return -1;
    }

    showModal = () => {
        this.setState({ showModal: true });
    };

    hideModal = () => {
        this.setState({ showModal: false });
    };

    handleInputChange({ target }) {
        this.setState({
            [target.name]: target.value
        });
    }

    handleItemDelete(itemId) {
        fetch( apiUrl + '/posts/' + itemId, {
            method: 'DELETE'
        }).then(response => {
            let items = [...this.state.todoList];
            let index = this.getItemIndex(itemId, items, 'id');
            if (index !== -1) {
                items.splice(index, 1);
                this.setState({todoList: items});
            }
        })
    }

    addNewItem() {
        let items = [...this.state.todoList];

        fetch(apiUrl + '/todos/', {
            method: 'POST',
            body: JSON.stringify({
                title: this.state.todoItemDescription,
                completed: false,
                userId: 1
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => {
                if (response.ok) {
                    this.setState({ showModal: false });
                    return response.json();
                } else {
                    throw new Error('Oops that did not go to plan ...');
                }
            })
            .then(json => {
                console.log(json)
                items.push(json);
                this.setState({todoList: items});
            })

    }

    handleCompleteItemClick(itemId, itemTitle) {
        if (itemId > 200) {
            //We have a newly added item that has been completed...lets fake the complete
            let items = [...this.state.todoList];
            let index = this.getItemIndex(itemId, items, 'id');
            if (index !== -1) {
                this.setState({todoList: items});
            }
        } else {
            fetch(apiUrl + '/todos/' + itemId, {
                method: 'PUT',
                body: JSON.stringify({
                    id: itemId,
                    title: itemTitle,
                    completed: true,
                    userId: 1
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Oops that did not go to plan ...');
                    }
                })
                .then(json => {
                    if (json.completed) {
                        let items = [...this.state.todoList];
                        let index = this.getItemIndex(itemId, items, 'id');
                        items[index] = json;
                        this.setState({todoList: items});
                    }
                });
        }

    }

    componentDidMount() {
        this.setState({ isLoading: true });
        fetch(apiUrl + "/users/1/todos")
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Oops that did not go to plan ...');
                }
            })
            .then(data => this.setState({ todoList: data, isLoading: false }))
            .catch(error => this.setState({ error, isLoading: false }));
  }

    render() {
        const { todoList, isLoading, error } = this.state;

        if (error) {
          return <p>{error.message}</p>;
        }

        if (isLoading) {
          return <p>Loading ...</p>;
        }
        return (
            <div className="app">

            <header className="header">
                <img src={logo} alt="" className="appLogo" />
                <h1 className="pageTitle">My To Do List</h1>
            </header>


            <section className="row">
                <nav className="col">

                    <Modal showModal={this.state.showModal} handleClose={this.hideModal}>
                        <input
                            type="text"
                            name="todoItemDescription"
                            placeholder="Enter new TODO item here..."
                            value={ this.state.todoItemDescription }
                            onChange={ this.handleInputChange }
                        />
                        <button onClick={this.addNewItem.bind(this)}>
                            Add item
                        </button>
                    </Modal>

                    <button type="button" onClick={this.showModal}>
                        Add New Items
                    </button>

                </nav>
                    <div className="col">
                        <ul>
                            {todoList.map(item => {
                                if (item.completed) {
                                    return <li key={item.id}>
                                        <span className='itemComplete'>
                                          {item.title} - Completed
                                        </span>
                                        <button onClick={this.handleItemDelete.bind(this, item.id)}>
                                            Delete
                                        </button>
                                    </li>
                                } else {
                                    return <li key={item.id}>
                                        <span className='notComplete'>
                                            {item.title} - Not Complete
                                        </span>
                                        <button onClick={this.handleItemDelete.bind(this, item.id)}>
                                            Delete
                                        </button>
                                        <button onClick={this.handleCompleteItemClick.bind(this, item.id, item.title)}>
                                            Mark as complete
                                        </button>
                                    </li>
                                }
                            }
                        )}
                    </ul>
                    </div>
                </section>

                <footer>
                    <div className="footerContent">Footer Content</div>
                </footer>

            </div>
        );
      }

    }

    export default App;
