$('.confirm-delete').click(function(event){
	var that = $(this);
	event.preventDefault();
	bootbox.confirm("Are you sure to delete the record?", function(result){
		if(result){
			window.location.href = that.attr("href");
		} else {
			false;
		}
	});
});


