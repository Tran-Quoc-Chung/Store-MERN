const express = require("express");
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT;
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const morgan=require('morgan')
const dbConnect = require('./config/dbConnect');
dbConnect();

const authRouter = require('./routes/authRoute');
const productRouter = require('./routes/productRoute');
const blogRouter = require('./routes/blogRoute');
const categoryRouter = require('./routes/prodCategoryRoute');
const blogCatRouter = require('./routes/blogCatRoute');
const brandRouter = require('./routes/brandRoute');
const couponRouter = require('./routes/couponRoute');
const colorRouter = require('./routes/colorRoute');
const enqRouter=require('./routes/enqRoute');
const { notFound, errorHandle } = require("./middlewares/errorHandle");

app.use(morgan('dev'));
app.use(cookieParser()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());



app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/blogcategory", blogCatRouter);
app.use("/api/branch", brandRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/color", colorRouter);
app.use("/api/enquiry", enqRouter);


app.use(notFound);
app.use(errorHandle);

app.listen(PORT, () => {
    console.log(`Server start in PORT ${PORT}`)
})
