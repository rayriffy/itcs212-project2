const { checkToken } = require('../util')

const middleware = async (req, res, next) => {
  const { token } = req.body

  const validity = await checkToken(token)

  if (validity !== null) {
    req.user = validity
    return next()
  } else {
    return res.status(401).send({
      status: 'failure',
      response: {
        message: 'unauthorized',
      },
    })
  }
}

module.exports = middleware
