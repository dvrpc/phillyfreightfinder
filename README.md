# DVRPC PhillyFreightFinder

PhillyFreightFinder is the product of DVRPC’s continuing, comprehensive freight planning program. This program enables carriers and shippers to participate in the metropolitan planning process and identifies freight transportation trends and needs in the region. This application was built by DVRPC to serve as a public information portal for the DVRPC freight data program.

This project is maintained through DVRPC's Freight Planning work program.

The live application is available at [https://www.dvrpc.org/webmaps/phillyfreightfinder/](https://www.dvrpc.org/webmaps/phillyfreightfinder/)

## Development

This repo covers the front-end web components of the PhillyFreightFinder data platform. The app is built with jquery, leaflet, and d3 as the primary libraries.

To contribute to the project:

1. clone the repo with `git clone https://github.com/dvrpc/phillyfreightfinder.git`
2. `npm install`

Grunt watch will udpate build as changes are saved.

## Build

This application currently uses grunt for build processes. After `npm install` is run, Grunt will update the `html/` directory with the compiled application code.
