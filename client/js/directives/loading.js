angular.module('Voty')
	.directive('loading', function() {
		return {
			template: '<div class="loader">Loading...</div>',
			restrict: 'E'
		};
	});