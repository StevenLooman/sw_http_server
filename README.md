Smallworld HTTP Server
======================

Introduction
------------

A tiny HTTP server framework, loosely modeled after [express](http://expressjs.com/).

Examples
--------

Some examples are provided:

- Tile server, using leaflet
    - Routes:
        - Serving static files from a directory (file_server_route)
        - Serving PNG tiles from an application/ACE (tile_server_route)
    - Middlewares:
        - Access log (access_log_middleware)

License
-------

sw_http_server is licensed under the GPLv3 license. It is written by [Steven Looman](mailto:steven.looman@gmail.com).
