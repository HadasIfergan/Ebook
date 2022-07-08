const express = require('express');

const stripe = require('stripe')('sk_test_51IwV2xANzeSsGQkpPYpaUF6Z7xGvzspGnG4d9BaFtaoUZCr9YJ6l6iJT4NCU3j2oo4p7d7WbMXoxy4eJT6SrQPzS00NccOporJ');

const bodyParser = require('body-parser');

//dynamically generates your HTML page to be readable
const exphbs = require('express-handlebars');

//initialize the app
const app = express ();


//handlebars middleware - from the express-handlebars npm documentation
//the layout that wraps around all our views should be called main.handlebars
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//set static folder - the public folder is set as static folder where we can put imgs and stylesheets
app.use(express.static(`${__dirname}/public`));


//app.js route
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/carousel', (req, res) => {
  res.sendFile(`${__dirname}/public/carousel.html`);
});

//charge route
app.post('/charge', (req, res) => {
  //25.00 usd
  const amount = 2500;

   
  stripe.customers.create({
    //the stripeEmail pattern we see on the gitbash to get the actual email value
    email: req.body.stripeEmail,
    //the source is stripeToken as we see on gitbash
    source: req.body.stripeToken
  })
  //we get the customer back, the stripe.charges.create and get back an object of the customer with the info in it
  .then(customer => stripe.charges.create({
    amount,
    description: 'E-book Website',
    currency: 'usd',
    customer: customer.id
  }))
  .then(charge => res.render('success'));
});

const port = process.env.PORT || 6040;

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});

