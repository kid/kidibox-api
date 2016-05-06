import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

chai.use(chaiAsPromised)
chai.use(sinonChai)

global.chai = chai
global.sinon = sinon
global.expect = chai.expect
global.should = chai.should()
