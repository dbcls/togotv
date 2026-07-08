'use strict'

const fs = require('fs')
const path = require('path')

const LOG_FILE = path.join(process.cwd(), 'access-log.json')

function readLog() {
  try {
    if (fs.existsSync(LOG_FILE)) {
      return JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'))
    }
  } catch (e) { /* ignore */ }
  return {}
}

function writeLog(data) {
  try {
    fs.writeFileSync(LOG_FILE, JSON.stringify(data, null, 2))
  } catch (e) { /* ignore */ }
}

function getToday() {
  // JST (UTC+9)
  const now = new Date()
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  return jst.toISOString().slice(0, 10)
}

module.exports = function accessCounter(req, res, next) {
  const url = (req.url || '').split('?')[0]

  // Record access to the main page (/ or /ja/)
  if (url === '/' || url === '/ja' || url === '/ja/' || url === '/en' || url === '/en/') {
    const log = readLog()
    const today = getToday()
    log[today] = (log[today] || 0) + 1
    writeLog(log)
  }

  // API: GET /api/access-stats
  if (url === '/api/access-stats') {
    const log = readLog()
    const today = getToday()
    const allDates = Object.keys(log).sort()
    const todayCount = log[today] || 0

    // Daily average from past days (exclude today)
    const pastDates = allDates.filter(d => d !== today)
    const pastTotal = pastDates.reduce((sum, d) => sum + (log[d] || 0), 0)
    const dailyAverage = pastDates.length > 0
      ? Math.round((pastTotal / pastDates.length) * 10) / 10
      : 0

    const stats = {
      today: todayCount,
      average: dailyAverage,
      total: Object.values(log).reduce((a, b) => a + b, 0),
      daysTracked: allDates.length,
      history: log,
    }

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Cache-Control', 'no-store')
    res.statusCode = 200
    res.end(JSON.stringify(stats))
    return
  }

  next()
}
