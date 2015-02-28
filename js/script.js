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
    //Helper functions

function createMap() {
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
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    }

    //    google.maps.event.addListener(map, 'click', function (event) {
    //        var lat = event.latLng.k;
    //        var lng = event.latLng.D;
    //    });
    return map;
};

function createInfoWindow() {
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

function getAjaxFromURL(url, callback) {
    $.getJSON(url, function (data) {
        callback(data);
    }).error(function () {
        console.error("could not load data from " + url);
    });
};

function parseFourSquareResults(data) {
    if (typeof data !== "undefined" && typeof data.response !== "undefined" && typeof data.response !== "undefined") {
        var v = data.response.groups[0].items;
        for (p in v) {
            var venue = v[p].venue;
            if (typeof CODE_IS_UNDER_TEST === "undefined") {
                var m = new google.maps.Marker({
                    position: new google.maps.LatLng(venue.location.lat, venue.location.lng),
                    map: vm.map,
                    title: venue.name
                });
            }
            vm.places.push(new Place({
                id: venue.id,
                name: venue.name,
                phone: venue.contact.formattedPhone,
                address: venue.location.formattedAddress,
                lat: venue.location.lat,
                lng: venue.location.lng,
                url: venue.url,
                rating: venue.rating,
                marker: m
            }));

            createMarkerListener(m);
        }
    }
};

function getStreetViewContent() {
    var a = vm.currentPlace().details();
    for (d in a) {
        if (a[d].name === "Street View") {
            return;
        }
    }
    vm.currentPlace().details.push({
        name: "Street View",
        value: "<img src=\"" + GOOGLE_SV_BASE_URL + vm.currentPlace().lat() + "," + vm.currentPlace().lng() + "\" alt=\"Streetview image\" />"
    });
};

function processGoogleImageResults(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            if (place.name === vm.currentPlace().name()) {
                //                vm.currentPlace().googleplaceid = place.place_id;
                vm.currentPlace().ratings.push({
                    name: "Google Rating",
                    rating: place.rating
                });

                $(function () {
                    $('span.stars').stars();
                });
                vm.infoWindow.setContent($('#template').html());
                break;
            }
        }
    }
};

function createMarkerListener(m) {
    if (typeof CODE_IS_UNDER_TEST === "undefined") {
        google.maps.event.addListener(m, 'click', function () {
            for (p in vm.places()) {
                if (m === vm.places()[p].marker) {
                    vm.currentPlace(vm.places()[p]);
                }
            }


            //        vm.infoWindow.setContent(contentString);
            getStreetViewContent();

            $(function () {
                $('span.stars').stars();
            });

            vm.infoWindow.setContent($('#template').html());
            vm.infoWindow.open(vm.map, m);
            //var FLICKR_BASE_URL = "https://api.flickr.com/services/rest/?method=flickr.photos."        
            //"https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=536b7dd52fb0348e3cb6e94d02f94b95&text=texas+do+brasil&format=json&nojsoncallback=1&api_sig=e6dcd09ce52cb3b022676812edbfcf2d"
            var flickrAPI = FLICKR_BASE_URL + "search&jsoncallback=?";
            console.log("getting images from:" + flickrAPI);
            $.getJSON(flickrAPI, {
                text: vm.currentPlace().name(),
                lat: vm.currentPlace().lat(),
                lon: vm.currentPlace().lng(),
                format: "json",
                api_key: "536b7dd52fb0348e3cb6e94d02f94b95"
            })
                .done(function (data) {
                    var images = "";
                    var a = data.photos.photo;
                    var getSizesURL = FLICKR_BASE_URL + "getSizes&jsoncallback=?";
                    var photosExpected = a.length;
                    var photosReceived = 0;
                    for (var i in a) {
                        console.log("getting sizes from: " + getSizesURL);
                        $.getJSON(getSizesURL, {
                            photo_id: a[i].id,
                            format: "json",
                            api_key: "536b7dd52fb0348e3cb6e94d02f94b95"
                        })
                            .done(function (data) {
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
                                    vm.currentPlace().details.push({
                                        name: "Flickr",
                                        value: images
                                    });
                                    vm.infoWindow.setContent($('#template').html());
                                }
                            })
                            .fail(function (jqxhr, textStatus, error) {
                                var err = textStatus + ", " + error;
                                console.log("Sizes Request Failed: " + err);
                                console.log(jqxhr.responseText);
                            });
                    }
                })
                .fail(function (jqxhr, textStatus, error) {
                    var err = textStatus + ", " + error;
                    console.log("Photos Request Failed: " + err);
                    console.log(jqxhr.responseText);
                });
            var request = {
                location: new google.maps.LatLng(vm.currentPlace().lat(), vm.currentPlace().lng()),
                radius: '500',
                name: vm.currentPlace().name()
            };

            var service = new google.maps.places.PlacesService(vm.map);
            service.nearbySearch(request, processGoogleImageResults);
            //        setTimeout(function () {
            //
            //            vm.currentPlace().details.push({
            //                name: "Another View",
            //                value: "Some Other Content"
            //            });
            //            vm.infoWindow.setContent($('#template').html());
            //        }, 500);
        });
    }
}

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
        this.ratings.push({
            name: "Foursquare Rating",
            rating: data.rating / 2.0
        });
    }
    console.log("created place object: " + this.name() + " at " + this.lat() + "," + this.lng());
}

//View Model
var ViewModel = function () {
    var self = this;
    //    self.coder = new google.maps.Geocoder(); .. not needed until the "change neighborhood feature is implemented
    self.places = ko.observableArray([]);
    self.currentPlace = ko.observable();
    self.map = createMap();
    self.infoWindow = createInfoWindow();

    if (typeof CODE_IS_UNDER_TEST === "undefined") {
        var fourSquareURL = FOURSQUARE_BASE_URL + DEFAULT_LAT + "," + DEFAULT_LNG;
        getAjaxFromURL(fourSquareURL, parseFourSquareResults);
    }

}
var vm = new ViewModel();
ko.applyBindings(vm);


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
});

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