// Dependencies:
var remark = require('remark');
var github = require('./index.js');

// Processor:
var processor = remark().use(github);

// Input:
var input = [
  'References:',
  '',
  '* Commit: f8083175fe890cbf14f41d0a06e7aa35d4989587',
  '* Commit (fork): foo@f8083175fe890cbf14f41d0a06e7aa35d4989587.',
  '* Commit (repo): wooorm/remark@e1aa9f6c02de18b9459b7d269712bcb50183ce89.',
  '* Issue or PR (`#`): #1.',
  '* Issue or PR (`GH-`): GH-1.',
  '* Issue or PR (fork): foo#1.',
  '* Issue or PR (project): wooorm/remark#1.',
  '* Mention: @wooorm.',
  '',
  'Normalising of links:',
  '',
  '* Commit: https://github.com/wooorm/remark/commit/e1aa9f6c02de18b9459b7d269712bcb50183ce89.',
  '* Commit comment: https://github.com/wooorm/remark/commit/ac63bc3abacf14cf08ca5e2d8f1f8e88a7b9015c#commitcomment-16372693.',
  '* Issue or PR: https://github.com/wooorm/remark/issues/182',
  '* Issue or PR comment: https://github.com/wooorm/remark-github/issues/3#issue-151160339',
  '* Mention: @ben-eb.'
].join('\n');

// Process:
var doc = processor.process(input).toString();

// Yields:
console.log('markdown', doc);
