let fnc = `

    function searchQ(name) {
        let elem = jsques.filter(x => x.num == name)[0];
        return elem;
    }

    function arrInn(value, searchValue)
        {
            for (var i = 0; i < value.length; i++) {
                if (value[i] == searchValue) {
                    return true;
                }
            }
            return false;
        }

        function inn(value, searchValue)
        {
            alert(value);
            var arr = value.split(",");
            for (var i = 0; i < value.length; i++) {
                if (arr[i] == searchValue) {
                    return true;
                }
            }
            return false;
        }
`;
eval(fnc);