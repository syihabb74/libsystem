function Library (name) {
    if (!name) {
        throw new Error('Library name is required')
    }
    this.name = name
    this.totalBooks = []
    this.totalMembers = []
}

Library.prototype.addBook = function (book) {
    if ( typeof book !== 'object' || !book || Array.isArray(book) ) {
        throw new Error('Book must be an object');
    }
    if (!book.id || !book.title || !book.author || !book.isbn ) {
        throw new Error('Book must have id, title, author, and isbn')
    }
    this.totalBooks.forEach( v => {
        if ( v.id === book.id ) {
            throw new Error('Book with this ID already exists');
        }
    })
    this.totalBooks.push(book);
    return this.totalBooks.length
}

Library.prototype.getLibraryStats = function () {
    return {
        totalBooks : this.totalBooks.length,
        totalMembers : this.totalMembers.length 
    }
}

Library.prototype.removeBook = function (idBook) {
    let bookIsBorrowed = {
        isExist : null,
        book : null,
        isBorrowed : false,
        index : null,
    }
    this.totalBooks.forEach((v,index) => {
        if (v.id === idBook) {
            if ( v.isBorrowing ) {
                bookIsBorrowed.isExist = true;
                bookIsBorrowed.book = v;
                bookIsBorrowed.isBorrowed = true;
            } else {
                bookIsBorrowed.isExist = true;
                bookIsBorrowed.book = v;
                bookIsBorrowed.isBorrowed = false;
                bookIsBorrowed.index = index;

            }
        }
    })
    if (!bookIsBorrowed.isExist) throw new Error('Book not found');
    if (bookIsBorrowed.isBorrowed) throw new Error('Cannot remove borrowed book');
    let currentLibrary = [...this.totalBooks];
    currentLibrary.splice(bookIsBorrowed.index, 1);
    this.totalBooks = currentLibrary;
    return bookIsBorrowed.book;
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





// console.log(lib1)
let lib1 = new Library('Gramedia');
let book1 = new Book('B001', 'Little Petit', 'Maxi', 'ix122');

lib1.addBook(book1);
const validMember = {
    id: "M001",
    name: "Test Member",
    email: "test@example.com"
};

const validMember2 = {
    id: "M002",
    name: "Test Member2",
    email: "test2@example.com"
}

// let book2 = new Book('1', 'Harry Potter', 'Nell', false);


lib1.totalMembers.push(validMember)
lib1.totalMembers.push(validMember2)
// lib1.totalBooks[0].isBorrowing = lib1.totalMembers[0].id;
lib1.totalBooks[0].isBorrowing = lib1.totalMembers[0].id;
console.log('Book status:', lib1.totalBooks[0]);
lib1.removeBook('B001');

module.exports = Library;
