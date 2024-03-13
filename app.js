const express = require("express");
const app = express();
const mysql = require("mysql2");

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection( 
   { 
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'webdev', // this is the NAME of your DB 
      port: '8889',       // this PORT for MAMP only
   }
);

connection.connect( (err) => { 
    if(err) {
        return console.log(err.message)
    }else{
        return console.log(`Connection to local MySQL DB.`)
    };
 });

 app.get('/', (req, res) => {

    // READING DATA FROM THE TABLE
    // 1) this burgersSQL stores an SQL statement
    // 2) The response from the MySQL DB is stored in the result parameter.
    const burgersSQL = ` SELECT id, b_name, price FROM web_dev_burgers; `;

    connection.query(burgersSQL, (err, result) => {
        if(err) throw err;
        res.render("menu", { burgerlist: result } );
    });

    // OLD CODE
    //res.render("menu");
});

// FILTER MENU
// We want to be able to allow a user to arrange the data by price, alphabetical order and even type. 
// To achieve this type of functionality we can use a query parameter within the URL to send a sort keyword to influence the SQL query.
app.get('/filter', (req, res) => {
    const filter = req.query.sort;
   

    const burgersSQL=`SELECT id, b_name, price 
    FROM web_dev_burgers ORDER BY ${filter}; `;

    connection.query(burgersSQL, (err, result)=>{
        if(err) throw err;
        res.render('menu', { burgerlist : result } );
    });
});


// ADDING IN AN ADMIN POV (not secure)
// used for the <form> element, ie when user's can add/create something new, eg a new burger
// **This is connected to the add.ejs file
app.get('/admin/add', (req, res) => {
   
    res.render("add");
 
});

// this makes sure that the new record is STORED somewhere
app.post('/admin/add', (req, res) => {

    const burgerN = connection.escape(req.body.burgername); //get data from <input type="text" name="burgername">
    const descriptB = connection.escape(req.body.descript);
    const ingredsB = connection.escape(req.body.ingreds);
    const priceB = connection.escape(req.body.burgerprice);
    
        const InsertBurgersSQL =`INSERT into web_dev_burgers 
                                 (b_name, description, ingredients, price, img) 
                                  VALUES 
                                 ("${burgerN}", "${descriptB}","${ingredsB}",${priceB},"default.jpg"); `;
        

        connection.query(InsertBurgersSQL, (err, result)=>{
            if(err) throw err;
            res.send(result);
        });

});


app.listen(3000, () => {
    console.log('Server is listening on localhost:3000');
});

 