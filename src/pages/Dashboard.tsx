import React from 'react'

import { Header } from '../components';

import { Divider, Tabs, Button } from 'antd';
import { Dish, Menu, User } from '../types';

import firebase from '../api/firebase';
import api from '../api';
import utils from '../utils';
import config from '../config';

const Dashboard = () => {
    const [loadingProfile, setLoadingProfile] = React.useState<boolean>(true);
    const [authed, setAuthed] = React.useState<boolean>(false);
    const [user, setUser] = React.useState<User>();
    const [cardBalance, setCardBalance] = React.useState<number>();
    
    const [menu, setMenu] = React.useState<Menu[]>();

    const init = async () => {
        const savedUser: any = utils.loadUser();
        if(savedUser){
            const user: User = await firebase.getDocument("users", savedUser.id);
            if(user){
                setUser(user);
                setAuthed(true)

                if (user.card){
                    const cardBalance: number = await api.getCardBalance(user.card);
                    setCardBalance(cardBalance);
                }
            }
        }

        loadMenu();

        setLoadingProfile(false);
    }

    const loadMenu = async () => {
        const menu: Menu[] = await api.getMenu(user?.location || config.DEFAULT_LOCATION)
        setMenu(menu);
    }

    const onDishSelect = (dish: Dish) => {

    }

    React.useEffect(() => {
        init();
    }, [])

    if(!user) return null

    return (
        <>
        <Header user={user} authed={authed} loading={loadingProfile} cardBalance={cardBalance} />
        <div className="page">
            <Tabs type="card" className="tabs" animated centered size="small">
                {menu?.map((menu: Menu) => 
                    <Tabs.TabPane tab={utils.translateWeekDay(menu.Name)} key={menu.Name}>
                        {menu.Dishes.map((dish: Dish, i: number) => <>
                            {i !== 0 && <Divider />}
                            <div className="row dish-menu">
                                <img src={dish.Image} alt="dish" className="dish-image" />
                                <div className="col">
                                    <span className="dish-name">{utils.combineItemName(dish.Items)}</span>
                                    <div className="row">
                                        <span className="dish-price">Students: {dish.PriceStudents}€</span>
                                        <span className="dish-price">Staff: {dish.PriceStaff}€</span>
                                        <span className="dish-price">Guests: {dish.PriceGuests}€</span>
                                    </div>
                                    <Button className={`button to-select ${dish.selected? "selected": ""}`} onClick={() => onDishSelect(dish)}>{dish.selected? "Selected" : "Select"}</Button>                                    
                                </div>
                            </div>
                            </>
                        )}
                    </Tabs.TabPane>
                )}
            </Tabs>
        </div>
        </>
    )
}

export default Dashboard;