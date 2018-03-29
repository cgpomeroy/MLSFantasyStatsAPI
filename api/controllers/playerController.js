const mongoose = require('mongoose');

Player = mongoose.model('Players');

exports.list_all_players = function(req, res) {
    let sort = {lastName: 1};
    let find = {};

    if(req.query.team)
        find.currentTeam = req.query.team;

    if(req.query.position)
        find.position = req.query.position;

    if(req.query.age)
        sort = {dob: req.query.age};

    if(req.query.name)
        sort = {lastName: req.query.name};

    if(req.query.height)
        sort = {height: req.query.height};

    if(req.query.weight)
        sort = {weight: req.query.weight};

    if(req.query.designation){
        find.designation = {$regex: req.query.designation};
    }


    Player.find(find, (err, player) => {
        if(err)
            res.send(err);
        res.json(player);
    }).sort(sort);

    /** if(req.query.team){
        Player.find({"currentTeam": req.query.team}, (err, player) => {
            console.log(req.query.team);
            if(err)
                res.send(err);
            res.json(player);
        }).sort({lastName: 1});
    }else{
        Player.find({}, function(err, player) {
            if (err)
                res.send(err);
            res.json(player);
        }).sort({lastName: 1});
    } **/
};

exports.create_a_player = function(req, res) {
    var new_player = new Player(req.body);
    new_player.save(function(err, player) {
        if (err)
            res.send(err);
        res.json(player);
    });
};


exports.read_a_player = function(req, res) {
    Player.findById(req.params.playerId, function(err, player) {
        if (err)
            res.send(err);
        res.json(player);
    });
};


exports.update_a_player = function(req, res) {
    Player.findOneAndUpdate({_id: req.params.playerId}, req.body, {new: true}, function(err, player) {
        if (err)
            res.send(err);
        res.json(player);
    });
};


exports.delete_a_player = function(req, res) {


    Player.remove({
        _id: req.params.playerId
    }, function(err, player) {
        if (err)
            res.send(err);
        res.json({ message: 'Player successfully deleted' });
    });
};
