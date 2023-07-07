const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }


public_users.post("/register", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
    //  console.log(req);
    // console.log(req.body);
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  JSON.stringify(books, null, 4);
  return res.status(200).send(" Here is the list of all books <br>" + JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  if (req.params.isbn) {
      const capturedISBN = req.params.isbn;
        return res.status(200).send(books[capturedISBN]);   
  }
  return res.status(400).json({message: "Invalid Request"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  if(req.params.author)
  {
      const author = req.params.author;
      const keys = Object.keys(books);
      let filteredbooks = [];
      for (const key of keys) {
        if (books[key].author === author) {
            filteredbooks.push(books[key]);
          console.log(`Book ${key} is written by ${author}`);
        }
      }
      return res.send(filteredbooks);
  }

  return res.status(400).send("Invalid req");
}

);

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    if(req.params.title)
    {
        const title = req.params.title;
        const keys = Object.keys(books);
        let filteredbooks = [];
        for (const key of keys) {
          if (books[key].title === title) {
              filteredbooks.push(books[key]);
            console.log(`Book ${key} is written by ${title}`);
          }
        }
        return res.send(filteredbooks);
    }
  
    return res.status(400).send("Invalid req");
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    if(req.params.isbn)
    {
        const ISBN = req.params.isbn;
        res.send(books[ISBN].reviews);
    }

  return res.status(300).json({message: "Invalid req"});
});

module.exports.general = public_users;
