import React from 'react';

import { Button } from 'antd';
import { useHistory } from 'react-router';

const Header = ({ authed, user, cardBalance, loading }: any) => {
    const history: any = useHistory();

    return (
        <div className="row header-container">
            <span className="header-brand">MENSATODAY</span>

            <div className="header-auth-container">
                {cardBalance && <Button loading={loading} className="button" type="ghost">Card balance: {cardBalance >= 0? `${cardBalance}€` : "Error" }</Button> }
                {authed && user && <Button loading={loading} className="button" type="ghost" onClick={() => history.push(`/user/${user.id}`)}>{user.name}</Button>}
                {(!authed || !user) && <Button loading={loading} className="button" type="ghost" onClick={() => history.push('/auth')}>Login</Button>}
            </div>
        </div>
    )
}

export default Header;