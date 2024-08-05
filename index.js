import express from 'express';
import ejs, { render } from 'ejs';
import bodyParser from 'body-parser';

import * as blg from './modules.js';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const blogDataFilePath = (__dirname + 'blog.json');
const ddirname = dirname(fileURLToPath(import.meta.url));
const deletedfilePath = (ddirname + 'trash.json');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.get('/',(req,res)=>
{
    res.render('index.ejs');
});
app.get('/newblog',(req,res)=>
    {
        res.render('post.ejs');
    });




app.post('/postBlog',async (req,res)=>
{
    var name = req.body['name'];
    var blogpost = req.body['blog'];
    blg.storeBlog(name,blogpost);
    res.redirect('/newblog');
}
);



//displays the posted blogs
app.get('/postedBlog',async (req,res)=>{
    const Blodata = await blg.retrieveData();
 
    res.render('blogpost.ejs',
        {
            data:Blodata,
          
        }
    );
});


//to go to the update/edit page so as to edit it 
app.get('/update/:index/', (req, res) => {
      const data = fs.readFileSync(blogDataFilePath, 'utf8');
      const blogData = JSON.parse(data);
      const index = parseInt(req.params.index);

      const updateTheData = blogData[index];
      res.render('update.ejs', { update: updateTheData,id:index});
 
  });




//to update the blog
  app.post('/postupdate',async(req, res) => {
    const id = parseInt(req.body['postId']);
    const name = req.body['name'];
    const blog = req.body['blog'];
    
    // Read the blog data from the file
    const data = fs.readFileSync(blogDataFilePath, 'utf8');
    const blogData = JSON.parse(data);
  
    blogData[id].name = name;
    blogData[id].post = blog;
    
    fs.writeFileSync(blogDataFilePath,JSON.stringify(blogData, null, 2));
    res.redirect('/postedBlog');
  });


 

    //to delete the blog
app.get('/delete/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const filesdelete = fs.readFileSync(blogDataFilePath,'utf8');
  const data = JSON.parse(filesdelete);
  const del = data.splice(index,1)[0];
  const delarray = [];
  delarray.push(del);
  fs.writeFileSync( deletedfilePath,JSON.stringify(delarray,null,2));
  fs.writeFileSync(blogDataFilePath, JSON.stringify(data, null, 2));
  res.redirect('/postedBlog');
});

// app.get('/trash',(req,res)=>
// {
//   return new Promise((resolve, reject) => {
//     fs.readFile(deletedfilePath, 'utf8', (err, data) => {
//       if (err) {
//         reject(err);
//       } else {
//         const trashed = JSON.parse(data);
//         resolve(trashed);
//         res.render('trash.ejs',{
//           trash:trashed
//         })
//       }
//     });
//   });

// });
app.get('/trash', (req, res) => {
  fs.readFile(deletedfilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading deleted blog data:', err);
      res.status(500).send('Error fetching deleted blog posts');
    } else {
      const trashed = JSON.parse(data);
      res.render('trash.ejs', {
        trash: trashed
      });
    }
  });
});


  

app.listen(port,()=>{
    console.log(`app running on port ${port}`);
});
