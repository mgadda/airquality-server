# Air Quality Server

This node-based reads newline separated JSON data off a serial port, stores it 
in a sqlite database and then makes that data available over HTTP via GraphQL.

It is designed to work with [mgadda/homebridge-airquality](https://github.com/mgadda/homebridge-airquality).

```
  Usage: airquality-server [options]

  Options:

    -V, --version              output the version number
    -v, --verbose              Be more verbose
    -p, --port <n>             port (default: 4000)
    --database-path <s>        Path to sqlite database (default: ./aq.db)
    --test-mode                Generate fake database from fake device /dev/ROBOT
    -s, --sampling-period <n>  Number of milliseconds between saving samples to disk (default: 900000)
    -d, --device <s>           Serial device to read from
    --config <s>               Path to json config file
    -h, --help                 output usage information
```
