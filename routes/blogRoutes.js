const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const Blog = mongoose.model('Blog');
const redis = require('redis')
const redisUrl = "redis://127.0.0.1:6379"
const client = redis.createClient(redisUrl)
const { promisify } = require("util")
client.get = promisify(client.get)

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {

    
    const cachedBlogs = await client.get(req.user.id)
    if(cachedBlogs){
      console.log('Serving from Cache')
      res.send(cachedBlogs)
      return 
    } else{
      console.log('Serving from MONGODB')
      const blogs = await Blog.find({ _user: req.user.id });
      client.set(req.user.id, JSON.stringify(blogs))
      res.send(blogs);
    }

  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
