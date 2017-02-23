'use strict';

const fs = require('fs');
const readline = require('readline');
const https = require('https');
const Promise = require('bluebird');
const sourceUrl = 'https://video1.trank.com.ua/angular2udemy';
const pathFolder = './video';
let items = 5;

main(items);

function main(items) {
  let queue = [];
  for (var i = 1; i <= items; i++) {
       queue.push(i);
  }

  Promise.each(queue, function(i) {
    return getFullUrl(i)
              .then(httpGetStream)
              .then((data) => Promise.resolve(console.log(`${data} file was successed download`)));
  })
  .then((data) => console.log(`files was successed download`))
  .catch((error) => console.log(`error ... ${error}`));
}

function httpGetStream(url) {
  return new Promise((resolve, reject) => {
    let localStream = openStream(url);
    https.get(url, (res) => {
    console.log('start download file ', url.split('/').pop());
    let allLength = JSON.parse(res.headers['content-length']);
    let max = allLength;
    res.on('data', (data) => {
      allLength -= data.length;
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(` Complete ... ${((max-allLength)/max * 100).toFixed(0)} % `);
      localStream.write(data);
    });
    res.on('end', () => resolve(url.split('/').pop()));
    }).on('error', (e) => {
      console.error(e);
      reject(e);
    });
  });
}

function openStream(url) {
  return fs.createWriteStream(`${pathFolder}/${url.split('/').pop()}`);
}

function getFullUrl(item) {
  return new Promise((resolve, reject) => {
    if (item) {
      resolve(`${sourceUrl}/lesson${item}.mp4`);
    }
    reject('file undefined ');
  });
}

