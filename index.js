// node.js application to calculate pi as a Azure Function App
// P.Burghouwt HHS 2019
// <URL>?n=<number of decimals>  (default=20 if no n specified)
// returns pi and the calculation time as json data
// calculation derived from https://github.com/MikeMcl/decimal.js/issues/9 (Bailey-Borwein-Plouffe)

const Decimal = require("decimal.js");
Decimal.config({precision: 10});
function pi(n) {    
    var p16 = new Decimal(1);
    var pi = new Decimal(0);
    var precision=n;
    Decimal.precision=precision;
    var one = new Decimal(1);
    var two = new Decimal(2);
    var four = new Decimal(4);
    var k8 = new Decimal(0);
    for (var k = new Decimal(0); k.lte(precision); k = k.plus(one)) {
      var f = four.div(k8.plus(1))
          .minus(two.div(k8.plus(4)))
          .minus(one.div(k8.plus(5)))
          .minus(one.div(k8.plus(6)));
      pi = pi.plus(p16.times(f));
      p16 = p16.div(16);
      k8 = k8.plus(8);
    }
    return pi;
}

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    if (req.query.n || (req.body && req.body.n)) { 
        var n=(req.query.n || req.body.n)
    }
    else {
        var n=20
    };
    var StartTime = new Date()
    var calculatePi = pi(n)
    var EndTime = new Date() - StartTime 
    context.res = {
             status: 200,   
             body: "{\"PI\":\n {\n  \"decimals\": " + (n) + ",\n  \"ms\": " + JSON.stringify(EndTime) + ",\n  \"value\": " + (calculatePi.toString()) + "\n }\n} "
    };
};
