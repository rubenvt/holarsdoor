// Simple script to help download project files for GitHub upload
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Create a file to stream archive data to
const output = fs.createWriteStream(path.join(__dirname, 'holarsdoor-files.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level
});

// Listen for all archive data to be written
output.on('close', function() {
  console.log('Archive created successfully!');
  console.log('Total bytes: ' + archive.pointer());
  console.log('Download the zip file and upload its contents to GitHub');
});

archive.on('error', function(err) {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add files to the archive
const filesToInclude = [
  'index.html',
  'main.js',
  'style.css',
  'package.json',
  '.gitignore',
  'README.md',
  // Don't include .env file as it contains sensitive information
];

filesToInclude.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    archive.file(path.join(__dirname, file), { name: file });
  }
});

// Add directories
['public'].forEach(dir => {
  if (fs.existsSync(path.join(__dirname, dir))) {
    archive.directory(path.join(__dirname, dir), dir);
  }
});

// Finalize the archive
archive.finalize();
