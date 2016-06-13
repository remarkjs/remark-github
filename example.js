// Dependencies:
var github = require('./index.js');
var remark = require('remark')().use(github);

// Input:
var input = [
    '* SHA: 1f2a4fb8f88a0a98ea9d0c0522cd538a9898f921',
    '* User@SHA: jlord@1f2a4fb8f88a0a98ea9d0c0522cd538a9898f921',
    '* User/Repository@SHA: jlord/sheetsee.js@1f2a4fb',
    '* #Num: #1',
    '* GH-Num: GH-1',
    '* User#Num: jlord#1',
    '* User/Repository#Num: jlord/sheetsee.js#1',
    '* @mention',
    '* And @mentioning someone else',
    '* And nothing'
].join('\n');

// Process:
var file = remark.process(input);

// Yields:
console.log('markdown', String(file));
