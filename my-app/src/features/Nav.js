import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

export default function Nav () {
    const username = useSelector(store => store.user);

    const user = () => {
        if(username){
            return username
        } else {
            return 'Log In'
        }
    }

    return (
        <div className='nav'>
            <NavLink to='/'><h1>Screws & Nails</h1></NavLink>
            <ul>
                <NavLink to='/book'><li>Book Now</li></NavLink>
                <NavLink to='/menu'><li>Menu</li></NavLink>
                <NavLink to='/about'><li>About us</li></NavLink>
                <NavLink to='/locations'><li>Locations</li></NavLink>
                <NavLink to='/user'><li>{user()}</li></NavLink>
            </ul>
        </div>
    )
}