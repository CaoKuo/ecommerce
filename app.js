const express = require('express');
const morgan = require('morgan');   // 日志
const cors = require('cors');       // 跨域支持

const cookieParser = require("cookie-parser");      // 解析HTTP请求中的Cookie头

const router = require('./router');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(morgan('dev'));

app.use(cors());

const PORT = process.env.PORT || 5000;

app.use('/api', router);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})