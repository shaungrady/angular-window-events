import angular from 'angular'
import service from './service'

export default angular
  .module('window-events', [])
  .service('windowState', service)
  // Instantiate service for broadcasts
  .run(['windowState', windowState => {}])
  .name
