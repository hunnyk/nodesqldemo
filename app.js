var mysql=require('mysql');
const fs=require('fs');

const express=require('express');
var app=express();
//var multer=require('multer');
const path=require('path');
const cors = require('cors');
app.use(cors());
app.use(express.static(__dirname+'/public'));
var port=3000;

const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const fileup=require("express-fileupload");
app.use(fileup());

//Database connection
const mc = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'regdb'
});

mc.connect((err)=> {
    if (err) throw err;
    console.log("Connected!");

});

//Add
app.post('/add',(req, res)=> {
    if(req.files.profilepic==undefined)
        return res.status(400).send('no found');
    var f=req.files.profilepic;
    //console.log(f);
    var uploadpath=path.join(__dirname+"/public/uploads/"+f.name);
    //console.log(uploadpath);
    f.mv(uploadpath);
    var name = req.body.name;
    var address = req.body.address;
    var sql = "insert into customers(name,address,flag,profilepic) values ('" + name + "','" + address + "','1','" + f.name + "')";
    mc.query(sql, (error, results, fields) => {
        if (error) throw error;
            return res.send(results);
        });
    });

// app.post('/add', (req, res)=> {
//     var postData  = req.body;
//     mc.query('INSERT INTO customers SET ?', postData, (error, results, fields) => {
//         if (error) throw error;
//         return res.send(results);
//        // return res.send({ error: false, data: results, message: 'New customer has been created successfully.' });
//     });
// });

//Delete

app.get('/delete/:id',(req,res)=>{
    var id=req.params.id;
    var flag=0;
    var sql="UPDATE customers SET flag='"+flag+"' where id="+id;
    mc.query(sql,(error, results, fields)=>{
        if (error) throw error;
        return res.send(results);
    });
});


// Retrieve all todos
app.get('/getall', (req, res)=> {
    mc.query('SELECT * FROM customers where flag="1"', (error, results, fields) => {
        if (error) throw error;
        return res.send(results);
    });
});


app.get('/getbyid/:id', (req, res) => {
    var id=req.params.id;
    mc.query('select * from customers where id=?', id, (error, results, fields) => {
        if (error) throw error;
        return res.send(results);
    });
});

//Edit

app.put('/edit/:id', (req, res) => {
    var id=req.params.id;
    // console.log(id);
    mc.query('UPDATE customers SET name=?,address=? where id='+id, [req.body.name,req.body.address],(error, results, fields) => {
         if (error) throw error;
         return res.send({error:false,data:results,message:'Customer has been updated succesfully'});
    });
});

//Port
app.listen(port,()=>{
    console.log("server listening port "+port);
});
