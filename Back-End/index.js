// Important variables
const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')
const mysql = require('mysql');
const { response } = require("express");
const { reset } = require("nodemon");
const e = require("express");

// Database credentials (local at this stage)
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'GoToGro'
})

connection.connect()

// Cors to whitelist front-end website
app.use(cors({
    origin: 'http://localhost:3000'
}));

// Sets parser to json
app.use(bodyParser.json());

// Recieves input, formats into SQL query and submits
app.post("/memberSignup",(req, res) => {
    
    var member = req.body;
    var sql = "INSERT INTO Members (FirstName, LastName, Email, DOB) VALUES (?)";
    var values = [member.firstname, member.lastname, member.email, member.dob];

    connection.query(sql, [values], function(err) {
        if (err) throw err;
     });
});

app.post("/addProduct", (req, res) => {
    var product = req.body;
    var sql = "INSERT INTO Products (Name, Quantity, Category, DateAdded, Capacity) VALUES (?)";
    var values = [product.productName, product.quantity, product.category, product.dateAdded, product.shelfCapacity];

    connection.query(sql, [values], function(err) {
        if (err) throw err;
    });
});

//Source: https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

app.post("/memberSearch",(req, res) => {
    
    var sql = "SELECT * FROM `members` WHERE Email = " + mysql.escape(req.body.email);

    connection.query(sql, function(err, result) {
        if (err) throw err;

        if (Array.isArray(result) && result.length){
            result[0].DOB = formatDate(result[0].DOB);
        }
        res.send(result);        
    });

});

app.post("/memberUpdate",(req, res) => {
    
    var member = req.body.memberID;
    var sql = "UPDATE members SET ? WHERE MemberID = ?";
    var values = [req.body, member.MemberID];

    connection.query(sql, values, function(err) {
        if (err) throw err;
     });
});


app.post("/memberDelete",(req, res) => {
    
    var member = req.body;
    var sql = "DELETE from members WHERE MemberID = ?";
    var values = [member.MemberID];
    connection.query(sql, values, function(err) {
        if (err) throw err;
     });
});

app.post("/productSearch",(req, res) => {
    
    console.log(req.body.name);
    var sql = "SELECT * FROM `products` WHERE Name = " + mysql.escape(req.body.name);

    connection.query(sql, function(err, result) {
        if (err) throw err;
		
		 if (Array.isArray(result) && result.length){
            result[0].DateAdded = formatDate(result[0].DateAdded);
        }
        console.log(result);
        res.send(result);        
    });

});

app.post("/productUpdate",(req, res) => {
	console.log("Update Function");

    var product = req.body;
    var sql = "UPDATE products SET ? WHERE ProductID = ?";
    var values = [req.body, product.ProductID];
    console.log(values)

    connection.query(sql, values, function(err) {
        if (err) throw err;
     });
});


app.post("/productDelete",(req, res) => {
	console.log("Delete Function");

    var product = req.body;
    var sql = "DELETE from products WHERE ProductID = ?";
    var values = [product.ProductID];
    console.log(values)

    connection.query(sql, values, function(err) {
        if (err) throw err;
     });
});

// multi delete for unpopular products
app.post("/unpopularProducts", (req, res) => {
    var product = req.body;
    var currentDate = new Date();

    var sql = "SELECT * FROM (SELECT ProductID, MAX(TransactionDate) AS latestDate, DATEDIFF(?, MAX(TransactionDate)) AS dateDifference FROM transactions GROUP BY ProductID) as transactRes WHERE dateDifference > 28 AND ProductID IS NOT NULL";

    connection.query(sql, currentDate, function(err, result){
        if (err) console.log(err);
        else {
            console.log(result);
            res.send(result);
        }
    }
    )
}
)

// delete unpopular items
app.post("/deleteMultipleProducts", (req, res)=> {
    var transaction = req.body;

    // update all transactions containing productID to become defected
    var fkeyRemove = "UPDATE transactions SET ProductID = NULL WHERE ProductID IN (?)";
    var deleteProds = "DELETE FROM products WHERE ProductID = ?";

    // foreach entry in result, push productID to new array
    transaction.forEach(element => {
        if (element.ProductID == null){
            console.log("Null ProductID skipped.")
        }
        else{
            connection.query(deleteProds, element.ProductID, function(err, result){
                if (err) throw err;
                else {
                    console.log("Products successfully deleted.");
                }
            }
            )
        }
    });
    

    // transactions defect attempt
    // connection.query(fkeyRemove, values, function(err, result){
    //     if (err) throw err;
    //     else{
    //         // if success, delete unpopular products
            
    //     }
    // })
})

// Transactions
app.post("/addTransaction", (req, res) => {

    console.log(req.body)

    var transaction = req.body;
    // insert + update statements (assuming multistatement = false)
    var sql = "INSERT INTO Transactions (MemberID, ProductID, ProductQuantity, TransactionDate) VALUES (?)";
    var values = [transaction.memberID, transaction.productID, transaction.quantity, transaction.transactionDate];
   
    // quantity check
    var check = "SELECT Quantity FROM products WHERE ProductID = " + mysql.escape(transaction.productID);

    // Make query to check quantity, if valid - proceed to INSERT 
    connection.query(check, function(err, result) {
        if (err) throw err;
        var qty = result[0].Quantity;
        
        // check stock availability
        if (qty >= transaction.quantity){
            connection.query("UPDATE products SET Quantity = Quantity - ? WHERE productID = ?", [transaction.quantity, transaction.productID], function(err){
                if (err) throw err;
                else{
                    // insert into dbms
                    connection.query(sql, [values], function(err){
                        if (err) throw err;
                    })  
                }
            })   
        }
    });
});

app.post("/returnAllProducts",(req, res) => {
    var sql = "SELECT * FROM `products`";

    connection.query(sql, function(err, result) {
        if (err) throw err;
		    res.send(result);
    });
});

app.post("/transactCheck", (req, res) => {

    var check1 = "SELECT * FROM Members WHERE MemberID = ?";
    var check2 = "SELECT * FROM Products WHERE ProductID = ?";

    var values1 = [req.body.memberID];
    var values2 = [req.body.productID];

    connection.query(check1, values1, function(err, result) {
        if (err) throw (err)
        if(result == "") {
            res.statusMessage = "Error! Member not found";
            return res.send();
        }
    })

    connection.query(check2, values2, function(err, result) {
        if(result == "") {
            res.statusMessage = "Error! Product not found";
            return res.send();
        }
        else {
            res.statusMessage = "Success!";
            return res.send();
        }
    })
})
	
app.post("/transactSearch",(req, res) => {
    
    var sql = "SELECT * FROM `transactions` WHERE memberID = ?";
    var values = [req.body.memberID];
 
    connection.query(sql, values, function(err, result) {
        if (err) throw err;
        res.send(result);        
    });
});

// Update Quantity Function
function updateQuantity(productValues) {

    // Format SQL and update Product Entry
    function insertSQL(productID, newQuantity) {
        var productSQL = "UPDATE products SET Quantity = ? WHERE productID = ?";
        var updateValues = [newQuantity, productID];

        // Execute query
        connection.query(productSQL, updateValues, function(err) {
            if (err) throw (err);
        });
    }

    console.log("test " + productValues)
    
    // Check to ensure quantity does not fall below 0
    var checkSQL = "SELECT * FROM Products WHERE ProductID = ?";
    var checkValues = productValues;

    // No need for error checking - already handled in previous function
    connection.query(checkSQL, checkValues, function(err, result) {
        if (err) throw (err);
        // Calculate new quantity by adding difference
        var newQuantity = (result[0].Quantity + productValues[0]);

        // If negative, set to 0
        if(newQuantity < 0)
            newQuantity = 0;

        insertSQL(productValues[1], newQuantity);
     })
}

app.post("/transactUpdate",(req, res) => {

    // Generate appropiate JSON Object
    var obj = {
        "memberID" : req.body.memberID,
        "productID" : req.body.productID,
        "productQuantity" : req.body.quantity,
        "transactionDate" : req.body.transactionDate
    }

    // Transaction ID
    var transactionID = req.body.values.TransactionID;

    // Variables for update
    var sql = "UPDATE Transactions SET ? WHERE TransactionID = ?";
    var values = [obj, transactionID];

    // SQL variables for validation
    var check1 = "SELECT * FROM Members WHERE MEMBERID = " + mysql.escape(obj.memberID);
    var check2 = "SELECT * FROM Products WHERE ProductID = " + mysql.escape(obj.productID);

    // Variable for current date (used to determine whether quantity needs updating)
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();

    // Assign date in SQL formatting
    today = yyyy + '-' + mm + '-' + dd;

    // Checks whether supplied Member ID is valid 
    connection.query(check1, function(err, result) {
        if(result == "") {
            res.statusMessage = "Error! Member not found";
            return res.send();
        }
    }) 
    
    // Checks whether supplied Product ID is valid
    connection.query(check2, function(err, result) {
        if(result == "") {
            res.statusMessage = "Error! Product not found";
            return res.send();
        }
    })

    // Send query and appropiate message to user 
    connection.query(sql, values, function(result) {
       if(result != "") {
            res.statusMessage = "Update was succesful";
            res.send();
            // Only change product quantity if transaction was today:
            if(today === obj.transactionDate) {

                // Alter quantity as required
                if(req.body.values.productID == parseInt(obj.ProductID)) {
                    // Calculate difference between old and new quantities 
                    var calculation = req.body.values.ProductQuantity - obj.productQuantity;

                    // Post changes to database
                    var productValues = [calculation, obj.productID];
                    updateQuantity("same id", productValues);
                }
                else {
                    // The updated transaction has changed the product that the member purchased. Thus, we need to reset
                    // the original alteration and then change the new product's stock count:

                    // Restore old stock
                    var oldProductValues = [req.body.values.ProductQuantity, req.body.values.ProductID];
                    updateQuantity("first call", oldProductValues);

                    // Remove new stock
                    var newProductValues = [-Math.abs(obj.productQuantity), obj.productID];
                    updateQuantity("second call", newProductValues);
                }
            return true;
        }    
    }
    else {
        res.statusMessage = "Error! Check connection to server";
        return res.send();
    } }); 
});

// Transaction Delete Function
app.post("/transactDelete",(req, res) => {

    console.log(req.body)
   // If transaction is not empty 
    var transaction = req.body.values;
    var sql = "DELETE from Transactions WHERE TransactionID = ?"
    var values = [transaction.TransactionID];
    var productValues = [transaction.ProductID, transaction.ProductQuantity];

    console.log(productValues);

    // Firstly, fix quantities 
    updateQuantity(productValues);

    // Then, delete transaction 
    connection.query(sql, values, function(err) {
        if (err) throw (err)
    })
})

// Generate information for Sales Trends Report
app.post("/getSalesTrends", (req, res) => {

    if(req.body.Category === "all") {

        var sql = "SELECT Transactions.ProductID, Transactions.ProductQuantity, Products.Name, Products.Category FROM Transactions INNER JOIN Products ON Transactions.ProductID = Products.ProductID AND Transactions.TransactionDate BETWEEN ? AND ?";
        var values = [req.body.date1, req.body.date2];

        connection.query(sql, values, function(err, result) {
        if (err) throw (err)
        else
            var answer = [result, values]
            if(result.length === 0) 
                res.send(["empty"]);
            else
                res.send(answer);
        }) 
    }
    else {
        var sql = "SELECT Transactions.ProductID, Transactions.ProductQuantity, Products.Name, Products.Category FROM Transactions INNER JOIN Products ON Transactions.ProductID = Products.ProductID AND Transactions.TransactionDate BETWEEN ? AND ? AND Products.Category = ?";
        var mainValues = [req.body.date1, req.body.date2, req.body.Category];
        var values = [req.body.date1, req.body.date2];

        connection.query(sql, mainValues, function(err, result) {
            if (err) throw (err)
            else
                var answer = [result, values]

                if(result.length === 0)
                    res.send(["empty"]);
                else
                    res.send(answer);
            }) 
    }
})

// Fetch Categories For Sales Trends
app.post("/getCategories", (req, res) => {

    var sql = "SELECT Category FROM Products";

    connection.query(sql, function(err, result) {
        if (err) throw (err)
        else
            res.send(result);
    })
})

// Indicates server has initialised 
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});