const express=require("express");
const path=require("path");
const medicalFormService=require('./service/medicalFormService');
var session=require('express-session');
var cookieParser = require('cookie-parser');

const app=express();

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('!@#$%^&*()전은수는예쁘다'));
app.use(session({
  name:'JES_SID',
  timeout:30,
  resave:false,
  saveUninitialized:false,
  secret:'!@#$%^&*()전은수는예쁘다',
  cookie:{
    httpOnly:true,
    secure:false   
  }
  }));


const contactFormService=require('./service/contactFormService');

app.use(express.static(path.join(__dirname,"/public")));
app.use(express.json());

app.post('/contactForm', function (req, res) {   

    var name=req.body.name;
    var id=req.body.id;
    var pw=req.body.pw;    
    var message=req.body.message;
    console.log(name,id,pw,message);
    if(name && id && pw){
        contactFormService.contactFormInsertOne(res,name,id,pw,message);  
           
    }else{
        res.send('Failure');
    }
  });


app.post('/medicalForm', function (req, res) {
    
    var name=req.body.name;
    var ssn=req.body.ssn;
    var addr=req.body.addr;
    var email=req.body.email;
    var visitDate=req.body.visitDate;
    var desease=req.body.desease;
    var deseaseCode=req.body.deseaseCode;
    var content=req.body.content;
    var docterName=req.session.docterName;
    var docterNo=req.session.docterNo;
    console.log(name,ssn,addr,email,visitDate,desease,deseaseCode,content,docterName,docterNo);
    if(name && ssn && docterName && docterNo){
        medicalFormService.medicalFormInsertOne(name,ssn,addr,email,visitDate,desease,deseaseCode,content,docterName,docterNo);
        res.send('진료 확인서 two phase 저장 완료');
    }else{
        res.send('Failure');
    }


  });

app.get('/medical_report_req', function (req, res) {    
    console.log(req.session);
    if(req.session.loginedID){
      res.sendFile(path.join(__dirname+'/public/medical_report.html'));
    }else{
      res.sendFile(path.join(__dirname+'/public/html/login.html'));
    }
  });

app.post('/login', function (req, res) {    
    var id=req.body.id;
    var pw=req.body.pw;   
    console.log(id,pw);
    if(id && pw){
      contactFormService.login(req,res,id,pw);        
    }else{
        res.send('id와 pw를 입력하세요');
    }
  });


app.listen(7777,function(){
    console.log("7777 server ready...");
});

