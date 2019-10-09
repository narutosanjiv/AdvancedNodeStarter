const mongoose = require('mongoose')
const exec = mongoose.Query.prototype.exec
mongoose.Query.prototype.exec = async function(){
    console.log('In exec ')
    // const result = await exec.apply(this, arguments)
    // console.log(this.getQuery())
    // console.log(this.mongooseCollection.name)
    // return Array.isArray(result) ? result.map((r) => new this.model(result) ) : new this.model(result)
    return exec.apply(this, arguments)
}