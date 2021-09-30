import React from 'react'

import axios from 'axios';
import { Button } from 'antd';
import { useHistory } from 'react-router';

const Home = () => {
    const [locations, setLocations] = React.useState<object[]>();
    const [menu, setMenu] = React.useState<object[]>();

    const history: any = useHistory();

    return (
        <div className="page">
            <span className="home-header">Welcome to Mensa.today! 🍛</span>
            <p className="home-desc">Mensa.today is simple web-based app to make the mensa experience easier.
                It combines multiple features from many third party apps like checking your card balance, mensa meal schedule and other more.
                The main goal of the app is to help users plan their budget.
            </p>

            <p><i>For students by students</i></p>

            <Button className="button" onClick={() => history.push('/dashboard')}><strong>Start</strong></Button>
        </div>

    )
}

export default Home;