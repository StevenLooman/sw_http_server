mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpbG10dnA3NzY3OTZ0dmtwejN2ZnUycjYifQ.1W5oTOnWXQ9R1w8u3Oo1yA';

function buildMap() {
    var map = window.map = new mapboxgl.Map({
	container: 'map',
	zoom: 13,
	center: [0.131237, 52.202544],
	style: 'mapbox://styles/mapbox/streets-v8',
	hash: true
    });

    map.addControl(new mapboxgl.Navigation());
    map.addControl(new mapboxgl.Geolocate());
    
    map.on('click', onClick);
    map.on('moveend', updateTiles);
    map.on('zoomend', updateTiles);
    map.on('boxzoomend', updateTiles);
    map.on('dragend', updateTiles);

    function onClick(e) {
	var layers = [];
	for (var name in map.style._layers) {
	    var layer = map.getLayer(name);
	    if (layer.source !== 'geojson') {
		continue;
	    }
	    layers.push(layer.id);
	}

	var features = map.queryRenderedFeatures(e.point, { layers: layers });
	if (!features.length) {
	    return;
	}
	
	var feature = features[0];
	
	var html = "";
	for (var key in feature.properties) {
	    var value = feature.properties[key];
	    html += key + ": " + value + "<br/>";
	}
	var popup = new mapboxgl.Popup()
	    .setLngLat(map.unproject(e.point))
	    .setHTML(html)
	    .addTo(map);
    }

    map.on('load', function() {
	map.addSource('geojson', {
            "type": "geojson",
	    "data":  {"type": "FeatureCollection", "features": []}
	});

	map.addLayer({
            "id": "town",
            "type": "fill",
            "source": "geojson",
            "paint": {
		"fill-color": "#228888",
		"fill-outline-color": "#004444"
            },
	    "filter": ["all", ["==", "rwo_type", "town"], ["==", "app_type", "coverage"]]
	});
	map.addLayer({
            "id": "park",
            "type": "fill",
            "source": "geojson",
            "paint": {
		"fill-color": "#008800",
		"fill-outline-color": "#004400"
            },
	    "filter": ["all", ["==", "rwo_type", "park"], ["==", "app_type", "coverage"]]
	});
	map.addLayer({
            "id": "pl_of_interest__coverage",
            "type": "fill",
            "source": "geojson",
            "paint": {
		"fill-color": "#882222",
		"fill-outline-color": "#440000"
            },
	    "filter": ["all", ["==", "rwo_type", "pl_of_interest"], ["==", "app_type", "coverage"]]
	});
	map.addLayer({
            "id": "drafting_areas",
            "type": "fill",
            "source": "geojson",
            "paint": {
		"fill-color": "#222288",
		"fill-outline-color": "#000088"
            },
	    "filter": ["all", ["==", "rwo_type", "drafting_areas"], ["==", "app_type", "area_10"]]
	});

	map.addLayer({
            "id": "motorway",
            "type": "line",
            "source": "geojson",
            "paint": {
		"line-color": "#111111",
		"line-width": 8
            },
	    "filter": ["all", ["==", "rwo_type", "motorway"], ["==", "app_type", "centre_line"]]
	});
	map.addLayer({
            "id": "trunk_road",
            "type": "line",
            "source": "geojson",
            "paint": {
		"line-color": "#222222",
		"line-width": 6
            },
	    "filter": ["all", ["==", "rwo_type", "trunk_road"], ["==", "app_type", "centre_line"]]
	});
	map.addLayer({
            "id": "min_road",
            "type": "line",
            "source": "geojson",
            "paint": {
		"line-color": "#444444",
		"line-width": 4
            },
	    "filter": ["all", ["==", "rwo_type", "min_road"], ["==", "app_type", "centre_line"]]
	});
	map.addLayer({
            "id": "footpath",
            "type": "line",
            "source": "geojson",
            "paint": {
		"line-color": "#666666",
		"line-width": 2
            },
	    "filter": ["all", ["==", "rwo_type", "footpath"], ["==", "app_type", "centre_line"]]
	});
	map.addLayer({
            "id": "road_annotation",
            "type": "symbol",
            "source": "geojson",
            "layout": {
		"text-field": "{label}"
            },
	    "filter": ["all", ["==", "rwo_type", "road_annotation"], ["==", "app_type", "annotation"]]
	});

	map.addLayer({
            "id": "pl_of_interest__location",
            "type": "circle",
            "source": "geojson",
            "paint": {
		"circle-radius": 10,
		"circle-color": "#882288"
            },
	    "filter": ["all", ["==", "rwo_type", "pl_of_interest"], ["==", "app_type", "location"]]
	});
	map.addLayer({
            "id": "pub_rest",
            "type": "circle",
            "source": "geojson",
            "paint": {
		"circle-radius": 10,
		"circle-color": "#3887be"
            },
	    "filter": ["all", ["==", "rwo_type", "pub_rest"], ["==", "app_type", "location"]]
	});
/*
	map.addLayer({
            "id": "fills",
            "type": "fill",
            "source": "geojson",
            "paint": {
		"fill-color": "#882222",
		"fill-outline-color": "#"
            },
	    "filter": ["==", "$type", "Polygon"]
	});
	map.addLayer({
            "id": "lines",
            "type": "line",
            "source": "geojson",
            "paint": {
		"line-width": 4,
		"line-color": "#AA2222"
            },
	    "filter": ["==", "$type", "LineString"]
	});
	map.addLayer({
            "id": "points",
            "type": "circle",
            "source": "geojson",
            "paint": {
		"circle-radius": 10,
		"circle-color": "#FF2222"
            },
	    "filter": ["==", "$type", "Point"]
	});
*/

	setTimeout(function() {	map.fire('moveend'); }, 250);
   });

    function updateTiles(data) {
        var tileUrlTemplate = "http://localhost:8085/geojson_tile?zoom={z}&x={x}&y={y}";
        var map = data.target;
        var source = map.getSource('geojson');
        var fetchQueue = source.fetchQueue = source.fetchQueue || [];

        // Use pyramid of GeoJSON source.
        var pyramid = source._pyramid;
        var visibleTileCoords = source.getVisibleCoordinates();

        // Fetch GeoJSON-tile and store GeoJSON-data at pyramid-tile, if not already fetched.
        for (var i = 0; i < visibleTileCoords.length; ++i) {
	    var tileCoord = visibleTileCoords[i];
	    var tile = source.getTile(tileCoord);
	    
	    if (tile.xhr !== undefined) {
                // Already fetching
                continue;
	    }
	    
	    // Always re-fetch, could optimize this, but ok for now...
            var tileUrl = tileUrlTemplate
		.replace('{z}', tile.coord.z)
		.replace('{x}', tile.coord.x)
		.replace('{y}', tile.coord.y);
	    
            // Queue fetch of geojson data
            fetchQueue.push(tile);
            tile.xhr = mapboxgl.util.getJSON(tileUrl, fetched.bind(source, tile));
        }

        // After fetching all, combine GeoJSON from visible tiles.
        function fetched(tile, err, data) {
	    // remove from queue
	    var i = fetchQueue.indexOf(tile);
	    fetchQueue.splice(i, 1);
	    delete tile.xhr;

	    if (!err) {
                // set data at tile
                tile.geoJson = data;
	    } else {
                source.fire('error', {error: err});
	    }

	    // all data fetched?
	    if (!fetchQueue.length) {
                loadFetchedTiles();
	    }
        };

        // setData at GeoJSON source.
        var geoJson = {"type": "FeatureCollection", "features": []};
        var features = geoJson.features;
        function loadFetchedTiles() {
	    for (var i = 0; i < visibleTileCoords.length; ++i) {
                var tileCoord = visibleTileCoords[i];
                var tile = source.getTile(tileCoord);

                // do we actually have data?
                if (!tile || !tile.geoJson) {
		    continue;
                }

                for (var j = 0; j < tile.geoJson.features.length; ++j) {
		    var feature = tile.geoJson.features[j];
		    features.push(feature);
                }
	    }

	    // flip buffer
	    source.setData(geoJson);
        }
    }
}