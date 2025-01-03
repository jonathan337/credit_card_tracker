#!/bin/bash

# Build the project
npm run build

# Navigate into the build output directory
cd out

# Create a .nojekyll file to bypass Jekyll processing
touch .nojekyll

# Initialize a new Git repository
git init

# Add all files to the repository
git add -A

# Commit the changes
git commit -m 'Deploy to GitHub Pages'

# Force push to the gh-pages branch of your repository
# Replace 'yourusername' with your actual GitHub username
git push -f git@github.com:yourusername/credit-card-forex-tracker.git main:gh-pages

# Navigate back to the project root
cd ..

