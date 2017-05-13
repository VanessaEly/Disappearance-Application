app.service("ToastsService", function($timeout) {

	var self = this;

	this.toasts = [];
	this.timeouts = [];
	this.newToast = {};

	this.makeToast = function(priority, aText, aDuration) {

		var temp = {
			id: Date.now(),
			priority: priority,
			text: aText,
			duration: aDuration
		}

		this.toasts.push(temp);
		this.newToast = temp;

		var newToast = this.newToast;
		this.newToast = undefined;
		$timeout(function() {
			self.removeToast(newToast.id);
		}, newToast.duration);
	}

	this.removeToast = function(aIndex) {
		for (var i = 0; i < this.toasts.length; i++) {
			if(this.toasts[i].id == aIndex) {
				this.toasts.splice(i, 1);
			}
		};
	}

});