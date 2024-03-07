function gps(kolon) {
    var options = {
        maximumAge: 0,
        enableHighAccuracy: true,
        timeout: 10000
    };

    cordova.plugins.diagnostic.isLocationEnabled(function(enabled) {
        if (enabled) {

    cordova.plugins.diagnostic.getLocationAuthorizationStatus(function(status) {
        if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED) {
            // İzin daha önce verildiyse, konumu al
            getCurrentLocation(kolon);
        } else {
            // İzin daha önce verilmediyse, GPS'i kontrol et
            requestLocationPermission();
        }
    }, function(error) {
        console.error("Permission check error: " + error);
    });
  } else {
        // Konum servisi kapalı, kullanıcıyı konum servisini açmaya yönlendir
        // cordova.plugins.diagnostic.switchToLocationSettings();
        checkGPS();
    }
}, function(error) {
    console.error("Konum servisi durumu kontrol edilemedi. Hata: " + error);
});


    function checkGPS() {
        cordova.plugins.diagnostic.isLocationAvailable(function(available) {
            if (available) {
                // GPS açık, izin ekranını göster
                requestLocationPermission();
            } else {
                
                cordova.plugins.diagnostic.switchToLocationSettings();
            }
        }, function(error) {
            if (error.code == 3) {
                console.error("Location not available. Switching to location settings.");
                cordova.plugins.diagnostic.switchToLocationSettings();
            }
        });
    }

    function requestLocationPermission() {
        var permissions = cordova.plugins.permissions;

        permissions.hasPermission(permissions.ACCESS_FINE_LOCATION, function(status) {
            if (status.hasPermission) {
                // İzin zaten varsa konumu al
                getCurrentLocation(kolon);
            } else {
                // İzin yoksa izin talep et
                permissions.requestPermission(
                    permissions.ACCESS_FINE_LOCATION,
                    function(status) {
                        if (status.hasPermission) {
                            // İzin alındıysa konumu al
                            getCurrentLocation(kolon);
                        } else {
                            // Kullanıcı izni reddetti
                            console.warn('Konum izni reddedildi.');
                            checkGPS(); // İzin reddedildiyse tekrar kontrol et
                        }
                    },
                    function() {
                        console.error('Konum izni talebi sırasında bir hata oluştu.');
                    }
                );
            }
        });
    }

    function getCurrentLocation(kolon) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                // Konumu başarıyla aldıktan sonra yapılacak işlemler
                onSucces(position, kolon);
            },
            function(error) {
                onErrror(error);
            },
            options
        );
    }

    function onSucces(position, kolon) {
        if (kolon == "start") {
            myUpdate("INTERVIEWS", "startlatitude=" + position.coords.latitude + ",startlongitude=" + position.coords.longitude, " InterviewID=" + window.localStorage["InterviewID"]);
        } else {
            myUpdate("INTERVIEWS", "stoplatitude=" + position.coords.latitude + ",stoplongitude=" + position.coords.longitude, " InterviewID=" + window.localStorage["InterviewID"]);
        }
    }

    function onErrror(error) {
        console.error("Koordinat alınamadı: " + error.message + " Kodu: " + error.code);
        if (error.code == 3) {
            console.error("GPS bağlantınız kapalı. Lütfen GPS bağlantınızı açın.");
            cordova.plugins.diagnostic.switchToLocationSettings();
        }
    }
}
