QUnit.test("hello test", function (assert) {
    assert.ok(1 == "1", "Passed!");
});

//View Model test
//270var ViewModel = function () {
//271    var self = this;
//272    //    self.coder = new google.maps.Geocoder(); .. not needed until the "change neighborhood feature is implemented
//273    self.dummy = ko.observable("Hello");
//274    self.places = ko.observableArray([]);
//275    self.markers = ko.observableArray([]);
//276    self.currentPlace = ko.observable();
//277    self.map = createMap();
//278    self.infoWindow = createInfoWindow();
//279
//280    if (typeof CODE_IS_UNDER_TEST === "undefined") {
//281        var fourSquareURL = FOURSQUARE_BASE_URL + DEFAULT_LAT + "," + DEFAULT_LNG;
//282        getAjaxFromURL(fourSquareURL, parseFourSquareResults);
//283    }
//284
//285}
QUnit.module( "ViewModel" );
QUnit.test("happy path", function (assert) {
    assert.ok(vm !== undefined, "number of places added is different than expected");
    assert.ok(vm.places() !== undefined, "number of places added is different than expected");
    assert.ok(vm.currentPlace() !== undefined, "number of places added is different than expected");
    assert.ok(vm.map === undefined, "number of places added is different than expected");
    assert.ok(vm.infoWindow === undefined, "number of places added is different than expected");
});

//Model: Place
//240
//241var Place = function (data) {
//242    this.id = data.id;
//243    this.googleplaceid = "";
//244    this.name = ko.observable(data.name);
//245    if (data.address) {
//246        this.address = ko.observable("");
//247        for (a in data.address) {
//248            this.address(this.address() + data.address[a] + "<br/>");
//249        }
//250    }
//251
//252    this.phone = ko.observable(data.phone);
//253    this.url = ko.observable(data.url);
//254    this.lat = ko.observable(data.lat);
//255    this.lng = ko.observable(data.lng);
//256    this.marker = data.marker;
//257    this.selectedTab = ko.observable();
//258    this.details = ko.observableArray([]);
//259    this.ratings = ko.observableArray([]);
//260    if (data.rating) {
//261        this.ratings.push({
//262            name: "Foursquare Rating",
//263            rating: data.rating / 2.0
//264        });
//265    }
//266    console.log("created place object: " + this.name() + " at " + this.lat() + "," + this.lng());
//267}
QUnit.module( "Place" );
QUnit.test("number of foursquare entries", function (assert) {
    assert.ok(vm !== undefined, "number of places added is different than expected");
    assert.strictEqual(vm.places()[0].name(), "Kenny's Wood Fired Grill", "first entry in places is not the expected one");
});

QUnit.test("number of foursquare entries", function (assert) {
        assert.strictEqual(vm.places().length, 0, "number of places added is different than expected");
    parseFourSquareResults(fourSquareTestData);
    assert.strictEqual(vm.places().length, 30, "number of places added is different than expected");
    assert.strictEqual(vm.places()[0].name(), "Kenny's Wood Fired Grill", "first entry in places is not the expected one");
});