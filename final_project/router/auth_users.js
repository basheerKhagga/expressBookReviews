const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
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
    const username = req.query.username;
    const password = req.query.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password, 
        user: username
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
//   const userName = session.Session.authorization.username;
  const updatedReview = req.query.review;
  const ISBN = req.params.isbn;
  const userName = req.user["user"];
    


  if(userName && updatedReview && ISBN )
  {
      books[ISBN]["reviews"][userName] = updatedReview;
      return res.send("Review updated successfully with userName = " + userName + " <br> updated book is " + JSON.stringify(books[ISBN], null, 4)  );
  }
  return res.status(300).json({message: "Something went wrong"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const ISBN = req.params.isbn;
  const userName = req.user["user"];

  if(userName && ISBN )
  {
    if (books[ISBN]["reviews"][userName])
    {
        delete books[ISBN]["reviews"][userName];
    }
      return res.send("Review deleted successfully with userName = " + userName + " <br> updated book is " + JSON.stringify(books[ISBN], null, 4)  );
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
