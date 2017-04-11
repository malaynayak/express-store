$('.confirm-delete').click(function(event){
	var that = $(this);
	var message = that.attr("confirm-message");
	event.preventDefault();
	bootbox.confirm({
		message: (message)?message:"Are you sure to delete the record?",
	    buttons: {
	        confirm: {
	            label: 'Yes',
	            className: 'btn-success'
	        },
	        cancel: {
	            label: 'No',
	            className: 'btn-danger'
	        }
        },
        callback:function(result){	
			if(result){
				window.location.href = that.attr("href");
			} else {
				false;
			}
		}
	});
});


