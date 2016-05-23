Smallworld HTTP Server - Raster tile server
===========================================

Introduction
------------

Small demo to serve GeoJSON tiles from the Cambridge database. This is just a fun demo to show some possibilities and not - by far - production ready.

Load `load.magik` from the product, then `run.magik` in this module, and finally browse to the [Client](http://localhost:8085/client/index.html).

This demo is part of the sw_http_server product. Its license (GPLv3) applies to this module.

Missing functionality
---------------------

While this does serve tiles, this misses a lot of functionality. Different geometry types are identifiable by `rwo_type` and `app_type`, but any custom styles are not incorporated. This demo can be extended to incorporate this, however.

Also, no caching of tiles is done. While this could be done in this demo, it might be a better idea to do this using a better set up. Something like [Varnish](https://www.varnish-cache.org/) might be usable.

Redundancy is also missing. To provide better availability, one should start multiple images, possibly on multiple servers and use a load balancer. For example, [HAProxy](http://www.haproxy.org/) can be used.

Nevertheless, Smallworld provides an excellent means to easily build a simple GeoJSON tile server.
