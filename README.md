node-dirbuster
=========

> Implementation of the [dirbuster project](https://www.owasp.org/index.php/Category:OWASP_DirBuster_Project) in Node.js. It might an extra feature or two. 

## Badgers

[![NPM](https://nodei.co/npm/dirbuster.png?downloads=true&stars=true)](https://nodei.co/npm/dirbuster/)

[![Dependency Status](https://david-dm.org/diasdavid/node-dirbuster.svg)](https://david-dm.org/diasdavid/node-dirbuster)

## Usage

### CLI

> under development

### Programmaticaly (through requiring the module)

Using disbuster programatically is as simple as it can get

```
var dirBuster = require('dirbuster');

var options = {
    list: '../lists/test.txt', // the word list you want to use, if none passed, it will use a random word generator
    outStream: process.stdout, // a stream that implements the Writable stream API
    url: 'https://poor.web.site.com',
    export: 'json', // pick from the list: json, csv, xml, text
    methods: ['GET','POST','HEAD','PUT','DELETE'],
    recursive: false,
    depth: 2, // how many levels you want to go in your recursiveness
    throttle: 5, // how many concorrent requests
    extension: ['.php'] // if you want to look for specific extensions
};

dirBuster(options);
```


## Overview (copied from the OWASP DirBuster Project)

DirBuster is a ~~multi threaded java~~ **asynchronous Node.js application** designed to brute force directories and files names on web/application servers. Often is the case now of what looks like a web server in a state of default installation is actually not, and has pages and applications hidden within. DirBuster attempts to find these.

However tools of this nature are often as only good as the directory and file list they come with. A different approach was taken to generating this. The list was generated from scratch, by crawling the Internet and collecting the directory and files that are actually used by developers! DirBuster comes a total of 9 different lists (Further information can be found below), this makes DirBuster extremely effective at finding those hidden files and directories. And if that was not enough DirBuster also has the option to perform a pure brute force, which leaves the hidden directories and files nowhere to hide! If you have the time ;)

#### What DirBuster can do for you:

- Attempt to find hidden pages/directories and directories with a web application, thus giving a another attack vector (For example. Finding an unlinked to administration page).

#### What DirBuster will not do for you

Exploit anything it finds. This is not the pur of DirBuster. DirBuster sole job is to find other possible attack vectors.

#### How does DirBuster help in the building of secure applications?

- By finding content on the web server or within the application that is not required.
- By helping developers understand that by simply not linking to a page does not mean it can not be accessed.

## Features

Original dirbuster features:

- Multi threaded has been recorded at over 6000 requests/sec
- Works over both http and https
- Scan for both directory and files
- Will recursively scan deeper into directories it finds
- Able to perform a list based or pure brute force scan
- DirBuster can be started on any directory
- Custom HTTP headers can be added
- Proxy support
- Auto switching between HEAD and GET requests
- Content analysis mode when failed attempts come back as 200
- Custom file extensions can be used
- Performance can be adjusted while the program in running
- Supports Basic, Digest and NTLM auth
- Command line * GUI interface

## Credits

Original dirbuster project was built in Java and it is a OWASP project - https://www.owasp.org/index.php/Category:OWASP_DirBuster_Project

The directory lists provided are also part of the original dirbuster project.
