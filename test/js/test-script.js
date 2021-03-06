//View Model test
/*global vm */
/*global Place */
/*global QUnit */
/*global ViewModel */
/*global fourSquareTestData */

QUnit.module("ViewModel", {
    beforeEach: function () {
        "use strict";
        // prepare something for all following tests
        this.viewmodel = new ViewModel();
        vm = this.viewmodel;
    }
});
QUnit.test("happy path", function (assert) {
    "use strict";
    assert.ok(vm !== undefined, "vm is undefined");
    assert.ok(this.viewmodel.places !== undefined, "places in vm is undefined");
    assert.ok(vm.currentPlace() === undefined, "currentPlace is defined by default");
    assert.ok(vm.map === undefined, "map is defined");
    assert.ok(vm.infoWindow === undefined, "infowindow is defined");
    //TODO: move code to find current place from marker to a separate function and test it here, checking for currentplace to be some known object
});

QUnit.test("number of foursquare entries", function (assert) {
    "use strict";
    assert.strictEqual(this.viewmodel.places.length, 0, "number of places added is different than expected");
    this.viewmodel.parseFourSquareResults(fourSquareTestData);
    assert.strictEqual(this.viewmodel.places.length, 30, "number of places added is different than expected");
    assert.strictEqual(this.viewmodel.places[0].name(), "Kenny's Wood Fired Grill", "first entry in places is not the expected one");
});

//Model: Place
QUnit.module("Place", {
    beforeEach: function () {
        "use strict";
        // prepare something for all following tests
        this.p = new Place({
            id: -1,
            name: "Kenny's Wood Fired Grill",
            address: ["addr1", "addr2"],
            phone: "3",
            url: "www.somewhere.com",
            lat: 32.999,
            lng: 33.0001,
            marker: "someObject",
            selectedTab: "3"
        });
    },
    afterEach: function () {
        "use strict";
        // clean up after each test
    }
});
QUnit.test("Place happy path", function (assert) {
    "use strict";
    assert.strictEqual(this.p.id, -1, "place id is not the expected one");
    assert.strictEqual(this.p.name(), "Kenny's Wood Fired Grill", "place name is not the expected one");
    assert.strictEqual(this.p.address(), "addr1<br/>addr2", "place address is not the expected one");
    assert.strictEqual(this.p.phone(), "3", "place phone is not the expected one");
    assert.strictEqual(this.p.url(), "www.somewhere.com", "place url is not the expected one");
    assert.strictEqual(this.p.lat(), 32.999, "place lat is not the expected one");
    assert.strictEqual(this.p.lng(), 33.0001, "place lng is not the expected one");
    assert.strictEqual(this.p.marker, "someObject", "place id is not the expected one");
    assert.strictEqual(this.p.selectedTab(), undefined, "place selectedTab is not the expected one");
    assert.strictEqual(this.p.details().length, 0, "place details length is not the expected one");
    assert.strictEqual(this.p.ratings().length, 0, "place ratings length is not the expected one");
});
QUnit.test("Add A Rating", function (assert) {
    "use strict";
    this.p.ratings.push({
        name: "myrating",
        rating: 5
    });
    assert.strictEqual(this.p.id, -1, "place id is not the expected one");
    assert.strictEqual(this.p.name(), "Kenny's Wood Fired Grill", "place name is not the expected one");
    assert.strictEqual(this.p.address(), "addr1<br/>addr2", "place address is not the expected one");
    assert.strictEqual(this.p.phone(), "3", "place phone is not the expected one");
    assert.strictEqual(this.p.url(), "www.somewhere.com", "place url is not the expected one");
    assert.strictEqual(this.p.lat(), 32.999, "place lat is not the expected one");
    assert.strictEqual(this.p.lng(), 33.0001, "place lng is not the expected one");
    assert.strictEqual(this.p.marker, "someObject", "place id is not the expected one");
    assert.strictEqual(this.p.selectedTab(), undefined, "place selectedTab is not the expected one");
    assert.strictEqual(this.p.details().length, 0, "place details length is not the expected one");
    assert.strictEqual(this.p.ratings().length, 1, "place ratings length is not the expected one");
    assert.strictEqual(this.p.ratings()[0].name, "myrating", "place ratings first rating is not the expected one");
    assert.strictEqual(this.p.ratings()[0].rating, 5, "place ratings first rating is not the expected one");
});
QUnit.test("Add Detail", function (assert) {
    "use strict";
    this.p.details.push({
        name: "mydetail",
        value: 5
    });
    assert.strictEqual(this.p.id, -1, "place id is not the expected one");
    assert.strictEqual(this.p.name(), "Kenny's Wood Fired Grill", "place name is not the expected one");
    assert.strictEqual(this.p.address(), "addr1<br/>addr2", "place address is not the expected one");
    assert.strictEqual(this.p.phone(), "3", "place phone is not the expected one");
    assert.strictEqual(this.p.url(), "www.somewhere.com", "place url is not the expected one");
    assert.strictEqual(this.p.lat(), 32.999, "place lat is not the expected one");
    assert.strictEqual(this.p.lng(), 33.0001, "place lng is not the expected one");
    assert.strictEqual(this.p.marker, "someObject", "place id is not the expected one");
    assert.strictEqual(this.p.selectedTab(), undefined, "place selectedTab is not the expected one");
    assert.strictEqual(this.p.details().length, 1, "place details length is not the expected one");
    assert.strictEqual(this.p.ratings().length, 0, "place ratings length is not the expected one");
    assert.strictEqual(this.p.details()[0].name, "mydetail", "place ratings first rating is not the expected one");
    assert.strictEqual(this.p.details()[0].value, 5, "place ratings first rating is not the expected one");
});