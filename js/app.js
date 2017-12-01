var app = angular.module('mainApp', []);
app.controller('MainController', function($scope,$http){

  $scope.user = {  'id'             : ''
                  ,'username'       : ''
                  ,'password'       : ''
                  ,'first_name'     : ''
                  ,'last_name'      : ''
                  ,'dob'            : ''
                  ,'address'        : ''
                  ,'bonds_current'  : []
                  ,'bonds_past'     : []
                  ,'ventures'       : []
                  ,'isInValidCred'    : false
                  ,'login'          : function(){
                                        var payload = {
                                          'username': this.username,
                                          'password': this.password
                                          };
                                          var url = "/login";
                                          $http.post(url, payload).then(function(response){
                                            var data = response.data.data;
                                            var datalen = data.length;
                                            if(datalen == 1){
                                              this.id = data.user_id;
                                              $scope.user.isInValidCred = false;
                                              window.open("/market","_self");
                                            }
                                            else{
                                              $scope.user.isInValidCred = true;
                                              console.log('Invalid Cred : '+$scope.user.isInValidCred);

                                            }

                                          },
                                          function(response){
                                            console.log(JSON.stringify(response));
                                          });
                                    }
                  ,'signup'         : function(){
                                          console.log($scope.user);
                                          url = "/registerUser";
                                          var payload={
                                            "firstname"    : this.first_name,
                                            'lastname'     : this.last_name,
                                            "dob"          : this.dob,
                                            "addr"         : this.address,
                                            'username'     : this.username,
                                            'password'      : this.password
                                          };
                                          $http.post(url, payload).then(
                                            function(response){
                                              console.log(JSON.stringify(response));
                                            },
                                            function(response){
                                              console.log(JSON.stringify(response));
                                            }
                                          );
                                    }
                  ,'registerSME'    : function(){}
                  ,'buyBond'        : function(){}

                };


 /*$scope.venture = {
                    'id'      : '',
                    'name'    : '',
                    'address' : '',
                    'ico_present' : '',
                    'next-installment'  : '',
                    'next_due_date'     : '',
                    'auction_present'   : '',
                    'credit_score'      : '',
                    'total_credit_amount' : ''
 };
 $scope.bond    = {
                    'amount'        : '',
                    'rate'          : '',
                    'tenure'        : '',
                    'ico_id'        : '',
                    'venture_name'  : '',
                    'venture_id'    : '',
                    'credit_score'  : ''
                   };
 $scope.ico     = {
                    'id'            : ''
                    'amount'        : '',
                    'rate'          : '',
                    'tenure'        : '',
                    'bonds_released': '',
                    'bonds_sold'    : '',
                    'credit_score'  : '',
                    'venture_id'    : '',
                    'venture_name'  : '',
                    'open_date'     : '',
                    'close_date'    : '',

 }*/
 /*function market_auction = {
                          'user_id' : '',
                          'bonds'   : [],
                          'buyBond' :  function(bond){},
                          'getBonds': function(){}
 };*/
 $scope.login = function(){};
 $scope.signup = function(){};
 $scope.registerSME = function(){};
 $scope.createICO  = function(venture_id){};

});

app.controller('MarketCtrl', function($scope, $http){
  $scope.market = {
                    'user'  : {},
                    'bonds' : [],
                    'buy'   : function(bondId){

                              var userId = $scope.market.user.id;
                              //$scope.market.user.bonds.push($scope.market.bonds[bondIndx]);

                              buyBondInServer(bondId,userId);
                    },
                    'initMarket' : function(){
                      console.log("initializing market")
                                    getPresentUserDetails(getBondListForMarket);

                    },



  };
  var buyBondInServer = function(bondId, userId){
    var payload = { 'bondId' : bondId,
                    'userId' : userId};
    var url = "/buyBond";
    $http.post(url,payload).then(
      function(response){
          var bondIndx = $scope.market.bonds.findIndex(x => x.id == bondId);
          $scope.market.bonds.splice(bondIndx,1);
    },
    function(response){

    });
  }
  var getPresentUserDetails = function(callback){
    var userObj = {};
    var userid = 1;
    url = "userDetails?id="+userid;
    $http.get(url).then(function(response){
      var data = response.data.data;
      console.log(JSON.stringify(data));
      $scope.market.user = data[0];
      console.log(JSON.stringify($scope.market.user));
      callback();
    },
    function(response){
      console.log(response);
    });
    return userObj;
  }
var getBondListForMarket = function(){
    var userObj = $scope.market.user;
    url = "/bonds?id="+userObj.id;
    console.log("UESR OBJ:"+JSON.stringify(userObj));
    $http.get(url).then(function(response){
      var data = response.data.data;
      console.log(JSON.stringify(data));
      $scope.market.bonds = data;

      for(var i in $scope.market.bonds){
        $scope.market.bonds[i].amount /= $scope.market.bonds[i].bondNum;
      }
    },
    function(response){
      console.log(response);
    });
    /*var userid = userObj.id;
    var bondList = JSON.parse(getBondListFromServer(userid));
    return bondList;*/
}
var getUserDetailsFromServer = function(userid){
  var user = {'id'    : userid,
              'firstname'   : 'Ratul',
              'lastname'    : 'Bhattacharjee',
              'dob'         : '1992-01-01',
              'address'     : 'Bangalore',

              };
  return JSON.stringify(user);
}
var getBondListFromServer = function(userid){
  var bondList = [{
                    'amount'        : '1000',
                    'rate'          : '14',
                    'tenure'        : '5',
                    'ico_id'        : '1',
                    'venture_name'  : 'Nike Inc',
                    'venture_id'    : '1',
                    'credit_score'  : '4.5'
                    },
                    {
                      'amount'        : '12000',
                      'rate'          : '10',
                      'tenure'        : '2',
                      'ico_id'        : '2',
                      'venture_name'  : 'Google Inc',
                      'venture_id'    : '2',
                      'credit_score'  : '4.8'
                    },
                    {
                      'amount'        : '5000',
                      'rate'          : '12',
                      'tenure'        : '3',
                      'ico_id'        : '3',
                      'venture_name'  : 'Apple Inc',
                      'venture_id'    : '3',
                      'credit_score'  : '4.9'
                    }];
        return JSON.stringify(bondList);
}

});
app.controller('userCtrl', function($scope, $http){
  $scope.user = {'id'         : '',
                 'firstname'  : '',
                 'lastname'   : '',
                 'dob'        : '',
                 'address'    : '',
                 'ventures'   : [],
                 'bonds'      : []
                };
  var userid = 1;
  $scope.initializeUser = function(){
    getUserDetailsFromServer(userid);
  };
  $scope.populateVentureModal = function(ventureid){

    var url = '/getVentureDetails?id='+ventureid;
    $http.get(url).then(
      function(response){
        $scope.ventureDetails = response.data.data[0];
        console.log('Venture details :: '+JSON.stringify($scope.ventureDetails));
      },
      function(response){

      });
  };
  $scope.addICO = function(){
    var url = '/addIco';
    var payload = {
      'amount': $scope.newico.amount,
      'rate'  : $scope.newico.rate,
      'tenure' : $scope.newico.tenure,
      'instnum' : $scope.newico.newico.installments,
      'bondnum' : $scope.newico.newico.bondno
    };
    $http.post(url, payload).then(
      function(response){
        console.log(JSON.stringify(response));
      },
      function(response){
        console.log(JSON.stringify(response));
      });
  };
  var getUserDetailsFromServer = function(userid){
    var url = "/userDetails?id="+userid;
    console.log("Getting user's details from server");
    $http.get(url).then(function(response){
      console.log('Got user response');
      $scope.user = response.data.data[0];
      console.log("Getting user's ventures details from server");
       var vurl = '/getUserVentures?id='+userid;
       console.log("ventures url:"+vurl);
       $http.get(vurl).then(function(vres){
           $scope.user.ventures = vres.data.data;
           var iurl = '/getUserInvestments?id='+userid;
           console.log("Getting user's investment details from server");
           $http.get(iurl).then(
                    function(ires){
                      $scope.user.bonds = ires.data.data;
                      console.log("USER :: "+JSON.stringify($scope.user));
                    },
                    function(ires){
                      console.log(ires);
                    });
         },
         function(vres){
           //console.log(JSON.stringify(vres));
         });
    },
    function(response){
      console.log(response);
    });
  };

});
app.controller('registerSME', function($scope, $http){
  $scope.sme = {};

  $scope.addSME = function(){
    console.log($scope.venture);
    url = "/registerSME";
    var payload={
      "name"    : $scope.venture.name,
      "regno"   : $scope.venture.regno,
      "ownerid" : $scope.user.userid
    };
    $http.post(url, payload).then(
      function(response){
        console.log(JSON.stringify(response));
      },
      function(response){
        console.log(JSON.stringify(response));
      }
    );

  };

});
app.controller('registerUser', function($scope, $http){
  $scope.user = {};
  /*$scope.addUser = function(){
    console.log($scope.user);
    url = "/registerUser";
    var payload={
      "name"    : $scope.venture.name,
      "dob"     : $scope.venture.dob,
      "addr"    : $scope.venture.addr
    };
    $http.post(url, payload).then(
      function(response){
        console.log(JSON.stringify(response));
      },
      function(response){
        console.log(JSON.stringify(response));
      }
    );
  };*/
});
app.controller('verifyUser', function($scope,$http){
  $scope.loginUser = function(){

    var payload = {
      'username': $scope.user.username,
      'password': $scope.user.password
      };
      var url = "/login";
      $http.post(url, payload).then(function(response){
        var data = response.data.data;
        var datalen = data.length;
        if(datalen == 1){
          $scope.user.userid = data.user_id;
          window.open("/market","_self");
        }
        console.log(JSON.stringify(data.data.length));
      },
      function(response){
        console.log(JSON.stringify(response));
      });
  };

});
app.controller('marketPlaceController', function($scope, $http){
  $scope.IOCBonds = [];
  $scope.getIOCBonds = function(){
    var url = "/bonds";
    $http.get(url).then(function(response){
      var data = response.data.data;
      for( var itemIndx in data){
        var dataItem = data[itemIndx];
        var bondInst = {};
        bondInst.TotalNumber = dataItem.ico_bonds_released;
        bondInst.LeftNumber = dataItem.ico_bonds_sold;
        bondInst.value = (dataItem.ico_amount / dataItem.ico_bonds_released);
        bondInst.interest = dataItem.ico_interest;
        bondInst.tenure = dataItem.ico_tenure;
        bondInst.venture = dataItem.venture_id;
        bondInst.rating = 5;
        $scope.IOCBonds.push(bondInst);
      }
      /*$scope.IOCBonds.TotalNumber = data.ico_bonds_released;
      $scope.IOCBonds.LeftNumber = data.ico_bonds_sold;
      $scope.IOCBonds.value = (data.ico_amount / data.ico_bonds_released);
      $scope.IOCBonds.interest = data.ico_interest;
      $scope.IOCBonds.tenure = data.ico_tenure;
      $scope.IOCBonds.venture = data.venture_id;
      $scope.IOCBonds.rating = 5;*/
    },
    function(response){
      console.log(JSON.stringfy(response));
    });
  };
});
