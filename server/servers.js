//reference https://github.com/elad/node-cluster-socket.io

const express = require('express'); 
const cluster = require('cluster'); 
const net = require('net'); 
const socketio = require('socket.io');
const socketMain = require('./socketMain');

const port = 8181;
const num_processes = require('os').cpus().length;


const io_redis = require('socket.io-redis');
const farmhash = require('farmhash');


if (cluster.isMaster) {
	let workers = [];

	let spawn = (i) => {
    //This can only be called from the master process.
    //this func Spawn a new worker process, returns a worker, worker is a class
		workers[i] = cluster.fork(); 

		workers[i].on('exit', (code, signal) => {
			// console.log('respawning worker', i);
			spawn(i);
		});
  };

    // Spawn workers.
	for (let i = 0; i < num_processes; i++) {
		spawn(i);
	}

	const worker_index = (ip, len) => {
		return farmhash.fingerprint32(ip) % len; 
	};


    /* 
    start up a tcp connection via the net module INSTEAD OF the http module. Express will use http, but we need an independent tcp port open for cluster to work. This is the port that  will face the internet
    */
	const server = net.createServer({ pauseOnConnect: true }, (connection) =>{
		// We received a connection and need to pass it to the appropriate worker. 
		let worker = workers[worker_index(connection.remoteAddress, num_processes)];
    worker.send('sticky-session:connection', connection);
  });

    server.listen(port);
    console.log(`Master is listening on port ${port}`);
} else {
    //  master listens on it for us.
    let app = express();
    const server = app.listen(0, 'localhost');
       
	  const io = socketio(server);//socket server

    //solution external to this program so that can share across everything
    io.adapter(io_redis({ host: 'localhost', port: 6379 }));//Sets the adapter value

    // on connection, send the socket over to our module with socket stuff
    io.on('connection', (socket) => {
      //inside worker
      socketMain(io, socket);
      console.log(`connected to worker: ${cluster.worker.id}`);
    });

   
    process.on('message', (message, connection) => {
      //If worker get a message, check if the message is in the session
      if (message !== 'sticky-session:connection') {
        return;
      }
      // Emulate a connection event on the server
      server.emit('connection', connection);

      connection.resume();
    });
}
