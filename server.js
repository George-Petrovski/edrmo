var express = require("express");
var app = express();
const clientSessions = require("client-sessions");
const exphbs = require("express-handlebars");
var dataService = require("./data-service.js");
var bodyParser = require('body-parser')

var HTTP_PORT = process.env.PORT || 8080

app.use(bodyParser.urlencoded({extended: false}));

app.use(clientSessions({
    cookieName:     "session",
    secret:         "RandomStringNobodyWillGuess",
    duration:       2*60*1000,
    activeDuration: 1000*60
}));

app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
})

function ensureLogin(req, res, next){
    if(!req.session.user) res.redirect("/login");
    else next();
}

app.use(express.static('public'));

app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function(url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function(lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue)
                return options.inverse(this);
            else
                return options.fn(this);
        },
        eq: function(left, right) {
            return (left==right);
        }
    }
}));
app.set('view engine', '.hbs');

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

//home page route
app.get("/", (req, res) => {
    res.render("home");
});

app.post("/artifacts/add", (req, res) => {
    dataService.addCase(req.body).then((data) => {
        res.redirect("/artifacts/"+req.body.caseID);
    }).catch((err) => {
        res.redirect("/artifacts/"+req.body.caseID);
    })
});

app.get("/artifacts/:caseID", (req, res) => {
    let viewData = {};
    dataService.getCaseByNum(req.params.caseID).then((data) => {
        if (data) {
            console.log("data present");
            viewData = data;
        } else {
            console.log("data wiped");
            viewData = null;
        }
        res.render("artifacts", { viewData: viewData});
    }).catch((err) => {
        console.log("data wiped");
        viewData = null;
    })
});

app.post("/artifacts/update", (req, res) => {
    dataService.updateCase(req.body).then((data) => {
        res.redirect("/outstanding/"+req.body.caseID);
    }).catch((err) => {
        console.log(err);
    })
});

app.get("/outstanding/:caseID", (req, res) => {
    let viewData = {};
    dataService.getCaseByNum(req.params.caseID).then((data) => {
        if (data) {
            viewData = data;
        } else {
            viewData = null;
        }
        res.render("outstanding", {viewData: viewData});
    }).catch(() => {
        viewData = null;
    })
});

app.get("/artifacts/drafpg1/:caseID", (req, res) => {
    res.render("DRAFpage1", {data: req.params.caseID});
});

app.get("/artifacts/drafpg2", (req, res) => {
    res.render("DRAFpage2");
});

app.get("/artifacts/drafpg3", (req, res) => {
    res.render("DRAFpage3");
});

app.get("/artifacts/dcainfo/:caseID", (req, res) => {
    let dcausageData = {};
            dataService.getDca(req.params.caseID).then((data) => {
                if (data) {
                    dcausageData = data;
                } else {
                    dcausageData = null;
                }
                res.render("DCAinfopage", {dcausage: dcausageData, caseID: req.params.caseID});
            }).catch(() => {
                dcausageData = null;
            })  
});

app.get("/artifacts/dcapg1/:caseID/:dcaID", (req, res) => {
    let viewData = {};
    dataService.getDcaconsumer(req.params.caseID, req.params.dcaID).then((data) => {
        if (data) {
            viewData = data;
        } else {
            viewData = null;
        }
        res.render("DCApage1", {dcaconsumer: viewData, caseID: req.params.caseID, uniquedcaID: req.params.dcaID});
    }).catch(() => {
        viewData = null;
    })
});

app.post("/artifacts/dcapg1", (req, res) => {
    dataService.addDcaconsumer(req.body).then((data) => {
        res.redirect("/artifacts/dcapg1/"+req.body.caseID +"/"+req.body.dcaID);
    }).catch((err) => {
        console.log(err);
    })
});

app.get("/artifacts/dcapg1/delete/:caseID/:dcaconsumerId", (req, res) => {
    dataService.deleteDcaconsumer(req.params.dcaconsumerId)
    .then((data) => {
        res.redirect("/artifacts/dcapg1/" + req.params.caseID + "/" + req.body.dcaID);
    })
    .catch((err) => {console.log(err)});
});

app.get("/artifacts/dcapg2/:caseID/:dcaID", (req, res) => {
    console.log("caseID = " + req.params.caseID);
    let viewData = {};
    dataService.getDcaprovider(req.params.caseID).then((data) => {
        if (data) {
            viewData = data;
        } else {
            viewData = null;
        }
        res.render("DCApage2", {dcaprovider: viewData, caseID: req.params.caseID, uniquedcaID: req.params.dcaID});
    }).catch(() => {
        viewData = null;
    })
});

app.post("/artifacts/dcapg2", (req, res) => {
    dataService.addDcaprovider(req.body).then((data) => {
        res.redirect("/artifacts/dcapg2/"+req.body.caseID +"/"+req.body.dcaID);
    }).catch((err) => {
        console.log(err);
    })
});

app.get("/artifacts/dcapg2/delete/:caseID/:dcaproviderId", (req, res) => {
    dataService.deleteDcaprovider(req.params.dcaproviderId)
    .then((data) => {
        res.redirect("/artifacts/dcapg2/" + req.params.caseID);
    })
    .catch((err) => {console.log(err)});
});

app.get("/artifacts/dcapg3/:caseID/:dcaID", (req, res) => {
    dataService.getDcadatausage(req.params.caseID, req.params.dcaID).then((data) => {
        if (data) {
            viewData = data;
        } else {
            viewData = null;
        }
        res.render("DCApage3", {data: viewData, caseID: req.params.caseID, uniquedcaID: req.params.dcaID});
    }).catch(() => {
        viewData = null;
    })
});

app.post("/artifacts/dca/:caseID", (req, res) => {
    dataService.addDcadatausage(req.body).then((data) => {

        res.redirect("/artifacts/dcainfo/"+req.body.caseID);
    }).catch((err) => {
        console.log(err);
        res.redirect("/artifacts/dcainfo/"+req.body.caseID);
    });
});

app.get("/artifacts/dca/delete/:caseID/:dcaID", (req, res) => {
    dataService.deleteDcadatausage(req.params.dcaID)
    .then((data) => {
        res.redirect("/artifacts/dcainfo/" + req.params.caseID);
    })
    .catch((err) => {console.log(err)});
});


app.post("/artifacts/dcapg3", (req, res) => {
    dataService.updateDcadatausage(req.body).then((data) => {
        console.log(data);
        res.redirect("/artifacts/dcapg3/"+req.body.caseID +"/"+req.body.dcaID);
    }).catch((err) => {
        console.log(err);
    })
});

app.get("/artifacts/dcapg4/:caseID/:dcaID", (req, res) => {
    dataService.getDcadataintent(req.params.caseID).then((data) => {
        if (data) {
            viewData = data;
        } else {
            viewData = null;
        }
        res.render("DCApage4", {dcauser: viewData, caseID: req.params.caseID, uniquedcaID: req.params.dcaID});
    }).catch(() => {
        viewData = null;
    })
});

app.post("/artifacts/dcapg4", (req, res) => {
    dataService.addDcadataintent(req.body).then(() => {
        res.redirect("/artifacts/dcapg4/"+req.body.caseID +"/"+req.body.dcaID);
    }).catch((err) => {
        console.log(err);
    })
});

app.get("/artifacts/dcapg4/delete/:caseID/:dcadataintentId", (req, res) => {
    dataService.deleteDcadataintent(req.params.dcadataintentId)
    .then(() => {
        res.redirect("/artifacts/dcapg4/" + req.params.caseID);
    })
    .catch((err) => {console.log(err)});
});

app.get("/artifacts/dcapg5/:caseID/:dcaID", (req, res) => {
    dataService.getDcachecklist(req.params.caseID).then((data) => {
        if (data) {
            viewData = data;
        } else {
            viewData = null;
        }
        res.render("DCApage5", {data: viewData, caseID: req.params.caseID, uniquedcaID: req.params.dcaID});
    }).catch(() => {
        viewData = null;
    })
});

app.post("/artifacts/dcapg5", (req, res) => {
    dataService.addDcachecklist(req.body).then(() => {
        res.redirect("/artifacts/dcapg5/"+req.body.caseID);
    }).catch((err) => {
        console.log(err);
    })
});

app.get("/artifacts/dcapg5/delete/:caseID/:dcachecklistId", (req, res) => {
    dataService.deleteDcachecklist(req.params.dcachecklistId)
    .then(() => {
        res.redirect("/artifacts/dcapg5/" + req.params.caseID);
    })
    .catch((err) => {console.log(err)});
});

app.get("/artifacts/dcapg6/:caseID/:dcaID", (req, res) => {
    dataService.getDcaextraemail(req.params.caseID).then((data) => {
        if (data) {
            viewData = data;
        } else {
            viewData = null;
        }
        res.render("DCApage6", {data: viewData, caseID: req.params.caseID, uniquedcaID: req.params.dcaID});
    }).catch(() => {
        viewData = null;
    })
});

app.post("/artifacts/dcapg6", (req, res) => {
    dataService.addDcaextraemail(req.body).then(() => {
        res.redirect("/artifacts/dcapg6/"+req.body.caseID);
    }).catch((err) => {
        console.log(err);
    })
});

app.get("/artifacts/dcapg6/delete/:caseID/:dcaextraemailId", (req, res) => {
    dataService.deleteDcaextraemail(req.params.dcaextraemailId)
    .then(() => {
        res.redirect("/artifacts/dcapg6/" + req.params.caseID);
    })
    .catch((err) => {console.log(err)});
});

app.get("/artifacts/dsra", (req, res) => {
    res.render("DSRA");
});


dataService.initialize()
.then((data) => {
    console.log(data);
    app.listen(HTTP_PORT, onHttpStart);
})
.catch((err) => {
    console.log("failure in the initialize function for loading data, error: " + err);
});