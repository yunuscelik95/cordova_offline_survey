/// <reference path="jquery-1.9.1.js" />
/// <reference path="Helper.js" />

var otherObj = [];
var otherValue = [];
var currentValue = [];
var expression = null;
var _objName ;
var MaximumAnswerChoiceLimit = 0;
var MinimumAnswerChoiceLimit = 0;
var MaximumAnswerSerialLimit = 0;
var MinimumAnswerSerialLimit = 0;

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

function SetQuestionText()
{
   // alert("İşlem Tamam");

}

function SetStartUp()
{
    var elem = $("#QuestionTable>tbody>tr:first");
    var QuestionOrder = "";
    $.each(elem.children(), function (i, slaveValue) {
       
        if ($(this).html() != "" && $(this).html() != "&nbsp;")
        {
            if (QuestionOrder != "") QuestionOrder += ",";
            QuestionOrder += $(this).html()
        }
       
    });

    $.ajax({
        type: "POST",
        url: "AjaxPage.aspx/SetQuestionText",
        data: "{'QuestionText':'" + QuestionOrder + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: SetQuestionText,
        error: function (e) {
            alert("Error in caling serice." + e.responseText);
        }
    });



    var i=0;
    var isOtherSetted = false;
	
    for(i=0;i<document.forms[0].elements.length;i++)
    {
        var obj = document.forms[0].elements[i];

         
        if(obj.type=="text")
        {
          //  obj.onblur = onTextLostFocus;
          //  obj.onfocus = onTextFocus;
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


function CheckValues()
{
    var answerCount = 0;
	var str="";
		
    for(i=0;i<document.forms[0].elements.length;i++)
    {
        var obj = document.forms[0].elements[i];
        if(obj.type=="text")
        {  
    		 var elem = document.forms[0].elements[i];
			if(str.indexOf(','+elem.name+ ',')==-1)
			{

				str = str + ',' + elem.name + ',';
				var checkedObj = getValue(elem.name);

				if (checkedObj!=null)
                /*var index = contains(otherValue,obj.value);
                if(index>-1)
                {*/
					if (checkedObj==-1)
					{
						alert("Maksimum sayıyı aştınız!");
						return false;
					}
					else if (checkedObj==-2)
					{
						alert("Lütfen Minumum " + MinimumAnswerChoiceLimit.toString()  + " cevap giriniz!");
						return false;
					}
					else if (checkedObj==-3)
					{    
						var mesaj=elem.getAttribute("ExpressionMessage");
						if(mesaj!=null && mesaj!="")
						{
							alert(elem.getAttribute("ExpressionMessage"));
						}
						else
						{
							alert("Kural Dışı Giriş");
						}
						return false;
					}
					else if (checkedObj!=null)
					{
						answerCount++; 
					}
                }
	    
				
            }
            else
            {
                
            }
        }

    if(MaximumAnswerSerialLimit>0)
    {
        if(MaximumAnswerSerialLimit<answerCount)
        {
            alert('Maximum cevap sayısını aştınız. Maximum cevap sayısı : ' + MaximumAnswerSerialLimit.toString());
            submitted = false;
            return false;
        }
    }
    
    
    if(MinimumAnswerSerialLimit>0)
    {
        if(MinimumAnswerSerialLimit>answerCount)
        {
            alert('En az "' + MinimumAnswerSerialLimit.toString() + '" adet cevap girmelisiniz');
            submitted = false;
            return false;
        }
    }
    
    return true;
}


function getValue(elemName)
{
    choiceAnswer = 0;
    choices = document.getElementById(elemName).parentNode.parentNode.children;
        for (i = 1; i < choices.length; i++) {
			if (choices[i].childNodes[0].type=="text")
			{
				var textObject=choices[i].childNodes[0];
					if (textObject.value!="") 
					{
						choiceAnswer++;
					}
				
					var exp = textObject.getAttribute("Expression");
				
					if(exp!=""&&exp!=null)
					{
					   var expResult = new RegExp(exp);
					   if(!textObject.value.match(expResult)) 
					   {
							choices[i].focus();
							return -3
					   }
					}
			}
		
		}

				if (MaximumAnswerChoiceLimit>0)
				{
					if (choiceAnswer>MaximumAnswerChoiceLimit)
					{
						return -1;	
					}
				}
				
				if (MinimumAnswerChoiceLimit>0)
				{

					if (choiceAnswer<MinimumAnswerChoiceLimit)
					{
						return -2;	
					}
				}

				if (choiceAnswer>0)
				{
					return choiceAnswer;
				}

		return null;
}
