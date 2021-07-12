const router = require("express").Router();
const sequelize = require("../../config/connection");
const { Comment, Post, User, Vote } = require("../../models");
const wAuth = require("../../utils/auth");


router.get("/", (req, res) => {
  Post.findAll({
    attributes: [
      "id",
      "post_url",
      "title",
      "created_at",
      [
        sequelize.literal(
          "(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
        ),
        "vote_count",
      ],],
    order: [["created_at", "DESC"]],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_body", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },},{
        model: User,
        attributes: ["username"],
      },],})

    .then((dbPData) => res.json(dbPData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });});

router.get("/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: [
      "id",
      "post_url",
      "title",
      "created_at",
      [
        sequelize.literal(
          "(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
        ),
        "vote_count",
      ],],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_body", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },},{
        model: User,
        attributes: ["username"],
      },],})

    .then((dbPData) => {
      if (!dbPData) {
        res
          .status(404)
          .json({ message: "No post has been found with this ID" });
        return;
      }
      res.json(dbPData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });});

router.post("/", wAuth, (req, res) => {
  Post.create({
    title: req.body.title,
    post_url: req.body.post_url,
    user_id: req.session.user_id,
  })
    .then((dbPData) => res.json(dbPData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });});

router.put("/upvote", wAuth, (req, res) => {

  if (req.session) {
    Post.upvote(
      { ...req.body, user_id: req.session.user_id },
      { Vote, Comment, User }
    )
      .then((updatedVoteData) => res.json(updatedVoteData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });}});

router.put("/:id", wAuth, (req, res) => {
  Post.update(
    {
      title: req.body.title,
    },{
      where: {
        id: req.params.id,
      },})
    .then((dbPData) => {
      if (!dbPData) {
        res
          .status(404)
          .json({ message: "No post has been allocated with this ID" });
        return;
      }
      res.json(dbPData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });});

router.delete("/:id", (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id,
    },})
    .then((dbPData) => {
      if (!dbPData) {
        res
          .status(404)
          .json({ message: "No post has been allocated with this ID" });
        return;
      }
      res.json(dbPData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });});

module.exports = router;