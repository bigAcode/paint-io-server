const db = require('./db');
const DRAW_POINTS_EVENT = "DRAW_POINTS";
const USER_LOGIN_EVENT = "LOGIN";
const UPDATE_USER_LIST = "UPDATE_USER_LIST";
const USER_LOGOUT_EVENT = "LOGOUT";
const onSocketConnect = io => socket => {

    // TODO 2.1 Listen for login events (eg "LOGIN") from client and save the user using db.create(username, socket.id)
    // TODO 2.2 Prevent users from using an existing username using the "acknowledgement" from the client
    // TODO 2.3 Emit an update user list event (eg "UPDATE_USER_LIST") to all clients when there is a login event
    socket.on(USER_LOGIN_EVENT, (data, ack) => {
        if (db.userExists(data)) {
            if (typeof ack === 'function') {
                ack(false);
                return;
            }
        } else {
            db.create(data, socket.id);
            if (typeof ack === 'function') {
                ack(true);
            }
            socket.broadcast.emit(UPDATE_USER_LIST, db.all());
        }
    });
    // TODO 2.4 Listen for "disconnect" events and remove the socket user from the users object (*hint: db.create(username, socket.id) returns the logout fn)
    // TODO 2.5 emit "UPDATE_USER_LIST" after user has been "logged out" and is removed from "users" object
    // socket.on(USER_LOGOUT_EVENT, (data, ack) => {
    //
    // });
    // TODO 3.1 Check if a "toUser" is specified and only broadcast to that user
    // TODO 3.2 Include information about the "fromUser" so the client can filter draw events from other users and only display events from the selected user

    // TODO 1.4 listen for draw action-type events (eg "DRAW_POINTS") from the socket and broadcast them to others sockets.
    socket.on(DRAW_POINTS_EVENT, ({points, color}) => {
        socket.broadcast.emit(DRAW_POINTS_EVENT, {points, color});
    });
};

const connect = server => {
    // TODO 1.1 import socket.io
    // TODO 1.2 attach a socket to the express server by passing the express server instance as an argument when socket.io is invoked
    const io = require("socket.io")(server);
    // TODO 1.3 listen for new connections and use the provided "onSocketConnect" function
    io.on('connect', onSocketConnect(io));
}

module.exports = connect;
