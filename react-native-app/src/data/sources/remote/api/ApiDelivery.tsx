import axios from "axios";

const ApiDelivery = axios.create({
  baseURL: 'http://10.1.206.115:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

  export { ApiDelivery };