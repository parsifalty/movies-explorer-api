const router = require("express").Router();
const { Joi, celebrate } = require("celebrate");
const { getCurrentUser, editCurrentUser } = require("../controllers/users");

router.get("/me", getCurrentUser);
router.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
    }),
  }),
  editCurrentUser
);

module.exports = router;
