const router = require("express").Router();
const usersRouter = require("./users");
const moviesRouter = require("./movies");
const signupRouter = require("./signUp");
const signinRouter = require("./signIn");
const auth = require("../middlewares/auth");

router.use(signupRouter);
router.use(signinRouter);

router.use(auth);

router.use("/users", usersRouter);
router.use("/movies", moviesRouter);

module.exports = router;
