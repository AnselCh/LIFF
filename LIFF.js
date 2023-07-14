window.onload = function () {
            const defaultLiffId = '2000117491-n9LMKPA8';
            $(document).ready(function () {
                liffInit(defaultLiffId);
            });
        }
        function liffInit(liffId) {
            // withLoginOnExternalBrowser : true 時代表 auto login 啟動，LIFF 初始化後會自動呼叫 liff.login 登入。
            liff.init({ liffId: liffId, withLoginOnExternalBrowser: true }).then(() => {
                $("#os").text(liff.getOS());
                $("#language").text(liff.getLanguage());
                $("#version").text(liff.getVersion());
                $("#lineVersion").text(liff.getLineVersion());
                $("#isInClient").text(liff.isInClient());

                // 取得一般的 user profile
                liff.getProfile().then(function (profile) {
                    console.log(profile);
                    $("#user_avatar").attr("src", profile.pictureUrl);
                    $("#user_name").text('姓名 : ' + profile.displayName);
                    $("#user_id").text('使用者ID : ' + profile.userId);
                    $("#user_status").text('狀態文字 : ' + profile.statusMessage);
                });

                // 取得包在 id token 內的 user profile
                const idTokenProfile = liff.getDecodedIDToken()
                console.log(idTokenProfile);
                $("#idToken_user_avatar").attr("src", idTokenProfile.picture);
                $("#idToken_user_name").text(idTokenProfile.name);
                $("#idToken_user_email").text(idTokenProfile.email);
                $("#iss").text(idTokenProfile.iss);
                $("#sub").text(idTokenProfile.sub);
                $("#aud").text(idTokenProfile.aud);
                $("#exp").text(idTokenProfile.exp);
                $("#iat").text(idTokenProfile.iat);
                $("#amr").text(idTokenProfile.amr);
            }).catch((err) => {
                console.log(err.code, err.message);
            })
        }

        function openQRCodeReader() {
            liff
                .scanCodeV2()
                .then((result) => {
                    $("#qrcode_string").text(result.value);
                })
                .catch((error) => {
                    $("#qrcode_string").text(error);
                    console.log("error", error);
                });
        }

        function sendMessage() {
            message = JSON.parse(`{
                "type" : "text",
                "text" : "LIFF 傳送訊息"
            }`)
            liff
                .sendMessages([
                    message
                ])
                .then(() => {
                    console.log("message sent");
                })
                .catch((err) => {
                    $("#qrcode_string").text(error);
                    console.log("error", err);
                });
        }

        function shareTargetPicker() {
            if (!liff.isApiAvailable('shareTargetPicker')) {
                console.log("請檢查 Line 版本是否為 10.3.0 以上")
                return;
            }
            message = JSON.parse(`{
                "type" : "text",
                "text" : "LIFF ShareTargetPicker 分享訊息"
            }`)
            liff.shareTargetPicker([message], { isMultiple: true, });
        }
