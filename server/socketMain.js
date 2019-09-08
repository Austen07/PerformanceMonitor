const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1/perfData", {useNewUrlParser: true});
const Machine = require("./models/Machine");

const socketMain = (io, socket) => {
  // console.log("a socket connected, ", socket.id);
  // console.log("someone called me");
  let macA;

  //check from which client
  socket.on('clientAuth', (key) => {
    if(key === 'nodeClient'){
      socket.join('clients');
    }else if(key === 'frontEnd'){
      //valid react Client
      socket.join('ui');

      Machine.find({}, (err, docs) => {
        //when first load react, the initial status is offline
        docs.forEach((item) => {
          item.isActive = false;
          io.to('ui').emit('data', item);
        });
      });

    }else{
      socket.disconnect(true);
    }
  });


  //on disconnect, sent react client to set status as offline, udpate mongodb
  socket.on("disconnect", () => {
    Machine.find({macA: macA}, (err, docs) => {
      if(docs.length > 0) {
        //send last emit to React to make the machine offline
        docs[0].isActive = false;
        io.to('ui').emit('data', docs[0]);
      }
    });
  });

  //if a machine connect, check if it's new. if it is, add it to mongodb
  socket.on("initPerfData", async (data) => {
    macA = data.macA;

    //check mongo
    const mongooseRes = await check_Add(data);
    console.log(mongooseRes);
  });

  //every time when get data, send it to front client
  socket.on('perfData', (data) => {
    io.to("ui").emit('data', data);
  });
};

//helper function, check if macA machine is in the mongodb
//if not, then add it into mongodb
const check_Add = (data) => {
  //wait for db, promise
  return new Promise((resolve, reject) => {
    Machine.findOne(
      {macA: data.macA},
      (err, doc) => {
        if(err){ 
          throw err; 
        }else if(doc === null){
          //the record is not in the db, then add it
          let newMachine = new Machine(data);
          newMachine.save();
          resolve("added");
        }else{
          resolve("found");
        }
      }
    );
  });
};

module.exports = socketMain;