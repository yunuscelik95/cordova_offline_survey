var otherObj = [];
var activedObjects = [];
var otherValue = [];
var currentValue = [];
var Answers = [];
var _objName ;
var isStarted = true;
var answerSum = "";
function contains(obj,item)
{
    var z=0;
    for(z=0;z<obj.length;z++)
    {
        if(obj[z]==item)
        {
            return z;
        }
    }
    return -1;
}

function SetStartUp()
{
    var i=0;
    var isOtherSetted = false;

    for(i=0;i<document.forms[0].elements.length;i++)
    {
        var obj = document.forms[0].elements[i];
        if(obj.type=="checkbox")
        {
            obj.onclick = controlOther;
            obj.onclick();
//            if(!isOtherSetted)
//            {
//                _objName = obj.name;
//                isOtherSetted = true;
//            }
        }
    }
    isStarted  = false;
//    if(currentValue!=null)
//    {
//        for(i=0;i<otherValue.length;i++)
//        {
//            var arr = currentValue.toString().split(',');
//            var oValue = otherValue[i];
//            if(contains(arr,oValue)>-1)
//                otherObj[i].disabled ='';
//            else
//                otherObj[i].disabled ='disabled';
//        }
//    }
    
    
    
    var objBtnNext = document.getElementById("form1");
    objBtnNext.onsubmit = CheckValues;
}



function controlOther(obj)
{
    var rObj = null;
    if(obj==null || obj.type!="checkbox")
        rObj = this;
    else
        rObj = obj;
 
    var isOpenEnd = rObj.getAttribute("OpenEnd");
    if (rObj.getAttribute("DeselectOther") !=null && rObj.getAttribute("DeselectOther")=="true")
	if(!isStarted) ClearActivedOpens( this.getAttribute("GroupID"));
    var attrResult = this.getAttribute("DeselectOther");
    var groupID = this.getAttribute("GroupID");

    if(attrResult!=null)
    {
        if(attrResult=="true")
        {
 
            DeselectOther(rObj,groupID);
        }
    }
    if(isOpenEnd!=null)
    {
        if(isOpenEnd=="true")
        {
            var OpenEndObj = document.getElementById(rObj.getAttribute("OpenEndObj"));
            if(this.checked)
            {
                OpenEndObj.disabled = '';
                activedObjects.push(OpenEndObj);
            }
            else
            {
                OpenEndObj.disabled = 'disabled';
                
            }
        }
    }
}



function DeselectOther(obj,groupID)
{
    if(obj.checked)
    {
        for(i=0;i<document.forms[0].elements.length;i++)
        {
            var _obj = document.forms[0].elements[i];

            if(_obj.type=="checkbox" || _obj.type=="text")
            {
                if(_obj.getAttribute("GroupID")!=groupID) continue;
                if(obj!=_obj)
                {
                    var index = contains(otherValue,_obj.value);
                    if(index>-1)
                    {
                        otherObj[index].disabled = 'disabled';
                    }
                    _obj.disabled = 'disabled';
                }
                else
                {
                    var index = contains(otherValue,obj.value);
                    if(index>-1)
                    {
                        otherObj[index].disabled = '';
                    }
                }
            }

            
        }
    }
    else
    {
        for(i=0;i<document.forms[0].elements.length;i++)
        {
            var _obj = document.forms[0].elements[i];
            if(_obj.type=="checkbox" || _obj.type=="text")
            {
                if(_obj.getAttribute("GroupID")!=groupID) continue;
                var index = contains(otherValue,_obj.value);
                if(index>-1)
                {
                    if(_obj.checked)
                        otherObj[index].disabled = '';
                    else
                        otherObj[index].disabled = 'disabled';
                }
                if (_obj.type=="checkbox")
                {
                	_obj.disabled = '';
                }
               else
               	{
               	 	var check=document.getElementById(_obj.id.replace("_O_","_"));
               	 	if (check.checked)
               	 	{
               	 		_obj.disabled='';
               	 	}
               	}
            }       
        }
    }
}

function ClearActivedOpens(grupID)
{
    var k = 0;
    for(k=0;k<activedObjects.length;k++)
    {
        if(activedObjects[k].GroupID == grupID)
         { 
         	activedObjects[k].disabled = 'disabled';

         }   
    }
    var deleted = 0;
    for(k=0;k<activedObjects.length;k++)
    {
        //if(k+1>activedObjects.length) break;
        if(activedObjects[k].GroupID == grupID)
        {
            activedObjects.splice(deleted + k,1);
            deleted ++;

        }
    }
}

function CheckValues()
{
    var answerCount = 0;
    Answers = [];
    for(i=0;i<otherObj.length;i++)
    {
        var OpenEndresult = ControlOpenEndObject(otherObj[i]);
        if(OpenEndresult==false)
        {
            otherObj[i].focus();
            submitted = false;
            return false;
        }
    }
    var str = "";
    for(i=0;i<document.forms[0].elements.length;i++)
    {
        var obj = document.forms[0].elements[i];
        if(document.forms[0].elements[i].type=="checkbox")
	    {
		    var elem = document.forms[0].elements[i];
		    
		    if(str.indexOf(','+elem.name+ ',')==-1)
		    {
                str = str + ',' + elem.name + ',';
                answerSum = "";
                var checkedObj = getValue(elem.name);
                if (answerSum != null && answerSum!="")
                {
                    Answers.push(elem.name + "='" + answerSum + "'");

                }
                
			    if(checkedObj==null)
			    {
			        alert("Seçilmemiş alanlar var. Şimdi bu alana yönlendirileceksiniz");
			        elem.focus();
			        submitted = false;
			        return false;
			    }
				else if(checkedObj==false)
				{
				    submitted = false;
			        return false;
				}
			    
			    if(checkedObj.OpenEnd=="true")
                {
                  

                    var OpenEndresult = ControlOpenEndObject(document.getElementById(checkedObj.OpenEndObj));
                    Answers.push(document.getElementById(checkedObj.OpenEndObj).name + "='" + document.getElementById(checkedObj.OpenEndObj).value + "'");

			        if(OpenEndresult==false)
			        {
			            document.getElementById(checkedObj.OpenEndObj).focus();
			            submitted = false;
			            return false;
			        }
			    }
		    }
	    }
    }
    
    return true;
}

function ControlOpenEndObject(obj)
{
    var msg = "";
	
    if (obj!=null)
    {
	    var exp = obj.getAttribute("Expression");
	    if(exp!=""&&exp!=null)
	    {
	       var expResult = new RegExp(exp);
	       if(!obj.value.match(expResult)) 
	       {
		    obj.focus();
		    alert(obj.getAttribute("ExpressionMessage"));
		    submitted = false;
		    return false;
	       }
	    }
   
    if(obj.value=="")
    {
        alert("Diğer kutucuğunu boş bıraktınız");
        submitted = false;
        return false;
    }
    
	}
        
    if(msg!="")
    {
        alert(msg)
        return false;
    }
    Answers.push(obj.name + "='" + obj.value + "'");
    return true;
}


function IsNumeric(sText)
{
    var ValidChars = "0123456789";
    var IsNumber=true;
    var Char;
    var z = 0;
    if(sText=="") return false;
    for (z = 0; z < sText.length && IsNumber == true; z++)
    {
        Char = sText.charAt(z);
        if (ValidChars.indexOf(Char) == -1)
        {
            return false
        }
    }
   return true;
}


function getValue(radioGroupName) {
        radios = document.getElementsByName(radioGroupName);
        var kontrol = false;
        var answer = "";
        for (z = 0; z < radios.length; z++) {
            if(radios[z].getAttribute("openend")=="true"  && radios[z].checked)
               var OpenEndresult = ControlOpenEndObject(document.getElementById(radios[z].getAttribute("openendobj")));
        		    if(OpenEndresult==false)
			        {
			           // document.getElementById(radios[i].OpenEndObj).focus();
			            submitted = null;
			            return false;
			        }
                    if (radios[z].checked) { if (answerSum != "") { answerSum += ","; } answerSum += radios[z].value; kontrol = true;  }
        }
        if (kontrol==true) return true;
        
		return null;
}
function ControlAllRadio()
{
    var str = ",";
	for(z=0; z<document.form1.elements.length; z++)
	{
		if(document.form1.elements[z].type=="checkbox")
		{
			var elem = document.form1.elements[z];
			if(str.indexOf(','+elem.name + ',')==-1)
			{
				str = str + ',' + elem.name + ',';
				if(getValue(elem.name)==false)
				{
					alert('Lütfen boş alan bırakmayın!');
					submitted = false;
					return false;
				}
			}
		}
	}
	return true;
}

function ControlSingleResponse()
{
    
}

