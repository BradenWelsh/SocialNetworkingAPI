const wAuth = require('../utils/auth');
const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, Comment, User } = require('../models');


router.get('/', wAuth, (req, res) => {
   Post.findAll({
      where: {
         user_id: req.session.user_id
      },
      attributes: [
         'id',
         'post_url',
         'title',
         'created_at',
         [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      include: [
         {
            model: Comment,
            attributes: [
               'id',
               'comment_body',
               'post_id',
               'user_id',
               'created_at'
            ],
            include: {
               model: User,
               attributes: ['username']
            }},{
            model: User,
            attributes: ['username']
         }]})
      .then(dbPData => {
         const posts = dbPData.map(post => post.get({ plain: true }));
         res.render('dashboard', { posts, loggedIn: true });
      })
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });});

router.get('/edit/:id', wAuth, (req, res) => {
   Post.findOne({
      where: {
         user_id: req.session.user_id
      },
      attributes: [
         'id',
         'post_url',
         'title',
         'created_at',
         [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      include: [
         {
            model: Comment,
            attributes: [
               'id',
               'comment_body',
               'post_id',
               'user_id',
               'created_at'
            ],
            include: {
               model: User,
               attributes: ['username']
            }},{
            model: User,
            attributes: ['username']
         }]})

      .then(dbPData => {
         const post = dbPData.get({ plain: true });
         res.render('edit-post', { post, loggedIn: true });
      })
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });});

module.exports = router;