var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  // res.send('respond with a resource');
  console.log(1);
  console.log(req.params);
  res.send("User Id: " + req.params["id"])
});

module.exports = router;
