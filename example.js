// Dependencies:
var github = require('./index.js');
var remark = require('remark').use(github);

// Input:
var input = [
    '* SHA: a5c3785ed8d6a35868bc169f07e40e889087fd2e',
    '* User@SHA: jlord@a5c3785ed8d6a35868bc169f07e40e889087fd2e',
    '* User/Repository@SHA: jlord/sheetsee.js@a5c3785e',
    '* #Num: #26',
    '* GH-Num: GH-26',
    '* User#Num: jlord#26',
    '* User/Repository#Num: jlord/sheetsee.js#26',
    '* @mention',
    '* And @mentioning someone else',
    '* And nothing.'
].join('\n');

// Process:
var doc = remark.process(input);

// Yields:
console.log('markdown', doc);
