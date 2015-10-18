# NYC MTA Subway Traffic Visualizer

A weeks worth of entrances and exits for every station on the NYC Subway system visualized on a map. Filter via lines and zoom in to see station names. 

## Try it out
[Over here!](http://piratefsh.github.io/mta-maps/public)

## Where is this data from?
[Turnstile data](web.mta.info/developers/turnstile.html) taken from the MTA. Station location processed from [chriswhong/nycturnstiles](https://github.com/chriswhong/nycturnstiles), with the new added 34th St Hudson Yd station.


## Development

All source code is in `app` and `public/index.html`. Data is located in `resources/files` in JSON format. 

JSON data generated with scripts [here](https://github.com/piratefsh/mta-turnstile-cruncher), which were scraped with some other [scripts](https://github.com/piratefsh/mta-turnstile-scraper).

### Serve
This project runs on [Webpack](https://webpack.github.io/). To serve at http://localhost:8080/webpack-dev-server:

```
webpack-dev-server --inline  --content-base public/ 

```

### Build
To compile for production:

```
webpack --config webpack.config.js
```

## To-do
Currently only displays data for a week, although it can technicaly display data for any period of time, given the right data in JSON. Possible work: build a proper API for that purpose.


## Inspiration
This project was built at Recurse Center, Fall 2015 and was  inspired by fellow Recurser [Harry Truong](https://github.com/harrytruong) and this article: [Visualizing the MTA's Turnstile Data](chriswhong.com/open-data/visualizing-the-mtas-turnstile-data/)