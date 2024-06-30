const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  console.log('login', users)
  //Write your code here
  //check to see if user is in the database
  let filtered = users.filter(user => (
    user.username == req.body.username
  ))

  if (filtered.length > 0) {
    //user is found, validate password
    if (filtered[0]["password"] === req.body.password) {
      //user is valid, give token
      let accessToken = jwt.sign({
        data: filtered[0]
      }, 'access', { expiresIn: 60 * 60})

      req.session.authorization = {
        accessToken
      }
      console.log('session', req.session)
      return res.status(200).json({message: `${req.body.username} successfully logged in`});
    } else {
      //user isn't valid
      return res.status(200).json({message: `Please provide valid credentials for ${req.body.username}`});
    }
  } else {
    //user not found
  }
  // Generate JWT access token
  // let accessToken = jwt.sign({
  //   data: user
  // }, 'access', { expiresIn: 60 * 60 });

  // // Store access token in session
  // req.session.authorization = {
  //     accessToken
  // }
  return res.status(300).json({message: "Yet to be implemented"});
});

//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let book = books[req.params.isbn]
  let user = req.session.user.data.username
  let reviews = book["reviews"]

  if (user in reviews) delete reviews[user]
  return res.status(200).json({data: book});
})
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let book = books[req.params.isbn]
  let user = req.session.user.data.username
  let reviews = book["reviews"]
  if (user in reviews) {
    //user already created review, modify it
    reviews[user] = req.query.review
  } else {
    //user has not created review, create new review
    reviews[user] = req.query.review
  }
  return res.status(200).json({data: book});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
