app.factory('StorageService', [
  '$rootScope',
  '$localStorage',
function($rootScope, $localStorage){

  if ( !$rootScope.$storage ) {
    $rootScope.$storage = $localStorage;
  }

  return {
    get: function(key){

      var value = $rootScope.$storage[key];
      if (value === undefined || value === 'undefined' || value === null || value === 'null') {
        return undefined;
      } else {
        try {
          JSON.parse($rootScope.$storage[key]);
          return JSON.parse($rootScope.$storage[key]);
        } catch(e){
          return $rootScope.$storage[key];
        }
      }
    },
    set: function(key, value){
      switch (typeof value) {
        case "string":case "number":case "boolean":
          $rootScope.$storage[key] = value;
          break;
        case "undefined":
          break;
        default:
          // console.log(JSON.stringify(value));
          $rootScope.$storage[key] = JSON.stringify(value);
      }
    },
    delete: function(key){
      console.log(key);
      console.log($rootScope.$storage[key]);
      delete $rootScope.$storage[key];
    }
  };
}]);