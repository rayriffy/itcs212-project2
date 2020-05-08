const { isAdmin, crash } = require('../util')

const middleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers

    if (authorization === 'null') {
      res.status(401).send({
        status: 'failure',
        response: {
          message: 'admin is not admin',
        },
      })
    } else {
      const admin = await isAdmin(authorization.split(';')[0])

      if (admin) {
        next()
      } else {
        res.status(401).send({
          status: 'failure',
          response: {
            message: 'admin is not admin',
          },
        })
      }
    }
  } catch {
    crash(res)
  }
}

module.exports = middleware
