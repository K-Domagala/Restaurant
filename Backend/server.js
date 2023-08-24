const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const express = require('express');
const { getMenu, getLocDetails, checkBookingAvailability, storeIdQuery, getStoreInfo, getStores} = require('./postgresUtil');
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(session({
  secret: 'secrets',
  resave: true,
  saveUninitialized: true
}));
app.use(cookieParser('secrets'))

app.get('/menu', async (req, res) => {
    console.log('recieved menu request')
    menu = (await getMenu()).rows;
    starters = menu.filter((item) => {
      return item.item_type == 'starter'
    })
    main = menu.filter((item) => item.item_type=='main');
    dessert = menu.filter((item) => item.item_type=='dessert');
    returnMenu = [{
      type: 'Starters',
      items: starters
    },{
      type: 'Main',
      items: main
    },{
      type: 'Dessert',
      items: dessert
    }]
    res.json({data: returnMenu})
})

app.get('/bookings', async (req, res) => {
  const storeId = req.query.store;
  const date = new Date(req.query.date)

  const bookingArray = getStoreInfo(storeId, date.getDay())

  let value = {
    times: ['01:30:00', '02:30:00', '03:30:00', '05:50:00'],
    seats: [57, 58, 23, 121]
  }
  checkBookingAvailability(storeId, date);
  res.json(value)
})

app.get('/storeID', async (req, res) => {
  const store = req.query.store
  const id = await storeIdQuery(store)
  res.json({id})
})

app.get('/storeOpenTimes', async (req, res) => {
  const [storeId, day] = req.query
  console.log('Store ID recieved: ' + storeId)
})

app.get('/storeList', async (req, res) => {
  let storesArray = []
  const stores = await getStores();
  stores.forEach((entry) => {
    storesArray.push(entry.restaurant_name)
  })
  console.log('Stores: ')
  console.log(storesArray)
  res.json({storesArray})
})

app.listen(port, () => {
    console.log('Server started on port ' + port);
})