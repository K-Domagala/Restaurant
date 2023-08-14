import { useEffect, useState } from "react"
import { getMenu, getMenuTest } from "../app/util";

export default function Menu () {
    const [menu, setMenu] = useState();
    const menuMap = (category) => {
        const type = <h2 className="type">{category.type}</h2>;
        const items = category.items.map((item) => {
            return (<div key={item.name} className='item'>
                <h3 className="item-name">{item.name}</h3>
                <h4 className="item-description">{item.description}</h4>
                <h3 className="item-price">{(item.price/100).toLocaleString("en-UK", {style:"currency", currency:"GBP"})}</h3>
            </div>)
        })
        return (
            <div key={category.type}>
                {type}
                {items}
            </div>
        )
    }

    useEffect(() => {
        getMenu().then(res => {
            setMenu(res.map(menuMap))
        });
    }, []);

    return (
        <div className='main'>
            <h1>Menu</h1>
            {menu}
            
        </div>
    )
}