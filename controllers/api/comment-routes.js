const router = require("express").Router();
const { Comment } = require("../../models");
const wAuth = require("../../utils/auth");

router.get("/", (req, res) => {
  Comment.findAll({})
    .then((dbCData) => res.json(dbCData))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });});

router.get("/:id", (req, res) => {
  Comment.findAll({
    where: {
      post_id: req.params.id,
    },
  })
    .then((dbCData) => res.json(dbCData))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });});

router.post("/", wAuth, (req, res) => {
  if (req.session) {
    Comment.create({
      comment_body: req.body.comment_body,
      post_id: req.body.post_id,
      user_id: req.session.user_id,
    })
      .then((dbCData) => res.json(dbCData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });}});

router.delete("/:id", (req, res) => {
  Comment.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbCData) => {
      if (!dbCData) {
        res
          .status(404)
          .json({ message: "No comment data has been allocated with this ID" });
        return;
      }
      res.json(dbCData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });});

module.exports = router;