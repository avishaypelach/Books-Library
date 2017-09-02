export default {

    getBookList: function () {
      return fetch('/data/books.json');
    }
}