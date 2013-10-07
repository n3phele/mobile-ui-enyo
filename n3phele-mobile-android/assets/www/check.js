function Check()
{
	var v = new Array();	
	this.difference = function(vet1, vet2){		
	var cont = 0;
	var check = false;
		for(var i = 0; i < 2; i++){
			check = true;
			for(var j = 0; j < 2; j++){
				if(vet1[i].uri == vet2[j].uri){
					check = false;
					break;						
				}					
			}
			if(check == true){
				v[cont] = vet1[i].uri;
				cont++;							 
			}
		}
	return v;
	}
}