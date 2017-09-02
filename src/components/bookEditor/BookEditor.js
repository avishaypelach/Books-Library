import './BookEditor.scss';
import React from 'react';
import BookUtils from '../../utils/bookUtils';
import {HelpBlock, FormControl, ControlLabel, FormGroup, Button, Modal} from 'react-bootstrap';

export default class BookEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.saveBook = this.saveBook.bind(this);
  }

  componentWillReceiveProps(nextProps) {

    let book = {
      id: null,
      authorValidationState: null,
      titleValidationState: null,
      dateValidationState: null,
    };

    if (nextProps.bookId) {
      let index = nextProps.books.findIndex((book) => book.id === nextProps.bookId);
      book = Object.assign(book, nextProps.books[index]);
      book.authorValidationState = 'success';
      book.titleValidationState = 'success';
      book.dateValidationState = 'success';
    }

    this.setState({
      bookId: book.id,
      author: book.author,
      authorValidationState:  book.authorValidationState,
      authorValidationFeedback: '',
      title: book.title,
      titleValidationState:  book.titleValidationState,
      titleValidationFeedback: '',
      date: book.date,
      dateValidationState: book.dateValidationState,
      dateValidationFeedback: '',
    });


  }

  saveBook() {
    this.props.onClose();
    this.props.onBookChanged({
      id: this.state.bookId,
      author: this.state.author,
      title: this.state.title,
      date: this.state.date
    });
  }

  isBookValid() {
    return (this.state.authorValidationState === 'success') &&
           (this.state.titleValidationState === 'success') &&
           (this.state.dateValidationState === 'success');
  }

  handleAuthorChange(e) {

    let author = e.target.value;
    let validationState = 'success';
    let validationFeedback = null;

    if (author.length === 0) {
      validationState = 'error';
      validationFeedback = 'Please enter an author name';
    }

    this.setState({
      author: author,
      authorValidationState: validationState,
      authorValidationFeedback: validationFeedback
    });
  }

  handleDateChange(e) {

    let date = e.target.value;
    let validationState = 'success';
    let validationFeedback = null;

    if (!(/^\d{4}-\d{2}-\d{2}$/.test(date))) {
      validationState = 'error';
      validationFeedback = 'Please insert a valid date';
    }

    this.setState({
      date: date,
      dateValidationState: validationState,
      dateValidationFeedback: validationFeedback
    });
  }


  handleTitleChange(e) {

    let title = e.target.value;
    let validationState = 'success';
    let validationFeedback = null;

    if (BookUtils.getDisplayName(title).length === 0) {
      validationState = 'error';
      validationFeedback = 'Please enter a title';
    } else if (this.props.books.findIndex(
              (book) => {
                  return (book.id !== this.state.bookId) &&
                  (BookUtils.getDisplayName(book.title) === BookUtils.getDisplayName(title))
              }) !== -1 ) {
      validationState = 'warning';
      validationFeedback = 'Title is already exists';
    }

    this.setState({
      title: title,
      titleValidationState: validationState,
      titleValidationFeedback: validationFeedback
    });
  }


  render() {
    return (
      <div>
        <Modal show={this.props.show} onHide={this.props.onClose}>
          <Modal.Header>
            <Modal.Title>{ this.state.bookId ? 'Edit' : 'New' } Book</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup validationState={this.state.authorValidationState}>
              <ControlLabel>Author</ControlLabel>
              <FormControl type="text"
                           placeholder="Author"
                           defaultValue={this.state.author}
                           onChange={(e) => {
                             this.handleAuthorChange(e)
                           }}
              />
              <HelpBlock>{this.state.authorValidationFeedback}</HelpBlock>
            </FormGroup>
            <FormGroup validationState={this.state.titleValidationState}>
              <ControlLabel>Title</ControlLabel>
              <FormControl type="text"
                           placeholder="Title"
                           defaultValue={this.state.title}
                           onChange={(e) => {
                             this.handleTitleChange(e)
                           }}
              />
              <HelpBlock>{this.state.titleValidationFeedback}</HelpBlock>
            </FormGroup>
            <FormGroup validationState={this.state.dateValidationState}>
              <ControlLabel>Date</ControlLabel>
              <FormControl type="date"
                           placeholder="Date"
                           defaultValue={this.state.date}
                           onChange={(e) => {
                             this.handleDateChange(e)
                           }}
              />
              <HelpBlock>{this.state.dateValidationFeedback}</HelpBlock>
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={ this.props.onClose }>Cancel</Button>
            <Button disabled={ !this.isBookValid() }
                    onClick={ this.saveBook }
                    bsStyle="success" >Save</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}