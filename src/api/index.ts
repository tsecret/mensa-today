import axios from 'axios';
import config from '../config';

axios.defaults.baseURL = config.API_BASE_URL;

const getLocations = async () => {
    return await axios.get('/locations')
    .then((res: any) => res.data)
    .catch((error: any) => [])
}

const getMenu = async (locationCode: string) => {
    return await axios.get(`/diets/${locationCode}`)
    .then((res: any) => res.data)
    .catch((error: any) => [])
}

const getCardBalance = async (cardID: string) => {
    return await axios.get(`https://topup.klarna.com/api/v1/STW_DUSSELDORF/cards/${cardID}/balance`)
    .then((res: any) => parseFloat(res.data.balance) * 100)
    .catch((error: any) => { console.error("Card balance fetch:", error); return -1 })
}

export default {
    getLocations,
    getMenu,
    getCardBalance
}