const Sequelize = require('sequelize');

var sequelize = new Sequelize('df9dl2mfns6ds4', 'bnmcffiztygtai', 'b1c96d2ec30b67a6fbfdf963faacba07ea3fcf359d5a889922f51574278f5ece', {
    host: 'ec2-54-87-179-4.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: {rejectUnauthorized: false}
    },
    query: {raw: true}
});

var Case = sequelize.define('Case', {
    caseID: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    q1: Sequelize.INTEGER,
    q2: Sequelize.INTEGER,
    q3: Sequelize.INTEGER,
    q4: Sequelize.INTEGER,
    q5: Sequelize.INTEGER
});

var Dcaconsumer = sequelize.define('Dcaconsumer', {
    dcaconsumerId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dcaID: Sequelize.INTEGER,
    caseID: Sequelize.STRING,
    dcaconsumer1: Sequelize.STRING,
    dcaconsumer2: Sequelize.STRING,
    dcaconsumer3: Sequelize.STRING,
    dcaconsumer4: Sequelize.STRING,
    dcaconsumer5: Sequelize.STRING,
    dcaconsumer6: Sequelize.STRING,
    dcaconsumer7: Sequelize.STRING,
    dcaconsumer8: Sequelize.STRING
});

var Dcaprovider = sequelize.define('Dcaprovider', {
    dcaproviderId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dcaID: Sequelize.INTEGER,
    caseID: Sequelize.STRING,
    dcaprovider1: Sequelize.STRING,
    dcaprovider2: Sequelize.STRING,
    dcaprovider3: Sequelize.STRING,
    dcaprovider4: Sequelize.STRING,
    dcaprovider5: Sequelize.STRING,
    dcaprovider6: Sequelize.STRING,
    dcaprovider7: Sequelize.STRING
});

var Dcadatausage = sequelize.define('Dcadatausage', {
    dcaID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    caseID: Sequelize.STRING,
    dcadatausage1: Sequelize.STRING,
    dcadatausage2: Sequelize.STRING,
    dcadatausage3: Sequelize.STRING,
    dcadatausage4: Sequelize.STRING,
    attestation: Sequelize.STRING,
    progress: Sequelize.INTEGER
});

var Dcadataintent = sequelize.define('Dcadataintent', {
    dcadataintentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dcaID: Sequelize.INTEGER,
    caseID: Sequelize.STRING,
    dcaintentuser: Sequelize.STRING,
    dcaintentdesc: Sequelize.STRING
});

var Dcachecklist = sequelize.define('Dcachecklist', {
    dcachecklistId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dcaID: Sequelize.INTEGER,
    caseID: Sequelize.STRING,
    dca_activity: Sequelize.STRING,
    dca_activity_completed_date: Sequelize.STRING,
    dca_activity_comments: Sequelize.STRING
});

var Dcaextraemail = sequelize.define('Dcaextraemail', {
    dcaextraemailId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dcaID: Sequelize.INTEGER,
    caseID: Sequelize.STRING,
    dca_extra_email: Sequelize.STRING,
});

module.exports.initialize = function() {
    return new Promise(function(resolve, reject) {
        sequelize.sync().then(()=> {
            resolve("Succesfully synced with the post gres database");
        }).catch((err)=>{
            reject("Failed to sync with the post gres database");
        });
    });
}

module.exports.addCase = function(caseData) {
    return new Promise(function(resolve, reject) {
        Case.create(caseData).then(()=>{
            resolve("New Case created!");
        }).catch((err)=>{
            reject("Failed to make a new Case, err: " + err);
        });
    });
}

module.exports.updateCase = function(caseData) {
    return new Promise(function (resolve, reject) {
        Case.update(caseData, {where: {caseID: caseData.caseID}}).then(()=>{
            resolve("Case updated!");
        }).catch((err)=>{
            reject("Failed to update case");
        });
    });
}

module.exports.getCaseByNum = function (num) {
    return new Promise(function (resolve, reject) {
        Case.findAll({
            where: {caseID: num}
        }).then((data)=>{
            resolve(data[0]);
        }).catch((err)=>{
            reject("No such case ID: " + num +err);
        });
    });
}

module.exports.addDcaconsumer = function(caseData) {
    return new Promise(function(resolve, reject) {
        Dcaconsumer.create(caseData).then(()=>{
            resolve("New Case created!");
        }).catch((err)=>{
            reject("Failed to make a new Dcaconsumer, err: " + err);
        });
    });
}

module.exports.getDcaconsumer = function (num, num2) {
    return new Promise(function (resolve, reject) {
        Dcaconsumer.findAll({
            where: {caseID: num, dcaID: num2}
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("No such case ID: " + num +err);
        });
    });
}

module.exports.deleteDcaconsumer = function (num) {
    return new Promise(function (resolve, reject) {
        Dcaconsumer.destroy({
            where: {dcaconsumerId: num}
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("Failed to delete dcaconsumer");
        });
    });
}

module.exports.addDcaprovider = function(caseData) {
    return new Promise(function(resolve, reject) {
        Dcaprovider.create(caseData).then(()=>{
            resolve("New Case created!");
        }).catch((err)=>{
            reject("Failed to make a new Dcaprovider, err: " + err);
        });
    });
}

module.exports.getDcaprovider = function (num) {
    return new Promise(function (resolve, reject) {
        Dcaprovider.findAll({
            where: {caseID: num}
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("No such case ID: " + num +err);
        });
    });
}

module.exports.deleteDcaprovider = function (num) {
    return new Promise(function (resolve, reject) {
        Dcaprovider.destroy({
            where: {dcaproviderId: num}
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("Failed to delete dcaprovider, err: " + err);
        });
    });
}

module.exports.addDcadatausage = function(caseID) {
    return new Promise(function(resolve, reject) {
        Dcadatausage.create(caseID).then(()=>{
            resolve("New Case created!");
        }).catch((err)=>{
            reject("Failed to make a new Dcadatausage, err: " + err);
        });
    });
}

module.exports.getDcadatausage = function (num, num2) {
    return new Promise(function (resolve, reject) {
        Dcadatausage.findOne({
            where: {caseID: num, dcaID: num2}
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("No such dca ID: " + num2 + err);
        });
    });
}

module.exports.getDca = function (num) {
    return new Promise(function (resolve, reject) {
        Dcadatausage.findAll({
            where: {caseID: num}
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("No such case ID: " + num + err);
        });
    });
}

module.exports.deleteDcadatausage = function (num) {
    return new Promise(function (resolve, reject) {
        Dcadatausage.destroy({
            where: {dcaID: num}
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("Failed to delete DCA, err: " + err);
        });
    });
}

module.exports.updateDcadatausage = function (dataUsageData) {
    return new Promise(function (resolve, reject) {
        Dcadatausage.update(dataUsageData, {
            where: {caseID: dataUsageData.caseID, dcaID: dataUsageData.dcaID}
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("Failed to update data usage, err: " + err);
        });
    });
}

module.exports.addDcadataintent = function(data) {
    return new Promise(function(resolve, reject) {
        Dcadataintent.create(data).then(()=>{
            resolve("New Dcadataintent created!");
        }).catch((err)=>{
            reject("Failed to make a new Dcadataintent, err: " + err);
        });
    });
}

module.exports.getDcadataintent = function (num) {
    return new Promise(function (resolve, reject) {
        Dcadataintent.findAll({
            where: {caseID: num}
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("No such case ID: " + num + err);
        });
    });
}

module.exports.deleteDcadataintent = function (num) {
    return new Promise(function (resolve, reject) {
        Dcadataintent.destroy({
            where: {dcadataintentId: num}
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("Failed to delete dcadataintent, err: " + err);
        });
    });
}

module.exports.addDcachecklist = function(data) {
    return new Promise(function(resolve, reject) {
        Dcachecklist.create(data).then(()=>{
            resolve("New Dcachecklist created!");
        }).catch((err)=>{
            reject("Failed to make a new Dcachecklist, err: " + err);
        });
    });
}

module.exports.getDcachecklist = function (num) {
    return new Promise(function (resolve, reject) {
        Dcachecklist.findAll({
            where: {caseID: num}
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("No such case ID: " + num + err);
        });
    });
}

module.exports.deleteDcachecklist = function (num) {
    return new Promise(function (resolve, reject) {
        Dcachecklist.destroy({
            where: {dcachecklistId: num}
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("Failed to delete Dcachecklist, err: " + err);
        });
    });
}

module.exports.addDcaextraemail = function(data) {
    return new Promise(function(resolve, reject) {
        Dcaextraemail.create(data).then(()=>{
            resolve("New Dcaextraemail created!");
        }).catch((err)=>{
            reject("Failed to make a new Dcaextraemail, err: " + err);
        });
    });
}

module.exports.getDcaextraemail = function (num) {
    return new Promise(function (resolve, reject) {
        Dcaextraemail.findAll({
            where: {caseID: num}
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("No such case ID: " + num + err);
        });
    });
}

module.exports.deleteDcaextraemail = function (num) {
    return new Promise(function (resolve, reject) {
        Dcaextraemail.destroy({
            where: {dcaextraemailId: num}
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("Failed to delete Dcaextraemail, err: " + err);
        });
    });
}