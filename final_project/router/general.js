const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

let books_array = Object.values(books)

public_users.post("/register", (req,res) => {
    const username = req.body.username
    const password = req.body.password

    if(username && password){
        if(isValid(username)){
            users.push({"username": username, "password": password})
            return res.json({message: `User ${username} successfully registered.`})
        }else{
            return res.status(404).json({message: "User already exists."})
        }
    }else{
        return res.status(404).json({message: "User or password not provided."})
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return new Promise((resolve, reject) => {
        resolve(books);
    }).then(books => {
        res.json(books);
    }).catch(err => {
        console.error(err);
        res.status(500).send('Error retrieving books');
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    return new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        const filtered_book = books_array.filter((book) => {
            return (book.isbn === isbn);
        });
        if(filtered_book.length > 0){
            resolve(filtered_book);
        } else {
            reject("ISBN not found");
        }
    }).then(filtered_book => {
        res.json(filtered_book);
    }).catch(err => {
        console.error(err);
        res.status(404).json({message: err});
    });
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    return await new Promise((resolve, reject) => {
        const author = req.params.author;
        const filtered_book = books_array.filter((book) => {
            return (book.author === author);
        });
        if(filtered_book.length > 0){
            resolve(filtered_book);
        } else {
            reject("Author not found");
        }
      }).then(filtered_book => {
        res.json(filtered_book);
      }).catch(err => {
        console.error(err);
        res.status(404).json({message: err});
      });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    return new Promise((resolve, reject) => {
    const title = req.params.title;
  const filtered_book = books_array.filter((book) => {
      return (book.title === title);
  });
  if(filtered_book.length > 0){
      resolve(filtered_book);
  } else {
      reject("Title not found");
  }
}).then(filtered_book => {
  res.json(filtered_book);
}).catch(err => {
  console.error(err);
  res.status(404).json({message: err});
});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn

    const filtered_book = books_array.filter((book)=>{
        return (book.isbn === isbn)
    })
    if(filtered_book.length > 0){
        return res.json(filtered_book[0].reviews)
    }else{
        return res.status(404).json({message: "ISBN not found"})
    }
});

module.exports.general = public_users;
