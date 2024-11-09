/* eslint-disable @typescript-eslint/no-unused-vars */
import requestIp from 'request-ip'

const sessionHeaderExtension = {
  name: 'sessionHeaderExtension ',
  hooks: (req, res) => {
    return {
      beforeCreate: ({ configuration }) => {
        const clientIp = requestIp.getClientIp(req)

        return {
          ...configuration,
          sessionAuth: req.headers.cookie,
          requestHost: req.headers.host,
          realIp: clientIp,
        }
      },
      beforeCall: ({ configuration, callName, args }) => args,
      afterCall: ({ configuration, callName, response }) => {
        if (response?.data?.cookie) {
          res.setHeader('Set-cookie', response?.data?.cookie)
        }

        return response
      },
    }
  },
}

export default sessionHeaderExtension
