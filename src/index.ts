import express, { response } from 'express';
import http, { request } from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import * as auth from './Controllers/authController'
import { nextTick } from 'process';
import * as products from './Controllers/productsController';
import * as cart from './Controllers/cartController';
import * as order from './Controllers/orderController';
const PORT = 10000;
const app= express();


app.use(cors({
    credentials:true,
}));

app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());

// Single routing
const router = express.Router();
 
router.get('/', function (req, res, next) {
    res.send({'message':'Hey There!'});
})

router.post('/registerUser', async (req, res, next) => {
  await auth.createUser_(req, res);
});
 

router.post('/login', async (req, res, next) => {
  await auth.login(req, res);
});

router.post('/logout', async (req, res, next) => {
  await auth.logout(req, res);
});

router.post('/forgotpass', async (req, res, next) => {
  await auth.forgotPassword(req, res);
});


router.post('/verifyotp', async (req, res, next) => {
  await auth.verifyOTP(req, res);
});

router.get('/getcategories', async (req, res, next) => {
  await products.getCategories(req, res);
});

router.get('/getallproducts', async (req, res, next) => {
  await products.getAllProducts(req, res);
});

router.post('/adddeliveryaddress', async (req, res, next) => {
  await products.addDeliveryAddress(req, res);
});

router.post('/editdeliveryaddress', async (req, res, next) => {
  await products.editDeliveryAddress(req, res);
});

router.post('/deletedeliveryaddress', async (req, res, next) => {
  await products.deleteDeliveryAddress(req, res);
});

router.post('/getalldeliveryaddress', async (req, res, next) => {
  await products.getAllDeliveryAddress(req, res);
});

router.post('/addtocart', async (req, res, next) => {
  await cart.addToCart(req, res);
});

router.post('/removefromcart', async (req, res, next) => {
  await cart.removeFromCart(req, res);
});

router.post('/getcart', async (req, res, next) => {
  await cart.getCart(req, res);
});

router.post('/placeorder', async (req, res, next) => {
  await order.placeOrder(req, res);
});

router.post('/getorders', async (req, res, next) => {
  await order.getOrders(req, res);
});


app.use(router);
 
app.listen(PORT, () => {
    console.log("Server listening on PORT", PORT);
});