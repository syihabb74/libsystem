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
    let isBookCanRemove = {
        book : null,
        index : null,
        bookIsBorrowed : false
    }

    for ( let i = 0 ; i < this.totalBooks.length ; i++  ) {
        let book = this.totalBooks[i];
        if ( book.id === idBook ) {
            if (book.isBorrowing) {
                isBookCanRemove.bookIsBorrowed = true;
            } else {
                isBookCanRemove.book = book;
                isBookCanRemove.index = i;
            }
            break;
        }
    }
    
    if (!isBookCanRemove.book) throw new Error('Book not found');
    if (isBookCanRemove.bookIsBorrowed) throw new Error('Cannot remove borrowed book');
    let removed = [...this.totalBooks];
    removed.splice(isBookCanRemove.index,1);
    this.totalBooks = removed;
    
    return isBookCanRemove.book

}

Library.prototype.borrowBook =  function(idMember, idBook) {
    let bookIsBorrowed = this.removeBook(idBook);
}



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
lib1.totalBooks[0].isBorrowing = lib1.totalMembers[0].id;
console.log(lib1)
// console.log(book1)
// console.log(lib1)
lib1.borrowBook(lib1.totalMembers[1].id, 'B001');
// console.log(lib1)
// console.log(lib1)


module.exports = Library;



// // let test = {
// //     total : [],
// //     abc : [],
// //     getStats : function () {
// //         return {
// //             total : this.total.length,
// //             abc: this.total.length
// //         } 
// //     }
// // }

// // console.log(test.getStats().total)


// console.log(typeof null)













// let n = 8;




// for ( let i = 1 ; i <= n ; i++ ) {
//     let symbol= '';
//     for ( let j = 1 ; j <= n ; j++ ) {
//         if ( (i * n - n + j) % 2 === 0) {
//             symbol += '+'
//         } else {
//             symbol += '-'
//         }
//     }
//     console.log(symbol)
// }