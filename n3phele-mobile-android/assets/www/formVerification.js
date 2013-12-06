function formVerification()
{
	this.fieldVerification = function(field, msg){
		if(field.length == 0 || field == "" ){		
			msg.show();					
			msg.setContent("Can not be blank."); 
			return false;					
		}else{
			msg.hide();
			return true;
		}		
	},
	
	this.passwordVerification = function(confirmPassword, newPassword, msg){
		if(confirmPassword.length  == 0 || confirmPassword == ""){
				msg.show();
				msg.setContent("Can not be blank.");
				return false;
		}
		else{
			if(confirmPassword != newPassword){
				msg.show();
				msg.setContent("Please check that you've entered and confirmed your password");
				return false;
			}else{
				msg.hide();
				return true;
			}
		}
	},
	
	this.emailVerification = function(email, msg){
		var atpos = email.indexOf("@");
		var dotpos = email.lastIndexOf(".");
		if(email.length  == 0 || email == ""){
				msg.show();
				msg.setContent("Can not be blank.");
				return false;
		}
		else{
			if (atpos < 1 || dotpos<atpos+2 || dotpos+2 >= email.length){
				msg.show();
				msg.setContent("Invalid email address.");
				return false;
			}else{
				msg.hide();
				return true;
			}
		}
	}
}	