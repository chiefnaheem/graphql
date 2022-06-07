import createError, { HttpError } from "http-errors";
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import logger from "morgan";
require("dotenv").config();
import { graphqlHTTP } from "express-graphql";
import { graphqlSchema } from "./schema/schema";
import { connectDB, connectTestDB } from "./database/mongoConnect";
import cors from "cors";


// dotenv.config();
const app = express();

app.use(express.static(path.join(__dirname, "../", "public")));
// view engine setup
app.set("views", path.join(__dirname, "../", "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === "test") {
  connectTestDB();
} else {
  connectDB();
}

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

// catch 404 and forward to error handler
// app.use((req: Request, res: Response, next: NextFunction) => {
//   next(createError(404));
// });

// error handler
// app.use((err: HttpError, req: Request, res: Response) => {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

export default app;
