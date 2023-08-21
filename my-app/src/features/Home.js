import { NavLink } from "react-router-dom";
import { getMenu } from "../app/util";

export default function Home () {
    return (
        <div className='main'>
            <h1>Welcome to the Screws & Nails</h1>
            <h3>The official restaurent of the NailRepair store. </h3>
            <h3>If you want to book a table, you can either use our <NavLink to='/book' className='link'>Book Table</NavLink> feature online, or contact the restaurant directly. Contact details for restaurants are listed on the <NavLink to='/locations' className='link'>Locations</NavLink> tab.</h3>
            <NavLink to='/about'><button className="about-button">About us</button></NavLink>
            <h3>We currently have 3 restaurants in great locations. They all share the same menu so you can always get exactly what you want.</h3>
        </div>
    )
}