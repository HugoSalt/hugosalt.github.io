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

If it is the first time using the repository, first install the dependencies : `npm install`

Once you've committed changes to the code, use  : `rollup -c` to compile the code down to the `bundle.js`, then simply open `index.html` in a browser.

( You can either install `rollup` globally or locally, to install globally use : `npm install --global rollup` )

## Contributing

To add an element on the page, follow the following steps :

  - 1) Create new module in its own folder in the `modules` folder. A module must be able to initiate itself by passing to the constructor the ID of the DOM (a string) that will contain it  (i.e the constructor create the view by appending to specified DOM)
  - 2) If your module needs extra css, add `MyModule.css` in the css folder and link it in the `head` of `index.html`.
  - 3) *No color should be hardcoded*, only use the color palette define in `page.css`. For eg instead for yellow use `var(--swiss-yellow)`.
  - 4) In the `main.js` initiate your module with `new MyModule("container_id");`
