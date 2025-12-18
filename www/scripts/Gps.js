function gps(kolon) {
    var options = {
        maximumAge: 0,
        enableHighAccuracy: true,
        timeout: 45000
    };

    console.log("GPS fonksiyonu çağrıldı, kolon: " + kolon);
    
    // İzin kontrolü yap
    checkPermissions(kolon);

    function checkPermissions(kolon) {
        console.log("İzin kontrolü başladı");
        var permissions = cordova.plugins.permissions;
        var permissionsList = [
            permissions.ACCESS_FINE_LOCATION,
            permissions.ACCESS_COARSE_LOCATION
        ];

        permissions.checkPermission(permissions.ACCESS_FINE_LOCATION, function(status) {
            console.log("ACCESS_FINE_LOCATION izin durumu:", status.hasPermission);
            if (status.hasPermission) {
                console.log("İzinler tamam, konum alınıyor");
                getCurrentLocation(kolon);
            } else {
                console.log("İzin yok, izin isteniyor");
                permissions.requestPermissions(permissionsList, 
                    function(status) {
                        console.log("İzin talebi sonucu:", status);
                        if (status.hasPermission) {
                            console.log("İzin verildi, konum alınıyor");
                            getCurrentLocation(kolon);
                        } else {
                            console.error("İzin reddedildi!");
                            alert("Konum izni gerekli!");
                        }
                    },
                    function() {
                        console.error("İzin talebi hatası");
                    }
                );
            }
        }, function() {
            console.error("İzin kontrolü hatası");
        });
    }

    function getCurrentLocation(kolon) {
        console.log("getCurrentLocation başladı - watchPosition kullanılıyor");
        
        var watchId = navigator.geolocation.watchPosition(
            function(position) {
                console.log("✓ SUCCESS! LAT: " + position.coords.latitude + ", LON: " + position.coords.longitude);
                navigator.geolocation.clearWatch(watchId);
                onSucces(position, kolon);
            },
            function(error) {
                console.log("✗ ERROR! Kod: " + error.code + ", Mesaj: " + error.message);
                navigator.geolocation.clearWatch(watchId);
                onErrror(error);
            },
            options
        );
        
        console.log("watchPosition başlatıldı, ID: " + watchId);
    }

    function onSucces(position, kolon) {
        // Ekranda başarı mesajı göster
        var statusDiv = document.getElementById('gpsStatus');
        if (statusDiv) {
            statusDiv.style.backgroundColor = '#D4EDDA';
            statusDiv.style.borderColor = '#28A745';
            statusDiv.innerHTML = '✅ Konum alındı! Ankete devam edebilirsiniz.';
            setTimeout(function() {
                statusDiv.style.display = 'none';
            }, 3000);
        }
        
        if (kolon == "start") {
            myUpdate("INTERVIEWS", "startlatitude=" + position.coords.latitude + ",startlongitude=" + position.coords.longitude, " InterviewID=" + window.localStorage["InterviewID"]);
        } else {
            myUpdate("INTERVIEWS", "stoplatitude=" + position.coords.latitude + ",stoplongitude=" + position.coords.longitude, " InterviewID=" + window.localStorage["InterviewID"]);
        }
    }

    function onErrror(error) {
        console.error("Koordinat alınamadı: " + error.message + " Kodu: " + error.code);
        
        // Ekranda hata mesajı göster
        var statusDiv = document.getElementById('gpsStatus');
        if (statusDiv) {
            statusDiv.style.backgroundColor = '#F8D7DA';
            statusDiv.style.borderColor = '#DC3545';
        }
        
        if (error.code == 1) {
            // İzin reddedildi
            if (statusDiv) statusDiv.innerHTML = '❌ Konum izni reddedildi! Uygulama ayarlarından konum iznini açın.';
            alert("Konum izni reddedildi! Uygulama ayarlarından konum iznini açın.");
        } else if (error.code == 2) {
            // GPS kapalı veya konum alınamıyor
            if (statusDiv) statusDiv.innerHTML = '❌ GPS kapalı! Lütfen GPS\'i açın.';
            alert("GPS kapalı! Lütfen GPS'i açın.");
            if (cordova.plugins.diagnostic) {
                cordova.plugins.diagnostic.switchToLocationSettings();
            }
        } else if (error.code == 3) {
            // Timeout
            if (statusDiv) statusDiv.innerHTML = '❌ Konum alınamadı! Sinyal iyi olan yere geçin ve sayfayı yenileyin.';
            alert("Konum alınamadı (zaman aşımı). GPS sinyali zayıf olabilir, açık alana çıkın.");
        }
    }
}
