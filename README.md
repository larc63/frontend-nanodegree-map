# frontend-nanodegree-map
------------------------------

# Warning
This project requires an internet connection to work.

# To run
Open the index.html file on your browser to view and interact with the map.

# To test
Open the test/index.html file on your browser to run the qunit tests included with the project. 

## Known Issues
* For some reason of blanket.js' internals, it throws an error saying that you can't apply bindings more than once, but code coverage works regardless.
* The checked binding was/isn't working for the tabs in the infoWindow, so a workaround has been implemented, this may or may not need addressing in the future.


# TODOs and other dreams for the future
* Add a neighborhood search to change neighborhoods.
* Make the list a list of places to visit, not the filtered results.
* Add arbitrary markers and get their geolocation info.
* Add an export list feature to have a printable/presentable way of exploring the area after researching.
* Add more tests.

# References
References:

1. Search bar and the basis for the style are from http://www.uiparade.com/portfolio/natural-search-bar/
2. Multiple map marker references were used, these are a couple of them:http://www.w3schools.com/googleapi/tryit.asp?filename=tryhtml_map_marker_infowindow, http://www.w3schools.com/googleapi/tryit.asp?filename=tryhtml_map_marker_infowindow2
3. Although this isn't used in the project for it's submission, it will be added when I add the "change" neighborhood feature: http://stackoverflow.com/questions/9309251/google-maps-javascript-api-get-gps-coordinates-from-address
4. I got some inspiration from a couple of my cohort siblings: https://github.com/danceoval/neighborhood/blob/master/index.html, https://github.com/DawoonC/dw-neighborhood/blob/master/templates/js/app.js
5. The stars representation for ratings is from http://stackoverflow.com/questions/1987524/turn-a-number-into-star-rating-display-using-jquery-and-css
6. Foursquare api usded is from https://developer.foursquare.com/docs/venues/search
7. Image conversion to data uri http://websemantics.co.uk/online_tools/image_to_data_uri_convertor/
8. Fiddle for the modal http://jsfiddle.net/y5g8zg1b/24/
9. Slide in panel from http://codyhouse.co/gem/css-slide-in-panel/
10. Fiddle for the slide in panel http://jsfiddle.net/8fzz7ud1/
11. Fiddle for a simplified slide in panel http://jsfiddle.net/7L8hgp8v/17/
12. Tab view http://codyhouse.co/gem/responsive-tabbed-navigation/
13. Not used for this submission, but this is a way for the user to add arbitrary places of interest http://stackoverflow.com/questions/6794405/trigger-google-maps-marker-click
14. better, lighter tabs: http://css-tricks.com/functional-css-tabs-revisited/
15. interesting take on slides that isn't used on this submission, but may make it's way into it in the future; http://jsfiddle.net/jacobdubail/bKaxg/7/
16. Google places api https://developers.google.com/maps/documentation/javascript/reference#PlaceResult
17. Javascript String.contains() http://stackoverflow.com/questions/1789945/how-can-i-check-if-one-string-contains-another-substring
18. Flickr API https://www.flickr.com/services/api/