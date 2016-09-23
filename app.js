var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');
var Movie = require('./models/movie');
var Weibo = require('./models/weibo');
var User = require('./models/user');
var port = process.env.PORT || 3000;
var app = express();
var bodyParser = require('body-parser')


mongoose.connect('mongodb://localhost/imooc');

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.set('views', './views/pages');
app.set('view engine', 'jade');
//app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.locals.moment = require('moment');
app.listen(port);

console.log('imooc start');

//test for jinzhi
app.get('/test', function (req, res) {
    User.findByName('jinzhi.he', '123', function (err, user) {
        res.json(user);
    });

});

app.post('/test', function (req, res) {
    User.findByName('jinzhi.he', '123', function (err, user) {
        res.json(user);
    });

});

app.get('/weibo', function (req, res) {
    Weibo.fetch(function (err, weibos) {
        if (err) {
            console.log(err);
        }
        res.json(weibos);
    });
});

app.get('/weibo/:userID', function (req, res) {
    var userID = req.params.userID;
    Weibo.findByUserID(userID, function (err, weibos) {
        if (err) {
            console.log(err);
        }
        res.json(weibos);
    })
});

app.get('/delete/:id', function (req, res) {
    var id = req.params.id;
    Weibo.deleteByID(id, function (err, weibos) {
        if (err) {
            console.log(err);
        }
        res.json({
            success: 1
        });
    })

});

app.get('/reg/:regMsg', function (req, res) {
    var regMsg = req.params.regMsg;
    var regMsgObj = JSON.parse(regMsg);

    // console.log(regMsg);
    // console.log(JSON.parse(regMsg));
    // res.json(regMsg);

    var user = new User({
        username: regMsgObj.username,
        password: regMsgObj.password,
        email: regMsgObj.email,
        headFace: 'img/ionic.png',
        nickname: regMsgObj.nickname
    });

    user.save(function (err, user) {
        if (err) {
            console.log(err);
            res.json({
                fail: 1
            });
        } else {
            res.json({
                success: 1
            });
        }
    });
});

// app.post('/login', function (req, res) {
//   console.log(req);
// })

app.get('/login/:loginMsg', function (req, res) {
    var loginMsg = req.params.loginMsg;
    var loginMsgObj = JSON.parse(loginMsg);

    User.findByName(loginMsgObj.username, loginMsgObj.password, function (err, user) {
        if (err) {
            console.log(err);
        }

        if (user.length > 0) {
            res.json({
                success: 1,
                id: user[0]._id,
                headFace: user[0].headFace,
                nickname: user[0].nickname
            });
        } else {
            res.json({
                errorCode: '404',
                errorMsg: "帐号或密码不正确，请确认"
            })
        }
    })
});

app.post('/login', function (req, res) {
    var content = '';
    var loginMsgObj;
    req.on('data', function (data) {
        content += data;
    });
    req.on('end', function () {
        loginMsgObj = JSON.parse(content);
        User.findByName(loginMsgObj.username, loginMsgObj.password, function (err, user) {
            if (err) {
                console.log(err);
            }

            if (user.length > 0) {
                res.json({
                    success: 1,
                    id: user[0]._id,
                    headFace: user[0].headFace,
                    nickname: user[0].nickname
                });
            } else {
                res.json({
                    errorCode: '404',
                    errorMsg: "帐号或密码不正确，请确认"
                })
            }
        })
    })
});

app.post('/newWeibo', function (req, res) {
    var content = '';
    req.on('data', function (data) {
        content += data;
    });

    req.on('end', function () {
      var newWeibo = new Weibo(JSON.parse(content));
      newWeibo.save(function (err, newWeibo) {
          //console.log('save');
          res.json({
              success: newWeibo
          });
      });
    });




});




app.get('/', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }

        res.render('index', {
            title: 'imooc 首页',
            movies: movies
        });

        //res.json(movies);

    });
});

// app.get('/',function(req,res){
//   res.render('index',{
//     title:'imooc 首頁'
//   })
// })



app.get('/movie/:id', function (req, res) {

    var id = req.params.id;
    Movie.findById(id, function (err, movie) {

        res.render('detail', {
            title: 'imooc ' + movie.title,
            movie: movie
        })

    })
})


app.get('/admin/movie', function (req, res) {
    res.render('admin', {
        title: '後台錄入頁',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    })
});


app.get('/admin/update/:id', function (req, res) {
    var id = req.params.id;
    if (id) {
        Movie.findById(id, function (err, movie) {

            res.render('admin', {
                title: 'imooc 後台更新頁',
                movie: movie
            })
        })
    }

});

// app.post('/reg', function (req, res) {
//     Movie.fetch(function (err, movies) {
//     if (err) {
//       console.log(err);
//     }

//     res.render('index', {
//       title: 'imooc 首页',
//       movies: movies
//     });
//   });
// })

app.post('/admin/movie/new', function (req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    if (id !== 'undefined') {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }
            _movie = _.extend(movie, movieObj);
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err);
                };

                res.redirect('/movie/' + movie._id);

            })
        })
    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });

        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }

            res.redirect('/movie/' + movie._id);

        })


    }

});


app.get('/admin/list', function (req, res) {


    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }

        res.render('list', {
            title: 'imooc 列表頁',
            movies: movies
        });

    });
})


//list delete
app.delete('/admin/list', function (req, res) {
    var id = req.query.id;
    console.log(id);
    if (id) {
        Movie.remove({
            _id: id
        }, function (err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.json({
                    success: 1
                });
            }
        })
    }
});
