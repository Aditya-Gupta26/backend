const express = require("express");
const models = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
var sqlite3 = require('sqlite3').verbose();
//import {useRouter} from "next/router";

var db = new sqlite3.Database(':memory:');
const tokens = [];
db.serialize(function() {
  db.run("CREATE TABLE mytable (id)");
  
});
import { response } from "../app";
//import { json } from "sequelize/types";
import { authCheck } from "../middlewares/authCheck";
const router = express.Router();
router.post("/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await models.User.create({
      username,
      password: hashedPassword
    });
    res.json(user);
  } catch (error) {
    res.status(400).json(error);
  }
});
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  const users = await models.User.findAll({ where: { username } });
  const user = users[0];
  const response = await bcrypt.compare(password, user.password);
  if (response) {
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({ token });
  } else {
    res.status(401).json({});
  }
});
router.post("/createrepo", async (req,res,next) => {
  //function accessData(){
    console.log("Reached");
    db.each("SELECT * FROM mytable", function(err, row) {
      //if(error) return console.log(err.message);
      console.log(row.id);
      console.log(`token ${row.id}`);
    var result = await axios.post('https://api.github.com/user/repos',
      {"name": "Sample_Repo", 
      "auto_init": true, 
      "private": false, 
      "gitignore_template": "nanoc" },
      { "Authorization" : `token ${row.id}`});
      //console.log(result2);
  });
  

   //}
   //accessData()


 
})

router.get("/githublogin",  async (req, res, next) => {
  var store = req.query['code'];
  //console.log(req.query['code']);
//  session_code = req.env['rack.request.query_hash']['code'];
  //console.log(session_code);
  
  var result = await axios.post('https://github.com/login/oauth/access_token',
                          {"client_id" : "e6181d75a38d1659e72a",
                           "client_secret" : "68990773445af6e8c00e9382e1314658ddb23a72",
                           "code" : store,},
                           {"Accept":"application/json"})
 // console.log(result);
 var access_token = result.data;
 //let length = access_token.length;
 console.log(access_token);
 var access_token2 = access_token.split("&")[0].slice(13,);
 function insertData(){
  console.log("Data insertion started");
   var insertQuery = db.prepare("INSERT INTO mytable VALUES (?)");
   insertQuery.run(access_token2);
   console.log("Data inserted");
   
   insertQuery.finalize();
 }
 insertData();
 


 console.log(access_token2);
 //console.log(result);
 //<button id="Redirect" type="submit">Create Repository</button>
//  let button = document.getElementById('Redirect');

// button.onclick = function(e) {
//     e.preventDefault();

//     // Replace localhost and the folder name
//     // based on your setup
//     location.href = 'http://localhost:3000/user/createrepo';
// }
  
}) 
router.post("/changePassword", authCheck, async (req, res, next) => {
  const { password } = req.body;
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const id = decoded.userId;
  const hashedPassword = await bcrypt.hash(password, 10);
  await models.User.update({ password: hashedPassword }, { where: { id } });
  res.json({});
});
router.get("/currentUser", authCheck, async (req, res, next) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const id = decoded.userId;
  const users = await models.User.findAll({ where: { id } });
  const { username, gitHubUsername } = users[0];
  res.json({ username, gitHubUsername });
});

module.exports = router;