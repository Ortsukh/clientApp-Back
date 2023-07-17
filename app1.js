var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


app.use(cors({
    origin: '*'
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const phone = '+375291112233';
const code = '1111';
const email = 'mosktest@gmail.com';
const USER_ID = 'ad12ng45';

app.get("/phone/:num", function (request, response) {
    console.log(request.params);
    if (phone === request.params.num) {
        response.send({
            status: 'ok',
            message: 'Вам на номер ' + request.params.num + ' отправлен код подтверждения.'
        });
    } else {
        response.send({
            status: 'error',
            message: 'Номер ' + request.params.num + ' не найден!'
        });
    }
});

app.get("/code/:num/phone/:pnum", function (request, response) {
    console.log(request.params);
    if (code === request.params.num && phone === request.params.pnum) {
        response.send({
            status: 'ok',
            id_user: USER_ID
        });
    } else {
        if (code !== request.params.num) {
            response.send({
                status: 'error',
                message: 'Неверный код подтверждения!'
            });
        }
        if (phone !== request.params.pnum) {
            response.send({
                status: 'error',
                message: 'Номер ' + request.params.pnum + ' не найден!'
            });
        }
    }
});

app.get("/code/:num/email/:text", function (request, response) {
    console.log(request.params);
    if (code === request.params.num && email === request.params.text) {
        response.send({
            status: 'ok',
            id_user: USER_ID
        });
    } else {
        if (code !== request.params.num) {
            response.send({
                status: 'error',
                message: 'Неверный код подтверждения!'
            });
        }
        if (email !== request.params.text) {
            response.send({
                status: 'error',
                message: 'E-mail ' + request.params.text + ' не найден!'
            });
        }
    }
});


app.post("/registration", function (request, response) {

    if (!request.body) return response.sendStatus(400);
    console.log(request.body);
    response.send({
        status: 'ok',
        message: 'Вам на Email ' + request.body.email + ' отправлен код подтверждения.'
    });
});



let dateNow = Date.now();

const data = {
    userTs: dateNow,
    newsTs: dateNow,
    ordersTs: dateNow,
    stocksTs: dateNow
}

const user = require('./json/user.json');
const news = require('./json/news.json');
const orders = require('./json/orders.json');
const stocks = require('./json/stocks.json');
const { log } = require('console');

const updateData = {
    user: {storageName: 'USER', ts: dateNow, info: user},
    news: {storageName: 'NEWS', ts: dateNow, info: news},
    orders: {storageName: 'ORDERS', ts: dateNow, info: orders},
    stocks: {storageName: 'STOCKS', ts: dateNow, info: stocks}
}

let arrayInfo = [];
let timeID;

function generateTs () {
    let arrayName = ['user', 'news', 'orders', 'stocks'];

    timeID = setInterval(() => {
        let updateArr = {};
        let name = arrayName[Math.round(-0.5 + Math.random() * 4)];
        updateArr.ts = Date.now();
        updateArr.name = name;
        updateData[name].ts = updateArr.ts;
        arrayInfo[name] = updateArr;
    }, 5000);
}

app.post("/edit_user", function (request, response) {

    if (!request.body) return response.sendStatus(400);
    console.log(request.body);

    updateData["user"].ts = Date.now();
    updateData["user"].info = {...updateData["user"].info, ...request.body};

    console.log(updateData.user);

    response.send({
        status: 'ok',
        message: 'Данные пользователя изменены.',
        data: updateData["user"]
    });
});

app.get("/check_update/ad12ng45", function (request, response) {
    if(!timeID){
        generateTs();
    }

    let newArr = [];
    for(let i in arrayInfo){
        newArr.push(arrayInfo[i]);
    }

    response.send(newArr);
});

app.get("/get_data/0/ad12ng45", function (request, response) {
    console.log(request.params.ts);

    let arrayInfo = [];

    for(let i in updateData ) {

            arrayInfo.push(updateData[i]);

    }
    
    console.log(123123,updateData);

    response.json({data: arrayInfo});
});

app.get("/get_data/:ts/ad12ng45", function (request, response) {
    console.log(request.params.ts);

    let arrayInfo = [];

    for(let i in updateData ) {
        if(updateData[i].ts > request.params.ts){
            arrayInfo.push(updateData[i]);
        }
    }
    response.json({data: arrayInfo});
});



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



module.exports = app;
