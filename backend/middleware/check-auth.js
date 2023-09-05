 const jwt = require("jsonwebtoken");


//middleware is a function which receives the three arguments. It only gets executed when req is received like multer..
 module.exports = (req, res, next) => {
  try{
  const token = req.headers.authorization.split(" ")[1];      //standard convention for tokens Bearer then space and then the value of token which is the 2nd value of array hence [1]
  const decodedToken = jwt.verify(token, "secret_this_should_be_longer");    //secret code added as an argument to check the token verification
  req.userData = { email: decodedToken.email, userId: decodedToken.userId };   //in order to get the id from the token generated from the user...
  next();
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated!"});
  }
 };
