import firebase from '../api/firebase';
import { Button } from 'antd';
import { useHistory } from 'react-router';

import { message, Alert } from 'antd';
import { User } from '../types';
import utils from '../utils';

const Auth = () => {

    const history: any = useHistory();

    const onLogin = async () => {
        const loginRes: any = await firebase.onGoogleLogin();
        if (!loginRes) return;

        postProcessLogin(loginRes.user);
    }

    const postProcessLogin = async (user: any) => {
        const { email, uid, displayName, photoURL }: any = user;

        const document: any = await firebase.getDocument("users", uid);

        const newUserData: User = {
            email,
            id: uid,
            name: displayName,
            photo: photoURL,
        }

        if(!document) await firebase.setDocument("users", uid, newUserData)

        utils.saveUser(newUserData);

        message.success(`Welcome, ${displayName}!`)
        history.replace('/dashboard');
    }

    return (
        <div className="page">
            <div className="col container noborder">
                <span className="header">Auth</span>
                <Alert className="alert" type="info" message="We are currently accepting Google authentification only. But don't worry, Google allows certain public information like name and email to be used." />
                <Button className="button google-login" onClick={onLogin}>Login with Google</Button>
                <Button className="button" onClick={() => history.replace("/")}>Back</Button>
            </div>
        </div>
    )
}

export default Auth;


// 3101600