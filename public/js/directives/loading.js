angular.module('Votapalooza')
	.directive('loading', function() {
		return {
			template: '<div class="loader">Loading...</div>',
			restrict: 'E'
		};
	});