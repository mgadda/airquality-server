# Air Quality Server

This node-based reads newline separated JSON data off a serial port, stores it 
in a sqlite database and then makes that data available over HTTP via GraphQL.

It is designed to work with [mgadda/homebridge-airquality](https://github.com/mgadda/homebridge-airquality).