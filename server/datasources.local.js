// configure storage based on environment variables

if (process.env.DB_STORAGE === 'file') {
  module.exports.db = {
    connector: 'memory',
    file: process.env.DB_FILE
  }
}

if (process.env.DB_STORAGE === 'mongodb') {
  module.exports.db = {
    connector: 'mongodb',
    url: process.env.DB_URL
  }
}

if (process.env.QUARTO_URL) {
  module.exports.quarto = {
    "baseURL": process.env.QUARTO_URL,
    "crud": false,
    "connector": "rest",
    "operations": [
      {
        "template": {
          "method": "GET",
          "query": {
            "rs:type": "{type}",
            "rs:graph": "{graph}"
          },
          "options": {
            "useQuerystring": true,
            "headers": {
              "Accept": "text/turtle"
            }
          }
        }
      }
    ]
  }
}

