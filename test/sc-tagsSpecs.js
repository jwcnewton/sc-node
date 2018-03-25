const nodeID3 = require('node-id3');
const sc_events = require('../src/utils/sc-events');
const sc_tags = require('../src/sc-tags');
const sinon = require('sinon');
const expect = require('chai').expect
var sandbox = sinon.createSandbox();

describe("sc-tags", () => {
    const trackInfo = {
        title: "test",
        genre: "jam",
        user: {
            username: "Jam"
        }
    }
    beforeEach(function () {
        sandbox.stub(nodeID3, 'create').callsFake((...args) => {
            args[1]();
        });
        sandbox.stub(nodeID3, 'write').callsFake((...args) => {
            args[2]();
        });

        sandbox.stub(sc_events, 'emit');
    });

    afterEach(function () {
        sandbox.restore();
    });
    describe('appendTags', () => {
        it('Returns promise', () => {
            //Act
            const result = sc_tags.appendTags("", trackInfo);
            //Assert
            expect(result.then).to.be.an('function')
        });
        it('Calls sc_events emit', (done) => {
            //Act
            sc_tags.appendTags("", trackInfo).then(() => {
                //Assert
                expect(sc_events.emit.called).to.be.true;
            }).then(done);
        });
        it('Calls nodeID3 create', (done) => {
            //Act
            sc_tags.appendTags("", trackInfo).then(() => {
                //Assert
                expect(nodeID3.create.called).to.be.true;
            }).then(done);
        });
        it('Calls nodeID3 write', (done) => {
            //Act
            sc_tags.appendTags("", trackInfo).then(() => {
                //Assert
                expect(nodeID3.write.called).to.be.true;
            }).then(done);
        });
    });
})
