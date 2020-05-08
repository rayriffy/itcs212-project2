const { checkToken, crash } = require('../util')

const middleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers

    const validity = await checkToken(authorization)

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
  } catch {
    crash(res)
  }
}

module.exports = middleware
