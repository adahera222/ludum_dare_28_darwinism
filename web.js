var connect = require('connect');

connect.createServer(
  connect.static('public')
).listen(process.env.PORT || 5000);
