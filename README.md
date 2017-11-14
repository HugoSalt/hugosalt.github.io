# EPFL Data Visualization Course Project

This repository contains the code for our data visualization project. The final visualization can be seen at [hugosalt.github.io](https://hugosalt.github.io/).

This repository also contains the process book (in the `process_book` folder) which tells more about this visualization.

## Project stack

This project is using :
- Vanilla ES6 JavaScript, CSS and HTML
- NPM for installing and managing modules (such as `d3`)
- Rollup for bundling our ES6 code down to a bundle.js script that can be executed by browsers

## Usage

The main requirement for the browser is to support ES6 class which is the case for all modern browsers (https://caniuse.com/#feat=es6-class).

Once you've committed changes to the code, use  : `rollup -c` to compile the code down to the `bundle.js`, then simply open `index.html` in a browser.

We can either install `rollup` globally or locally, to install globally use : `npm install --global rollup`
