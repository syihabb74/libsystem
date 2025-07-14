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


Library.prototype.removeBook = function (idBook) {
    let isBookExist = false;
    let whereIndexBook = null;
    this.books.forEach((value,index) => {
        if ( value.id === idBook ) {
            if ( value.isBorrowed ) {
                throw new Error ('Cannot remove borrowed book');
            } else {
                isBookExist = true;
                whereIndexBook = index;
            }
        }
    })

    if (!isBookExist) {
        throw new Error (`Book not found`)
    }

    let bookRemoved = this.books[whereIndexBook];

    this.books.splice(whereIndexBook,1);
    console.log(bookRemoved)

    return bookRemoved

}

// Library.prototype.borrowBook = function (idMember, idBook) {

// }



// id, title, author, isbn
function Book (id,title,author,isbn) {
    this.id = id
    this.title = title
    this.author = author
    this.isbn = isbn
}


let lib1 = new Library('Gramedia');
let book1 = new Book('B001', 'The Sword', 'Akiraa', 'X667YT')
let book2 = new Book('B002', 'Detective Conan', 'Masashi', 'Y789OP');
lib1.addBook(book1);
lib1.addBook(book2);
lib1.removeBook('B002');
console.log(lib1)





module.exports = Library;
