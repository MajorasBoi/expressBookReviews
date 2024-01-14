const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
let books_array = Object.values(books);

const isValid = (username)=>{
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return false;
      } else {
        return true;
      } 
}

const authenticatedUser = (username,password)=>{ 
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (username && password) {
        if(authenticatedUser(username,password)){
            let accessToken = jwt.sign({
            data: password
            }, 'access_', { expiresIn: 60 * 60 });
            req.session.authorization = {accessToken,username}
            return res.status(200).send("User successfully logged in");
        }else{
            return res.status(208).json({message: "Invalid Login. Check username and password"});
        }    
    }else{
        return res.status(404).json({message: "Error logging in"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn
    const username = req.session.authorization.username
    const text = req.body.text

    let filtered_book = books_array.filter((book)=>{
        return (book.isbn === isbn)
    })
    if(filtered_book.length > 0){
        let reviews = Object.values(filtered_book[0].reviews)
        let filtered_review = reviews.filter((review)=>{
            return (review.text === text)
        })
        if(filtered_review.length > 0){
            filtered_review[0].text = text
            return res.json({message: `Review from ${username} updated`}) 
        }else{
            reviews.push({"username": username, "text": text})
            return res.json({message: `${username} added a new review`})
        }
    }else{
        return res.status(404).json({message: "ISBN not found"})
    }
    
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn
    const username = req.session.authorization.username

    let filtered_book = books_array.filter((book)=>{
        return (book.isbn === isbn)
    })
    if(filtered_book.length > 0){
        delete filtered_book[0].reviews[username]
        return res.json({message: "Review successfully deleted."})
    }else{
        return res.status(404).json({message: "ISBN not found"})
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
