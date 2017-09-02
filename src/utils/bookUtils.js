export default {

    getDisplayName: function (bookName) {
      return bookName.replace(/[^a-zA-Z ]/g, "") // remove non-english
                     .replace(/\b\w/g, l => l.toUpperCase()) // capitalize first
                     .replace(/ +(?= )/g,'') // remove double spaces
                     .replace(/^\s\s*/, '').replace(/\s\s*$/, ''); // trim spaces
    }
}