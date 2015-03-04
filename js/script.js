//Globals

/**
 * Default latitude for the map
 * @property DEFAULT_LAT
 * @type {number}
 * @const
 */
var DEFAULT_LAT = 32.9531079;
/**
 * Default longitude for the map
 * @property DEFAULT_LNG
 * @type {number}
 * @const
 */
var DEFAULT_LNG = -96.8229146;
/**
 * Default zoo, for the map
 * @property DEFAULT_ZOOM
 * @type {integer}
 * @const
 */
var DEFAULT_ZOOM = 15;
/**
 * URL for accessing the foursquare api
 * @property FOURSQUARE_BASE_URL
 * @type {string}
 * @const
 */
var FOURSQUARE_BASE_URL = "https://api.foursquare.com/v2/venues/explore?oauth_token=C5YVRDGQGZLXH2SVONVBTXHZRYDBDDO4B5JLHQYEENJSFWS4&v=20150223&ll=";
/**
 * URL for accessing the google street view api
 * @property GOOGLE_SV_BASE_URL
 * @type {string}
 * @const
 */
var GOOGLE_SV_BASE_URL = 'http://maps.googleapis.com/maps/api/streetview?size=640x400&location=';
/**
 * URL for accessing the flickr api
 * @property FLICKR_BASE_URL
 * @type {string}
 * @const
 */
var FLICKR_BASE_URL = "https://api.flickr.com/services/rest/?method=flickr.photos.";
/**
 * API Key for this application on the flickr API garden
 * @property FLICKR_API_KEY
 * @type {string}
 * @const
 */
var FLICKR_API_KEY = "28388cd732250dfd1cfbd8168b077536";

/** 
 * getAjaxFromURL Helper function to centralize ajax error handling to a single place
 * @param url the url to access for getting the json respone
 * @param extraparams additional parameters for the request
 * @param callback the function that will be called upon a successfull completion
 **/
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

/** 
 * Place
 * This is the model part of the MVVC
 * @param data an object from which the Place object will be built
 * @constructor
 **/
var Place = function (data) {
    /**
     * Place id, taken from the foursquare information
     * @property id
     * @type {string}
     */
    this.id = data.id;
    /**
     * Place name
     * @property name
     * @type {string}
     */
    this.name = ko.observable(data.name);
    /**
     * Place address
     * @property address
     * @type {string}
     */
    this.address = ko.observable("");
    if (data.address) {
        for (a in data.address) {
            if (a < data.address.length - 1) {
                this.address(this.address() + data.address[a] + "<br/>");
            } else {
                this.address(this.address() + data.address[a]);
            }

        }
    }

    /**
     * Place phone
     * @property phone
     * @type {string}
     */
    this.phone = ko.observable(data.phone);
    /**
     * Place url
     * @property url
     * @type {string}
     */
    this.url = ko.observable(data.url);
    /**
     * Place latitude
     * @property lat
     * @type {string}
     */
    this.lat = ko.observable(data.lat);
    /**
     * Place longitude
     * @property lng
     * @type {string}
     */
    this.lng = ko.observable(data.lng);
    /**
     * Place marker
     * @property object
     * @type {object}
     */
    this.marker = data.marker;
    /**
     * Place selectedTab
     * @property selectedTab
     * @type {string}
     */
    this.selectedTab = ko.observable();
    /**
     * Place details array
     * @property details
     * @type {array}
     */
    this.details = ko.observableArray([]);
    /**
     * Place ratings array
     * @property ratings
     * @type {array}
     */
    this.ratings = ko.observableArray([]);
    if (data.rating) {
        this.ratings.push(data.rating);
    }

    //    console.log("created place object: " + this.name() + " at " + this.lat() + "," + this.lng());
}

/** 
 * View Model
 * This is the viewmodel part of the MVVC
 * @param data an object from which the Place object will be built
 * @constructor
 **/
var ViewModel = function () {
    /**
     * ViewModel self reference
     * @property self
     * @type {object}
     */
    var self = this;
    /** 
     * createMap Helper function to create the google map instance, it sets the map options as required
     * @param callback the function that will be called upon a successfull completion
     **/
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

    /** 
     * createInfoWindow Helper function to create the google infoWindow instance, it sets the map options as required
     * @return a newly created infoWindow with the content set to an empty string
     **/
    self.createInfoWindow = function () {
        console.log('');
        if (typeof CODE_IS_UNDER_TEST === "undefined") {
            return new google.maps.InfoWindow({
                content: ''
            });
        } else {
            return undefined;
        }
    };

    self.isListVisible = ko.observable(false);
    self.isListVisible.subscribe(function () {
        if (self.isListVisible()) {
            $('.list-panel').addClass('is-visible');
            $('.list-btn').text('[-]');
        } else {
            $('.list-panel').removeClass('is-visible');
            $('.list-btn').text('[+]');
        }
        //        self.isListVisible(!self.isListVisible());
    });
    /** 
     * updateMarkerInformation Helper function to update the infoWindow content, stars and selected tab (workaround) included
     **/
    self.updateMarkerInformation = function () {
        //update the stars' position
        $('span.stars').stars();
        //update/copy the template into the marker's infowindow
        self.infoWindow.setContent($('#template').html());
        // knockoutjs was giving some grief, but forcing it through jquery seems to work
        setTimeout(function () {
            if (self.currentPlace().selectedTab() === undefined) {
                $("#tab0").prop("checked", true);
            }
        }, 0);
    }

    /** 
     * createMap Helper function to create the google map instance, it sets the map options as required
     * @param results the json object that contains the service's response
     * @param status the status of the request
     **/
    self.processGoogleImageResults = function (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var place = results[i];
                if (place.name === self.currentPlace().name()) {
                    self.currentPlace().ratings.push({
                        name: "Google Rating",
                        rating: place.rating
                    });

                    self.updateMarkerInformation();
                    break;
                }
            }
        }
    };
    /** 
     * getGooglePlacesInfo function that calls the google places api to get the google rating
     **/
    self.getGooglePlacesInfo = function () {
        var hasGooglePlacesInfo = false;
        //check if the google rating has already been added to the place's ratings
        for (p in self.currentPlace().ratings()) {
            if (self.currentPlace().ratings()[p].name === "Google Rating") {
                hasGooglePlacesInfo = true;
                break;
            }
        }
        //if not, request it
        if (!hasGooglePlacesInfo) {
            var request = {
                location: new google.maps.LatLng(self.currentPlace().lat(), self.currentPlace().lng()),
                radius: '500',
                name: self.currentPlace().name()
            };

            var service = new google.maps.places.PlacesService(self.map);
            service.nearbySearch(request, self.processGoogleImageResults);
        }
    };

    /** 
     * parseFlickrImages Helper function to parse through the flickr search result, requesting the image's
     * other sizes in order to link to the appropriate image in the flickr tab
     * @param data the response from the json call
     **/
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
                    //make sure medium-or-slightly larger size is available
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
                    // when all expected photos have been processed, add the detail to the current place
                    if (photosReceived === photosExpected) {
                        self.currentPlace().details.push({
                            name: "Flickr",
                            value: images
                        });
                        self.updateMarkerInformation();
                    }
                });
            }
        }
    };

    /** 
     * getFlickrImages Helper function to request images from near the selected marker
     **/
    self.getFlickrImages = function () {
        //Check if the Flickr detail has been added
        var hasFlickr = false;
        for (p in self.currentPlace().details()) {
            if (self.currentPlace().details()[p].name === "Flickr") {
                hasFlickr = true;
                break;
            }
        }
        // if the flickr section has not been added, make the search on the flickr api
        if (!hasFlickr) {
            var flickrAPI = FLICKR_BASE_URL + "search&jsoncallback=?";
            //    console.log("getting images from:" + flickrAPI);
            getAjaxFromURL(flickrAPI, {
                text: self.currentPlace().name(),
                lat: self.currentPlace().lat(),
                lon: self.currentPlace().lng(),
                format: "json",
                api_key: FLICKR_API_KEY
            }, self.parseFlickrImages);
        }
    };

    /** 
     * markerClickListener function that will be registered as the listener for when a marker is clicked. This
     * function opens the infoWindow, closes the list if it's open and starts gathering the detail information
     * @param m the marker that's been clicked
     **/
    self.markerClickListener = function (m) {
        for (p in self.places) {
            if (m === self.places[p].marker) {
                self.currentPlace(self.places[p]);
            }
        }
        $("tab input").prop("checked", true).change();
        //        self.currentPlace().selectedTab("tab0");
        self.updateMarkerInformation();
        self.isListVisible(false);
        self.infoWindow.open(self.map, m);

        self.getFlickrImages();
        self.getGooglePlacesInfo();
    };

    /** 
     * createMarkerListener function that will register the listener for the marker
     * @param m the marker that's being registered
     **/
    self.createMarkerListener = function (m) {
        if (typeof CODE_IS_UNDER_TEST === "undefined") {
            google.maps.event.addListener(m, 'click', function () {
                self.markerClickListener(m)
            });
        }
    }
    /** 
     * parseFourSquareResults function that parses the results of the foursquare search
     * @param data the json result from searching on foursquare
     **/
    self.parseFourSquareResults = function (data) {
        if (typeof data !== "undefined" && typeof data.response !== "undefined" && typeof data.response !== "undefined") {
            for (g in data.response.groups) {
                var v = data.response.groups[g].items;
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
                    self.filteredPlaces.push(p);
                    p.details.push({
                        name: "Street View",
                        value: "<img src=\"" + GOOGLE_SV_BASE_URL + p.lat() + "," + p.lng() + "\" alt=\"Streetview image\" />"
                    });

                    self.createMarkerListener(m);
                }
            }
        } else {
            alert("Could not load default places");
        }
    };
    /*
     * getFourSquareInformation function that requests the venue information around the selected coordinates
     */
    self.getFourSquareInformation = function () {
        var fourSquareURL = FOURSQUARE_BASE_URL + DEFAULT_LAT + "," + DEFAULT_LNG;
        getAjaxFromURL(fourSquareURL, undefined, self.parseFourSquareResults);
    }

    /**
     * Places array
     * @property places
     * @type {array}
     */
    self.places = [];
    /**
     * filteredPlaces
     * @property filteredPlaces
     * @type {array}
     */
    self.filteredPlaces = ko.observableArray([]);
    /**
     * currentPlace
     * @property currentPlace
     * @type {array}
     */
    self.currentPlace = ko.observable();
    self.createMap();

    /**
     * infoWindow
     * @property infoWindow
     * @type {object}
     */
    self.infoWindow = self.createInfoWindow();

    /**
     * searcValue
     * @property searchValue
     * @type {string}
     */
    self.searchValue = ko.observable();

    // Ask to be notified every time the bindings are triggered (key down in this case)
    self.searchValue.subscribe(function () {
        self.filteredPlaces.removeAll();
        if (self.searchValue !== '') {
            for (p in self.places) {
                var name = self.places[p].name().toLowerCase();
                //check if the search term is contained within the place's name
                if (name.indexOf(self.searchValue().toLowerCase()) > -1) {
                    self.places[p].marker.setMap(self.map);
                    self.filteredPlaces.push(self.places[p]);
                } else { //if not, remove the marker
                    self.places[p].marker.setMap(undefined);
                }
            }
        } else {
            self.filteredPlaces(self.places.slice(0));
        }
    });

    /**
     * clickOnMarker callback for when a place is clicked on in the list, triggers
     * the click event for the marker, opening the infoWindo on it's location and
     * with it's information
     * @params place the place object that's been clicked on
     */
    self.clickOnMarker = function (place) {
        new google.maps.event.trigger(place.marker, 'click');
    };

    self.clickOnListButton = function () {
        self.isListVisible(!self.isListVisible());
    };

    jQuery(document).ready(function ($) {
        if (typeof CODE_IS_UNDER_TEST === "undefined") {
            self.getFourSquareInformation();
        }
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
    });

}
var vm = new ViewModel();
ko.applyBindings(vm);