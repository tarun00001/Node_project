const mongoose = require("mongoose");
var fs = require('fs');
var path = require('path');
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Resource = require("../models/resourceModel");
// const Glucose = require("../models/glucoseModel");
const Device = require("../models/deviceModel");

const {auth,restrictTo} = require("../middleware/auth");

require("dotenv");

// registration route
router.post("/register", async (req, res) => {
  const {
    firstName,
    lastName,
    gender,
    country,
    password,
    phone,
    email,
    
  } = req.body;

  try {
    //     const userExist = await User.findOne({email})
    // if(userExist){
    //     return res.status(409).json({error: "Email already exist"});
    // }
    const user = new User({
      firstName,
      lastName,
      gender,
      country,
      password,
      cpassword,
      phone,
      email,
      role,
    });

    const userRegister = await user.save();

    res.status(201).json({ message: "User registered successfully" });
    // console.log(`${user} user registered successfully`)
    // console.log(userRegister);
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: 0, message: err.message });
  }
});

// login route
router.post("/login", async (req, res) => {
  // console.log(req.body);
  // res.status(201).json({message: "User login successfully"});
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please fill the Credentials!" });
    }

    const userLogin = await User.findOne({ email });

    const isPasswordMatch = await bcrypt.compare(password, userLogin.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Credentials do not get matched" });
    }

    const payload = { _id: userLogin._id };
    jwt.sign(
      payload,
      "MYNAMEISTARUNSINGHCHAUDHARYANDILIVESINGHAZIABAD",
      { expiresIn: "10d" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token, message: "User login successfully" });
      }
    );
  } catch (err) {
    console.log(err);
  }
});

  router.get("/getAllUsers", auth, async (req,res) => {
   const user = await User.find().populate({
       path: "devices",
       select: "battery reservoir"
   })
   res.json({user})
})

router.get("/getDevices", auth, async (req,res) => {
    const devices = await Device.find().populate({
        path: "users",
        select: "firstName lastName"
    }).select("reservoir");
    res.json({devices})
 })

router.get("/getDevicesUser", auth, async (req,res) => {
    const device = await Device.find({users: {$elemMatch: {$eq: req.user._id}}})
    res.json({device})
})

router.get('/getUsers',async(req,res) => {
  const user = await User.find();
  res.json({user});
})

router.get('/getUserById/:id',async(req,res) => {
  const user = await User.findById(req.params.id).populate("devices");
  res.json({user});
})

router.post('/createNewResource', async(req,res) => {
  const {projectName,description,modelType} = req.body;
  //console.log(req.body)
  try {
    // for generating array and its fields
    let arr = [], typeCodeArr = [];
  for(let i=0;i<modelType.length;i++){
    //console.log(`{"typeCode": "00${i+1}", "typeName": "${modelType[i]}"}`);
    var resource = {"typeCode": `00${i+1}`, "typeName": modelType[i]};
    //console.log(resource)
    arr.push(resource);
    typeCodeArr.push(`"00${i+1}"`);
  }
  console.log(arr)
  console.log(typeCodeArr)
  // for generating random alphanumeric values
  generateCod =  function() {
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXZ0123456789";
  let cod = '';
  for (var i = 0; i < 8; i++) {
    cod += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return cod;
}

// to generate collection name based on projectname

const collectionName = projectName.split(' ').join('_').concat("_collection").toLowerCase();
 
    const data = new Resource({projectName, description, uniqueCode: generateCod(), modelType:arr, collectionName});

    // function to create a dynamic schema
  
    const collection = `
      const mongoose = require('mongoose');

const ${collectionName}Schema =new mongoose.Schema({
  deviceId: {
      type: String,
      required: true
  },
  logMsg: {
      type: String,
      required: true
  },
  logGeneratedDate: {
    type: Date,
    required: true
  },
  logType: {
    type: String,
    enum: ['error','warn','debug','info']
},
  modelType: {
    type: String,
    enum: [${typeCodeArr}]
  }
 
},{timestamps: true });

module.exports = mongoose.model("${collectionName}", ${collectionName}Schema);`
 
    fs.writeFile(path.join(__dirname, `../models/ ${collectionName}.js`), collection, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
  });

    const displayData = await data.save();
  res.status(201).json({ message: "Resource created successfully" + "" + displayData });
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: 0, message: err.message });
  }
  
})

router.post(`/logGenerate/:uniqueCode`,async(req,res) => {
console.log(req.params.uniqueCode)
  const model = await Resource.findOne({uniqueCode: req.params.uniqueCode});
 console.log(model)
 const collectSchema = model.collectionName;
 console.log(collectSchema);

 const collect = require("../models/collectSchema");
})
  module.exports = router;