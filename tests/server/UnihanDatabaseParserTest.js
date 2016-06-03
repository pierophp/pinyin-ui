
var expect = require("chai").expect;

var UnihanDatabaseParser = require('../../service/UnihanDatabaseParser');
var udp = new UnihanDatabaseParser();

describe("XML Test", function () {

    it("should multiply 2 and 3", function () {
        
        udp.loadFile(__dirname + '/resources/UnihanDatabase.xml');
        //expect(1).to.equal(1);
    });

});    