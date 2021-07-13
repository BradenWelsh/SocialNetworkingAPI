const Comment = require("./Comment");
const Vote = require("./Vote");
const Post = require("./Post");
const User = require("./User");

Post.belongsTo(User, {
  foreignKey: "user_id"
});
User.hasMany(Post, {
  as: 'posts',
  foreignKey: "user_id"
});
User.belongsToMany(Post, {
  through: Vote,
  as: "vote_posts",
  foreignKey: "user_id"
});
Post.belongsToMany(User, {
  through: Vote,
  as: "voted_posts",
  foreignKey: "post_id"
});
Vote.belongsTo(Post, {
  foreignKey: "post_id"
});
Vote.belongsTo(User, {
  foreignKey: "user_id"
});
User.hasMany(Vote, {
  as: 'votes',
  foreignKey: "user_id"
});
Post.hasMany(Vote, {
  as: 'votes',
  foreignKey: "post_id"
});
User.hasMany(Comment, {
  as: 'comments',
  foreignKey: "user_id"
});
Post.hasMany(Comment, {
  as: 'comments',
  foreignKey: "post_id"
});
Comment.belongsTo(User, {
  foreignKey: "user_id"
});
Comment.belongsTo(Post, {
  foreignKey: "post_id"
});


module.exports = { User, Post, Comment, Vote };