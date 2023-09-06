import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import {getStores, checkTimes, formatDate, formatTime, getStoreId, getBookings, makeBooking} from '../app/util';

export default function Book () {
    const name = useSelector(store => store.name);
    const phoneNumber = useSelector(store => store.phoneNumber);
    const storeMap = (stores) => {
        return stores.map((store) => {
            return (
                <option type={store}>{store}</option>
            )
        })
    }
    const dispatch = useDispatch();
    const [date, setDate] = useState();
    const [stores, setStores] = useState(storeMap(['Loading...']));
    const [selectedStore, setSelectedStore] = useState();
    const [availableTimes, setAvailableTimes] = useState([]);
    const [availableSeats, setAvailableSeats] = useState('');
    const [numOfGuests, setNumOfGuests] = useState('');
    const [duration, setDuration] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [storeId, setStoreId] = useState('1');
    const [confirmation, setConfirmation] = useState({});

    const setName = (e) => {
        dispatch({
            type: 'SET_NAME',
            payload: e.target.value
        })
    }

    const setPhoneNumber = (e) => {
        dispatch({
            type: 'SET_PHONE_NUMBER',
            payload: e.target.value
        })
    }

    useEffect(() => {
        async function getStoreArray(){
            const storeArray = await getStores();
            setStores(storeMap(storeArray));
        }
        getStoreArray()
        // setSelectedStore(res[0])
    }, [])

    useEffect(() => {
        if(storeId && date){
        getBookings(storeId, date?.toJSON()).then(res => {
            setAvailableTimes(res.data.times);
            setAvailableSeats(res.data.seats);
            console.log(res.data)
        }).catch((e) => console.log(e))
        console.log(formatDate(date));
        console.log(date?.toJSON())}
    }, [storeId, date, duration])
    // useEffect(() => {
    //     let newDate = date;
    //     date.setHours(selectedHour);
    // }, [selectedMinute])

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log('Sending info to API:')
        console.log('Store ID: ' + storeId);
        console.log('Date: ' + date);
        console.log('Time: ' + selectedTime);
        console.log('Guests: ' + numOfGuests);
        console.log('Duration: ' + duration)
        console.log('Name: ' + name);
        console.log('Phone number: ' + phoneNumber);
        const details = {storeId, date, selectedTime, numOfGuests, duration, name, phoneNumber}
        makeBooking(details).then((res) => {
            setConfirmation(res)
        })
    }

    const guestSelect = () => {
        const list = [<option value={1}>1 guest</option>]
        for(let i = 2; i <= 20; i++){
            list.push(<option value={i} >{i} guests</option>)
        }
        return list
    }
    
    const updateStore = (e) => {
        const storeID = getStoreId(e.target.value, setStoreId)
        setSelectedStore(e.target.value)
    }

    const timeSelect = () => {
        const list = []
        for(let i = 0; i < availableTimes?.length; i++){
            list.push(<option value={availableTimes[i]}> {formatTime(availableTimes[i])} : {availableSeats[i]} seats available </option>)
        }
        return list
    }

    return (
        <div className='main'>
            <h1>Book a table:</h1>
            <h3>Select a restaurant:</h3>
            {/**Select the restaurant.
             * Value is stored in 'selectedRestaurant' */}
            <div className="selector">
                <select value={selectedStore} onChange={updateStore}>
                    <option value='' disabled selected hidden>Select location</option>
                    {stores}
                </select>
            </div>
            {/**Select the number of guests.
             * Number of guests is stored in 'numOfGuests'*/}
            <div hidden={!selectedStore}>
                <h3>Select number of guests and duration of booking</h3>
                <select value={numOfGuests} onChange={e => setNumOfGuests(e.target.value)}>
                    <option value='' disabled selected hidden>Select number of guests</option>
                    {guestSelect()}
                </select>
            </div>
            {/**Select date of booking.
             * Date is stored in 'date' and is set to todays date as default*/}
            <div hidden={!selectedStore}>
                <h3>Select the date of booking:</h3>
                <Calendar onChange={setDate}/>
            </div>
            <div hidden={!numOfGuests || !date}>
                <h3>Select the duration of booking:</h3>
                <select value={duration} onChange={e => setDuration(e.target.value)}>
                    <option value='' disabled selected hidden>Select duration</option>
                    <option value='1'>1 hour</option>
                    <option calue='1.5'>1 hour 30 minutes</option>
                </select>
            </div>
            <div hidden={!numOfGuests || !date}>
            <   h3>Select the time slot:</h3>
                <select value={selectedTime} onChange={e => setSelectedTime(e.target.value)}>
                    <option value='' disabled selected hidden>Select slot</option>
                    {timeSelect()}
                </select>
            </div>
            <div hidden={!selectedStore || !selectedTime}>
                <h3>Details:</h3>
                <h2 className={confirmation.class}>{confirmation.msg}</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor='name'>Name: </label>
                    <input type='text' id='name' name='name' required defaultValue={name} onChange={setName}/><br />
                    <label htmlFor='phoneNumber'>Phone number: </label>
                    <input type='tel' pattern='^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$' id='phoneNumber' name='phoneNumber' required defaultValue={phoneNumber} onChange={setPhoneNumber}/><br />
                    <button type='submit' disabled={!(selectedStore && date && selectedTime && name && phoneNumber)}>Book</button>
                </form>
            </div>
        </div>
    )
}