const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const express = require('express');
const { getMenu, getLocDetails, checkBookingAvailability, storeIdQuery, getStoreInfo, getStores, createBooking, convertToSeconds, convertToTime} = require('./postgresUtil');
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
  let times = []
  let seats = []
  let timesString = []
  const longBooking = true;

  const storeInfo = await getStoreInfo(storeId, date.getDay())
  const closeTime = convertToSeconds(storeInfo.closeTime)
  const openTime = convertToSeconds(storeInfo.openTime)
  const capacity = storeInfo.capacity

  for(let i = openTime; i < closeTime - (longBooking ? 60: 30); i+=30){
    times.push(i)
  }

  times.forEach((time) => {
    timesString.push(convertToTime(time));
  })

  times.forEach((element) => {
    seats.push(capacity)
  })

  let value = {times: timesString, seats}
  checkBookingAvailability(storeId, date);
  res.json(value)
})

app.get('/storeID', async (req, res) => {
  const store = req.query.store
  const id = await storeIdQuery(store)
  res.json({id})
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

app.post('/createBooking', async (req, res) => {
  console.log(req.query)
  const {storeId, date, selectedTime, numOfGuests, longBooking, name, phoneNumber} = req.query;
  if(!storeId || !date || !selectedTime || !numOfGuests || !longBooking || !name || !phoneNumber){
    res.json({msg: 'Fill in every field', class: 'error'})
  } else {
    createBooking({storeId, date, selectedTime, numOfGuests, longBooking, name, phoneNumber})
    .then(() => res.json({msg: 'Booking placed'}))
    .catch((e) => res.json({msg: 'Something went wrong', class: 'error', error: e}))
  }
})

app.listen(port, () => {
    console.log('Server started on port ' + port);
})