const router = require("express").Router();
const { Comment, User, Post, Vote } = require("../../models");
const wAuth = require("../../utils/auth");


router.get("/", (req, res) => {
  User.findAll({
    attributes: { exclude: ["password"] },
  })
    .then((dbUData) => res.json(dbUData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });});
router.get("/:id", (req, res) => {
  User.findOne({
    attributes: { exclude: ["password"] },
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Post,
        attributes: ["id", "title", "post_url", "created_at"],
      },{
        model: Comment,
        attributes: ["id", "comment_body", "created_at"],
        include: {
          model: Post,
          attributes: ["title"],
        },},],})
    .then((dbUData) => {
      if (!dbUData) {
        res
          .status(404)
          .json({ message: "No user has been allocated with this ID!" });
        return;
      }
      res.json(dbUData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });});

router.post("/", (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })
    .then((dbUData) => {
      req.session.save(() => {
        req.session.user_id = dbUData.id;
        req.session.username = dbUData.username;
        req.session.loggedIn = true;

        res.json(dbUData);
      });})
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });});

router.post("/login", (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((dbUData) => {
    if (!dbUData) {
      res
        .status(400)
        .json({ message: "No user allocated with this email address!" });
      return;
    }

    const validPassword = dbUData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect password! Please try again." });
      return;
    }

    req.session.save(() => {
      req.session.user_id = dbUData.id;
      req.session.username = dbUData.username;
      req.session.loggedIn = true;

      res.json({
        user: dbUData,
        message: "You have successfully logged in!",
      });});});});

router.post("/logout", wAuth, (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }});

router.put("/:id", wAuth, (req, res) => {
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id,
    },})
    .then((dbUData) => {
      if (!dbUData[0]) {
        res
          .status(404)
          .json({ message: "No user has been allocated with this ID " });
        return;
      }
      res.json(dbUData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });});

router.delete("/:id", wAuth, (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },})
    .then((dbUData) => {
      if (!dbUData) {
        res
          .status(404)
          .json({ message: "No user has been allocated with this ID" });
        return;
      }
      res.json(dbUData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });});

module.exports = router;