$('.confirm-delete').click(function(event){
	event.preventDefault();
	var proceed = bootbox.confirm("Are you sure to delete the record?", function(result){
		return result; 
	});
	if(result) 
		return true;
	else 
		return false;

});
