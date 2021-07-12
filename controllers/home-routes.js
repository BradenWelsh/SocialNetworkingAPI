const router = require("express").Router();
const sequelize = require("../config/connection");
const { User, Comment, Post } = require("../models");

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
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_body", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },},
      {
        model: User,
        attributes: ["username"],
      },],})
    .then((dbPData) => {
      console.log(dbPData[0]);
      const posts = dbPData.map((post) => post.get({ plain: true }));
      res.render("homepage", {
        posts,
        loggedIn: req.session.loggedIn,
      });})
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.redirect("login");
});

router.get("/post/:id", (req, res) => {
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
        },},
{
        model: User,
        attributes: ["username"],
      },],})
    .then((dbPData) => {
      if (!dbPData) {
        res
          .status(404)
          .json({ message: "No posts have been allocated under this ID" });
        return;
      }

      const post = dbPData.get({ plain: true });
      res.render("single-post", {
        post,
        loggedIn: req.session.loggedIn,
      });})

    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });});

module.exports = router;