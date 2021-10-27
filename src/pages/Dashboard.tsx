import React from 'react'
import moment from 'moment';

import { Header, Loading } from '../components';

import { Divider, Tabs, Button, message, Empty } from 'antd';
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
    const [selectedMeals, setSelectedMeals] = React.useState<string[]>([]);
    
    const [menu, setMenu] = React.useState<Menu[]>();

    const init = async () => {
        const savedUser: any = utils.loadUser();

        loadMenu();

        try{
            if(savedUser){
                const user: User = await firebase.getDocument("users", savedUser.id);
                if(user){
                    setUser(user);
                    setAuthed(true)
    
                    if (user.card){
                        const cardBalance: number = await api.getCardBalance(user.card);
                        setCardBalance(cardBalance);
                    }

                    const userSelectedMeals: any[] = await firebase.findDocuments("selectedMeals", "user", user.id);
                    setSelectedMeals(userSelectedMeals.map((meal: any) => meal.id))
                }
            }
        } catch(error){}

        setLoadingProfile(false);
    }

    const loadMenu = async () => {
        const menu: Menu[] = await api.getMenu(user?.location || config.DEFAULT_LOCATION)
        setMenu(menu);
    }

    const onDishSelect = async (dish: Dish) => {
        if (!authed || !user){
            message.warning("You need to login in order to select dishes.")
            return;
        }
        
        const id = utils.fetchID(dish.Image);

        if (selectedMeals.includes(id)){
            const myMeals: any[] = await firebase.findDocuments("selectedMeals", "id", id, true)
            
            myMeals.forEach(async (doc: any) => {
                if (doc.data().id === id){
                    await firebase.deleteDocument("selectedMeals", doc.id)
                }
            })
            
            setSelectedMeals([...utils.removeFromList(selectedMeals, id)])
        } else {
            await firebase.addDocument("selectedMeals", { time: new Date().getTime(), id, user: user?.id })
            .then(() => { setSelectedMeals([...utils.addToList(selectedMeals, id)]) })
            .catch((error: any) => console.log(error))
        }
        
    }

    React.useEffect(() => {
        init();
    }, [])

    if (loadingProfile) return <Loading />

    return (
        <>
        <Header user={user} authed={authed} loading={loadingProfile} cardBalance={cardBalance} />
        <div className="page">
            <Tabs type="card" className="tabs" animated centered size="small">
                {menu?.map((menu: Menu) => 
                    <Tabs.TabPane tab={utils.translateWeekDay(menu.Name)} key={menu.Name}>
                        {menu.Dishes.length? menu.Dishes.map((dish: Dish, i: number) => <>
                            {i !== 0 && <Divider key={i} />}
                            <div className="row dish-menu" key={utils.fetchID(dish.Image)}>
                                <img src={dish.Image} alt="dish" className="dish-image" />
                                <div className="col">
                                    <span className="dish-name">{utils.combineItemName(dish.Items)}</span>
                                    <div className="row">
                                        <span className="dish-price">Students: {dish.PriceStudents}€</span>
                                        <span className="dish-price">Staff: {dish.PriceStaff}€</span>
                                        <span className="dish-price">Guests: {dish.PriceGuests}€</span>
                                    </div>
                                    
                                    {selectedMeals.includes(utils.fetchID(dish.Image))?
                                       <Button className="button to-select selected" onClick={() => onDishSelect(dish)}>Remove</Button>  
                                    :   <Button className="button to-select" onClick={() => onDishSelect(dish)}>Select</Button>                                  
                                    }                                
                                </div>
                            </div>
                            </>
                        ) : <Empty description="Looks like mensa is closed this day 🥲" />
                        
                        }
                    </Tabs.TabPane>
                )}
            </Tabs>
        </div>
        </>
    )
}

export default Dashboard;