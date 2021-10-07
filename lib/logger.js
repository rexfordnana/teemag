import config from 'config'
import bunyan from 'bunyan'

export const defaultLog = bunyan.createLogger({
    name: config.get('logger.app_id'),
    env: config.get('env')
})

export const childLogger = (options) => {
    return defaultLog.child(options)
}