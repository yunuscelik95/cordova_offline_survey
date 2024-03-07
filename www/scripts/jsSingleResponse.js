var currentValue = null;

function SetStartUp() {
    var i = 0;
    var isOtherSetted = false;
    for (i = 0; i < document.forms[0].elements.length; i++) {
        var obj = document.forms[0].elements[i];
        if (obj.type == "radio") {
            obj.onclick = setValue;
        }
    }

 
}

function CheckValues() {

    if (currentValue == null) {
        alert("Bir seçim yapmalısınız");
        submitted = false;
        return false;
    }
    return true;
}

function setValue(obj) {
    currentValue = this.value;
}