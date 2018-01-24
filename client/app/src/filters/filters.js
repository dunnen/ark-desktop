;(function () {
  'use strict'

  angular.module('arkclient.filters')
    .filter('exchangedate', () => {
      return function (exchangetime) {
        return new Date(exchangetime * 1000)
      }
    })
    .filter('amountToCurrency', () => {
      return function (amount, scope, bitcoinToggleIsActive) {
        if (typeof amount === 'undefined' || !amount) return 0
        // NOTE AccountController is being renaming to `ac` in refactored templates
        const ac = scope.ac || scope.ul
        const currencyName = bitcoinToggleIsActive && ac.btcValueActive ? 'btc' : ac.currency.name

        if (!ac.connectedPeer.market.price) {
          return 0
        }

        const price = ac.connectedPeer.market.price[currencyName]
        return (amount * price).toFixed(5)
      }
    })
    .filter('formatCurrency', () => {
      return function (val, self, bitcoinToggleIsActive) {
        const currencyName = bitcoinToggleIsActive && self.btcValueActive ? 'btc' : self.currency.name
        const languageCode = self.language.replace('_', '-')
        const options = {
          style: 'currency',
          currency: currencyName,
          currencyDisplay: 'symbol'
        }

        let localeVersion

        if (currencyName === 'btc') {
          let value = String(val).length > 8 ? Number(val).toFixed(8) : val
          localeVersion = 'Ƀ ' + Number(value)
        } else {
          localeVersion = Number(val).toLocaleString(languageCode, options)
        }

        return localeVersion
      }
    })
  // converts arktoshi into ark
    .filter('convertToArkValue', ['utilityService', function (utilityService) {
      return function (val) {
        return utilityService.arktoshiToArk(val, true)
      }
    }])
    .filter('accountLabel', ['accountService', function (accountService) {
      return function (address) {
        if (!address) return address

        const username = accountService.getUsername(address)
        return username !== address ? username : smallId(address)
      }
    }])
    .filter('txId', function () {
      return function (txId) {
        return txId ? smallId(txId) : txId
      }
    })

  function smallId (fullId) {
    return fullId.slice(0, 5) + '...' + fullId.slice(-5)
  }
})()
