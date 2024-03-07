var otherObj = [];
var activedObjects = [];
var otherValue = [];
var currentKolomn = [];
var currentValue = [];
var _objName ;
var isStarted = true;

function contains(obj,item)
{
    var i=0;
    for(i=0;i<obj.length;i++)
    {
        if(obj[i]==item)
        {
            return i;
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
        if(obj.type=="radio")
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
    if(this!=null && this!=undefined)
        rObj = this;
    else
        rObj = obj;

    var isOpenEnd = rObj.getAttribute("openend");
    if(!isStarted) ClearActivedOpens(rObj.getAttribute("groupid"));
    if(isOpenEnd!=null)
    {
        if(isOpenEnd=="true")
        {
            var OpenEndObj = document.getElementById(rObj.getAttribute("OpenEndObj"));
            if(rObj.checked)
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

function ClearActivedOpens(grupID)
{
    var k = 0;
    for(k=0;k<activedObjects.length;k++)
    {
        if(activedObjects[k].getAttribute("groupid") == grupID)
            activedObjects[k].disabled = 'disabled';
    }
    var deleted = 0;
    for(k=0;k<activedObjects.length;k++)
    {
        if(k+1>activedObjects.length) break;
        if(activedObjects[k].getAttribute("groupid") == grupID)
        {
            activedObjects.splice(deleted + k,1);
            deleted ++;
        }
    }
}

function CheckValues()
{
    var answerCount = 0;

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
    currentValue = [];
    currentKolomn = [];
    for(i=0;i<document.forms[0].elements.length;i++)
    {
        var obj = document.forms[0].elements[i];
        if(document.forms[0].elements[i].type=="radio")
	    {
		    var elem = document.forms[0].elements[i];

		    if(str.indexOf(','+elem.name+ ',')==-1)
		    {
                str = str + ',' + elem.name + ',';
      

                var checkedObj = getValue(elem.name);

			    var elemRadio=checkedObj;//document.getElementById(elem.id);
				if (elemRadio==null)
				{
					alert("Seçilmemiş alanlar var. Şimdi bu alana yönlendirileceksiniz");
					elem.focus();
					submitted = false;
					return false;
				}
			    if(checkedObj==null)
			    {
					try
					{
						var names=elemRadio.name.split('_');
						var OpenName="";
						for(var j=0; j<names.length-1; j++) {
							if (OpenName!="") OpenName+="_";
							OpenName+=names[j];
						}

						var openEnd=document.getElementById(elemRadio.getAttribute("openendobj"));//document.getElementById(OpenName + "_O_" + names[names.length-1]);


						if (openEnd!=null && openEnd.value=="")
						{
							alert("Seçilmemiş alanlar var. Şimdi bu alana yönlendirileceksiniz");
							elem.focus();
							submitted = false;
							return false;
						}

					}
					catch(err)
					{
					}
						if (openEnd==null)
						{
							alert("Seçilmemiş alanlar var. Şimdi bu alana yönlendirileceksiniz. Diğersiz");
							elem.focus();
							submitted = false;
							return false;
						}
			    }
				else
                {
                    currentKolomn.push(elem.name);
                    currentValue.push(elem.name + '=' + checkedObj.value);
						var names=elemRadio.name.split('_');
						var OpenName="";
						for(var j=0; j<names.length-1; j++) {
							if (OpenName!="") OpenName+="_";
							OpenName+=names[j];
						}

					//	var openEnd=document.getElementById(OpenName + "_O_" + names[names.length-1]);
					var openEnd=document.getElementById(elemRadio.getAttribute("openendobj"));
					if (openEnd!=null  && openEnd.value=="")
					{
						alert("Seçilmemiş alanlar var. Şimdi bu alana yönlendirileceksiniz");
						elem.focus();
						submitted = false;
						return false;
					}
				}

			    if(elemRadio.getAttribute("OpenEnd")=="true")
			    {
			        var OpenEndresult = ControlOpenEndObject(document.getElementById(elemRadio.getAttribute("OpenEndObj")));
			        if(OpenEndresult==false)
			        {
					alert("Diğer Kutucuğu İşaretlenmemiş")
			            document.getElementById(elemRadio.getAttribute("OpenEndObj")).focus();
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


    if(msg!="")
    {
        alert(msg)
        return false;
    }
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
        for (z = 0; z < radios.length; z++) {
            if (radios[z].checked) return radios[z];
        }
		return null;
}
function ControlAllRadio()
{
var str = "";
	for(i=0; i<document.form1.elements.length; i++)
	{
		if(document.form1.elements[i].type=="radio")
		{
			var elem = document.form1.elements[i];
			if(str.indexOf(','+elem.name)==-1)
			{
				str = str + ',' + elem.name;
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
