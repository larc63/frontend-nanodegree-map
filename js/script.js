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
//
//var NYT_KEY = "1b5ac26e8f1655981150f5e4d70bab71:9:70863163";	
//var NYT_BASE_URL = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=";
//
//function loadData() {
//
//    var $body = $('body');
//    var $wikiElem = $('#wikipedia-links');
//    var $nytHeaderElem = $('#nytimes-header');
//    var $nytElem = $('#nytimes-articles');
//    var $greeting = $('#greeting');
//    var $street = $('#street');
//    var $city = $('#city');
//    
//    // clear out old data before new request
//    $wikiElem.text("");
//    $nytElem.text("");
//
//    // load streetview
//    var streetStr = $street.val();
//    var cityStr = $city.val();
//    var address = streetStr + ', ' + cityStr;
//    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=640x400&location=' + encodeURI(address) + '';
//    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');
//    
//    // YOUR CODE GOES HERE!
//
//    return false;
//};
//
//$('#form-container').submit(loadData);
//
////loadData();
//
//$.getJSON(NYT_BASE_URL + "obama&api-key=" + NYT_KEY, function (data) {
//    var items = [];
//    var articles = data.response.docs;
//
//    $.each(articles, function (key, val) {
//        items.push("<li id='" + articles[key]._id + "' class='article'><a href='" + articles[key].web_url + "'>" + articles[key].headline.main + "</a><p>" + articles[key].snippet + "</p></li>");
//    });
//
//    $("<ul/>", {
//        html: items.join("")
//    }).appendTo("#nytimes-articles");
//}).error(function () {
//    $("<p>NYT Articles Could not be loaded</p>").appendTo("#nytimes-articles");
//});
//
//
//(function() {
//  var $wikiElem = $('#wikipedia-links');
//  var wikiRequestTimeout = setTimeout(function(){
//    $wikiElem.text("failed to get wikipedia resources");
//  }, 8000);
//  var flickerAPI = "http://en.wikipedia.org/w/api.php?format=json&action=opensearch&search=Obama";
//  $.ajax( {
//    url: flickerAPI,
//    dataType:'jsonp',
//    type:'POST',
//    success: function(data){
//      var articleList = data[1];
//      for(var i = 0; i< articleList.length; i++){
//	var url = 'http://en.wikipedia.org/wiki/' + articleList[1];
//	$wikiElem.append('<li><a href="' + url + '">' + articleList[1] + '</a></li>');
//      }
//      clearTimeout(wikiRequestTimeout);
//    },
//    headers: { 'Api-User-Agent-Udacity': 'Example/1.0' }
//});
//})();

//Globals
var DEFAULT_LAT = 32.9531079;
var DEFAULT_LNG = -96.8229146;
var DEFAULT_ZOOM = 17;
var FOURSQUARE_BASE_URL = "https://api.foursquare.com/v2/venues/explore?oauth_token=C5YVRDGQGZLXH2SVONVBTXHZRYDBDDO4B5JLHQYEENJSFWS4&v=20150223&ll="; //
var GOOGLE_SV_BASE_URL = 'http://maps.googleapis.com/maps/api/streetview?size=640x400&location=';

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
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    //    google.maps.event.addListener(map, 'click', function (event) {
    //        var lat = event.latLng.k;
    //        var lng = event.latLng.D;
    //    });
    return map;
};

function createInfoWindow() {
    var contentString = '<div></div>';
    console.log(contentString);
    return new google.maps.InfoWindow({
        content: contentString
    });
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
            var m = new google.maps.Marker({
                position: new google.maps.LatLng(venue.location.lat, venue.location.lng),
                map: vm.map,
                title: venue.name
            });

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

function createMarkerListener(m) {
    google.maps.event.addListener(m, 'click', function () {
        for (p in vm.places()) {
            if (m === vm.places()[p].marker) {
                vm.currentPlace(vm.places()[p]);
            }
        }


        //        vm.infoWindow.setContent(contentString);
        getStreetViewContent();

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
        $(function () {
            $('span.stars').stars();
        });
        
        vm.infoWindow.setContent($('#template').html());
        vm.infoWindow.open(vm.map, m);
    });
}

//Model: Content
var SimpleContent = function (data) {
    this.name = ko.observable();
    this.value = ko.observable();
    this.computedValue = ko.computed(function () {
        return this.value();
    }, this);
}

var GalleryContent = function (data) {
    this.name = ko.observable();
    this.values = ko.observableArray([]);
    this.computedValue = ko.computed(function () {
        var retVal = new Array();
        var valuesArray = this.values();
        for (v in valuesArray) {
            retVal.push("<img src=\'");
            retVal.push(vauluesArray[v]);
            retVal.push("\' />\n");
        }

    }, this);
};

//Model: Place

var Place = function (data) {
    this.id = ko.observable(data.id);
    this.name = ko.observable(data.name);
    if (data.address) {
        this.address = ko.observable("");
        for (a in data.address) {
            this.address(this.address() + data.address[a] + "<br/>");
        }
    }

    this.phone = ko.observable(data.phone);
    this.url = ko.observable(data.url);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.marker = data.marker;
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
    self.dummy = ko.observable("Hello");
    self.places = ko.observableArray([]);
    self.markers = ko.observableArray([]);
    self.currentPlace = ko.observable();
    self.map = createMap();
    self.infoWindow = createInfoWindow();

    var fourSquareURL = FOURSQUARE_BASE_URL + DEFAULT_LAT + "," + DEFAULT_LNG;

    getAjaxFromURL(fourSquareURL, parseFourSquareResults);


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