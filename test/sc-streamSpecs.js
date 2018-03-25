const rewire = require("rewire");
const sinon = require('sinon');
const expect = require('chai').expect

const sc_events = require('../src/utils/sc-events');
const sc_stream = rewire("../src/sc-stream.js");

const sandbox = sinon.createSandbox();

describe("sc-stream", () => {
    const trackInfos = [];
    beforeEach(function () {
        sandbox.stub(sc_events, 'emit');
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('downloadStreams', () => {
        it('Calls sc_event emit', () => {
            //Arrange 
            const expectedMessage = 'Downloading 0 tracks';
            //Act
            sc_stream.downloadStreams(trackInfos, "");
            //Assert
            expect(sc_events.emit.calledWith('progress', expectedMessage)).to.be.true;
        });

        it('Calls downloadStream if trackInfo is greater than 0', () => {
            //Arrange
            const stub = sinon.stub();
            sc_stream.__set__("downloadStream", stub);
            //Act
            sc_stream.downloadStreams([{}], "");
            //Assert
            expect(stub.called).to.be.true;
        });

        it('Calls sc_event emit on finish', (done) => {
            //Arrange 
            const stub = sinon.stub().resolves("Jam");
            sc_stream.__set__("downloadStream", stub);
            const expectedMessage = 'All Done!';
            //Act
            sc_stream.downloadStreams(trackInfos, "").then(() => {
                //Assert
                expect(sc_events.emit.lastCall.calledWith('progress', expectedMessage)).to.be.true;
                done();
            });
        });
    });
})
