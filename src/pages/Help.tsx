import React from 'react'

import { Button } from 'antd';
import { useHistory } from 'react-router';

const Help = () => {
    const history: any = useHistory();

    return (
        <div className="page">
            <span className="help-header">How to use the app 🤔</span>
            <p className="help-desc">1. First you would need to login with your Google account. This is the only way (for now) to create the account</p>
            <p className="help-desc">2. On your profile page, select your Mensa location and enter Mensa card ID. This is needed to get the correct meal information and card balance</p>
            <p className="help-desc">3. On dashboard page, click on the meals you would like to select and add them to the meal plan.</p>
            <p className="help-desc">4. Whenever you have finished your meal plan (for example, every Sunday). Click Reset button to reset your meal plan and update the card balance.</p>
            <Button className="button" onClick={() => history.push('/dashboard')}><strong>Understood</strong></Button>
        </div>

    )
}

export default Help;