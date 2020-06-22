/*
 * Widget di file upload di esse3
 */
$(function () {
	
	var fileUploadXHR;
	var isRwd = $("#modalUpload").length ? true : false;
	
	var hideModalUpload = function(){
    	if (isRwd){
    		$("#modalUpload").modal('hide');
    	} else {
    		var modal = document.getElementById('modalUploadNoRwd');
		    modal.style.display = "none";
    	}
	};
	
	
	$('button[data-dismiss="modal"]').click(function (e) {
		$('.fileupload').each(function () {
			fileUploadXHR.abort();
		});
	});
		
	$('.fileupload').each(function () {
	    $(this).fileupload({
	        dataType: 'json',
	        url: 'auth/ChunkUpload.do',
	        maxChunkSize: 327680,
	        sequentialUploads: true,
	        multipart: false,
	        
	        add: function (e, data) {
	        	
	        	if (isRwd){
		        	$("#modalUpload").modal({
		        		show: true,
		                backdrop: 'static',
		                keyboard: false
		        	});
	        	} else {
	        		var modal = document.getElementById('modalUploadNoRwd');
	        		modal.style.display = "block";
	        		var span = document.getElementsByClassName("close")[0];
	        		// When the user clicks on <span> (x), close the modal
	        		span.onclick = function() {
	        		    modal.style.display = "none";
	        		    fileUploadXHR.abort();
	        		}
	        	}
	        	
	        	//Eliminazione messaggio di validazione relativo al file precedente
            	$('#' + this.id + '-div span.help-block').html(''); //rwd on
            	$('#' + this.id + '-div span.inputText-alertMessage').html(''); //rwd off
	        	
	        	var progressBar = $('#' + this.id + '_progress .progress-bar');
	        	progressBar.removeClass('progress-bar-danger');
	        	progressBar.text(chunkUploadMsgStartingUpload + ' - 0%');
	        	progressBar.css('width', '0%');
	        	var url = 'auth/ChunkUploadStart.do';           
	            
	            var dataToSend = {};
	        	dataToSend.filename = data.files[0].name;
	        	
	            $.post(url, dataToSend, function (result) {
	            	var progressBar = $('#' + this.id + '_progress .progress-bar');
	            	progressBar.css('width','10%');
	            	fileUploadXHR = data.submit();
	            }).fail(function () {
	            	var progressBar = $('#' + this.id + '_progress .progress-bar');
	            	progressBar.text(chunkUploadMsgErrorStarting);
	        		progressBar.css('width','100%');
	        		progressBar.addClass('progress-bar-danger');
		        	$.getJSON('auth/ChunkUploadError.do');
		        	hideModalUpload();
	            }, "json");
	            
	        },
	        done: function (e, data) {
	        	var progressBar = $('#' + this.id + '_progress .progress-bar');
	        	var id = this.id;
	        	
	        	var url = 'auth/ChunkUploadEnd.do';
	        	
	        	var dataToSend = {};
	        	dataToSend.filename = data.files[0].name;
	        	
	        	progressBar.text(chunkUploadMsgSaving + ' - 80%');

	            $.post(url, dataToSend, function (result) {
	            	progressBar.text(chunkUploadMsgCompleted + ' - 100%');
	            	progressBar.css('width','100%');
	            	$('#uploadedFile').html($('<p/>').text(data.files[0].name));
	            		            	
	            	hideModalUpload();
	            	
	            	var inputAllegatoId = $('input[name="allegato_id"]');
	            	if (inputAllegatoId.length > 0){
	            		inputAllegatoId[0].value = result.allegatoId;
	            	} else {
	            		$('<input>').attr({
	            			type: 'hidden',
	            			id: 'allegato_id',
	            			name: 'allegato_id',
	            			value: result.allegatoId
	            		}).appendTo($('#'+id)[0].form);
	            	}
	            	
	            }).fail(function () {
	            	progressBar.text(chunkUploadMsgErrorSaving);
	        		progressBar.css('width','100%');
	        		progressBar.addClass('progress-bar-danger');
		        	$.getJSON('auth/ChunkUploadError.do');
		        	hideModalUpload();
	            }, "json");
	        },
	        fail: function (e, data) {
	        	var progressBar = $('#' + this.id + '_progress .progress-bar');
	        	$.getJSON('auth/ChunkUploadError.do', function (result) {
	        		progressBar.text(chunkUploadMsgErrorUploading);
	        		progressBar.css('width','0%');
	        		hideModalUpload();
	        	});
	        },
		    progressall: function (e, data) {
		        var progress = parseInt(data.loaded / data.total * 100, 10);
		        progress = parseInt((progress / 100 * 70) + 10); //Scalo su 70% (10 start e 20 end)
		        var progressBar = $('#' + this.id + '_progress .progress-bar');
		        progressBar.text(chunkUploadMsgUploading + ' - ' + progress + '%');
		        progressBar.css(
		            'width',
		            progress + '%'
		        );
		    }
	    });
    });
});