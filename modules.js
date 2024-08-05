

import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';


const __dirname = dirname(fileURLToPath(import.meta.url));
const blogDataFilePath = (__dirname + 'blog.json');

// Function to store a new blog post
export function storeBlog(name, posts) {

  let existingBlogData = [];
  try {
    const fileData = fs.readFileSync(blogDataFilePath, 'utf8');
    existingBlogData = JSON.parse(fileData);
  } catch (error) {
    // If the file doesn't exist or is empty, initialize with an empty array
    existingBlogData = [];
  }

  // Add the new post data to the existing blog data
  existingBlogData.push({
    name: name,
    post: posts,
  });

  // Write the updated blog data to the file
  try {
    fs.writeFileSync(blogDataFilePath, JSON.stringify(existingBlogData, null, 2));
    console.log('New blog post added successfully!');
    return existingBlogData;
  } catch (error) {
    console.error('Error writing blog data:', error);
    // Handle the error, e.g., display an error message to the user
    return null;
  }
}

// Function to retrieve blog data
export function retrieveData() {
  return new Promise((resolve, reject) => {
    fs.readFile(blogDataFilePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const blogData = JSON.parse(data);
        resolve(blogData);
      }
    });
  });
}

//update blog

