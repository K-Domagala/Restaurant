import Axios from 'axios';

export async function getStores(){
    const response = await Axios({
        method: 'GET',
        withCredentials: true,
        url: 'http://localhost:3001/storeList'
    })
    return response.data.storesArray
}

export async function getMenu(){
    return await Axios({
        method: 'GET',
        withCredentials: true,
        url: 'http://localhost:3001/menu'
    }).then(res => {
        return res.data.data;
    })
}

export function getStoreId(store, setStoreId){
    Axios({
        method: 'GET',
        params: {store},
        withCredentials: true,
        url: 'http://localhost:3001/storeID'
    }).then((res) => {
        setStoreId(res.data.id)
    })
}

export async function getTimeSlotsArray(store, date, longBooking){
    console.log(longBooking)
    const res = await Axios({
        method: 'GET',
        params: {store, date, longBooking},
        withCredentials: true,
        url: 'http://localhost:3001/bookings'
    })
    return res
}

async function getOpenTimes(storeId, date){
    if(!storeId){
        return false;
    }
    const day = date?.getDay();
    const res = await Axios({
        method: 'GET',
        params: {storeId, day},
        withCredentials: true,
        url: 'http://localhost:3001/storeOpenTimes'
    })
    return res.data
}

export async function makeBooking(info){
    const res = await Axios({
        method: 'POST',
        params: info,
        withCredentials: true,
        url: 'http://localhost:3001/createBooking'
    })
    if(res.data.e){
        console.log(res.data.e)
    }
    return res.data
}

export async function getLocations(){
    return new Promise(r => {
        r([
            {
                name: 'Runcorn',
                phone: '07845915786',
                image: "https://via.placeholder.com/300"
            },
            {
                name: 'Birmingham',
                phone: '01925483195',
                image: "https://via.placeholder.com/300"
            },
            {
                name: 'Leeds',
                phone: '01534448564',
                image: "https://via.placeholder.com/300"
            }
        ])
    })
}

export function formatDate(date){
    if(date?.getDay){
        return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
    } else {
        return null;
    }
}

export function formatTime(time){
    const hour = parseInt(time.slice(0, 2)).toString();
    const min = time.slice(3, 5);
    return hour + ':' + min;
}