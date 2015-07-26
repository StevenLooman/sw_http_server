Smallworld HTTP Server - Raster tile server
===========================================

Introduction
------------

Small demo to serve raster tiles (png) from the Cambridge database. This is just a fun demo to show some possibilities and not - by far - production ready.

This demo is part of the sw_http_server product. Its license (GPLv3) applies to this module.

Missing functionality
---------------------

While this does serve tiles, this misses a lot of functionality. For example, no buffer around tiles is used. Labels and points (symbols) are cut off at the border. To fix this, enlarge the tile and cut the buffers around it later on.

Also, no caching of tiles is done. While this could be done in this demo, it might be a better idea to do this using a better set up. Something like [Varnish](https://www.varnish-cache.org/) might be usable.

Redundancy is also missing. To provide better availability, one should start multiple images, possibly on multiple servers and use a load balancer. For example, [HAProxy](http://www.haproxy.org/) can be used.

Furthermore, no legend is provided.

Nevertheless, Smallworld provides an excellent means to easily build a simple raster tile server.