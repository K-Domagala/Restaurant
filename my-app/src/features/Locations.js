import { useEffect, useState } from "react";
import { getLocations } from "../app/util";

export default function Locations () {
    const [locations, setLocations] = useState();
    useEffect(() => {
        getLocations().then(res => setLocations(res.map(locationsMap)));
    }, [])

    const locationsMap = (location) => {
        return (
            <div className="location" key={location.name} style={{ backgroundImage: `url(${location.image})` }} >
                <h1>{location.name}</h1>
                <h1>{location.phone}</h1>
            </div>
        )
    }

    return (
        <div className='main'>
            <div className="locations">
                {locations}
            </div>
        </div>
    )
}