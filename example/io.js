var Io = require('../io')

// create a new function that calls the given predicates with the response
var io = Io
    .map(function (err, res, body) {
        if (err) return [err]
        return [null, body.data]
    })
    .map(function (err, res) {
        if (err) return [err]
        return [null, res.foo]
    })

io({
    url: 'example.com',
    method: 'POST',
    body: { hello: 'world' },
    json: true
}, function onResponse (err, res) {
    // the arguments here have been mapped by the predicates above
    // res === body.data.foo
})



