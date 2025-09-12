# Hubblo Data visualization library

## Introduction 

This repository contains library code for the plots and web components to be used across Hubblo projects.
At the moment, it is constituted of wrappers of `@observable/plot` methods or of implementations using `d3`.
This allows to use these methods and components across projects, with possibilites for customization while keeping style consistency.
It also allows to use them regardless of the technology used for a project (either with or without using a framework).

## Development

### Testing

As some methods are basically wrappers of `@observable/plot` methods, unit testing for these is not necessary. We can rely on the testing made by Observable on their part.
Nonetheless, the visual rendering of these methods need to evaluated before commiting code. That is why a small Vite server is implemented allowing to see the visual results from the methods or from the web compoments. This also allows to see quick examples of these plots and diagrams.

Utilitary methods need unit testing.

The web components, incorporating other elements than just the plots, can be tested with an end-to-end framework using a browser. That is why `webdriver` is used to test the functionalities of some web components.

Unit testing can be executed with `npm run test`.
The Vite server can be started with `npm run testServer`. This serves a small website, where the various plots, maps and web components can be evaluated.
End-to-end testing for the web components can be executed with `npm run testWebComponents`.
