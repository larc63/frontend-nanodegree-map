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
//  -- >>>  fiddle for a simplified slide in panel http://jsfiddle.net/7L8hgp8v/15/   <<<< ---- 
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
var FOURSQUARE_BASE_URL = "https://api.foursquare.com/v2/venues/search?oauth_token=C5YVRDGQGZLXH2SVONVBTXHZRYDBDDO4B5JLHQYEENJSFWS4&v=20150223&ll="; //

//Model: Place

var Place = function (data) {
    this.id = data.id;
    this.name = data.name;
    this.address = data.address;
    this.phone = data.phone;
    this.lat = data.lat;
    this.lng = data.lng;
    this.marker = data.marker;

    console.log("created place object: " + this.name);
}

//View Model
var ViewModel = function () {
    var self = this;
    function createInfoWindow() {
        var contentString = '<div class=\'place-pop-up\'>' +
            '        <div class=\'place-title\'>' +
            '            <div class=\'place-name\'>Name</div>' +
            '        </div>' +
            '        <div>Some Address</div>' +
            '        <div>website</div>' +
            '        <div>Google Rating:' +
            '            <div class=\'numericrating\'><span class=\'stars\'>3.6</span> 3.6</div>' +
            '        </div>' +
            '        <div>Yelp Rating:' +
            '            <div class=\'numericrating\'><span class=\'stars\'>3.6</span> 3.6</div>' +
            '        </div>' +
            '        <div class=\'tabs\'>' +
            '            <div class=\'tab\'>' +
            '                <input type=\'radio\' id=\'tab-1\' name=\'tab-group-1\' checked />' +
            '                <label for=\'tab-1\'>Street View</label>' +
            '                <div class=\'tab-content\'>' +
            '                    <div id=\'galleryContainer\'>' +
            '                        <div id=\'gallery\'>' +
            '                            <img src=\'http://placehold.it/350x350\' alt=\'Barbed Wire\' height=\'128px\' />' +
            '                        </div>' +
            '                    </div>' +
            '                </div>' +
            '            </div>' +
            '            <div class=\'tab\'>' +
            '                <input type=\'radio\' id=\'tab-2\' name=\'tab-group-1\' />' +
            '                <label for=\'tab-2\'>Tab Two</label>' +
            '                <div class=\'tab-content\'>stuff 2</div>' +
            '            </div>' +
            '        </div>' +
            '    </div>';

        return infowindow = new google.maps.InfoWindow({
            content: contentString
        });
    };

    //    self.coder = new google.maps.Geocoder(); .. not needed until the "change neighborhood feature is implemented
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
    self.places = ko.observableArray([]);
    self.markers = ko.observableArray([]);
    self.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    self.infoWindow = createInfoWindow();

    self.centerMarker = new google.maps.Marker({
        position: new google.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG),
        map: self.map,
        title: 'Click to zoom'
    });

    google.maps.event.addListener(self.map, 'click', function (event) {
        var lat = event.latLng.k;
        var lng = event.latLng.D;
    });

    google.maps.event.addListener(self.map, 'center_changed', function () {
        // 3 seconds after the center of the map has changed, pan back to the
        // marker.
        window.setTimeout(function () {
            self.map.panTo(self.centerMarker.getPosition());
        }, 1000);
    });

    function createMarkerListener(m) {
        google.maps.event.addListener(m, 'click', function () {
            infowindow.open(self.map, m);
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
        });
    }

    self.parseFourSquareResults = function (data) {
        if (typeof data !== "undefined" && typeof data.response !== "undefined" && typeof data.response !== "undefined") {
            var v = data.response.venues;
            for (p in v) {
                var m = new google.maps.Marker({
                    position: new google.maps.LatLng(v[p].location.lat, v[p].location.lng),
                    map: self.map,
                    title: v[p].name
                });

                createMarkerListener(m);

                self.places.push(new Place({
                    id: v[p].id,
                    name: v[p].name,
                    phone: v[p].contact.formattedPhone,
                    address: v[p].location.formattedAddress,
                    lat: v[p].location.lat,
                    lng: v[p].location.lng,
                    url: v[p].url,
                    marker: m
                }));
            }
        }
    }

    $.getJSON(FOURSQUARE_BASE_URL + DEFAULT_LAT + "," + DEFAULT_LNG, function (data) {
        self.parseFourSquareResults(data);
    }).error(function () {
        console.log("could not load foursquare data");
    });

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