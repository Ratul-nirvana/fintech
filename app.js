var express = require('express');
var app = express();
var _port = 9090;
var path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql');



///************************ MIDDLEWARES **************************//
app.use(bodyParser.json());
app.use(express.static('../fintech-api-app'));
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'Ratuldb@123',
  database : 'db_incubatrix'
});
connection.connect();


//*************************POST ROUTES ***********************//

app.post('/registerSME', addVenture); // call using name, ownerid, regno
app.post('/registerUser',addUser);
app.post('/login', loginUser);
app.post('/buyBond', function(req, res){
  var userId = req.body.userId;
  var bondId = req.body.bondId;
  var parameters = [bondId,userId];
  var query = 'INSERT INTO `db_incubatrix`.`tbl_bond_ownership`'+
              '(`ico_id`,'+
              '`owner_id`,'+
              '`sold_on`)'+
              'VALUES'+
              '(?,?,curdate())';
  connection.query(query,parameters,function(err, rows, fields){
    if(err) throw err;
    var TransactionID = rows.insertId;
    var upQuery = "UPDATE `db_incubatrix`.`tbl_ico` SET `ico_bonds_sold` = `ico_bonds_sold`+1 WHERE `ico_id` = ?";
    var upParam = [userId];
    connection.query(upQuery,upParam,function(ex,rowx,fieldx){
      var result = {'status' : 200, 'data':TransactionID};
      res.send(JSON.stringify(result));
    });

  });

});
app.post('/submitICO', addICO );
app.post('/login', loginUser);




//***************************** GET ROUTES ********************************///


app.get('/user', function(req,res){
  res.sendFile(path.join(__dirname+'/user.html'));
});
app.get('/users', getUsers);
app.get('/userDetails', getUserDetails);
app.get('/registerInvestor', function(req, res){
  res.sendFile(path.join(__dirname+'/registerUser.html'));
});
/*app.get('getBondsforAuction',getBondListForAuction);*/

app.get('/registerSME', function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname+'/index.html'));
});
app.get('/bonds', getBonds);
app.get('/market',function(req,res){
  res.sendFile(path.join(__dirname+'/market.html'));
});
app.get('/ventures',getVentures);
app.get('/getVentureDetails',function(req, res){
  var ventureid = req.query.id;
  console.log("Getting details for venture with id : "+ventureid);
  var query = 'select venture_id as id, venture_name as vname, venture_registration_date as regdate, venture_credit_score as cscore, venture_govt_reg_id as regid  from `db_incubatrix`.`tbl_venture` where venture_id = ?';
  var parameters = [ventureid];
  connection.query(query, parameters, function(err, rows, fields){
    if(err) throw err;
    var result = {'status':200, 'data':rows};
    res.send(JSON.stringify(result));
  });
});
app.get('/registerVenture',function(request, response){
  response.sendFile(path.join(__dirname+'/registerVenture.html'));
});

app.get('/getUserVentures', function(req, res){
  var userid = req.query.id;
  console.log("Getting ventures details from server with id:"+userid);
  var query = 'select 	venture_id as id'+
		                    ',venture_name as name'+
                        ',venture_registration_date as regdate'+
                        ',venture_credit_score as credit '+
                        ',venture_govt_reg_id as regid '+
                'from `db_incubatrix`.`tbl_venture` where venture_owner_id = ?';
  var parameters = [userid];
  connection.query(query, parameters, function(err, rows, fields){
    if(err) throw err;
    var result = {'status':200, 'data':rows};
    res.send(JSON.stringify(result));

  });
});
app.get('/getUserInvestments', function(req,res){
  var userid = req.query.id;
  console.log('Geeting user investments for id : '+userid);
  var query = 'select 	A.ico_id as bondid,A.sold_on as solddate,B.ico_amount as amount,B.ico_interest as rate,B.ico_tenure as tenure,B.ico_installment_number as installment from `db_incubatrix`.`tbl_bond_ownership` A inner join `db_incubatrix`.`tbl_ico` B on A.ico_id = B.ico_id where owner_id = ?';

  var parameters = [userid];
  connection.query(query, parameters, function(err, rows, fields){
    if(err) throw err;
    var result = {'status':200, 'data':rows};
    res.send(JSON.stringify(result));

  });
});




//************************ START APP **********************/
app.listen(9090, function(){
  console.log('App running on 9090');
});



/*************************** FUNCTION REPOSITORY *****************************//
function loginUser(req,res){
  console.log('Got login request');
  var username = req.body.username;
  var password = req.body.password;
  var queryvalues = [username,password];
  var query = "select * from tbl_user where user_email_id=? and password=?";
  connection.query(query,queryvalues, function(err, rows, fields){
    if(err) throw err;
    var result = {'status':200, 'data':rows};
    res.send(JSON.stringify(result));
  });
}
function getUsers(req, res){
  var query = "select * from tbl_user";
  connection.query(query, function(err, rows, fields){
    if(err) throw err;
    var result = {'status':200, 'data':rows};
    res.send(JSON.stringify(result));
  });
}
function getUserDetails(req, res){

  var userid = req.query.id;
  console.log('Get user details for id='+userid);
  var parameters = [userid];
  var query = 'select 	 user_id as id,'+
		                    'user_email_id as username,'+
                        'user_first_name as firstname,'+
                        'user_last_name as lastname,'+
                        'user_dob as dob,'+
                        'user_address as address '+
              'from `db_incubatrix`.`tbl_user` where user_id=?';
  connection.query(query, parameters, function(err, rows, fields){
    if(err) throw err;
    var result = {'status':200, 'data':rows};
    console.log("Sending result: "+JSON.stringify(result));
    res.send(JSON.stringify(result));
  });
}
function getVentures(req, res){
  var ventureId = req.query.id;
  var query = "";
  var queryValues = [ventureId];
  if(ventureId == undefined){
    console.log("no venture id given");
    var query="select * from tbl_venture";
  }
  else{
    console.log("Venture id:"+ ventureId);
    var query = "select* from tbl_venture where venture_id = ?";
  }
  connection.query(query, queryValues, function(err, rows, fields){
    if(err){
      throw err;
    }
    var result = {'status':200,'data':rows};
    res.send(JSON.stringify(result));
  });
}
function addUser(req, res){
  console.log('adding investor');
  var user = {};
  var username = req.body.username;
  var password = req.body.password;
  var userfirstname = req.body.firstname;
  var userlastname = req.body.lastname;
  var userdob = req.body.dob;
  var useraddr = req.body.addr;
  var query = 'insert into tbl_user (user_email_id,user_first_name,user_last_name,user_dob,user_address,password) values(?,?,?,?,?,?)';
  var queryValues = [username,userfirstname,userlastname,userdob,useraddr,password];
  connection.query(query,queryValues,function(err, rows, fields){
    if(err) throw err;
    var result = {'status' : 200, 'data':rows.insertId};
    res.send(JSON.stringify(result));
  });
}

function addVenture(req, res){
  var venture = {};
  venturename = req.body.name;
  ventureregdate = '2017-11-26';
  ownerid = req.body.ownerid;
  creditscore = 0;
  regno = req.body.regno;
  queryvalue = [venturename,ownerid,creditscore,regno];
  console.log(JSON.stringify(venture));
  var query = "insert into tbl_venture (venture_name,venture_registration_date,venture_owner_id,venture_credit_score,venture_govt_reg_id) values(?,curdate(),?,?,?)"
  connection.query(query,queryvalue, function(err, rows, fields){
    if(err) throw err;
    var result = {'status':200, 'data':rows.insertId};
    res.send(JSON.stringify(result));
  });
}
function addICO(req, res){}
function buyBond(req, res){}

function getBonds(req, res){
  var userid = req.query.id;
  console.log(userid);
  var query = 'select 	A.ico_amount as amount,'+
		          'A.ico_interest as rate,'+
              'A.ico_tenure as tenure,'+
              'A.ico_id as id,'+
              'A.ico_bonds_released as bondNum,'+
              'B.venture_name as venture_name,'+
              'B.venture_id as venture_id,'+
              'B.venture_credit_score as credit_score '+
              'from `db_incubatrix`.`tbl_ico` A inner join `db_incubatrix`.`tbl_venture` B '+
              'on A.venture_id = B.venture_id where B.venture_owner_id <> ? and A.ico_bonds_released > A.ico_bonds_sold'+
              ' and A.ico_id not in (select ico_id from `db_incubatrix`.`tbl_bond_ownership` where owner_id = ?)';
  var parameters = [userid,userid];
  connection.query(query,parameters, function(err, rows, fields){
    if(err) throw err;
    var result = {'status':200, 'data':rows};
    res.send(JSON.stringify(result));
  });
}

/*
post /registerSME
post /registerInvetor
post /login
post /buyBond
post /submitICO
get /
get /

*/
