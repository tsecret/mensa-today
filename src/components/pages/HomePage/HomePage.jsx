import React from 'reactn'
import { Menu, Dropdown, Button, Col, Row, Space, Tabs, Empty, Collapse, Modal, Form, Input, message} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import styles from './HomePage.module.css';
import gStyles from '../../styles.module.css';
import axios from 'axios';

const { TabPane } = Tabs;
const { Panel } = Collapse; 

const menu = (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
          1st menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
          2nd menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
          3rd menu item
        </a>
      </Menu.Item>
      <Menu.Item danger>a danger item</Menu.Item>
    </Menu>
);


export class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            loaded: false,
            user: null,
            index: 0,
            addCard: {
                addCardModal: false,
                cardID: null
            }
        }
    }

    async componentWillMount(){
        await axios.get('/user', { params: {id:this.props.token.user_id }})
        .then(res => {
            this.setState({ user: res.data, loaded:true });
        })
        .catch(error => {
            try{
                console.log("ERROR", error.response.data);
            } catch(e){
                console.log("ERROR", error)
            }

        })
    }

    MealsMenu = () => {
        return(
            <div className={gStyles.containerNested}>

            </div>
        )
    }

    // CARD MENU
    CardMenu = () => {
        return(
            <div className={gStyles.containerNested}>
                {this.state.user&&this.state.user.cards.length>0? (
                    <Collapse accordion>
                        {this.state.user.cards.map((card, i) => {
                            return(
                            <Panel header={`Card ${card.id}`} key={i+1}>
                                <p>Balance: </p>
                            </Panel>
                        )})}
                    </Collapse>
                ): (
                    <Empty style={{marginTop: 150 }} image={Empty.PRESENTED_IMAGE_SIMPLE} >
                        <Button onClick={() => this.showModal()}>Add new card</Button>
                    </Empty>
                )}
            </div>
        )
    }

    getBalance = async (id) => {
        var balance;
        await axios.get(`/cardbalance`, { params: {id}})
        .then(res => {
            balance = res.data.balance/100;
        });
        return balance;
    }

    addCardModal = () => {
        return(
            <Modal
                title="Add new card"
                visible={this.state.addCard.addCardModal}
                onCancel={this.handleCancel}
                cancelText="Cancel"
            >
                <div className={styles.card}>
                    <img className={gStyles.card} alt="card" src={require('../../../assets/MensaCard.png')} />
                    <span className={styles.cardNum}><strong>{this.state.addCard.cardID}</strong></span>
                </div>
                <Form
                    name="addCard"
                    initialValues={{ remember: true }}
                    onFinish={this.handleOk}
                    >
                    <Form.Item
                        name="cardID"
                        rules={[{ required: true, message: 'Please input your Card ID' }]}
                    >
                        <Input className={styles.cardInput} placeholder="Card ID" onChange={(e) => this.setState({ addCard: {...this.state.addCard, cardID: e.target.value}})}/>
                    </Form.Item>

                    <Button type="primary" htmlType="submit">Add card</Button>

                </Form>
            </Modal>
        )
    }

    showModal = () => {
        this.setState({ addCard: {...this.state.addCard, addCardModal: true}});
        console.log(this.state)
    };
    
    handleOk = async (values) => {
        axios.post("/addcard", {...values, id: this.props.token.user_id})
        .then((res) => {
            message.success(`Card ${values.cardID} added`);
            this.setState({
                user: {...this.state.user, cards:res.data},
                addCard: {...this.state.addCard, addCardModal: false}
            });
        })
        .catch(error => message.error(error.response.data.message))
    };
    
    handleCancel = e => {
        this.setState({ addCard: {...this.state.addCard, addCardModal: false}});
    };


    render() {
        return (
            <>
            <Row>
                <Col span={8} />
                <Col span={8} className={gStyles.wrapper}>
                    <Space >
                        <span>Home page</span>
                        <Dropdown overlay={menu}>
                            <Button type="text" className="ant-dropdown-link" onClick={e => e.preventDefault()}>tsecret<DownOutlined /></Button>
                        </Dropdown>
                    </Space>
                </Col>
                <Col span={8} />
            </Row>

            <Row>
                <Col span={8}/>
                <Col span={8} className={styles.wrapper}>
                    <>
                    {this.addCardModal()}
                    <Tabs defaultActiveKey="2" centered>
                        <TabPane tab="Meal Plan" key="1">
                            {this.MealsMenu()}
                        </TabPane>
                        <TabPane tab="Cards" key="2">
                            {this.CardMenu()}
                        </TabPane>
                    </Tabs>
                    </>
                </Col>
                <Col span={8}/>
            </Row>
            </>
        )
    }
}

export default HomePage
