const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    if (Object.entries(req.body) != 0) {
      let username = req.body.username
      let password = req.body.password

      //if the users array is empty add the user
      if (users.length == 0) {
        users.push({username, password})
        console.log('body', users)
        return res.status(200).json({message: `${username} successfully registered`}).end()
      //otherwise check to see if user is already in array
      } else {
        //filter the array based on the submitted user
        let filtered = users.filter( user => (
          user.username == req.body.username
        ))
        //if user is found, they are already registered
        if (filtered.length > 0) {
          return res.status(200).json({message: `${username} already registered`}).end()
        //otherise add the new user
        } else {
          users.push({username, password})
          return res.status(200).json({message: `${username} successfully registered`}).end()
        }
        
      }
    } else {
      return res.status(200).json({message: `Please provide and username and password`}).end()
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let response = new Promise((resolve, reject) => {
    if (books) {
      setTimeout(() => {
        resolve({data: books})
      }, 5000)
    } else {
      reject({data: "error getting books"})
    }
  })
  //Write your code here

  response.then(success => {
    return res.status(200).json({data: success});
  }).catch(err => {
    return res.status(400).json(err);
  })  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let response = new Promise((resolve, reject) => {
    if (books && books[req.params.isbn]) {
      setTimeout(() => {
        resolve({data: books[req.params.isbn]})
      }, 5000)
    } else if (books && !books[req.params.isbn]) {
      reject({message: `No book with ISBN: ${req.params.isbn} was found`})
    } else {
      reject({message: "There was a problem retriving the books"})
    }
  })

  response.then( success => {
    return res.status(200).json(success)
  }).catch(err => {
    return res.status(400).json(err)
  })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let response = new Promise((resolve, reject) => {
    let author = req.params.author
    let filtered = Object.entries(books).filter( book => (
      book[1]["author"].includes(author)
    ))

    if (filtered.length > 0) {
      setTimeout(() => {
        resolve({data: filtered})
      }, 5000)
    } else {
      reject({message: `No books with ${author} in or as author`})
      //
    }
  })

  response.then(success => {
    return res.status(200).json(success)
  }).catch(err => {
    return res.status(200).json(err)
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let response = new Promise((resolve, reject) => {
    let title = req.params.title
    let filtered = Object.entries(books).filter( book => (
      book[1]["title"].includes(title)
    ))

    if (filtered.length > 0) {
      setTimeout(() => {
        resolve({data: filtered})
      }, 5000)
    } else {
      reject({message: `No books with ${title} in or as author`})
    }
  })

  response.then(success => {
    return res.status(200).json(success)
  }).catch(err => {
    return res.status(200).json(err)
  })
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  if (books && books[req.params.isbn]) {
    return res.status(200).json({data: books[req.params.isbn]["reviews"]})
  } else if (books && !books[req.params.isbn]) {
    return res.status(400).json({message: `No book with ISBN: ${req.params.isbn} was found`})
  } else {
    return res.status(400).json({message: "There was a problem retriving the books"})
  }
});

module.exports.general = public_users;
