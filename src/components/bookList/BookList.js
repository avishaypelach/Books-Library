import React from 'react';
import DeleteIcon from 'react-icons/fa/trash-o';
import EditIcon from 'react-icons/fa/pencil';
import PlusIcon from 'react-icons/fa/plus';
import './BookList.scss';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import BookEditor from '../bookEditor/BookEditor'
import {Button} from 'react-bootstrap';
import uuid from 'uuid';
import BookUtils from '../../utils/bookUtils';

export default class BookList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      books: props.books,
      showBookEditor: false,
      editBookId: null
    };
    this.editButton = this.editButton.bind(this);
    this.deleteButton = this.deleteButton.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      books: nextProps.books
    })
  }

  editBook(bookId) {
    this.setState({
      showBookEditor: true,
      editBookId: bookId
    });
  }

  editButton(cell, row, rowIndex) {
    let bookId = row.id;
    return (
      <button className="btn btn-primary"
              type="button"
              onClick={() => {
                this.editBook(bookId)
              }}>
        <EditIcon/>
      </button>
    )
  }

  titleFormatter(cell, row, rowIndex) {
    return (
      `${BookUtils.getDisplayName(cell)}`
    )
  }

  dateFormatter(cell, row) {
    if (typeof Date.parse(cell) !== 'object') {
      cell = new Date(cell);
    }
    return `${('0' + cell.getDate()).slice(-2)}/${('0' + (cell.getMonth() + 1)).slice(-2)}/${cell.getFullYear()}`;
  }


  onBookEditorClose() {
    this.setState({showBookEditor: false});
  }


  deleteBook(bookId) {
    let books = this.state.books;
    const index = books.findIndex((book) => book.id === bookId);
    const book = books[index];
    let deleteConfirmation = confirm('Are you sure you want to delete ' + '"' + BookUtils.getDisplayName(book.title) + '"?');
    if (deleteConfirmation) {
      books.splice(index, 1);
      this.setState({books: books});
    }
  }

  deleteButton(cell, row, rowIndex) {
    let bookId = row.id;
    return (
      <button className="btn btn-danger"
              type="button"
              onClick={() => {
                this.deleteBook(bookId)
              }}>
        <DeleteIcon/>
      </button>
    )
  }

  updateBook(updatedBook) {

    let books = this.state.books;
    if (updatedBook.id !== null) {

      const index = books.findIndex((book) => book.id === updatedBook.id);
      books[index] = updatedBook;

    } else { // new book

      let newBook = updatedBook;
      newBook.id = uuid();
      books.push(newBook);

    }
    this.setState({books: books});
  }

  render() {
    return (
      <div className="book-list">
        <Button className="add-book-btn" bsStyle="info" onClick={() => this.editBook() }><PlusIcon/> New Book</Button>
        <BootstrapTable data={this.state.books} striped hover>
          <TableHeaderColumn dataField='id'
                             width='5%'
                             dataAlign='center'
                             hidden
                             isKey/>

          <TableHeaderColumn dataField='author'
                             width='25%'>
            Author
          </TableHeaderColumn>

          <TableHeaderColumn dataField='title'
                             dataFormat={this.titleFormatter}
                             width='35%'>
            Title
          </TableHeaderColumn>

          <TableHeaderColumn dataField='date'
                             dataAlign='center'
                             dataFormat={this.dateFormatter}
                             width='15%'>
            Date
          </TableHeaderColumn>

          <TableHeaderColumn dataFormat={this.editButton}
                             width='10%'
                             dataAlign='center'>
            Edit
          </TableHeaderColumn>

          <TableHeaderColumn dataFormat={this.deleteButton}
                             width='10%'
                             dataAlign='center'>
            Remove
          </TableHeaderColumn>

        </BootstrapTable>

        <BookEditor bookId={this.state.editBookId}
                    books={this.state.books}
                    show={this.state.showBookEditor}
                    onClose={() => this.onBookEditorClose()}
                    onBookChanged={(book) => this.updateBook(book)}
        />

      </div>
    );
  }
}