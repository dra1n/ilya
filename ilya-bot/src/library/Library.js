const books = require('./books')

class Library {
  getBook(bookId) {
    return books[bookId]
  }
}

module.exports = Library
