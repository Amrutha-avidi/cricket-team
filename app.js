const express = require("express");

const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DBError:${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

//get players
app.get("/players/", async (require, response) => {
  const getPLayersQuery = `
    SELECT * FROM cricket_team;`;
  const playersArray = await db.all(getPLayersQuery);
  response.send(playersArray);
});

//add player
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPLayerQuery = `
    INSERT INTO
      cricket_team(player_name,jersey_number,role)
    VALUES
      (
         '${player_name}',
         '${jersey_number}',
         '${role}',
      );`;

  const dbResponse = await db.run(addPLayerQuery);
  // const playerId = dbResponse.lastID;
  //response.send({ playerId: playerId });
  response.send("Player added to the team");
});

module.exports = app;
