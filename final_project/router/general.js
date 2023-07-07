const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}


public_users.post("/register", (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    //  console.log(req);
    // console.log(req.body);
    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

let myPromise = new Promise((resolve, reject) => {

    try {
        JSON.stringify(books, null, 4);
        resolve("Promise resolved")
    }
    catch (e) {
        reject("Promise rejected");
    }
});



// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    myPromise.then((successMessage) => {
        console.log("From Callback " + successMessage)
    }).catch((err) => {
        // if the promise is rejected, log the error
        console.error(err);
    });
    return res.status(200).send(" Here is the list of all books <br>" + JSON.stringify(books, null, 4));
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    if (req.params.isbn) {
        const capturedISBN = req.params.isbn;

        res.status(200).send(books[capturedISBN]);
    }
    return res.status(400).json({ message: "Invalid Request" });
});

// define a helper function that returns a promise to get the book details by ISBN 
function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
        const book = books[isbn]; 
        if (book) { // if the book exists, resolve the promise with the book 
            resolve(book);
        }
        else { // if the book does not exist, reject the promise with an error 
            reject(new Error("Book not found"));
        }
    });
}


// Using async await 
public_users.get("/isbn/:isbn", async function (req, res) { // Write your code here 
    if (req.params.isbn) {
        const capturedISBN = req.params.isbn;
        try { // use the await keyword to wait for the book details 
            const book = await getBookByISBN(capturedISBN); // if the book exists, send it as JSON
            res.status(200).json(book);
        } catch (err) { // if there is an error, send it as text 
            res.status(404).send(err.message);
        }
    } else { return res.status(400).json({ message: "Invalid Request" }); }
});


// // Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//     //Write your code here
//     if (req.params.author) {
//         const author = req.params.author;
//         const keys = Object.keys(books);
//         let filteredbooks = [];
//         for (const key of keys) {
//             if (books[key].author === author) {
//                 filteredbooks.push(books[key]);
//                 console.log(`Book ${key} is written by ${author}`);
//             }
//         }
//         return res.send(filteredbooks);
//     }

//     return res.status(400).send("Invalid req");
// }

// );  

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    //Write your code here
    if (req.params.author) {
        const author = req.params.author;
        const keys = Object.keys(books);
        let promises = [];
        let selectedBooks = [];
        for (const key of keys) {
            promises.push(new Promise((resolve, reject) => {
                if (books[key].author === author) {
                    resolve(books[key]);
                    selectedBooks.push(books[key]);
                    console.log(`Book ${key} is written by ${author}`);
                } else {
                    reject(`Book ${key} is not written by ${author}`);
                }
            }));
        }
        res.send(selectedBooks);
        // try {
        //     let filteredbooks = await Promise.all(promises);
        //     console.log(selectedBooks);
        //     return 
        // } catch (error) {
        //     console.log(error);
        //     return res.status(500).send(error);
        // }
    }

    return res.status(400).send("Invalid req");
}

);



// Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//     if (req.params.title) {
//         const title = req.params.title;
//         const keys = Object.keys(books);
//         let filteredbooks = [];
//         for (const key of keys) {
//             if (books[key].title === title) {
//                 filteredbooks.push(books[key]);
//                 console.log(`Book ${key} is written by ${title}`);
//             }
//         }
//         return res.send(filteredbooks);
//     }

//     return res.status(400).send("Invalid req");
// });

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    if (req.params.title) {
      const title = req.params.title;
      const keys = Object.keys(books);
      let filteredbooks = [];
      try {
        for (const key of keys) {
          // Use a promise to check if the book title matches
          let match = await new Promise((resolve, reject) => {
            if (books[key].title === title) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
          // If the promise resolves to true, push the book to the filtered array
          if (match) {
            filteredbooks.push(books[key]);
            console.log(`Book ${key} is written by ${title}`);
          }
        }
        // Send the filtered array as the response
        return res.send(filteredbooks);
      } catch (error) {
        // Handle any errors that may occur
        console.error(error);
        return res.status(500).send("Something went wrong");
      }
    }
  
    return res.status(400).send("Invalid req");
  });
  

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    if (req.params.isbn) {
        const ISBN = req.params.isbn;
        res.send(books[ISBN].reviews);
    }

    return res.status(300).json({ message: "Invalid req" });
});






module.exports.general = public_users;
