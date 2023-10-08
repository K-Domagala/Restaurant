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
  const longBooking = (req.query.longBooking == 'true')
  let times = []
  let seats = []
  let timesString = []
  let open = false
  let full = false

  const storeInfo = await getStoreInfo(storeId, date.getDay())
  const closeTime = convertToSeconds(storeInfo.closeTime)
  const openTime = convertToSeconds(storeInfo.openTime)
  const capacity = storeInfo.capacity

  for(let i = openTime; i < closeTime; i+=30){
    times.push(i)
  }

  times.forEach((time) => {
    timesString.push(convertToTime(time));
  })

  times.forEach((element) => {
    seats.push(capacity)
  })

  if(times.length > 0){
    open = true
  }

  let bookings = await checkBookingAvailability(storeId, date);
  bookings.forEach((item) => {
    console.log(item)
    let time = convertToSeconds(item.booking_start)
    let index = times.indexOf(time)
    seats[index] -= item.sum;
    seats[index+1] -= item.sum;
    if(item.long_booking){
      seats[index+2] -= item.sum
    }
  })

  for(let i = 0; i < seats.length - 2; i++){
    if(longBooking && i<seats.length-2){
      seats[i] = Math.min(seats[i], seats[i+1], seats[i+2])
    } else {
      seats[i] = Math.min(seats[i], seats[i+1])
    }
  }

  if(longBooking){
    timesString = timesString.slice(0, -2)
    seats = seats.slice(0, -2)
  } else {
    timesString = timesString.slice(0, -1)
    seats = seats.slice(0, -1)
  }

  res.json({
    times: timesString,
    seats,
    open,
    full
  })
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
  let formatedDate = new Date(date);
  console.log(formatedDate)
  if(!storeId || !date || !selectedTime || !numOfGuests || !longBooking || !name || !phoneNumber){
    res.json({msg: 'Fill in every field', class: 'error'})
  } else {
    createBooking({storeId, formatedDate, selectedTime, numOfGuests, longBooking, name, phoneNumber})
    .then(() => res.json({msg: 'Booking placed'}))
    .catch((e) => res.json({msg: 'Something went wrong', class: 'error', error: e}))
  }
})

app.listen(port, () => {
    console.log('Server started on port ' + port);
})