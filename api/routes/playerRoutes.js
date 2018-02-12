'use strict';
module.exports = function(app) {
    const playerList = require('../controllers/playerController');

    // todoList Routes
    app.route('/players')
        .get(playerList.list_all_players)
        .post(playerList.create_a_player);


    app.route('/players/:playerId')
        .get(playerList.read_a_player)
        .put(playerList.update_a_player)
        .delete(playerList.delete_a_player);
};