import React from 'reactn';
import styles from './Auth.module.css';
import { Row, Col, Form, Input, Button, message, notification } from 'antd';
import gStyles from '../../styles.module.css';
import axios from 'axios';

export default class AuthPage extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            loginMode: true,
            passwordRecovery: false,
            submitting: false,
            errors: {},
        }
    }

    onFinish = (values) => {
        this.setState({submitting:true})
        if(this.state.passwordRecovery){
            console.log("Recovering password", values);
        } else if(this.state.loginMode){
            axios.post('/login', values)
            .then(res => {
                message.success("Logged in!");
                this.setState({submitting:false});
                this.setGlobal({token: `Bearer ${res.data.token}`});
                this.redirect();
            })
            .catch(error => {
                console.log(error)
                message.error(error.response.data.message);
                this.setState({submitting:false})
            })
        } else {
            axios.post('/signup', values)
            .then(res => {
                message.success("Account created!");
                this.setState({submitting:false});
                this.setGlobal({token: `Bearer ${res.data.token}`});
                this.redirect();
                setTimeout(() => this.openNotification(), 5000)
            })
            .catch(error => {
                console.log(error)
                message.error(error.response.data.message);
                this.setState({submitting:false})
            })
        }
    }

    openNotification = () => {
        notification['success']({
          message: 'Welcome to Mensa.Today!',
          duration: 10,
          description:
            'Now you need to add your Mensa card before you start using this service. You can do it in "Cards" Tab:)',
          onClick: () => {
            console.log('Notification Clicked!');
          },
        });
      };

    redirect = async () => {
        localStorage.setItem('token', this.global.token);
        this.props.history.push('/');
    }

    render() {
        return (
            <Row>
                <Col span={8}></Col>
                <Col span={8}>
                    <div className={styles.container}>
                        <span className={gStyles.header}>{this.state.loginMode? "Log in": "Create an account"}</span>
                        <Form
                            name="authForm"
                            initialValues={{ remember: true }}
                            onFinish={this.onFinish}
                            className={styles.form}
                        >
                        
                        {this.state.loginMode? (
                            <>
                            <Form.Item
                            name="data"
                            
                            rules={[{ required: true, message: 'Please input your email, username or card ID' }]}
                            >
                                <Input placeholder="Email, username or card ID" className={styles.input}/>
                            </Form.Item>

                            <Form.Item
                                name="password"
                                
                                rules={[{ required: true, message: 'Please input your password' }]}
                            >
                                <Input.Password placeholder="Password" className={styles.input}/>
                            </Form.Item>

                            <Button onClick={() => this.setState({passwordRecovery: true})} htmlType="submit" type="text">I forgot my password</Button>
                            </>
                        ) : (
                            <>
                            <Form.Item
                            name="email"
                            
                            rules={[{ required: true, message: 'Please input your email' }]}
                            >
                                <Input placeholder="Email" className={styles.input}/>
                            </Form.Item>

                            <Form.Item
                                name="username"
                                
                                rules={[{ required: true, message: 'Please input your username' }]}
                            >
                                <Input placeholder="Username" className={styles.input}/>
                            </Form.Item>

                            <Form.Item
                                name="password"
                                
                                rules={[{ required: true, message: 'Please input your password' }]}
                            >
                                <Input.Password placeholder="Password" className={styles.input}/>
                            </Form.Item>

                            <Form.Item
                                name="cardID"
                                
                                rules={[{ required: true, message: 'Please input your card number' }]}
                            >
                                <Input placeholder="Card ID" className={styles.input}/>
                            </Form.Item>
                            </>
                        )}

                        
                        <Button onClick={() => this.setState({loginMode: !this.state.loginMode})} type="text">{this.state.loginMode? "I do not have an account" : "I already have an account"}</Button>

                        <Form.Item>
                            <Button
                            type="primary"
                            htmlType="submit"
                            loading={this.state.submitting}
                            >
                            {this.state.loginMode? "Login" : "Create"}
                            </Button>
                        </Form.Item>
                        </Form>
                    </div>
                </Col>
                <Col span={8}></Col>
            </Row>
        )
    }
}
