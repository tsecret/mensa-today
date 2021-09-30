import React from 'react'

import { Avatar, Button, Spin, Input, message, Divider, Select } from 'antd';
import { useHistory, useParams } from 'react-router';

import { Location, User } from '../types';
import firebase from '../api/firebase';
import api from '../api';

let cardTimer: any;

const Profile = () => {
    const [user, setUser] = React.useState<User>();
    const [loading, setLoading] = React.useState<boolean>(true);
    const [submitting, setSubmitting] = React.useState<boolean>(false);

    const [locations, setLocations] = React.useState<Location[]>();
    const [cardBalance, setCardBalance] = React.useState<number>();

    const history: any = useHistory();
    const { id }: any = useParams();

    const init = async () => {
        const user: User = await firebase.getDocument("users", id);
        if (user) setUser(user);
        
        loadLocations();

        setLoading(false);
    }

    const onCardChange = (id: string) => {
        if (user) setUser({ ...user, card: id })
        clearTimeout(cardTimer)

        cardTimer = setTimeout(async () => {
            const cardBalance: number = await api.getCardBalance(id);
            if(cardBalance) setCardBalance(cardBalance)
        }, 2000)
    }

    const onLocationChange = (code: string) => {
        if (user) setUser({ ...user, location: code })
    }

    const onSave = async () => {
        setSubmitting(true);
        await firebase.updateDocument("users", id, user)
        setSubmitting(false);
        message.success("Profile saved")
    }

    const loadLocations = async () => {
        const locations: Location[] = await api.getLocations();
        setLocations(locations);
    }

    React.useEffect(() => {
        init();
    }, [])

    const render = () => {
        if(loading){
            return <Spin size="large" />
        } else if (!user){
            return <span>Error loading user</span>
        } else {
            return <div className="page">
            <div className="col container">
                <span className="header">Profile</span>

                <Avatar src={user.photo} className="profile-avatar" />

                <span className="profile-name">{user.name}</span>
                
                <Divider />

                <span>Choose your Mensa location</span>
                <Select placeholder="Select Mensa location" className="select" defaultValue={user.location} onChange={onLocationChange} loading={!locations}>
                    {locations && locations.map((location: Location) => <Select.Option key={location.Code} value={location.Code}>{location.Name}</Select.Option>)}
                </Select>

                <Divider />


                <span>Enter your Mensa card ID</span>
                <Input defaultValue={user.card} className="input" onChange={(e: any) => onCardChange(e.target.value)} placeholder="1234567"/>
                {cardBalance && <span>Card balance: {cardBalance}€</span>}

                <Divider />
                
                <Button className="button" onClick={onSave} loading={submitting} >Save</Button>
                <Button className="button" onClick={() => history.push('/dashboard')}>Back</Button>
            </div>
        </div>
        }
    }


    return <div className="page">
        {render()}
        </div>
}

export default Profile;