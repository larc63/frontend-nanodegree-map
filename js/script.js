//http://www.uiparade.com/portfolio/natural-search-bar/
//http://www.w3schools.com/googleapi/tryit.asp?filename=tryhtml_map_marker_infowindow
//http://www.w3schools.com/googleapi/tryit.asp?filename=tryhtml_map_marker_infowindow2
//http://stackoverflow.com/questions/9309251/google-maps-javascript-api-get-gps-coordinates-from-address
//https://github.com/danceoval/neighborhood/blob/master/index.html
//https://github.com/DawoonC/dw-neighborhood/blob/master/templates/js/app.js
// stars from http://stackoverflow.com/questions/1987524/turn-a-number-into-star-rating-display-using-jquery-and-css
// 4 square from https://developer.foursquare.com/docs/venues/search
// to convert to data uri http://websemantics.co.uk/online_tools/image_to_data_uri_convertor/
// fiddle for the modal http://jsfiddle.net/y5g8zg1b/24/
// slide in panel from http://codyhouse.co/gem/css-slide-in-panel/
// fiddle for the slide in panel http://jsfiddle.net/8fzz7ud1/
//  -- >>>  fiddle for a simplified slide in panel http://jsfiddle.net/7L8hgp8v/17/   <<<< ---- 
// tab view http://codyhouse.co/gem/responsive-tabbed-navigation/
// http://stackoverflow.com/questions/6794405/trigger-google-maps-marker-click
// better, lighter tabs: http://css-tricks.com/functional-css-tabs-revisited/
// interesting take on slides; http://jsfiddle.net/jacobdubail/bKaxg/7/
// image gallery from here http://www.elated.com/articles/elegant-sliding-image-gallery-with-jquery/
// https://developers.google.com/maps/documentation/javascript/reference#PlaceResult -- get the place id so that  we can get the photos afterwards
// coverage only works in a server-ed mode

//Globals
var DEFAULT_LAT = 32.9531079;
var DEFAULT_LNG = -96.8229146;
var DEFAULT_ZOOM = 17;
var FOURSQUARE_BASE_URL = "https://api.foursquare.com/v2/venues/explore?oauth_token=C5YVRDGQGZLXH2SVONVBTXHZRYDBDDO4B5JLHQYEENJSFWS4&v=20150223&ll="; //
var GOOGLE_SV_BASE_URL = 'http://maps.googleapis.com/maps/api/streetview?size=640x400&location=';
var FLICKR_BASE_URL = "https://api.flickr.com/services/rest/?method=flickr.photos."
var FLICKR_API_KEY = "28388cd732250dfd1cfbd8168b077536";
//Helper functions

function getAjaxFromURL(url, extraparams, callback) {
    $.getJSON(url, extraparams)
        .done(function (data) {
            callback(data);
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Ajax Request Failed: " + err);
            console.log(jqxhr.responseText);
        });
};

//Model: Place

var Place = function (data) {
    this.id = data.id;
    //    this.googleplaceid = "";
    this.name = ko.observable(data.name);
    if (data.address) {
        this.address = ko.observable("");
        for (a in data.address) {
            if (a < data.address.length - 1) {
                this.address(this.address() + data.address[a] + "<br/>");
            } else {
                this.address(this.address() + data.address[a]);
            }

        }
    }

    this.phone = ko.observable(data.phone);
    this.url = ko.observable(data.url);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.marker = data.marker;
    this.selectedTab = ko.observable();
    this.details = ko.observableArray([]);
    this.ratings = ko.observableArray([]);
    if (data.rating) {
        this.ratings.push(data.rating);
    }

    console.log("created place object: " + this.name() + " at " + this.lat() + "," + this.lng());
}

//View Model
var ViewModel = function () {
    var self = this;

    self.createMap = function () {
        var mapOptions = {
                center: {
                    lat: DEFAULT_LAT,
                    lng: DEFAULT_LNG
                },
                zoom: DEFAULT_ZOOM,
                zoomControl: false,
                panControl: false,
                streetViewControl: false
            },
            map;
        if (typeof CODE_IS_UNDER_TEST === "undefined") {
            self.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        }

    };

    self.createInfoWindow = function () {
        var contentString = '';
        console.log(contentString);
        if (typeof CODE_IS_UNDER_TEST === "undefined") {
            return new google.maps.InfoWindow({
                content: contentString
            });
        } else {
            return undefined;
        }
    };

    self.updateMarkerInformation = function () {
        //update the stars' position
        $('span.stars').stars();
        //update/copy the template into the marker's infowindow
        self.infoWindow.setContent($('#template').html());
    }

    self.processGoogleImageResults = function (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var place = results[i];
                if (place.name === vm.currentPlace().name()) {
                    //                vm.currentPlace().googleplaceid = place.place_id;
                    self.currentPlace().ratings.push({
                        name: "Google Rating",
                        rating: place.rating
                    });

                    $('span.stars').stars();
                    self.infoWindow.setContent($('#template').html());
                    break;
                }
            }
        }
    };

    self.getGooglePlacesInfo = function () {
        var request = {
            location: new google.maps.LatLng(self.currentPlace().lat(), self.currentPlace().lng()),
            radius: '500',
            name: self.currentPlace().name()
        };

        var service = new google.maps.places.PlacesService(self.map);
        service.nearbySearch(request, self.processGoogleImageResults);
    };

    self.parseFlickrImages = function (data) {
        var images = "";
        if (typeof data !== "undefined" && typeof data.photos !== "undefined" && typeof data.photos.photo !== "undefined") {
            var a = data.photos.photo;
            var getSizesURL = FLICKR_BASE_URL + "getSizes&jsoncallback=?";
            var photosExpected = a.length;
            var photosReceived = 0;
            for (var i in a) {
                //            console.log("getting sizes from: " + getSizesURL);
                getAjaxFromURL(getSizesURL, {
                    photo_id: a[i].id,
                    format: "json",
                    api_key: FLICKR_API_KEY
                }, function (data) {
                    var sizes = data.sizes.size;
                    var availableSizes = [];
                    var sizeIndex = -1;
                    photosReceived++;
                    for (var s in sizes) {
                        availableSizes.push(sizes[s].label);
                    }
                    sizeIndex = availableSizes.indexOf("Medium");
                    if (sizeIndex === -1) {
                        sizeIndex = availableSizes.indexOf("Medium 640");
                    }
                    if (sizeIndex === -1) {
                        sizeIndex = availableSizes.indexOf("Medium 800");
                    }
                    if (sizeIndex !== -1) {
                        images += "<img src=\"" + sizes[sizeIndex].source + "\" />";
                    }

                    if (photosReceived === photosExpected) {
                        self.currentPlace().details.push({
                            name: "Flickr",
                            value: images
                        });
                        self.infoWindow.setContent($('#template').html());
                    }
                });
            }
        }
    };

    self.getFlickrImages = function () {
        var flickrAPI = FLICKR_BASE_URL + "search&jsoncallback=?";
        //    console.log("getting images from:" + flickrAPI);
        getAjaxFromURL(flickrAPI, {
            text: self.currentPlace().name(),
            lat: self.currentPlace().lat(),
            lon: self.currentPlace().lng(),
            format: "json",
            api_key: FLICKR_API_KEY
        }, self.parseFlickrImages);
    };

    self.markerClickListener = function (m) {
        for (p in self.places()) {
            if (m === self.places()[p].marker) {
                self.currentPlace(self.places()[p]);
            }
        }
        $("tab input").prop("checked", true).change();
//        self.currentPlace().selectedTab("tab0");
        self.updateMarkerInformation();
        self.infoWindow.open(self.map, m);
        self.getFlickrImages();

        self.getGooglePlacesInfo();
    };

    self.createMarkerListener = function (m) {
        if (typeof CODE_IS_UNDER_TEST === "undefined") {
            google.maps.event.addListener(m, 'click', function () {
                self.markerClickListener(m)
            });
        }
    }
    self.parseFourSquareResults = function (data) {
        if (typeof data !== "undefined" && typeof data.response !== "undefined" && typeof data.response !== "undefined") {
            var v = data.response.groups[0].items;
            for (p in v) {
                var venue = v[p].venue;
                if (typeof CODE_IS_UNDER_TEST === "undefined") {
                    var m = new google.maps.Marker({
                        position: new google.maps.LatLng(venue.location.lat, venue.location.lng),
                        map: self.map,
                        title: venue.name
                    });
                }
                var p = new Place({
                    id: venue.id,
                    name: venue.name,
                    phone: venue.contact.formattedPhone,
                    address: venue.location.formattedAddress,
                    lat: venue.location.lat,
                    lng: venue.location.lng,
                    url: venue.url,
                    rating: {
                        name: "Foursquare Rating",
                        rating: (venue.rating / 2.0)
                    },
                    marker: m
                });
                self.places.push(p);
                p.details.push({
                    name: "Street View",
                    value: "<img src=\"" + GOOGLE_SV_BASE_URL + p.lat() + "," + p.lng() + "\" alt=\"Streetview image\" />"
                });

                self.createMarkerListener(m);
            }
        }
    };
    self.getFourSquareInformation = function () {
        var fourSquareURL = FOURSQUARE_BASE_URL + DEFAULT_LAT + "," + DEFAULT_LNG;
        getAjaxFromURL(fourSquareURL, undefined, self.parseFourSquareResults);
    }

    //    self.coder = new google.maps.Geocoder(); .. not needed until the "change neighborhood feature is implemented
    self.places = ko.observableArray([]);
    self.currentPlace = ko.observable();
    self.createMap();
    self.infoWindow = self.createInfoWindow();

    var isListVisible = false;
    jQuery(document).ready(function ($) {
        //open the lateral panel
        $('.list-btn').on('click', function (event) {
            event.preventDefault();
            if (!isListVisible) {
                $('.list-panel').addClass('is-visible');
                $('.list-btn').text('[-]');
            } else {
                $('.list-panel').removeClass('is-visible');
                $('.list-btn').text('[+]');
            }
            isListVisible = !isListVisible;
        });

        if (typeof CODE_IS_UNDER_TEST === "undefined") {
            self.getFourSquareInformation();
        }
    });

}
var vm = new ViewModel();
ko.applyBindings(vm);

$.fn.stars = function () {
    return $(this).each(function () {
        // Get the value
        var val = parseFloat($(this).html());
        // Make sure that the value is in 0 - 5 range, multiply to get width
        var size = Math.max(0, (Math.min(5, val))) * 16;
        // Create stars holder
        var $span = $('<span />').width(size);
        // Replace the numerical value with stars
        $(this).html($span);
    });
}