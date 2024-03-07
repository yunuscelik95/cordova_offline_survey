var otherObj = null;
var otherValue = 0;
var currentValue = null;
var _objName ;

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
            if(!isOtherSetted)
            {
                _objName = obj.name;
                otherObj.onclick = function()
                {
                    document.getElementById(_objName + '_' + otherValue.toString()).checked=true;
                }
                otherObj.onfocus = function()
                {
                    document.getElementById(_objName + '_' + otherValue.toString()).checked=true;
                }
                isOtherSetted = true;
            }
        }
    }
    
    if(currentValue!=otherValue) otherObj.disabled = 'disabled';
    
    var objBtnNext = document.getElementById("form1");
    objBtnNext.onsubmit = CheckValues;
}

function controlOther(obj)
{
    var rObj = null;
	rObj = this
    if(rObj.type!="radio")
        rObj = obj;

    currentValue = rObj.value;
    
    if(otherValue!=rObj.value)
    {
        otherObj.disabled='disabled';
    }
    else
    {
        otherObj.disabled='';
        otherObj.focus();
        otherObj.select();
    }
}

function CheckValues()
{
    if(otherObj.disabled !='disabled')
    {
        if(currentValue==otherValue)
        {
            var exp = otherObj.getAttribute("Expression");
            if(exp!=""&&exp!=null)
            {
               var expResult = new RegExp(exp);
               if(!otherObj.value.match(expResult)) 
               {
                    otherObj.focus();
                    alert(otherObj.getAttribute("ExpressionMessage"));
                    submitted = false;
                    return false;
               }
            }
            if(otherObj.value=="")
            {
                alert("İşaretlenen text kutucuğunu boş bıraktınız");
                otherObj.focus();
                submitted = false;
                return false;
            }
        }
    }
    
    if(currentValue==null)
    {
        alert("Bir seçim yapmalısınız");
        submitted = false;
        
        return false;
    }
    submitted = true;
    return true;
}

function ControlSingleResponse()
{
    
}
