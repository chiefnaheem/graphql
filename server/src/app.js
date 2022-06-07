"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var path_1 = __importDefault(require("path"));
var morgan_1 = __importDefault(require("morgan"));
require("dotenv").config();
var express_graphql_1 = require("express-graphql");
var schema_1 = require("./schema/schema");
var mongoConnect_1 = require("./database/mongoConnect");
var cors_1 = __importDefault(require("cors"));
// dotenv.config();
var app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, "../", "public")));
// view engine setup
app.set("views", path_1.default.join(__dirname, "../", "views"));
app.set("view engine", "jade");
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "test") {
    (0, mongoConnect_1.connectTestDB)();
}
else {
    (0, mongoConnect_1.connectDB)();
}
app.use("/graphql", (0, express_graphql_1.graphqlHTTP)({
    schema: schema_1.graphqlSchema,
    graphiql: process.env.NODE_ENV === "development",
}));
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
exports.default = app;
