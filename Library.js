function Library (name) {
    if (!name) {
        throw new Error('Library name is required')
    }
    this.name = name
    this.books = []
    this.members = []
}

Library.prototype.addBook = function (book) {
    if ( typeof book !== 'object' || !book || Array.isArray(book) ) {
        throw new Error('Book must be an object');
    }
    if (!book.id || !book.title || !book.author || !book.isbn ) {
        throw new Error('Book must have id, title, author, and isbn')
    }
    this.books.forEach( v => {
        if ( v.id === book.id ) {
            throw new Error('Book with this ID already exists');
        }
    })
    this.books.push(book);
    return this.books.length
}

Library.prototype.getLibraryStats = function () {
    return {
        totalBooks : this.books.length,
        totalMembers : this.members.length 
    }
}


// Library.prototype.borrowBook = function (idMember, idBook) {

// }



// id, title, author, isbn
function Book (id,title,author,isbn) {
    this.id = id
    this.title = title
    this.author = author
    this.isbn = isbn
    this.isBorrowing = ''
}





module.exports = Library;
