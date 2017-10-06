import dirtyChai from 'dirty-chai'
import { should, default as chai } from 'chai'

chai.use(dirtyChai)

// doSomething().should.equal('Hello')
should()

// turn on stack trace for all assertions
chai.config.includeStack = true
