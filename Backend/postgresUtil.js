const client = require('./postgres');

const getMenu = async () => {
    const menu = await client.query('SELECT * FROM menu')
    return menu;
}

const getStores = async () => {
    const stores = await client.query('SELECT restaurant_name FROM locations')
    return stores.rows
}

const checkBookingAvailability = async (store, date) => {
    //get bookings using store and date
    const bookings = await client.query(
        `SELECT booking_start,
            long_booking,
            table_size
        FROM bookings
        WHERE restaurant_id = $1
          AND booking_date = $2`,
        [store, date]
    )
    console.log('Bookings: ')
    console.log(bookings.rows)
    
    //bookings format: [{time_slot, duration}]
    // let availability = [{time, slots}]
}

const storeIdQuery = async (store) => {
    const storeQuery = await client.query(
        'SELECT id FROM locations WHERE restaurant_name = $1', [store]
    )
    return storeQuery.rows[0].id;
}

async function getStoreInfo(storeId, day){
    //assign string to get the correct opening and closing times for the day of the week
    let dayOpen;
    let dayClose;
    switch(day){
        case 0:
        dayOpen = 'sun-open'
        dayClose = 'sun-close'
        break;
        case 1:
        dayOpen = 'mon-open'
        dayClose = 'mon-close'
        break;
        case 2:
        dayOpen = 'tue-open'
        dayClose = 'tue-close'
        break;
        case 3:
        dayOpen = 'wed-open'
        dayClose = 'wed-close'
        break;
        case 4:
        dayOpen = 'thu-open'
        dayClose = 'thu-close'
        break;
        case 5:
        dayOpen = 'fri-open'
        dayClose = 'fri-close'
        break;
        case 6:
        dayOpen = 'sat-open'
        dayClose = 'sat-close'
    }
    //run query to get all the details for the store
    const data = (await client.query(
        'SELECT * FROM locations WHERE id = $1',
        [storeId]
    )).rows[0]
    //extract the open time, close time for the day and capacity from the query
    const openTime = data[dayOpen]
    const closeTime = data[dayClose]
    const capacity = data['capacity']
    //return that info
    return({openTime, closeTime, capacity})
}

async function createBooking(info){
    await client.query(
        `INSERT INTO bookings(restaurant_id, booking_date, booking_start, table_size, long_booking, booking_name, phone)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [info.storeId, info.date, info.selectedTime, info.numOfGuests, true, info.name, info.phoneNumber]
    ).then((res) => console.log(res))
    .catch((e) => console.log(e))
}

module.exports = {getMenu, checkBookingAvailability, storeIdQuery, getStoreInfo, getStores, createBooking}