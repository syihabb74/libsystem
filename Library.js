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
    return this.books.length;
}

Library.prototype.getLibraryStats = function () {
    return {
        totalBooks : this.books.length,
        totalMembers : this.members.length,
        availableBooks : this.books.filter(v => !v.borrowedBy).length,
        borrowedBooks : this.books.filter(v => v.borrowedBy).length,
        name : this.name

    }
}


Library.prototype.removeBook = function (idBook) {
    let isBookExist = false;
    let whereIndexBook = null;
    this.books.forEach((value,index) => {
        if ( value.id === idBook ) {
            if ( value.borrowedBy ) {
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
    return bookRemoved
}

Library.prototype.registerMember = function (member) {
    if ( typeof member !== 'object' || !member ) throw new Error('Member must be an object');
    if ( !member.id || !member.email || !member.name ) throw new Error ('Member must have id, name, and email');
    if ( !member.email.includes('@') || !member.email.includes('.') ) throw new Error('Invalid email format');
    this.members.forEach((value) => {
        if (value.id === member.id) {
            throw new Error ('Member with this ID already exists')
        }
    })
    this.members.push(member)
    return this.members.length;
}


Library.prototype.borrowBook = function (idMember, idBook) {
    let isMemberExist = this.members.find(value => value.id === idMember);
    if (!isMemberExist) throw new Error('Member not found');
    let isBookExist = this.books.find(value => value.id === idBook);
    if (!isBookExist) throw new Error (`Book not found`);
    let isBookBorrowed = this.books.find((value) => value.id === idBook && !value.borrowedBy );
    if (!isBookBorrowed) throw new Error ('Book is already borrowed');
    let book = this.books.find(value => value.id === idBook);
    book.borrowedDate = new Date();
    book.borrowedBy = idMember;
    return book.id

}


Library.prototype.findBook = function (keyword) {
    
    let isBookMatch = this.books.filter( v => v.title.toLowerCase().includes(keyword.toLowerCase())  ||
                                              v.author.toLowerCase().includes(keyword.toLowerCase()) ||
                                              v.isbn.toLowerCase().includes(keyword.toLowerCase()) 
                                            )
    return isBookMatch;

}

Library.prototype.returnBook = function (idBook) {
    let isBookExist = this.books.find(v => v.id === idBook);
    if (!isBookExist) throw new Error(`Book not found`);
    let isBookBorrowed = this.books.find (v => v.id === idBook && v.borrowedBy);
    if (!isBookBorrowed) throw new Error(`Book is not borrowed`);
    return isBookBorrowed.id

}

Library.prototype.getBorrowedBooks = function () {
    return this.books.filter(v => v.borrowedBy);
}

Library.prototype.getMemberBorrowedBooks = function (idMember) {
    let member = this.books.map(v => v.borrowedBy)
                           .filter(v => v === idMember);
    if (!member.length) {
        return member
    }
    let registeredMember = new Set(this.books.map(v => v.id));
    member.forEach((v) => {
        if (!registeredMember.has(v)) {
            throw new Error ('Member not found')
        }
    })
}


// id, title, author, isbn
function Book (id,title,author,isbn) {
    this.id = id
    this.title = title
    this.author = author
    this.isbn = isbn
}


// let book1 = new Book('B001', 'The Sword', 'Akiraa', 'X667YT')
// let book2 = new Book('B002', 'Detective Conan', 'Masashi', 'Y789OP');
// let lib1 = new Library('Gramedia');
// // console.log(lib1)
// // // lib1.addBook(book1);
// // // lib1.addBook(book2);
// // // lib1.removeBook('B002');
// // // console.log(lib1)

// // lib1.members.push(member1)

// lib1.registerMember({
//         id: "M001",
//         name: "Test",
//         email : 'xxxx@example.com'
//       })

// console.log(lib1.getLibraryStats())



module.exports = Library;
