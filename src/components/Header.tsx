import React from 'react';

import { Button, Menu, Dropdown } from 'antd';
import { MenuOutlined, SolutionOutlined, ScheduleOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';

const Header = ({ authed, user, cardBalance, loading }: any) => {
    const history: any = useHistory();

    const menu: any = (
        <Menu>
            <Menu.Item icon={<ScheduleOutlined />}>
                <a href="/dashboard">Meals</a>
            </Menu.Item>
            {user && <Menu.Item icon={<SolutionOutlined />}>
                <a href={`/user/${user.id}`}>Profile</a>
            </Menu.Item>}
            {!user && <Menu.Item icon={<SolutionOutlined />}>
                <a href="/auth">Login</a>
            </Menu.Item>}
        </Menu>
    )

    return (
        <div className="row header-container">
            <span className="header-brand">MENSATODAY</span>

            {
                window.innerWidth < 500? 
                    <Dropdown overlay={menu}>
                        <MenuOutlined />
                    </Dropdown>
                :
                <div className="header-auth-container">
                    {cardBalance && <Button loading={loading} className="button" type="ghost">Card balance: {cardBalance >= 0? `${cardBalance}€` : "Error" }</Button> }
                    {authed && user && <Button loading={loading} className="button" type="ghost" onClick={() => history.push(`/user/${user.id}`)}>{user.name}</Button>}
                    {(!authed || !user) && <Button loading={loading} className="button" type="ghost" onClick={() => history.push('/auth')}>Login</Button>}
                </div>
            }

            
        </div>
    )
}

export default Header;