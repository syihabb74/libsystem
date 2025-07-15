// Library.test.js
const Library = require('./Library');

describe('Library Management System', () => {
  let library;

  beforeEach(() => {
    library = new Library("Test Library");
  });

  describe('Constructor', () => {
    test('should create library with valid name', () => {
      const lib = new Library("My Library");
      expect(lib.name).toBe("My Library");
    });

    test('should throw error for empty name', () => {
      expect(() => new Library("")).toThrow('Library name is required');
      expect(() => new Library()).toThrow('Library name is required');
      expect(() => new Library(null)).toThrow('Library name is required');
    });

    test('should initialize empty collections', () => {
      expect(library.getLibraryStats().totalBooks).toBe(0);
      expect(library.getLibraryStats().totalMembers).toBe(0);
    });
  });

  describe('addBook', () => {
    const validBook = {
      id: "B001",
      title: "Test Book",
      author: "Test Author",
      isbn: "978-0123456789"
    };

    test('should add book successfully', () => {
      const result = library.addBook(validBook);
      expect(result).toBe(1);
      expect(library.getLibraryStats().totalBooks).toBe(1);
    });

    test('should throw error for invalid book object', () => {
      expect(() => library.addBook(null)).toThrow('Book must be an object');
      expect(() => library.addBook("string")).toThrow('Book must be an object');
      expect(() => library.addBook([])).toThrow('Book must be an object');
    });

    test('should throw error for missing book properties', () => {
      expect(() => library.addBook({})).toThrow('Book must have id, title, author, and isbn');
      expect(() => library.addBook({id: "B001"})).toThrow('Book must have id, title, author, and isbn');
      expect(() => library.addBook({id: "B001", title: "Test"})).toThrow('Book must have id, title, author, and isbn');
    });

    test('should throw error for duplicate book ID', () => {
      library.addBook(validBook);
      expect(() => library.addBook(validBook)).toThrow('Book with this ID already exists');
    });

    test('should add multiple books', () => {
      library.addBook(validBook);
      library.addBook({...validBook, id: "B002"});
      expect(library.getLibraryStats().totalBooks).toBe(2);
    });
  });

  describe('removeBook', () => {
    const testBook = {
      id: "B001",
      title: "Test Book",
      author: "Test Author",
      isbn: "978-0123456789"
    };

    beforeEach(() => {
      library.addBook(testBook);
    });

    test('should remove book successfully', () => {
      const removedBook = library.removeBook("B001");
      expect(removedBook.id).toBe("B001");
      expect(library.getLibraryStats().totalBooks).toBe(0);
    });

    test('should throw error for non-existent book', () => {
      expect(() => library.removeBook("INVALID")).toThrow('Book not found');
    });

    test('should throw error when removing borrowed book', () => {
      library.registerMember({id: "M001", name: "Test Member", email: "test@example.com"});
      library.borrowBook("M001", "B001");
      expect(() => library.removeBook("B001")).toThrow('Cannot remove borrowed book');
    });
  });

  describe('findBook', () => {
    beforeEach(() => {
      library.addBook({id: "B001", title: "JavaScript Guide", author: "John Doe", isbn: "978-0111111111"});
      library.addBook({id: "B002", title: "Python Basics", author: "Jane Smith", isbn: "978-0222222222"});
      library.addBook({id: "B003", title: "Java Programming", author: "Bob Johnson", isbn: "978-0333333333"});
    });

    test('should find books by title (case-insensitive)', () => {
      const results = library.findBook("javascript");
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe("JavaScript Guide");
    });

    test('should find books by author (case-insensitive)', () => {
      const results = library.findBook("JANE");
      expect(results).toHaveLength(1);
      expect(results[0].author).toBe("Jane Smith");
    });

    test('should find books by ISBN', () => {
      const results = library.findBook("978-0111111111");
      expect(results).toHaveLength(1);
      expect(results[0].isbn).toBe("978-0111111111");
    });

    test('should return empty array for no matches', () => {
      const results = library.findBook("nonexistent");
      expect(results).toEqual([]);
    });

    test('should return multiple matches', () => {
      const results = library.findBook("Ja"); // Should match "JavaScript" and "Java"
      expect(results).toHaveLength(3);
    });
  });

  describe('registerMember', () => {
    const validMember = {
      id: "M001",
      name: "Test Member",
      email: "test@example.com"
    };

    test('should register member successfully', () => {
      const result = library.registerMember(validMember);
      expect(result).toBe(1);
      expect(library.getLibraryStats().totalMembers).toBe(1);
    });

    test('should throw error for invalid member object', () => {
      expect(() => library.registerMember(null)).toThrow('Member must be an object');
      expect(() => library.registerMember("string")).toThrow('Member must be an object');
    });

    test('should throw error for missing member properties', () => {
      expect(() => library.registerMember({})).toThrow('Member must have id, name, and email');
      expect(() => library.registerMember({id: "M001"})).toThrow('Member must have id, name, and email');
    });

    test('should throw error for duplicate member ID', () => {
      library.registerMember(validMember);
      expect(() => library.registerMember(validMember)).toThrow('Member with this ID already exists');
    });

    test('should throw error for invalid email format', () => {
      expect(() => library.registerMember({
        id: "M001",
        name: "Test",
        email: "invalid-email"
      })).toThrow('Invalid email format');
      
      expect(() => library.registerMember({
        id: "M001",
        name: "Test",
        email: "test@"
      })).toThrow('Invalid email format');
    });

    test('should accept valid email formats', () => {
      expect(() => library.registerMember({
        id: "M001",
        name: "Test",
        email: "test@example.com"
      })).not.toThrow();
    });
  });

  describe('borrowBook', () => {
    beforeEach(() => {
      library.addBook({id: "B001", title: "Test Book", author: "Test Author", isbn: "978-0123456789"});
      library.registerMember({id: "M001", name: "Test Member", email: "test@example.com"});
    });

    test('should borrow book successfully', () => {
      const result = library.borrowBook("M001", "B001");
      expect(result.memberId).toBe("M001");
      expect(result.bookId).toBe("B001");
      expect(result.borrowedDate).toBeInstanceOf(Date);
    });

    test('should throw error for non-existent member', () => {
      expect(() => library.borrowBook("INVALID", "B001")).toThrow('Member not found');
    });

    test('should throw error for non-existent book', () => {
      expect(() => library.borrowBook("M001", "INVALID")).toThrow('Book not found');
    });

    test('should throw error for already borrowed book', () => {
      library.borrowBook("M001", "B001");
      library.registerMember({id: "M002", name: "Another Member", email: "another@example.com"});
      expect(() => library.borrowBook("M002", "B001")).toThrow('Book is already borrowed');
    });

    test('should update library stats after borrowing', () => {
      library.borrowBook("M001", "B001");
      const stats = library.getLibraryStats();
      expect(stats.availableBooks).toBe(0);
      expect(stats.borrowedBooks).toBe(1);
    });
  });

  describe('returnBook', () => {
    beforeEach(() => {
      library.addBook({id: "B001", title: "Test Book", author: "Test Author", isbn: "978-0123456789"});
      library.registerMember({id: "M001", name: "Test Member", email: "test@example.com"});
      library.borrowBook("M001", "B001");
    });

    test('should return book successfully', () => {
      const result = library.returnBook("B001");
      expect(result.bookId).toBe("B001");
      expect(result.returnedDate).toBeInstanceOf(Date);
    });

    test('should throw error for non-existent book', () => {
      expect(() => library.returnBook("INVALID")).toThrow('Book not found');
    });

    test('should throw error for non-borrowed book', () => {
      library.addBook({id: "B002", title: "Another Book", author: "Another Author", isbn: "978-0987654321"});
      expect(() => library.returnBook("B002")).toThrow('Book is not borrowed');
    });

    test('should update library stats after returning', () => {
      library.returnBook("B001");
      const stats = library.getLibraryStats();
      expect(stats.availableBooks).toBe(1);
      expect(stats.borrowedBooks).toBe(0);
    });
  });

  describe('getBorrowedBooks', () => {
    beforeEach(() => {
      library.addBook({id: "B001", title: "Book 1", author: "Author 1", isbn: "978-0111111111"});
      library.addBook({id: "B002", title: "Book 2", author: "Author 2", isbn: "978-0222222222"});
      library.registerMember({id: "M001", name: "Member 1", email: "member1@example.com"});
    });

    test('should return empty array when no books borrowed', () => {
      const borrowedBooks = library.getBorrowedBooks();
      expect(borrowedBooks).toEqual([]);
    });

    test('should return borrowed books', () => {
      library.borrowBook("M001", "B001");
      const borrowedBooks = library.getBorrowedBooks();
      expect(borrowedBooks).toHaveLength(1);
      expect(borrowedBooks[0].id).toBe("B001");
    });

    test('should return multiple borrowed books', () => {
      library.registerMember({id: "M002", name: "Member 2", email: "member2@example.com"});
      library.borrowBook("M001", "B001");
      library.borrowBook("M002", "B002");
      const borrowedBooks = library.getBorrowedBooks();
      expect(borrowedBooks).toHaveLength(2);
    });
  });

  describe('getMemberBorrowedBooks', () => {
    beforeEach(() => {
      library.addBook({id: "B001", title: "Book 1", author: "Author 1", isbn: "978-0111111111"});
      library.addBook({id: "B002", title: "Book 2", author: "Author 2", isbn: "978-0222222222"});
      library.registerMember({id: "M001", name: "Member 1", email: "member1@example.com"});
      library.registerMember({id: "M002", name: "Member 2", email: "member2@example.com"});
    });

    test('should return empty array for member with no borrowed books', () => {
      const memberBooks = library.getMemberBorrowedBooks("M001");
      expect(memberBooks).toEqual([]);
    });

    test('should return books borrowed by specific member', () => {
      library.borrowBook("M001", "B001");
      library.borrowBook("M002", "B002");
      
      const member1Books = library.getMemberBorrowedBooks("M001");
      expect(member1Books).toHaveLength(1);
      expect(member1Books[0].id).toBe("B001");
    });

    test('should throw error for non-existent member', () => {
      expect(() => library.getMemberBorrowedBooks("INVALID")).toThrow('Member not found');
    });
  });

  describe('getLibraryStats', () => {
    test('should return correct stats for empty library', () => {
      const stats = library.getLibraryStats();
      expect(stats).toEqual({
        totalBooks: 0,
        availableBooks: 0,
        borrowedBooks: 0,
        totalMembers: 0,
        name: "Test Library"
      });
    });

    test('should return correct stats with books and members', () => {
      library.addBook({id: "B001", title: "Book 1", author: "Author 1", isbn: "978-0111111111"});
      library.addBook({id: "B002", title: "Book 2", author: "Author 2", isbn: "978-0222222222"});
      library.registerMember({id: "M001", name: "Member 1", email: "member1@example.com"});
      library.borrowBook("M001", "B001");

      const stats = library.getLibraryStats();
      expect(stats).toEqual({
        totalBooks: 2,
        availableBooks: 1,
        borrowedBooks: 1,
        totalMembers: 1,
        name: "Test Library"
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle multiple operations correctly', () => {
      // Add books
      library.addBook({id: "B001", title: "Book 1", author: "Author 1", isbn: "978-0111111111"});
      library.addBook({id: "B002", title: "Book 2", author: "Author 2", isbn: "978-0222222222"});
      
      // Register members
      library.registerMember({id: "M001", name: "Member 1", email: "member1@example.com"});
      library.registerMember({id: "M002", name: "Member 2", email: "member2@example.com"});
      
      // Borrow and return
      library.borrowBook("M001", "B001");
      library.returnBook("B001");
      library.borrowBook("M002", "B001");
      
      const stats = library.getLibraryStats();
      expect(stats.totalBooks).toBe(2);
      expect(stats.availableBooks).toBe(1);
      expect(stats.borrowedBooks).toBe(1);
    });

    test('should handle case-insensitive search properly', () => {
      library.addBook({id: "B001", title: "JAVASCRIPT Guide", author: "john DOE", isbn: "978-0111111111"});
      
      const results1 = library.findBook("javascript");
      const results2 = library.findBook("JOHN");
      
      expect(results1).toHaveLength(1);
      expect(results2).toHaveLength(1);
    });
  });
});