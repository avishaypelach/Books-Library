import React from 'react';
import BookIcon from 'react-icons/fa/book';
import BookList from "../bookList/BookList";
import './App.scss';
import BookService from '../../services/bookService/BookService';
import MDSpinner from "react-md-spinner";

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      books: null,
      error: null
    }
  }

  componentDidMount() {
    let _this = this;
    BookService.getBookList()
      .then(
        response => {
          if (response.ok) {
            response.json().then(data => {
                _this.setState({books: data.books});
              }
            )
          } else {
            this.setState({
              error: "Failed to get list of books"
            })
          }
        })
      .catch(err => this.setState({error: err.message}));
  }

  render() {
    if (this.state.error) {
      return <div className="app-error"> { this.state.error } </div>;
    } else if (this.state.books === null) {
      return <div className="app-loading"><MDSpinner size={100}/></div>;
    } else {
      return (
        <div className="app">
          <div className="app-title">
            <h1>Books <BookIcon/>Library</h1>
          </div>
          <BookList
            books={this.state.books}
          />
        </div>
      );
    }
  }
}
