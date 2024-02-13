const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (isValid(username)) {
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  res.send(JSON.stringify(books,null,4))
});

// Get the book list using promises
public_users.get('/books', function (req, res) {
    const book_list = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify(books,null,4)));
    }).then(() => resolve("Books have been retrieved"));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])
});

//Get book details based on ISBN with promises
public_users.get('/books/isbn/:isbn',function (req, res) {
    const book = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        resolve(res.send(JSON.stringify(books[isbn],null,4)));
    });

    book.then(()=> console.log("Book was found using promises"));
    
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let filtered_authors = Object.values(books).filter((book) => book.author === author);
    res.send(filtered_authors);
});

// Get book details based on author using promises
public_users.get('/books/author/:author',function (req, res) {
    const authors = new Promise((resolve, reject) => {
        const author = req.params.author;
        let filtered_authors = Object.values(books).filter((book) => book.author === author);
        resolve(res.send(JSON.stringify(filtered_authors,null,4)));
    });
    authors.then(()=> console.log("Promises used to get author"));
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let filtered_titles = Object.values(books).filter((book) => book.title === title);
    res.send(filtered_titles);
});

// Get all books based on title using promises
public_users.get('/books/title/:title',function (req, res) {
    const titles = new Promise((resolve, reject) => {
        const title = req.params.title;
        let filtered_titles = Object.values(books).filter((book) => book.title === title);
        resolve(res.send(JSON.stringify(filtered_titles,null,4)));
    });

    titles.then(()=> console.log("Books returned as per Task 13"));

});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews)
});

module.exports.general = public_users;
