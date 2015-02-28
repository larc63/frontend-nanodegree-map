QUnit.test("hello test", function (assert) {
    assert.ok(1 == "1", "Passed!");
});

//View Model test
QUnit.module( "ViewModel" );
QUnit.test("happy path", function (assert) {
    assert.ok(vm !== undefined, "vm is undefined");
    assert.ok(vm.places() !== undefined, "places in vm is undefined");
    assert.ok(vm.currentPlace() === undefined, "currentPlace is defined by default");
    assert.ok(vm.map === undefined, "map is defined");
    assert.ok(vm.infoWindow === undefined, "infowindow is defined");
    //TODO: move code to find current place from marker to a separate function and test it here, checking for currentplace to be some known object
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
//QUnit.module( "Place" );
//QUnit.test("number of foursquare entries", function (assert) {
//    assert.ok(vm !== undefined, "number of places added is different than expected");
//    assert.strictEqual(vm.places()[0].name(), "Kenny's Wood Fired Grill", "first entry in places is not the expected one");
//});

QUnit.test("number of foursquare entries", function (assert) {
        assert.strictEqual(vm.places().length, 0, "number of places added is different than expected");
    parseFourSquareResults(fourSquareTestData);
    assert.strictEqual(vm.places().length, 30, "number of places added is different than expected");
    assert.strictEqual(vm.places()[0].name(), "Kenny's Wood Fired Grill", "first entry in places is not the expected one");
});