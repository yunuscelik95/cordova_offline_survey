var otherObj = [];
var otherValue = [];
var currentValue = [];
var expression = null;
var _objName ;
var MaximumAnswerLimit = 0;
var MinimumAnswerLimit = 0;

function contains(obj,item)
{
    var k=0;
    for(k=0;k<obj.length;k++)
    {
        if(obj[k]==item)
        {
            return k;
        }
    }
    return -1;
}

function onTextLostFocus()
{
	this.style.width = 150;
}
function onTextFocus()
{
	this.style.width = 500;
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
            var rtrn = true;
            obj.onclick = controlOther;
            if(obj.disabled==false)
                obj.onclick();
            if(!isOtherSetted)
            {
                _objName = obj.name;
                isOtherSetted = true;
            }
            
            if(!rtrn)
            {
                return;
            }
        }
         
        if(obj.type=="text")
        {
            obj.onblur = onTextLostFocus;
            obj.onfocus = onTextFocus;
        }
    }
    
    if(currentValue!=null)
    {
        for(i=0;i<otherValue.length;i++)
        {
            var arr = currentValue.toString().split(',');
            var oValue = otherValue[i];
            if(contains(arr,oValue)>-1)
                otherObj[i].disabled ='';
            else
                otherObj[i].disabled ='disabled';
        }
    }
    
    
    var objBtnNext = document.getElementById("form1");
    objBtnNext.onsubmit = CheckValues;
}


function controlOther(obj)
{
    var rObj = null;
    if(obj==null||obj==undefined||obj.type!="checkbox")
        rObj = this;
    else
        rObj = obj;
    
    if(rObj.disabled==true) return true;
    var attrResult = this.getAttribute("DeselectOther");
    if(attrResult!=null)
    {
        if(attrResult=="true")
        {

            DeselectOther(rObj);
        }
        else if(attrResult=="false" && this.checked)
        {
            // Normal seçenek seçildiğinde, deselectother=true olanları kaldır
            for(var d=0;d<document.forms[0].elements.length;d++)
            {
                var dObj = document.forms[0].elements[d];
                if(dObj.type=="checkbox" && dObj!=this && dObj.getAttribute("DeselectOther")=="true" && dObj.checked)
                {
                    dObj.checked = false;
                    removeItem(dObj);
                }
            }
        }
    }
    //alert(this.checked);
    if(this.checked)
    {
        removeItem(this);
        currentValue.push(this.value);
    }
    else
    {
        removeItem(this);
    }
    
    
    if(this.checked)
    {
        var index = contains(otherValue,this.value);
        if(index>-1)
        {
            otherObj[index].disabled='';
            otherObj[index].focus();
            otherObj[index].select();
        }
        else
        {
            
        }
    }
    else
    {
        var index = contains(otherValue,this.value);
        if(index>-1)
        {
           otherObj[index].disabled='disabled';
        }
    }

    return true;

}


function DeselectOther(obj)
{

    if(obj.checked)
    {
        for(i=0;i<document.forms[0].elements.length;i++)
        {
            var _obj = document.forms[0].elements[i];
            if(_obj.type=="checkbox" || _obj.type=="span")
            {
                if(obj!=_obj)
                {
                        _obj.checked = false;
                        var index = contains(otherValue,_obj.value);
                        if(index>-1)
                        {
                     
                            otherObj[index].disabled = 'disabled';
                            otherObj[index].value = '';
                         
                        }
                        _obj.disabled = 'disabled';
/*
                    }
                    else
                    {
                        var index = contains(otherValue,_obj.value);
                        if(index>-1)
                        {
                            if(_obj.checked)
                                otherObj[index].disabled = '';
                            else
                                otherObj[index].disabled = 'disabled';
                        }
                        _obj.disabled = '';
                    }
                    */
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
            if(_obj.type=="checkbox" || _obj.type=="span")
            {
                
                var index = contains(otherValue,_obj.value);
                if(index>-1)
                {
                    if(_obj.checked)
                        otherObj[index].disabled = '';
                    else
                        otherObj[index].disabled = 'disabled';
                }
                _obj.disabled = '';
            }       
        }
    }
}

function DeselectOtherItems(obj)
{
    for(i=0;i<document.forms[0].elements.length;i++)
    {
        var _obj = document.forms[0].elements[i];
        if(_obj.type=="checkbox")
        {
            if(obj!=_obj)
            {
                if(obj.checked)
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
                    document.title += _obj.value;
                    var index = contains(otherValue,_obj.value);
                    if(index>-1)
                    {
                        if(_obj.checked)
                            otherObj[index].disabled = '';
                        else
                            otherObj[index].disabled = 'disabled';
                    }
                    _obj.disabled = '';
                }
            }
        }
    }
}

function removeItem(obj)
{
    var j=0;
    for(j=0;j<currentValue.length;j++)
    {
        if(obj.value==currentValue[j])
        {
            currentValue.splice(j,1);
            return;
        }
    }
}


function CheckValues()
{
    var answerCount = 0;
    for(i=0;i<document.forms[0].elements.length;i++)
    {
        var obj = document.forms[0].elements[i];
        if(obj.type=="checkbox")
        {
            if(obj.checked==true)
            {
                answerCount++;
                var index = contains(otherValue,obj.value);
                if(index>-1)
                {
                    var exp = otherObj[index].getAttribute("Expression");
                    if(exp!=""&&exp!=null)
                    {
                       var expResult = new RegExp(exp);
                       if(!otherObj[index].value.match(expResult)) 
                       {
                            otherObj[index].focus();
                            alert(otherObj[index].getAttribute("ExpressionMessage"));
                            submitted = false;
                            return false;
                       }
                    }
                    if(otherObj[index].value==""&&obj.disabled=="")
                    {
                        alert('Diğer kutucuğunu boş bıraktınız');
                        submitted = false;
                        otherObj[index].focus();
                        return false;
                    }
                }
            }
            else
            {
                
            }
        }
    }
    
    if(MaximumAnswerLimit>0)
    {
        if(MaximumAnswerLimit<answerCount)
        {
            alert('Maximum cevap sayısını aştınız. Maximum cevap sayısı : ' + MaximumAnswerLimit.toString());
            submitted = false;
            return false;
        }
    }
    
    
    if(MinimumAnswerLimit>0)
    {
        if(MinimumAnswerLimit>answerCount)
        {
            alert('En az "' + MinimumAnswerLimit.toString() + '" adet cevap girmelisiniz');
            submitted = false;
            return false;
        }
    }
    
    return true;
}

function ControlSingleResponse()
{
    
}