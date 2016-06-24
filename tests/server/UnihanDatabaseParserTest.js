
var expect = require("chai").expect;

var UnihanDatabaseParser = require('../../app/services/UnihanDatabaseParser');
var udp = new UnihanDatabaseParser();

describe("XML Test", function () {

    it("Load file", function () {
        
        udp.loadFile(__dirname + '/resources/UnihanDatabase.xml');
        //expect(1).to.equal(1);
    });

});    