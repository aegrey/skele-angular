/**
 * @ngdoc skeleApp
 * @name skeleApp.directive:UserFormDirective
 * @description User Form Directive
*/

(function() {
  'use strict';

  angular.module('skeleApp')
  .directive('UserFormDirective', [
    '$templateCache',
    '$compile',
    UserFormDirective
  ]);

  function UserFormDirective($templateCache, $compile) {
  	return {
  		restrict: 'E',
      templateUrl: 'user_form/user_form.html',
      scope: {
        formType: '@'
      },
  		require: "ngModel",
  		link: link
  	};

    function link(scope, elements, attrs, ngModelController) {

      function checkPassword() {

        if($scope.userObject.password === $scope.userObject.passwordConfirm) {
          //TODO: Process User
        } else {
          $scope.formErrors.push({'message': 'Passwords do not match'});
        }
      }
    }
  }

}());
