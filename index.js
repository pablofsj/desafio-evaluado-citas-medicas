import chalk from "chalk";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import _ from "lodash";
import axios from "axios";
import express from "express";
import { engine } from 'express-handlebars';


moment.locale('es');
const app = express();

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');


const users = [];


app.get("/", async (req, res) => {
  const response = await axios.get("https://randomuser.me/api/");
  const { gender, name: { first, last } } = response.data.results[0];

  const user = {
    gender,
    first,
    last,
    id: uuidv4(),
    timestamp: moment().format("LLL"),
  };

  users.push(user);
  const usersFilteredGenre = _.partition( users, (item) => item.gender === "female");
  const usersMale = users.filter(user => user.gender === 'male');
  const usersFemale = users.filter(user => user.gender === 'female');

  res.render('home', { usersMale, usersFemale })

  console.log(chalk.blue.bgWhite(JSON.stringify(usersFilteredGenre , null, 2)));


});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Escuchando peticiones en puerto ${PORT}`);
});
