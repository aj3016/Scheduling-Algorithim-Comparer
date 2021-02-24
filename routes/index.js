var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/dcatch',function(req,res,next){

  var n = req.body.length;
  //console.log(n);

  var id=[];
  var at=[];
  var bt=[];
  var prio=[];
  var quantum = req.body[n-1];

  for(i=0;i<n-1;i++)
  {
    id.push(req.body[i].id);
    at.push(req.body[i].at);
    bt.push(req.body[i].bt);
    prio.push(req.body[i].pr)
  }

  /* console.log(id);
  console.log(at);
  console.log(bt);
  console.log(prio);
  console.log(quantum); */


  module.exports.n = n;
  module.exports.id = id;
  module.exports.at = at;
  module.exports.bt = bt;
  module.exports.prio = prio;
  module.exports.quantum = quantum;
  
  res.send('empty');
});

module.exports = router;
